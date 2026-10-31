import { useEffect, useRef, useState } from 'react'

import { ListagemLocais } from '../../services/ListagemLocais'
import { LoadingState } from '../../components/LoadingState/LoadingState'
import { ErrorState } from '../../components/ErrorState/ErrorState'
import { EmptyState } from '../../components/EmptyState/EmptyState'
import { ContagemResultados } from '../../components/ContagemResultados/ContagemResultados'
import LocalCard from '../../components/LocalCard/LocalCard'

import type { Local } from '../../types/Local'
import {
  CRITERIOS_PADRAO,
  ROTULOS_ACESSIBILIDADE,
  filtrarLocais,
  obterCategorias,
  type OrdemNome,
  type StatusAcessibilidade,
} from '../../utils/filtrarLocais'
import { calcularDistancia } from '../../utils/geo'
import { ITENS_POR_PAGINA, usePaginacao } from './hooks/usePaginacao'
import { Paginacao } from './hooks/Paginacao'

const classeControle =
  'min-h-11 w-full min-w-0 max-w-full rounded-md border border-cor-textos bg-cor-fundo-principal px-3 py-2 text-legendas text-cor-titulos focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cor-apoio focus-visible:ring-offset-2'

type PosicaoUsuario = { lat: number; lon: number }

function distanciaAte(posicao: PosicaoUsuario, local: Local) {
  const latitude = local.coordenadas?.latitude
  const longitude = local.coordenadas?.longitude

  if (typeof latitude !== 'number' || typeof longitude !== 'number') {
    return Number.POSITIVE_INFINITY
  }

  return calcularDistancia(posicao.lat, posicao.lon, latitude, longitude)
}

