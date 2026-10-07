# Referência do Hero com Ecolocalização

Documento de referência visual e funcional da Home com efeito de ecolocalização (Issue #92). Ele orienta as Issues #93 a #106 e **não implementa** a Home.

## Referência aprovada

O ZIP citado nas Issues é entregue no PDF **Manual Didático da Home com Ecolocalização** (`Manual-Didatico-Ecolocalizacao-Home-FIAP.pdf`), que descreve o protótipo e preserva integralmente o código dele nos apêndices.

| Item | Informação |
|---|---|
| Documento de referência | `Manual-Didatico-Ecolocalizacao-Home-FIAP.pdf` |
| ZIP de origem | `portal-locais-acessiveis-eco-preview.zip` |
| SHA-256 do ZIP | `570845fb3029955207031db9cd68a59ac5cf8581dfbbe074775a8b6b029ceb8a` |
| Commit de origem | `dffa572` (branch `develop`) |
| Issues cobertas | #92 a #106 |
| Imagem do cenário | `src/assets/hero-ecolocalizacao.png` (1456 x 819 px), sem texto nem botões embutidos |
| SHA-256 do PNG | `8c26395332d20290bad3b9ea8e6b1f6ffcb8f1c6135d8092e3b3092f2ba0374e` |

### Arquivos do protótipo

| Arquivo | Papel |
|---|---|
| `src/pages/Home/Home.tsx` | Estrutura, textos, links e eventos (`steps`, `useRef`, `useEffect`, `moveEcho`, `makePulse`) |
| `src/pages/Home/Home.css` | Visual, máscara, camadas, breakpoints, estilo escopado do Header e acessibilidade |
| `src/assets/hero-ecolocalizacao.png` | Cenário limpo do hero |
| `src/test/navigation.test.tsx` | Testes de regressão da Home e da navegação |
| `README.md` | Orientação para executar a prévia |

`MainLayout.tsx`, `AppRoutes.tsx`, `Header.tsx` e `Footer.tsx` já existem no projeto e não fazem parte do protótipo.

## Regra de precedência

O protótipo é referência visual e funcional. Em caso de conflito, prevalecem nesta ordem:

1. a branch `develop` atual;
2. o Design System (Issue #21);
3. os requisitos de acessibilidade (Issue #22).

Valores do protótipo não são regras globais e valem apenas para a Home. Mudanças de acessibilidade pedidas pelo QA devem registrar o par de cores, a evidência, a mudança proposta e o efeito visual, e o Tech Lead decide a adaptação.

## Estrutura da Home

| Bloco | Descrição |
|---|---|
| `.echo-page` | Raiz da Home, na rota `/` |
| `.echo-hero` | Primeira seção, rotulada pelo `h1` (`echo-title`) |
| `.echo-about` | Seção clara `#como-funciona`, rotulada pelo `h2` (`echo-about-title`) |
| `.echo-about__closing` | Bloco final de propósito, dentro de `.echo-about` |

O Header, o Footer e o link "Pular para o conteúdo principal" vêm do `MainLayout`, e a Home não importa nem duplica esses componentes.

## Conteúdo da Home

### Hero

| Elemento | Conteúdo |
|---|---|
| Eyebrow | Portal de locais e serviços acessíveis |
| Título (`h1`) | Antes de sair de casa, **saiba o que te espera lá.** (o trecho final fica em destaque azul) |
| Descrição | Descubra as condições de acessibilidade de locais e serviços antes de visitar. Planeje seus deslocamentos com mais informação e autonomia. |
| CTA primário | "Explorar locais ↗", `Link` para `/locais` |
| CTA secundário | "Como funciona ↓", âncora `#como-funciona` |
| Dica de exploração | "Mova o cursor ou toque para revelar • Clique para emitir um eco" |
| Convite de rolagem | "Role para continuar ↓", âncora `#como-funciona` |

### Seção "Como o portal ajuda você"

| Elemento | Conteúdo |
|---|---|
| Eyebrow | Para uma cidade mais inclusiva |
| Título (`h2`) | Como o portal ajuda você |
| Introdução | Informação acessível, compreensível e colaborativa para você planejar suas visitas. |

| Card | Título | Texto |
|---|---|---|
| 01 | Encontre locais | Explore estabelecimentos, serviços e espaços públicos cadastrados no portal. |
| 02 | Veja a acessibilidade | Consulte as condições de entrada, circulação e outros recursos informados para cada lugar. |
| 03 | Planeje sua visita | Conheça as informações disponíveis antes de se deslocar e prepare sua visita com autonomia. |
| 04 | Contribua | Compartilhe informações sobre um local e ajude outras pessoas a conhecerem a cidade. |

### Bloco final

| Elemento | Conteúdo |
|---|---|
| Eyebrow | O propósito do projeto |
| Título (`h2`) | Informação também é acessibilidade. |
| Texto | Muitas barreiras só são descobertas quando a pessoa chega ao destino. O portal reúne informações para que essa descoberta aconteça antes da visita. |
| CTA | "Contribuir com um local ↗", `Link` para `/cadastrar` |
| Citação | Você não deveria precisar chegar a um local para descobrir uma barreira. |

## Camadas do hero

Ordem de trás para a frente:

| Camada | Classe | Nível | Função |
|---|---|---|---|
| Fundo | `.echo-hero__scene` | absoluta | PNG local como `background-image` |
| Sombra | `.echo-hero__shade` | absoluta | Gradientes que preservam a leitura do título |
| Conteúdo | `.echo-hero__content` | `z-index: 1` | H1, descrição e links reais |
| Breu | `.echo-hero__blackout` | `z-index: 5` | Preto com um furo radial transparente |
| Scanner | `.echo-hero__scanner` | `z-index: 6` | Círculo luminoso alinhado à abertura |
| Pulso | `.echo-hero__pulse` | `z-index: 7` | Onda temporária ao pressionar |
| Dicas | `.echo-hero__hint`, `.echo-hero__scroll` | `z-index: 8` | Pistas de exploração e rolagem |
| Header global | `body.echo-preview-active > #root > header` | `z-index: 30` | Navegação acima do hero |

`.echo-hero` usa `position: relative`, `isolation: isolate`, `height: 100svh`, `min-height: 680px` e `overflow: hidden`.

## Como funciona a ecolocalização

### A máscara

A máscara pertence ao retângulo preto (`.echo-hero__blackout`), que cobre cena e conteúdo. Onde a máscara é transparente, o preto some e a cena aparece. O conteúdo nunca sai do DOM.

```css
radial-gradient(circle at var(--echo-x) var(--echo-y),
  transparent 0, transparent 110px, #000a 290px, #000 430px)
```

| Distância ao centro | Resultado |
|---|---|
| 0 a 110 px | Preto some: cena e texto visíveis |
| 110 a 290 px | Preto reaparece até `#000a` |
| 290 a 430 px | Transição até `#000` |
| Acima de 430 px | Breu total |

Valores iniciais: `--echo-x: 72%` e `--echo-y: 46%`. A máscara é declarada em `mask-image` e em `-webkit-mask-image`.

### Movimento do ponteiro

| Item | Regra |
|---|---|
| Evento | `pointermove` no hero, com `{ passive: true }` |
| Conversão | `x = event.clientX - box.left` e `y = event.clientY - box.top`, com `box = hero.getBoundingClientRect()` |
| Aplicação | `hero.style.setProperty('--echo-x', ...)` e `--echo-y` em pixels |
| Estado | Posição em custom properties do DOM (sem `useState`), porque o efeito é só visual |
| Classe | `echo-hero--explored` atenua a dica (`opacity: .65`) |
| Exemplo | Hero em `left=18`, `top=-120` e ponteiro em `clientX=200`, `clientY=300` resulta em `182px` e `420px` |

### Scanner

Círculo de 295 px (190 px em telas até 768 px) com borda `#93d9ffbc`, brilho e dois anéis externos. Usa as mesmas variáveis `--echo-x` e `--echo-y` da máscara, por isso os dois ficam alinhados.

### Pulso

| Item | Regra |
|---|---|
| Evento | `pointerdown` (mouse, caneta e toque), com `{ passive: true }` |
| Condições para não criar | Botão diferente do primário (`event.button !== 0`) ou preferência por movimento reduzido |
| Criação | Chama `moveEcho`, cria um `span.echo-hero__pulse` com `aria-hidden="true"` e posição local |
| Visual | 24 x 24 px, borda `2px #9ce0ff`, animação `echo-pulse` de `scale(.2)` e opacidade 1 até `scale(35)` e opacidade 0 em `1.1s` |
| Remoção | `animationend` com `{ once: true }` remove o nó |

### Ciclo de vida React

| Momento | Ação |
|---|---|
| Montagem da Home | `useEffect` adiciona `echo-preview-active` ao `body` e registra `pointermove` e `pointerdown` |
| Saída da Home | Remove os listeners, remove os pulsos pendentes e remove `echo-preview-active` do `body` |

`heroRef` guarda a referência da `section`, e o effect retorna cedo se ela não existir.

## Header e Footer na Home

| Situação | Comportamento |
|---|---|
| Home montada | `body.echo-preview-active` aplica o estilo escuro ao Header (posição absoluta, `z-index: 30`) e ao Footer, sem alterar `Header.tsx` nem `Footer.tsx` |
| Menu mobile | Reutiliza `.menuMobileButton` e `.mainNav.aberto` existentes |
| Saída da Home | A classe sai do `body`, e `/locais` e `/sobre` mantêm o estilo original |

O seletor assume que o Header é filho direto de `#root`. Se a estrutura do layout mudar, ele precisa ser revisado.

## Cores e elementos visuais

### Identidade base (Issue #21)

| Uso | Cor |
|---|---|
| Fundo | `#F7F9FA` |
| Superfície | `#DDEEF2` |
| Ação primária | `#216FCE` |
| Título | `#172A3A` |
| Texto | `#465268` |
| Detalhe | `#44A0B4` |
| Foco de referência | `#64CCC5` |
| Fonte | Montserrat |

### Valores próprios do protótipo

| Elemento | Valor |
|---|---|
| Fundo da Home e do breu | `#02060E` e `#000` |
| Texto geral do hero | `#F3F9FF` |
| Título, destaque do título e eyebrow | `#FFF`, `#86CFFF` e `#92D8FF` |
| Cor de apoio do efeito | `#72CAFF` (`--echo-blue`) |
| Botão primário | `#216FCE`, texto branco |
| Botão secundário | Borda `#8BCEFFAB`, fundo `#031323AA` |
| Seção clara | Fundo `#F7F9FC`, título `#172A3A`, texto `#465268` |
| Cards | Branco, borda `#DFE9F4`, número em `#216FCE` sobre `#E5F1FF` |
| Citação final | Fundo `#091B32` com gradiente azul, texto `#F3F9FF` |

Divergências em relação à Issue #21: `#F7F9FC` no lugar de `#F7F9FA` e cards brancos no lugar de `#DDEEF2`. Elas devem ser mantidas só nesta Home e registradas.

### Contraste calculado

| Par | Contraste | Uso |
|---|---|---|
| Branco em `#216FCE` | 4,96:1 | Texto do CTA primário |
| `#465268` em `#F7F9FC` | 7,46:1 | Parágrafos da seção clara |
| `#172A3A` em `#F7F9FC` | 13,94:1 | Títulos da seção clara |
| `#86CFFF` em `#02060E` | 11,96:1 | Estimativa em fundo sólido; a imagem real exige inspeção |
| `#64CCC5` em branco | 1,91:1 | Não usar como único indicador de foco |
| `#44A0B4` em `#465268` | 2,60:1 | Não usar como texto |

Os valores valem para cores sólidas. Gradientes, transparências e imagem exigem teste nos pontos reais.

## Estados de interação

| Estado | Comportamento |
|---|---|
| Repouso | Janela na posição inicial (72%, 46%), scanner à direita, dicas visíveis, Header acima |
| Ponteiro em movimento | Janela e scanner seguem o ponteiro; dica atenuada |
| Clique ou toque | Pulso temporário no ponto; links continuam clicáveis |
| Hover dos botões | Sobem 3 px; o primário muda para `#3187EC` |
| Teclado | `.echo-hero:focus-within` leva o breu a `opacity: .08` e esconde o scanner; foco com `outline: 3px solid #a9e6ff` e `outline-offset: 4px` |
| Toque (`pointer: coarse`) | Breu com `opacity: .24` e scanner com `opacity: .55`, sem depender de hover |
| Movimento reduzido | Máscara desligada, breu em `.12`, scanner e pulso ocultos, transições dispensáveis removidas |
| Alto contraste (`data-contrast='high'`) | Máscara desligada, breu em `.12`, scanner oculto |

Ter um fallback não prova que a experiência inteira é acessível. O QA ainda precisa verificar foco real, contraste sobre a imagem, textos ampliados, menu e ausência de bloqueio por overlay.

## Responsividade

| Largura | Mudanças |
|---|---|
| Padrão | 4 cards por linha |
| Até 1050 px | Header pode quebrar linha; grid com 2 colunas |
| Até 768 px | Menu mobile; conteúdo com `calc(100% - 40px)`; scanner de 190 px; máscara menor (transparente até 80 px e preto em 285 px); hero com mínimo de 760 px; bloco final em 1 coluna |
| Até 560 px | CTAs em largura total; cards em 1 coluna; hero com altura automática e mínimo `max(760px, 100svh)` |

As três media queries se acumulam: em um celular de 390 px, as três valem ao mesmo tempo.

## Relação com outras Issues

| Issue | Papel |
|---|---|
| [#21](https://github.com/1TDSPF-26/portal-locais-acessiveis/issues/21) | Base da identidade visual: paleta, tipografia e espaçamentos |
| [#22](https://github.com/1TDSPF-26/portal-locais-acessiveis/issues/22) | Complemento contextual: contraste, foco e uso de cor |
| #63, #85 e #86 | Testes e regras de acessibilidade relacionados |
| #93 a #106 | Implementação em PRs pequenos, em sequência |

| Ordem | Issue | Entrega |
|---|---|---|
| 1 | #92 | Contrato visual e inventário da referência |
| 2 | #93 | PNG limpo no caminho aprovado |
| 3 | #94 | Home, import e camadas semânticas |
| 4 | #95 | Textos, CTAs e âncora |
| 5 | #96 | Classe do `body` e estilos escopados do Header e Footer |
| 6 | #97 | Cenário, sombra, tipografia e botões |
| 7 | #98 | Breu e máscara radial |
| 8 | #99 | `pointermove`, coordenadas locais e cleanup |
| 9 | #100 | Scanner e pulso |
| 10 | #101 | Seção clara com os quatro cards |
| 11 | #102 | Bloco final e CTA `/cadastrar` |
| 12 | #103 | Breakpoints 1050, 768 e 560 |
| 13 | #104 | Toque e `pointer: coarse` |
| 14 | #105 | Foco, contraste e movimento reduzido |
| 15 | #106 | Regressão, documentação e paridade final |

## Verificação

| Item | Resultado do protótipo |
|---|---|
| Testes | 5 testes em 2 arquivos (Vitest e React Testing Library), todos passaram |
| Build | Passou |
| Lint | Um aviso já existente em `src/pages/Locais/Locais.tsx` (`setState` dentro de effect), sem erro novo da Home |

Os testes não provam pixel, foco nem animação. A conferência final compara arquivos e comportamento com o protótipo em vários tamanhos e modos de uso.

## Fonte oficial

| Informação | Origem |
|---|---|
| Identidade base | Issue #21 |
| Contraste, foco e uso de cor | Issue #22 |
| Textos, estrutura e comportamento | Manual Didático em PDF (código do ZIP, apêndices A e B) |
| Integridade da referência | Hashes do apêndice G do PDF |
| Código existente | Branch `develop` |
| Rotas e layout | `AppRoutes.tsx` e `MainLayout.tsx` |

## Riscos conhecidos

- Copiar o protótipo ignorando funcionalidades que já existem na `develop`.
- Transformar valores do protótipo em regras globais.
- Abrir várias branches a partir de um `Home.tsx` ou `Home.css` antigos e integrar tudo de uma vez.
- Duplicar o `useEffect` (as Issues #96 e #99 mexem no mesmo effect), gerando cleanup divergente.
- Colar a versão abreviada do effect do capítulo 6 do PDF no lugar da versão completa do apêndice A.
- Esquecer `pointer-events: none` no breu, no scanner ou no pulso, bloqueando cliques.
- Deixar `echo-preview-active` no `body` ao sair da Home.
- Marcar o conteúdo com `aria-hidden` (só os elementos decorativos recebem).
- Declarar o resultado "idêntico" só por um print estático.

## Fora do escopo

- Implementar a nova Home.
- Alterar o Design System.
- Modificar componentes.
- Alterar Header ou Footer.

## Autoria

Gustavo Henrique Jardim de Sá — RM572437.