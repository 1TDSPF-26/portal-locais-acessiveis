import { describe, expect, it } from 'vitest'
import type { Local } from '../types/Local'
import { CRITERIOS_PADRAO, filtrarLocais, obterCategorias } from './filtrarLocais'

function criarLocal(id: number, nome: string, categoria: string, status: Local['acessibilidade']['status']): Local {
  return { id, nome, categoria, coordenadas: { latitude: 0, longitude: 0 }, acessibilidade: { status } }
}

const locais: Local[] = [
  criarLocal(1, 'Museu do Ipiranga', 'museum', 'acessivel'),
  criarLocal(2, 'Café Central', 'cafe', 'parcial'),
  criarLocal(3, 'biblioteca Mário de Andrade', 'library', 'acessivel'),
  criarLocal(4, 'Café da Esquina', 'cafe', 'nao_acessivel'),
]

const nomes = (lista: Local[]) => lista.map((local) => local.nome)

describe('filtrarLocais', () => {
  it('sem critérios retorna todos os locais ordenados de A a Z', () => {
    expect(nomes(filtrarLocais(locais, CRITERIOS_PADRAO))).toEqual([
      'biblioteca Mário de Andrade',
      'Café Central',
      'Café da Esquina',
      'Museu do Ipiranga',
    ])
  })

  it('filtra pela busca por nome sem diferenciar maiúsculas', () => {
    expect(nomes(filtrarLocais(locais, { ...CRITERIOS_PADRAO, termoBusca: 'CAFÉ' }))).toEqual([
      'Café Central',
      'Café da Esquina',
    ])
  })

  it('filtra por categoria', () => {
    expect(nomes(filtrarLocais(locais, { ...CRITERIOS_PADRAO, categoria: 'museum' }))).toEqual(['Museu do Ipiranga'])
  })

  it('filtra por acessibilidade', () => {
    expect(nomes(filtrarLocais(locais, { ...CRITERIOS_PADRAO, acessibilidade: 'acessivel' }))).toEqual([
      'biblioteca Mário de Andrade',
      'Museu do Ipiranga',
    ])
  })

  it('combina busca, categoria e acessibilidade', () => {
    const criterios = { ...CRITERIOS_PADRAO, termoBusca: 'café', categoria: 'cafe', acessibilidade: 'parcial' as const }
    expect(nomes(filtrarLocais(locais, criterios))).toEqual(['Café Central'])
  })

  it('ordena de Z a A', () => {
    expect(nomes(filtrarLocais(locais, { ...CRITERIOS_PADRAO, ordem: 'desc' }))).toEqual([
      'Museu do Ipiranga',
      'Café da Esquina',
      'Café Central',
      'biblioteca Mário de Andrade',
    ])
  })

  it('retorna lista vazia quando nada corresponde', () => {
    expect(filtrarLocais(locais, { ...CRITERIOS_PADRAO, categoria: 'cafe', acessibilidade: 'acessivel' })).toEqual([])
  })

  it('não altera a lista original', () => {
    const original = [...locais]
    filtrarLocais(locais, { ...CRITERIOS_PADRAO, ordem: 'desc', categoria: 'cafe' })
    expect(locais).toEqual(original)
  })
})

describe('obterCategorias', () => {
  it('retorna categorias distintas em ordem alfabética', () => {
    expect(obterCategorias(locais)).toEqual(['cafe', 'library', 'museum'])
  })
})