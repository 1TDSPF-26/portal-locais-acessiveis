import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import DetalhesLocal from '../pages/DetalhesLocal/DetalhesLocal'
import Locais from '../pages/Locais/Locais'
import { limparCacheLocais } from '../services/CacheLocais'
import { buscarLocalPorId } from '../services/buscarLocalPorId'
import type { OverpassElement } from '../types/Overpass'

vi.mock('../services/buscarLocalPorId')
const buscarLocalPorIdMock = vi.mocked(buscarLocalPorId)

// 25 locais = 3 páginas de 10. Os 15 primeiros são cafés; os 10 últimos, bibliotecas.
const elementos: OverpassElement[] = Array.from({ length: 25 }, (_, i) => ({
  id: i + 1,
  lat: 0,
  lon: 0,
  tags: {
    name: `Local ${101 + i}`,
    amenity: i < 15 ? 'cafe' : 'library',
    wheelchair: i < 20 ? 'yes' : 'no',
  },
}))

/** Mostra a URL atual e simula o botão Voltar do navegador (history.back). */
function BarraDeTeste() {
  const location = useLocation()
  const navigate = useNavigate()

  return (
    <div>
      <output data-testid="url">{`${location.pathname}${location.search}`}</output>
      <button type="button" onClick={() => navigate(-1)}>
        Voltar do navegador
      </button>
    </div>
  )
}

function renderApp(rota = '/locais') {
  return render(
    <MemoryRouter initialEntries={[rota]}>
      <BarraDeTeste />
      <Routes>
        <Route path="/locais" element={<Locais />} />
        <Route path="/locais/:id" element={<DetalhesLocal />} />
      </Routes>
    </MemoryRouter>,
  )
}

function nomesExibidos() {
  return within(screen.getByRole('list'))
    .getAllByRole('heading', { level: 2 })
    .map((titulo) => titulo.textContent)
}

const urlAtual = () => screen.getByTestId('url').textContent

beforeEach(() => {
  limparCacheLocais()
  vi.spyOn(globalThis, 'fetch').mockImplementation(
    async () =>
      new Response(JSON.stringify({ elements: elementos }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }),
  )
  buscarLocalPorIdMock.mockImplementation(async (id) => ({
    id,
    nome: `Local ${100 + id}`,
    categoria: 'cafe',
    coordenadas: { latitude: 0, longitude: 0 },
    acessibilidade: { status: 'acessivel' },
  }))
})

afterEach(() => {
  vi.restoreAllMocks()
  vi.resetAllMocks()
})

describe('Contexto da listagem ao abrir um detalhe e voltar', () => {
  it('preserva busca, filtros, ordenação e página ao voltar pelo link da página', async () => {
    const user = userEvent.setup()
    renderApp()
    await screen.findByRole('heading', { name: 'Locais', level: 1 })

    await user.selectOptions(screen.getByLabelText('Categoria:'), 'cafe')
    await user.selectOptions(screen.getByLabelText('Acessibilidade:'), 'acessivel')
    await user.selectOptions(screen.getByLabelText('Ordenar por nome:'), 'desc')
    await user.type(screen.getByLabelText('Buscar local por nome:'), 'Local 1')
    await user.click(screen.getByRole('button', { name: '2' }))

    // A ordem dos parâmetros depende da sequência de interações; o que importa é o conteúdo.
    const params = new URLSearchParams(urlAtual()!.split('?')[1])
    expect(Object.fromEntries(params)).toEqual({
      busca: 'Local 1',
      categoria: 'cafe',
      acessibilidade: 'acessivel',
      ordem: 'desc',
      pagina: '2',
    })
    const antes = nomesExibidos()
    expect(antes).toEqual(['Local 105', 'Local 104', 'Local 103', 'Local 102', 'Local 101'])

    await user.click(screen.getByRole('link', { name: antes[0]! }))
    expect(await screen.findByRole('heading', { name: 'Local 105', level: 1 })).toBeInTheDocument()

    await user.click(screen.getByRole('link', { name: 'Voltar para a lista de locais' }))
    await screen.findByRole('heading', { name: 'Locais', level: 1 })

    expect(screen.getByLabelText('Buscar local por nome:')).toHaveValue('Local 1')
    expect(screen.getByLabelText('Categoria:')).toHaveValue('cafe')
    expect(screen.getByLabelText('Acessibilidade:')).toHaveValue('acessivel')
    expect(screen.getByLabelText('Ordenar por nome:')).toHaveValue('desc')
    expect(screen.getByRole('button', { name: '2' })).toHaveAttribute('aria-current', 'page')
    expect(nomesExibidos()).toEqual(antes)
  })

  it('preserva o contexto ao voltar pelo botão Voltar do navegador', async () => {
    const user = userEvent.setup()
    renderApp()
    await screen.findByRole('heading', { name: 'Locais', level: 1 })

    await user.selectOptions(screen.getByLabelText('Categoria:'), 'library')
    await user.click(screen.getByRole('link', { name: 'Local 116' }))
    await screen.findByRole('heading', { name: 'Local 116', level: 1 })

    await user.click(screen.getByRole('button', { name: 'Voltar do navegador' }))
    await screen.findByRole('heading', { name: 'Locais', level: 1 })

    expect(urlAtual()).toBe('/locais?categoria=library')
    expect(screen.getByLabelText('Categoria:')).toHaveValue('library')
    expect(nomesExibidos()).toHaveLength(10)
  })

  it('não cria uma entrada de histórico a cada tecla digitada', async () => {
    const user = userEvent.setup()
    renderApp()
    await screen.findByRole('heading', { name: 'Locais', level: 1 })

    await user.type(screen.getByLabelText('Buscar local por nome:'), 'Local 12')
    await user.click(screen.getByRole('link', { name: 'Local 120' }))
    await screen.findByRole('heading', { name: 'Local 120', level: 1 })

    // Um único "voltar" já retorna à listagem com a busca completa.
    await user.click(screen.getByRole('button', { name: 'Voltar do navegador' }))
    await screen.findByRole('heading', { name: 'Locais', level: 1 })
    expect(screen.getByLabelText('Buscar local por nome:')).toHaveValue('Local 12')
  })

  it('permite abrir o detalhe e voltar usando apenas o teclado', async () => {
    const user = userEvent.setup()
    renderApp('/locais?busca=Local+12')
    await screen.findByRole('heading', { name: 'Locais', level: 1 })

    const link = screen.getByRole('link', { name: 'Local 120' })
    link.focus()
    await user.keyboard('{Enter}')
    await screen.findByRole('heading', { name: 'Local 120', level: 1 })

    const voltar = screen.getByRole('link', { name: 'Voltar para a lista de locais' })
    voltar.focus()
    expect(voltar).toHaveFocus()
    await user.keyboard('{Enter}')

    await screen.findByRole('heading', { name: 'Locais', level: 1 })
    expect(urlAtual()).toBe('/locais?busca=Local+12')
    expect(screen.getByLabelText('Buscar local por nome:')).toHaveValue('Local 12')
  })
})

