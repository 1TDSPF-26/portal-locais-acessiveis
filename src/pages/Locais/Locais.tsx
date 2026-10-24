import { useEffect, useState } from 'react'

import { ListagemLocais } from '../../services/ListagemLocais'
import { LoadingState } from '../../components/LoadingState/LoadingState'
import { ErrorState } from '../../components/ErrorState/ErrorState'
import { EmptyState } from '../../components/EmptyState/EmptyState'
import { ContagemResultados } from '../../components/ContagemResultados/ContagemResultados'
import LocalCard from '../../components/LocalCard/LocalCard'
import { WarningMessage } from '../../components/WarningMessage/WarningMessage'

import type { Local } from '../../types/Local'
import {
  CRITERIOS_PADRAO,
  ROTULOS_ACESSIBILIDADE,
  filtrarLocais,
  obterCategorias,
  type OrdemNome,
  type StatusAcessibilidade,
} from '../../utils/filtrarLocais'
import { ITENS_POR_PAGINA, usePaginacao } from './hooks/usePaginacao'
import { Paginacao } from './hooks/Paginacao'

const classeControle =
  'min-h-11 w-full min-w-0 max-w-full rounded-md border border-cor-textos bg-cor-fundo-principal px-3 py-2 text-legendas text-cor-titulos focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cor-apoio focus-visible:ring-offset-2'

function Locais() {
  const [locais, setLocais] = useState<Local[]>([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState(false)
  // Incrementado no "Tentar novamente" para disparar o efeito de carregamento outra vez.
  const [tentativa, setTentativa] = useState(0)
  const [termoBusca, setTermoBusca] = useState(CRITERIOS_PADRAO.termoBusca)
  const [categoria, setCategoria] = useState(CRITERIOS_PADRAO.categoria)
  const [acessibilidade, setAcessibilidade] = useState(CRITERIOS_PADRAO.acessibilidade)
  const [ordem, setOrdem] = useState(CRITERIOS_PADRAO.ordem)

  // Resultados derivados da lista original: alterar busca, filtros ou ordem não refaz a requisição.
  const categorias = obterCategorias(locais)
  const locaisFiltrados = filtrarLocais(locais, { termoBusca, categoria, acessibilidade, ordem })
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
    itens: locaisFiltrados,
    itensPorPagina: ITENS_POR_PAGINA,
  })

  function limparFiltros() {
    setTermoBusca(CRITERIOS_PADRAO.termoBusca)
    setCategoria(CRITERIOS_PADRAO.categoria)
    setAcessibilidade(CRITERIOS_PADRAO.acessibilidade)
    setOrdem(CRITERIOS_PADRAO.ordem)
  }

  // Carrega os locais. Todos os setState acontecem depois do await,
  // então não há atualização de estado síncrona dentro do efeito.
  useEffect(() => {
    let cancelado = false

    async function carregar() {
      try {
        const resultado = await ListagemLocais()
        if (!cancelado) setLocais(resultado)
      } catch {
        if (!cancelado) {
          setErro(true)
          setLocais([])
        }
      } finally {
        if (!cancelado) setCarregando(false)
      }
    }

    carregar()

    return () => {
      cancelado = true
    }
  }, [tentativa])

  // Chamado por um evento do usuário (clique), onde setState é o uso correto.
  function tentarNovamente() {
    setCarregando(true)
    setErro(false)
    setTentativa((t) => t + 1)
  }

  if (carregando) {
    return <LoadingState message="Carregando locais..." />
  }

  if (erro) {
    return <ErrorState onRetry={tentarNovamente} />
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
            onChange={(e) => setOrdem(e.target.value as OrdemNome)}
          >
            <option value="asc">A a Z</option>
            <option value="desc">Z a A</option>
          </select>
        </div>

        <button
          type="button"
          onClick={limparFiltros}
          className="min-h-11 w-full min-w-0 whitespace-normal rounded-md bg-cor-botao-principal px-4 py-2 text-botao font-semibold text-cor-fundo-principal transition-colors hover:bg-cor-apoio focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cor-apoio focus-visible:ring-offset-2 sm:col-span-2 sm:w-auto sm:justify-self-start"
        >
          Limpar filtros
        </button>
      </form>

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
        <>
          <EmptyState
            title="Nenhum resultado encontrado."
            message="Não encontramos nenhum local que corresponda à busca e aos filtros selecionados."
            actionLabel="Limpar filtros"
            onAction={limparFiltros}
          />
          <WarningMessage
            title="Os resultados podem estar incompletos"
            message="A fonte de dados do portal pode não conter todos os locais. Revise o termo da busca ou os filtros selecionados. Se o local existe, ele pode ainda não ter sido cadastrado nessa fonte."
          />
        </>
      )}
    </section>
  )
}

export default Locais
