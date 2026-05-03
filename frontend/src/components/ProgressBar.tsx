import { useEffect, useState } from "react"

interface Props {
    ativo: boolean
}

export default function ProgressBar({ ativo }: Props) {
    const [progresso, setProgresso] = useState(0)
    const [visivel, setVisivel] = useState(false)

    useEffect(() => {
        if (ativo) {
            setProgresso(0)
            setVisivel(true)

            // Avança rápido até 85%, depois trava esperando o backend
            const timer = setInterval(() => {
                setProgresso(p => {
                    if (p < 60) return p + 4        // rápido no início
                    if (p < 80) return p + 1.5      // desacelera
                    if (p < 85) return p + 0.3      // quase para
                    return p                         // trava aqui até resposta
                })
            }, 100)

            return () => clearInterval(timer)
        } else if (visivel) {
            // Resposta chegou — completa a barra e some
            setProgresso(100)
            const timer = setTimeout(() => {
                setVisivel(false)
                setProgresso(0)
            }, 600)

            return () => clearTimeout(timer)
        }
    }, [ativo])

    if (!visivel) return null

    return (
        <div className="fixed top-0 left-0 right-0 z-50">
            <div
                className="h-1 bg-blue-500 transition-all duration-300 ease-out"
                style={{
                    width: `${progresso}%`,
                    boxShadow: "0 0 8px rgba(37, 99, 235, 0.6)",
                }}
            />
        </div>
    )
}