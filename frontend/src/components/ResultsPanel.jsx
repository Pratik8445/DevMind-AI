import { useState } from "react";
import ReactMarkdown from "react-markdown";

const TABS = [
  { key: "requirements", label: "PM Report",    icon: "📋", color: "#a78bfa", bg: "rgba(167,139,250,0.15)", border: "rgba(167,139,250,0.4)" },
  { key: "architecture", label: "Architecture", icon: "🏗",  color: "#34d399", bg: "rgba(52,211,153,0.12)",  border: "rgba(52,211,153,0.35)" },
  { key: "backend",      label: "Backend",      icon: "⚙️",  color: "#60a5fa", bg: "rgba(96,165,250,0.12)",  border: "rgba(96,165,250,0.35)" },
  { key: "qa",           label: "QA Report",    icon: "🧪", color: "#fb7185", bg: "rgba(251,113,133,0.12)", border: "rgba(251,113,133,0.35)" },
];

function ResultsPanel({ result }) {
  const [activeTab, setActiveTab] = useState("requirements");
  const [copied, setCopied]       = useState(false);

  if (!result) return null;

  const active = TABS.find((t) => t.key === activeTab);

  function handleCopy() {
    navigator.clipboard.writeText(result[activeTab] || "");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function handleExport() {
    const blob = new Blob([result[activeTab] || ""], { type: "text/markdown" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href     = url;
    a.download = `${activeTab}.md`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="card-dark rounded-3xl overflow-hidden mb-8">

      {/* Tab bar */}
      <div className="flex flex-wrap gap-2 p-4" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all"
            style={
              activeTab === tab.key
                ? { background: tab.bg, color: tab.color, border: `1px solid ${tab.border}` }
                : { color: "#6b7280", border: "1px solid transparent" }
            }
          >
            <span>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content header */}
      <div
        className="flex items-center justify-between px-6 py-4"
        style={{ borderBottom: `1px solid ${active.border}` }}
      >
        <h3 className="text-sm font-semibold" style={{ color: active.color }}>
          {active.icon} {active.label}
        </h3>
        <div className="flex gap-2">
          <button
            onClick={handleCopy}
            className="text-xs text-gray-500 px-3 py-1.5 rounded-lg hover:bg-white/5 hover:text-gray-300 transition border border-white/10"
          >
            {copied ? "✅ Copied!" : "📋 Copy"}
          </button>
          <button
            onClick={handleExport}
            className="text-xs text-gray-500 px-3 py-1.5 rounded-lg hover:bg-white/5 hover:text-gray-300 transition border border-white/10"
          >
            ⬇ Export
          </button>
        </div>
      </div>

      {/* Markdown */}
      <div className="p-6 sm:p-8 prose-dark prose prose-sm max-w-none">
        <ReactMarkdown>
          {result[activeTab] || "No content available."}
        </ReactMarkdown>
      </div>

    </div>
  );
}

export default ResultsPanel;
