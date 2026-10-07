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
  return (
    <nav aria-label="Paginação">
      <button
        type="button"
        onClick={paginaAnterior}
        disabled={!temAnterior}
      >
        Anterior
      </button>

      {Array.from({ length: totalPaginas }, (_, index) => {
        const pagina = index + 1;

        return (
          <button
            key={pagina}
            type="button"
            onClick={() => setPaginaAtual(pagina)}
            aria-current={pagina === paginaAtual ? "page" : undefined}
          >
            {pagina}
          </button>
        );
      })}

      <button
        type="button"
        onClick={proximaPagina}
        disabled={!temProxima}
      >
        Próxima
      </button>
    </nav>
  );
}