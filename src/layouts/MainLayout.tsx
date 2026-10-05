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

      <main id="conteudo-principal" tabIndex={-1} className="mx-auto w-full max-w-5xl px-4 py-6 break-words sm:px-6 sm:py-8 lg:px-8 lg:py-10">
        {children}
      </main>

      <Footer />

    </>

  );
}