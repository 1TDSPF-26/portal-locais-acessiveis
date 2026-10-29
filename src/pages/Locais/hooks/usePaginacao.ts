import { useState, useMemo, useEffect } from 'react';

export const ITENS_POR_PAGINA = 10;

interface UsePaginacaoOptions<T> {
  itens: T[];
  itensPorPagina?: number;
  /** Página controlada por quem chama (ex.: URL). Sem ela, o hook guarda a página em estado próprio. */
  pagina?: number;
  /** Chamado quando a página controlada muda. Obrigatório junto com `pagina`. */
  onPaginaChange?: (pagina: number) => void;
  /** Se false, não corrige a página enquanto os itens ainda não carregaram. Padrão: true. */
  sincronizar?: boolean;
}

export function usePaginacao<T>({
  itens,
  itensPorPagina = ITENS_POR_PAGINA,
  pagina,
  onPaginaChange,
  sincronizar = true,
}: UsePaginacaoOptions<T>) {
  const [paginaInterna, setPaginaInterna] = useState(1);
  const controlada = pagina !== undefined && onPaginaChange !== undefined;
  const paginaSolicitada = controlada ? pagina : paginaInterna;
  const setPaginaAtual = controlada ? onPaginaChange : setPaginaInterna;

  // Calcula o total de páginas (mínimo de 1 página)
  const totalPaginas = useMemo(() => {
    return Math.ceil(itens.length / itensPorPagina) || 1;
  }, [itens.length, itensPorPagina]);

  // Página exibida: nunca ultrapassa o total (ex.: URL com ?pagina=99 ou filtro que reduziu os resultados)
  const paginaAtual = Math.min(paginaSolicitada, totalPaginas);

  // Persiste o ajuste na origem do estado (estado interno ou URL)
  useEffect(() => {
    if (sincronizar && paginaSolicitada > totalPaginas) {
      setPaginaAtual(totalPaginas);
    }
  }, [sincronizar, totalPaginas, paginaSolicitada, setPaginaAtual]);

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