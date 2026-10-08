# Relatório de Ciclo de Testes e Qualidade (QA) - CP2
## Projeto: `1TDSPF-26/portal-locais-acessiveis`

### 📋 Identificação da Responsável
- **Nome:** Ana Clara Pereira de Magalhães
- **RM:** 560871
- **Papel:** QA

---

### 🎯 Objetivo da Issue
Executar o ciclo de testes de rotas, navegação por teclado, implementação de verificação automatizada autoral e validação da qualidade geral da aplicação para o CP2, garantindo a conformidade com os critérios de aceite e a estabilidade da branch `develop`.

---

### 🛠️ Evidências de Execução Técnica

#### 1. Testes Automatizados (Vitest & Testing Library)
- **Resultado:** 39 testes executados com 100% de aprovação em 10 ficheiros de teste (*10 passed*).
- **Escopo Coberto:** Utilitários, contextos de acessibilidade, fluxos de cadastro, navegação de rotas, listagem e filtros de locais, além da nova **verificação automatizada autoral de foco global (`FocoGlobal.test.tsx`)** para assegurar programaticamente a deteção de elementos interativos e a transição do foco por teclado.

#### 2. Verificação Estática de Código (Linter - Oxlint)
- **Resultado:** 0 erros encontrados.
- **Avisos Identificados:** 1 warning preexistente conhecido (`react(set-state-in-effect)`) localizado em `src/pages/Locais/Locais.tsx:60:5`, referente à chamada síncrona de `setState` dentro de um `useEffect`. Confirmado que este aviso não bloqueia o build e não compromete a estabilidade funcional da entrega.

#### 3. Build de Produção (TypeScript & Vite)
- **Resultado:** Concluído com sucesso em 1.65s (`tsc -b && vite build`).
- **Módulos:** 51 módulos transformados, gerando os assets otimizados na pasta `dist/` sem falhas de tipagem ou de empacotamento.

---

### ⌨️ Ciclo de Testes Manuais e de Acessibilidade
- **Navegação por Teclado:** Validação efetuada com a tecla `Tab` nas rotas principais, complementada pelo teste unitário automatizado autoral de foco, garantindo que o foco permanece perceptível e sem armadilhas de foco (*focus traps*).
- **Rotas:** Verificada a transição correta entre as páginas e o tratamento de navegação.

---

### ✅ Conclusão e Parecer de QA
- **Status:** Aprovado (GO).
- **Justificativa:** Todos os testes automatizados (incluindo o novo teste autoral de foco) passaram sem erros, o lint foi concluído sem falhas críticas, o build de produção gerou os pacotes com sucesso e a acessibilidade por teclado foi validada de forma rigorosa tanto por automação quanto por verificação manual.