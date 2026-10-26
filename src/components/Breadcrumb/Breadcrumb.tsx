import { Link } from 'react-router-dom'

export type BreadcrumbItem = {

    label: string
    // Etapas navegáveis recebem `to`. A última etapa é sempre a página atual.
     to?: string
     }

type BreadcrumbProps = {
  items: BreadcrumbItem[]
}

const classeLink =
  'rounded-md text-cor-botao-principal underline underline-offset-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cor-apoio focus-visible:ring-offset-2'

  export function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav aria-label="Trilha de navegação">
      <ol className="flex flex-wrap items-center gap-2 text-legendas">
        {items.map((item, indice) => {
          const ehAtual = indice === items.length - 1

          return (
            <li key={`${item.label}-${indice}`} className="flex items-center gap-2">
              {ehAtual || !item.to ? (
                <span
                  aria-current={ehAtual ? 'page' : undefined}
                  className="font-semibold text-cor-titulos"
                >
                  {item.label}
                </span>
              ) : (
                <Link to={item.to} className={classeLink}>
                  {item.label}
                </Link>
              )}

               {!ehAtual && (
                <span aria-hidden="true" className="text-cor-textos">
                  /
                </span>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}