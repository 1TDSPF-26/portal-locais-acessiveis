import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import AppRoutes from '../routes/AppRoutes'

describe('Navegação principal', () => {
  it('exibe a página Home na rota inicial', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <AppRoutes />
      </MemoryRouter>,
    )

    const headings = screen.getAllByRole('heading', {
      name: 'Portal de Locais e Serviços Acessíveis',
      level: 1,
    })

    expect(headings.length).toBeGreaterThanOrEqual(2)
  })

  it('navega da Home para a página Locais pelo menu', async () => {
    const user = userEvent.setup()

    render(
      <MemoryRouter initialEntries={['/']}>
        <AppRoutes />
      </MemoryRouter>,
    )

    await user.click(
      screen.getByRole('link', {
        name: 'Locais',
      }),
    )

    expect(
      screen.getByRole('heading', {
        name: 'Locais',
        level: 1,
      }),
    ).toBeInTheDocument()
  })

  it('exibe a página NotFound ao acessar uma rota inexistente', () => {
    render(
      <MemoryRouter initialEntries={['/rota-inexistente']}>
        <AppRoutes />
      </MemoryRouter>,
    )

    expect(
      screen.getByRole('heading', {
        name: 'Erro - 404',
        level: 2,
      }),
    ).toBeInTheDocument()
  })
})