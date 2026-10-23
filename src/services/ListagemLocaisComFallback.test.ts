import { beforeEach, describe, expect, it, vi } from 'vitest'

import type { Local } from '../types/Local'
import { definirCacheLocais, limparCacheLocais } from './CacheLocais'
import { ListagemLocais } from './ListagemLocais'
import { ListagemLocaisComFallback } from './ListagemLocaisComFallback'

vi.mock('./ListagemLocais')

const local: Local = {
  id: 1,
  nome: 'Museu do Ipiranga',
  categoria: 'museum',
  coordenadas: { latitude: -23.5856, longitude: -46.6097 },
  acessibilidade: { status: 'parcial' },
}

describe('ListagemLocaisComFallback', () => {
  beforeEach(() => {
    limparCacheLocais()
    vi.mocked(ListagemLocais).mockReset()
  })

  it('com a Overpass disponível, devolve os dados sem marcar como desatualizados', async () => {
    vi.mocked(ListagemLocais).mockResolvedValue([local])

    const resultado = await ListagemLocaisComFallback()

    expect(resultado).toEqual({ locais: [local], desatualizado: false })
  })

  it('se a Overpass falhar e houver cache, devolve o cache como desatualizado', async () => {
    definirCacheLocais([local])
    vi.mocked(ListagemLocais).mockRejectedValue(new Error('Overpass fora'))

    const resultado = await ListagemLocaisComFallback()

    expect(resultado.locais).toEqual([local])
    expect(resultado.desatualizado).toBe(true)
    expect(resultado.atualizadoEm).toBeTypeOf('number')
  })

  it('se a Overpass falhar e não houver cache, propaga o erro', async () => {
    vi.mocked(ListagemLocais).mockRejectedValue(new Error('Overpass fora'))

    await expect(ListagemLocaisComFallback()).rejects.toThrow('Overpass fora')
  })

  it('o cache expirado ainda serve de fallback', async () => {
    vi.useFakeTimers()
    definirCacheLocais([local])
    vi.advanceTimersByTime(5 * 60 * 1000 + 1)
    vi.mocked(ListagemLocais).mockRejectedValue(new Error('Overpass fora'))

    const resultado = await ListagemLocaisComFallback()

    expect(resultado.desatualizado).toBe(true)
    vi.useRealTimers()
  })
})