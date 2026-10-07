import { afterEach, describe, expect, it, vi } from 'vitest'
import { ListagemLocais } from '../services/ListagemLocais'

describe('ListagemLocais', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('retorna apenas os locais válidos da resposta da Overpass', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(
        JSON.stringify({
          elements: [
            {
              id: 1,
              lat: -23.5505,
              lon: -46.6333,
              tags: {
                name: 'Local válido',
                amenity: 'cafe',
                wheelchair: 'yes',
              },
            },
            {
              id: 2,
              tags: {
                name: 'Local sem coordenadas',
                amenity: 'restaurant',
              },
            },
            {
              lat: -23.551,
              lon: -46.634,
              tags: {
                name: 'Local sem ID',
                amenity: 'shop',
              },
            },
          ],
        }),
        {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
          },
        },
      ),
    )

    const locais = await ListagemLocais()

    expect(locais).toHaveLength(1)
    expect(locais[0]).toMatchObject({
      id: 1,
      nome: 'Local válido',
      categoria: 'cafe',
      acessibilidade: {
        status: 'acessivel',
      },
    })
  })
})