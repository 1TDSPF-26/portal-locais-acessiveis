interface PaginacaoProps {
  paginaAtual: number;
  totalPaginas: number;
  temAnterior: boolean;
  temProxima: boolean;
  paginaAnterior: () => void;
  proximaPagina: () => void;
  setPaginaAtual: (pagina: number) => void;
}

function calcularIndicesVisiveis(
  paginaAtual: number,
  totalPaginas: number,
): (number | 'ellipsis')[] {
  if (totalPaginas <= 7) {
    return Array.from({ length: totalPaginas }, (_, i) => i + 1)
  }

  const paginas = new Set<number>()


  paginas.add(1)
  paginas.add(totalPaginas)


  for (let i = paginaAtual - 2; i <= paginaAtual + 2; i++) {
    if (i >= 1 && i <= totalPaginas) {
      paginas.add(i)
    }
  }


  const ordenadas = [...paginas].sort((a, b) => a - b)
  const resultado: (number | 'ellipsis')[] = []

  for (let i = 0; i < ordenadas.length; i++) {
    if (i > 0 && ordenadas[i] - ordenadas[i - 1] > 1) {
      resultado.push('ellipsis')
    }
    resultado.push(ordenadas[i])
  }

  return resultado
}

export function Paginacao({
  paginaAtual,
  totalPaginas,
  temAnterior,
  temProxima,
  paginaAnterior,
  proximaPagina,
  setPaginaAtual,
}: PaginacaoProps) {
  const classeBotao =
    'min-h-11 min-w-11 rounded-md border border-cor-textos px-3 py-2 ' +
    'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ' +
    'focus-visible:outline-cor-foco-interativos disabled:cursor-not-allowed disabled:opacity-40'

  const paginasVisiveis = calcularIndicesVisiveis(paginaAtual, totalPaginas)

  return (
    <nav
      aria-label="Paginação"
      className="flex flex-col gap-3"
    >
      <p>
        Página {paginaAtual} de {totalPaginas}
      </p>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={paginaAnterior}
          disabled={!temAnterior}
          className={classeBotao}
        >
          Anterior
        </button>

        <button
          type="button"
          onClick={proximaPagina}
          disabled={!temProxima}
          className={classeBotao}
        >
          Próxima
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {paginasVisiveis.map((pagina, index) => {
          if (pagina === 'ellipsis') {
            return (
              <span
                key={`ellipsis-${index}`}
                aria-hidden="true"
                className="flex min-h-11 min-w-11 items-center justify-center text-cor-textos"
              >
                …
              </span>
            )
          }

          return (
            <button
              key={pagina}
              type="button"
              onClick={() => setPaginaAtual(pagina)}
              aria-current={pagina === paginaAtual ? 'page' : undefined}
              className={`${classeBotao} ${
                pagina === paginaAtual
                  ? 'bg-cor-botao-principal text-white'
                  : 'bg-cor-fundo-principal text-cor-titulos'
              }`}
            >
              {pagina}
            </button>
          )
        })}
      </div>
    </nav>
  )
}