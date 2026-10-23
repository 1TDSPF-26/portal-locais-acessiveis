import { describe, it, expect } from 'vitest'
import { calcularDistancia } from '../utils/geo'

describe('Testes de Geolocalização e Distância', () => {
  it('deve calcular a distância corretamente entre dois pontos', () => {
    const distancia = calcularDistancia(-23.55, -46.63, -23.56, -46.64)
    expect(distancia).toBeGreaterThan(0)
  })

  it('deve ordenar os locais do mais próximo para o mais distante', () => {
    const userLoc = { lat: 0, lon: 0 }
    const locais = [
      { id: 1, nome: 'Local C', latitude: 0, longitude: 10 },
      { id: 2, nome: 'Local A', latitude: 0, longitude: 2 },
      { id: 3, nome: 'Local B', latitude: 0, longitude: 5 }
    ]

    const processados = locais.map(l => ({
      ...l,
      distancia: calcularDistancia(userLoc.lat, userLoc.lon, l.latitude, l.longitude)
    })).sort((a, b) => a.distancia - b.distancia)

    expect(processados[0].nome).toBe('Local A')
    expect(processados[1].nome).toBe('Local B')
    expect(processados[2].nome).toBe('Local C')
  })
})