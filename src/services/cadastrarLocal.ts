import type { CreateLocalPayload } from '../types/CreateLocalPayload'

const ENDPOINT_CADASTRO = 'https://6aa9ededff4dd5698b4de9c7.mockapi.io/locais'

export async function cadastrarLocal(payload: CreateLocalPayload): Promise<void> {
  const response = await fetch(ENDPOINT_CADASTRO, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json; charset=UTF-8',
    },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    throw new Error(`Erro ao cadastrar o local: ${response.status}`)
  }
}
