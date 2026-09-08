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
            className="my-4 flex flex-col items-center justify-center rounded-lg border border-red-200 bg-red-50 p-6 text-center"
        >
            <h2 className="mb-2 text-lg font-semibold text-red-900">
                {title}
            </h2>

            <p className="max-w-md text-base text-red-800">
                {message}
            </p>

            {onRetry && (
                <button
                    type="button"
                    onClick={onRetry}
                    className="mt-4 rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                >
                    Tentar novamente
                </button>
            )}
        </div>
    );
}