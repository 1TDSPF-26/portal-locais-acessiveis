interface LoadingStateProps {
    message?: string;
}

export function LoadingState({
    message = 'Carregando informações. Por favor, aguarde.',
}: LoadingStateProps) {
    return (
        <div
            role="status"
            aria-live="polite"
            className="flex flex-col items-center justify-center rounded-lg border  border-cor-superficies-cards bg-cor-fundo-principal p-6 text-center"
        >
            <div
                className="mb-3 h-10 w-10 animate-spin rounded-full border-4 border-cor-botao-principal border-t-transparent"
                aria-hidden="true"
            />
            <p className="text-base font-medium text-cor-textos">
                {message}
            </p>
        </div>
    );
}