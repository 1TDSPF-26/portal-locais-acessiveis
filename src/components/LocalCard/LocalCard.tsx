import { Link } from 'react-router-dom'
import type { Local } from '../../types/Local'
import { useFavorito } from './useFavorito'

interface LocalCardProps {
  local: Local
}

const ROTULOS_ACESSIBILIDADE: Record<
  Local['acessibilidade']['status'],
  string
> = {
  acessivel: 'Acessível',
  parcial: 'Parcialmente acessível',
  nao_acessivel: 'Não acessível',
  nao_informado: 'Não informado',
}

function LocalCard({ local }: LocalCardProps) {
  const { favorito, alternarFavorito } = useFavorito(local.id)

  return (
    <article className="stack relative w-full min-w-0 rounded-lg bg-cor-superficies-cards p-4 [overflow-wrap:anywhere]">
      <h2>
        <Link
          to={`/locais/${local.id}`}
          className="rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cor-foco-interativos focus-visible:ring-offset-2"
        >
          {local.nome}
        </Link>
      </h2>

      <p>Categoria: {local.categoria}</p>

      <p>
        Acessibilidade: {ROTULOS_ACESSIBILIDADE[local.acessibilidade.status]}
      </p>

      <button
        type="button"
        onClick={alternarFavorito}
        aria-pressed={favorito}
        aria-label={
          favorito ? `Remover ${local.nome} dos favoritos` : `Favoritar ${local.nome}`
        }
        className={`inline-flex items-center gap-2 self-start rounded-md border-2 border-cor-botao-principal px-4 py-2 text-botao transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cor-foco-interativos focus-visible:ring-offset-2 ${
          favorito
            ? 'bg-cor-botao-principal text-cor-fundo-principal hover:bg-cor-apoio'
            : 'bg-cor-fundo-principal text-cor-botao-principal hover:bg-cor-superficies-cards'
        }`}
      >
      <span aria-hidden="true">{favorito ? '★' : '☆'}</span>
      {favorito ? 'Favoritado' : 'Favoritar'}
      </button>
    </article>
  )
}

export default LocalCard
