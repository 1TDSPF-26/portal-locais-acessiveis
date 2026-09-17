function Acessibilidade() {
  return (
    <div>
      <header>
        <h1>Acessibilidade no Portal de Locais e Serviços Acessíveis</h1>
        <p>
          Aqui você encontra os recursos de acessibilidade já disponíveis no
          portal, como utilizá-los e o que ainda está em desenvolvimento.
        </p>
      </header>

      <section>
        <h2>Nosso compromisso</h2>
        <p>
          A acessibilidade não é um extra no Portal de Locais e Serviços
         Acessíveis, ela é a base de tudo. Desde o começo, as páginas e os
         componentes foram pensados com contraste, boa legibilidade e
         navegação fácil. Nossa equipe continua adicionando novos recursos com
         o tempo para melhorar cada vez mais a experiência dos usuários. Esta página é só para mostrar, de forma simples, o que já
         está disponível hoje e como usar.
        </p>
      </section>

      <section>
        <h2>Recursos disponíveis atualmente</h2>
        <ul>
          <li>
            Link para pular o conteúdo principal: Ao entrar em qualquer página,
            o primeiro item que recebe foco é um link que leva direto ao
            conteúdo, sem precisar passar pelo menu inteiro.
          </li>
          <li>
            Navegação pelo teclado no menu principal: Todas as páginas do menu
            (Início, Locais, Cadastrar e Sobre) funcionam usando apenas o teclado.

          </li>
          <li>
            Indicação da página atual: o item ativo do menu é identificado de forma clara, utilizando outros elementos visuais além da cor.
          </li>
          <li>
            Foco visível. Ao navegar pelo teclado, o item selecionado — o link
            de pular conteúdo ou um item do menu — ganha um contorno visível,
            pra você sempre saber onde está.
          </li>
          <li>
            Estrutura organizada da página. Cada página tem um único conteúdo
            principal, e o cabeçalho e o rodapé continuam os mesmos durante
            toda a navegação.
          </li>
        </ul>
      </section>


    </div>
  )
}

export default Acessibilidade