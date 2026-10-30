
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { OrigemLocal } from './OrigemLocal'

describe('OrigemLocal', () => {
    it('exibe a origem real dos dados', () => {
        render(<OrigemLocal origem="openstreetmap" />)

        expect(
            screen.getByText(/Fonte dos dados:/),
        ).toBeInTheDocument()

        expect(
            screen.getByRole('link', { name: 'OpenStreetMap' }),
        ).toBeInTheDocument()
    })

    it('apresenta o link correto da fonte', () => {
        render(<OrigemLocal origem="openstreetmap" />)

        const link = screen.getByRole('link', {
            name: 'OpenStreetMap',
        })

        expect(link).toHaveAttribute(
            'href',
            'https://www.openstreetmap.org/copyright',
        )
    })

    it('nao inventa uma fonte quando a origem nao existe', () => {
        render(<OrigemLocal />)

        expect(
            screen.getByText('Fonte dos dados: não informada'),
        ).toBeInTheDocument()

        expect(
            screen.queryByRole('link', { name: 'OpenStreetMap' }),
        ).not.toBeInTheDocument()
    })
})