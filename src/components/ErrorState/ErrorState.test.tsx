import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { ErrorState } from './ErrorState'

describe('ErrorState', () => {
  it('exibe o título e a mensagem padrão', () => {
    render(<ErrorState />)

    expect(
      screen.getByRole('heading', {
        name: 'Não foi possível carregar as informações',
        level: 2,
      }),
    ).toBeInTheDocument()

    expect(screen.getByRole('alert')).toHaveTextContent(
      'Ocorreu um problema ao carregar os dados. Tente novamente.',
    )
  })

  it('exibe um título personalizado mantendo a mensagem padrão', () => {
    render(<ErrorState title="Falha na consulta de locais" />)

    expect(
      screen.getByRole('heading', {
        name: 'Falha na consulta de locais',
        level: 2,
      }),
    ).toBeInTheDocument()

    expect(
      screen.queryByRole('heading', {
        name: 'Não foi possível carregar as informações',
      }),
    ).not.toBeInTheDocument()

    expect(screen.getByRole('alert')).toHaveTextContent(
      'Ocorreu um problema ao carregar os dados. Tente novamente.',
    )
  })

  it('exibe uma mensagem personalizada mantendo o título padrão', () => {
    render(<ErrorState message="Não conseguimos consultar os locais agora." />)

    expect(
      screen.getByRole('heading', {
        name: 'Não foi possível carregar as informações',
        level: 2,
      }),
    ).toBeInTheDocument()

    expect(screen.getByRole('alert')).toHaveTextContent(
      'Não conseguimos consultar os locais agora.',
    )

    expect(
      screen.queryByText(
        'Ocorreu um problema ao carregar os dados. Tente novamente.',
      ),
    ).not.toBeInTheDocument()
  })

  it('utiliza alert e aria-live assertive para comunicar o erro', () => {
    render(<ErrorState />)

    expect(screen.getByRole('alert')).toHaveAttribute('aria-live', 'assertive')
  })

  it('não exibe botão quando onRetry não é fornecido', () => {
    render(<ErrorState />)

    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })

  it('executa onRetry somente após clicar em Tentar novamente', async () => {
    const user = userEvent.setup()
    const onRetry = vi.fn()

    render(<ErrorState onRetry={onRetry} />)

    const button = screen.getByRole('button', {
      name: 'Tentar novamente',
    })

    expect(button).toBeVisible()
    expect(onRetry).not.toHaveBeenCalled()

    await user.click(button)

    expect(onRetry).toHaveBeenCalledTimes(1)
  })
})