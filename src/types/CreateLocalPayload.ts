import type { Acessibilidade } from './Local'

export interface CreateLocalPayload {
  nome: string;
  categoria: string;
  descricao: string;
  endereco: {
    rua: string;
    numero?: string;
    cidade: string;
    estado: string;
  };
  acessibilidade: Acessibilidade;
}
