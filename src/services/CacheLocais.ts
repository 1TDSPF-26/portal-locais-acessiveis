import type { Local } from '../types/Local';

interface CacheItem {
  dados: Local[];
  timestamp: number;
}

const TEMPO_VALIDADE_MS = 5 * 60 * 1000;

let cacheMemoria: CacheItem | null = null;

export function obterCacheLocais(): Local[] | null {
  if (!cacheMemoria) {
    return null;
  }

  const agora = Date.now();
  const idadeCache = agora - cacheMemoria.timestamp;

  if (idadeCache > TEMPO_VALIDADE_MS) {
    cacheMemoria = null;
    return null;
  }

  return cacheMemoria.dados;
}

export function definirCacheLocais(dados: Local[]): void {
  cacheMemoria = {
    dados,
    timestamp: Date.now(),
  };
}

export function limparCacheLocais(): void {
  cacheMemoria = null;
}