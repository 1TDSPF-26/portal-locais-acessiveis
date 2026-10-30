import type { Endereco } from '../types/Local'

const TEXTOS_GENERICOS = [
  'nao informado',
  'nao informada',
  'sem informacao',
  'nao disponivel',
  'nao consta',
]

function normalizar(texto: string): string {
  return texto
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
}

function limpar(valor?: string | number | null): string {
  if (valor == null) {
    return ''
  }

  const texto = String(valor).trim()
  const normalizado = normalizar(texto)

  const ehGenerico =
    normalizado === '-' ||
    TEXTOS_GENERICOS.some((generico) => normalizado.includes(generico))

  return ehGenerico ? '' : texto
}

export function formatarEndereco(endereco?: Endereco): string | null {
  if (!endereco) {
    return null
  }

  const { rua, numero, cidade, estado } = endereco
  const ruaENumero = [limpar(rua), limpar(numero)].filter(Boolean).join(', ')
  const partes = [ruaENumero, limpar(cidade), limpar(estado)].filter(Boolean)

  return partes.length > 0 ? partes.join(' - ') : null
}

export function temEnderecoSuficiente(endereco?: Endereco): boolean {
  return Boolean(limpar(endereco?.rua))
}