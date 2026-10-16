import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { WarningMessage } from '../components/WarningMessage/WarningMessage'

describe('WarningMessage', () => {
    it('exibe a mensagem padrão quando nenhuma é fornecida', () => {
        render(<WarningMessage />)

        expect(screen.getByRole('status')).toHaveTextContent(
            'Algumas informações podem estar incompletas ou desatualizadas.',
        )
    })

    it('exibe a mensagem fornecida', () => {
        render(<WarningMessage message="Dados de localização limitados." />)

        expect(screen.getByText('Dados de localização limitados.')).toBeInTheDocument()
    })

    it('exibe o título quando fornecido', () => {
        render(<WarningMessage title="Atenção" message="Teste." />)

        expect(
            screen.getByRole('heading', { name: 'Atenção', level: 2 }),
        ).toBeInTheDocument()
    })

    it('não exibe título quando não fornecido', () => {
        render(<WarningMessage message="Teste." />)

        expect(screen.queryByRole('heading')).not.toBeInTheDocument()
    })

    it('identifica o aviso com texto, sem depender de cor', () => {
        render(<WarningMessage message="Teste." />)

        expect(screen.getByText('Aviso')).toBeInTheDocument()
    })
})