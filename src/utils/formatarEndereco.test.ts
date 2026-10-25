import { describe, it, expect } from 'vitest'
import { formatarEndereco, temEnderecoSuficiente } from './formatarEndereco'

describe('formatarEndereco', () => {
    it('monta o endereço completo', () => {
        expect(
            formatarEndereco({
                rua: 'Av. Paulista',
                numero: '1000',
                cidade: 'São Paulo',
                estado: 'SP',
            }),
        ).toBe('Av. Paulista, 1000 - São Paulo - SP')
    })

    it('não gera separadores vazios em endereço parcial', () => {
        expect(
            formatarEndereco({ rua: 'Rua A', numero: '', cidade: 'Santos', estado: '' }),
        ).toBe('Rua A - Santos')
    })

    it('trata espaços em branco como vazio', () => {
        expect(
            formatarEndereco({ rua: '   ', numero: '', cidade: 'Santos', estado: ' ' }),
        ).toBe('Santos')
    })

    it('retorna null sem endereço ou com tudo vazio', () => {
        expect(formatarEndereco(undefined)).toBeNull()
        expect(
            formatarEndereco({ rua: '', numero: '', cidade: '', estado: '' }),
        ).toBeNull()
    })
    it('ignora textos genéricos como "não informado"', () => {
        expect(
            formatarEndereco({
                rua: 'Rua não informada',
                numero: 'Número não informado',
                cidade: 'São Paulo',
                estado: 'SP',
            }),
        ).toBe('São Paulo - SP')
    })

    it('retorna null quando todos os campos são genéricos', () => {
        expect(
            formatarEndereco({
                rua: 'Rua não informada',
                numero: 'Número não informado',
                cidade: 'NÃO INFORMADA',
                estado: '-',
            }),
        ).toBeNull()
    })
})

describe('temEnderecoSuficiente', () => {
    it('é true com rua válida', () => {
        expect(temEnderecoSuficiente({ rua: 'Rua A' })).toBe(true)
    })

    it('é false sem rua válida', () => {
        expect(temEnderecoSuficiente({ cidade: 'Santos' })).toBe(false)
        expect(temEnderecoSuficiente({ estado: 'SP' })).toBe(false)
        expect(temEnderecoSuficiente({ rua: '  ' })).toBe(false)
        expect(temEnderecoSuficiente(undefined)).toBe(false)
    })

    it('é false quando a rua é um texto genérico', () => {
        expect(
            temEnderecoSuficiente({ rua: 'Rua não informada', cidade: 'São Paulo' }),
        ).toBe(false)
    })
})