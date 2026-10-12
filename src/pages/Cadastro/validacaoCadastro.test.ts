import { describe, it, expect } from 'vitest'
import { listarCamposInvalidos, validarCadastro } from './validacaoCadastro'

const valido = {
  nome: 'Café Acessível',
  categoria: 'Restaurante',
  descricao: 'Tem rampa e banheiro adaptado.',
  rua: 'Rua Augusta',
  cidade: 'São Paulo',
  estado: 'SP',
  statusAcessibilidade: 'acessivel',
}

describe('validarCadastro', () => {
  it('aceita formulário válido', () => {
    expect(validarCadastro(valido)).toEqual({})
  })

  it('marca todos os campos obrigatórios vazios', () => {
    const erros = validarCadastro({
      ...valido,
      nome: '',
      categoria: '',
      descricao: '',
      rua: '',
      cidade: '',
      estado: '',
    })

    expect(Object.keys(erros).sort()).toEqual([
      'categoria',
      'cidade',
      'descricao',
      'estado',
      'nome',
      'rua',
    ])
  })

  it('rejeita nome com menos de 3 caracteres', () => {
    expect(validarCadastro({ ...valido, nome: 'Al' })).toHaveProperty('nome')
    expect(validarCadastro({ ...valido, nome: 'Ana' })).toEqual({})
  })

  it('rejeita descrição acima de 300 caracteres', () => {
    expect(validarCadastro({ ...valido, descricao: 'a'.repeat(300) })).toEqual({})
    expect(validarCadastro({ ...valido, descricao: 'a'.repeat(301) })).toHaveProperty('descricao')
  })

  it('rejeita acessibilidade nao_informado', () => {
    const erros = validarCadastro({ ...valido, statusAcessibilidade: 'nao_informado' })

    expect(erros).toHaveProperty('statusAcessibilidade')
  })
})

describe('listarCamposInvalidos', () => {
  it('devolve os campos na ordem do formulário', () => {
    const erros = {
      statusAcessibilidade: 'erro',
      estado: 'erro',
      cidade: 'erro',
      rua: 'erro',
      descricao: 'erro',
      categoria: 'erro',
      nome: 'erro',
    }

    expect(listarCamposInvalidos(erros)).toEqual([
      'nome',
      'categoria',
      'descricao',
      'rua',
      'cidade',
      'estado',
      'statusAcessibilidade',
    ])
  })
})