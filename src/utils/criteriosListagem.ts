import {
  CRITERIOS_PADRAO,
  ROTULOS_ACESSIBILIDADE,
  type CriteriosLocais,
  type OrdemNome,
  type StatusAcessibilidade,
} from './filtrarLocais'

/** Critérios da listagem + página atual. Este é o "contexto" preservado na URL de /locais. */
export interface ContextoListagem extends CriteriosLocais {
  pagina: number
}

export const CONTEXTO_PADRAO: ContextoListagem = { ...CRITERIOS_PADRAO, pagina: 1 }

export const ROTA_LISTAGEM = '/locais'

const PARAMETROS = {
  termoBusca: 'busca',
  categoria: 'categoria',
  acessibilidade: 'acessibilidade',
  ordem: 'ordem',
  pagina: 'pagina',
} as const

function statusValido(valor: string | null): valor is StatusAcessibilidade {
  return valor !== null && Object.hasOwn(ROTULOS_ACESSIBILIDADE, valor)
}

function paginaValida(valor: string | null): number {
  if (valor === null || !/^\d+$/.test(valor)) {
    return 1
  }
  return Math.max(1, Number(valor))
}

/** Lê o contexto da URL. Valores ausentes ou inválidos voltam ao padrão, então uma URL adulterada nunca quebra a página. */
export function lerContextoListagem(params: URLSearchParams): ContextoListagem {
  const acessibilidade = params.get(PARAMETROS.acessibilidade)
  const ordem = params.get(PARAMETROS.ordem)

  return {
    termoBusca: params.get(PARAMETROS.termoBusca) ?? CONTEXTO_PADRAO.termoBusca,
    categoria: params.get(PARAMETROS.categoria) ?? CONTEXTO_PADRAO.categoria,
    acessibilidade: statusValido(acessibilidade) ? acessibilidade : CONTEXTO_PADRAO.acessibilidade,
    ordem: (ordem === 'desc' ? 'desc' : 'asc') satisfies OrdemNome,
    pagina: paginaValida(params.get(PARAMETROS.pagina)),
  }
}

/** Aplica alterações parciais aos parâmetros. Valores iguais ao padrão são omitidos para manter a URL curta. */
export function escreverContextoListagem(
  params: URLSearchParams,
  alteracoes: Partial<ContextoListagem>,
): URLSearchParams {
  const proximo = new URLSearchParams(params)
  const novo = { ...lerContextoListagem(params), ...alteracoes }

  for (const chave of Object.keys(PARAMETROS) as (keyof typeof PARAMETROS)[]) {
    const valor = novo[chave]
    if (valor === CONTEXTO_PADRAO[chave]) {
      proximo.delete(PARAMETROS[chave])
    } else {
      proximo.set(PARAMETROS[chave], String(valor))
    }
  }

  return proximo
}

/**
 * Define para onde o link "Voltar" do detalhe leva. Só aceita caminhos da própria listagem
 * (ex.: "/locais?busca=cafe"); qualquer outra coisa cai em "/locais".
 */
export function obterCaminhoRetorno(state: unknown): string {
  const origem = (state as { origem?: unknown } | null)?.origem

  if (
    typeof origem === 'string' &&
    (origem === ROTA_LISTAGEM || origem.startsWith(`${ROTA_LISTAGEM}?`))
  ) {
    return origem
  }

  return ROTA_LISTAGEM
}
