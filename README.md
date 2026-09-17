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




## Padrões Visuais de Acessibilidade — Issue #22
https://www.figma.com/design/E98KMpH41deMZrZzZJLUtn/CP3---Interface-Acessibilidade?node-id=0-1&t=86hp4mMLfOG3SG1j-1


## Objetivo

A Issue #22 tem como objetivo estabelecer padrões visuais de acessibilidade para pessoas com dificuldades visuais, orientando a criação e a estilização das páginas e componentes do Portal de Locais e Serviços Acessíveis.

Esses padrões complementam o Design System definido na Issue #21, acrescentando orientações específicas para melhorar contraste, legibilidade, percepção visual, identificação de estados e compreensão das informações.

As recomendações apresentadas nesta seção devem ser utilizadas como referência durante a implementação de páginas, componentes e elementos da interface.

Importante: as variações de acessibilidade apresentadas nesta documentação não substituem automaticamente a identidade visual definida na Issue #21. Elas devem ser aplicadas de acordo com o contexto de uso e com a necessidade de garantir melhor acessibilidade.

## Relação com o Design System — Issue #21

A Issue #21 estabeleceu a identidade visual inicial e refinada do projeto, incluindo cores, tipografia, espaçamentos, botões, cards e estados de interação.

A Issue #22 utiliza essas definições como ponto de partida e analisa quais padrões podem ser mantidos e quais precisam de variações para melhorar a acessibilidade visual.

O objetivo não é criar uma identidade visual completamente diferente, mas estabelecer orientações que permitam utilizar os elementos existentes de maneira mais acessível.

Quando uma combinação ou padrão visual da Issue #21 apresentar limitações de contraste, legibilidade ou percepção, deve-se utilizar a variação acessível indicada nesta documentação.

Caso uma determinada cor ou combinação seja identificada repetidamente como inadequada, essa necessidade poderá posteriormente ser registrada como uma possível revisão do Design System da Issue #21.

## Cores mantidas

As cores que apresentam boa utilização dentro de seus respectivos contextos podem continuar sendo utilizadas, desde que respeitadas as regras de contraste e percepção visual.

## Elemento	            ## Cor	     ## Utilização
Fundo principal	       #F7F9FA	    Fundo geral das páginas
Títulos	               #172A3A	    Títulos e informações de maior destaque
Botões principais	     #216FCE	    Ações principais
Azul petróleo	         #244A5A	    Elementos de apoio
Sucesso	               #087443	    Mensagens e estados de sucesso
Erro	                 #B42318	    Mensagens e estados de erro
Foco	                 #64CCC5	    Indicação visual de foco

A utilização dessas cores deve considerar sempre o elemento sobre o qual a cor será aplicada e a cor do fundo.

Uma cor que funciona adequadamente em um contexto pode apresentar contraste insuficiente em outro.

## Cores que exigem atenção

A cor #44A0B4, utilizada na Issue #21 em cards, detalhes, ícones, tags ou bordas, deve receber atenção especial dependendo da forma como for utilizada.

Quando aplicada como elemento decorativo, detalhe, borda ou superfície visual, pode ser utilizada desde que não seja a única forma de transmitir uma informação importante.

Entretanto, ela não deve ser utilizada como cor de texto sobre fundos que produzam contraste insuficiente.

A análise realizada para a combinação #44A0B4 com #465268 apresentou contraste aproximado de 2,60:1, sendo uma combinação inadequada para texto normal.

Já a combinação #44A0B4 com #172033 apresentou contraste aproximado de 5,37:1, sendo mais adequada para utilização textual.

Por isso, a escolha da cor deve considerar não apenas a cor isoladamente, mas também sua combinação com o fundo e sua finalidade dentro da interface.

## Contraste e percepção visual

O contraste deve ser considerado em textos, componentes, controles e informações importantes.

Como referência de acessibilidade, textos normais devem buscar contraste mínimo de 4,5:1, enquanto textos grandes podem utilizar como referência mínima 3:1.

Além do contraste entre texto e fundo, deve-se observar a diferença visual entre elementos da interface, principalmente em componentes interativos, estados e informações importantes.

