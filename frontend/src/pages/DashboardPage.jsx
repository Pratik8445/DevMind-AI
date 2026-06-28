import { useState, useEffect } from "react";
import { generateProject as apiGenerate, getHistory, getProject } from "../api/projects.js";
import AgentPipeline from "../components/AgentPipeline.jsx";
import ResultsPanel  from "../components/ResultsPanel.jsx";
import ErrorCard     from "../components/ErrorCard.jsx";

const GENERATION_COST = 5;

function DashboardPage({ user: initialUser, token, onLogout, onGoToPricing }) {
  const [idea, setIdea]       = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult]   = useState(null);
  const [error, setError]     = useState(null);
  const [credits, setCredits] = useState(initialUser?.credits || 0);
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(false);

  // Load history when panel opens
  useEffect(() => {
    if (!showHistory) return;
    setHistoryLoading(true);
    getHistory(token)
      .then(setHistory)
      .catch(() => {})
      .finally(() => setHistoryLoading(false));
  }, [showHistory, token]);

  async function handleGenerate() {
    if (!idea.trim()) return;
    try {
      setLoading(true);
      setResult(null);
      setError(null);
      const data = await apiGenerate(idea, token);
      setResult(data);
      // Update credits from server response isn't returned, so deduct locally
      setCredits((c) => c - GENERATION_COST);
    } catch (err) {
      setError(err?.response?.data?.error || err.message || "Unknown error.");
    } finally {
      setLoading(false);
    }
  }

  async function loadHistoryProject(id) {
    try {
      const project = await getProject(id, token);
      setResult({
        requirements: project.requirements,
        architecture: project.architecture,
        backend:      project.backend,
        qa:           project.qa,
      });
      setIdea(project.idea);
      setShowHistory(false);
    } catch {
      setError("Failed to load project.");
    }
  }

  function handleKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleGenerate(); }
  }

  return (
    <div className="min-h-screen flex flex-col"
      style={{ background: "radial-gradient(ellipse 80% 50% at 50% -5%, rgba(109,40,217,0.4) 0%, rgba(8,8,16,1) 60%)" }}>

      {/* Navbar */}
      <nav className="flex items-center justify-between px-6 sm:px-10 py-4 w-full"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="flex items-center gap-2.5">
          <span className="text-xl">🤖</span>
          <span className="text-white font-bold text-base tracking-tight">DevMind AI</span>
        </div>
        <div className="flex items-center gap-3">
          {/* Credits */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold"
            style={{
              background: credits > 0 ? "rgba(167,139,250,0.1)" : "rgba(251,113,133,0.1)",
              border: `1px solid ${credits > 0 ? "rgba(167,139,250,0.25)" : "rgba(251,113,133,0.25)"}`,
              color: credits > 0 ? "#a78bfa" : "#fb7185",
            }}>
            ⚡ {credits} credits
          </div>
          {/* History */}
          <button onClick={() => setShowHistory(!showHistory)}
            className="text-xs text-gray-400 border px-3 py-1.5 rounded-lg hover:text-white transition hidden sm:block"
            style={{ borderColor: "rgba(255,255,255,0.1)" }}>
            📁 History
          </button>
          <span className="text-gray-500 text-sm hidden sm:block">👋 {initialUser?.name}</span>
          <button onClick={onLogout}
            className="text-xs text-gray-500 border px-3 py-1.5 rounded-lg hover:text-white transition"
            style={{ borderColor: "rgba(255,255,255,0.1)" }}>
            Sign out
          </button>
        </div>
      </nav>

      <div className="flex flex-1">

        {/* History sidebar */}
        {showHistory && (
          <aside className="w-72 shrink-0 border-r p-4 overflow-y-auto"
            style={{ borderColor: "rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.02)" }}>
            <h3 className="text-white font-bold text-sm mb-4">📁 Past Projects</h3>
            {historyLoading ? (
              <p className="text-gray-500 text-xs">Loading...</p>
            ) : history.length === 0 ? (
              <p className="text-gray-500 text-xs">No projects yet.</p>
            ) : (
              <div className="flex flex-col gap-2">
                {history.map((p) => (
                  <button key={p._id} onClick={() => loadHistoryProject(p._id)}
                    className="text-left p-3 rounded-xl hover:bg-white/5 transition"
                    style={{ border: "1px solid rgba(255,255,255,0.06)" }}>
                    <p className="text-gray-300 text-xs font-medium truncate">{p.idea}</p>
                    <p className="text-gray-600 text-xs mt-1">
                      {new Date(p.createdAt).toLocaleDateString()}
                    </p>
                  </button>
                ))}
              </div>
            )}
          </aside>
        )}

        {/* Main content */}
        <main className="flex-1 flex flex-col items-center px-4 pt-12 pb-20">

          <div className="flex items-center gap-2 mb-6">
            <span className="text-xs font-bold px-2.5 py-1 rounded-full text-white"
              style={{ background: "linear-gradient(135deg,#7c3aed,#4f46e5)" }}>NEW</span>
            <span className="text-gray-400 text-sm"> AI agents - {GENERATION_COST} credits per generation</span>
          </div>

          <h1 className="font-extrabold text-white text-center leading-tight mb-4"
            style={{ fontSize: "clamp(2rem,5vw,3.8rem)", maxWidth: "700px" }}>
            What are you{" "}
            <span style={{ background: "linear-gradient(90deg,#a78bfa,#818cf8,#c084fc)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              building today?
            </span>
          </h1>

          <p className="text-gray-500 text-base text-center mb-10" style={{ maxWidth: "500px" }}>
            Describe your idea and get a full software blueprint in seconds.
          </p>

          {/* Input */}
          <div
            className="w-full rounded-2xl relative"
            style={{
              maxWidth: "660px",
              padding: "1.5px",
              background: "linear-gradient(135deg, rgba(139,92,246,0.8), rgba(79,70,229,0.6), rgba(196,132,252,0.5))",
              boxShadow: "0 0 40px rgba(139,92,246,0.25), 0 0 80px rgba(139,92,246,0.1)",
            }}
          >
            <div
              className="rounded-2xl w-full"
              style={{ background: "linear-gradient(160deg, rgba(30,20,50,0.98), rgba(15,10,30,0.98))" }}
            >
              <div className="px-6 pt-6 pb-3">
                <textarea
                  rows={4}
                  value={idea}
                  onChange={(e) => setIdea(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Describe your startup idea…"
                  className="input-box w-full text-sm"
                  style={{ fontSize: "0.95rem", lineHeight: "1.8", color: "#e5e7eb" }}
                />
              </div>
              <div
                className="flex items-center justify-between px-5 py-3 rounded-b-2xl"
                style={{ borderTop: "1px solid rgba(139,92,246,0.25)", background: "rgba(139,92,246,0.05)" }}
              >
                <div className="flex items-center gap-2">
                  <span className="text-violet-400 text-xs">⚡</span>
                  <span className="text-gray-400 text-xs font-medium">{GENERATION_COST} credits per generation</span>
                </div>
                <button
                  onClick={handleGenerate}
                  disabled={loading || !idea.trim() || credits < GENERATION_COST}
                  className="flex items-center gap-2 text-white font-bold px-7 py-2.5 rounded-xl text-sm transition-all disabled:opacity-40"
                  style={{
                    background: "linear-gradient(135deg,#7c3aed,#4f46e5)",
                    boxShadow: loading || !idea.trim() ? "none" : "0 0 20px rgba(124,58,237,0.5)",
                  }}
                >
                  {loading ? (
                    <><span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />Generating...</>
                  ) : "Generate with AI →"}
                </button>
              </div>
            </div>
          </div>

          {/* Out of credits */}
          {credits < GENERATION_COST && !loading && (
            <div className="w-full mt-4 rounded-2xl p-4 flex items-center justify-between gap-4"
              style={{ maxWidth: "660px", background: "rgba(251,113,133,0.08)", border: "1px solid rgba(251,113,133,0.2)" }}>
              <p className="text-rose-400 text-sm">You're out of credits. Buy more to continue.</p>
              <button onClick={onGoToPricing}
                className="shrink-0 text-xs font-bold text-white px-4 py-2 rounded-xl"
                style={{ background: "linear-gradient(135deg,#7c3aed,#4f46e5)" }}>
                Buy credits →
              </button>
            </div>
          )}

          <div className="w-full mt-6" style={{ maxWidth: "660px" }}>
            <AgentPipeline loading={loading} />
            {error && <ErrorCard message={error} onRetry={handleGenerate} />}
            <ResultsPanel result={result} />
          </div>

        </main>
      </div>
    </div>
  );
}

export default DashboardPage;
