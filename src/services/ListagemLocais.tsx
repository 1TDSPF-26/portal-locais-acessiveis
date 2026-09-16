import type { Local } from '../types/Locais.ts'

export async function ListagemLocais(): Promise<Local[]> {
  const query = `
    [out:json][timeout:120];
    (
    node["wheelchair"]["amenity"](-23.78,-46.81,-23.40,-46.36);
    node["wheelchair"]["shop"](-23.78,-46.81,-23.40,-46.36);
    node["wheelchair"]["tourism"](-23.78,-46.81,-23.40,-46.36);
    way["wheelchair"]["amenity"](-23.78,-46.81,-23.40,-46.36);
    way["wheelchair"]["shop"](-23.78,-46.81,-23.40,-46.36);
    );
    out center 100 ;
  `
  const result = await fetch(
    'https://overpass-api.de/api/interpreter',
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
        rua: elemento.tags?.['addr:street'],
        numero: elemento.tags?.['addr:housenumber'],
        cidade: elemento.tags?.['addr:city'],
        estado: elemento.tags?.['addr:state'],
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