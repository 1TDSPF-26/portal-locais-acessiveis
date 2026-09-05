# Pacote GitHub — CP Continuado

Este pacote contém modelos padronizados para o projeto continuado do Portal de Locais e Serviços Acessíveis.

## Projeto de Acessibilidade Geral

- Projeto acadêmico que contempla auxiliar usuarios que possuem dificuldades digitais.

## Conteúdo

```text
.github/
  ISSUE_TEMPLATE/
    feature.yml
    bug.yml
    test.yml
    documentation.yml
    config.yml
  workflows/
    ci.yml
  CODEOWNERS
  PULL_REQUEST_TEMPLATE.md

docs/
  configuracao-labels.md
  configuracao-project.md
  MENSAGEM_TEAMS.md
  modelo-bloqueio.md
  modelo-relatorio-qa.md
  modelo-relatorio-tech-lead.md
  modelo-release.md
  tutoriais/
    README.md
    01-primeiro-acesso.md
    02-issues-e-project.md
    03-dev-branch-commits-pr.md
    04-tech-lead-revisao-merge.md
    05-qa-testes.md
    06-ci-cd.md
    07-correcoes-conflitos-bloqueios.md
    08-release.md
    09-checklists-por-papel.md

.env.example
CONTRIBUTING.md
MANUAL_PROFESSOR.md
SETUP.md
vercel.json
```

## Siglas e termos

- CP: Check Point, ou momento formal de avaliação.
- QA: Quality Assurance, ou Garantia da Qualidade.
- DEV: Developer, ou Desenvolvedor.
- CI: Continuous Integration, ou Integração Contínua.
- Issue: registro formal de uma demanda.
- Pull Request: solicitação para revisar e integrar uma alteração.
- Git Flow: modelo de branches usado no projeto e extensão `git flow` que auxilia sua criação e publicação.
- Release: versão oficialmente liberada.
- Preview: publicação temporária utilizada para testes.

## Ordem de utilização

1. Abra `MANUAL_PROFESSOR.md`.
2. Confirme que o repositório da organização está público.
3. Crie a equipe `alunos` e conceda `Write` somente no repositório do projeto.
4. Crie as equipes `professores`, `tech-leads` e `qas`.
5. Copie este pacote para o repositório.
6. Crie `develop` e defina-a como branch padrão.
7. Confirme `git flow version` e execute `git flow init` em cada clone.
8. Substitua `ORGANIZACAO` no `CODEOWNERS`.
9. Crie labels e Milestones.
10. Confirme os modelos de Issue e Pull Request.
11. Execute o CI pela primeira vez.
12. Configure os Rulesets.
13. Crie o Project quando o serviço do GitHub estiver estável.
14. Confirme a aplicação Vite já criada na turma-piloto.
15. Execute o fluxo completo antes de repetir em outra organização.
16. Faça a publicação controlada pela Vercel CLI; não tente conectar diretamente o repositório da organização ao plano Hobby.

## Materiais por público

- Professor: `MANUAL_PROFESSOR.md` e `SETUP.md`.
- Todos os alunos: `docs/tutoriais/README.md`.
- DEV: tutoriais 1, 2, 3, 6, 7 e 9.
- Tech Lead: todos, com destaque para 4 e 8.
- QA: tutoriais 1, 2, 5, 6, 7, 8 e 9.

## O que não deve ser publicado

- RM;
- nota;
- justificativa médica;
- ocorrência disciplinar;
- senha;
- token;
- arquivo `.env`;
- dado médico ou pessoal sensível.

O controle de notas deverá permanecer em ambiente privado do professor.

# Design System — Issue #21

**Projeto:** Portal de Locais e Serviços Acessíveis
**Objetivo:** Definição e documentação da identidade visual inicial, componentes, tipografia e estados de interação para garantir acessibilidade e consistência na interface.

## 🔗 Links Úteis

