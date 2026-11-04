import { afterEach, describe, expect, it, vi } from 'vitest'

import { CHAVE_FAVORITOS, atualizarFavorito, lerFavoritos } from './favoritosStorage'

afterEach(() => {
  vi.restoreAllMocks()
  localStorage.clear()
})

describe('favoritosStorage', () => {
  it('retorna lista vazia quando não há favoritos salvos', () => {
    expect(lerFavoritos()).toEqual([])
  })

  it('salva somente os IDs dos favoritos', () => {
    atualizarFavorito(1, true)
    atualizarFavorito(5, true)

    expect(localStorage.getItem(CHAVE_FAVORITOS)).toBe('[1,5]')
  })

  it('remove o ID ao desfavoritar sem duplicar', () => {
    atualizarFavorito(1, true)
    atualizarFavorito(1, true)
    atualizarFavorito(5, true)
    atualizarFavorito(1, false)

    expect(lerFavoritos()).toEqual([5])
  })

  it('não altera outras chaves do localStorage', () => {
    localStorage.setItem('accessibility_preferences', '{"fontSize":"large"}')

    atualizarFavorito(1, true)

    expect(localStorage.getItem('accessibility_preferences')).toBe('{"fontSize":"large"}')
  })

  it('ignora dados inválidos salvos', () => {
    localStorage.setItem(CHAVE_FAVORITOS, 'texto inválido')
    expect(lerFavoritos()).toEqual([])

    localStorage.setItem(CHAVE_FAVORITOS, '[1,"a",null,2]')
    expect(lerFavoritos()).toEqual([1, 2])
  })

  it('não lança erro quando o localStorage falha', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('Armazenamento indisponível')
    })
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('Armazenamento indisponível')
    })

    expect(lerFavoritos()).toEqual([])
    expect(() => atualizarFavorito(1, true)).not.toThrow()
  })
})
