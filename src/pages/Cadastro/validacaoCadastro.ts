export const CAMPOS_EM_ORDEM = [
  'nome',
  'categoria',
  'descricao',
  'rua',
  'cidade',
  'estado',
  'statusAcessibilidade',
] as const

export type CampoCadastro = (typeof CAMPOS_EM_ORDEM)[number]

/** Rótulo legível de cada campo, reaproveitado no resumo de erros. */
export const ROTULOS_CAMPOS: Record<CampoCadastro, string> = {
  nome: 'Nome do local',
  categoria: 'Categoria',
  descricao: 'Descrição do local',
  rua: 'Rua',
  cidade: 'Cidade',
  estado: 'Estado',
  statusAcessibilidade: 'Nível de acessibilidade',
}

/** Identificador do elemento de cada campo no HTML, usado pelo resumo de erros. */
export const IDS_CAMPOS: Record<CampoCadastro, string> = {
  nome: 'nome-local',
  categoria: 'categoria-local',
  descricao: 'descricao-local',
  rua: 'rua-local',
  cidade: 'cidade-local',
  estado: 'estado-local',
  statusAcessibilidade: 'status-acessibilidade',
}

/** Valores do formulário considerados pelas regras de validação. */
export interface ValoresCadastro {
  nome: string
  categoria: string
  descricao: string
  rua: string
  cidade: string
  estado: string
  statusAcessibilidade: string
}

export type ErrosCadastro = Partial<Record<CampoCadastro, string>>

const LIMITE_DESCRICAO = 300

/** Aplica as regras de validação e devolve uma mensagem por campo inválido.
 * As regras são simples e cobrem apenas os campos obrigatórios do formulário. */
export function validarCadastro(valores: ValoresCadastro): ErrosCadastro {
  const erros: ErrosCadastro = {}

  const nome = valores.nome.trim()
  if (nome === '') {
    erros.nome = 'Informe o nome do local.'
  } else if (nome.length < 3) {
    erros.nome = 'O nome do local precisa ter pelo menos 3 caracteres.'
  }

  if (valores.categoria.trim() === '') {
    erros.categoria = 'Informe a categoria do local, como restaurante ou escola.'
  }

  const descricao = valores.descricao.trim()
  if (descricao === '') {
    erros.descricao = 'Descreva o local para ajudar outras pessoas a identificá-lo.'
  } else if (descricao.length > LIMITE_DESCRICAO) {
    erros.descricao = `A descrição do local deve ter no máximo ${LIMITE_DESCRICAO} caracteres.`
  }

  if (valores.rua.trim() === '') {
    erros.rua = 'Informe a rua onde o local está situado.'
  }

  if (valores.cidade.trim() === '') {
    erros.cidade = 'Informe a cidade do local.'
  }

  if (valores.estado.trim() === '') {
    erros.estado = 'Informe o estado do local.'
  }

  if (valores.statusAcessibilidade === 'nao_informado') {
    erros.statusAcessibilidade =
      'Selecione o nível de acessibilidade do local. A opção Não informado não é aceita no cadastro.'
  }

  return erros
}

/** Devolve os campos inválidos na mesma ordem em que aparecem no formulário. */
export function listarCamposInvalidos(erros: ErrosCadastro): CampoCadastro[] {
  return CAMPOS_EM_ORDEM.filter((campo) => Boolean(erros[campo]))
}