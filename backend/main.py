import base64
import json
import logging
import os
import re

import fitz
from fastapi import FastAPI, HTTPException, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, field_validator

from processor import processar_pdf, gerar_excel

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

_ALLOWED_ORIGINS = os.getenv("ALLOWED_ORIGINS", "http://localhost:5173").split(",")
_MAX_PDF_BYTES = int(os.getenv("MAX_PDF_SIZE_MB", "20")) * 1024 * 1024

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=_ALLOWED_ORIGINS,
    allow_methods=["GET", "POST"],
    allow_headers=["Content-Type"],
)


class FiltroSchema(BaseModel):
    label: str
    keywords: list[str]
    cor: str

    @field_validator("label")
    @classmethod
    def validar_label(cls, v: str) -> str:
        v = v.strip()
        if not v:
            raise ValueError("Label não pode ser vazio")
        return v

    @field_validator("keywords")
    @classmethod
    def validar_keywords(cls, v: list[str]) -> list[str]:
        limpos = [kw.strip() for kw in v if kw.strip()]
        if not limpos:
            raise ValueError("Deve ter ao menos uma keyword")
        return limpos

    @field_validator("cor")
    @classmethod
    def validar_cor(cls, v: str) -> str:
        if not re.fullmatch(r"#[0-9a-fA-F]{6}", v):
            raise ValueError(f"Cor inválida: {v!r}")
        return v


@app.get("/")
def health():
    return {"status": "ok"}


@app.post("/process")
async def process(
    file: UploadFile = File(...),
    filtros: str = Form(...),
):
    if file.content_type != "application/pdf":
        raise HTTPException(415, "Apenas arquivos PDF são aceitos")

    pdf_bytes = await file.read(_MAX_PDF_BYTES + 1)
    if len(pdf_bytes) > _MAX_PDF_BYTES:
        raise HTTPException(413, f"PDF muito grande. Limite: {_MAX_PDF_BYTES // (1024 * 1024)} MB")

    try:
        raw = json.loads(filtros)
        lista_filtros = [FiltroSchema(**f).model_dump() for f in raw]
    except (json.JSONDecodeError, TypeError):
        raise HTTPException(400, "Formato de filtros inválido")
    except Exception as exc:
        raise HTTPException(422, f"Filtros inválidos: {exc}")

    try:
        pdf_marcado, relatorio = processar_pdf(pdf_bytes, lista_filtros)
        excel_bytes = gerar_excel(relatorio)
    except fitz.FileDataError:
        raise HTTPException(422, "PDF corrompido ou inválido")
    except Exception:
        logger.exception("Erro ao processar PDF")
        raise HTTPException(500, "Erro interno ao processar o arquivo")

    return {
        "relatorio": relatorio,
        "pdf_base64": base64.b64encode(pdf_marcado).decode("utf-8"),
        "excel_base64": base64.b64encode(excel_bytes).decode("utf-8"),
    }
