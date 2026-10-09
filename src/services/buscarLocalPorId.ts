import type { Local } from '../types/Local'
import { ListagemLocais } from './ListagemLocais'


export async function buscarLocalPorId(id: number): Promise<Local | null> {
  const locais = await ListagemLocais()

  return locais.find((local) => local.id === id) ?? null
}
