import { useState } from 'react'

function Cadastro() {
  const [nome, setNome] = useState('')
  const [categoria, setCategoria] = useState('')

  return (
    <div>
      <header>
        <h1>Cadastro de Locais Acessíveis</h1>
        <p>Preencha as informações do local. O envio estará disponível em uma etapa futura.</p>
      </header>

      <form onSubmit={(event) => event.preventDefault()}>
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
        </fieldset>
      </form>
    </div>
  )
}

export default Cadastro
