import { useCallback, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'

import {
  escreverContextoListagem,
  lerContextoListagem,
  type ContextoListagem,
} from '../../../utils/criteriosListagem'

/**
 * Busca, filtros, ordenação e página vivem na query string de /locais.
 * A URL é a única fonte de verdade: ela sobrevive à navegação para o detalhe,
 * ao botão Voltar do navegador e pode ser compartilhada.
 * Usa `replace` para que cada tecla digitada não gere uma entrada no histórico.
 */
export function useContextoListagem() {
  const [params, setParams] = useSearchParams()
  const contexto = useMemo(() => lerContextoListagem(params), [params])

  const atualizar = useCallback(
    (alteracoes: Partial<ContextoListagem>) => {
      setParams((atuais) => escreverContextoListagem(atuais, alteracoes), { replace: true })
    },
    [setParams],
  )

  const limpar = useCallback(() => {
    setParams(new URLSearchParams(), { replace: true })
  }, [setParams])

  return { contexto, atualizar, limpar }
}
