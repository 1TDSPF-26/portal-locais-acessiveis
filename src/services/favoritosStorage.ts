// Chave própria para não sobrescrever outros dados
export const CHAVE_FAVORITOS = 'locais_favoritos'

export function lerFavoritos(): number[] {
  try {
    const salvos = localStorage.getItem(CHAVE_FAVORITOS)

    if (!salvos) {
      return []
    }

    const dados: unknown = JSON.parse(salvos)

    if (!Array.isArray(dados)) {
      return []
    }

    return dados.filter((id): id is number => Number.isInteger(id))
  } catch {
    return []
  }
}

export function atualizarFavorito(id: number, favorito: boolean) {
  const atuais = lerFavoritos().filter((idSalvo) => idSalvo !== id)
  const favoritos = favorito ? [...atuais, id] : atuais

  try {
    localStorage.setItem(CHAVE_FAVORITOS, JSON.stringify(favoritos))
  } catch {
    // Segue funcionando sem salvar
  }
}
