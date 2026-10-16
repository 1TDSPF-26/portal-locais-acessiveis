import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { LoadingState } from './LoadingState'

describe('LoadingState', () => {
  it('exibe a mensagem padrão de carregamento', () => {
    render(<LoadingState />)

    expect(screen.getByRole('status')).toHaveTextContent(
      'Carregando informações. Por favor, aguarde.',
    )
  })

  it('exibe uma mensagem personalizada no lugar da mensagem padrão', () => {
    render(<LoadingState message="Carregando locais acessíveis..." />)

    expect(screen.getByRole('status')).toHaveTextContent(
      'Carregando locais acessíveis...',
    )

    expect(
      screen.queryByText('Carregando informações. Por favor, aguarde.'),
    ).not.toBeInTheDocument()
  })

  it('utiliza status e aria-live polite para comunicar o carregamento', () => {
    render(<LoadingState />)

    expect(screen.getByRole('status')).toHaveAttribute('aria-live', 'polite')
  })
})