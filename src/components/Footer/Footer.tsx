import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer>
      <p>Portal de Locais e Serviços Acessíveis</p>

      <nav aria-label="Navegação do rodapé">
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>

          <li>
            <Link to="/locais">Locais</Link>
          </li>

          <li>
            <Link to="/cadastrar">Cadastro</Link>
          </li>

          <li>
            <Link to="/sobre">Sobre</Link>
          </li>
        </ul>
      </nav>
    </footer>
  );
}