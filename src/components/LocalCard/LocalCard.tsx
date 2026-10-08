import type { Local } from '../../types/Local'
import { Link } from 'react-router-dom'

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
  return (
    <article className="stack relative rounded-lg bg-cor-superficies-cards p-4">
      <h2>{local.nome}</h2>
      <h2>
        <Link to={`/locais/${local.id}`} >{local.nome}</Link>
      </h2>
      <p>Categoria: {local.categoria}</p>

      <p>
        Acessibilidade: {ROTULOS_ACESSIBILIDADE[local.acessibilidade.status]}
      </p>
    </article>
  )
}

export default LocalCard
