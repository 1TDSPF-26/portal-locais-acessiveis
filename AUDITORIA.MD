# Relatório de Auditoria de Acessibilidade - Issue #116

## 1. Visão Geral
Auditoria de acessibilidade realizada no projeto `portal-locais-acessiveis` para validar a conformidade com as diretrizes da WCAG e garantir a qualidade da aplicação. O trabalho incluiu a sincronização com a branch `develop` mais recente e a revalidação completa dos fluxos de teste.

## 2. Ferramentas Utilizadas
- **Google Lighthouse**: Auditoria de acessibilidade para dispositivos Mobile e Desktop.
- **@axe-core/react**: Integração no ambiente de desenvolvimento (`main.tsx`) para verificação contínua e automática de acessibilidade.

## 3. Principais Alterações e Metodologia
- **Integração do @axe-core/react**: Configuração para a execução automática de testes de acessibilidade em ambiente de desenvolvimento.
- **Revalidação de testes**: Confirmação da execução com sucesso de `npm run lint`, `npm run build` e `npm run test:run` (garantindo 52 testes unitários aprovados) após a sincronização com a branch `develop`.
- **Relatório de Auditoria (`AUDITORIA.MD`)**: Documentação com metodologia, ferramentas e evidências detalhadas.

## 4. Resultados das Evidências
- **Lighthouse Mobile**: Pontuação 100/100 em Acessibilidade.
- **Lighthouse Desktop**: Pontuação 100/100 em Acessibilidade.
- **Navegação por teclado**: Validada com sucesso em todos os componentes interativos.

## 5. Conclusão
A aplicação cumpre rigorosamente os requisitos de acessibilidade estipulados na Issue #116, sem violações detetadas nos testes executados e nas auditorias realizadas.