import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { definirCacheLocais, limparCacheLocais } from '../../services/CacheLocais'
import Locais from './Locais'

const versao1 = [
  { id: 1, lat: 0, lon: 0, tags: { name: 'Museu do Ipiranga', tourism: 'museum', wheelchair: 'yes' } },
  { id: 2, lat: 0, lon: 0, tags: { name: 'Café Central', amenity: 'cafe', wheelchair: 'limited' } },
]
const versao2 = [
  ...versao1,
  { id: 3, lat: 0, lon: 0, tags: { name: 'Café Novo', amenity: 'cafe', wheelchair: 'yes' } },
]

function resposta(elements: unknown[]) {
  return new Response(JSON.stringify({ elements }), { status: 200 })
}

describe('Página Locais - atualização manual', () => {
  beforeEach(() => {
    limparCacheLocais()
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

  it('atualiza a listagem ignorando o cache, sem recarregar a página', async () => {
    const user = userEvent.setup()
    const fetchSpy = vi
      .spyOn(globalThis, 'fetch')
      .mockImplementationOnce(async () => resposta(versao1))
      .mockImplementation(async () => resposta(versao2))

    await renderLocais()
    expect(screen.queryByText('Café Novo')).not.toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Atualizar locais' }))

    expect(await screen.findByText('Café Novo')).toBeInTheDocument()
    expect(screen.getByText('Locais atualizados.')).toBeInTheDocument()
    expect(fetchSpy).toHaveBeenCalledTimes(2)
  })

  it('mostra feedback durante a atualização e bloqueia cliques repetidos', async () => {
    const user = userEvent.setup()
    let liberar: (r: Response) => void = () => {}
    const fetchSpy = vi
      .spyOn(globalThis, 'fetch')
      .mockImplementationOnce(async () => resposta(versao1))
      .mockImplementationOnce(() => new Promise<Response>((resolve) => (liberar = resolve)))

    await renderLocais()
    const botao = screen.getByRole('button', { name: 'Atualizar locais' })

    await user.click(botao)
    await user.click(botao)
    await user.click(botao)

    expect(screen.getByText('Atualizando locais...')).toBeInTheDocument()
    expect(botao).toHaveAttribute('aria-disabled', 'true')
    expect(fetchSpy).toHaveBeenCalledTimes(2) // 1 carga inicial + 1 atualização

    liberar(resposta(versao2))

    await waitFor(() => expect(screen.getByText('Locais atualizados.')).toBeInTheDocument())
    expect(botao).toHaveAttribute('aria-disabled', 'false')
  })

  it('preserva busca, filtros e foco do botão durante a atualização', async () => {
    const user = userEvent.setup()
    vi.spyOn(globalThis, 'fetch')
      .mockImplementationOnce(async () => resposta(versao1))
      .mockImplementation(async () => resposta(versao2))

    await renderLocais()
    await user.type(screen.getByLabelText('Buscar local por nome:'), 'café')
    await user.selectOptions(screen.getByLabelText('Categoria:'), 'cafe')

    const botao = screen.getByRole('button', { name: 'Atualizar locais' })
    botao.focus()
    await user.keyboard('{Enter}')

    expect(await screen.findByText('Café Novo')).toBeInTheDocument()
    expect(screen.getByLabelText('Buscar local por nome:')).toHaveValue('café')
    expect(screen.getByLabelText('Categoria:')).toHaveValue('cafe')
    expect(screen.queryByText('Museu do Ipiranga')).not.toBeInTheDocument()
    expect(botao).toHaveFocus()
  })

  it('preserva os locais e o horário da última carga quando a atualização falha', async () => {
    const user = userEvent.setup()
    vi.spyOn(globalThis, 'fetch')
      .mockImplementationOnce(async () => resposta(versao1))
      .mockImplementationOnce(async () => new Response('erro', { status: 500 }))
      .mockImplementation(async () => resposta(versao2))

    await renderLocais()
    const indicacaoInicial = screen.getByText(/Última carga dos dados no portal:/).textContent

    await user.click(screen.getByRole('button', { name: 'Atualizar locais' }))

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Não foi possível atualizar os locais. Os dados da última carga continuam exibidos.',
    )
    expect(screen.getByText('Café Central')).toBeInTheDocument()
    expect(screen.getByText(/Última carga dos dados no portal:/).textContent).toBe(indicacaoInicial)

    await user.click(screen.getByRole('button', { name: 'Atualizar locais' }))
    expect(await screen.findByText('Café Novo')).toBeInTheDocument()
  })

  const locaisCache = [
  {
    id: 1,
    nome: 'Museu do Ipiranga',
    categoria: 'museum',
    endereco: {
      rua: 'Rua não informada',
      numero: 'Número não informado',
      cidade: 'Cidade de São Paulo',
      estado: 'Estado de São Paulo',
    },
    coordenadas: {
      latitude: 0,
      longitude: 0,
    },
    acessibilidade: {
      status: 'acessivel' as const,
    },
  },
  {
    id: 2,
    nome: 'Café Central',
    categoria: 'cafe',
    endereco: {
      rua: 'Rua não informada',
      numero: 'Número não informado',
      cidade: 'Cidade de São Paulo',
      estado: 'Estado de São Paulo',
    },
    coordenadas: {
      latitude: 0,
      longitude: 0,
    },
    acessibilidade: {
      status: 'parcial' as const,
    },
  },
]

  it('exibe a data e hora da última carga bem-sucedida no portal', async () => {
    vi.spyOn(Date, 'now').mockReturnValue(
    new Date('2026-10-28T13:30:00').getTime(),
  )

    vi.spyOn(globalThis, 'fetch')
    .mockImplementationOnce(async () => resposta(versao1))
  await renderLocais()

    expect(
    screen.getByText(/Última carga dos dados no portal:/),
    ).toHaveTextContent('28/10/2026')
  })

    it('atualiza o horário após uma atualização manual bem-sucedida', async () => {
    const user = userEvent.setup()
    const dateNowSpy = vi.spyOn(Date, 'now').mockReturnValue(
    new Date('2026-10-28T10:00:00').getTime(),)

    vi.spyOn(globalThis, 'fetch')
    .mockImplementationOnce(async () => resposta(versao1))
    .mockImplementationOnce(async () => resposta(versao2))
    await renderLocais()

  const horarioInicial = screen.getByText(
    /Última carga dos dados no portal:/,).textContent

    dateNowSpy.mockReturnValue(
    new Date('2026-10-28T11:00:00').getTime(),)

  await user.click(
    screen.getByRole('button', { name: 'Atualizar locais' }),)
    expect(await screen.findByText('Café Novo')).toBeInTheDocument()

  const horarioAtualizado = screen.getByText(
    /Última carga dos dados no portal:/,).textContent
    expect(horarioAtualizado).not.toBe(horarioInicial)
  })

  it('identifica quando a listagem vem do cache sem tratar como nova carga da fonte', async () => {
  vi.spyOn(Date, 'now').mockReturnValue(
    new Date('2026-10-28T09:00:00').getTime(),
  )

    definirCacheLocais(locaisCache)
    const fetchSpy = vi.spyOn(globalThis, 'fetch')
    await renderLocais()
    expect(screen.getByText(/Dados do cache\./),).toBeInTheDocument()

    expect(
    screen.getByText(/Última carga dos dados no portal:/),).toBeInTheDocument()

  expect(fetchSpy).not.toHaveBeenCalled()
  })
})
