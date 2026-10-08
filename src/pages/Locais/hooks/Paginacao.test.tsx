import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { Paginacao } from './Paginacao'

describe('Paginacao', () => {
  it('desabilita o botão Anterior na primeira página', () => {
    render(
      <Paginacao
        paginaAtual={1}
        totalPaginas={3}
        temAnterior={false}
        temProxima={true}
        paginaAnterior={vi.fn()}
        proximaPagina={vi.fn()}
        setPaginaAtual={vi.fn()}
      />
    )

    expect(
      screen.getByRole('button', { name: 'Anterior' })
    ).toBeDisabled()
  })

  it('desabilita o botão Próxima na última página', () => {
    render(
      <Paginacao
        paginaAtual={3}
        totalPaginas={3}
        temAnterior={true}
        temProxima={false}
        paginaAnterior={vi.fn()}
        proximaPagina={vi.fn()}
        setPaginaAtual={vi.fn()}
      />
    )

    expect(
      screen.getByRole('button', { name: 'Próxima' })
    ).toBeDisabled()
  })

  it('marca a página atual com aria-current', () => {
    render(
      <Paginacao
        paginaAtual={2}
        totalPaginas={3}
        temAnterior={true}
        temProxima={true}
        paginaAnterior={vi.fn()}
        proximaPagina={vi.fn()}
        setPaginaAtual={vi.fn()}
      />
    )

    expect(
      screen.getByRole('button', { name: '2' })
    ).toHaveAttribute('aria-current', 'page')
  })

  it('chama setPaginaAtual ao clicar em uma página', async () => {
    const user = userEvent.setup()
    const setPaginaAtual = vi.fn()

    render(
      <Paginacao
        paginaAtual={1}
        totalPaginas={3}
        temAnterior={false}
        temProxima={true}
        paginaAnterior={vi.fn()}
        proximaPagina={vi.fn()}
        setPaginaAtual={setPaginaAtual}
      />
    )

    await user.click(
      screen.getByRole('button', { name: '2' })
    )

    expect(setPaginaAtual).toHaveBeenCalledWith(2)
  })
})