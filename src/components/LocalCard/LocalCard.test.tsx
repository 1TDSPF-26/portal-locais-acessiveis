import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, describe, expect, it, vi } from 'vitest'

import type { Local } from '../../types/Local'
import LocalCard from './LocalCard'

const local: Local = {
  id: 1,
  nome: 'Museu do Ipiranga',
  categoria: 'museum',
  coordenadas: {
    latitude: -23.5856,
    longitude: -46.6097,
  },
  acessibilidade: {
    status: 'parcial',
  },
}

describe('LocalCard', () => {
  it('exibe os dados principais do local', () => {
    render(
      <MemoryRouter>
        <LocalCard local={local} />
      </MemoryRouter>,
    )

    expect(
      screen.getByRole('heading', {
        name: 'Museu do Ipiranga',
        level: 2,
      }),
    ).toBeInTheDocument()

    expect(screen.getByText('Categoria: museum')).toBeInTheDocument()

    expect(
      screen.getByText('Acessibilidade: Parcialmente acessível'),
    ).toBeInTheDocument()
  })

  it('utiliza uma estrutura semântica para representar o local', () => {
    render(
      <MemoryRouter>
        <LocalCard local={local} />
      </MemoryRouter>,
    )

    expect(screen.getByRole('article')).toBeInTheDocument()
  })

    it('possui link para a página de detalhes do local', () => {
    render(
      <MemoryRouter>
        <LocalCard local={local} />
      </MemoryRouter>,
    )

    const link = screen.getByRole('link', { name: 'Museu do Ipiranga' })

    expect(link).toHaveAttribute('href', '/locais/1')
  })

  it('permite acessar o link pelo teclado', async () => {
    const user = userEvent.setup()

    render(
      <MemoryRouter>
        <LocalCard local={local} />
      </MemoryRouter>,
    )

    await user.tab()

    expect(
      screen.getByRole('link', { name: 'Museu do Ipiranga' }),
    ).toHaveFocus()
  })
})

describe('LocalCard - favoritos', () => {
  afterEach(() => {
    vi.restoreAllMocks()
    localStorage.clear()
  })

  function renderizarCard() {
    return render(
      <MemoryRouter>
        <LocalCard local={local} />
      </MemoryRouter>,
    )
  }

  function botaoFavorito() {
    return screen.getByRole('button', { name: 'Favoritar Museu do Ipiranga' })
  }

  it('favorita e desfavorita o local', async () => {
    const user = userEvent.setup()
    renderizarCard()

    expect(botaoFavorito()).toHaveAttribute('aria-pressed', 'false')

    await user.click(botaoFavorito())
    expect(botaoFavorito()).toHaveAttribute('aria-pressed', 'true')
    expect(localStorage.getItem('locais_favoritos')).toBe('[1]')

    await user.click(botaoFavorito())
    expect(botaoFavorito()).toHaveAttribute('aria-pressed', 'false')
    expect(localStorage.getItem('locais_favoritos')).toBe('[]')
  })

  it('restaura o favorito salvo ao carregar', () => {
    localStorage.setItem('locais_favoritos', '[1]')

    renderizarCard()

    expect(botaoFavorito()).toHaveAttribute('aria-pressed', 'true')
  })

  it('permite favoritar pelo teclado', async () => {
    const user = userEvent.setup()
    renderizarCard()

    await user.tab()
    await user.tab()
    expect(botaoFavorito()).toHaveFocus()

    await user.keyboard('{Enter}')
    expect(botaoFavorito()).toHaveAttribute('aria-pressed', 'true')

    await user.keyboard(' ')
    expect(botaoFavorito()).toHaveAttribute('aria-pressed', 'false')
  })

  it('continua funcionando quando o localStorage falha', async () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('Armazenamento indisponível')
    })
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('Armazenamento indisponível')
    })
    const user = userEvent.setup()

    renderizarCard()
    await user.click(botaoFavorito())

    expect(botaoFavorito()).toHaveAttribute('aria-pressed', 'true')
  })
})
