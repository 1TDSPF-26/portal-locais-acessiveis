import { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'

import { ListagemLocais } from '../../services/ListagemLocais'
import { LoadingState } from '../../components/LoadingState/LoadingState'
import { ErrorState } from '../../components/ErrorState/ErrorState'
import { EmptyState } from '../../components/EmptyState/EmptyState'
import { ContagemResultados } from '../../components/ContagemResultados/ContagemResultados'
import LocalCard from '../../components/LocalCard/LocalCard'

import type { Local } from '../../types/Local'
import {
  ROTULOS_ACESSIBILIDADE,
  filtrarLocais,
  obterCategorias,
  type OrdemNome,
  type StatusAcessibilidade,
} from '../../utils/filtrarLocais'
import { ITENS_POR_PAGINA, usePaginacao } from './hooks/usePaginacao'
import { Paginacao } from './hooks/Paginacao'
import { useContextoListagem } from './hooks/useContextoListagem'

const classeControle =
  'rounded-md border border-cor-textos bg-cor-fundo-principal px-3 py-2 text-legendas text-cor-titulos focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cor-apoio focus-visible:ring-offset-2'

function Locais() {
  const [locais, setLocais] = useState<Local[]>([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState(false)
  const [atualizando, setAtualizando] = useState(false)
  const [mensagemStatus, setMensagemStatus] = useState('')
  const requisicaoEmAndamento = useRef(false)

  const location = useLocation()
  // Busca, filtros, ordem e página vêm da URL (/locais?busca=...&pagina=2), não de estado local.
  const { contexto, atualizar, limpar: limparFiltros } = useContextoListagem()
  const { termoBusca, categoria, acessibilidade, ordem, pagina } = contexto
  // Enviado ao detalhe para que o link "Voltar" restaure exatamente esta listagem.
  const origem = `${location.pathname}${location.search}`

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
    pagina,
    onPaginaChange: (novaPagina) => atualizar({ pagina: novaPagina }),
    // Enquanto a lista não carrega ela está vazia; não deve "corrigir" a página da URL para 1.
    sincronizar: !carregando && !erro,
  })

  // O parâmetro se chama "modo" (e não "origem") para não sombrear a constante "origem" da URL acima.
  async function carregarLocais(modo: 'inicial' | 'retry' | 'manual' = 'inicial') {
    if (requisicaoEmAndamento.current) return
    requisicaoEmAndamento.current = true

    if (modo === 'manual') {
      setAtualizando(true)
      setMensagemStatus('Atualizando locais...')
    } else {
      setCarregando(true)
    }
    setErro(false)

    try {
      const resultado = await ListagemLocais({ forcarAtualizacao: modo !== 'inicial' })
      setLocais(resultado)
      setMensagemStatus(modo === 'manual' ? 'Locais atualizados.' : '')
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
    return (
      <EmptyState
        title="Nenhum local encontrado."
        message="Não encontramos locais acessíveis para exibir no momento"
        actionLabel="Atualizar locais"
        onAction={() => carregarLocais('retry')}
      />
    )
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
            onChange={(e) => atualizar({ termoBusca: e.target.value })}
            className={classeControle}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="filtro-categoria">Categoria:</label>
          <select
            id="filtro-categoria"
            className={classeControle}
            value={categoria}
            onChange={(e) => atualizar({ categoria: e.target.value })}
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
            onChange={(e) => atualizar({ acessibilidade: e.target.value as StatusAcessibilidade | '' })}
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
            onChange={(e) => atualizar({ ordem: e.target.value as OrdemNome })}
          >
            <option value="asc">A a Z</option>
            <option value="desc">Z a A</option>
          </select>
        </div>

        <button
          type="button"
          onClick={limparFiltros}
          className="rounded-md bg-cor-botao-principal px-4 py-2 text-botao font-semibold text-cor-fundo-principal transition-colors hover:bg-cor-apoio focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cor-apoio focus-visible:ring-offset-2"
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
      </form>

      <p aria-live="polite" className="text-legendas text-cor-textos">
        {mensagemStatus}
      </p>

      <ContagemResultados total={locaisFiltrados.length} />

      {locaisFiltrados.length > 0 ? (
        <>
          <ul className="stack">
            {itensPaginados.map((local) => (
              <li key={local.id}>
                <LocalCard local={local} origem={origem} />
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
