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
  const previousPathname = useRef(pathname);


  useEffect(() => {
    if(previousPathname.current !== pathname){
      mainRef.current?.focus();
    }
    previousPathname.current = pathname;
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