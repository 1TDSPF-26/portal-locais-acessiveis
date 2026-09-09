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
            className="my-4 flex flex-col items-center justify-center rounded-lg border border-[#DDEEF2] bg-[#F7F9FA] p-6 text-center"
        >
            <h2 className="mb-2 text-lg font-semibold text-[#172A3A]">
                {title}
            </h2>
            <p className="max-w-md text-base text-[#465268]">
                {message}
            </p>
            {actionLabel && onAction && (
                <button
                    type="button"
                    onClick={onAction}
                    className="mt-4 rounded-md bg-[#216FCE] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#244A5A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#64CCC5] focus-visible:ring-offset-2"
                >
                    {actionLabel}
                </button>
            )}
        </div>
    );
}