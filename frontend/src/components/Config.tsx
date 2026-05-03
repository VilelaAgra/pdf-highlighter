import { useState } from "react"
import type { Filtro } from "../types"

interface Props {
    nomeArquivo: string
    onProcessar: (filtros: Filtro[]) => void
    carregando: boolean
    onTrocarArquivo: () => void
}

const CORES_PADRAO = ["#FFEB3B", "#4CAF50", "#F44336", "#2196F3", "#FF9800"]

export default function Config({ nomeArquivo, onProcessar, carregando, onTrocarArquivo }: Props) {
    const [filtros, setFiltros] = useState<Filtro[]>([
        { label: "Grupo 1", keywords: "", cor: CORES_PADRAO[0] }
    ])

    function adicionarFiltro() {
        if (filtros.length >= 5) return
        setFiltros([...filtros, {
            label: `Grupo ${filtros.length + 1}`,
            keywords: "",
            cor: CORES_PADRAO[filtros.length]
        }])
    }

    function removerFiltro(index: number) {
        setFiltros(filtros.filter((_, i) => i !== index))
    }

    function atualizarFiltro(index: number, campo: keyof Filtro, valor: string) {
        const novos = [...filtros]
        novos[index] = { ...novos[index], [campo]: valor }
        setFiltros(novos)
    }

    function handleProcessar() {
        const validos = filtros.filter(f => f.keywords.trim())
        onProcessar(validos)
    }

    const podeProcessar = filtros.some(f => f.keywords.trim()) && !carregando

    return (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <p className="text-xs text-gray-400 mb-1">Arquivo selecionado</p>
                    <p className="text-sm font-medium text-gray-700">{nomeArquivo}</p>
                </div>
                <button onClick={onTrocarArquivo} className="text-xs text-gray-400 hover:text-gray-600 underline">
                    Trocar arquivo
                </button>
            </div>

            <div className="space-y-4 mb-4">
                {filtros.map((filtro, i) => (
                    <div key={i} className="border border-gray-100 rounded-lg p-4">
                        <div className="flex items-center gap-3 mb-3">
                            <input
                                type="color"
                                value={filtro.cor}
                                onChange={(e) => atualizarFiltro(i, "cor", e.target.value)}
                                className="w-8 h-8 rounded cursor-pointer border border-gray-200"
                                title="Cor do highlight"
                            />
                            <input
                                type="text"
                                value={filtro.label}
                                onChange={(e) => atualizarFiltro(i, "label", e.target.value)}
                                placeholder="Nome do grupo"
                                className="flex-1 border border-gray-200 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            {filtros.length > 1 && (
                                <button
                                    onClick={() => removerFiltro(i)}
                                    className="text-gray-300 hover:text-red-400 text-lg leading-none"
                                >
                                    ×
                                </button>
                            )}
                        </div>
                        <input
                            type="text"
                            value={filtro.keywords}
                            onChange={(e) => atualizarFiltro(i, "keywords", e.target.value)}
                            placeholder="Palavras-chave separadas por vírgula"
                            className="w-full border border-gray-200 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                ))}
            </div>

            {filtros.length < 5 && (
                <button
                    onClick={adicionarFiltro}
                    className="w-full border border-dashed border-gray-300 text-gray-400 hover:text-gray-600 hover:border-gray-400 rounded-lg py-2 text-sm transition-colors mb-6"
                >
                    + Adicionar grupo
                </button>
            )}

            <button
                onClick={handleProcessar}
                disabled={!podeProcessar}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white text-sm font-medium py-2.5 rounded-lg transition-colors cursor-pointer disabled:cursor-not-allowed"
            >
                {carregando ? "Processando..." : "Processar PDF"}
            </button>
        </div>
    )
}