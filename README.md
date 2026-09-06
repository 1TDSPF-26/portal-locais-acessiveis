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

## Design System — Issue #21

**Projeto:** Portal de Locais e Serviços Acessíveis

Esta documentação reúne as principais definições visuais do projeto, como cores, tipografia, espaçamentos, botões, cards e estados de interação. A ideia é manter um padrão visual para que as próximas páginas e componentes sigam a mesma identidade.

## Links

- **Figma:** https://www.figma.com/design/FuzX9WRvPhFs943gbVv6Fx/cp-ale-fernandes-e-kaua?node-id=0-1&t=PmvI8scbHRUuHyLB-1

- **Vídeo de referência:** https://www.youtube.com/watch?v=RX-iy9sHPpg&feature=youtu.be

## Paleta inicial

Abaixo está a primeira versão da paleta criada para o projeto:

 Elemento  / Cor 

 Cards / `#44A0B4` 
 Títulos / `#172033` 
 Textos / `#465268` 
 Fundo / `#F5F7FA` 
 Botões / `#155EEF` 
 Sucesso / `#087443` 
 Erro / `#B42318` 

Essa paleta foi utilizada como base inicial e depois passou por alguns ajustes durante a revisão do Design System.

## Paleta final / refinada

Após a revisão, algumas cores foram ajustadas para melhorar a organização visual e deixar os elementos mais consistentes entre si.

 Elemento / Cor 

 Fundo principal | `#F7F9FA` 
 Cards | superfícies | `#DDEEF2` 
 Detalhes | ícones | `#44A0B4` 
 Botões principais | `#216FCE` 
 Azul petróleo | apoio | `#244A5A` 
 Títulos | `#172A3A` 
 Textos | `#465268` 
 Foco | interativos |`#64CCC5` 
 Sucesso | `#087443` 
 Erro | `#B42318` 

A paleta final/refinada é a referência oficial para as próximas etapas do projeto.

## Tipografia

A fonte escolhida para o projeto foi a **Montserrat**.

- **H1:** 32px — Bold 700
- **H2:** 28px — SemiBold 600
- **H3:** 24px — Medium 500 ou SemiBold 600
- **Body:** 20px — Regular 400
- **Legendas:** 14px ou 16px — Regular 400
- **Botões:** 16px — SemiBold 600

## Espaçamentos

Foi criada uma escala simples de espaçamentos para manter o padrão entre os componentes:

`4px`, `8px`, `12px`, `16px`, `24px`, `32px`, `40px` e `48px`.

## Botões

Os botões foram definidos com alguns estados visuais:

- padrão;
- hover;
- foco;
- desabilitado.

O estado de foco utiliza `#64CCC5` para deixar a navegação por teclado mais visível.

## Cards

Os cards seguem uma estrutura simples:

1. Ícone ou ilustração;
2. Título;
3. Descrição curta;
4. CTA ou botão de ação.

Os cards utilizam `#DDEEF2` como superfície e `#44A0B4` em detalhes, ícones, tags ou bordas.

## Estados de feedback

Também foram definidos estados de sucesso e erro.

### Sucesso

Usa a cor `#087443`, junto com ícone de confirmação e texto.

**Exemplo:**  
`✓ Local cadastrado com sucesso`

### Erro

Usa a cor `#B42318`, junto com ícone de erro e texto.

**Exemplo:**  
`X Não foi possível concluir a ação`

Os estados usam cor, ícone e texto para que a informação não dependa somente da cor.

## Ícones e estados visuais

O Figma também apresenta exemplos de:

- início;
- localização;
- cadastro;
- busca;
- acessibilidade;
- informação;
- estado normal;
- hover;
- foco;
- ativo;
- desabilitado.

## Resumo

Com os ajustes feitos durante a revisão, o Design System passou a ter uma paleta final mais organizada, estados de feedback mais claros e uma documentação alinhada com o Figma.
A versão final/refinada deve ser utilizada como referência nas próximas implementações do projeto.