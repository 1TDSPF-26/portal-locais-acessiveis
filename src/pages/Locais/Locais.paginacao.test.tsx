import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { OverpassElement } from '../../types/Overpass'
import Locais from './Locais'

// Com 10 itens por página, estes 25 locais formam três páginas: 10, 10 e 5 itens.
const elementos: OverpassElement[] = []
for (let numero = 1; numero <= 25; numero++) {
  elementos.push({
    id: numero,
    lat: 0,
    lon: 0,
    tags: {
      name: `Local ${100 + numero}`,
      amenity: numero <= 15 ? 'cafe' : 'library',
      wheelchair: numero <= 20 ? 'yes' : 'no',
    },
  })
}

const fetchMock = vi.fn()

beforeEach(() => {
  // Cada teste começa com as chamadas zeradas e uma resposta simulada,
  // sem depender da disponibilidade da API Overpass.
  fetchMock.mockReset()
  fetchMock.mockResolvedValue(
    new Response(JSON.stringify({ elements: elementos }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    }),
  )
  vi.spyOn(globalThis, 'fetch').mockImplementation(fetchMock)
})

afterEach(() => {
  vi.restoreAllMocks()
})

async function abrirPagina() {
  render(<MemoryRouter><Locais /></MemoryRouter>)
  await screen.findByRole('heading', { name: 'Locais', level: 1 })
}

function nomesExibidos() {
  return within(screen.getByRole('list'))
    .getAllByRole('heading', { level: 2 })
    .map((titulo) => titulo.textContent)
}

