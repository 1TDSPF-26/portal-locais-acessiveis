import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import type { Local } from '../../types/Local'
import { definirCacheLocais, limparCacheLocais } from '../../services/CacheLocais'
import { ListagemLocais } from '../../services/ListagemLocais'
import Locais from './Locais'

vi.mock('../../services/ListagemLocais')

const local: Local = {
  id: 1,
  nome: 'Museu do Ipiranga',
  categoria: 'museum',
  coordenadas: { latitude: -23.5856, longitude: -46.6097 },
  acessibilidade: { status: 'parcial' },
}

const outroLocal: Local = { ...local, id: 2, nome: 'Parque da Luz' }

function renderizar() {
  return render(
    <MemoryRouter>
      <Locais />
    </MemoryRouter>,
  )
}

describe('Locais com fallback de cache', () => {
  beforeEach(() => {
    limparCacheLocais()
    vi.mocked(ListagemLocais).mockReset()
  })

  it('exibe a listagem normalmente, sem aviso, quando a Overpass responde', async () => {
    vi.mocked(ListagemLocais).mockResolvedValue([local])
    renderizar()

    expect(await screen.findByText('Museu do Ipiranga')).toBeInTheDocument()
    expect(screen.queryByText(/podem estar desatualizados/i)).not.toBeInTheDocument()
  })

  it('exibe os locais do cache e o aviso quando a Overpass falha', async () => {
    definirCacheLocais([local])
    vi.mocked(ListagemLocais).mockRejectedValue(new Error('Overpass fora'))
    renderizar()

    expect(await screen.findByText('Museu do Ipiranga')).toBeInTheDocument()
    expect(screen.getByText(/podem estar desatualizados/i)).toBeInTheDocument()
  })

  it('exibe o ErrorState quando a Overpass falha e não há cache', async () => {
    vi.mocked(ListagemLocais).mockRejectedValue(new Error('Overpass fora'))
    renderizar()

    expect(await screen.findByRole('alert')).toBeInTheDocument()
    expect(screen.queryByText('Museu do Ipiranga')).not.toBeInTheDocument()
  })

  it('permite tentar novamente e remove o aviso quando a Overpass volta', async () => {
    const user = userEvent.setup()
    definirCacheLocais([local])
    vi.mocked(ListagemLocais)
      .mockRejectedValueOnce(new Error('Overpass fora'))
      .mockResolvedValueOnce([outroLocal])
    renderizar()

    await user.click(await screen.findByRole('button', { name: 'Tentar novamente' }))

    expect(await screen.findByText('Parque da Luz')).toBeInTheDocument()
    expect(screen.queryByText(/podem estar desatualizados/i)).not.toBeInTheDocument()
  })
})