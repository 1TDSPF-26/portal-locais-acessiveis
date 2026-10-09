interface EmptyStateProps {
    title?: string;
    message?: string;
    actionLabel?: string;
    onAction?: () => void;
}

export function EmptyState({
    title = 'Nenhum resultado encontrado',
    message = 'Não há informações disponíveis no momento.',
    actionLabel,
    onAction,
}: EmptyStateProps) {
    return (
        <div
            role="status"
            aria-live="polite"
            className="flex flex-col items-center justify-center rounded-lg border border-cor-superficies-cards bg-cor-fundo-principal p-6 text-center"
        >
            <h2 className="mb-2 text-lg font-semibold text-cor-textos">
                {title}
            </h2>
            <p className="max-w-md text-base text-cor-textos">
                {message}
            </p>
            {actionLabel && onAction && (
                <button
                    type="button"
                    onClick={onAction}
                    className="mt-4 rounded-md bg-cor-botao-principal px-4 py-2 text-base font-semibold text-white transition-colors hover:bg-cor-botao-secundario focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cor-botao-principal focus-visible:ring-offset-2"
                >
                    {actionLabel}
                </button>
            )}
        </div>
    );
}