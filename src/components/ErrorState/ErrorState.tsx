interface ErrorStateProps {
    title?: string;
    message?: string;
    onRetry?: () => void;
}

export function ErrorState({
    title = 'Não foi possível carregar as informações',
    message = 'Ocorreu um problema ao carregar os dados. Tente novamente.',
    onRetry,
}: ErrorStateProps) {
    return (
        <div
            role="alert"
            aria-live="assertive"
            className="flex flex-col items-center justify-center rounded-lg border border-cor-superficies-cards bg-cor-fundo-principal p-6 text-center"
        >
            <h2 className="mb-2 text-lg font-semibold text-cor-erro">
                {title}
            </h2>
            <p className="max-w-md text-base text-cor-erro">
                {message}
            </p>
            {onRetry && (
                <button
                    type="button"
                    onClick={onRetry}
                    className="mt-4 rounded-md bg-cor-erro px-4 py-2 text-base font-semibold text-cor-fundo-principal transition-colors hover:bg-cor-botao-secundario focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cor-foco-interativos focus-visible:ring-offset-2"
                >
                    Tentar novamente
                </button>
            )}
        </div>
    );
}