# Relatório de Ciclo de Testes e Qualidade (QA) - CP2
## Projeto: `1TDSPF-26/portal-locais-acessiveis`

### 📋 Identificação da Responsável
- **Nome:** Ana Clara Pereira de Magalhães
- **RM:** 560871
- **Papel:** QA

---

### 🎯 Objetivo da Issue
Executar o ciclo de testes de rotas, navegação por teclado, implementação de verificação automatizada autoral de foco e validação da qualidade geral da aplicação para o CP2, garantindo a conformidade com os critérios de aceite e a estabilidade da branch `develop`.

---

### 🛠️ Evidências de Execução Técnica

#### 1. Testes Automatizados (Vitest & Testing Library)
- **Resultado:** 39 testes executados com 100% de aprovação em 10 ficheiros de teste (*10 passed* em 4.71s).
- **Escopo Coberto:** Utilitários (`vite.test.ts`, `filtrarLocais.test.ts`), contextos de acessibilidade (`AccessibilityContext.test.tsx`), fluxos de cadastro (`Cadastro.test.tsx`, `validacaoCadastro.test.ts`), navegação de rotas (`navigation.test.tsx`), listagem/filtros (`ListagemLocais.test.ts`, `Locais.test.tsx`) e a nova **verificação automatizada autoral de foco global** (`FocoGlobal.test.tsx`).

#### 2. Verificação Estática de Código (Linter - Oxlint)
- **Resultado:** 0 erros encontrados (aprovado).
- **Avisos Identificados:** 1 warning preexistente conhecido (`react(set-state-in-effect)`) localizado em `src/pages/Locais/Locais.tsx:60:5`, referente à chamada síncrona de `setState` dentro de um `useEffect`. Confirmado que este aviso não bloqueia o build e não compromete a estabilidade funcional da entrega.

#### 3. Build de Produção (TypeScript & Vite)
- **Resultado:** Concluído com sucesso em 342ms (`tsc -b && vite build`).
- **Módulos:** 51 módulos transformados, gerando os assets otimizados na pasta `dist/` (`dist/index.html`, `dist/assets/index-BJBx0BJv.css`, `dist/assets/index-BN7xgjfE.js`) sem falhas de tipagem ou de empacotamento.

---

### ⌨️ Ciclo de Testes Manuais e de Acessibilidade
- **Navegação por Teclado:** Validação efetuada através da tecla `Tab` nas rotas principais, complementada pelo teste automatizado autoral de foco global (`FocoGlobal.test.tsx`), garantindo que o foco é detetado programaticamente, permanece perceptível e sem armadilhas de foco (*focus traps*).
- **Rotas:** Verificada a transição correta entre as páginas e o tratamento de navegação.

---

### ✅ Conclusão e Parecer de QA
- **Status:** Aprovado (GO).
- **Justificativa:** Todos os 39 testes automatizados passaram sem erros, o linter validou o código sem erros críticos, o build de produção gerou os pacotes otimizados com sucesso em tempo recorde e a acessibilidade por teclado foi atestada de forma rigorosa por automação e verificação manual.