# Critérios de merge, qualidade e release do CP2

Este roteiro operacionaliza a Issue #112. Ele complementa o [guia de contribuição](../CONTRIBUTING.md), o [tutorial de revisão](tutoriais/04-tech-lead-revisao-merge.md) e o [modelo de release](modelo-release.md). As decisões de aprovação continuam com o Tech Lead, o QA e o professor, conforme os papéis definidos no projeto.

## Estado observado em 06/10/2026

- A branch `develop` foi conferida no commit `ef2fbbceff77df37ae00099b373bcff6fdc49d76`. A `main` estava em `f896f31950552dbe6b170ab58a6cf345ea8b8e02`.
- Os rulesets ativos **Proteção develop** e **Proteção main** exigem Pull Request, duas revisões de aprovação, revisão de CODEOWNERS, resolução de conversas e o check `lint-build-test`. Revisões antigas são descartadas após novo push. Os rulesets impedem exclusão e atualização não fast-forward das branches protegidas.
- `.github/CODEOWNERS` solicita Tech Leads e QAs por padrão, além de professores e Tech Leads em arquivos críticos. Confirme na interface que as pessoas corretas receberam a solicitação de revisão; a aprovação técnica e a decisão do QA são evidências distintas.
- O CI do projeto já usa `npm ci`, lint, build e Vitest. Nesta entrega, a inicialização e a execução dessas etapas passam a ser obrigatórias: a ausência de `package-lock.json` ou de um script faz o check falhar, em vez de aprovar uma execução vazia. O nome do job continua `lint-build-test`, como exigido pelos rulesets.
- Na data da verificação, os PRs [#148](https://github.com/1TDSPF-26/portal-locais-acessiveis/pull/148) e [#149](https://github.com/1TDSPF-26/portal-locais-acessiveis/pull/149) estavam abertos para `develop`, com o check `lint-build-test` verde e merge ainda bloqueado. Verde no CI não significa QA aprovado.
- A Home em `develop` ainda é a versão simples. As [Issues #92 a #106](https://github.com/1TDSPF-26/portal-locais-acessiveis/issues/106) especificam o desenvolvimento e o QA da ecolocalização; a integração final ainda não deve ser marcada como concluída.

Atualize os hashes e o estado das Issues antes da reunião de release; esta seção é um retrato datado, não uma afirmação permanente.

## 1. Antes de liberar uma Issue para desenvolvimento

O Tech Lead confere objetivo, escopo, critérios observáveis, dependências, responsável, QA, squad, esforço, prazo e Milestone no Project. Se uma dependência estiver aberta, registre o bloqueio e a data de revisão. Não use uma atribuição no GitHub como prova de que todos os campos do Project foram preenchidos.

Para a Home, acompanhe a cadeia #92 → #93 → #94 e as etapas seguintes até #106. A referência funcional e visual é o ZIP aprovado `portal-locais-acessiveis-eco-preview.zip`, SHA-256 `570845fb3029955207031db9cd68a59ac5cf8581dfbbe074775a8b6b029ceb8a`; o Design System #21 e as combinações acessíveis #22 são requisitos de integração. Garanta que DEV e QA tenham acesso ao ZIP e ao manual citado nas Issues antes de aceitarem a tarefa.

## 2. Gate de Pull Request para `develop`

| Gate | Como conferir | Quando bloquear |
| --- | --- | --- |
| Vínculo e autoria | Branch `feature/<issue>-...`, base `develop`, `Closes #N`, escopo, autor e colaboradores no modelo oficial de PR | Issue errada, mudanças sem relação ou contribuição atribuída a quem não a realizou |
| CI | Check **lint-build-test** concluído com sucesso no commit mais recente; conferir `npm ci`, lint, build e `test:run` no log | Check pendente, vermelho, pulado ou executado em commit antigo |
| Revisão técnica | Ler o diff, testar casos de erro, focos, rotas, tipagem e impacto entre componentes; registrar decisão | Conversas abertas, mudança depois da aprovação ou divergência dos critérios |
| Revisões exigidas | Duas aprovações e CODEOWNERS conforme ruleset; o autor não revisa o próprio PR | Revisores pendentes ou aprovação desatualizada |
| QA | Registrar ambiente/commit, passos e evidências na Issue ou no PR, inclusive reteste após correção | Ausência de QA, falha funcional ou teste em código diferente do PR |
| Integração | Fazer merge pelo GitHub e verificar Issue, branch e regressão em `develop` | Dependência não integrada ou resolução de conflitos não revisada |

Use **merge commit** conforme `CONTRIBUTING.md`. O ruleset também permite outros métodos tecnicamente; a convenção da turma é mais restritiva. Não usar bypass de proteção sem autorização do professor.

### Compatibilidade em revisão nesta semana

- O PR #148 acrescenta `max-w-5xl` e padding ao `<main>` global. Antes de integrar a nova Home, confronte o hero aprovado em largura grande e mobile: um contêiner limitado pode alterar sua composição e as coordenadas da revelação. Preserve o benefício de espaçamento das outras rotas com uma solução específica para a Home, caso o QA comprove o conflito.
- O PR #149 move o foco para `<main>` ao trocar de rota. Teste seu comportamento junto do link para `#como-funciona`, do skip link e do foco nos CTAs da Home. Ele não deve deslocar o foco em interações internas sem troca de rota.
- As Issues #57 (envio do cadastro), #60 (filtros) e #61 (paginação) ainda estão abertas; os testes de QA relacionados não podem ser encerrados como fluxo completo antes da integração de suas dependências.

## 3. Preparar uma release

1. Congelar o escopo: preencher [modelo-release.md](modelo-release.md) com Issues/PRs incluídos, retirados e defeitos conhecidos. Não apresentar Issue aberta como funcionalidade entregue.
2. Criar `release/<versao>` a partir da `develop` aprovada, conforme o [tutorial de release](tutoriais/08-release.md). Conferir o commit base e evitar alterações de funcionalidade durante o congelamento.
3. Executar `npm ci`, `npm run lint`, `npm run build` e `npm run test:run` na release; verificar rotas, busca, cadastro, foco, teclado, contraste e responsividade no ambiente autorizado.
4. QA registra **Go**, **Go com ressalvas** ou **No-Go**, com commit, ambiente e justificativa. Pendências críticas ou funcionalidade prometida e não entregue implicam No-Go.
5. Obter a autorização do professor, abrir PR da release para `main` e aplicar as mesmas proteções. Só depois do merge e da verificação em produção identificar tag e versão no relatório.
6. Registrar o commit/tag anterior estável e o procedimento de retorno; o professor controla a publicação conforme o tutorial atual.

Uma release do CP2 não implica que as 15 Issues da ecolocalização estejam concluídas. A entrega dessa Home exige especificamente a validação #106 contra o ZIP aprovado, incluindo conteúdo, visual, ponteiro, toque, teclado, contraste, movimento reduzido e as outras rotas. Registre qualquer diferença encontrada; a decisão sobre desvio não é substituída por um build verde.

## 4. Registro mínimo de evidência do Tech Lead

Em cada PR ou relatório, anote: número da Issue; URL do PR; commit conferido; resultado e URL do check; revisores e decisão do QA; cenários manuais executados; pendências; decisão de merge e data. Para a release, reutilize o [relatório semanal do Tech Lead](modelo-relatorio-tech-lead.md) e o [modelo de release](modelo-release.md). Esses registros permitem que outro integrante repita a verificação sem depender de uma conversa privada.
