# Referência do Hero com Ecolocalização

Referência visual e funcional da Home com efeito de ecolocalização (Issue #92). Orienta as Issues seguintes e não implementa a Home.

## Referência aprovada

| Item | Informação |
|---|---|
| Documento de referência | `Manual-Didatico-Ecolocalizacao-Home-FIAP.pdf`, que descreve o protótipo e preserva o código dele nos apêndices |
| ZIP de origem | `portal-locais-acessiveis-eco-preview.zip` |
| SHA-256 do ZIP | `570845fb3029955207031db9cd68a59ac5cf8581dfbbe074775a8b6b029ceb8a` |
| Commit de origem | `dffa572` (branch `develop`) |
| Imagem do cenário | `src/assets/hero-ecolocalizacao.png` (1456 x 819 px), sem texto nem botões |
| Arquivos do protótipo | `Home.tsx`, `Home.css`, imagem do cenário, `navigation.test.tsx` e `README.md` |

## Regra de precedência

O resultado esperado da Home é **idêntico ao ZIP aprovado**, em aparência e em funcionamento. A integração deve entregar esse resultado preservando, ao mesmo tempo, os itens abaixo. Nenhum deles autoriza descartar outro.

| Referência | O que define | O que não pode ser perdido |
|---|---|---|
| ZIP aprovado | Resultado visual e funcional da Home | Aparência, conteúdo, comportamento do efeito e estados de interação |
| Branch `develop` | Estado atual do projeto | Funcionalidades, rotas, Header, Footer e componentes já existentes |
| Design System (Issue #21) | Identidade visual base | Paleta, tipografia e espaçamentos |
| Acessibilidade (Issue #22) | Padrões visuais acessíveis | Contraste, foco visível e uso de cor |

Valores do protótipo valem só para a Home e não são regras globais.

### Conflitos técnicos

Se reproduzir o ZIP entrar em conflito com a `develop`, com a #21 ou com a #22, o conflito não deve ser resolvido de forma implícita nem por troca silenciosa de valores. O procedimento é:

1. Implementar o resultado do ZIP sem remover funcionalidade existente nem requisito da #21 e da #22.
2. Registrar o conflito na Issue da demanda, com o arquivo ou o par de cores envolvido, a evidência, a solução proposta e o efeito visual.
3. Validar a solução na comparação final da [#106](https://github.com/1TDSPF-26/portal-locais-acessiveis/issues/106), em que o QA e o Tech Lead comparam a entrega com o ZIP.
4. Não fazer troca de paleta nem melhoria que não tenha sido solicitada.

## Aparência e comportamento do hero

| Elemento | Descrição |
|---|---|
| Composição | Tela escura com a imagem do cenário, texto claro e Header acima do hero |
| Altura | `100svh`, mínimo de `680px` |
| Título (`h1`) | Antes de sair de casa, saiba o que te espera lá. |
| CTAs | "Explorar locais" (`/locais`) e "Como funciona" (`#como-funciona`) |
| Dicas | Instrução de mouse/toque e convite para rolar a página |
| Seção seguinte | Seção clara "Como o portal ajuda você", com 4 cards e bloco final com CTA para `/cadastrar` |
| Responsividade | Ajustes em 1050 px, 768 px e 560 px (cards em 4, 2 e 1 coluna; menu mobile) |

Textos completos e estrutura de cada bloco: apêndice A do PDF.

## Cores e elementos visuais

| Uso | Valor |
|---|---|
| Fonte | Montserrat (Issue #21) |
| Fundo da Home e do breu | `#02060E` e `#000` |
| Texto do hero | `#F3F9FF`, com destaque em `#86CFFF` |
| Botão primário | `#216FCE`, texto branco |
| Foco no hero | `outline: 3px solid #a9e6ff` |
| Seção clara | Fundo `#F7F9FC`, título `#172A3A`, texto `#465268` |

Divergências em relação à Issue #21: `#F7F9FC` no lugar de `#F7F9FA` e cards brancos no lugar de `#DDEEF2`. Elas ficam restritas a esta Home.

## Como funciona a ecolocalização

| Parte | Funcionamento |
|---|---|
| Breu | Camada preta sobre a cena e o conteúdo, com máscara radial: o centro é transparente e revela a imagem e o texto; fora dele o preto fica opaco |
| Movimento | `pointermove` converte `clientX/clientY` em coordenadas locais do hero e atualiza `--echo-x` e `--echo-y` |
| Scanner | Aro luminoso decorativo com o mesmo centro da abertura |
| Pulso | Em `pointerdown`, uma onda temporária é criada no ponto e removida ao fim da animação |
| Ciclo de vida | Os eventos e a classe `echo-preview-active` do `body` são adicionados na montagem e removidos ao sair da Home |
| Camadas decorativas | Breu, scanner e pulso usam `pointer-events: none` e `aria-hidden`; o conteúdo continua no DOM |

## Estados de interação

| Estado | Comportamento |
|---|---|
| Repouso | Abertura na posição inicial (72%, 46%) |
| Ponteiro em movimento | Abertura e scanner seguem o ponteiro |
| Clique ou toque | Pulso temporário no ponto; os links continuam clicáveis |
| Teclado | O breu é atenuado e o scanner é ocultado ao focar o hero; foco visível |
| Toque (`pointer: coarse`) | Breu e scanner atenuados, sem depender de hover |
| Movimento reduzido | Máscara desligada, scanner e pulso ocultos |
| Alto contraste | Breu atenuado e scanner oculto |

## Relação com as Issues #21 e #22

| Issue | Papel |
|---|---|
| [#21](https://github.com/1TDSPF-26/portal-locais-acessiveis/issues/21) | Base da identidade visual: paleta, tipografia e espaçamentos |
| [#22](https://github.com/1TDSPF-26/portal-locais-acessiveis/issues/22) | Complemento contextual: contraste, foco e uso de cor |

Pares de contraste calculados no PDF, para consulta:

| Par | Contraste |
|---|---|
| Branco em `#216FCE` | 4,96:1 |
| `#465268` em `#F7F9FC` | 7,46:1 |
| `#172A3A` em `#F7F9FC` | 13,94:1 |
| `#64CCC5` em branco | 1,91:1 (não usar como único indicador de foco) |
| `#44A0B4` em `#465268` | 2,60:1 (não usar como texto) |

Os valores valem para cores sólidas. O contraste sobre a imagem exige teste nos pontos reais.

## Fonte oficial

| Informação | Origem |
|---|---|
| Identidade visual base | Issue #21 |
| Contraste, foco e uso de cor | Issue #22 |
| Textos, estrutura e comportamento | Manual Didático em PDF |
| Integridade da referência | Hashes do apêndice G do PDF |
| Código existente | Branch `develop` |

## Riscos conhecidos

- Copiar o protótipo ignorando funcionalidades que já existem na `develop`.
- Transformar valores do protótipo em regras globais.
- Deixar a classe `echo-preview-active` no `body` ao sair da Home.
- Overlay bloqueando cliques por falta de `pointer-events: none`.

## Fora do escopo

- Implementar a nova Home.
- Alterar o Design System.
- Modificar componentes.
- Alterar Header ou Footer.