import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import { ListagemLocais } from '../../services/ListagemLocais'
import { LoadingState } from '../../components/LoadingState/LoadingState'
import { ErrorState } from '../../components/ErrorState/ErrorState'
import { EmptyState } from '../../components/EmptyState/EmptyState'

import type { Local } from '../../types/Local'

function Locais() {
  const [locais, setLocais] = useState<Local[]>([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState(false)
  const [termoBusca, setTermoBusca] = useState('')


  const locaisFiltrados = locais.filter((local) =>
    local.nome.toLowerCase().includes(termoBusca.toLowerCase())
  )



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
    <section>
      <h1>Locais</h1>

      <div>
        <label htmlFor="busca-nome">Buscar local por nome:</label>
        <input
          id="busca-nome"
          type="text"
          placeholder="Digite o nome do local..."
          value={termoBusca}
          onChange={(e) => setTermoBusca(e.target.value)}
        />
      </div>



      {locaisFiltrados.length > 0 ? (
        <ul>
          {locaisFiltrados.map((local) => (
            <li key={local.id}>
              <Link to={`/locais/${local.id}`}>
                <h2>{local.nome}</h2>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <EmptyState
          title="Nenhum resultado encontrado."
          message={`Não encontramos nenhum local correspondente a "${termoBusca}".`}
        />
      )}



      <ul>
        {locais.map((local) => (
          <li key={local.id}>
            <Link to={`/locais/${local.id}`}>
              <h2>{local.nome}</h2>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}

export default Locais