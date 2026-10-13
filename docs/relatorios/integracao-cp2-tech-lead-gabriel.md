# Relatório de integração do CP2 — Tech Lead

## Identificação

- Projeto: Portal de Locais e Serviços Acessíveis
- Tech Lead: Gabriel Ricardo Gomes Lima
- RM: 572279
- Issue relacionada: #111

## Objetivo

Registrar as principais revisões técnicas, decisões de integração,
bloqueios e replanejamentos realizados durante o CP2.

## Atividades realizadas

Durante o CP2 foram acompanhadas Issues, dependências, Pull Requests,
conflitos de integração e liberações de novas demandas.

O trabalho do Tech Lead incluiu:

- análise de escopo das Pull Requests;
- conferência das dependências entre Issues;
- solicitação e revalidação de correções;
- acompanhamento de conflitos com a `develop`;
- verificação de testes, lint e build;
- revisão de acessibilidade quando aplicável;
- reavaliação de Issues bloqueadas após novos merges.

## Pull Requests acompanhadas

| PR | Issue | Atuação |
|---|---|---|
| #148 | #79 | Revisão da padronização de espaçamento e compatibilidade com a nova Home |
| #149 | #138 | Revisão do gerenciamento de foco e solicitação de correções |
| #154 | #60 | Revisão da integração de filtros e ordenação |
| #155 | #133 | Revisão dos títulos por rota e acompanhamento de conflitos com a `develop` |
| #158 | #125 | Revisão do cache temporário e solicitação de testes adicionais |
| #160 | #61 | Revisão da paginação, conflitos e integração com o cache |
| #162 | #57 | Revisão da integração do formulário de cadastro com a API |
| #163 | #85 | Revisão dos componentes de estado no modo de alto contraste |

## Decisões técnicas

### Atualização de branches

Quando uma Pull Request ficou desatualizada em relação à `develop`,
o DEV responsável foi orientado a atualizar sua própria branch,
resolver os conflitos e solicitar nova revisão.

### Revalidação após alterações

Pull Requests que receberam novos commits após uma aprovação foram
reavaliadas antes do merge.

### Dependências

Issues bloqueadas foram reavaliadas após merges de suas dependências.

Exemplos:

- #130 pôde avançar após a integração da #57.
- #134 foi desbloqueada após as integrações de #124 e #125.
- #141 foi desbloqueada após a integração da #120.
- #129 permaneceu bloqueada enquanto a #61 não estava integrada.

### Estilização

Foi mantida como regra a utilização do Tailwind e dos tokens existentes
do projeto, evitando CSS global duplicado, valores hardcoded sem
necessidade e Design Systems paralelos.

## Validações utilizadas

Durante as revisões foram utilizados, quando aplicáveis:

- `npm run test:run`
- `npm run lint`
- `npm run build`
- verificação de conflitos com a `develop`
- navegação por teclado
- foco visível
- responsividade
- modo de alto contraste
- análise de dependências entre Issues

## Resultado

O acompanhamento permitiu organizar a integração do CP2 de forma incremental,
identificando conflitos antes do merge, mantendo as dependências atualizadas
e registrando decisões técnicas para reduzir regressões na `develop`.