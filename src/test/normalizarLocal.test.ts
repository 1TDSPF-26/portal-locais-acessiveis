import { describe, expect, it } from 'vitest'
import { normalizarLocal } from '../services/normalizarLocal'

describe('normalizarLocal', () => {
  it('transforma um elemento válido da Overpass em Local', () => {
    const elemento = {
      id: 123,
      lat: -23.5505,
      lon: -46.6333,
      tags: {
        name: 'Local de teste',
        amenity: 'cafe',
        wheelchair: 'yes',
      },
    }

    const local = normalizarLocal(elemento)

    expect(local).toEqual({
      id: 123,
      nome: 'Local de teste',
      categoria: 'cafe',
      endereco: {
        rua: 'Rua não informada',
        numero: 'Número não informado',
        cidade: 'Cidade de São Paulo',
        estado: 'Estado de São Paulo',
      },
      coordenadas: {
        latitude: -23.5505,
        longitude: -46.6333,
      },
      acessibilidade: {
        status: 'acessivel',
      },
    })
  })

  it('ignora elemento sem coordenadas', () => {
    const elemento = {
      id: 123,
      tags: {
        name: 'Local sem coordenadas',
        amenity: 'cafe',
      },
    }

    expect(normalizarLocal(elemento)).toBeNull()
  })

  it('ignora elemento sem id', () => {
    const elemento = {
      lat: -23.5505,
      lon: -46.6333,
      tags: {
        name: 'Local sem id',
        amenity: 'cafe',
      },
    }

    expect(normalizarLocal(elemento)).toBeNull()
  })

  it('usa as coordenadas do center quando lat e lon não estão diretamente no elemento', () => {
    const elemento = {
      id: 456,
      center: {
        lat: -23.5505,
        lon: -46.6333,
      },
      tags: {
        name: 'Local com center',
        tourism: 'museum',
      },
    }

    const local = normalizarLocal(elemento)

    expect(local?.coordenadas).toEqual({
      latitude: -23.5505,
      longitude: -46.6333,
    })
  })

  it('trata wheelchair ausente como nao_informado', () => {
    const elemento = {
      id: 789,
      lat: -23.5505,
      lon: -46.6333,
      tags: {
        name: 'Local sem informação de acessibilidade',
        shop: 'bakery',
      },
    }

    const local = normalizarLocal(elemento)

    expect(local?.acessibilidade.status).toBe('nao_informado')
  })

  it('preserva o mapeamento wheelchair=limited', () => {
    const elemento = {
      id: 101,
      lat: -23.5505,
      lon: -46.6333,
      tags: {
        name: 'Local parcialmente acessível',
        amenity: 'restaurant',
        wheelchair: 'limited',
      },
    }

    const local = normalizarLocal(elemento)

    expect(local?.acessibilidade.status).toBe('parcial')
  })

  it('preserva o mapeamento wheelchair=no', () => {
    const elemento = {
      id: 102,
      lat: -23.5505,
      lon: -46.6333,
      tags: {
        name: 'Local não acessível',
        amenity: 'restaurant',
        wheelchair: 'no',
      },
    }

    const local = normalizarLocal(elemento)

    expect(local?.acessibilidade.status).toBe('nao_acessivel')
  })
})