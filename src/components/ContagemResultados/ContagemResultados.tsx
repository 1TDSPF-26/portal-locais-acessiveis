interface ContagemResultadosProps {
    total: number;
}

// Mensagem curta: fala apenas do total, nunca da página atual.
// Assim o aria-live não repete o anúncio a cada troca de página.
function montarMensagem(total: number) {
    if (total === 0) {
        return 'Nenhum local encontrado';
    }

    if (total === 1) {
        return '1 local encontrado';
    }

    return `${total} locais encontrados`;
}

export function ContagemResultados({ total }: ContagemResultadosProps) {
    return (
        <p
            role="status"
            aria-live="polite"
            className="text-base text-cor-textos"
        >
            {montarMensagem(total)}
        </p>
    );
}
