import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import { ListagemLocais } from '../../services/ListagemLocais'
import { LoadingState } from '../../components/LoadingState/LoadingState'
import { ErrorState } from '../../components/ErrorState/ErrorState'
import { EmptyState } from '../../components/EmptyState/EmptyState'
import { ContagemResultados } from '../../components/ContagemResultados/ContagemResultados'
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
  'rounded-md border border-[#465268] bg-white px-3 py-2 text-base text-[#172A3A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#244A5A] focus-visible:ring-offset-2'

function Locais() {
  const [locais, setLocais] = useState<Local[]>([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState(false)
  const [termoBusca, setTermoBusca] = useState(CRITERIOS_PADRAO.termoBusca)
  const [categoria, setCategoria] = useState(CRITERIOS_PADRAO.categoria)
  const [acessibilidade, setAcessibilidade] = useState(CRITERIOS_PADRAO.acessibilidade)
  const [ordem, setOrdem] = useState(CRITERIOS_PADRAO.ordem)

  // Resultados derivados da lista original: alterar busca, filtros ou ordem não refaz a requisição.
  const categorias = obterCategorias(locais)
  const locaisFiltrados = filtrarLocais(locais, { termoBusca, categoria, acessibilidade, ordem })
  const { itensPaginados,
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



  if (carregando) {
    return <LoadingState message="Carregando locais..." />
  }

  if (erro) {
    return <ErrorState onRetry={carregarLocais} />
  }

  if (locais.length === 0) {
    return <EmptyState title="Nenhum local encontrado." message="Não encontramos locais acessíveis para exibir no momento" />
  }

  return (
    <section className="stack">
      <h1>Locais</h1>

      <form
        aria-label="Buscar e filtrar locais"
        className="flex flex-wrap items-end gap-4"
        onSubmit={(e) => e.preventDefault()}
      >
        <div className="flex flex-col gap-2">
          <label htmlFor="busca-nome">Buscar local por nome:</label>
          <input
            id="busca-nome"
            type="text"
            placeholder="Digite o nome do local..."
            value={termoBusca}
            onChange={(e) => setTermoBusca(e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-2">
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

        <div className="flex flex-col gap-2">
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



        <div className="flex flex-col gap-2">
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
          className="rounded-md bg-[#216FCE] px-4 py-2 text-base font-semibold text-white transition-colors hover:bg-[#244A5A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#244A5A] focus-visible:ring-offset-2"
        >
          Limpar filtros
        </button>
      </form>

      <ContagemResultados total={locaisFiltrados.length} />

      {locaisFiltrados.length > 0 ? (
        <>
          <ul className="stack">
            {itensPaginados.map((local) => (
              <li key={local.id}>
                <Link to={`/locais/${local.id}`}>
                  <h2>{local.nome}</h2>
                </Link>
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