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
            className="my-4 flex flex-col items-center justify-center rounded-lg border border-gray-200 bg-gray-50 p-6 text-center"
        >
            <div
                className="mb-3 h-10 w-10 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"
                aria-hidden="true"
            />

            <p className="text-base font-medium text-gray-800">
                {message}
            </p>
        </div>
    );
}