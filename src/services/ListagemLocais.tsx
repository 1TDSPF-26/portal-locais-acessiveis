import type { Local } from '../types/Local'
import type { OverpassResponse } from '../types/Overpass'
import { normalizarLocal } from './normalizarLocal'



export async function ListagemLocais(): Promise<Local[]> {
  const query = `
  [out:json][timeout:90];
  area["wikidata"="Q174"]["admin_level"="8"]->.sp;

  nwr["wheelchair"][~"^(amenity|shop|tourism)$"~"."](area.sp);
  out center qt;
`
  const result: OverpassResponse = await fetch(
  "https://overpass-api.de/api/interpreter",
  {
    method: 'POST',
    body: 'data=' + encodeURIComponent(query),
  },
).then((data) => data.json())

const listaElementos = result.elements ?? []

let locais: Local[] = []

  for (const elemento of listaElementos) {
  const local = normalizarLocal(elemento)

  if (local !== null) {
    locais.push(local)
  }
}

  return locais
}
