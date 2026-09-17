import { Link, NavLink } from "react-router-dom";
import { useState, useEffect } from "react";
import "./Header.css";


export function Header() {
  const [menuAberto, setMenuAberto] = useState(false);

  useEffect(() => {
    function fecharComEsc(evento: KeyboardEvent) {
      if (evento.key === "Escape") {
        setMenuAberto(false);
      }
    }

    document.addEventListener("keydown", fecharComEsc);
    return () => document.removeEventListener("keydown", fecharComEsc);
  }, []);

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
            <NavLink to="/" end onClick={() => setMenuAberto(false)}>
              Home
            </NavLink>
          </li>
          <li>
            <NavLink to="/locais" onClick={() => setMenuAberto(false)}>
              Locais
            </NavLink>
          </li>
          <li>
            <NavLink to="/cadastrar" onClick={() => setMenuAberto(false)}>
              Cadastro
            </NavLink>
          </li>
          <li>
            <NavLink to="/sobre" onClick={() => setMenuAberto(false)}>
              Sobre
            </NavLink>
          </li>
        </ul>
      </nav>
    </header>
  );
}