describe('Restauração a partir da URL', () => {
  it('aplica os critérios da URL já no primeiro carregamento, sem resetar a página enquanto carrega', async () => {
    renderApp('/locais?categoria=cafe&pagina=2')
    await screen.findByRole('heading', { name: 'Locais', level: 1 })

    expect(screen.getByLabelText('Categoria:')).toHaveValue('cafe')
    expect(screen.getByRole('button', { name: '2' })).toHaveAttribute('aria-current', 'page')
    expect(nomesExibidos()).toEqual(['Local 111', 'Local 112', 'Local 113', 'Local 114', 'Local 115'])
    expect(urlAtual()).toBe('/locais?categoria=cafe&pagina=2')
  })

  it('corrige uma página fora do intervalo para a última válida', async () => {
    renderApp('/locais?pagina=99')
    await screen.findByRole('heading', { name: 'Locais', level: 1 })

    expect(screen.getByRole('button', { name: '3' })).toHaveAttribute('aria-current', 'page')
    expect(nomesExibidos()).toHaveLength(5)
  })

  it('ignora parâmetros inválidos sem quebrar a página', async () => {
    renderApp('/locais?pagina=abc&ordem=xyz&acessibilidade=foo')
    await screen.findByRole('heading', { name: 'Locais', level: 1 })

    expect(screen.getByLabelText('Ordenar por nome:')).toHaveValue('asc')
    expect(screen.getByLabelText('Acessibilidade:')).toHaveValue('')
    expect(screen.getByRole('button', { name: '1' })).toHaveAttribute('aria-current', 'page')
  })

  it('Limpar filtros zera a URL', async () => {
    const user = userEvent.setup()
    renderApp('/locais?busca=Local+1&categoria=cafe&ordem=desc&pagina=2')
    await screen.findByRole('heading', { name: 'Locais', level: 1 })

    await user.click(screen.getByRole('button', { name: 'Limpar filtros' }))

    expect(urlAtual()).toBe('/locais')
    expect(screen.getByLabelText('Buscar local por nome:')).toHaveValue('')
  })
})

describe('Acesso direto ao detalhe', () => {
  it('abre /locais/:id sem passar pela listagem e o link Voltar leva a /locais', async () => {
    const user = userEvent.setup()
    renderApp('/locais/7')

    expect(await screen.findByRole('heading', { name: 'Local 107', level: 1 })).toBeInTheDocument()
    expect(buscarLocalPorIdMock).toHaveBeenCalledWith(7)

    const voltar = screen.getByRole('link', { name: 'Voltar para a lista de locais' })
    expect(voltar).toHaveAttribute('href', '/locais')

    await user.click(voltar)
    await screen.findByRole('heading', { name: 'Locais', level: 1 })
    expect(urlAtual()).toBe('/locais')
  })
})
