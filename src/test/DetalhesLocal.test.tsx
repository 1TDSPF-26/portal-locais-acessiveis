import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { afterEach, describe, expect, it, vi } from 'vitest'

import DetalhesLocal from '../pages/DetalhesLocal/DetalhesLocal'
vi.mock('../services/buscarLocalPorId')
import type { Local } from '../types/Local'
import { buscarLocalPorId } from '../services/buscarLocalPorId'

vi.mock('../../services/buscarLocalPorId')
const buscarLocalPorIdMock = vi.mocked(buscarLocalPorId)

const localCompleto: Local = {
    id: 123,
    nome: 'Café Inclusivo',
    categoria: 'cafe',
    descricao: 'Café com cardápio em braille.',
    endereco: { rua: 'Rua Augusta', numero: '100', cidade: 'São Paulo', estado: 'SP' },
    coordenadas: { latitude: -23.55, longitude: -46.63 },
    acessibilidade: { status: 'acessivel', descricao: 'Rampa na entrada' },
}

function renderPagina(rota: string) {
    return render(
        <MemoryRouter initialEntries={[rota]}>
            <Routes>
                <Route path="/locais/:id" element={<DetalhesLocal />} />
            </Routes>
        </MemoryRouter>,
    )
}

afterEach(() => {
    vi.resetAllMocks()
})

describe('DetalhesLocal', () => {
    it('exibe os dados do local, incluindo a acessibilidade', async () => {
        buscarLocalPorIdMock.mockResolvedValue(localCompleto)
        renderPagina('/locais/123')

        expect(
            await screen.findByRole('heading', { name: 'Café Inclusivo', level: 1 }),
        ).toBeInTheDocument()
        expect(buscarLocalPorIdMock).toHaveBeenCalledWith(123)
        expect(screen.getByText('cafe')).toBeInTheDocument()
        expect(screen.getByText('Café com cardápio em braille.')).toBeInTheDocument()
        expect(screen.getByText('Rua Augusta, 100 - São Paulo - SP')).toBeInTheDocument()
        expect(screen.getByText('Acessível')).toBeInTheDocument()
        expect(screen.getByText('Rampa na entrada')).toBeInTheDocument()
    })

    it('trata campos opcionais ausentes sem quebrar a página', async () => {
        buscarLocalPorIdMock.mockResolvedValue({
            ...localCompleto,
            descricao: undefined,
            endereco: undefined,
            acessibilidade: { status: 'nao_informado' },
        })
        renderPagina('/locais/123')

        expect(await screen.findByText('Descrição não informada.')).toBeInTheDocument()
        expect(screen.getByText('Endereço não informado.')).toBeInTheDocument()
        expect(screen.getByText('Não informado')).toBeInTheDocument()
    })

    
    it('exibe o status de acessibilidade com um rótulo textual claro', async () => {
    const statusEsperados = [
        { status: 'acessivel', rotulo: 'Acessível' },
        { status: 'parcial', rotulo: 'Parcialmente acessível' },
        { status: 'nao_acessivel', rotulo: 'Não acessível' },
        { status: 'nao_informado', rotulo: 'Não informado' },
    ] as const

    for (const { status, rotulo } of statusEsperados) {
        buscarLocalPorIdMock.mockResolvedValue({
        ...localCompleto,
        acessibilidade: { status },
        })

        const { unmount } = renderPagina('/locais/123')

        expect(await screen.findByText(rotulo)).toBeInTheDocument()

        unmount()
    }
    })

    it('não confunde acessibilidade não informada com não acessível', async () => {
    buscarLocalPorIdMock.mockResolvedValue({
        ...localCompleto,
        acessibilidade: { status: 'nao_informado' },
    })

    renderPagina('/locais/123')

    expect(await screen.findByText('Não informado')).toBeInTheDocument()
    expect(screen.queryByText('Não acessível')).not.toBeInTheDocument()
    })

    it('exibe a descrição complementar quando disponível', async () => {
    buscarLocalPorIdMock.mockResolvedValue({
        ...localCompleto,
        acessibilidade: {
        status: 'parcial',
        descricao: 'Possui rampa, mas não possui banheiro adaptado.',
        },
    })

    renderPagina('/locais/123')

    expect(
        await screen.findByText('Parcialmente acessível'),
    ).toBeInTheDocument()

    expect(
        screen.getByText('Possui rampa, mas não possui banheiro adaptado.'),
    ).toBeInTheDocument()
    })

    it('não exibe descrição complementar quando estiver vazia', async () => {
    buscarLocalPorIdMock.mockResolvedValue({
        ...localCompleto,
        acessibilidade: {
        status: 'acessivel',
        descricao: '   ',
        },
    })

    renderPagina('/locais/123')

    expect(await screen.findByText('Acessível')).toBeInTheDocument()
    expect(screen.queryByText('Descrição complementar')).not.toBeInTheDocument()
    })


    it('exibe o carregamento enquanto busca o local', () => {
        buscarLocalPorIdMock.mockReturnValue(new Promise(() => { }))
        renderPagina('/locais/123')

        expect(screen.getByRole('status')).toHaveTextContent('Carregando detalhes do local...')
    })

    it('não busca dados e informa erro quando o ID é inválido', () => {
        renderPagina('/locais/abc')

        expect(
            screen.getByRole('heading', { name: 'Identificador de local inválido.', level: 2 }),
        ).toBeInTheDocument()
        expect(buscarLocalPorIdMock).not.toHaveBeenCalled()
    })

    it('informa quando o ID não corresponde a nenhum local', async () => {
        buscarLocalPorIdMock.mockResolvedValue(null)
        renderPagina('/locais/999')

        expect(
            await screen.findByRole('heading', { name: 'Local não encontrado.', level: 2 }),
        ).toBeInTheDocument()
        expect(screen.getByRole('link', { name: 'Voltar para a lista de locais' }))
            .toHaveAttribute('href', '/locais')
    })

    it('exibe erro e permite tentar novamente', async () => {
        const user = userEvent.setup()
        buscarLocalPorIdMock
            .mockRejectedValueOnce(new Error('falha'))
            .mockResolvedValueOnce(localCompleto)
        renderPagina('/locais/123')

        expect(await screen.findByRole('alert')).toHaveTextContent('Não foi possível carregar o local')

        await user.click(screen.getByRole('button', { name: 'Tentar novamente' }))

        expect(
            await screen.findByRole('heading', { name: 'Café Inclusivo', level: 1 }),
        ).toBeInTheDocument()
    })
})