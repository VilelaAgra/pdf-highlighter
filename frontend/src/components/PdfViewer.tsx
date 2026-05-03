import { useEffect, useState } from "react"

interface Props {
    pdfBase64: string
}

export default function PdfViewer({ pdfBase64 }: Props) {
    const [url, setUrl] = useState<string | null>(null)

    useEffect(() => {
        const bytes = atob(pdfBase64)
        const arr = new Uint8Array(bytes.length)
        for (let i = 0; i < bytes.length; i++) arr[i] = bytes.charCodeAt(i)
        const blob = new Blob([arr], { type: "application/pdf" })
        const objectUrl = URL.createObjectURL(blob)
        setUrl(objectUrl)

        return () => URL.revokeObjectURL(objectUrl)
    }, [pdfBase64])

    if (!url) return null

    return (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-base font-semibold text-gray-800 mb-4">Prévia do PDF marcado</h2>
            <iframe
                src={url}
                width="100%"
                height="600px"
                className="rounded-lg border border-gray-100"
                title="PDF marcado"
            />
        </div>
    )
}