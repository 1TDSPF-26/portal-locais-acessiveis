import { useState } from 'react'

interface ImagemLocalProps {
  /** URL opcional da imagem (campo `Local.imagem`). */
  src?: string
  /** Nome do local, usado para compor o texto alternativo. */
  nome: string
  className?: string
}

/**
 * Renderiza a imagem opcional de um local.
 *
 * - Não renderiza nada quando não há URL válida.
 * - Reserva o espaço com proporção fixa para evitar deslocamento de layout.
 * - Usa carregamento preguiçoso e decodificação assíncrona.
 * - Se o carregamento falhar, remove a imagem e mantém o restante do card.
 */
function ImagemLocal({ src, nome, className = '' }: ImagemLocalProps) {
  const [srcComFalha, setSrcComFalha] = useState<string | null>(null)

  const url = src?.trim()

  if (!url || srcComFalha === url) {
    return null
  }

  return (
    <div
      className={`aspect-video w-full overflow-hidden rounded-md bg-cor-detalhes-icones/20 ${className}`}
    >
      <img
        src={url}
        alt={`Foto do local ${nome}`}
        width={640}
        height={360}
        loading="lazy"
        decoding="async"
        onError={() => setSrcComFalha(url)}
        className="h-full w-full object-cover"
      />
    </div>
  )
}

export default ImagemLocal