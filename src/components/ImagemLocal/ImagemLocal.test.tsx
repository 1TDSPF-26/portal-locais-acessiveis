import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import ImagemLocal from './ImagemLocal'

describe('ImagemLocal', () => {
  it('renderiza a imagem com alt, lazy loading e dimensões', () => {
    render(<ImagemLocal src="https://exemplo.com/foto.jpg" nome="Museu" />)

    const img = screen.getByRole('img', { name: 'Foto do local Museu' })

    expect(img).toHaveAttribute('src', 'https://exemplo.com/foto.jpg')
    expect(img).toHaveAttribute('loading', 'lazy')
    expect(img).toHaveAttribute('width')
    expect(img).toHaveAttribute('height')
  })

  it.each([undefined, '', '   '])('não renderiza nada sem imagem (%j)', (src) => {
    const { container } = render(<ImagemLocal src={src} nome="Museu" />)

    expect(screen.queryByRole('img')).not.toBeInTheDocument()
    expect(container).toBeEmptyDOMElement()
  })

  it('remove a imagem quando o carregamento falha', () => {
    const { container } = render(
      <ImagemLocal src="https://exemplo.com/quebrada.jpg" nome="Museu" />,
    )

    fireEvent.error(screen.getByRole('img'))

    expect(screen.queryByRole('img')).not.toBeInTheDocument()
    expect(container).toBeEmptyDOMElement()
  })

  it('tenta carregar de novo quando a URL muda após uma falha', () => {
    const { rerender } = render(
      <ImagemLocal src="https://exemplo.com/a.jpg" nome="Museu" />,
    )

    fireEvent.error(screen.getByRole('img'))
    rerender(<ImagemLocal src="https://exemplo.com/b.jpg" nome="Museu" />)

    expect(screen.getByRole('img')).toHaveAttribute(
      'src',
      'https://exemplo.com/b.jpg',
    )
  })
})