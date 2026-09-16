import { Link, NavLink } from "react-router-dom";
import "./Header.css";
import { AccessibilityControls } from "../AccessibilityControls/AccessibilityControls";


export function Header() {
  return (
    <header>
      <Link to="/" className="portal-title">
        <span>Portal de Locais e Serviços Acessíveis</span>
      </Link>
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

      <AccessibilityControls />

    </header>
  );
}