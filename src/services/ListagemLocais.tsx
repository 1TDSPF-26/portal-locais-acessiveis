import type { Local } from '../types/Locais.ts'

export async function ListagemLocais(): Promise<Local[]> {
const query = `
  [out:json][timeout:25];
  node["wheelchair"="yes"](around:3000,-23.5505,-46.6333);
  out 10;
`
  const result = await fetch(
    "https://overpass-api.de/api/interpreter",
    {
      method: 'POST',
      body: 'data=' + encodeURIComponent(query),
    },
  ).then((data) => data.json())

  const listaElementos = result.elements

  let locais: Local[] = []

  for (let elemento of listaElementos) {
    let latitude = elemento.lat ?? elemento.center?.lat
    let longitude = elemento.lon ?? elemento.center?.lon

    if (latitude === undefined || longitude === undefined) {
      continue
    }

    let local: Local = {
      id: elemento.id,
      nome: elemento.tags?.name ?? 'Local sem nome',
      descricao: elemento.tags?.description,
      categoria:
        elemento.tags?.amenity ??
        elemento.tags?.shop ??
        elemento.tags?.tourism ??
        'Categoria não informada',
      endereco: {
        rua: elemento.tags?.['addr:street'] ?? 'Rua não informada',
        numero: elemento.tags?.['addr:housenumber'] ?? 'Numero não informado',
        cidade: elemento.tags?.['addr:city'] ?? 'Cidade de São Paulo',
        estado: elemento.tags?.['addr:state']?? 'Estado de São Paulo',
      },
      coordenadas: {
        latitude: latitude,
        longitude: longitude,
      },
      acessibilidade: {
        status: 'acessivel',
        descricao: elemento.tags?.['wheelchair:description'],
      },
    }

    locais.push(local)
  }

  console.log(locais)

  return locais
}