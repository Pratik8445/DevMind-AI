import { useState } from "react";
import { register, login } from "../api/auth.js";

function AuthPage({ onLogin, onBack }) {
  const [isLogin, setIsLogin]   = useState(true);
  const [name, setName]         = useState("");
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!email || !password)    { setError("Please fill in all fields."); return; }
    if (!isLogin && !name)      { setError("Please enter your name."); return; }
    if (password.length < 6)    { setError("Password must be at least 6 characters."); return; }

    try {
      setLoading(true);
      const data = isLogin
        ? await login(email, password)
        : await register(name, email, password);

      // Save token to localStorage so it persists on refresh
      localStorage.setItem("token", data.token);

      onLogin(data.user, data.token);

    } catch (err) {
      setError(err?.response?.data?.error || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4"
      style={{
        background: "radial-gradient(ellipse 80% 50% at 50% 0%, rgba(109,40,217,0.4) 0%, rgba(8,8,16,1) 65%)",
      }}
    >
      <button
        onClick={onBack}
        className="absolute top-6 left-6 text-gray-500 hover:text-white text-sm transition flex items-center gap-1"
      >
        ← Back
      </button>

      <div className="w-full" style={{ maxWidth: "420px" }}>

        <div className="text-center mb-8">
          <span className="text-4xl">🤖</span>
          <h2 className="text-white font-extrabold text-2xl mt-3">DevMind AI</h2>
          <p className="text-gray-500 text-sm mt-1">
            {isLogin ? "Welcome back — sign in to continue" : "Create your free account"}
          </p>
        </div>

        <div className="glass-card rounded-3xl p-8">

          {/* Toggle */}
          <div className="flex p-1 rounded-2xl mb-7" style={{ background: "rgba(255,255,255,0.04)" }}>
            {["Sign In", "Sign Up"].map((label, i) => {
              const active = isLogin ? i === 0 : i === 1;
              return (
                <button
                  key={label}
                  onClick={() => { setIsLogin(i === 0); setError(""); }}
                  className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all"
                  style={active ? { background: "linear-gradient(135deg,#7c3aed,#4f46e5)", color: "#fff" } : { color: "#6b7280" }}
                >
                  {label}
                </button>
              );
            })}
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">

            {!isLogin && (
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wider">Full Name</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe" className="dark-input w-full rounded-xl px-4 py-3 text-sm" />
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wider">Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com" className="dark-input w-full rounded-xl px-4 py-3 text-sm" />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wider">Password</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••" className="dark-input w-full rounded-xl px-4 py-3 text-sm" />
            </div>

            {error && (
              <p className="text-rose-400 text-xs text-center bg-rose-400/10 py-2 px-3 rounded-xl border border-rose-400/20">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="glow-purple mt-1 w-full text-white font-bold py-3.5 rounded-xl text-sm transition-all flex items-center justify-center gap-2"
              style={{ background: "linear-gradient(135deg,#7c3aed,#4f46e5)" }}
            >
              {loading ? (
                <><span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" /> Please wait...</>
              ) : (
                isLogin ? "Sign In →" : "Create Account →"
              )}
            </button>

          </form>
        </div>
      </div>
    </div>
  );
}

export default AuthPage;
