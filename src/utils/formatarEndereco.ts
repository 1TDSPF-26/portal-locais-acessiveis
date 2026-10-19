import type { Endereco } from '../types/Local'

function limpar(valor?: string | number | null): string {
    return valor == null ? '' : String(valor).trim()
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
    return Boolean(limpar(endereco?.rua) || limpar(endereco?.cidade))
}