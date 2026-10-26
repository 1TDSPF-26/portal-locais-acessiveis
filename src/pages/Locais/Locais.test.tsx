import { render, screen, waitFor, within } from '@testing-library/react'
import { limparCacheLocais } from '../../services/CacheLocais'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import Locais from './Locais'

const elementos = [
  { id: 1, lat: 0, lon: 0, tags: { name: 'Museu do Ipiranga', tourism: 'museum', wheelchair: 'yes' } },
  { id: 2, lat: 0, lon: 0, tags: { name: 'Café Central', amenity: 'cafe', wheelchair: 'limited' } },
  { id: 3, lat: 0, lon: 0, tags: { name: 'Café da Esquina', amenity: 'cafe', wheelchair: 'no' } },
  { id: 4, lat: 0, lon: 0, tags: { name: 'Biblioteca Mário de Andrade', amenity: 'library', wheelchair: 'yes' } },
]

// Uma Response nova a cada chamada: o corpo de uma Response só pode ser lido uma vez.
function respostaComLocais() {
  return new Response(JSON.stringify({ elements: elementos }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  })
}

describe('Página Locais - filtros e ordenação', () => {
  beforeEach(() => {
    limparCacheLocais()
    // O mock é criado a cada teste, então nenhum teste depende do estado do anterior.
    vi.spyOn(globalThis, 'fetch').mockImplementation(async () => respostaComLocais())
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
    return within(screen.getByRole('list'))
      .getAllByRole('heading', { level: 2 })
      .map((heading) => heading.textContent)
  }

  it('exibe o estado de carregamento enquanto busca os locais', async () => {
    let liberarRequisicao: () => void = () => {}

    vi.mocked(globalThis.fetch).mockImplementationOnce(
      () =>
        new Promise<Response>((resolve) => {
          liberarRequisicao = () => resolve(respostaComLocais())
        }),
    )

    render(
      <MemoryRouter>
        <Locais />
      </MemoryRouter>,
    )

    const status = screen.getByRole('status')

    expect(status).toHaveTextContent('Carregando locais...')
    expect(status).toHaveAttribute('aria-busy', 'true')
    expect(
      status.querySelectorAll('[aria-hidden="true"] article'),
    ).toHaveLength(3)

    // Não deixa a requisição pendente para sempre: isso poderia travar os próximos testes
    // (por exemplo, se o service reaproveitar uma requisição em andamento).
    await waitFor(() => expect(globalThis.fetch).toHaveBeenCalled())
    liberarRequisicao()
    await screen.findByRole('heading', { name: 'Locais', level: 1 })
  })

  it('filtra por categoria e acessibilidade e combina com a busca sem nova requisição', async () => {
    const user = userEvent.setup()
    await renderLocais()

    await user.selectOptions(screen.getByLabelText('Categoria:'), 'cafe')
    expect(nomesExibidos()).toEqual(['Café Central', 'Café da Esquina'])

    await user.selectOptions(screen.getByLabelText('Acessibilidade:'), 'nao_acessivel')
    expect(nomesExibidos()).toEqual(['Café da Esquina'])

    await user.selectOptions(screen.getByLabelText('Categoria:'), '')
    await user.selectOptions(screen.getByLabelText('Acessibilidade:'), 'acessivel')
    await user.type(screen.getByLabelText('Buscar local por nome:'), 'museu')
    expect(nomesExibidos()).toEqual(['Museu do Ipiranga'])

    expect(globalThis.fetch).toHaveBeenCalledTimes(1)
  })

  it('ordena os resultados por nome', async () => {
    const user = userEvent.setup()
    await renderLocais()

    expect(nomesExibidos()).toEqual([
      'Biblioteca Mário de Andrade',
      'Café Central',
      'Café da Esquina',
      'Museu do Ipiranga',
    ])

    await user.selectOptions(screen.getByLabelText('Ordenar por nome:'), 'desc')
    expect(nomesExibidos()).toEqual([
      'Museu do Ipiranga',
      'Café da Esquina',
      'Café Central',
      'Biblioteca Mário de Andrade',
    ])

    expect(globalThis.fetch).toHaveBeenCalledTimes(1)
  })

  it('exibe o estado vazio e permite limpar os filtros pelo teclado', async () => {
    const user = userEvent.setup()
    await renderLocais()

    await user.selectOptions(screen.getByLabelText('Categoria:'), 'museum')
    await user.selectOptions(screen.getByLabelText('Acessibilidade:'), 'parcial')

    expect(screen.getByRole('heading', { name: 'Nenhum resultado encontrado.' })).toBeInTheDocument()
    expect(screen.queryByRole('list')).not.toBeInTheDocument()

    screen.getAllByRole('button', { name: 'Limpar filtros' })[0].focus()
    await user.keyboard('{Enter}')

    expect(screen.getByLabelText('Categoria:')).toHaveValue('')
    expect(screen.getByLabelText('Acessibilidade:')).toHaveValue('')
    expect(nomesExibidos()).toHaveLength(4)
    expect(globalThis.fetch).toHaveBeenCalledTimes(1)
  })

  it('permite alcançar todos os controles com Tab', async () => {
    const user = userEvent.setup()
    await renderLocais()

    const ordemEsperada = [
      screen.getByLabelText('Buscar local por nome:'),
      screen.getByLabelText('Categoria:'),
      screen.getByLabelText('Acessibilidade:'),
      screen.getByLabelText('Ordenar por nome:'),
      screen.getByRole('button', { name: 'Limpar filtros' }),
      screen.getByRole('button', { name: 'Atualizar locais' }),
    ]

    for (const controle of ordemEsperada) {
      await user.tab()
      expect(controle).toHaveFocus()
    }
  })
})