describe('Integração da paginação de locais', () => {
  it('divide os resultados em três páginas e respeita os limites', async () => {
    const user = userEvent.setup()
    await abrirPagina()

    expect(nomesExibidos()).toEqual([
      'Local 101', 'Local 102', 'Local 103', 'Local 104', 'Local 105',
      'Local 106', 'Local 107', 'Local 108', 'Local 109', 'Local 110',
    ])
    expect(screen.getByRole('button', { name: 'Anterior' })).toBeDisabled()
    expect(screen.getByRole('status')).toHaveTextContent('25 locais encontrados')
    expect(screen.getByRole('status')).toHaveAttribute('aria-live', 'polite')

    await user.click(screen.getByRole('button', { name: 'Próxima' }))
    expect(nomesExibidos()).toEqual([
      'Local 111', 'Local 112', 'Local 113', 'Local 114', 'Local 115',
      'Local 116', 'Local 117', 'Local 118', 'Local 119', 'Local 120',
    ])

    await user.click(screen.getByRole('button', { name: 'Próxima' }))
    expect(nomesExibidos()).toEqual([
      'Local 121', 'Local 122', 'Local 123', 'Local 124', 'Local 125',
    ])
    expect(screen.getByRole('button', { name: 'Próxima' })).toBeDisabled()
    // A contagem continua sendo o total encontrado, mesmo com só 5 itens visíveis.
    expect(screen.getByRole('status')).toHaveTextContent('25 locais encontrados')

    await user.click(screen.getByRole('button', { name: 'Anterior' }))
    expect(screen.getByRole('button', { name: '2' })).toHaveAttribute('aria-current', 'page')
    expect(nomesExibidos()).toHaveLength(10)
    expect(nomesExibidos()[0]).toBe('Local 111')
    expect(fetchMock).toHaveBeenCalledTimes(1)
  })

  it('ajusta para a última página disponível quando um filtro reduz a lista', async () => {
    const user = userEvent.setup()
    await abrirPagina()

    await user.click(screen.getByRole('button', { name: '3' }))
    await user.selectOptions(screen.getByLabelText('Categoria:'), 'cafe')

    // Restam 15 locais: a página 3 deixa de existir e o hook ajusta para a 2,
    // que é a última válida. Não é obrigatório voltar à primeira página.
    expect(nomesExibidos()).toEqual([
      'Local 111', 'Local 112', 'Local 113', 'Local 114', 'Local 115',
    ])
    expect(screen.getByRole('button', { name: '2' })).toHaveAttribute('aria-current', 'page')
    expect(screen.getByRole('button', { name: 'Próxima' })).toBeDisabled()
    expect(screen.getByRole('status')).toHaveTextContent('15 locais encontrados')
    expect(fetchMock).toHaveBeenCalledTimes(1)
  })

  it('combina busca e filtros sobre a lista completa, ajustando a página', async () => {
    const user = userEvent.setup()
    await abrirPagina()

    await user.click(screen.getByRole('button', { name: '3' }))
    await user.type(screen.getByLabelText('Buscar local por nome:'), 'Local 11')
    expect(nomesExibidos()).toHaveLength(10)
    expect(screen.getByRole('button', { name: '1' })).toHaveAttribute('aria-current', 'page')

    await user.selectOptions(screen.getByLabelText('Categoria:'), 'library')
    await user.selectOptions(screen.getByLabelText('Acessibilidade:'), 'acessivel')
    expect(nomesExibidos()).toEqual(['Local 116', 'Local 117', 'Local 118', 'Local 119'])
    expect(screen.getByRole('status')).toHaveTextContent('4 locais encontrados')

    await user.selectOptions(screen.getByLabelText('Acessibilidade:'), 'nao_acessivel')
    expect(screen.queryByRole('list')).not.toBeInTheDocument()
    expect(fetchMock).toHaveBeenCalledTimes(1)
  })

  it('ordena a lista antes de separar os resultados por página', async () => {
    const user = userEvent.setup()
    await abrirPagina()

    await user.selectOptions(screen.getByLabelText('Ordenar por nome:'), 'desc')
    expect(nomesExibidos()).toEqual([
      'Local 125', 'Local 124', 'Local 123', 'Local 122', 'Local 121',
      'Local 120', 'Local 119', 'Local 118', 'Local 117', 'Local 116',
    ])

    await user.click(screen.getByRole('button', { name: '3' }))
    expect(nomesExibidos()).toEqual([
      'Local 105', 'Local 104', 'Local 103', 'Local 102', 'Local 101',
    ])
    expect(fetchMock).toHaveBeenCalledTimes(1)
  })

  it('mostra o estado vazio e recupera a paginação ao limpar os critérios', async () => {
    const user = userEvent.setup()
    await abrirPagina()

    await user.click(screen.getByRole('button', { name: '3' }))
    await user.type(screen.getByLabelText('Buscar local por nome:'), 'Inexistente')

    expect(screen.getByRole('heading', { name: 'Nenhum resultado encontrado.' })).toBeInTheDocument()
    expect(screen.getByText('Nenhum local encontrado')).toHaveAttribute('aria-live', 'polite')
    expect(screen.queryByRole('list')).not.toBeInTheDocument()
    expect(screen.queryByRole('navigation', { name: 'Paginação' })).not.toBeInTheDocument()

    const formulario = screen.getByRole('form', { name: 'Buscar e filtrar locais' })
    await user.click(within(formulario).getByRole('button', { name: 'Limpar filtros' }))

    expect(screen.getByLabelText('Buscar local por nome:')).toHaveValue('')
    expect(nomesExibidos()).toHaveLength(10)
    expect(screen.getByRole('button', { name: '1' })).toHaveAttribute('aria-current', 'page')
    expect(screen.getByRole('status')).toHaveTextContent('25 locais encontrados')
    expect(fetchMock).toHaveBeenCalledTimes(1)
  })

  it('permite alcançar e selecionar uma página pelo teclado', async () => {
    const user = userEvent.setup()
    await abrirPagina()

    screen.getByRole('button', { name: '1' }).focus()
    await user.tab()
    expect(screen.getByRole('button', { name: '2' })).toHaveFocus()

    await user.keyboard('{Enter}')
    expect(screen.getByRole('button', { name: '2' })).toHaveAttribute('aria-current', 'page')
    expect(nomesExibidos()).toHaveLength(10)
    expect(nomesExibidos()[0]).toBe('Local 111')
    expect(fetchMock).toHaveBeenCalledTimes(1)
  })
})
