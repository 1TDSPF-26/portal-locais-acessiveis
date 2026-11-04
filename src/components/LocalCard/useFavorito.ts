import { useState } from 'react'

import { atualizarFavorito, lerFavoritos } from '../../services/favoritosStorage'

export function useFavorito(id: number) {
  const [favorito, setFavorito] = useState(() => lerFavoritos().includes(id))

  function alternarFavorito() {
    const novoValor = !favorito

    atualizarFavorito(id, novoValor)
    setFavorito(novoValor)
  }

  return { favorito, alternarFavorito }
}
