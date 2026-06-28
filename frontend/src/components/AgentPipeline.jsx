import { useEffect, useState } from "react";

const AGENTS = [
  { icon: "📋", label: "PM Agent",        role: "Generating requirements & user stories...",       color: "text-violet-400",  activeBg: "rgba(139,92,246,0.1)",  activeBorder: "rgba(139,92,246,0.3)" },
  { icon: "🏗",  label: "Architect Agent", role: "Designing system architecture & tech stack...",  color: "text-emerald-400", activeBg: "rgba(52,211,153,0.1)",   activeBorder: "rgba(52,211,153,0.3)" },
  { icon: "⚙️",  label: "Backend Agent",   role: "Defining models, controllers & APIs...",         color: "text-blue-400",    activeBg: "rgba(96,165,250,0.1)",   activeBorder: "rgba(96,165,250,0.3)" },
  { icon: "🧪", label: "QA Agent",         role: "Writing test cases & QA report...",              color: "text-rose-400",    activeBg: "rgba(251,113,133,0.1)",  activeBorder: "rgba(251,113,133,0.3)" },
];

const STEP_DURATION = 8000;

function AgentPipeline({ loading }) {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (!loading) { setActiveIndex(0); return; }
    setActiveIndex(0);
    const timers = AGENTS.map((_, i) =>
      setTimeout(() => setActiveIndex(i), i * STEP_DURATION)
    );
    return () => timers.forEach(clearTimeout);
  }, [loading]);

  if (!loading) return null;

  return (
    <div className="card-dark rounded-3xl p-6 sm:p-8 mb-6">

      <div className="flex items-center gap-2 mb-6">
        <span className="w-2 h-2 bg-violet-500 rounded-full animate-pulse" />
        <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
          Pipeline Running
        </h2>
      </div>

      <div className="flex flex-col gap-2">
        {AGENTS.map((agent, index) => {
          const isDone    = index < activeIndex;
          const isActive  = index === activeIndex;
          const isPending = index > activeIndex;

          return (
            <div key={agent.label}>
              <div
                className="flex items-center gap-4 p-4 rounded-2xl transition-all duration-500"
                style={{
                  background: isActive ? agent.activeBg : "transparent",
                  border: `1px solid ${isActive ? agent.activeBorder : "rgba(255,255,255,0.04)"}`,
                  opacity: isPending ? 0.35 : 1,
                }}
              >
                <span className={`text-xl ${isActive ? "animate-bounce" : ""}`}>
                  {agent.icon}
                </span>

                <div className="flex-1 min-w-0">
                  <p className={`font-semibold text-sm ${isActive ? agent.color : isDone ? "text-gray-500" : "text-gray-600"}`}>
                    {agent.label}
                  </p>
                  <p className="text-xs text-gray-600 mt-0.5">
                    {isDone    ? "✅ Completed"  : ""}
                    {isActive  ? agent.role      : ""}
                    {isPending ? "Waiting..."    : ""}
                  </p>
                </div>

                {isActive && (
                  <span className={`shrink-0 text-xs font-semibold px-3 py-1 rounded-full ${agent.color}`}
                    style={{ background: agent.activeBg, border: `1px solid ${agent.activeBorder}` }}>
                    Running
                  </span>
                )}
                {isDone && (
                  <span className="shrink-0 text-xs font-semibold px-3 py-1 rounded-full text-emerald-400"
                    style={{ background: "rgba(52,211,153,0.1)", border: "1px solid rgba(52,211,153,0.3)" }}>
                    Done ✓
                  </span>
                )}
              </div>

              {index < AGENTS.length - 1 && (
                <div className="ml-6 my-0.5 w-px h-3 bg-white/5" />
              )}
            </div>
          );
        })}
      </div>

    </div>
  );
}

export default AgentPipeline;
