import type { Local } from '../types/Local'
import type { OverpassElement } from '../types/Overpass'

function obterStatusAcessibilidade(
  wheelchair?: string,
): Local['acessibilidade']['status'] {
  switch (wheelchair) {
    case 'yes':
      return 'acessivel'
    case 'limited':
      return 'parcial'
    case 'no':
      return 'nao_acessivel'
    default:
      return 'nao_informado'
  }
}

export function normalizarLocal(
  elemento: OverpassElement,
): Local | null {
  if (elemento.id === undefined) {
    return null
  }

  const latitude = elemento.lat ?? elemento.center?.lat
  const longitude = elemento.lon ?? elemento.center?.lon

  if (latitude === undefined || longitude === undefined) {
    return null
  }

  const tags = elemento.tags

  const categoria =
    tags?.amenity ??
    tags?.shop ??
    tags?.tourism

  if (!categoria) {
    return null
  }

  return {
    id: elemento.id,
    nome: tags?.name ?? 'Local sem nome',
    descricao: tags?.description,
    categoria,
    endereco: {
      rua: tags?.['addr:street'] ?? 'Rua não informada',
      numero: tags?.['addr:housenumber'] ?? 'Número não informado',
      cidade: tags?.['addr:city'] ?? 'Cidade de São Paulo',
      estado: tags?.['addr:state'] ?? 'Estado de São Paulo',
    },
    coordenadas: {
      latitude,
      longitude,
    },
    acessibilidade: {
      status: obterStatusAcessibilidade(tags?.wheelchair),
      descricao: tags?.['wheelchair:description'],
    },
  }
}