Não se deve considerar uma combinação acessível apenas porque as cores parecem visualmente diferentes. A combinação deve apresentar contraste suficiente para facilitar sua percepção.

Combinações com limitações

A combinação:

#44A0B4 + #465268

apresenta limitação de contraste e não deve ser utilizada para textos normais.

A combinação:

#44A0B4 + #172033

apresenta contraste mais adequado e pode ser utilizada em contextos textuais compatíveis.

Sempre que uma combinação de cores não apresentar contraste suficiente, deve-se utilizar uma alternativa que preserve a legibilidade sem comprometer a compreensão da informação.

## Não utilizar somente a cor para transmitir informação

Informações importantes da interface não devem depender exclusivamente da cor para serem compreendidas.

Isso é especialmente importante para usuários que possuem daltonismo ou outras dificuldades de percepção de cores.

Os estados e informações devem utilizar recursos complementares, como:

texto;
ícones;
símbolos;
bordas;
padrões visuais;
mudanças de estado;
mensagens descritivas.

## Exemplo de sucesso

Em vez de utilizar somente a cor verde, utilizar:

✓ Local cadastrado com sucesso

A cor #087443 pode complementar a mensagem, mas o texto e o ícone continuam transmitindo a informação.

## Exemplo de erro

Em vez de utilizar somente a cor vermelha, utilizar:

X Não foi possível concluir a ação

A cor #B42318 complementa a informação, enquanto o texto e o ícone permitem identificar o estado.

## Estados de interação

Os componentes devem apresentar diferenças visuais claras entre seus estados.

Devem ser considerados, quando aplicável:

normal;
hover;
foco;
ativo;
desabilitado.

O estado de foco deve apresentar uma indicação visual evidente para facilitar a navegação, especialmente para usuários que utilizam teclado.

A cor #64CCC5 definida na Issue #21 pode ser utilizada como referência para o estado de foco, desde que a aplicação do foco apresente uma indicação suficientemente perceptível.

O foco não deve depender somente de uma pequena alteração de cor. Sempre que necessário, podem ser utilizados contornos, bordas ou outros indicadores visuais.

## Tipografia acessível

A tipografia definida na Issue #21 utiliza a fonte Montserrat e deve continuar sendo utilizada como referência visual do projeto.

Para melhorar a legibilidade, os tamanhos definidos devem ser respeitados de acordo com a hierarquia do conteúdo:

Elemento	           Tamanho	Peso	Line-height
H1                       32px	      700	1,2
H2	                     28px	      600	1,25
H3	                     24px	      500–600	1,3
Parágrafos / Body       	20px      400	1,5
Botões	                 16px      	600	1,5
Legendas	              14–16px	    400	1,4

A hierarquia tipográfica deve permanecer clara, evitando que diferentes níveis de informação tenham aparência excessivamente semelhante.

Textos importantes não devem ser reduzidos excessivamente para caber em componentes.

## Legibilidade e line-height

O espaçamento vertical entre as linhas deve permitir que o texto seja lido sem que as linhas fiquem visualmente comprimidas.

Para textos corridos, recomenda-se manter um line-height maior do que o tamanho da fonte, utilizando como referência aproximadamente 1,5 para o corpo do texto.

Títulos podem utilizar valores menores, desde que a leitura permaneça confortável e a hierarquia visual seja preservada.

Quando uma variação acessível for necessária, o tamanho da fonte e o line-height podem ser aumentados para melhorar a leitura.

Essas alterações devem ser aplicadas principalmente em conteúdos extensos, textos informativos e componentes nos quais a legibilidade seja prioritária.

## Espaçamento e organização visual

A escala de espaçamentos definida na Issue #21 deve continuar sendo utilizada como base:

4px, 8px, 12px, 16px, 24px, 32px, 40px e 48px.

O espaçamento deve ser utilizado para separar visualmente grupos de informações e facilitar a compreensão da estrutura da página.

Em contextos que exigem maior legibilidade, podem ser priorizados espaçamentos maiores, especialmente:

