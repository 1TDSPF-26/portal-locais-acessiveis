import { Link } from "react-router-dom";
import { useDocumentTitle } from "../../hooks/useDocumentTitle";

import heroEcolocalizacao from '../../assets/hero-ecolocalizacao.png'

import './Home.css'


function Home() {
  useDocumentTitle("Home");

  return (
    <>
      <section className="home-hero" aria-labelledby="home-hero-titulo">
        {/* Camada exclusivamente decorativa: fora da leitura assistiva. */}
        <div className="home-hero__cena" aria-hidden="true">
          <img
            className="home-hero__imagem"
            src={heroEcolocalizacao}
            alt=""
            width={1600}
            height={900}
          />
        </div>

        {/* Conteúdo real: permanece acessível a leitores de tela. */}
        <div className="home-hero__conteudo">
          <h1 id="home-hero-titulo">Portal de Locais e Serviços Acessíveis</h1>
          <p>
            O Portal de Locais e Serviços Acessíveis reúne informações sobre
            locais e serviços com foco em acessibilidade, ajudando você a se
            planejar antes de visitar um lugar.
          </p>
          <p>
            Aqui você poderá consultar informações de acessibilidade de
            diferentes locais cadastrados na plataforma.
          </p>
          <p>
            <Link to="/locais">Ver locais cadastrados</Link>
          </p>
        </div>
      </section>

      <section
        id="como-funciona"
        className="home-como-funciona"
        aria-labelledby="home-como-funciona-titulo"
      >
        <div className="home-como-funciona__conteudo">
          <h2 id="home-como-funciona-titulo">Como o portal ajuda você</h2>
          {/* Os quatro cards entram na Issue #101. */}
        </div>
      </section>
    </>
  )
}

export default Home
