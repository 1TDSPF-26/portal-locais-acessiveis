import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { ContagemResultados } from './ContagemResultados'

describe('ContagemResultados', () => {
  it('exibe o total de resultados encontrados', () => {
    render(<ContagemResultados total={42} />)

    expect(screen.getByRole('status')).toHaveTextContent('42 locais encontrados')
  })

  it('usa o singular quando existe apenas um resultado', () => {
    render(<ContagemResultados total={1} />)

    expect(screen.getByRole('status')).toHaveTextContent('1 local encontrado')
  })

  it('informa quando nenhum resultado foi encontrado', () => {
    render(<ContagemResultados total={0} />)

    expect(screen.getByRole('status')).toHaveTextContent('Nenhum local encontrado')
  })

  it('anuncia a contagem com aria-live polite', () => {
    render(<ContagemResultados total={3} />)

    expect(screen.getByRole('status')).toHaveAttribute('aria-live', 'polite')
  })

  it('mantém a mesma mensagem quando apenas a página muda', () => {
    const { rerender } = render(<ContagemResultados total={42} />)
    const mensagem = screen.getByRole('status').textContent

    // Trocar de página não altera o total, então o anúncio não se repete.
    rerender(<ContagemResultados total={42} />)

    expect(screen.getByRole('status').textContent).toBe(mensagem)
    expect(screen.getByRole('status')).not.toHaveTextContent('Página')
  })

  it('atualiza a mensagem quando a busca ou os filtros reduzem os resultados', () => {
    const { rerender } = render(<ContagemResultados total={42} />)

    rerender(<ContagemResultados total={5} />)

    expect(screen.getByRole('status')).toHaveTextContent('5 locais encontrados')
  })
})
