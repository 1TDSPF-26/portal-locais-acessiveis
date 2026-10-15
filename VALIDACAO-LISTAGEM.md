# Validação — Listagem de Locais (Issue #114)

## Escopo desta validação
Conforme a #114, o objeto desta validação é o **fluxo da listagem** da página `/locais`: busca, filtros, ordenação, paginação e estado sem resultado. Acessibilidade e responsividade foram verificadas como apoio ("quando aplicável"); achados fora do fluxo da listagem foram registrados como issues próprias (ver seção final) e não fazem parte do escopo desta demanda.

## Ambiente
- Local (`npm run dev`), branch `feature/114-validar-listagem`.
- `develop` com #60 (filtros/ordenação) e #61 (paginação) integradas.
- Dados: Overpass (teste manual na interface) e mock (teste automatizado).
- Base de teste: 1323 locais retornados pela Overpass.

## Ciclo de qualidade
- `npm run test:run`: todos os testes passando (print anexo).
- `npm run lint`: 0 erros; warnings pré-existentes (`set-state-in-effect` em `Locais.tsx`), fora do escopo desta validação.
- `npm run build`: concluído com sucesso (print anexo).

## Observações de método
- **Seletores:** os valores dos `<select>` foram alterados disparando o evento `change` (a lista nativa não aparece em captura). Busca e navegação por teclado foram feitas com digitação e teclas reais.
- **Cenário 11 (rede):** verificado pelo monitor de rede e pela Performance API do navegador.
- **Cenário 13 (responsividade):** medido carregando `/locais` em larguras de 375, 768 e 1280px. Nenhum código foi alterado durante a validação.

## Cenários executados

| # | Cenário | Escopo | Esperado | Observado | Status |
|---|---------|--------|----------|-----------|--------|
| 1 | Busca com resultado | Listagem | filtra corretamente | "102" → 1 item; "fig" → "A Figueira Rubaiyat"; não diferencia maiúsculas/minúsculas | Passou |
| 2 | Busca sem resultado | Listagem | estado vazio + limpar | "zzzzz" → "Nenhum resultado encontrado." com botão "Limpar filtros"; volta a 1323 itens | Passou |
| 3 | Filtro por categoria | Listagem | só a categoria | "cafe" → 42 locais em 5 páginas; conferidas todas, só cafe | Passou |
| 4 | Filtro por acessibilidade | Listagem | só o nível escolhido | "Parcialmente acessível" → 137 locais, todos no nível | Passou |
| 5 | Combinação busca + filtros | Listagem | aplica os três | "ca" + restaurant + parcial → 2 locais; os três critérios juntos | Passou |
| 6 | Ordenação A–Z / Z–A | Listagem | ordem muda | A–Z: "102° DP…" a "Z Deli…"; Z–A inverte; sem itens fora de ordem | Passou |
| 7 | Paginação (10 por página) | Listagem | divide certo | 10 por página, 133 páginas (última com 3); exibe "Página X de 133" | Passou |
| 8 | Limites de página | Listagem | não passa do início/fim | Pág. 1: "Anterior" desabilitado; pág. 133: "Próxima" desabilitado | Passou |
| 9 | Ajuste de página | Listagem | não fica vazia | Da pág. 133, filtrar "cafe" → pág. 5 de 5; nunca ficou em página vazia | Passou |
| 10 | Contagem de resultados | Listagem | mostra o total | Atualiza: 1323 → 42 → 137 → 2 → "1 local encontrado" → "Nenhum local encontrado"; em região `aria-live="polite"` | Passou |
| 11 | Sem nova requisição | Listagem | nenhuma chamada nova | Nenhuma requisição à Overpass ao trocar filtros, ordenação e páginas (só a carga inicial) | Passou |
| 12 | Navegação por teclado | Apoio (a11y) | tudo alcançável, foco visível | Ordem: busca → categoria → acessibilidade → ordenação → limpar → cards → paginação; anel de foco visível; Enter funciona. Ressalva: campo de busca sem borda fora de foco | Passou (com ressalva) |
| 13 | Responsividade 375/768/1280 | Apoio (fora do fluxo) | sem rolagem horizontal | 375px: há rolagem horizontal (~454px); 768 e 1280px sem rolagem. Causa: categoria com texto muito longo (dados). Registrado como issue própria | Achado (fora do escopo) |

**Resultado do escopo da #114:** os 11 cenários do fluxo da listagem (1–11) passaram. O cenário 12 (teclado) passou, com uma ressalva de UX. O cenário 13 (responsividade) é de layout global, fora do fluxo da listagem, e foi registrado como issue própria.

## Verificação automatizada
- Adicionado `src/pages/Locais/Locais.fluxoQA.test.tsx`: fluxo combinado (busca + filtro + paginação) confirmando que a listagem é derivada da lista carregada e que o `fetch` é chamado apenas uma vez. O teste limpa o cache no `beforeEach` (`limparCacheLocais()`), evitando reaproveitamento entre testes.

## Achados registrados como issues próprias (fora do escopo da #114)
Durante a validação foram encontrados pontos que são código de produção e pertencem a outros escopos. Foram registrados como issues relacionadas, não corrigidos nesta demanda de QA:

- **[BUG] Rolagem horizontal em 375px** — causada por uma categoria com texto muito longo (`backup_seguro_e_resistente_para_criptomoedas.`) que alarga o seletor de Categoria. Severidade: Média. (É a causa do cenário 13; pertence a layout/responsividade, não ao fluxo da listagem.)
- **[UX/Acessibilidade] Campo de busca sem borda visível** — fora de foco, o campo não tem borda; pouco destacado no layout. Possível violação da WCAG 1.4.11. Severidade: Média.
- **[UX] Categorias sem rótulos legíveis** — exibidas como chaves cruas (`police`, `cafe`, `fast_food`). Severidade: Baixa.
- **[MELHORIA] Mudar busca/filtros/ordenação não volta para a página 1** — ao filtrar numa página alta, o usuário cai no meio da nova lista. Severidade: Média.
- **[DEV] Dados da Overpass sem normalização** — "Local sem nome" (141x), "Drogasil" (155x), categorias de spam. Severidade: Média. (Verificar se já coberto pela #124.)

### Observações que não constituem defeito
- Duas requisições na carga inicial: efeito esperado do React StrictMode em desenvolvimento (não ocorre em produção).
- Ordem do Tab passa pelos cards antes da paginação: comportamento natural do DOM.
- Durante um carregamento a Overpass falhou e a aplicação exibiu "Não foi possível carregar as informações"; o botão "Tentar novamente" funcionou (estado de erro OK).

## Decisão de QA
**Aprovado com ressalva.**

O fluxo que a #114 pede validar — busca, filtros, ordenação, paginação e estado sem resultado — funciona integralmente (cenários 1–11 passaram), com a contagem anunciada de forma acessível e sem novas requisições ao trocar filtros/páginas. As ressalvas (campo de busca sem borda e rolagem horizontal em 375px) são de layout/UX, fora do fluxo da listagem, foram registradas como issues próprias e não bloqueiam esta demanda. Recomenda-se priorizar a issue da rolagem horizontal em 375px por afetar o uso em mobile.

## Observação
Validação baseada nos cenários executados acima; não constitui garantia de ausência total de problemas na aplicação.