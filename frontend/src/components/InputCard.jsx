const EXAMPLE_IDEA =
  "Build a food delivery app with user registration, restaurant listings, menu browsing, cart, payment integration, and real-time order tracking.";

function InputCard({ idea, setIdea, onGenerate, loading }) {
  return (
    <div className="card-dark rounded-3xl p-6 sm:p-8 mb-6">

      <label className="block text-xs font-semibold text-gray-400 mb-3 uppercase tracking-wider">
        💡 Your Startup Idea
      </label>

      <textarea
        rows={5}
        value={idea}
        onChange={(e) => setIdea(e.target.value)}
        placeholder='e.g. "Build a travel booking platform with hotel search, flight booking, and itinerary management..."'
        className="input-dark w-full rounded-2xl p-4 text-sm resize-none transition"
      />

      <div className="flex items-center justify-between mt-5 flex-wrap gap-3">

        <button
          onClick={() => setIdea(EXAMPLE_IDEA)}
          className="text-sm text-gray-500 border border-white/10 px-4 py-2.5 rounded-xl hover:bg-white/5 hover:text-gray-300 transition flex items-center gap-2"
        >
          🎲 Try an Example
        </button>

        <button
          onClick={onGenerate}
          disabled={loading || !idea.trim()}
          className="glow-btn flex items-center gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 disabled:from-violet-900 disabled:to-indigo-900 disabled:opacity-50 text-white font-bold px-8 py-3 rounded-xl transition-all text-sm"
        >
          {loading ? (
            <>
              <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
              Generating...
            </>
          ) : (
            <>▶ Generate Project</>
          )}
        </button>

      </div>
    </div>
  );
}

export default InputCard;
