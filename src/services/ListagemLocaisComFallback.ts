import type { Local } from '../types/Local'
import { ListagemLocais } from './ListagemLocais'
import { obterUltimoCacheLocais } from './CacheLocais'

export interface ResultadoListagemLocais {
  locais: Local[]
  desatualizado: boolean
  atualizadoEm?: number
}

export async function ListagemLocaisComFallback(): Promise<ResultadoListagemLocais> {
  try {
    const locais = await ListagemLocais()
    return { locais, desatualizado: false }
  } catch (erro) {
    const ultimo = obterUltimoCacheLocais()

    if (ultimo && ultimo.locais.length > 0) {
      return {
        locais: ultimo.locais,
        desatualizado: true,
        atualizadoEm: ultimo.criadoEm,
      }
    }

    throw erro
  }
}