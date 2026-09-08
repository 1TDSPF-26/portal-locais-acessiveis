
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
            className="my-4 flex flex-col items-center justify-center rounded-lg border border-gray-200 bg-gray-50 p-6 text-center"
        >
            <h2 className="mb-2 text-lg font-semibold text-gray-900">
                {title}
            </h2>

            <p className="max-w-md text-base text-gray-700">
                {message}
            </p>

            {actionLabel && onAction && (
                <button
                    type="button"
                    onClick={onAction}
                    className="mt-4 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                    {actionLabel}
                </button>
            )}
        </div>
    );
}
