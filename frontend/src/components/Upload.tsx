interface Props {
    onArquivo: (file: File) => void
}

export default function Upload({ onArquivo }: Props) {
    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0]
        if (file && file.type === "application/pdf") onArquivo(file)
    }

    function handleDrop(e: React.DragEvent<HTMLDivElement>) {
        e.preventDefault()
        const file = e.dataTransfer.files?.[0]
        if (file && file.type === "application/pdf") onArquivo(file)
    }

    return (
        <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            onClick={() => document.getElementById("file-input")?.click()}
            className="border-2 border-dashed border-gray-300 rounded-xl p-16 text-center cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-colors"
        >
            <p className="text-gray-500 text-sm">Arraste o PDF aqui ou clique para selecionar</p>
            <p className="text-gray-400 text-xs mt-1">Somente arquivos .pdf</p>
            <input
                id="file-input"
                type="file"
                accept="application/pdf"
                className="hidden"
                onChange={handleChange}
            />
        </div>
    )
}