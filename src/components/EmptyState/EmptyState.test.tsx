import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { EmptyState } from './EmptyState'

describe('EmptyState', () => {
  it('exibe o título e a mensagem padrão', () => {
    render(<EmptyState />)

    expect(
      screen.getByRole('heading', {
        name: 'Nenhum resultado encontrado',
        level: 2,
      }),
    ).toBeInTheDocument()

    expect(screen.getByRole('status')).toHaveTextContent(
      'Não há informações disponíveis no momento.',
    )
  })

  it('exibe um título personalizado mantendo a mensagem padrão', () => {
    render(<EmptyState title="Nenhum local disponível" />)

    expect(
      screen.getByRole('heading', {
        name: 'Nenhum local disponível',
        level: 2,
      }),
    ).toBeInTheDocument()

    expect(
      screen.queryByRole('heading', {
        name: 'Nenhum resultado encontrado',
      }),
    ).not.toBeInTheDocument()

    expect(screen.getByRole('status')).toHaveTextContent(
      'Não há informações disponíveis no momento.',
    )
  })

  it('exibe uma mensagem personalizada mantendo o título padrão', () => {
    render(<EmptyState message="Tente buscar por outro nome." />)

    expect(
      screen.getByRole('heading', {
        name: 'Nenhum resultado encontrado',
        level: 2,
      }),
    ).toBeInTheDocument()

    expect(screen.getByRole('status')).toHaveTextContent(
      'Tente buscar por outro nome.',
    )

    expect(
      screen.queryByText('Não há informações disponíveis no momento.'),
    ).not.toBeInTheDocument()
  })

  it('utiliza status e aria-live polite para comunicar o estado vazio', () => {
    render(<EmptyState />)

    expect(screen.getByRole('status')).toHaveAttribute('aria-live', 'polite')
  })

  it('não exibe botão quando nenhuma ação é fornecida', () => {
    render(<EmptyState />)

    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })

  it('não exibe botão quando recebe apenas actionLabel', () => {
    render(<EmptyState actionLabel="Limpar busca" />)

    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })

  it('não exibe botão nem executa a ação quando recebe apenas onAction', () => {
    const onAction = vi.fn()

    render(<EmptyState onAction={onAction} />)

    expect(screen.queryByRole('button')).not.toBeInTheDocument()
    expect(onAction).not.toHaveBeenCalled()
  })

  it('não exibe botão nem executa a ação quando o rótulo está vazio', () => {
    const onAction = vi.fn()

    render(<EmptyState actionLabel="" onAction={onAction} />)

    expect(screen.queryByRole('button')).not.toBeInTheDocument()
    expect(onAction).not.toHaveBeenCalled()
  })

  it('exibe o rótulo informado e executa onAction somente após o clique', async () => {
    const user = userEvent.setup()
    const onAction = vi.fn()

    render(
      <EmptyState actionLabel="Limpar busca" onAction={onAction} />,
    )

    const button = screen.getByRole('button', {
      name: 'Limpar busca',
    })

    expect(button).toBeVisible()
    expect(onAction).not.toHaveBeenCalled()

    await user.click(button)

    expect(onAction).toHaveBeenCalledTimes(1)
  })
})