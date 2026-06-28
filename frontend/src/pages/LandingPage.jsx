import { useState } from "react";
import axios from "axios";

// Load Razorpay checkout script dynamically
function loadRazorpayScript() {
  return new Promise((resolve) => {
    if (document.getElementById("razorpay-script")) { resolve(true); return; }
    const script = document.createElement("script");
    script.id  = "razorpay-script";
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload  = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

const FEATURES = [
  {
    icon: "📋",
    title: "PM Agent",
    desc: "Converts your raw idea into structured functional requirements, user stories, and acceptance criteria — like a senior product manager.",
  },
  {
    icon: "🏗",
    title: "Architect Agent",
    desc: "Designs the full system architecture, recommends the best tech stack, defines the database schema and REST APIs.",
  },
  {
    icon: "⚙️",
    title: "Backend Agent",
    desc: "Generates a detailed backend folder structure, models, controllers, and API endpoints ready to implement.",
  },
  {
    icon: "🧪",
    title: "QA Agent",
    desc: "Produces comprehensive test cases — functional, API, edge cases, security, and performance tests.",
  },
];

const STEPS = [
  { step: "01", title: "Describe your idea", desc: "Type your startup idea in plain English. No technical knowledge needed." },
  { step: "02", title: "AI agents get to work", desc: "4 specialized agents run sequentially, each building on the previous output." },
  { step: "03", title: "Review your blueprint", desc: "Get a complete software blueprint with requirements, architecture, backend design, and QA report." },
  { step: "04", title: "Start building", desc: "Use the generated blueprint to kick off development with your team or developers." },
];

const PLANS = [
  {
    name: "Basic",
    price: "$5",
    credits: "100 credits",
    tagline: "Start now, scale as you grow.",
    features: ["Up to 20 blueprints", "All 4 AI agents", "Export to Markdown", "Email support", "Basic history"],
    cta: "Get Started",
    highlight: false,
  },
  {
    name: "Pro",
    price: "$19",
    credits: "400 credits",
    tagline: "More power for serious builders.",
    features: ["Up to 80 blueprints", "All 4 AI agents", "Export to Markdown & PDF", "Priority email support", "Full project history"],
    cta: "Get Pro",
    highlight: true,
  },
  {
    name: "Enterprise",
    price: "$49",
    credits: "1000 credits",
    tagline: "Built for teams and agencies.",
    features: ["Up to 200 blueprints", "All 4 AI agents", "Export to Markdown & PDF", "Email + chat support", "Team collaboration"],
    cta: "Get Enterprise",
    highlight: false,
  },
];

function LandingPage({ onGetStarted, onPaymentSuccess }) {
  const [idea, setIdea]             = useState("");
  const [payLoading, setPayLoading] = useState("");

  async function handleBuyNow(planKey) {
    try {
      setPayLoading(planKey);

      // 1. Load Razorpay script
      const loaded = await loadRazorpayScript();
      if (!loaded) { alert("Failed to load Razorpay. Check your internet."); return; }

      // 2. Create order on backend
      const { data } = await axios.post(
        "http://localhost:5000/api/payment/create-order",
        { plan: planKey }
      );

      // 3. Open Razorpay checkout popup
      const options = {
        key:         data.keyId,
        amount:      data.amount,
        currency:    data.currency,
        name:        "DevMind AI",
        description: data.plan + " plan",
        order_id:    data.orderId,
        theme:       { color: "#7c3aed" },

        handler: async function (response) {
          // 4. Verify payment on backend
          try {
            const verify = await axios.post(
              "http://localhost:5000/api/payment/verify",
              {
                razorpay_order_id:   response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature:  response.razorpay_signature,
                plan:    data.plan,
                credits: data.credits,
              }
            );

            if (verify.data.success) {
              // Pass credits up and go to auth/dashboard
              onPaymentSuccess(verify.data.credits);
            }
          } catch {
            alert("Payment verification failed. Contact support.");
          }
        },

        modal: {
          ondismiss: () => setPayLoading(""),
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (err) {
      alert("Payment error: " + (err?.response?.data?.error || err.message));
    } finally {
      setPayLoading("");
    }
  }

  function handleKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (idea.trim()) onGetStarted();
    }
  }

  function scrollTo(id) {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: "#080810" }}
    >

      {/* ── Navbar ── */}
      <nav
        className="sticky top-0 z-50 flex items-center justify-between px-6 sm:px-12 py-4 w-full"
        style={{
          background: "rgba(8,8,16,0.85)",
          backdropFilter: "blur(16px)",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => scrollTo("hero")}>
          <span className="text-2xl">🤖</span>
          <span className="text-white font-bold text-lg tracking-tight">DevMind AI</span>
        </div>

        <div className="hidden md:flex items-center gap-8">
          {[["features","Features"],["how-it-works","How it works"],["pricing","Pricing"]].map(([id, label]) => (
            <button
              key={id}
              onClick={() => scrollTo(id)}
              className="text-gray-400 hover:text-white text-sm font-medium transition-colors"
            >
              {label}
            </button>
          ))}
        </div>

        <button
          onClick={onGetStarted}
          className="glow-purple bg-violet-600 hover:bg-violet-500 text-white font-semibold text-sm px-5 py-2.5 rounded-xl transition-all duration-200"
        >
          Get started
        </button>
      </nav>

      {/* ── Hero ── */}
      <section
        id="hero"
        className="flex flex-col items-center justify-center text-center px-4 py-24 sm:py-32"
        style={{
          background: "radial-gradient(ellipse 90% 60% at 50% 0%, rgba(109,40,217,0.5) 0%, transparent 70%)",
        }}
      >
        <div className="flex items-center gap-2 mb-7">
          <span
            className="text-xs font-bold px-2.5 py-1 rounded-full text-white"
            style={{ background: "linear-gradient(135deg,#7c3aed,#4f46e5)" }}
          >
            NEW
          </span>
          <span className="text-gray-300 text-sm">Your idea deserves a real engineering plan</span>
          <span className="text-gray-500 text-sm">›</span>
        </div>

        <h1
          className="font-extrabold text-white leading-tight mb-6"
          style={{ fontSize: "clamp(2.4rem, 6vw, 4.5rem)", maxWidth: "820px" }}
        >
          Turn thoughts into{" "}
          <span style={{ background: "linear-gradient(90deg,#a78bfa,#818cf8,#c084fc)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            software blueprints
          </span>
          {" "}instantly, with AI
        </h1>

        <p className="text-gray-400 text-base sm:text-lg leading-relaxed mb-10" style={{ maxWidth: "560px" }}>
          What takes a team of engineers 2 weeks, our  AI builds in 30 seconds.
        </p>

        {/* Input box */}
        <div
          className="w-full rounded-2xl relative"
          style={{
            maxWidth: "640px",
            padding: "1.5px",
            background: "linear-gradient(135deg, rgba(139,92,246,0.8), rgba(79,70,229,0.6), rgba(196,132,252,0.5))",
            boxShadow: "0 0 40px rgba(139,92,246,0.25), 0 0 80px rgba(139,92,246,0.1)",
          }}
        >
          <div
            className="rounded-2xl w-full"
            style={{ background: "linear-gradient(160deg, rgba(30,20,50,0.98), rgba(15,10,30,0.98))" }}
          >
          <div className="px-6 pt-5 pb-3">
            <textarea
              rows={3}
              value={idea}
              onChange={(e) => setIdea(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Describe your startup idea…"
              className="input-box"
            />
          </div>
          <div className="flex items-center justify-between px-5 py-3 rounded-b-2xl" style={{ borderTop: "1px solid rgba(139,92,246,0.2)", background: "rgba(139,92,246,0.05)" }}>
            <span className="text-gray-600 text-xs hidden sm:block">Press Enter to submit · Shift+Enter for new line</span>
            <button
              onClick={onGetStarted}
              disabled={!idea.trim()}
              className="glow-purple flex items-center gap-2 text-white font-bold px-6 py-2.5 rounded-xl text-sm transition-all duration-200 ml-auto disabled:opacity-40"
              style={{ background: "linear-gradient(135deg,#7c3aed,#4f46e5)" }}
            >
              Generate with AI →
            </button>
          </div>
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section id="features" className="px-6 sm:px-12 py-24">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">Meet your AI team</h2>
            <p className="text-gray-500 text-base max-w-lg mx-auto">
              Like hiring 4 senior engineers — without the meetings.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {FEATURES.map((f) => (
              <div key={f.title} className="glass-card rounded-2xl p-6 flex gap-4 hover:border-violet-500/30 transition-all duration-200"
                style={{ borderColor: "rgba(255,255,255,0.08)" }}>
                <span className="text-3xl mt-0.5">{f.icon}</span>
                <div>
                  <h3 className="text-white font-bold text-base mb-2">{f.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section id="how-it-works" className="px-6 sm:px-12 py-24"
        style={{ background: "radial-gradient(ellipse 80% 40% at 50% 50%, rgba(109,40,217,0.12) 0%, transparent 70%)" }}>
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">How it works</h2>
            <p className="text-gray-500 text-base max-w-lg mx-auto">
              From idea to full blueprint in 4 simple steps.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {STEPS.map((s) => (
              <div key={s.step} className="glass-card rounded-2xl p-6">
                <div
                  className="text-xs font-extrabold mb-4 w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ background: "linear-gradient(135deg,#7c3aed,#4f46e5)", color: "#fff" }}
                >
                  {s.step}
                </div>
                <h3 className="text-white font-bold text-base mb-2">{s.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pricing ── */}
      <section id="pricing" className="px-6 sm:px-12 py-24">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">Choose your plan</h2>
            <p className="text-gray-500 text-base max-w-md mx-auto">
              Start for free and scale up as you grow. Find the perfect plan for your needs.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {PLANS.map((plan) => (
              <div
                key={plan.name}
                className="rounded-2xl p-7 flex flex-col"
                style={{
                  background: plan.highlight
                    ? "linear-gradient(160deg, rgba(109,40,217,0.3), rgba(79,70,229,0.2))"
                    : "rgba(255,255,255,0.04)",
                  border: plan.highlight
                    ? "1px solid rgba(139,92,246,0.5)"
                    : "1px solid rgba(255,255,255,0.08)",
                }}
              >
                {plan.highlight && (
                  <div className="text-xs font-bold text-violet-300 mb-3 uppercase tracking-widest">Most Popular</div>
                )}

                <h3 className="text-white font-bold text-lg mb-1">{plan.name}</h3>

                <div className="flex items-baseline gap-1 mb-1">
                  <span className="text-white font-extrabold" style={{ fontSize: "2.2rem" }}>{plan.price}</span>
                  <span className="text-gray-500 text-sm">/ {plan.credits}</span>
                </div>

                <p className="text-gray-500 text-sm mb-6">{plan.tagline}</p>

                <ul className="flex flex-col gap-2.5 mb-8 flex-1">
                  {plan.features.map((feat) => (
                    <li key={feat} className="flex items-center gap-2.5 text-gray-300 text-sm">
                      <span className="text-violet-400 font-bold">✓</span>
                      {feat}
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handleBuyNow(plan.name.toLowerCase())}
                  disabled={payLoading === plan.name.toLowerCase()}
                  className="w-full py-3 rounded-xl font-bold text-sm text-white transition-all duration-200 flex items-center justify-center gap-2"
                  style={
                    plan.highlight
                      ? { background: "linear-gradient(135deg,#7c3aed,#4f46e5)", boxShadow: "0 0 24px rgba(124,58,237,0.4)" }
                      : { background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)" }
                  }
                >
                  {payLoading === plan.name.toLowerCase() ? (
                    <>
                      <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                      Redirecting...
                    </>
                  ) : plan.cta}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer
        className="text-center py-8 text-gray-600 text-sm"
        style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
      >
        © {new Date().getFullYear()} DevMind AI · Made for builders who move fast.
      </footer>

    </div>
  );
}

export default LandingPage;
