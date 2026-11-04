import { Link } from 'react-router-dom'

function ComoContribuir() {
  return (
    <div className="stack-lg bg-cor-fundo-principal font-sans text-cor-textos">
      <header className="stack">
        <h1 className="text-h1 font-bold leading-[1.2] text-cor-titulos">
          Como contribuir com um novo local
        </h1>
        <p className="text-body leading-[1.5]">
          Antes de cadastrar um local, veja quais informações o formulário pede
          e como preenchê-las para que a contribuição seja útil para outras
          pessoas.
        </p>
      </header>

      <section className="stack" aria-labelledby="titulo-antes-de-comecar">
        <h2 id="titulo-antes-de-comecar" className="text-h2 font-semibold text-cor-titulos">
          Antes de começar
        </h2>
        <ul className="stack">
          <li className="text-body leading-[1.5]">
            Cadastre apenas locais que você conhece ou sobre os quais tem
            informações confiáveis.
          </li>
          <li className="text-body leading-[1.5]">
            Os campos marcados com (obrigatório) precisam ser preenchidos para
            enviar o cadastro.
          </li>
          <li className="text-body leading-[1.5]">
            Se algum campo estiver incorreto, o formulário mostra um resumo dos
            erros com links para cada campo.
          </li>
        </ul>
      </section>

      <section className="stack" aria-labelledby="titulo-informacoes-local">
        <h2 id="titulo-informacoes-local" className="text-h2 font-semibold text-cor-titulos">
          Informações do local
        </h2>
        <dl className="stack">
          <div>
            <dt className="font-semibold text-cor-titulos">Nome do local (obrigatório)</dt>
            <dd className="text-body leading-[1.5]">
              Use o nome pelo qual o local é conhecido, com pelo menos 3
              caracteres.
            </dd>
          </div>
          <div>
            <dt className="font-semibold text-cor-titulos">Categoria (obrigatório)</dt>
            <dd className="text-body leading-[1.5]">
              Informe o tipo de local, como restaurante, escola, farmácia ou
              parque.
            </dd>
          </div>
          <div>
            <dt className="font-semibold text-cor-titulos">Descrição do local (obrigatório)</dt>
            <dd className="text-body leading-[1.5]">
              Escreva um resumo que ajude outras pessoas a identificar o local,
              com no máximo 300 caracteres.
            </dd>
          </div>
        </dl>
      </section>

      <section className="stack" aria-labelledby="titulo-endereco">
        <h2 id="titulo-endereco" className="text-h2 font-semibold text-cor-titulos">
          Endereço
        </h2>
        <p className="text-body leading-[1.5]">
          Um endereço completo facilita encontrar o local. O formulário pede:
        </p>
        <ul className="stack">
          <li className="text-body leading-[1.5]">Rua (obrigatório);</li>
          <li className="text-body leading-[1.5]">Número, quando houver;</li>
          <li className="text-body leading-[1.5]">Cidade (obrigatório);</li>
          <li className="text-body leading-[1.5]">Estado (obrigatório).</li>
        </ul>
      </section>

      <section className="stack" aria-labelledby="titulo-acessibilidade">
        <h2 id="titulo-acessibilidade" className="text-h2 font-semibold text-cor-titulos">
          Informações de acessibilidade
        </h2>
        <p className="text-body leading-[1.5]">
          No campo Nível de acessibilidade (obrigatório), escolha a opção que
          melhor descreve o local:
        </p>
        <ul className="stack">
          <li className="text-body leading-[1.5]">
            <strong>Acessível:</strong> o local atende bem às necessidades de
            acessibilidade que você conhece.
          </li>
          <li className="text-body leading-[1.5]">
            <strong>Parcialmente acessível:</strong> o local tem alguns
            recursos, mas também barreiras.
          </li>
          <li className="text-body leading-[1.5]">
            <strong>Não acessível:</strong> o local apresenta barreiras que
            impedem ou dificultam o acesso.
          </li>
        </ul>
        <p className="text-body leading-[1.5]">
          A opção Não informado não é aceita no envio. No campo Recursos e
          limitações de acessibilidade, que é opcional, descreva o que você
          observou, como rampa, banheiro adaptado, piso tátil ou degraus na
          entrada.
        </p>
      </section>

      <section className="stack" aria-labelledby="titulo-pronto">
        <h2 id="titulo-pronto" className="text-h2 font-semibold text-cor-titulos">
          Pronto para contribuir?
        </h2>
        <p className="text-body leading-[1.5]">
          Com essas informações em mãos, acesse o formulário de cadastro.
        </p>
        <Link
          to="/cadastrar"
          className="w-full rounded-lg border-2 border-cor-botao-principal bg-cor-botao-principal px-5 py-3 text-center text-(length:--text-botao) font-semibold text-cor-fundo-principal no-underline focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-cor-apoio md:w-fit"
        >
          Cadastrar um local
        </Link>
      </section>
    </div>
  )
}

export default ComoContribuir