function Locais() {
  const [locais, setLocais] = useState<Local[]>([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState(false)
  const [atualizando, setAtualizando] = useState(false)
  const [mensagemStatus, setMensagemStatus] = useState('')
  const requisicaoEmAndamento = useRef(false)
  const [termoBusca, setTermoBusca] = useState(CRITERIOS_PADRAO.termoBusca)
  const [categoria, setCategoria] = useState(CRITERIOS_PADRAO.categoria)
  const [acessibilidade, setAcessibilidade] = useState(CRITERIOS_PADRAO.acessibilidade)
  const [ordem, setOrdem] = useState<OrdemNome | 'proximidade'>(CRITERIOS_PADRAO.ordem)

  const [userLocation, setUserLocation] = useState<PosicaoUsuario | null>(null)
  const [carregandoGeo, setCarregandoGeo] = useState(false)
  const [erroGeo, setErroGeo] = useState<string | null>(null)

  // Resultados derivados da lista original: alterar busca, filtros ou ordem não refaz a requisição.
  const categorias = obterCategorias(locais)
  const locaisFiltrados = filtrarLocais(locais, {
    termoBusca,
    categoria,
    acessibilidade,
    ordem: ordem === 'proximidade' ? 'asc' : ordem,
  })
  const locaisOrdenados =
    ordem === 'proximidade' && userLocation
      ? [...locaisFiltrados].sort((a, b) => {
          const distanciaA = distanciaAte(userLocation, a)
          const distanciaB = distanciaAte(userLocation, b)
          return distanciaA === distanciaB ? 0 : distanciaA - distanciaB
        })
      : locaisFiltrados
  const { itensPaginados,
    paginaAtual,
    totalPaginas,
    proximaPagina,
    paginaAnterior,
    temProxima,
    temAnterior,
    setPaginaAtual,
  } = usePaginacao({
    itens: locaisOrdenados,
    itensPorPagina: ITENS_POR_PAGINA,
  })

  function limparFiltros() {
    setTermoBusca(CRITERIOS_PADRAO.termoBusca)
    setCategoria(CRITERIOS_PADRAO.categoria)
    setAcessibilidade(CRITERIOS_PADRAO.acessibilidade)
    setOrdem(CRITERIOS_PADRAO.ordem)
    setUserLocation(null)
    setErroGeo(null)
  }

  function solicitarLocalizacao() {
    if (!navigator.geolocation) {
      setErroGeo('Geolocalização não é suportada pelo seu navegador.')
      return
    }

    setCarregandoGeo(true)
    setErroGeo(null)

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        })
        setOrdem('proximidade')
        setCarregandoGeo(false)
      },
      () => {
        setErroGeo('Não foi possível obter sua localização. Verifique as permissões.')
        setCarregandoGeo(false)
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 },
    )
  }

  async function carregarLocais(origem: 'inicial' | 'retry' | 'manual' = 'inicial') {
  if (requisicaoEmAndamento.current) return
  requisicaoEmAndamento.current = true

  if (origem === 'manual') {
    setAtualizando(true)
    setMensagemStatus('Atualizando locais...')
  } else {
    setCarregando(true)
  }
  setErro(false)

  try {
    const resultado = await ListagemLocais({ forcarAtualizacao: origem !== 'inicial' })
    setLocais(resultado)
    setMensagemStatus(origem === 'manual' ? 'Locais atualizados.' : '')
  } catch {
    setErro(true)
    setLocais([])
    setMensagemStatus('')
  } finally {
    requisicaoEmAndamento.current = false
    setCarregando(false)
    setAtualizando(false)
  }
}

  useEffect(() => {
    carregarLocais()
  }, [])

  if (carregando) {
  return <LoadingState message="Carregando locais..." variant="skeleton" />
  }

  if (erro) {
    return <ErrorState onRetry={() => carregarLocais('retry')} />
  }

  if (locais.length === 0) {
    return (<EmptyState title="Nenhum local encontrado." message="Não encontramos locais acessíveis para exibir no momento" actionLabel="Atualizar locais" onAction={() => carregarLocais('retry')} /> )
  }

  return (
    <section className="page-container stack min-w-0">
      <h1>Locais</h1>

      <form
        aria-label="Buscar e filtrar locais"
        className="grid min-w-0 grid-cols-1 items-end gap-4 sm:grid-cols-2"
        onSubmit={(e) => e.preventDefault()}
      >
        <div className="flex min-w-0 flex-col gap-2">
          <label htmlFor="busca-nome">Buscar local por nome:</label>
          <input
            id="busca-nome"
            type="text"
            placeholder="Digite o nome do local..."
            value={termoBusca}
            onChange={(e) => setTermoBusca(e.target.value)}
            className={classeControle}
          />
        </div>

        <div className="flex min-w-0 flex-col gap-2">
          <label htmlFor="filtro-categoria">Categoria:</label>
          <select
            id="filtro-categoria"
            className={classeControle}
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
          >
            <option value="">Todas as categorias</option>
            {categorias.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>

        <div className="flex min-w-0 flex-col gap-2">
          <label htmlFor="filtro-acessibilidade">Acessibilidade:</label>
          <select
            id="filtro-acessibilidade"
            className={classeControle}
            value={acessibilidade}
            onChange={(e) => setAcessibilidade(e.target.value as StatusAcessibilidade | '')}
          >
            <option value="">Todos os níveis</option>
            {Object.entries(ROTULOS_ACESSIBILIDADE).map(([status, rotulo]) => (
              <option key={status} value={status}>
                {rotulo}
              </option>
            ))}
          </select>
        </div>



        <div className="flex min-w-0 flex-col gap-2">
          <label htmlFor="ordenacao-nome">Ordenar por nome:</label>
          <select
            id="ordenacao-nome"
            className={classeControle}
            value={ordem}
            onChange={(e) => setOrdem(e.target.value as OrdemNome | 'proximidade')}
          >
            <option value="asc">A a Z</option>
            <option value="desc">Z a A</option>
            <option value="proximidade" disabled={!userLocation}>
              Proximidade (mais próximo)
            </option>
          </select>
        </div>

        <button
          type="button"
          onClick={limparFiltros}
          className="min-h-11 w-full min-w-0 whitespace-normal rounded-md bg-cor-botao-principal px-4 py-2 text-botao font-semibold text-cor-fundo-principal transition-colors hover:bg-cor-apoio focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cor-apoio focus-visible:ring-offset-2 sm:col-span-2 sm:w-auto sm:justify-self-start"
          >
          Limpar filtros
        </button>

        <button
          type="button"
          onClick={() => carregarLocais('manual')}
          aria-disabled={atualizando}
          className={`inline-flex items-center gap-2 rounded-md border-2 border-cor-botao-principal bg-cor-fundo-principal px-4 py-2 text-botao font-semibold text-cor-botao-principal transition-colors hover:bg-cor-superficies-cards focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cor-apoio focus-visible:ring-offset-2 ${atualizando ? 'cursor-not-allowed opacity-70' : ''}`}
        >
          {atualizando && (
            <span
              aria-hidden="true"
              className="h-4 w-4 animate-spin rounded-full border-2 border-cor-botao-principal border-t-transparent"
            />
          )}
          Atualizar locais
        </button>

        <div className="flex flex-col gap-2 sm:col-span-2">
          <button
            type="button"
            onClick={solicitarLocalizacao}
            className="min-h-11 w-full min-w-0 rounded-md border border-cor-apoio bg-transparent px-4 py-2 text-botao font-semibold text-cor-titulos transition-colors hover:bg-cor-apoio/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cor-apoio focus-visible:ring-offset-2"
            aria-label="Obter minha localização atual para habilitar ordenação por proximidade"
          >
            {carregandoGeo ? 'Obtendo localização...' : '📍 Usar minha localização atual'}
          </button>
          {erroGeo && <span className="text-sm text-red-500">{erroGeo}</span>}
        </div>
      </form>

      <p aria-live="polite" className="text-legendas text-cor-textos">
        {mensagemStatus}
      </p>

      <ContagemResultados total={locaisFiltrados.length} />

      {locaisFiltrados.length > 0 ? (

        <>
          <ul className="stack min-w-0">
            {itensPaginados.map((local) => (
              <li key={local.id} className="min-w-0">
                <LocalCard local={local} />
              </li>
            ))}
          </ul>
          <Paginacao
            paginaAtual={paginaAtual}
            totalPaginas={totalPaginas}
            temAnterior={temAnterior}
            temProxima={temProxima}
            paginaAnterior={paginaAnterior}
            proximaPagina={proximaPagina}
            setPaginaAtual={setPaginaAtual}
          />
        </>

      ) : (
        <EmptyState
          title="Nenhum resultado encontrado."
          message="Não encontramos nenhum local que corresponda à busca e aos filtros selecionados."
          actionLabel="Limpar filtros"
          onAction={limparFiltros}
        />
      )}
    </section>
  )


}

export default Locais