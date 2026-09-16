import { Link, NavLink } from "react-router-dom";
import { useState } from "react";
import "./Header.css";


export function Header() {
  const [menuAberto, setMenuAberto] = useState(false);

  return (
    <header>

    <button
      className="menuMobileButton"
      type="button"
      aria-expanded={menuAberto}
      aria-controls="menu-principal"
      onClick={() => setMenuAberto(!menuAberto)}>
  Menu
  </button>

      <Link to="/" className="portal-title">
        <span>Portal de Locais e Serviços Acessíveis</span>
      </Link>
      <nav id="menu-principal"   className={`mainNav ${menuAberto ? "aberto" : ""}`} aria-label="Menu Principal">
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