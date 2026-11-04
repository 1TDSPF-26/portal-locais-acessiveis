import { useEffect, useState } from 'react'

type CompartilharEnderecoProps = {
    endereco: string
    nomeLocal: string
}

const classeBotao =
    'mt-2 inline-block rounded-md border border-cor-apoio px-3 py-1 font-semibold text-cor-botao-principal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cor-apoio focus-visible:ring-offset-2'

export function CompartilharEndereco({
    endereco,
    nomeLocal,
}: CompartilharEnderecoProps) {
    const [mensagem, setMensagem] = useState('')

    const temShareNativo =
        typeof navigator !== 'undefined' && typeof navigator.share === 'function'

    useEffect(() => {
        if (!mensagem) return

        const timer = setTimeout(() => setMensagem(''), 4000)
        return () => clearTimeout(timer)
    }, [mensagem])

    async function copiar() {
        try {
            await navigator.clipboard.writeText(endereco)
            setMensagem('Endereço copiado para a área de transferência.')
        } catch {
            setMensagem('Não foi possível copiar o endereço.')
        }
    }

    async function handleClick() {
        if (!temShareNativo) {
            await copiar()
            return
        }

        try {
            await navigator.share({ title: nomeLocal, text: endereco })
            setMensagem('Endereço compartilhado.')
        } catch (erro) {
            if (erro instanceof DOMException && erro.name === 'AbortError') {
                return
            }
            await copiar()
        }
    }

    return (
        <div>
            <button type="button" onClick={handleClick} className={classeBotao}>
                {temShareNativo ? 'Compartilhar endereço' : 'Copiar endereço'}
            </button>

            <p role="status" aria-live="polite" className="mt-1 text-sm">
                {mensagem}
            </p>
        </div>
    )
}