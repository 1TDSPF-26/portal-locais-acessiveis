import {NavLink} from "react-router-dom";
import "./Header.css";

export function Header() {
  return (
    <header>
      <h1>Portal de Locais e Serviços Acessíveis</h1>
      <nav className="mainNav" aria-label="Menu Principal">
        <ul>
          
          <li>
            <NavLink to="/" end>
              Home
            </NavLink>
          </li>
          <li>
            <NavLink to="/locais">
              Locais
            </NavLink>
          </li>
          <li>
            <NavLink to="/cadastrar">
              Cadastro
            </NavLink>
          </li>
          <li>
            <NavLink to="/sobre">
              Sobre
            </NavLink>
          </li>
        </ul>
      </nav>
    </header>
  );
}