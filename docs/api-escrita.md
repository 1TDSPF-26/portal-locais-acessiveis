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

O objeto JSON enviado pela interface do formulário deve obedecer estritamente à tipagem `Local` (#23/#69) e aos campos coletados pelo formulário de cadastro (#55):

| Campo | Tipo | Obrigatório | Regras / Descrição |
| :--- | :--- | :--- | :--- |
| `nome` | String | **Sim** | Nome identificador do local. |
| `categoria` | String | **Sim** | Categoria do local (ex.: "Cultura", "Alimentação"). |
| `acessibilidades` | Array\<String\> | **Sim** | Lista com ao menos um recurso de acessibilidade disponível. |
| `endereco` | Object | **Sim** | Objeto contendo os campos detalhados do logradouro. |
| `endereco.rua` | String | **Sim** | Nome da rua/avenida. |
| `endereco.numero` | String | **Sim** | Número do imóvel. |
| `endereco.bairro` | String | **Sim** | Bairro. |
| `endereco.cidade` | String | **Sim** | Cidade. |
| `endereco.estado` | String | **Sim** | Estado (UF). |
| `endereco.cep` | String | **Sim** | Código de Endereçamento Postal. |
| `latitude` | Number | Não | Coordenada geográfica decimal (caso disponível via geocodificação/mapa). |
| `longitude` | Number | Não | Coordenada geográfica decimal (caso disponível via geocodificação/mapa). |
| `descricao` | String | Não | Observações adicionais sobre o local ou acessibilidade. |

### Exemplo de Payload:
```json
{
  "nome": "Centro Cultural Inclusivo",
  "categoria": "Cultura",
  "acessibilidades": [
    "Rampa de Acesso",
    "Banheiros Adaptados"
  ],
  "endereco": {
    "rua": "Rua da Sustentabilidade",
    "numero": "123",
    "bairro": "Centro",
    "cidade": "São Paulo",
    "estado": "SP",
    "cep": "01000-000"
  },
  "descricao": "Rampas de acesso em todos os andares e banheiros adaptados."
}

A. Resposta de Sucesso
Status HTTP: 201 Created

Payload de Retorno:

JSON
{
  "id": "1",
  "createdAt": "2026-09-15T12:00:00.000Z",
  "nome": "Centro Cultural Inclusivo",
  "categoria": "Cultura",
  "acessibilidades": [
    "Rampa de Acesso",
    "Banheiros Adaptados"
  ],
  "endereco": {
    "rua": "Rua da Sustentabilidade",
    "numero": "123",
    "bairro": "Centro",
    "cidade": "São Paulo",
    "estado": "SP",
    "cep": "01000-000"
  },
  "descricao": "Rampas de acesso em todos os andares e banheiros adaptados."
}
B. Resposta de Erro
Status HTTP: 400 Bad Request / 422 Unprocessable Entity

Payload de Retorno:

JSON
{
  "error": "Dados inválidos",
  "message": "acessibilidades deve conter ao menos um item"
}
Requisição enviada (Request)
POST /locais HTTP/1.1
Host: 6aa9ededff4dd5698b4de9c7.mockapi.io
Content-Type: application/json

JSON
{
  "nome": "Museu da Inclusão e Cidadania",
  "categoria": "Cultura",
  "acessibilidades": [
    "Rampa de Acesso",
    "Piso Tátil",
    "Elevadores Adaptados",
    "Recursos Visuais e Auditivos"
  ],
  "endereco": {
    "rua": "Av. Paulista",
    "numero": "1000",
    "bairro": "Bela Vista",
    "cidade": "São Paulo",
    "estado": "SP",
    "cep": "01310-100"
  },
  "descricao": "Espaço com total acessibilidade física, rampas de acesso, piso tátil, elevadores adaptados e recursos para deficientes visuais e auditivos."
}
Resposta recebida (Response - 201 Created)
JSON
{
  "id": "8",
  "createdAt": "2026-09-16T09:15:09.125Z",
  "nome": "Museu da Inclusão e Cidadania",
  "categoria": "Cultura",
  "acessibilidades": [
    "Rampa de Acesso",
    "Piso Tátil",
    "Elevadores Adaptados",
    "Recursos Visuais e Auditivos"
  ],
  "endereco": {
    "rua": "Av. Paulista",
    "numero": "1000",
    "bairro": "Bela Vista",
    "cidade": "São Paulo",
    "estado": "SP",
    "cep": "01310-100"
  },
  "descricao": "Espaço com total acessibilidade física, rampas de acesso, piso tátil, elevadores adaptados e recursos para deficientes visuais e auditivos."
}
Evidência de Validação: A requisição foi processada com sucesso retornando código HTTP 201 Created, persistindo o registro com todos os campos exigidos pela documentação (nome, categoria, acessibilidades, endereco, descricao) e gerando o identificador id: "8".

5. Limitações da Solução
Persistência Volátil / Reset de Dados: O MockAPI não garante a retenção permanente dos dados no plano gratuito; os dados podem ser limpos ou redefinidos periodicamente.

Limites da Conta Gratuita: Sujeito a cotas máximas de requisições mensais e quantidade limite de recursos cadastrados.

Falta de Validações Complexas de Domínio: O servidor de mock aceita estruturas JSON flexíveis; validações estritas de schema (como a obrigatoriedade do array de acessibilidades) devem ser garantidas na camada do front-end.

Verificação de CORS: O funcionamento Cross-Origin foi verificado e confirmado a partir de chamadas locais via localhost, garantindo que o cabeçalho Access-Control-Allow-Origin: * é retornado adequadamente pelo serviço.