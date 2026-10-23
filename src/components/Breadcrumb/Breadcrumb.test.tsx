import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'

import { Breadcrumb } from './Breadcrumb'

const itens = [
  { label: 'Home', to: '/' },
  { label: 'Locais', to: '/locais' },
  { label: 'Café Inclusivo' },
]

function renderBreadcrumb() {
  return render(
    <MemoryRouter>
      <Breadcrumb items={itens} />
    </MemoryRouter>,
  )
}

describe('Breadcrumb', () => {
  it('expõe uma navegação com nome acessível', () => {
    renderBreadcrumb()

    expect(
      screen.getByRole('navigation', { name: 'Trilha de navegação' }),
    ).toBeInTheDocument()
  })

   it('apresenta o caminho Home, Locais e local atual em uma lista', () => {
    renderBreadcrumb()

    const etapas = screen.getAllByRole('listitem')

    expect(etapas).toHaveLength(3)
    expect(etapas[0]).toHaveTextContent('Home')
    expect(etapas[1]).toHaveTextContent('Locais')
    expect(etapas[2]).toHaveTextContent('Café Inclusivo')
  })

  it('renderiza Home e Locais como links funcionais', () => {
    renderBreadcrumb()

    expect(screen.getByRole('link', { name: 'Home' })).toHaveAttribute('href', '/')
    expect(screen.getByRole('link', { name: 'Locais' })).toHaveAttribute(
      'href',
      '/locais',
    )
  })

  it('identifica a página atual sem transformá-la em link', () => {
    renderBreadcrumb()

    expect(
      screen.queryByRole('link', { name: 'Café Inclusivo' }),
    ).not.toBeInTheDocument()
    expect(screen.getByText('Café Inclusivo')).toHaveAttribute('aria-current', 'page')
  })

  it('permite navegar pelos links usando o teclado', async () => {
    const user = userEvent.setup()
    renderBreadcrumb()

    await user.tab()
    expect(screen.getByRole('link', { name: 'Home' })).toHaveFocus()

    await user.tab()
    expect(screen.getByRole('link', { name: 'Locais' })).toHaveFocus()
  })
  it('permite que o nome longo da página atual quebre linha', () => {
    const nomeLongo = 'Nomedelocalmuitolongosemespacosparatestarquebradelinha'

    render(
      <MemoryRouter>
        <Breadcrumb
          items={[
            { label: 'Home', to: '/' },
            { label: 'Locais', to: '/locais' },
            { label: nomeLongo },
          ]}
        />
      </MemoryRouter>,
    )

    const paginaAtual = screen.getByText(nomeLongo)

    expect(paginaAtual).toHaveClass('min-w-0', 'wrap-anywhere')
    expect(paginaAtual.closest('li')).toHaveClass('min-w-0')
  })

})
