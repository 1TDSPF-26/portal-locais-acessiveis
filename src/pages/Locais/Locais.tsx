import { ListagemLocais } from '../../services/ListagemLocais'

function Locais() {
  async function testarAPI() {
    try {
      const resultado = await ListagemLocais()

      console.log('Resultado recebido pela página:', resultado)
    } catch (erro) {
      console.error(erro)
    }
  }

  return (
    <div>
      <h1>Locais</h1>

      <button type="button" onClick={testarAPI}>
        Testar API
      </button>
    </div>
  )
}

export default Locais