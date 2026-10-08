import type { Acessibilidade, Local } from '../types/Local'

export type StatusAcessibilidade = Acessibilidade['status']
export type OrdemNome = 'asc' | 'desc'

/** Critérios aplicados à listagem de locais. String vazia em categoria/acessibilidade significa "todas". */
export interface CriteriosLocais {
  termoBusca: string
  categoria: string
  acessibilidade: StatusAcessibilidade | ''
  ordem: OrdemNome
}

export const CRITERIOS_PADRAO: CriteriosLocais = {
  termoBusca: '',
  categoria: '',
  acessibilidade: '',
  ordem: 'asc',
}

export const ROTULOS_ACESSIBILIDADE: Record<StatusAcessibilidade, string> = {
  acessivel: 'Acessível',
  parcial: 'Parcialmente acessível',
  nao_acessivel: 'Não acessível',
  nao_informado: 'Não informado',
}

/** Lista as categorias distintas presentes nos locais, em ordem alfabética. */
export function obterCategorias(locais: Local[]): string[] {
  return [...new Set(locais.map((local) => local.categoria))].sort((a, b) =>
    a.localeCompare(b, 'pt-BR'),
  )
}

/** Deriva uma nova lista a partir da original, sem alterá-la, aplicando busca, filtros e ordenação. */
export function filtrarLocais(locais: Local[], criterios: CriteriosLocais): Local[] {
  const termo = criterios.termoBusca.toLowerCase()

  const filtrados = locais.filter(
    (local) =>
      local.nome.toLowerCase().includes(termo) &&
      (criterios.categoria === '' || local.categoria === criterios.categoria) &&
      (criterios.acessibilidade === '' || local.acessibilidade.status === criterios.acessibilidade),
  )

  const direcao = criterios.ordem === 'asc' ? 1 : -1

  return filtrados.sort((a, b) => direcao * a.nome.localeCompare(b.nome, 'pt-BR', { sensitivity: 'base' }))
}