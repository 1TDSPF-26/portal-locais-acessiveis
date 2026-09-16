# ADR 001: Definição da Solução de Escrita para Cadastro de Locais (Issue #58)

---

## 1. Contexto e Problema
O Portal de Locais e Serviços Acessíveis utiliza atualmente a **Overpass API** (via OpenStreetMap) para realizar as consultas de locais de forma real (conforme estabelecido na Issue #24). No entanto, a Overpass API opera estritamente em modo de leitura (Read-Only) e não suporta fluxos de escrita/cadastro de novos dados para o escopo acadêmico/MVP da CP1. 

Para que a **Issue #57** possa ser desenvolvida sem bloqueios ou decisões arbitrárias pelo desenvolvedor *front-end*, faz-se necessário definir formalmente o endpoint de escrita, o método HTTP, a estrutura do payload e as diretrizes de integração.

---

## 2. Decisão Arquitetural
Optou-se por utilizar um **Mock REST API endpoint dedicado para escrita** (utilizando ferramentas padronizadas de testes como `MockAPI`, `JSONPlaceholder` ou `JSON Server` local) para receber as requisições de envio de novos locais via método `POST`. 

*(Nota: A Overpass API permanece exclusivamente para consulta/leitura, enquanto a nova API de Mock cuidará do cadastro de novos locais).*

### Justificativa:
* **Simplicidade:** Evita a configuração de infraestrutura complexa de backend e banco de dados para a CP1.
* **Compatibilidade:** Suporta requisições HTTP padrão em formato JSON, totalmente compatíveis com a API nativa `fetch` ou bibliotecas como `Axios`.
* **CORS Habilitado:** Permite testes diretos em ambiente de desenvolvimento local (`localhost`).

---

## 3. Especificações Técnicas da API

* **Endpoint:** `https://api.mockapi.io/v1/locais-acessiveis/locais` *(ou endpoint de mock/backend configurado no ambiente)*
* **Método HTTP:** `POST`
* **Content-Type:** `application/json; charset=UTF-8`
* **Autenticação:** Nenhuma exigida para este ambiente de simulação.

---

## 4. Estrutura do Payload (Requisição)

O objeto JSON enviado pela interface do formulário deve obedecer estritamente aos seguintes campos:

| Campo | Tipo | Obrigatório | Regras / Descrição |
| :--- | :--- | :--- | :--- |
| `nome` | String | **Sim** | Nome identificador do local. |
| `categoria` | String | **Sim** | Categoria pré-definida do local. |
| `endereco` | String | **Sim** | Endereço descritivo ou logradouro. |
| `latitude` | Number | **Sim** | Coordenada geográfica decimal. |
| `longitude` | Number | **Sim** | Coordenada geográfica decimal. |
| `descricao` | String | Não | Observações adicionais sobre acessibilidade. |

### Exemplo de Payload:
```json
{
  "nome": "Centro Cultural Inclusivo",
  "categoria": "Cultura",
  "endereco": "Rua da Sustentabilidade, 123 - São Paulo/SP",
  "latitude": -23.550520,
  "longitude": -46.633308,
  "descricao": "Rampas de acesso em todos os andares e banheiros adaptados."
}