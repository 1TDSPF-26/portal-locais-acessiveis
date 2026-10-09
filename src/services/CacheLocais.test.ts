import { describe, it, expect, beforeEach, vi } from 'vitest';
import { obterCacheLocais, definirCacheLocais, limparCacheLocais } from './CacheLocais';
import type { Local } from '../types/Local';

describe('Serviço de Cache de Locais', () => {
  beforeEach(() => {
    limparCacheLocais();
    vi.useRealTimers();
  });

  it('deve retornar null se o cache estiver vazio', () => {
    expect(obterCacheLocais()).toBeNull();
  });

  it('deve armazenar e retornar dados válidos', () => {
    const mockLocais = [{ id: '1', nome: 'Local Teste' }] as unknown as Local[];
    
    definirCacheLocais(mockLocais);
    const resultado = obterCacheLocais();

    expect(resultado).toEqual(mockLocais);
  });

  it('deve expirar o cache após o tempo limite', () => {
    vi.useFakeTimers();
    const mockLocais = [{ id: '1', nome: 'Local Expirado' }] as unknown as Local[];

    definirCacheLocais(mockLocais);
    vi.advanceTimersByTime(6 * 60 * 1000);

    expect(obterCacheLocais()).toBeNull();
  });
});