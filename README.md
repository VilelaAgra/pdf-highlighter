# PDF Highlighter

Sistema para marcação automática de extratos bancários em PDF.

## O que faz

- Upload de PDF (extratos bancários)
- Configuração de grupos com palavras-chave e cores personalizadas
- Marca as linhas correspondentes com highlight colorido
- Gera relatório com créditos, débitos e saldo líquido por grupo
- Exporta PDF marcado e relatório em Excel

## Stack

- **Backend:** Python + FastAPI + PyMuPDF + OpenPyXL
- **Frontend:** React + TypeScript + Vite + Tailwind CSS

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
        │   └── PdfViewer.tsx
        └── utils/
            └── format.ts
```