interface LoadingStateProps {
  message?: string
  variant?: 'default' | 'skeleton'
}

export function LoadingState({
  message = 'Carregando informações. Por favor, aguarde.',
  variant = 'default',
}: LoadingStateProps) {
  return (
    <section
      role="status"
      aria-live="polite"
      aria-busy="true"
      className="stack"
    >
      <p className={variant === 'skeleton' ? 'sr-only' : undefined}>
        {message}
      </p>

      {variant === 'skeleton' && (
        <div aria-hidden="true" className="stack">
          {[1, 2, 3].map((item) => (
            <article
              key={item}
              className="rounded-lg border border-cor-superficies-cards bg-cor-fundo-principal p-5"
            >
              <div className="motion-safe:animate-pulse">
                <div className="mb-4 h-6 w-2/3 rounded bg-cor-superficies-cards" />

                <div className="mb-2 h-4 w-full rounded bg-cor-superficies-cards" />

                <div className="mb-4 h-4 w-4/5 rounded bg-cor-superficies-cards" />

                <div className="flex flex-wrap gap-2">
                  <div className="h-6 w-24 rounded bg-cor-superficies-cards" />
                  <div className="h-6 w-28 rounded bg-cor-superficies-cards" />
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  )
}
