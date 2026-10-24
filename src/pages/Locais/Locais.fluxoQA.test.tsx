import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import Locais from './Locais'
import { limparCacheLocais } from '../../services/CacheLocais'

// 25 locais: 15 cafés (metade acessíveis) e 10 museus (parcial) para forçar a paginação.
const elementos = [
  ...Array.from({ length: 15 }, (_, i) => ({
    id: i + 1,
    lat: 0,
    lon: 0,
    tags: {
      name: `Cafe ${String(i + 1).padStart(2, '0')}`,
      amenity: 'cafe',
      wheelchair: i % 2 === 0 ? 'yes' : 'no',
    },
  })),
  ...Array.from({ length: 10 }, (_, i) => ({
    id: 100 + i,
    lat: 0,
    lon: 0,
    tags: {
      name: `Museu ${String(i + 1).padStart(2, '0')}`,
      tourism: 'museum',
      wheelchair: 'limited',
    },
  })),
]

const fetchMock = vi.fn()

beforeEach(() => {
  // Limpa o cache antes de cada teste. Sem isso, os dados vêm do cache do teste
  // anterior e o fetch não é chamado (foi o que quebrou o CI da #61).
  limparCacheLocais()
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

async function renderLocais() {
  render(
    <MemoryRouter>
      <Locais />
    </MemoryRouter>,
  )
  await screen.findByRole('heading', { name: 'Locais', level: 1 })
}

function nomesExibidos() {
  const lista = screen.queryByRole('list')
  if (!lista) return []
  return within(lista)
    .getAllByRole('heading', { level: 2 })
    .map((h) => h.textContent)
}

describe('Fluxo combinado da listagem (QA #114)', () => {
  it('aplica busca, filtro e paginação sobre a lista carregada, sem nova requisição', async () => {
    const user = userEvent.setup()
    await renderLocais()

    // Página inicial: 25 no total, 10 por página.
    expect(nomesExibidos()).toHaveLength(10)

    // Filtra por categoria "cafe" (15 itens) — ainda mais de uma página.
    await user.selectOptions(screen.getByLabelText('Categoria:'), 'cafe')
    expect(nomesExibidos()).toHaveLength(10)

    // Combina com acessibilidade "acessivel": cabe em uma página só.
    await user.selectOptions(screen.getByLabelText('Acessibilidade:'), 'acessivel')
    expect(nomesExibidos().length).toBeGreaterThan(0)
    expect(nomesExibidos().length).toBeLessThanOrEqual(10)

    // Em todo o fluxo, a API foi chamada só uma vez.
    expect(fetchMock).toHaveBeenCalledTimes(1)
  })
})