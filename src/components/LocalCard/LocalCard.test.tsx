import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'

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
})
