import type { FormEvent } from 'react'
import { useState } from 'react'

function Cadastro() {
  const [nome, setNome] = useState('')
  const [categoria, setCategoria] = useState('')
  const [descricao, setDescricao] = useState('')

  const [endereco, setEndereco] = useState({
    rua: '',
    numero: '',
    cidade: '',
    estado: '',
  })
  const [statusAcessibilidade, setStatusAcessibilidade] = useState('nao_informado')
  const [descricaoAcessibilidade, setDescricaoAcessibilidade] = useState('')

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
  event.preventDefault()
  }

  return (
    <div>
      <header>
        <h1>Cadastro de Locais Acessíveis</h1>
        <p>
          Preencha as informações do local. O envio estará disponível em uma etapa futura.
        </p>
      </header>

      <form onSubmit={handleSubmit}>
        <fieldset>
          <legend>Acessibilidade do local</legend>

          <div>
            <label htmlFor="status-acessibilidade">Nível de acessibilidade</label>
            <select
              id="status-acessibilidade"
              name="statusAcessibilidade"
              value={statusAcessibilidade}
              onChange={(event) => setStatusAcessibilidade(event.target.value)}
            >
              <option value="nao_informado">Não informado</option>
              <option value="acessivel">Acessível</option>
              <option value="parcial">Parcialmente acessível</option>
              <option value="nao_acessivel">Não acessível</option>
            </select>
          </div>

          <div>
            <label htmlFor="descricao-acessibilidade">Recursos e limitações de acessibilidade</label>
            <p id="ajuda-acessibilidade">
              Descreva os recursos conhecidos do local, como rampa ou banheiro adaptado,
              e as limitações que considerar relevantes.
            </p>
            <textarea
              id="descricao-acessibilidade"
              name="descricaoAcessibilidade"
              rows={4}
              aria-describedby="ajuda-acessibilidade"
              value={descricaoAcessibilidade}
              onChange={(event) => setDescricaoAcessibilidade(event.target.value)}
            />
          </div>
        </fieldset>

        <fieldset>
          <legend>Informações do local</legend>

          <div>
            <label htmlFor="nome-local">Nome do local</label>
            <input
              id="nome-local"
              name="nome"
              type="text"
              value={nome}
              onChange={(event) => setNome(event.target.value)}
            />
          </div>

          <div>
            <label htmlFor="categoria-local">Categoria</label>
            <input
              id="categoria-local"
              name="categoria"
              type="text"
              value={categoria}
              onChange={(event) => setCategoria(event.target.value)}
            />
          </div>

          <div>
            <label htmlFor="descricao-local">Descrição do local</label>
            <textarea
              id="descricao-local"
              name="descricao"
              rows={4}
              value={descricao}
              onChange={(event) => setDescricao(event.target.value)}
            />
          </div>
        </fieldset>

        <fieldset>
          <legend>Endereço</legend>

          <div>
            <label htmlFor="rua-local">Rua</label>
            <input
              id="rua-local"
              name="rua"
              type="text"
              value={endereco.rua}
              onChange={(event) =>
                setEndereco({ ...endereco, rua: event.target.value })
              }
            />
          </div>

          <div>
            <label htmlFor="numero-local">Número</label>
            <input
              id="numero-local"
              name="numero"
              type="text"
              value={endereco.numero}
              onChange={(event) =>
                setEndereco({ ...endereco, numero: event.target.value })
              }
            />
          </div>

          <div>
            <label htmlFor="cidade-local">Cidade</label>
            <input
              id="cidade-local"
              name="cidade"
              type="text"
              value={endereco.cidade}
              onChange={(event) =>
                setEndereco({ ...endereco, cidade: event.target.value })
              }
            />
          </div>

          <div>
            <label htmlFor="estado-local">Estado</label>
            <input
              id="estado-local"
              name="estado"
              type="text"
              value={endereco.estado}
              onChange={(event) =>
                setEndereco({ ...endereco, estado: event.target.value })
              }
            />
          </div>
          <p id="aviso-envio">O envio ainda não está disponível. Nenhum dado será salvo.</p>
          <button type="submit" aria-describedby="aviso-envio">
            Enviar cadastro
          </button>
        </fieldset>
      </form>
    </div>
  )
}



export default Cadastro