entre títulos e conteúdos;
entre parágrafos;
entre campos de formulário;
entre elementos interativos;
entre grupos de informações;
dentro de componentes.

O objetivo é evitar interfaces visualmente congestionadas e facilitar a identificação dos diferentes elementos.

## Botões acessíveis

Os botões devem possuir identificação clara da ação que será realizada.

A cor do botão pode contribuir para sua identificação, mas não deve ser o único elemento responsável por comunicar sua função.

Os botões devem apresentar estados visuais identificáveis, incluindo:

padrão;
hover;
foco;
ativo;
desabilitado.

O texto do botão deve ser legível e possuir tamanho adequado.

Sempre que houver necessidade de diferenciar ações, deve-se utilizar também texto, ícones ou outras características visuais, evitando depender exclusivamente da cor.

## Cards acessíveis

Os cards definidos na Issue #21 possuem:

Ícone ou ilustração;
Título;
Descrição curta;
CTA ou botão de ação.

A estrutura deve ser preservada nas variações acessíveis.

A cor #DDEEF2 pode continuar sendo utilizada como superfície, enquanto #44A0B4 pode ser utilizada em detalhes, ícones, tags ou bordas, desde que não seja responsável sozinha por transmitir informações importantes.

O conteúdo textual deve apresentar hierarquia clara e espaçamento suficiente para facilitar a leitura.

Quando houver uma ação no card, ela deve ser identificada por texto ou outro recurso além da cor.

## Inputs e campos de formulário

Os campos de formulário devem apresentar estados visualmente identificáveis.

Devem ser considerados, quando aplicável:

vazio;
preenchido;
foco;
erro;
desabilitado.

O estado de erro não deve ser indicado somente pela alteração da cor da borda.

Além da cor #B42318, deve existir uma mensagem ou indicação textual explicando o problema.

Exemplo:

CPF inválido. Verifique os números informados.

Da mesma forma, o foco deve ser claramente perceptível e não depender apenas de uma pequena alteração cromática.

## Quando utilizar as variações acessíveis

As variações apresentadas nesta documentação devem ser utilizadas quando o contexto exigir maior legibilidade, contraste ou percepção visual.

Podem ser priorizadas em:

textos sobre fundos coloridos;
mensagens de erro e sucesso;
botões e controles interativos;
estados de foco;
formulários;
cards com informações importantes;
elementos que utilizem cores para indicar estados;
componentes destinados a usuários com dificuldades de percepção visual;
conteúdos com grande quantidade de texto.

A utilização da variação deve considerar a função do elemento e não apenas sua aparência.

## Variações de acessibilidade não substituem automaticamente a identidade visual

As recomendações da Issue #22 representam orientações de acessibilidade e não significam que todos os elementos definidos na Issue #21 precisam ser substituídos.

A identidade visual do projeto deve ser preservada sempre que for possível utilizá-la de maneira acessível.

Quando uma combinação específica apresentar problemas de contraste ou legibilidade, deve-se aplicar uma variação apropriada naquele contexto.

Dessa forma, a acessibilidade funciona como uma camada complementar ao Design System, permitindo adaptações sem descaracterizar automaticamente a identidade visual do projeto.

### Contextualização

A **Issue #21** apresenta a identidade visual e a interface pensadas para o público geral, enquanto a **Issue #22** parte de uma necessidade específica de acessibilidade visual. Por isso, algumas definições visuais precisam ser diferentes, principalmente em relação aos tons de azul, contraste e fundo da interface. Para pessoas com determinadas dificuldades de percepção visual, fundos muito claros ou brancos podem causar desconforto e dificultar a leitura devido à luminosidade e ao baixo conforto visual. Dessa forma, a Issue #22 propõe variações de cores, fundos, tipografia, espaçamento e contraste que favoreçam uma leitura mais confortável e uma melhor percepção dos elementos. Essas mudanças não significam que a identidade da Issue #21 esteja errada ou precise ser totalmente substituída, mas que **diferentes necessidades visuais exigem diferentes escolhas de interface**.
