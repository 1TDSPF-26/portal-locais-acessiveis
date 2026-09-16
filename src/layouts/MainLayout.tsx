import type { ReactNode } from "react";

import { Header } from "../components/Header/Header";

import { Footer } from "../components/Footer/Footer";

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {

  return (

    <>

      <a
        href="#conteudo-principal"
        className="skip-link"
      >
        Pular para o conteúdo principal
      </a>

      <Header />

      <main id="conteudo-principal" tabIndex={-1}>
        {children}
      </main>

      <Footer />

    </>

  );
}