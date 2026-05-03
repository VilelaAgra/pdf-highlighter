import { useState } from "react"
import Upload from "./components/Upload"
import Config from "./components/Config"
import Report from "./components/Report"
import PdfViewer from "./components/PdfViewer"
import ProgressBar from "./components/ProgressBar"
import type { Filtro } from "./types"

interface Resultado {
    relatorio: {
        total_linhas_marcadas: number
        paginas_afetadas: number[]
        soma_valores: number
        grupos: Record<string, {
            total: number
            soma: number
            total_creditos: number
            total_debitos: number
            cor: string
            linhas: {
                pagina: number
                texto: string
                valor_detectado: number | null
                sinal_inferido: boolean
            }[]
        }>
    }
    pdf_base64: string
    excel_base64: string
}

export default function App() {
    const [arquivo, setArquivo] = useState<File | null>(null)
    const [resultado, setResultado] = useState<Resultado | null>(null)
    const [carregando, setCarregando] = useState(false)
    const [erro, setErro] = useState<string | null>(null)

    async function processar(filtros: Filtro[]) {
        if (!arquivo) return
        setCarregando(true)
        setErro(null)

        const form = new FormData()
        form.append("file", arquivo)
        form.append("filtros", JSON.stringify(
            filtros.map(f => ({
                label: f.label,
                keywords: f.keywords.split(",").map(k => k.trim()).filter(Boolean),
                cor: f.cor
            }))
        ))

        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/process`, {
                method: "POST",
                body: form,
            })
            if (!res.ok) {
                const body = await res.json().catch(() => null)
                throw new Error(body?.detail ?? `Erro ${res.status} ao processar o PDF`)
            }
            const data: Resultado = await res.json()
            setResultado(data)
        } catch (e: unknown) {
            setErro(e instanceof Error ? e.message : "Erro desconhecido")
        } finally {
            setCarregando(false)
        }
    }

    function reiniciar() {
        setArquivo(null)
        setResultado(null)
        setErro(null)
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <ProgressBar ativo={carregando} />
            <div className="max-w-2xl mx-auto px-4 py-12">
                <div className="mb-8">
                    <h1 className="text-2xl font-semibold text-gray-900">Marcador de Extratos PDF</h1>
                    <p className="text-sm text-gray-400 mt-1">Faça upload de um extrato, defina os grupos e baixe o PDF marcado.</p>
                </div>

                {!arquivo && <Upload onArquivo={setArquivo} />}

                {arquivo && !resultado && (
                    <Config
                        nomeArquivo={arquivo.name}
                        onProcessar={processar}
                        carregando={carregando}
                        onTrocarArquivo={reiniciar}
                    />
                )}

                {erro && (
                    <p className="mt-4 text-sm text-red-500 bg-red-50 px-4 py-3 rounded-lg">{erro}</p>
                )}

                {resultado && (
                    <div className="space-y-6">
                        <Report
                            relatorio={resultado.relatorio}
                            pdfBase64={resultado.pdf_base64}
                            excelBase64={resultado.excel_base64}
                        />
                        <PdfViewer pdfBase64={resultado.pdf_base64} />
                        <button
                            onClick={reiniciar}
                            className="w-full flex items-center justify-center gap-2 border border-gray-300 hover:border-gray-400 hover:bg-gray-50 text-gray-600 hover:text-gray-800 text-sm font-medium py-3 rounded-lg transition-colors cursor-pointer">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
                                <path d="M3 3v5h5"/>
                            </svg>
                            Processar outro PDF
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}