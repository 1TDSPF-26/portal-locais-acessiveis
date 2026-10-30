let cacheLocais: any = null
let cacheTimestamp: number = 0
const TTL = 5 * 60 * 1000

export function obterCacheLocais() {
  return obterCacheLocaisComData()?.dados ?? null
}

export function obterCacheLocaisComData(): { dados: any; carregadoEm: number } | null {
  if (!cacheLocais || !cacheTimestamp) return null
  const agora = Date.now()
  if (agora - cacheTimestamp >= TTL) {
    limparCacheLocais()
    return null
  }
  return { dados: cacheLocais, carregadoEm: cacheTimestamp }
}

export function definirCacheLocais(dados: any) {
  cacheLocais = dados
  cacheTimestamp = Date.now()
}

export function limparCacheLocais() {
  cacheLocais = null
  cacheTimestamp = 0
}
