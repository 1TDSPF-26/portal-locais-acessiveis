export function montarUrlDoLocal(
  id: number | string,
  origem: string = window.location.origin,
): string {
  return `${origem}/locais/${encodeURIComponent(String(id))}`;
}