
import { FONTES_DADOS } from '../constants/fontesDados'
import type { OrigemDados } from '../constants/fontesDados'

interface OrigemLocalProps {
    origem?: OrigemDados
}

export function OrigemLocal({ origem }: OrigemLocalProps) {
    if (!origem) {
        return <p>Fonte dos dados: não informada</p>
    }

    const fonte = FONTES_DADOS[origem]

    return (
        <p>
            Fonte dos dados:{' '}
            <a href={fonte.url} target="_blank" rel="noopener noreferrer">
                {fonte.nome}
            </a>
        </p>
    )
}
