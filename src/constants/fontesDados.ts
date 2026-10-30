
export const FONTES_DADOS = {
    openstreetmap: {
        nome: 'OpenStreetMap',
        url: 'https://www.openstreetmap.org/copyright',
    },
} as const

export type OrigemDados = keyof typeof FONTES_DADOS
