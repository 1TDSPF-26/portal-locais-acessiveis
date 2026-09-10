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
            className="my-4 flex flex-col items-center justify-center rounded-lg border border-[#DDEEF2] bg-[#F7F9FA] p-6 text-center"
        >
            <h2 className="mb-2 text-lg font-semibold text-[#B42318]">
                {title}
            </h2>
            <p className="max-w-md text-base text-[#B42318]">
                {message}
            </p>
            {onRetry && (
                <button
                    type="button"
                    onClick={onRetry}
                    className="mt-4 rounded-md bg-[#B42318] px-4 py-2 text-base font-semibold text-white transition-colors hover:bg-[#244A5A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#244A5A] focus-visible:ring-offset-2"
                >
                    Tentar novamente
                </button>
            )}
        </div>
    );
}