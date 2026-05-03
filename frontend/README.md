# PDF Highlighter

Ferramenta para marcação automática de extratos bancários em PDF.

## O que é

Sistema web que permite fazer upload de um extrato em PDF, definir grupos de palavras-chave com cores personalizadas, e receber o PDF com as linhas correspondentes destacadas — como um marca-texto — junto com um relatório financeiro por grupo.

## O que entrega

- **PDF marcado** — com highlight colorido nas linhas que correspondem a cada grupo
- **Relatório Excel** — com resumo de créditos, débitos e saldo líquido por grupo, e detalhe de cada linha encontrada

## Como usar

1. Acesse o sistema
2. Faça upload do extrato em PDF
3. Crie grupos de busca — defina um nome, uma cor e as palavras-chave de cada grupo (ex: grupo "Entradas" com keywords "Crédito, PIX, Entrada")
4. Clique em **Processar PDF**
5. Baixe o PDF marcado e/ou o relatório Excel

## Observações

- Funciona com PDFs que contenham texto selecionável — PDFs escaneados (foto) não são suportados
- O sistema não armazena nenhum arquivo — o PDF é processado e descartado imediatamente
- Valores sem sinal explícito no extrato são sinalizados no relatório Excel para conferência manual

## Stack

- **Backend:** Python + FastAPI + PyMuPDF + OpenPyXL
- **Frontend:** React + TypeScript + Vite + Tailwind CSS
- **Deploy:** Render (backend) + Vercel (frontend)

## Como rodar localmente

### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload
```

Sobe em `http://localhost:8000`

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Sobe em `http://localhost:5173`

## Estrutura

```
pdf-highlighter/
├── backend/
│   ├── main.py          # API FastAPI
│   ├── processor.py     # Lógica de PDF e Excel
│   └── requirements.txt
└── frontend/
    └── src/
        ├── App.tsx
        ├── components/
        │   ├── Upload.tsx
        │   ├── Config.tsx
        │   ├── Report.tsx
        │   ├── PdfViewer.tsx
        │   └── ProgressBar.tsx
        └── utils/
            └── format.ts
```