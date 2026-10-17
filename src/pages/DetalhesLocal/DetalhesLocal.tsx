import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'

import { buscarLocalPorId } from '../../services/buscarLocalPorId'
import { LoadingState } from '../../components/LoadingState/LoadingState'
import { ErrorState } from '../../components/ErrorState/ErrorState'
import { EmptyState } from '../../components/EmptyState/EmptyState'
import { Breadcrumb } from '../../components/Breadcrumb/Breadcrumb'

import type { Endereco, Local } from '../../types/Local'

import { validarIdLocal } from '../../utils/validarIdLocal'

type Estado =
  | { tipo: 'carregando' }
  | { tipo: 'erro' }
  | { tipo: 'nao-encontrado' }
  | { tipo: 'sucesso'; local: Local }

type EstadoComChave = {
  chave: string
  resultado: Estado
}

const rotulosAcessibilidade: Record<Local['acessibilidade']['status'], string> = {
  acessivel: 'Acessível',
  parcial: 'Parcialmente acessível',
  nao_acessivel: 'Não acessível',
  nao_informado: 'Não informado',
}

const classeLink =
  'inline-block rounded-md font-semibold text-cor-botao-principal underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cor-apoio focus-visible:ring-offset-2'

function formatarEndereco(endereco?: Endereco): string | null {
  if (!endereco) {
    return null
  }

  const { rua, numero, cidade, estado } = endereco
  const ruaENumero = [rua, numero].filter(Boolean).join(', ')
  const partes = [ruaENumero, cidade, estado].filter(Boolean)

  return partes.length > 0 ? partes.join(' - ') : null
}

function LinkVoltar() {
  return (
    <Link to="/locais" className={classeLink}>
      Voltar para a lista de locais
    </Link>
  )
}

function DetalhesLocal() {
  const { id } = useParams()
  const idNumerico = validarIdLocal(id)

  const [estado, setEstado] = useState<EstadoComChave>({
    chave: '',
    resultado: { tipo: 'carregando' },
  })

  const [tentativa, setTentativa] = useState(0)

  const chaveAtual = `${idNumerico ?? 'invalido'}-${tentativa}`

  useEffect(() => {
    if (idNumerico === null) {
      return
    }

    let ativo = true

    buscarLocalPorId(idNumerico)
      .then((local) => {
        if (ativo) {
          setEstado({
            chave: chaveAtual,
            resultado: local
              ? { tipo: 'sucesso', local }
              : { tipo: 'nao-encontrado' },
          })
        }
      })
      .catch(() => {
        if (ativo) {
          setEstado({
            chave: chaveAtual,
            resultado: { tipo: 'erro' },
          })
        }
      })

    return () => {
      ativo = false
    }
  }, [idNumerico, tentativa, chaveAtual])

  const estadoAtual: Estado =
    estado.chave === chaveAtual
      ? estado.resultado
      : { tipo: 'carregando' }

  if (idNumerico === null) {
    return (
      <section className="stack">
        <h1>Detalhes do local</h1>
        <EmptyState
          title="Identificador de local inválido."
          message="O endereço acessado não possui um identificador de local válido."
        />
        <LinkVoltar />
      </section>
    )
  }

  if (estadoAtual.tipo === 'carregando') {
    return <LoadingState message="Carregando detalhes do local..." />
  }

  if (estadoAtual.tipo === 'erro') {
    return (
      <ErrorState
        title="Não foi possível carregar o local"
        message="Ocorreu um problema ao carregar os detalhes do local. Tente novamente."
        onRetry={() => setTentativa((valor) => valor + 1)}
      />
    )
  }

  if (estadoAtual.tipo === 'nao-encontrado') {
    return (
      <section className="stack">
        <h1>Detalhes do local</h1>
        <EmptyState
          title="Local não encontrado."
          message="Não encontramos nenhum local correspondente a este identificador."
        />
        <LinkVoltar />
      </section>
    )
  }

  const { local } = estadoAtual
  const endereco = formatarEndereco(local.endereco)

  return (
    <article className="stack" aria-labelledby="titulo-local">
        
        <Breadcrumb
        items={[
          { label: 'Home', to: '/' },
          { label: 'Locais', to: '/locais' },
          { label: local.nome },
        ]}
      />

      <LinkVoltar />

      <h1 id="titulo-local">{local.nome}</h1>

      <dl className="stack">
        <div>
          <dt className="font-semibold">Categoria</dt>
          <dd>{local.categoria}</dd>
        </div>

        <div>
          <dt className="font-semibold">Descrição</dt>
          <dd>{local.descricao ?? 'Descrição não informada.'}</dd>
        </div>

        <div>
          <dt className="font-semibold">Endereço</dt>
          <dd>{endereco ?? 'Endereço não informado.'}</dd>
        </div>

        <div>
          <dt className="font-semibold">Acessibilidade</dt>
          <dd>{rotulosAcessibilidade[local.acessibilidade.status]}</dd>

          {local.acessibilidade.descricao && (
            <dd>{local.acessibilidade.descricao}</dd>
          )}
        </div>
      </dl>
    </article>
  )
}

export default DetalhesLocal
