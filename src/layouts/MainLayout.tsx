import { useEffect, useRef, type ReactNode } from "react";

import { Header } from "../components/Header/Header";

import { Footer } from "../components/Footer/Footer";
import { useLocation } from "react-router-dom";

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {

  const { pathname } = useLocation();
  const mainRef = useRef<HTMLElement>(null);
  const isFirstRender = useRef(true);

  useEffect(() => {
    if(isFirstRender.current){
      isFirstRender.current = false;
      return;
    }
    mainRef.current?.focus();
  }, [pathname]);

  return (

    <>

      <a
        href="#conteudo-principal"
        className="skip-link"
      >
        Pular para o conteúdo principal
      </a>

      <Header />

      <main id="conteudo-principal" tabIndex={-1} ref={mainRef}>
        {children}
      </main>

      <Footer />

    </>

  );
}