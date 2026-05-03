import { formatarMoeda } from "../utils/format"

interface Linha {
    pagina: number
    texto: string
    valor_detectado: number | null
    sinal_inferido: boolean
}

interface Grupo {
    total: number
    soma: number
    total_creditos: number
    total_debitos: number
    cor: string
    linhas: Linha[]
}

interface Relatorio {
    total_linhas_marcadas: number
    paginas_afetadas: number[]
    soma_valores: number
    grupos: Record<string, Grupo>
}

interface Props {
    relatorio: Relatorio
    pdfBase64: string
    excelBase64: string
}

function baixarArquivo(base64: string, nome: string, tipo: string) {
    const bytes = atob(base64)
    const arr = new Uint8Array(bytes.length)
    for (let i = 0; i < bytes.length; i++) arr[i] = bytes.charCodeAt(i)
    const blob = new Blob([arr], { type: tipo })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = nome
    a.click()
    URL.revokeObjectURL(url)
}

export default function Report({ relatorio, pdfBase64, excelBase64 }: Props) {
    const totalInferidos = Object.values(relatorio.grupos)
        .flatMap(g => g.linhas)
        .filter(l => l.sinal_inferido).length

    return (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-base font-semibold text-gray-800 mb-1">Resumo</h2>
            <p className="text-xs text-gray-400 mb-5">
                {relatorio.total_linhas_marcadas} linhas marcadas em {relatorio.paginas_afetadas.length} página(s)
            </p>

            {totalInferidos > 0 && (
                <div className="flex items-start gap-2 bg-yellow-50 border border-yellow-200 rounded-lg px-4 py-3 mb-5">
                    <span className="text-yellow-500 text-sm">⚠️</span>
                    <p className="text-xs text-yellow-700">
                        <strong>{totalInferidos} linha{totalInferidos > 1 ? "s" : ""}</strong> sem sinal explícito de crédito/débito. O valor foi capturado mas pode estar incorreto — verifique no relatório Excel.
                    </p>
                </div>
            )}

            <div className="space-y-3 mb-6">
                {Object.entries(relatorio.grupos).map(([label, grupo]) => (
                    <div
                        key={label}
                        className="rounded-lg border border-gray-100 overflow-hidden"
                        style={{ borderLeftWidth: 4, borderLeftColor: grupo.cor }}
                    >
                        <div className="flex items-center justify-between px-4 py-3">
                            <div>
                                <p className="text-sm font-medium text-gray-700">{label}</p>
                                <p className="text-xs text-gray-400">{grupo.total} linha{grupo.total !== 1 ? "s" : ""}</p>
                            </div>
                            <p className={`text-sm font-semibold ${grupo.soma >= 0 ? "text-green-600" : "text-red-500"}`}>
                                {formatarMoeda(grupo.soma)}
                            </p>
                        </div>

                        {(grupo.total_creditos > 0 || grupo.total_debitos < 0) && (
                            <div className="flex border-t border-gray-100">
                                <div className="flex-1 px-4 py-2 bg-gray-50">
                                    <p className="text-xs text-gray-400">Créditos</p>
                                    <p className="text-xs font-medium text-green-600">{formatarMoeda(grupo.total_creditos)}</p>
                                </div>
                                <div className="flex-1 px-4 py-2 bg-gray-50 border-l border-gray-100">
                                    <p className="text-xs text-gray-400">Débitos</p>
                                    <p className="text-xs font-medium text-red-500">{formatarMoeda(grupo.total_debitos)}</p>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {relatorio.soma_valores !== 0 && (
                <div className="flex justify-between items-center border-t border-gray-100 pt-4 mb-6">
                    <p className="text-sm text-gray-500">Saldo líquido geral</p>
                    <p className={`text-sm font-semibold ${relatorio.soma_valores >= 0 ? "text-green-600" : "text-red-500"}`}>
                        {formatarMoeda(relatorio.soma_valores)}
                    </p>
                </div>
            )}

            <div className="flex gap-3">
                <button
                    onClick={() => baixarArquivo(pdfBase64, "extrato_marcado.pdf", "application/pdf")}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2.5 rounded-lg transition-colors cursor-pointer"
                >
                    Baixar PDF marcado
                </button>
                <button
                    onClick={() => baixarArquivo(excelBase64, "relatorio.xlsx", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white text-sm font-medium py-2.5 rounded-lg transition-colors cursor-pointer"
                >
                    Baixar relatório Excel
                </button>
            </div>
        </div>
    )
}