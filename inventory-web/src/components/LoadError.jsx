/** Inline error box for a failed load, with an optional retry button. */
export default function LoadError({
  title = "Couldn't load data",
  message,
  onRetry,
}) {
  return (
    <div
      role="alert"
      className="mx-auto max-w-2xl rounded-2xl border border-rose-500/40 bg-rose-950/40 px-6 py-8 text-center"
    >
      <p className="m-0 text-lg font-semibold text-rose-200">{title}</p>
      {message && <p className="mt-2 text-rose-300/80">{message}</p>}
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-5 rounded-lg border border-rose-400/50 px-4 py-2 font-semibold text-rose-100 transition hover:bg-rose-500/20"
        >
          Try again
        </button>
      )}
    </div>
  );
}
