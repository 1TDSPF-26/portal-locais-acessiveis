import { afterEach, describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { CompartilharEndereco } from './CompartilharEndereco'

const ENDERECO = 'Rua A, 10 - Santos - SP'

function mockarShare(impl: () => Promise<void>) {
    const share = vi.fn(impl)
    Object.defineProperty(navigator, 'share', {
        value: share,
        configurable: true,
    })
    return share
}

afterEach(() => {
    Reflect.deleteProperty(navigator, 'share')
    vi.restoreAllMocks()
})

describe('CompartilharEndereco', () => {
    it('copia o endereço quando não há compartilhamento nativo', async () => {
        const user = userEvent.setup()
        const writeText = vi.spyOn(navigator.clipboard, 'writeText')

        render(<CompartilharEndereco endereco={ENDERECO} nomeLocal="Praça X" />)

        await user.click(screen.getByRole('button', { name: 'Copiar endereço' }))

        expect(writeText).toHaveBeenCalledWith(ENDERECO)
        expect(await screen.findByText(/endereço copiado/i)).toBeTruthy()
    })

    it('usa o compartilhamento nativo apenas com texto, sem URL', async () => {
        const user = userEvent.setup()
        const share = mockarShare(() => Promise.resolve())

        render(<CompartilharEndereco endereco={ENDERECO} nomeLocal="Praça X" />)

        await user.click(
            screen.getByRole('button', { name: 'Compartilhar endereço' }),
        )

        expect(share).toHaveBeenCalledTimes(1)
        const argumentos = share.mock.calls[0] as unknown[]
        expect(argumentos[0]).toEqual({ title: 'Praça X', text: ENDERECO })
        expect(argumentos[0]).not.toHaveProperty('url')
    })

    it('não copia nem mostra erro quando o usuário cancela o share', async () => {
        const user = userEvent.setup()
        mockarShare(() =>
            Promise.reject(new DOMException('cancelado', 'AbortError')),
        )
        const writeText = vi.spyOn(navigator.clipboard, 'writeText')

        render(<CompartilharEndereco endereco={ENDERECO} nomeLocal="Praça X" />)

        await user.click(
            screen.getByRole('button', { name: 'Compartilhar endereço' }),
        )

        expect(writeText).not.toHaveBeenCalled()
        expect(screen.getByRole('status').textContent).toBe('')
    })

    it('usa a cópia como fallback se o share falhar por outro motivo', async () => {
        const user = userEvent.setup()
        mockarShare(() => Promise.reject(new Error('falha')))
        const writeText = vi.spyOn(navigator.clipboard, 'writeText')

        render(<CompartilharEndereco endereco={ENDERECO} nomeLocal="Praça X" />)

        await user.click(
            screen.getByRole('button', { name: 'Compartilhar endereço' }),
        )

        expect(writeText).toHaveBeenCalledWith(ENDERECO)
    })

    it('funciona pelo teclado', async () => {
        const user = userEvent.setup()
        const writeText = vi.spyOn(navigator.clipboard, 'writeText')

        render(<CompartilharEndereco endereco={ENDERECO} nomeLocal="Praça X" />)

        await user.tab()
        expect(document.activeElement).toBe(
            screen.getByRole('button', { name: 'Copiar endereço' }),
        )

        await user.keyboard('{Enter}')
        expect(writeText).toHaveBeenCalledWith(ENDERECO)
    })
})