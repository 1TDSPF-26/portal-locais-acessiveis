import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { limparCacheLocais } from '../../services/CacheLocais'
import { reiniciarListagemLocais } from '../../services/ListagemLocais'
import Locais from './Locais'

// Usuário em (-23.55, -46.63). Em ordem alfabética: Distante, Intermediário, Próximo.
// Em ordem de proximidade: Próximo, Intermediário, Distante.
const elementos = [
  { id: 1, lat: -23.6, lon: -46.7, tags: { name: 'Café Distante', amenity: 'cafe', wheelchair: 'yes' } },
  { id: 2, lat: -23.57, lon: -46.65, tags: { name: 'Café Intermediário', amenity: 'cafe', wheelchair: 'yes' } },
  { id: 3, lat: -23.551, lon: -46.631, tags: { name: 'Café Próximo', amenity: 'cafe', wheelchair: 'yes' } },
  // Mais próximo de todos, mas é de outra categoria: o filtro deve excluí-lo.
  { id: 4, lat: -23.5501, lon: -46.6301, tags: { name: 'Museu Vizinho', tourism: 'museum', wheelchair: 'yes' } },
]

function mockGeolocalizacao() {
  const getCurrentPosition = vi.fn((sucesso: (p: unknown) => void) =>
    sucesso({ coords: { latitude: -23.55, longitude: -46.63 } }),
  )
  Object.defineProperty(navigator, 'geolocation', {
    value: { getCurrentPosition },
    configurable: true,
  })
  return getCurrentPosition
}

describe('Página Locais - ordenação por proximidade', () => {
  beforeEach(() => {
    limparCacheLocais()
    reiniciarListagemLocais()
    vi.spyOn(globalThis, 'fetch').mockImplementation(
      async () =>
        new Response(JSON.stringify({ elements: elementos }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }),
    )
  })

  afterEach(() => {
    vi.restoreAllMocks()
    Object.defineProperty(navigator, 'geolocation', {
      value: undefined,
      configurable: true,
    })
  })

  async function renderLocais() {
    render(
      <MemoryRouter>
        <Locais />
      </MemoryRouter>,
    )
    await screen.findByRole('list')
  }

  function nomesExibidos() {
    return within(screen.getByRole('list'))
      .getAllByRole('heading', { level: 2 })
      .map((heading) => heading.textContent)
  }

  it('ordena por proximidade preservando busca e filtros, sem nova requisição', async () => {
    const user = userEvent.setup()
    const getCurrentPosition = mockGeolocalizacao()
    await renderLocais()

    // Estado inicial: ordem alfabética.
    expect(nomesExibidos()).toEqual([
      'Café Distante',
      'Café Intermediário',
      'Café Próximo',
      'Museu Vizinho',
    ])

    // Filtro de categoria + busca continuam valendo durante a ordenação.
    await user.selectOptions(screen.getByLabelText('Categoria:'), 'cafe')
    await user.type(screen.getByLabelText('Buscar local por nome:'), 'café')

    await user.click(
      screen.getByRole('button', {
        name: 'Obter minha localização atual para habilitar ordenação por proximidade',
      }),
    )

    expect(getCurrentPosition).toHaveBeenCalledTimes(1)
    await waitFor(() =>
      expect(screen.getByLabelText('Ordenar por nome:')).toHaveValue('proximidade'),
    )

    expect(nomesExibidos()).toEqual([
      'Café Próximo',
      'Café Intermediário',
      'Café Distante',
    ])
    expect(screen.queryByText('Museu Vizinho')).not.toBeInTheDocument()
    expect(screen.getByLabelText('Categoria:')).toHaveValue('cafe')
    expect(screen.getByLabelText('Buscar local por nome:')).toHaveValue('café')

    // A distância não é exibida nos cartões (pertence a outra Issue).
    expect(screen.queryByText(/\bkm\b/i)).not.toBeInTheDocument()

    expect(globalThis.fetch).toHaveBeenCalledTimes(1)
  })

  it('volta a ordenar por nome ao escolher A a Z depois da proximidade', async () => {
    const user = userEvent.setup()
    mockGeolocalizacao()
    await renderLocais()

    await user.selectOptions(screen.getByLabelText('Categoria:'), 'cafe')
    await user.click(
      screen.getByRole('button', {
        name: 'Obter minha localização atual para habilitar ordenação por proximidade',
      }),
    )
    await waitFor(() =>
      expect(screen.getByLabelText('Ordenar por nome:')).toHaveValue('proximidade'),
    )

    await user.selectOptions(screen.getByLabelText('Ordenar por nome:'), 'asc')

    expect(nomesExibidos()).toEqual([
      'Café Distante',
      'Café Intermediário',
      'Café Próximo',
    ])
  })
})
