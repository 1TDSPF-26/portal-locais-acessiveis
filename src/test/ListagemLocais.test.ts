import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { ListagemLocais } from '../services/ListagemLocais'
import { limparCacheLocais } from '../services/CacheLocais'

describe('ListagemLocais e Cache', () => {
  beforeEach(() => {
    limparCacheLocais()
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-01-01T10:00:00Z'))
    vi.restoreAllMocks()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('reutiliza o cache sem novo fetch dentro do período válido', async () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockImplementation(async () =>
      new Response(
        JSON.stringify({
          elements: [{ id: 1, lat: 0, lon: 0, tags: { name: 'Local A', tourism: 'museum' } }]
        }),
        { status: 200 }
      )
    )

    await ListagemLocais()
    expect(fetchSpy).toHaveBeenCalledTimes(1)

    vi.advanceTimersByTime(3 * 60 * 1000)

    await ListagemLocais()
    expect(fetchSpy).toHaveBeenCalledTimes(1)
  })

  it('faz nova consulta à Overpass se o cache expirar', async () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockImplementation(async () =>
      new Response(
        JSON.stringify({
          elements: [{ id: 1, lat: 0, lon: 0, tags: { name: 'Local A', tourism: 'museum' } }]
        }),
        { status: 200 }
      )
    )

    await ListagemLocais()
    expect(fetchSpy).toHaveBeenCalledTimes(1)

    vi.advanceTimersByTime(5 * 60 * 1000 + 1000)

    await ListagemLocais()
    expect(fetchSpy).toHaveBeenCalledTimes(2)
  })

  it('atualiza o conteúdo cacheado com nova resposta válida nas chamadas seguintes', async () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch')
      .mockImplementationOnce(async () =>
        new Response(
          JSON.stringify({
            elements: [{ id: 1, lat: 0, lon: 0, tags: { name: 'Versão 1', tourism: 'museum' } }]
          }),
          { status: 200 }
        )
      )
      .mockImplementation(async () =>
        new Response(
          JSON.stringify({
            elements: [{ id: 2, lat: 0, lon: 0, tags: { name: 'Versão 2', tourism: 'museum' } }]
          }),
          { status: 200 }
        )
      )

    const resultado1 = await ListagemLocais()
    expect(resultado1[0].nome).toBe('Versão 1')
    expect(fetchSpy).toHaveBeenCalledTimes(1)

    vi.advanceTimersByTime(6 * 60 * 1000)

    const resultado2 = await ListagemLocais()
    expect(resultado2[0].nome).toBe('Versão 2')
    expect(fetchSpy).toHaveBeenCalledTimes(2)

    vi.advanceTimersByTime(1 * 60 * 1000)
    const resultado3 = await ListagemLocais()
    expect(resultado3[0].nome).toBe('Versão 2')
    expect(fetchSpy).toHaveBeenCalledTimes(2)
  })
})