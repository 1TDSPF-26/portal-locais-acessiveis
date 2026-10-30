export function montarUrlDoLocal(
  id: number | string,
  origem: string = window.location.origin,
): string {
  return `${origem}/locais/${encodeURIComponent(String(id))}`;
}

export type ResultadoCompartilhamento =
  | 'compartilhado'
  | 'copiado'
  | 'cancelado'
  | 'erro';

export interface DadosCompartilhamento {
  title: string;
  text?: string;
  url: string;
}

function pessoaCancelou(erro: unknown): boolean {
  return (
    typeof erro === 'object' &&
    erro !== null &&
    'name' in erro &&
    erro.name === 'AbortError'
  );
}

export async function compartilharLink(
  dados: DadosCompartilhamento,
): Promise<ResultadoCompartilhamento> {
  if (typeof navigator.share === 'function') {
    try {
      await navigator.share(dados);
      return 'compartilhado';
    } catch (erro) {
      if (pessoaCancelou(erro)) {
        return 'cancelado';
      }
    }
  }

  try {
    await navigator.clipboard.writeText(dados.url);
    return 'copiado';
  } catch {
    return 'erro';
  }
}