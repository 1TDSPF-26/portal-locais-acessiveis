export interface Endereco {
  rua: string
  numero: string
  cidade: string
  estado: string
}

export interface Acessibilidade {
  status: 'acessivel' | 'parcial' | 'nao_acessivel' | 'nao_informado'
  descricao?: string
}

export interface Local {
  id: number
  nome: string
  categoria: string
  descricao?: string
  endereco?: Endereco
  coordenadas: {
    latitude: number
    longitude: number
  }
  acessibilidade: Acessibilidade
}