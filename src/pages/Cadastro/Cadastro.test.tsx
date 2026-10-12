import { afterEach, describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Cadastro from './Cadastro'

async function preencherFormularioValido() {
  const user = userEvent.setup()
  await user.type(screen.getByLabelText(/^nome/i), 'Centro Cultural Inclusivo')
  await user.type(screen.getByLabelText(/^categoria/i), 'Cultura')
  await user.type(screen.getByLabelText(/^descrição do local/i), 'Local acessível com rampas.')
  await user.type(screen.getByLabelText(/^rua/i), 'Rua da Sustentabilidade')
  await user.type(screen.getByLabelText(/^cidade/i), 'São Paulo')
  await user.type(screen.getByLabelText(/^estado/i), 'SP')
  await user.selectOptions(screen.getByLabelText(/nível de acessibilidade/i), 'acessivel')
  return user
}

describe('Cadastro com dados inválidos', () => {
  it('mostra os erros e foca o nome', async () => {
    const user = userEvent.setup()
    render(<Cadastro />)

    await user.click(screen.getByRole('button', { name: /enviar cadastro/i }))

    expect(screen.getByText('Encontramos 7 erros no formulário')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /nome do local/i })).toBeInTheDocument()
    expect(screen.getByLabelText(/^nome/i)).toHaveAttribute('aria-invalid', 'true')
    expect(screen.getByLabelText(/^nome/i)).toHaveFocus()
  })

  it('foca o primeiro campo inválido, não o primeiro da tela', async () => {
    const user = userEvent.setup()
    render(<Cadastro />)

    await user.type(screen.getByLabelText(/^nome/i), 'Café Acessível')
    await user.type(screen.getByLabelText(/^categoria/i), 'Restaurante')
    await user.click(screen.getByRole('button', { name: /enviar cadastro/i }))

    expect(screen.getByText('Encontramos 5 erros no formulário')).toBeInTheDocument()
    expect(screen.getByLabelText(/^descrição do local/i)).toHaveFocus()
  })
})

describe('Envio do cadastro para a API', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('envia o formulário válido conforme o contrato e exibe sucesso', async () => {
    const fetchMock = vi
      .spyOn(globalThis, 'fetch')
      .mockResolvedValue(new Response(null, { status: 201 }))
    render(<Cadastro />)

    const user = await preencherFormularioValido()
    await user.click(screen.getByRole('button', { name: /enviar cadastro/i }))

    expect(await screen.findByText('Cadastro enviado com sucesso.')).toBeInTheDocument()
    expect(fetchMock).toHaveBeenCalledTimes(1)

    const [, opcoes] = fetchMock.mock.calls[0]
    expect(JSON.parse(String(opcoes?.body))).toEqual({
      nome: 'Centro Cultural Inclusivo',
      categoria: 'Cultura',
      descricao: 'Local acessível com rampas.',
      endereco: { rua: 'Rua da Sustentabilidade', cidade: 'São Paulo', estado: 'SP' },
      acessibilidade: { status: 'acessivel' },
    })
  })

  it('não envia requisição quando o formulário é inválido', async () => {
    const fetchMock = vi.spyOn(globalThis, 'fetch')
    const user = userEvent.setup()
    render(<Cadastro />)

    await user.click(screen.getByRole('button', { name: /enviar cadastro/i }))

    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('bloqueia envios duplicados enquanto a requisição está em andamento', async () => {
    let resolverRequisicao: (resposta: Response) => void = () => {}
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockImplementation(
      () => new Promise((resolve) => { resolverRequisicao = resolve }),
    )
    render(<Cadastro />)

    const user = await preencherFormularioValido()
    await user.click(screen.getByRole('button', { name: /enviar cadastro/i }))

    const botao = screen.getByRole('button', { name: /enviando/i })
    expect(botao).toBeDisabled()

    await user.click(botao)
    expect(fetchMock).toHaveBeenCalledTimes(1)

    resolverRequisicao(new Response(null, { status: 201 }))
    expect(await screen.findByText('Cadastro enviado com sucesso.')).toBeInTheDocument()
  })

  it('preserva os dados e permite nova tentativa após uma falha', async () => {
    const fetchMock = vi
      .spyOn(globalThis, 'fetch')
      .mockResolvedValueOnce(new Response(null, { status: 500 }))
      .mockResolvedValueOnce(new Response(null, { status: 201 }))
    render(<Cadastro />)

    const user = await preencherFormularioValido()
    await user.click(screen.getByRole('button', { name: /enviar cadastro/i }))

    expect(await screen.findByText(/não foi possível enviar o cadastro/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/^nome/i)).toHaveValue('Centro Cultural Inclusivo')

    await user.click(screen.getByRole('button', { name: /enviar cadastro/i }))

    expect(await screen.findByText('Cadastro enviado com sucesso.')).toBeInTheDocument()
    expect(fetchMock).toHaveBeenCalledTimes(2)
  })
})