import type { Local } from '../../types/Local'

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
    <article>
      <h2>{local.nome}</h2>

      <p>Categoria: {local.categoria}</p>

      <p>
        Acessibilidade: {ROTULOS_ACESSIBILIDADE[local.acessibilidade.status]}
      </p>
    </article>
  )
}

export default LocalCard
