interface PaginacaoProps {
  paginaAtual: number;
  totalPaginas: number;
  temAnterior: boolean;
  temProxima: boolean;
  paginaAnterior: () => void;
  proximaPagina: () => void;
  setPaginaAtual: (pagina: number) => void;
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
    'min-h-11 min-w-11 rounded-md border border-[#465268] px-3 py-2 ' +
    'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ' +
    'focus-visible:outline-[#216FCE] disabled:cursor-not-allowed disabled:opacity-40'

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
        {Array.from({ length: totalPaginas }, (_, index) => {
          const pagina = index + 1

          return (
            <button
              key={pagina}
              type="button"
              onClick={() => setPaginaAtual(pagina)}
              aria-current={pagina === paginaAtual ? 'page' : undefined}
              className={`${classeBotao} ${
                pagina === paginaAtual
                  ? 'bg-[#216FCE] text-white'
                  : 'bg-white text-[#172A3A]'
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