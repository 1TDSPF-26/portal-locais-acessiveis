# Relatório de Auditoria de Acessibilidade - Issue #116

## 1. Visão Geral
Auditoria de acessibilidade revalidada após sincronização com a branch `develop` mais recente.

## 2. Ferramentas Utilizadas
- **Google Lighthouse**: Auditoria de acessibilidade (Mobile e Desktop).
- **@axe-core/react**: Integração em ambiente de desenvolvimento (`main.tsx`).

## 3. Principais Alterações e Metodologia
- Revalidação com `npm ci`, `npm run lint`, `npm run build` e `npm run test:run`.
- Verificação do foco e acessibilidade com os novos componentes integrados da `develop`.

## 4. Resultados das Evidências
- **Lighthouse Mobile**: Pontuação 100/100 em Acessibilidade.
- **Lighthouse Desktop**: Pontuação 100/100 em Acessibilidade.
- **Testes de Código**: 82 testes unitários aprovados no `npm run test:run` (17 arquivos de teste validados).
- **Navegação por teclado**: Validada nos fluxos principais (Home, Locais, Detalhes de local, Cadastro, Sobre, Acessibilidade, Header, Footer e botões de contraste/fonte), sem identificação de bloqueios de foco.

## 5. Conclusão
A aplicação atende aos critérios de acessibilidade estipulados na Issue #116, sem registo de violações nas ferramentas automáticas e nos fluxos validados.