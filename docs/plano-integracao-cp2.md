# Plano de integração do CP2

## Identificação

- Projeto: Portal de Locais e Serviços Acessíveis
- CP: CP2
- Tech Lead: Gabriel Ricardo Gomes Lima
- RM: 572279
- Issue relacionada: #111

## Objetivo

Organizar a integração das demandas do CP2, respeitando dependências entre Issues,
evitando conflitos entre Pull Requests e registrando as principais decisões
técnicas realizadas pelo Tech Lead.

## Fluxo de integração

1. Verificar se a Issue está refinada e possui responsável definido.
2. Conferir se todas as dependências necessárias já foram integradas à `develop`.
3. Verificar se a branch do DEV está atualizada com a `develop`.
4. Revisar o escopo e os arquivos alterados no Pull Request.
5. Solicitar correções quando houver conflito, regressão ou desvio de escopo.
6. Confirmar `npm run test:run`, `npm run lint` e `npm run build`.
7. Validar acessibilidade, responsividade e navegação por teclado quando aplicável.
8. Encaminhar a implementação para QA.
9. Antes do merge, verificar novamente conflitos causados por merges recentes.
10. Após o merge, revisar as Issues dependentes e liberar as que ficaram prontas para iniciar.

## Dependências importantes do CP2

Algumas das principais relações acompanhadas durante a integração:

- #61 depende da integração dos filtros e ordenação da #60.
- #129 depende de #60, #61, #120 e da consideração do espaçamento global da #79.
- #126 depende de #85 e #120.
- #132 depende da página de detalhes da #144.
- #135 depende de #120, #144 e #132.
- #134 depende da normalização da #124 e do cache da #125.
- #141 depende do `LocalCard` da #120 e do tratamento de `localStorage` da #88.
- A implementação da nova Home segue a cadeia iniciada pelas Issues #92 e #93.

## Decisões de integração

- Conflitos de Pull Request devem ser resolvidos pelo DEV responsável em sua própria branch.
- O Tech Lead orienta quais implementações precisam ser preservadas e revalida o resultado.
- Uma aprovação antiga deve ser reavaliada quando a branch recebe novos commits relevantes.
- Após merges importantes, as dependências das Issues abertas são revisadas novamente.
- A `develop` atual é a referência de integração.
- O projeto deve reutilizar Tailwind, tokens e padrões já existentes.
- Não devem ser criados CSS global, tokens ou Design Systems paralelos sem justificativa técnica.

## Tratamento de conflitos

Quando uma Pull Request entra em conflito com a `develop`:

1. O DEV atualiza sua própria branch com a `develop`.
2. O conflito é resolvido preservando as funcionalidades já integradas.
3. O DEV executa novamente testes, lint e build.
4. A branch recebe push.
5. O Tech Lead revisa novamente o resultado antes da aprovação.

## Riscos acompanhados

- Pull Requests ficarem desatualizadas após novos merges.
- Duas demandas alterarem os mesmos arquivos simultaneamente.
- Issues serem iniciadas antes da integração das dependências.
- Resoluções de conflito removerem funcionalidades já presentes na `develop`.
- Mudanças de estilização criarem padrões paralelos ao Tailwind e ao Design System.

## Resultado esperado

Manter uma ordem de integração segura para o CP2, com dependências claras,
revisões técnicas registradas e menor risco de regressões durante os merges.