import type { Local } from '../types/Local'

let cacheLocais: Local[] | null = null
let cacheTimestamp = 0
const TTL = 5 * 60 * 1000

export function obterCacheLocais(): Local[] | null {
  if (!cacheLocais || !cacheTimestamp) return null
  if (Date.now() - cacheTimestamp >= TTL) return null
  return cacheLocais
}

// Último cache existente, mesmo expirado. Usado só como fallback quando a Overpass falha.
export function obterUltimoCacheLocais(): { locais: Local[]; criadoEm: number } | null {
  if (!cacheLocais || !cacheTimestamp) return null
  return { locais: cacheLocais, criadoEm: cacheTimestamp }
}

export function definirCacheLocais(dados: Local[]) {
  cacheLocais = dados
  cacheTimestamp = Date.now()
}

export function limparCacheLocais() {
  cacheLocais = null
  cacheTimestamp = 0
}