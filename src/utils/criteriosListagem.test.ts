import { describe, expect, it } from 'vitest'

import {
  CONTEXTO_PADRAO,
  escreverContextoListagem,
  lerContextoListagem,
  obterCaminhoRetorno,
} from './criteriosListagem'

describe('lerContextoListagem', () => {
  it('usa os valores padrão quando a URL não tem parâmetros', () => {
    expect(lerContextoListagem(new URLSearchParams())).toEqual(CONTEXTO_PADRAO)
  })

  it('lê busca, filtros, ordem e página', () => {
    const params = new URLSearchParams('busca=caf%C3%A9&categoria=cafe&acessibilidade=parcial&ordem=desc&pagina=3')

    expect(lerContextoListagem(params)).toEqual({
      termoBusca: 'café',
      categoria: 'cafe',
      acessibilidade: 'parcial',
      ordem: 'desc',
      pagina: 3,
    })
  })

  it.each(['0', '-2', 'abc', '1.5', ''])('ignora página inválida (%s)', (pagina) => {
    expect(lerContextoListagem(new URLSearchParams({ pagina })).pagina).toBe(1)
  })

  it('ignora acessibilidade e ordem desconhecidas', () => {
    const params = new URLSearchParams('acessibilidade=toString&ordem=qualquer')
    const contexto = lerContextoListagem(params)

    expect(contexto.acessibilidade).toBe('')
    expect(contexto.ordem).toBe('asc')
  })
})

describe('escreverContextoListagem', () => {
  it('omite valores padrão e mantém a URL curta', () => {
    const params = escreverContextoListagem(new URLSearchParams(), { termoBusca: 'museu', pagina: 2 })

    expect(params.toString()).toBe('busca=museu&pagina=2')
  })

  it('remove o parâmetro quando o valor volta ao padrão', () => {
    const params = escreverContextoListagem(new URLSearchParams('busca=museu&ordem=desc'), { ordem: 'asc' })

    expect(params.toString()).toBe('busca=museu')
  })

  it('preserva parâmetros que não pertencem à listagem', () => {
    const params = escreverContextoListagem(new URLSearchParams('utm=1'), { categoria: 'cafe' })

    expect(params.get('utm')).toBe('1')
    expect(params.get('categoria')).toBe('cafe')
  })
})

describe('obterCaminhoRetorno', () => {
  it('devolve a origem quando ela é a listagem, com ou sem query', () => {
    expect(obterCaminhoRetorno({ origem: '/locais' })).toBe('/locais')
    expect(obterCaminhoRetorno({ origem: '/locais?busca=cafe&pagina=2' })).toBe('/locais?busca=cafe&pagina=2')
  })

  it.each([
    undefined,
    null,
    {},
    { origem: 42 },
    { origem: 'https://exemplo.com' },
    { origem: '//exemplo.com' },
    { origem: '/locais/1' },
    { origem: '/locaisx' },
    { origem: '/sobre' },
  ])('cai em /locais quando o state não é uma origem válida (%j)', (state) => {
    expect(obterCaminhoRetorno(state)).toBe('/locais')
  })
})
