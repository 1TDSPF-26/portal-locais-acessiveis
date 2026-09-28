# ADR 001: Definição da Solução de Escrita para Cadastro de Locais (Issue #58)

---

## 1. Contexto e Problema
O Portal de Locais e Serviços Acessíveis utiliza atualmente a **Overpass API** (via OpenStreetMap) para realizar as consultas de locais de forma real (conforme estabelecido na Issue #24). No entanto, a Overpass API opera estritamente em modo de leitura (Read-Only) e não suporta fluxos de escrita/cadastro de novos dados para o escopo acadêmico/MVP da CP1. 

Para que a **Issue #57** possa ser desenvolvida sem bloqueios ou decisões arbitrárias pelo desenvolvedor *front-end*, faz-se necessário definir formalmente o endpoint de escrita, o método HTTP, a estrutura do payload alinhada ao formulário de cadastro (#55) e à tipagem global Local (#23/#69), e as diretrizes de integração.

---

## 2. Decisão Arquitetural
Optou-se por utilizar o **MockAPI** (`mockapi.io`) como a solução dedicada de mock da API REST de escrita para receber as requisições de envio de novos locais via método `POST`. 


### Justificativa:
* **Simplicidade:** Evita a configuração de infraestrutura complexa de backend e banco de dados para a CP1.
* **Compatibilidade:** Suporta requisições HTTP padrão em formato JSON, totalmente compatíveis com a API nativa `fetch` ou bibliotecas como `Axios`.
* **CORS Habilitado e Verificado:** Habilitado nativamente pela plataforma `mockapi.io`, permitindo chamadas diretas via ambiente de desenvolvimento local (`localhost`) sem restrições de origem.

---

## 3. Especificações Técnicas da API

Endpoint de Cadastro (POST): https://6aa9ededff4dd5698b4de9c7.mockapi.io/locais (configurada no ambiente do projeto)

Método HTTP: POST

Content-Type: application/json; charset=UTF-8

Autenticação: Nenhuma exigida para este ambiente de simulação/mock da CP1.

---

## 4. Estrutura do Payload (Requisição)

O objeto JSON enviado no cadastro não representa diretamente uma instância completa da interface `Local`. O payload de criação deve refletir apenas os dados realmente fornecidos pelo formulário da Issue #55, mantendo explícita qualquer conversão necessária em relação à estrutura interna do projeto.

Para o fluxo de criação, será utilizado um contrato específico denominado `CreateLocalPayload`. Essa estrutura representa apenas os dados necessários para o cadastro e não substitui a interface interna `Local`, que continua sendo utilizada pela aplicação.

```ts
interface CreateLocalPayload {
  nome: string;   
  categoria: string;
  descricao: string;
  endereco: {
    rua: string;
    numero?: string;
    cidade: string;
    estado: string;
  };
  acessibilidade: {
    status: 'acessivel' | 'parcial' | 'nao_acessivel' | 'nao_informado';
    descricao?: string;
  };
}
```

### Relação com a estrutura interna `Local`

A estrutura interna `Local` utilizada pelo projeto é composta por:

- `id: number`;
- `nome: string`;
- `descricao?: string`;
- `categoria: string`;
- `imagem?: string`;
- `endereco?: Endereco`, contendo `rua`, `numero`, `cidade` e `estado` opcionais;
- `coordenadas: Coordenadas`, contendo `latitude` e `longitude` obrigatórias;
- `acessibilidade: Acessibilidade`, contendo `status` obrigatório e `descricao` opcional.

O `CreateLocalPayload` é propositalmente diferente de `Local`, pois representa somente os dados disponíveis e necessários no fluxo atual de cadastro.

A resposta do `POST` também não deve ser tratada automaticamente como uma instância completa de `Local`, pois a interface `Local` exige `coordenadas`, e o formulário atual não fornece latitude e longitude.

Quando for necessário montar um objeto `Local`, os dados retornados pela API deverão ser combinados com coordenadas obtidas por uma etapa específica. O `id` retornado pelo MockAPI deverá ser convertido de `string` para `number`.


| Campo | Tipo | Obrigatório | Regras / Descrição |
| :--- | :--- | :--- | :--- |
| `nome` | String | **Sim** | Nome identificador do local. |
| `categoria` | String | **Sim** | Categoria do local (ex.: "Cultura", "Alimentação"). |
| `acessibilidade` | Object | **Sim** | Objeto contendo o status de acessibilidade e, opcionalmente, uma descrição. |
| `acessibilidade.status` | String | **Sim** | Nível de acessibilidade: `acessivel`, `parcial`, `nao_acessivel` ou `nao_informado`. |
| `acessibilidade.descricao` | String | Não | Detalhes adicionais sobre recursos ou limitações de acessibilidade. |
| `endereco` | Object | **Sim** | Objeto contendo os campos detalhados do logradouro. |
| `endereco.rua` | String | **Sim** | Nome da rua/avenida. |
| `endereco.numero` | String | Não | Número do imóvel, quando informado. |
| `endereco.cidade` | String | **Sim** | Cidade. |
| `endereco.estado` | String | **Sim** | Estado (UF). |
| `descricao` | String | **Sim** | Descrição do local fornecida pelo formulário. |

Os campos `bairro` e `cep` não fazem parte do payload atual, pois não estão presentes na tipagem `Endereco` utilizada pelo projeto e também não são coletados pelo formulário de cadastro da Issue #55. Esses campos não devem ser adicionados ao formulário apenas para atender ao contrato da API.

As coordenadas (`latitude` e `longitude`) também não fazem parte do payload de criação atual, pois o formulário da Issue #55 não coleta essas informações. Nenhum valor fictício deverá ser enviado. Caso sejam necessárias futuramente, deverão ser obtidas por uma funcionalidade específica, como geocodificação do endereço ou seleção em mapa.

O campo `id` não deve ser enviado na requisição `POST`. O identificador será gerado pelo MockAPI após a criação do recurso. Como o MockAPI retorna o `id` como `string` e a interface interna `Local` utiliza `id: number`, a conversão para `number` deverá ocorrer somente quando for necessário relacionar a resposta da API à estrutura interna do projeto. 

### Exemplo de Payload:
```json
{
  "nome": "Centro Cultural Inclusivo",
  "categoria": "Cultura",
  "acessibilidade": {
    "status": "acessivel",
    "descricao": "Rampas de acesso em todos os andares e banheiros adaptados."
  },
  "endereco": {
    "rua": "Rua da Sustentabilidade",
    "numero": "123",
    "cidade": "São Paulo",
    "estado": "SP"
  },
  "descricao": "Rampas de acesso em todos os andares e banheiros adaptados."
}
```
A. Resposta de Sucesso
Status HTTP: 201 Created

Payload de Retorno:

```json
{
  "id": "1",
  "createdAt": "2026-09-15T12:00:00.000Z",
  "nome": "Centro Cultural Inclusivo",
  "categoria": "Cultura",
 "acessibilidade": {
  "status": "acessivel",
  "descricao": "Rampas de acesso em todos os andares e banheiros adaptados."
},
  "endereco": {
    "rua": "Rua da Sustentabilidade",
    "numero": "123",
    "cidade": "São Paulo",
    "estado": "SP"
  },
  "descricao": "Rampas de acesso em todos os andares e banheiros adaptados."
}
```
B. Tratamento de Erro

Como o MockAPI utilizado neste projeto não realiza validações estritas do schema do payload, validações como a obrigatoriedade de `acessibilidade.status` devem ser realizadas no front-end antes do envio da requisição.

Erros de comunicação com o endpoint deverão ser tratados pela implementação da Issue #57 conforme o status HTTP retornado pela API.
Exemplo de requisição (Request)
POST /locais HTTP/1.1
Host: 6aa9ededff4dd5698b4de9c7.mockapi.io
Content-Type: application/json

```json

{
  "nome": "Museu da Inclusão e Cidadania",
  "categoria": "Cultura",
  "acessibilidade": {
  "status": "acessivel",
  "descricao": "Possui rampa de acesso, piso tátil, elevadores adaptados e recursos visuais e auditivos."
},
  "endereco": {
    "rua": "Av. Paulista",
    "numero": "1000",
    "cidade": "São Paulo",
    "estado": "SP"
  },
  "descricao": "Espaço com total acessibilidade física, rampas de acesso, piso tátil, elevadores adaptados e recursos para deficientes visuais e auditivos."
}
```
Exemplo de resposta esperada (Response - 201 Created)
```json
{
  "id": "8",
  "createdAt": "2026-09-16T09:15:09.125Z",
  "nome": "Museu da Inclusão e Cidadania",
  "categoria": "Cultura",
"acessibilidade": {
  "status": "acessivel",
  "descricao": "Possui rampa de acesso, piso tátil, elevadores adaptados e recursos visuais e auditivos."
},
  "endereco": {
    "rua": "Av. Paulista",
    "numero": "1000",
    "cidade": "São Paulo",
    "estado": "SP"
  },
  "descricao": "Espaço com total acessibilidade física, rampas de acesso, piso tátil, elevadores adaptados e recursos para deficientes visuais e auditivos."
}
```
Evidência de Validação: Foi executada uma requisição `POST` real ao endpoint definido utilizando o payload corrigido com os campos `nome`, `categoria`, `descricao`, `endereco` e `acessibilidade`. A requisição foi aceita com sucesso pelo MockAPI, que persistiu a estrutura enviada e gerou o identificador como `string`, conforme definido neste contrato.
### Mapeamento entre formulário e payload

| Formulário | Payload |
| :--- | :--- |
| `nome` | `nome` |
| `categoria` | `categoria` |
| `descricao` | `descricao` |
| `endereco.rua` | `endereco.rua` |
| `endereco.numero` | `endereco.numero` |
| `endereco.cidade` | `endereco.cidade` |
| `endereco.estado` | `endereco.estado` |
| `statusAcessibilidade` | `acessibilidade.status` |
| `descricaoAcessibilidade` | `acessibilidade.descricao` |

Com este contrato corrigido, a Issue #57 pode implementar o envio do cadastro sem precisar redefinir o formato do payload, alterar a tipagem `Local` ou adicionar campos ao formulário apenas para atender à integração.

## 5. Limitações da Solução
Persistência Volátil / Reset de Dados: O MockAPI não garante a retenção permanente dos dados no plano gratuito; os dados podem ser limpos ou redefinidos periodicamente.

Limites da Conta Gratuita: Sujeito a cotas máximas de requisições mensais e quantidade limite de recursos cadastrados.

Falta de Validações Complexas de Domínio: O servidor de mock aceita estruturas JSON flexíveis; validações estritas de schema, como a obrigatoriedade de `acessibilidade.status`, devem ser garantidas na camada do front-end.

Verificação de CORS: O funcionamento Cross-Origin foi verificado e confirmado a partir de chamadas locais via localhost, garantindo que o cabeçalho Access-Control-Allow-Origin: * é retornado adequadamente pelo serviço.
