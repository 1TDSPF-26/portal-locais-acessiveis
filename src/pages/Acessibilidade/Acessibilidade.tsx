function Acessibilidade() {
  return (
    <div className="min-h-screen bg-cor-fundo-principal font-sans text-cor-textos">
      <div className="mb-[var(--spacing-acessibilidade-6)]">
        <h1 className="text-h1 font-bold leading-[var(--leading-acessibilidade-titulo)] text-cor-titulos">
          Acessibilidade no Portal de Locais e Serviços Acessíveis
        </h1>
        <p className="text-body leading-[var(--leading-acessibilidade-corpo)]">
          Aqui você encontra os recursos de acessibilidade já disponíveis no
          portal, como utilizá-los e o que ainda está em desenvolvimento.
        </p>
      </div>

      <div>
        <section className="mb-[var(--spacing-acessibilidade-6)]">
          <h2 className="text-h2 font-semibold text-cor-titulos">
            Nosso compromisso
          </h2>
          <p className="text-body leading-[var(--leading-acessibilidade-corpo)]">
            A acessibilidade não é um extra no Portal de Locais e Serviços
            Acessíveis, ela é a base de tudo. Desde o começo, as páginas e os
            componentes foram pensados com contraste, boa legibilidade e
            navegação fácil. Nossa equipe continua adicionando novos recursos com
            o tempo para melhorar cada vez mais a experiência dos usuários. Esta
            página é só para mostrar, de forma simples, o que já está disponível
            hoje e como usar.
          </p>
        </section>

        <section className="mb-[var(--spacing-acessibilidade-6)]">
          <h2 className="text-h2 font-semibold text-cor-titulos">
            Recursos disponíveis atualmente
          </h2>
          <ul className="space-y-[var(--spacing-acessibilidade-3)]">
            <li className="text-body leading-[var(--leading-acessibilidade-corpo)]">
              Link para pular o conteúdo principal: Ao entrar em qualquer página,
              o primeiro item que recebe foco é um link que leva direto ao
              conteúdo, sem precisar passar pelo menu inteiro.
            </li>
            <li className="text-body leading-[var(--leading-acessibilidade-corpo)]">
              Navegação pelo teclado no menu principal: Todas as páginas do menu
              (Início, Locais, Cadastrar e Sobre) funcionam usando apenas o teclado.
            </li>
            <li className="text-body leading-[var(--leading-acessibilidade-corpo)]">
              Indicação da página atual: o item ativo do menu é identificado de
              forma clara, utilizando outros elementos visuais além da cor.
            </li>
            <li className="text-body leading-[var(--leading-acessibilidade-corpo)]">
              Foco visível. Ao navegar pelo teclado, o item selecionado — o link
              de pular conteúdo ou um item do menu — ganha um contorno visível,
              pra você sempre saber onde está.
            </li>
            <li className="text-body leading-[var(--leading-acessibilidade-corpo)]">
              Estrutura organizada da página. Cada página tem um único conteúdo
              principal, e o cabeçalho e o rodapé continuam os mesmos durante
              toda a navegação.
            </li>
          </ul>
        </section>

        <section className="mb-[var(--spacing-acessibilidade-6)]">
          <h2 className="text-h2 font-semibold text-cor-titulos">
            Como usar esses recursos
          </h2>
          <p className="text-body leading-[var(--leading-acessibilidade-corpo)]">
            Para pular direto para o conteúdo, pressione <kbd>Tab</kbd> assim que a
            página carregar: o link “Pular para o conteúdo principal” vai aparecer
            primeiro. Pressione <kbd>Enter</kbd> e você vai direto ao conteúdo, sem
            passar pelo menu.
          </p>
          <p className="text-body leading-[var(--leading-acessibilidade-corpo)]">
            Para navegar pelo menu sem usar o mouse, use <kbd>Tab</kbd> para ir
            passando pelos links e <kbd>Enter</kbd> para abrir a página desejada.
            A página em que você está fica destacada no menu.
          </p>
        </section>

        <section className="mb-[var(--spacing-acessibilidade-6)]">
          <h2 className="text-h2 font-semibold text-cor-titulos">
            Para quem usa teclado ou tecnologias assistivas
          </h2>
          <ul className="space-y-[var(--spacing-acessibilidade-3)]">
            <li className="text-body leading-[var(--leading-acessibilidade-corpo)]">
              O portal foi feito pra funcionar inteiro pelo teclado, sem precisar
              de mouse.
            </li>
            <li className="text-body leading-[var(--leading-acessibilidade-corpo)]">
              O idioma das páginas estão definidos como português do Brasil, o que
              ajuda leitores de tela a pronunciarem o conteúdo corretamente.
            </li>
            <li className="text-body leading-[var(--leading-acessibilidade-corpo)]">
              O foco segue uma ordem lógica: primeiro o link de pular conteúdo,
              depois o menu, depois o conteúdo da página.
            </li>
          </ul>
        </section>

        <section className="mb-[var(--spacing-acessibilidade-6)]">
          <h2 className="text-h2 font-semibold text-cor-titulos">
            Limitações conhecidas
          </h2>
          <p className="text-body leading-[var(--leading-acessibilidade-corpo)]">
            O portal ainda está em desenvolvimento, e nem todos os recursos de
            acessibilidade planejados já estão prontos:
          </p>
          <ul className="space-y-[var(--spacing-acessibilidade-3)]">
            <li className="text-body leading-[var(--leading-acessibilidade-corpo)]">
              Ainda não é possível ajustar o tamanho da fonte ou ativar um modo de
              alto contraste pela interface.
            </li>
            <li className="text-body leading-[var(--leading-acessibilidade-corpo)]">
              O foco visível já está no menu principal e no link de pular
              conteúdo; outras partes da aplicação ainda podem não ter esse
              mesmo destaque.
            </li>
            <li className="text-body leading-[var(--leading-acessibilidade-corpo)]">
              O menu para telas menores (celular) ainda está em desenvolvimento.
            </li>
            <li className="text-body leading-[var(--leading-acessibilidade-corpo)]">
              O rodapé ainda não possui links de navegação para as páginas do
              portal.
            </li>
          </ul>
        </section>
      </div>

      <div className="mt-[var(--spacing-acessibilidade-8)]">
        <p className="text-body leading-[var(--leading-acessibilidade-corpo)]">
          Esta página será atualizada conforme novos recursos forem lançados.
        </p>
      </div>
    </div>
  )
}

export default Acessibilidade