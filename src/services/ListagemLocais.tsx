import type { Local } from '../types/Local'
import type { OverpassResponse } from '../types/Overpass'
import { normalizarLocal } from './normalizarLocal.ts'
import { obterCacheLocais, definirCacheLocais } from './CacheLocais.ts'

export async function ListagemLocais(): Promise<Local[]> {
  const cacheValido = obterCacheLocais()
  if (cacheValido) {
    return cacheValido
  }

  const query = `
  [out:json][timeout:90];
  area["wikidata"="Q174"]["admin_level"="8"]->.sp;

  nwr["wheelchair"][~"^(amenity|shop|tourism)$"~"."](area.sp);
  out center qt;
`
  const response = await fetch(
    'https://overpass-api.de/api/interpreter',
    {
      method: 'POST',
      body: 'data=' + encodeURIComponent(query),
    },
  )

  if (!response.ok) {
    throw new Error(`Erro ao consultar a Overpass: ${response.status}`)
  }

  const result: OverpassResponse = await response.json()

  const listaElementos = result.elements ?? []

  let locais: Local[] = []

  for (const elemento of listaElementos) {
    const local = normalizarLocal(elemento)

    if (local !== null) {
      locais.push(local)
    }
  }

  definirCacheLocais(locais)

  return locais
}