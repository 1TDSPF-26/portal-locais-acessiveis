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
            className="my-4 flex flex-col items-center justify-center rounded-lg border border-[#DDEEF2] bg-[#F7F9FA] p-6 text-center"
        >
            <div
                className="mb-3 h-10 w-10 animate-spin rounded-full border-4 border-[#216FCE] border-t-transparent"
                aria-hidden="true"
            />
            <p className="text-base font-medium text-[#465268]">
                {message}
            </p>
        </div>
    );
}