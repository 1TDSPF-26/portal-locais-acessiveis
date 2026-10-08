import { useState, useMemo, useEffect } from 'react';

export const ITENS_POR_PAGINA = 10;

interface UsePaginacaoOptions<T> {
  itens: T[];
  itensPorPagina?: number;
}

export function usePaginacao<T>({
  itens,
  itensPorPagina = ITENS_POR_PAGINA,
}: UsePaginacaoOptions<T>) {
  const [paginaAtual, setPaginaAtual] = useState(1);

  // Calcula o total de páginas (mínimo de 1 página)
  const totalPaginas = useMemo(() => {
    return Math.ceil(itens.length / itensPorPagina) || 1;
  }, [itens.length, itensPorPagina]);

  // Ajusta a página atual se os resultados forem reduzidos por busca/filtros
  useEffect(() => {
    if (paginaAtual > totalPaginas) {
      setPaginaAtual(totalPaginas);
    }
  }, [totalPaginas, paginaAtual]);

  // Fatia o array original para obter apenas os itens da página atual
  const itensPaginados = useMemo(() => {
    const inicio = (paginaAtual - 1) * itensPorPagina;
    return itens.slice(inicio, inicio + itensPorPagina);
  }, [itens, paginaAtual, itensPorPagina]);

  const irParaPagina = (pagina: number) => {
    if (pagina >= 1 && pagina <= totalPaginas) {
      setPaginaAtual(pagina);
    }
  };

  const proximaPagina = () => irParaPagina(paginaAtual + 1);
  const paginaAnterior = () => irParaPagina(paginaAtual - 1);
  const resetarPagina = () => setPaginaAtual(1);

  return {
    paginaAtual,
    totalPaginas,
    totalItens: itens.length,
    itensPaginados,
    setPaginaAtual: irParaPagina,
    proximaPagina,
    paginaAnterior,
    resetarPagina,
    temProxima: paginaAtual < totalPaginas,
    temAnterior: paginaAtual > 1,
  };
}