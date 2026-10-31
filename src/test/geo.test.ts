import { describe, it, expect } from 'vitest'
import { calcularDistancia } from '../utils/geo'

describe('Testes de Integração - Geolocalização e Proximidade', () => {
  it('deve calcular a distância corretamente entre dois pontos geográficos', () => {
    const distancia = calcularDistancia(-23.55, -46.63, -23.56, -46.64)
    expect(distancia).toBeGreaterThan(0)
  })

  it('deve ordenar a listagem por proximidade preservando o cálculo correto das distâncias', () => {
    const userLoc = { lat: -23.55, lon: -46.63 }
    const locais = [
      { id: 1, nome: 'Local Distante', coordenadas: { latitude: -23.60, longitude: -46.70 } },
      { id: 2, nome: 'Local Próximo', coordenadas: { latitude: -23.551, longitude: -46.631 } }
    ]

    const processados = locais.map(l => ({
      ...l,
      distancia: calcularDistancia(userLoc.lat, userLoc.lon, l.coordenadas.latitude, l.coordenadas.longitude)
    })).sort((a, b) => a.distancia - b.distancia)

    expect(processados[0].id).toBe(2)
    expect(processados[1].id).toBe(1)
  })
})