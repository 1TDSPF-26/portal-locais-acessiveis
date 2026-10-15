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
    it('retorna null quando o elemento não possui categoria', () => {
    const elemento = {
      id: 200,
      lat: -23.5505,
      lon: -46.6333,
      tags: {
        name: 'Local sem categoria',
      },
    }

    expect(normalizarLocal(elemento)).toBeNull()
  })

  it('usa os valores padrão quando os campos opcionais estão ausentes', () => {
    const elemento = {
      id: 201,
      lat: -23.5505,
      lon: -46.6333,
      tags: {
        amenity: 'cafe',
      },
    }

    expect(normalizarLocal(elemento)).toEqual({
      id: 201,
      nome: 'Local sem nome',
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
        status: 'nao_informado',
      },
    })
  })

  it('usa a categoria shop quando amenity não está informado', () => {
    const elemento = {
      id: 202,
      lat: -23.5505,
      lon: -46.6333,
      tags: {
        shop: 'bakery',
      },
    }

    expect(normalizarLocal(elemento)?.categoria).toBe('bakery')
  })

  it('usa a categoria tourism quando amenity e shop não estão informados', () => {
    const elemento = {
      id: 203,
      lat: -23.5505,
      lon: -46.6333,
      tags: {
        tourism: 'museum',
      },
    }

    expect(normalizarLocal(elemento)?.categoria).toBe('museum')
  })

  it('prioriza as coordenadas diretas quando também existe center', () => {
    const elemento = {
      id: 204,
      lat: -23.5505,
      lon: -46.6333,
      center: {
        lat: -22.9000,
        lon: -47.0600,
      },
      tags: {
        amenity: 'library',
      },
    }

    expect(normalizarLocal(elemento)?.coordenadas).toEqual({
      latitude: -23.5505,
      longitude: -46.6333,
    })
  })

  it('trata um valor de wheelchair desconhecido como nao_informado', () => {
    const elemento = {
      id: 205,
      lat: -23.5505,
      lon: -46.6333,
      tags: {
        amenity: 'cafe',
        wheelchair: 'unknown',
      },
    }

    expect(normalizarLocal(elemento)?.acessibilidade.status).toBe(
      'nao_informado',
    )
  })

  it('normaliza vários registros de uma resposta simulada', () => {
    const elementos = [
      {
        id: 301,
        lat: -23.5505,
        lon: -46.6333,
        tags: {
          name: 'Café acessível',
          amenity: 'cafe',
          wheelchair: 'yes',
        },
      },
      {
        id: 302,
        center: {
          lat: -23.5600,
          lon: -46.6400,
        },
        tags: {
          name: 'Museu parcialmente acessível',
          tourism: 'museum',
          wheelchair: 'limited',
        },
      },
      {
        id: 303,
        lat: -23.5700,
        lon: -46.6500,
        tags: {
          name: 'Local inválido',
        },
      },
    ]

    const locais = elementos
      .map((elemento) => normalizarLocal(elemento))
      .filter((local) => local !== null)

    expect(locais).toHaveLength(2)
    expect(locais.map((local) => local.id)).toEqual([301, 302])
    expect(locais.map((local) => local.acessibilidade.status)).toEqual([
      'acessivel',
      'parcial',
    ])
  })
})