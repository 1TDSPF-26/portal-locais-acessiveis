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
        className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:p-2 focus:bg-white focus:text-black focus:outline focus:outline-2"
      >
        Pular para o conteúdo principal
      </a>

      <Header />

      <main id="conteudo-principal">
        {children}
      </main>

      <Footer />
    </>
  );
}