import { Link } from 'react-router-dom'
import type { Local } from '../../types/Local'

interface LocalCardProps {
  local: Local
  /** Caminho de onde o card foi aberto (ex.: "/locais?busca=cafe"). O detalhe usa para o link "Voltar". */
  origem?: string
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

function LocalCard({ local, origem }: LocalCardProps) {
  return (
    <article className="stack relative rounded-lg bg-cor-superficies-cards p-4">
      <h2>
        <Link
          to={`/locais/${local.id}`}
          state={origem ? { origem } : undefined}
          className="rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cor-foco-interativos focus-visible:ring-offset-2"
        >
          {local.nome}
        </Link>
      </h2>

      <p>Categoria: {local.categoria}</p>

      <p>
        Acessibilidade: {ROTULOS_ACESSIBILIDADE[local.acessibilidade.status]}
      </p>
    </article>
  )
}

export default LocalCard