**Figma:** [Acessar o Projeto no Figma](https://www.figma.com/design/FuzX9WRvPhFs943gbVv6Fx/cp-ale-fernandes-e-kaua?node-id=0-1&t=tBf9TXX9Zq4pdht5-1)

**Vídeo de Referência (Apoio):** [Assistir no YouTube] (https://youtu.be/RX-iy9sHPpg)

## 1. Identidade Visual e Paleta de Cores

A paleta foi atualizada para garantir contraste adequado e legibilidade, focando em uma experiência clara e acessível.

| Elemento | Cor | Hexadecimal |
| **Fundo Principal** | Branco Acinzentado | `#F5F7FA` |
| **Cards / Superfícies** | Azul Gelo | `#DDEEF2` |
| **Detalhes / Ícones** | Azul Intermediário | `#44A0B4` |
| **Títulos** | Azul Escuro | `#172033` |
| **Textos do Corpo** | Cinza Escuro | `#465268` |
| **Botões Principais (Base)** | Azul Vivo | `#155EEF` |
| **Foco / Interativos** | Verde Água | `#64CCC5` |
| **Azul Petróleo (Apoio)** | Petróleo | `#244A5A` |
| **Sucesso (Feedback)** | Verde Escuro | `#087443` |
| **Erro (Feedback)** | Vermelho Escuro | `#B42318` |

## 2. Tipografia

A fonte padrão escolhida para o projeto é a **Montserrat**. Abaixo estão as hierarquias definidas:

**H1 (Títulos Grandes):** Bold (700) | `32px` | Cor: Títulos (`#172033`)
**H2 (Títulos de Seção):** SemiBold (600) | `28px` | Cor: Títulos (`#172033`)
**H3 (Subtítulos / Cards):** Medium (500) ou SemiBold (600) | `24px` | Cor: Títulos (`#172033`)
**Body (Corpo de Texto):** Regular (400) | `20px` | Cor: Textos (`#465268`)
**Legendas (Textos Pequenos):** Regular (400) | `16px` ou `14px` | Cor: Textos (`#465268`)
**Botões:** SemiBold (600) | `16px` | Cor: Branco (`#FFFFFF`)

## 3. Espaçamento (Spacing)

Foi definido um sistema de grids e espaçamentos (padding/margin) com base em múltiplos de 4 e 8 para manter a consistência do layout:
**Escala:** `4px`, `8px`, `12px`, `16px`, `24px`, `32px`, `40px` e `48px`.

## 4. Componentes e Interações
### 4.1. Botões (Call to Action)

Os botões possuem estados visuais bem definidos para ajudar a o usuário a entender interações e o status do sistema.

| Estado | Fundo (Hex) | Texto (Hex) | Borda / Traço |
| **Ativado (Default)** | `#216FCE` | `#FFFFFF` | Nenhuma |
| **Hover (Passar o mouse)** | `#144787` | `#FFFFFF` | Nenhuma |
| **Foco (Navegação por teclado)** | `#216FCE` | `#FFFFFF` | Contorno de foco usando `#64CCC5` |
| **Desativado (Disabled)** | `#E0E4E8` | `#98A2B3` | Nenhuma |

### 4.2. Anatomia dos Cards
Os cards são utilizados para agrupar informações de forma clara e acessível. Estrutura padrão:
1. **Ícone ou Ilustração** (superior ou lateral).
2. **Título do Card (H3)**.
3. **Descrição Curta** (texto principal do card).
4. **CTA** (Botão "Saiba mais").
*Nota de UI:* Utilizar `8px` ou `16px` de arredondamento (border-radius) nas bordas dos cards.

## 5. Estados de Feedback e Alerta

Para critérios de acessibilidade, os alertas combinam o uso de **Cores + Ícones + Textos claros**.
* **Sucesso:**
* **Uso:** Confirmações de ações (ex: "Local cadastrado com sucesso").
* **Visual:** Fundo verde claro, bordas e textos em verde escuro (`#087443`). Acompanha ícone de check (`✓`).

* **Erro:**
* **Uso:** Falhas em formulários ou ações interrompidas (ex: "Não foi possível concluir a ação").
* **Visual:** Fundo vermelho claro, bordas e textos em vermelho escuro (`#B42318`). Acompanha ícone de X (`✕`).
