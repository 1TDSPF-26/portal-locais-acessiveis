/**Endereço de um local, incluindo rua, número, cidade e estado.
 * Todas as propriedades são opcionais, permitindo que apenas algumas informações sejam fornecidas.*/
export interface Endereco {
  rua?: string;
  numero?: string;
  cidade?: string;
  estado?: string;
}
/** Coordenadas geográficas de um local, representadas por latitude e longitude.
 * Ambas as propriedades são obrigatórias e devem ser fornecidas como números.*/
export interface Coordenadas {
  latitude: number;
  longitude: number;
}

/** Informações sobre a acessibilidade de um local.
 * A propriedade 'status' é obrigatória e define o nível de acessibilidade. 
 * A propriedade 'descricao' é opcional e pode ser usada para fornecer detalhes adicionais.*/
export interface Acessibilidade {
  status: 'acessivel' | 'parcial' | 'nao_acessivel' | 'nao_informado';
  descricao?: string;
}

/** Representa um local com informações detalhadas, incluindo nome, descrição, categoria, imagem, endereço, coordenadas e acessibilidade.
 * A propriedade 'id' é obrigatória e deve ser uma number única para identificar o local. 
 * A propriedade 'nome' é obrigatória e deve ser uma string representando o nome do local.
 * A propriedade 'descricao' é opcional e pode fornecer informações adicionais sobre o local. 
 * A propriedade 'categoria' é obrigatória e deve ser uma string representando a categoria do local. 
 * A propriedade 'imagem' é opcional e pode fornecer um URL para uma imagem representativa do local. 
 * As propriedades 'endereco', 'coordenadas' e 'acessibilidade' são obrigatórias e devem fornecer informações detalhadas sobre o endereço, coordenadas geográficas e acessibilidade do local, respectivamente.*/
export interface Local {
  id: number;
  nome: string;
  descricao?: string;
  categoria: string;
  imagem?: string;
  endereco?: Endereco;
  coordenadas: Coordenadas;
  acessibilidade: Acessibilidade;
}


