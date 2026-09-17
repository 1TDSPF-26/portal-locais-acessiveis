import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, describe, expect, it, vi } from 'vitest'
import AppRoutes from '../routes/AppRoutes'
import { AccessibilityProvider } from '../contexts/AccessibilityContext'

function renderRoutes(initialEntry: string) {
  return render(
    <AccessibilityProvider>
      <MemoryRouter initialEntries={[initialEntry]}>
        <AppRoutes />
      </MemoryRouter>
    </AccessibilityProvider>,
  )
}

afterEach(() => {
  vi.restoreAllMocks()
})

describe('Navegação principal', () => {
  it('exibe a página Home na rota inicial', () => {
    renderRoutes('/')

    const headings = screen.getAllByRole('heading', {
      name: 'Portal de Locais e Serviços Acessíveis',
      level: 1,
    })

    expect(headings.length).toBeGreaterThanOrEqual(1)
  })

  it('navega da Home para a página Locais pelo menu sem depender da API externa', async () => {
    const user = userEvent.setup()

    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(JSON.stringify({ elements: [] }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }),
    )

    renderRoutes('/')

    await user.click(
      screen.getByRole('link', {
        name: 'Locais',
      }),
    )

    expect(
  await screen.findByRole('heading', {
    name: 'Nenhum local encontrado.',
    level: 2,
  }),
).toBeInTheDocument()
  })

  it('exibe a página NotFound ao acessar uma rota inexistente', () => {
  renderRoutes('/rota-inexistente')

  expect(
    screen.getByRole('heading', {
      name: 'Erro - 404',
      level: 2,
    }),
  ).toBeInTheDocument()
})
})