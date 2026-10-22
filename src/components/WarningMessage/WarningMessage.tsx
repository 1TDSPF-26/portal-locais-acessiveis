interface WarningMessageProps {
    title?: string;
    message?: string;
}

export function WarningMessage({
    title,
    message = 'Algumas informações podem estar incompletas ou desatualizadas.',
}: WarningMessageProps) {
    return (
        <div
            role="status"
            aria-live="polite"
            className="rounded-lg border border-cor-apoio bg-cor-fundo-principal p-4"
        >
            <p className="mb-1 text-sm font-bold uppercase text-cor-textos">
                Aviso
            </p>
            {title && (
                <h2 className="mb-2 text-lg font-semibold text-cor-titulos">
                    {title}
                </h2>
            )}
            <p className="text-base text-cor-textos">
                {message}
            </p>
        </div>
    );
}