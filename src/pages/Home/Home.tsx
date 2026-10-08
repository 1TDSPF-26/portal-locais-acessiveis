import { Link } from "react-router-dom";
import { useDocumentTitle } from "../../hooks/useDocumentTitle";

function Home() {
  useDocumentTitle("Home");

  return (
    <section className="stack px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
      <h1>Portal de Locais e Serviços Acessíveis</h1>
      <p>
        O Portal de Locais e Serviços Acessíveis reúne informações sobre locais
        e serviços com foco em acessibilidade, ajudando você a se planejar antes
        de visitar um lugar.
      </p>
      <p>
        Aqui você poderá consultar informações de acessibilidade de diferentes
        locais cadastrados na plataforma.
      </p>
      <p>
        <Link to="/locais">Ver locais cadastrados</Link>
      </p>
    </section>
  );
}

export default Home;
