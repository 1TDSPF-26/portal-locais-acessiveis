import { render, screen, within } from '@testing-library/react'
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
      within(
        screen.getByRole('navigation', {
          name: 'Menu Principal',
        }),
      ).getByRole('link', {
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
        level: 1,
      }),
    ).toBeInTheDocument()
  })

  it('exibe os links internos corretos no Footer', () => {
    renderRoutes('/')

    const footer = within(
      screen.getByRole('navigation', {
        name: 'Navegação do rodapé',
      }),
    )

    expect(footer.getByRole('link', { name: 'Home' }))
      .toHaveAttribute('href', '/')

    expect(footer.getByRole('link', { name: 'Locais' }))
      .toHaveAttribute('href', '/locais')

    expect(footer.getByRole('link', { name: 'Cadastro' }))
      .toHaveAttribute('href', '/cadastrar')

    expect(footer.getByRole('link', { name: 'Sobre' }))
      .toHaveAttribute('href', '/sobre')

    expect(
      footer.getByRole('link', { name: 'Acessibilidade',}),
    ).toHaveAttribute('href', '/acessibilidade')
  })

  it('navega do Footer para a página de acessibilidade', async () => {
  const user = userEvent.setup()

  renderRoutes('/')

  await user.click(
    within(
      screen.getByRole('navigation', {
        name: 'Navegação do rodapé',
      }),
    ).getByRole('link', {
      name: 'Acessibilidade',
    }),
  )

  expect(
    await screen.findByRole('heading', {
      name: 'Acessibilidade no Portal de Locais e Serviços Acessíveis',
      level: 1,
    }),
  ).toBeInTheDocument()
})


it('move o foco para o conteúdo principal ao navegar entre páginas', async () => {
  const user = userEvent.setup()

  renderRoutes('/')

  await user.click(
    within(
      screen.getByRole('navigation', {
        name: 'Menu Principal',
      }),
    ).getByRole('link', {
      name: 'Sobre',
    }),
  )

  const main = await screen.findByRole('main')

  expect(main).toHaveFocus()
  })

  it('nao move o foco para o conteudo principal no carregamento inicial', () => {
    renderRoutes('/')
    
    const main = screen.getByRole('main')

    expect(main).not.toHaveFocus()
  })
  it('move o foco para o conteúdo principal ao navegar com teclado (Tab + Enter)', async () => {
  const user = userEvent.setup()

  renderRoutes('/')

  const menu = within(
    screen.getByRole('navigation', { name: 'Menu Principal' }),
  )

  menu.getByRole('link', { name: 'Sobre' }).focus()
  await user.keyboard('{Enter}')

  expect(await screen.findByRole('main')).toHaveFocus()
})

it('mantém o skip link funcionando e sem trocar de rota', async () => {
  const user = userEvent.setup()

  renderRoutes('/')

  await user.tab()

  const skipLink = screen.getByRole('link', {
    name: 'Pular para o conteúdo principal',
  })

  expect(skipLink).toHaveFocus()
  expect(skipLink).toHaveAttribute('href', '#conteudo-principal')

  await user.keyboard('{Enter}')

  expect(
    screen.getByRole('heading', {
      name: 'Portal de Locais e Serviços Acessíveis',
      level: 1,
    }),
  ).toBeInTheDocument()
})

it('não move o foco para o main ao navegar por âncora na mesma página', async () => {
  const user = userEvent.setup()

  renderRoutes('/')

  const skipLink = screen.getByRole('link', {
    name: 'Pular para o conteúdo principal',
  })

  skipLink.focus()
  await user.keyboard('{Enter}')

  expect(window.location.pathname).toBe('/')
})
})
