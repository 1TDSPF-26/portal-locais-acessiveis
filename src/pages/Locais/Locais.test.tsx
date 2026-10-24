import { render, screen, within } from '@testing-library/react'
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

const fetchMock = vi.fn(
  async () =>
    new Response(JSON.stringify({ elements: elementos }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    }),
)

describe('Página Locais - filtros e ordenação', () => {
  beforeEach(() => {
    limparCacheLocais()
    fetchMock.mockClear()
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
    return within(screen.getByRole('list'))
      .getAllByRole('heading', { level: 2 })
      .map((heading) => heading.textContent)
  }

  it('exibe o estado de carregamento enquanto busca os locais', async () => {
    fetchMock.mockImplementationOnce(
      () => new Promise<Response>(() => {}),
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

    expect(fetchMock).toHaveBeenCalledTimes(1)
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

    expect(fetchMock).toHaveBeenCalledTimes(1)
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
    expect(fetchMock).toHaveBeenCalledTimes(1)
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
    ]

    for (const controle of ordemEsperada) {
      await user.tab()
      expect(controle).toHaveFocus()
    }
  })

  describe('aviso de resultados possivelmente incompletos', () => {
    const TITULO_AVISO = 'Os resultados podem estar incompletos'

    it('exibe o aviso, com orientação prática, quando a busca não tem correspondência', async () => {
      const user = userEvent.setup()
      await renderLocais()

      await user.type(screen.getByLabelText('Buscar local por nome:'), 'local inexistente')

      expect(screen.getByRole('heading', { name: TITULO_AVISO, level: 2 })).toBeInTheDocument()
      expect(screen.getByText(/pode não conter todos os locais/i)).toBeInTheDocument()
      expect(screen.getByText(/revise o termo da busca ou os filtros/i)).toBeInTheDocument()
    })

    it('exibe o aviso quando os filtros combinados não têm correspondência', async () => {
      const user = userEvent.setup()
      await renderLocais()

      await user.selectOptions(screen.getByLabelText('Categoria:'), 'museum')
      await user.selectOptions(screen.getByLabelText('Acessibilidade:'), 'parcial')

      expect(screen.getByRole('heading', { name: TITULO_AVISO })).toBeInTheDocument()
    })

    it('não apresenta a situação como erro técnico nem afirma indisponibilidade da API', async () => {
      const user = userEvent.setup()
      await renderLocais()

      await user.type(screen.getByLabelText('Buscar local por nome:'), 'local inexistente')

      expect(screen.queryByRole('alert')).not.toBeInTheDocument()
      expect(screen.queryByText(/não foi possível carregar/i)).not.toBeInTheDocument()
      expect(screen.queryByText(/indispon[ií]vel|fora do ar|falha/i)).not.toBeInTheDocument()
    })

    it('preserva o EmptyState sem duplicá-lo', async () => {
      const user = userEvent.setup()
      await renderLocais()

      await user.type(screen.getByLabelText('Buscar local por nome:'), 'local inexistente')

      expect(screen.getAllByRole('heading', { name: 'Nenhum resultado encontrado.' })).toHaveLength(1)
      expect(screen.getAllByRole('heading', { name: TITULO_AVISO })).toHaveLength(1)
    })

    it('não exibe o aviso quando há resultados', async () => {
      const user = userEvent.setup()
      await renderLocais()

      expect(screen.queryByRole('heading', { name: TITULO_AVISO })).not.toBeInTheDocument()

      await user.type(screen.getByLabelText('Buscar local por nome:'), 'museu')

      expect(nomesExibidos()).toEqual(['Museu do Ipiranga'])
      expect(screen.queryByRole('heading', { name: TITULO_AVISO })).not.toBeInTheDocument()
    })

    it('remove o aviso ao limpar os filtros', async () => {
      const user = userEvent.setup()
      await renderLocais()

      await user.type(screen.getByLabelText('Buscar local por nome:'), 'local inexistente')
      expect(screen.getByRole('heading', { name: TITULO_AVISO })).toBeInTheDocument()

      await user.click(screen.getAllByRole('button', { name: 'Limpar filtros' })[0])

      expect(screen.queryByRole('heading', { name: TITULO_AVISO })).not.toBeInTheDocument()
      expect(nomesExibidos()).toHaveLength(4)
    })
  })
})