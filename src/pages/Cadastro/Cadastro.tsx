import type { FormEvent } from 'react'
import { useRef, useState } from 'react'
import './Cadastro.css'
import {
  IDS_CAMPOS,
  ROTULOS_CAMPOS,
  listarCamposInvalidos,
  validarCadastro,
  type CampoCadastro,
  type ErrosCadastro,
  type ValoresCadastro,
} from './validacaoCadastro'

type ElementoDeCampo = HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement

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

  const [erros, setErros] = useState<ErrosCadastro>({})
  const [houveTentativaDeEnvio, setHouveTentativaDeEnvio] = useState(false)

  const camposRef = useRef<Partial<Record<CampoCadastro, ElementoDeCampo | null>>>({})

  const valoresCadastro: ValoresCadastro = {
    nome,
    categoria,
    descricao,
    rua: endereco.rua,
    cidade: endereco.cidade,
    estado: endereco.estado,
    statusAcessibilidade,
  }

  function revalidar(valoresAtualizados: ValoresCadastro) {
    if (!houveTentativaDeEnvio) {
      return
    }

    setErros(validarCadastro(valoresAtualizados))
  }

  function atualizarEndereco(campo: keyof typeof endereco, valor: string) {
    const enderecoAtualizado = { ...endereco, [campo]: valor }
    setEndereco(enderecoAtualizado)
    revalidar({
      ...valoresCadastro,
      rua: enderecoAtualizado.rua,
      cidade: enderecoAtualizado.cidade,
      estado: enderecoAtualizado.estado,
    })
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const errosEncontrados = validarCadastro(valoresCadastro)
    setErros(errosEncontrados)
    setHouveTentativaDeEnvio(true)

    const camposInvalidos = listarCamposInvalidos(errosEncontrados)

    if (camposInvalidos.length > 0) {
      camposRef.current[camposInvalidos[0]]?.focus()
      return
    }
  }

  const camposInvalidos = listarCamposInvalidos(erros)
  const idErro = (campo: CampoCadastro) => `erro-${IDS_CAMPOS[campo]}`

  function atributosDeErro(campo: CampoCadastro, descritoPor?: string) {
    const temErro = Boolean(erros[campo])
    const descricoes = [descritoPor, temErro ? idErro(campo) : undefined]
      .filter(Boolean)
      .join(' ')

    return {
      'aria-invalid': temErro || undefined,
      'aria-describedby': descricoes === '' ? undefined : descricoes,
    }
  }

  function mensagemDeErro(campo: CampoCadastro) {
    if (!erros[campo]) {
      return null
    }

    return (
      <p className="cadastro__erro" id={idErro(campo)}>
        <span aria-hidden="true">⚠</span> <strong>Erro:</strong> {erros[campo]}
      </p>
    )
  }

  return (
    <div className="cadastro">
      <header>
        <h1>Cadastro de Locais Acessíveis</h1>
        <p>
          Preencha as informações necessárias para cadastro.
        </p>
      </header>

      <form onSubmit={handleSubmit} noValidate>
        <div aria-live="assertive" role="alert">
          {camposInvalidos.length > 0 && (
            <section className="cadastro__resumo-erros" aria-labelledby="titulo-resumo-erros">
              <h2 id="titulo-resumo-erros">
                {camposInvalidos.length === 1
                  ? 'Encontramos 1 erro no formulário'
                  : `Encontramos ${camposInvalidos.length} erros no formulário`}
              </h2>
              <p>Corrija os campos abaixo para continuar o cadastro.</p>
              <ul>
                {camposInvalidos.map((campo) => (
                  <li key={campo}>
                    <a href={`#${IDS_CAMPOS[campo]}`}>
                      {ROTULOS_CAMPOS[campo]}: {erros[campo]}
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>

        <p className="cadastro__aviso-obrigatorio" id="aviso-campos-obrigatorio">
          Os campos marcados com (obrigatório) precisam ser preenchidos.
        </p>

        <fieldset>
          <legend>Informações do local</legend>

          <div className="campo-largo">
            <label htmlFor="nome-local">
              Nome do local <span className="cadastro__obrigatorio">(obrigatório)</span>
            </label>
            <input
              id="nome-local"
              name="nome"
              type="text"
              value={nome}
              ref={(elemento) => {
                camposRef.current.nome = elemento
              }}
              onChange={(event) => {
                setNome(event.target.value)
                revalidar({ ...valoresCadastro, nome: event.target.value })
              }}
              {...atributosDeErro('nome')}
            />
            {mensagemDeErro('nome')}
          </div>

          <div>
            <label htmlFor="categoria-local">
              Categoria <span className="cadastro__obrigatorio">(obrigatório)</span>
            </label>
            <input
              id="categoria-local"
              name="categoria"
              type="text"
              value={categoria}
              ref={(elemento) => {
                camposRef.current.categoria = elemento
              }}
              onChange={(event) => {
                setCategoria(event.target.value)
                revalidar({ ...valoresCadastro, categoria: event.target.value })
              }}
              {...atributosDeErro('categoria')}
            />
            {mensagemDeErro('categoria')}
          </div>

          <div className="campo-largo">
            <label htmlFor="descricao-local">
              Descrição do local <span className="cadastro__obrigatorio">(obrigatório)</span>
            </label>
            <textarea
              id="descricao-local"
              name="descricao"
              rows={4}
              value={descricao}
              ref={(elemento) => {
                camposRef.current.descricao = elemento
              }}
              onChange={(event) => {
                setDescricao(event.target.value)
                revalidar({ ...valoresCadastro, descricao: event.target.value })
              }}
              {...atributosDeErro('descricao')}
            />
            {mensagemDeErro('descricao')}
          </div>
        </fieldset>

        <fieldset>
          <legend>Endereço</legend>

          <div className="campo-largo">
            <label htmlFor="rua-local">
              Rua <span className="cadastro__obrigatorio">(obrigatório)</span>
            </label>
            <input
              id="rua-local"
              name="rua"
              type="text"
              value={endereco.rua}
              ref={(elemento) => {
                camposRef.current.rua = elemento
              }}
              onChange={(event) => atualizarEndereco('rua', event.target.value)}
              {...atributosDeErro('rua')}
            />
            {mensagemDeErro('rua')}
          </div>

          <div>
            <label htmlFor="numero-local">Número</label>
            <input
              id="numero-local"
              name="numero"
              type="text"
              value={endereco.numero}
              onChange={(event) => atualizarEndereco('numero', event.target.value)}
            />
          </div>

          <div>
            <label htmlFor="cidade-local">
              Cidade <span className="cadastro__obrigatorio">(obrigatório)</span>
            </label>
            <input
              id="cidade-local"
              name="cidade"
              type="text"
              value={endereco.cidade}
              ref={(elemento) => {
                camposRef.current.cidade = elemento
              }}
              onChange={(event) => atualizarEndereco('cidade', event.target.value)}
              {...atributosDeErro('cidade')}
            />
            {mensagemDeErro('cidade')}
          </div>

          <div>
            <label htmlFor="estado-local">
              Estado <span className="cadastro__obrigatorio">(obrigatório)</span>
            </label>
            <input
              id="estado-local"
              name="estado"
              type="text"
              value={endereco.estado}
              ref={(elemento) => {
                camposRef.current.estado = elemento
              }}
              onChange={(event) => atualizarEndereco('estado', event.target.value)}
              {...atributosDeErro('estado')}
            />
            {mensagemDeErro('estado')}
          </div>
        </fieldset>

        <fieldset>
          <legend>Acessibilidade do local</legend>

          <div>
            <label htmlFor="status-acessibilidade">
              Nível de acessibilidade{' '}
              <span className="cadastro__obrigatorio">(obrigatório)</span>
            </label>
            <select
              id="status-acessibilidade"
              name="statusAcessibilidade"
              value={statusAcessibilidade}
              ref={(elemento) => {
                camposRef.current.statusAcessibilidade = elemento
              }}
              onChange={(event) => {
                setStatusAcessibilidade(event.target.value)
                revalidar({ ...valoresCadastro, statusAcessibilidade: event.target.value })
              }}
              {...atributosDeErro('statusAcessibilidade')}
            >
              <option value="nao_informado">Não informado</option>
              <option value="acessivel">Acessível</option>
              <option value="parcial">Parcialmente acessível</option>
              <option value="nao_acessivel">Não acessível</option>
            </select>
            {mensagemDeErro('statusAcessibilidade')}
          </div>

          <div className="campo-largo">
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

        <p id="aviso-envio">O envio ainda não está disponível. Nenhum dado será salvo.</p>
        <button type="submit" aria-describedby="aviso-envio">
          Enviar cadastro
        </button>
      </form>
    </div>
  )
}

export default Cadastro