import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Cadastro from './Cadastro'

describe('Cadastro com dados inválidos', () => {
  it('mostra os erros e foca o nome', async () => {
    const user = userEvent.setup()
    render(<Cadastro />)

    await user.click(screen.getByRole('button', { name: /enviar cadastro/i }))

    expect(screen.getByText('Encontramos 7 erros no formulário')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /nome do local/i })).toBeInTheDocument()
    expect(screen.getByLabelText(/^nome/i)).toHaveAttribute('aria-invalid', 'true')
    expect(screen.getByLabelText(/^nome/i)).toHaveFocus()
  })

  it('foca o primeiro campo inválido, não o primeiro da tela', async () => {
    const user = userEvent.setup()
    render(<Cadastro />)

    await user.type(screen.getByLabelText(/^nome/i), 'Café Acessível')
    await user.type(screen.getByLabelText(/^categoria/i), 'Restaurante')
    await user.click(screen.getByRole('button', { name: /enviar cadastro/i }))

    expect(screen.getByText('Encontramos 5 erros no formulário')).toBeInTheDocument()
    expect(screen.getByLabelText(/^descrição do local/i)).toHaveFocus()
  })
})