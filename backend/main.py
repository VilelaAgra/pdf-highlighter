from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
import base64
import json

from processor import processar_pdf, gerar_excel

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def health():
    return {"status": "ok"}

@app.post("/process")
async def process(
        file: UploadFile = File(...),
        filtros: str = Form(...)
):
    pdf_bytes = await file.read()
    lista_filtros = json.loads(filtros)

    pdf_marcado, relatorio = processar_pdf(pdf_bytes, lista_filtros)
    excel_bytes = gerar_excel(relatorio)

    return {
        "relatorio": relatorio,
        "pdf_base64": base64.b64encode(pdf_marcado).decode("utf-8"),
        "excel_base64": base64.b64encode(excel_bytes).decode("utf-8")
    }