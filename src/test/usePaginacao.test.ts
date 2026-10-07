import { renderHook, act } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ITENS_POR_PAGINA, usePaginacao } from '../pages/Locais/hooks/usePaginacao';

describe('usePaginacao Hook Base', () => {
  const listaMocada = Array.from({ length: 25 }, (_, i) => ({ id: i + 1, nome: `Local ${i + 1}` }));

  it('deve utilizar ITENS_POR_PAGINA padrão e calcular o total de páginas', () => {
    const { result } = renderHook(() => usePaginacao({ itens: listaMocada }));

    expect(ITENS_POR_PAGINA).toBe(10);
    expect(result.current.itensPaginados.length).toBe(10);
    expect(result.current.totalPaginas).toBe(3);
    expect(result.current.paginaAtual).toBe(1);
  });

  it('deve avançar e voltar páginas corretamente', () => {
    const { result } = renderHook(() => usePaginacao({ itens: listaMocada }));

    act(() => {
      result.current.proximaPagina();
    });
    expect(result.current.paginaAtual).toBe(2);
    expect(result.current.itensPaginados[0].nome).toBe('Local 11');

    act(() => {
      result.current.paginaAnterior();
    });
    expect(result.current.paginaAtual).toBe(1);
  });

  it('deve ajustar a página atual para a última se a lista encolher', () => {
    let itens = listaMocada;
    const { result, rerender } = renderHook(() => usePaginacao({ itens }));

    act(() => {
      result.current.setPaginaAtual(3);
    });
    expect(result.current.paginaAtual).toBe(3);

    // Simula filtragem reduzindo resultados para apenas 5 itens
    itens = listaMocada.slice(0, 5);
    rerender();

    expect(result.current.paginaAtual).toBe(1);
  });
});