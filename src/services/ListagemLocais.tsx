import type { Local } from '../types/Local'
import type { OverpassResponse } from '../types/Overpass'
import { normalizarLocal } from './normalizarLocal.ts'
import { obterCacheLocais, definirCacheLocais } from './CacheLocais.ts'

interface OpcoesListagem {
  /** Ignora o cache e consulta a fonte externa de novo (ex.: atualização manual). */
  forcarAtualizacao?: boolean
}

const TEMPO_LIMITE_MS = 100_000

// Requisição em andamento, compartilhada por todos que chamarem enquanto ela não terminar.
let requisicaoEmAndamento: Promise<Local[]> | null = null

export function ListagemLocais({ forcarAtualizacao = false }: OpcoesListagem = {}): Promise<Local[]> {
  if (!forcarAtualizacao) {
    const cacheValido = obterCacheLocais()
    if (cacheValido) {
      return Promise.resolve(cacheValido)
    }
  }

  // Nunca existem duas consultas simultâneas à Overpass, nem por clique repetido,
  // nem por outra instância da página, nem por outro chamador do service.
  if (!requisicaoEmAndamento) {
    requisicaoEmAndamento = consultarOverpass().finally(() => {
      requisicaoEmAndamento = null
    })
  }

  return requisicaoEmAndamento
}

/** Descarta qualquer requisição em andamento. Usado em testes. */
export function reiniciarListagemLocais() {
  requisicaoEmAndamento = null
}

async function consultarOverpass(): Promise<Local[]> {
  const query = `
  [out:json][timeout:90];
  area["wikidata"="Q174"]["admin_level"="8"]->.sp;

  nwr["wheelchair"][~"^(amenity|shop|tourism)$"~"."](area.sp);
  out center qt;
`
  const controlador = new AbortController()
  const temporizador = setTimeout(() => controlador.abort(), TEMPO_LIMITE_MS)

  let result: OverpassResponse

  try {
    const response = await fetch(
      'https://overpass-api.de/api/interpreter',
      {
        method: 'POST',
        body: 'data=' + encodeURIComponent(query),
        signal: controlador.signal,
      },
    )

    if (!response.ok) {
      throw new Error(`Erro ao consultar a Overpass: ${response.status}`)
    }

    result = await response.json()
  } finally {
    clearTimeout(temporizador)
  }

  // A Overpass pode responder 200 com a lista vazia/parcial e um aviso de erro de execução.
  if (result.remark && /runtime error/i.test(result.remark)) {
    throw new Error(`A Overpass não concluiu a consulta: ${result.remark}`)
  }

  const listaElementos = result.elements ?? []

  let locais: Local[] = []

  for (const elemento of listaElementos) {
    const local = normalizarLocal(elemento)

    if (local !== null) {
      locais.push(local)
    }
  }

  // Lista vazia não é gravada: não vale a pena "lembrar" um resultado que provavelmente é falha.
  if (locais.length > 0) {
    definirCacheLocais(locais)
  }

  return locais
}