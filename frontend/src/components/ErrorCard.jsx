function ErrorCard({ message, onRetry }) {
  return (
    <div
      className="rounded-3xl p-6 mb-6 flex items-start gap-4"
      style={{ background: "rgba(251,113,133,0.08)", border: "1px solid rgba(251,113,133,0.25)" }}
    >
      <div
        className="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 text-lg"
        style={{ background: "rgba(251,113,133,0.15)" }}
      >
        ❌
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-rose-400 mb-1">Something went wrong</p>
        <p className="text-sm text-rose-500/70 break-words">{message}</p>
      </div>
      <button
        onClick={onRetry}
        className="shrink-0 text-sm font-semibold text-rose-400 px-4 py-2 rounded-xl hover:bg-rose-400/10 transition border border-rose-400/30"
      >
        🔄 Retry
      </button>
    </div>
  );
}

export default ErrorCard;
