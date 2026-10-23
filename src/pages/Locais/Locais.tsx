import { useEffect, useState, useMemo } from 'react'

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

function Locais() {
  const [locais, setLocais] = useState<Local[]>([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState(false)
  const [termoBusca, setTermoBusca] = useState(CRITERIOS_PADRAO.termoBusca)
  const [categoria, setCategoria] = useState(CRITERIOS_PADRAO.categoria)
  const [acessibilidade, setAcessibilidade] = useState(CRITERIOS_PADRAO.acessibilidade)
  const [ordem, setOrdem] = useState<OrdemNome | 'proximidade'>(CRITERIOS_PADRAO.ordem)

  // Estados de Geolocalização (armazenados apenas em memória, sem localStorage)
  const [userLocation, setUserLocation] = useState<{ lat: number; lon: number } | null>(null)
  const [carregandoGeo, setCarregandoGeo] = useState(false)
  const [erroGeo, setErroGeo] = useState<string | null>(null)

  // Função para solicitar localização após ação clara do usuário (ex: clique no botão)
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
        setOrdem('proximidade') // Muda automaticamente para proximidade ao obter
        setCarregandoGeo(false)
      },
      () => {
        setErroGeo('Não foi possível obter sua localização. Verifique as permissões.')
        setCarregandoGeo(false)
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    )
  }

  async function carregarLocais() {
    setCarregando(true)
    setErro(false)

    try {
      const resultado = await ListagemLocais()
      setLocais(resultado)
    } catch {
      setErro(true)
      setLocais([])
    } finally {
      setCarregando(false)
    }
  }

  useEffect(() => {
    carregarLocais()
  }, [])

  // Categorias obtidas da lista original
  const categorias = obterCategorias(locais)

  // 1. Aplica busca, filtros e critérios padrão existentes
  const locaisFiltradosBase = filtrarLocais(locais, {
    termoBusca,
    categoria,
    acessibilidade,
    ordem: ordem === 'proximidade' ? 'asc' : ordem, // Fallback interno para manter compatibilidade com filtrarLocais
  })

  // 2. Adiciona cálculo de distância e ordena por proximidade ou nome preservando filtros
  const locaisProcessados = useMemo(() => {
    let resultado = locaisFiltradosBase.map((localItem) => {
      const local = localItem as any
      let distancia: number | undefined = undefined

      const lat = local.coordenadas?.latitude
      const lon = local.coordenadas?.longitude

      if (userLocation && lat !== undefined && lon !== undefined) {
        distancia = calcularDistancia(
          userLocation.lat,
          userLocation.lon,
          lat,
          lon
        )
      }

      return {
        ...local,
        distancia,
      }
    })

    resultado.sort((a: any, b: any) => {
      if (ordem === 'proximidade' && userLocation) {
        if (a.distancia === undefined) return 1
        if (b.distancia === undefined) return -1
        return a.distancia - b.distancia // Do mais próximo para o mais distante
      }

      if (ordem === 'asc') {
        return a.nome.localeCompare(b.nome)
      }
      if (ordem === 'desc') {
        return b.nome.localeCompare(a.nome)
      }

      return 0
    })

    return resultado
  }, [locaisFiltradosBase, userLocation, ordem])

  const {
    itensPaginados,
    paginaAtual,
    totalPaginas,
    proximaPagina,
    paginaAnterior,
    temProxima,
    temAnterior,
    setPaginaAtual,
  } = usePaginacao({
    itens: locaisProcessados,
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

  if (carregando) {
    return <LoadingState message="Carregando locais..." variant="skeleton" />
  }

  if (erro) {
    return <ErrorState onRetry={carregarLocais} />
  }

  if (locais.length === 0) {
    return <EmptyState title="Nenhum local encontrado." message="Não encontramos locais acessíveis para exibir no momento" />
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
            <option value="asc">Nome: A a Z</option>
            <option value="desc">Nome: Z a A</option>
            <option value="proximidade" disabled={!userLocation}>
              Proximidade (Mais próximo)
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

        {/* Botão de geolocalização posicionado após o limpar filtros para respeitar a ordem de tabulação dos testes */}
        <div className="flex flex-col gap-2 sm:col-span-2">
          <button
            type="button"
            onClick={solicitarLocalizacao}
            className="min-h-11 w-full min-w-0 rounded-md border border-cor-apoio bg-transparent px-4 py-2 text-botao font-semibold text-cor-titulos transition-colors hover:bg-cor-apoio/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cor-apoio focus-visible:ring-offset-2"
            aria-label="Obter minha localização atual para habilitar ordenação por proximidade"
          >
            {carregandoGeo ? "Obtendo localização..." : "📍 Usar minha localização atual"}
          </button>
          {erroGeo && <span className="text-sm text-red-500">{erroGeo}</span>}
        </div>
      </form>

      <ContagemResultados total={locaisProcessados.length} />

      {locaisProcessados.length > 0 ? (
        <>
          <ul className="stack min-w-0">
            {itensPaginados.map((local: any) => (
              <li key={local.id} className="min-w-0">
                <LocalCard local={local} />
                {local.distancia !== undefined && (
                  <span className="text-xs text-cor-textos block mt-1">
                    📍 {local.distancia.toFixed(2)} km de distância
                  </span>
                )}
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