import { useState, useEffect } from "react";
import LandingPage   from "./pages/LandingPage.jsx";
import AuthPage      from "./pages/AuthPage.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";
import { getMe }     from "./api/auth.js";

function App() {
  const [page, setPage]   = useState("landing");
  const [user, setUser]   = useState(null);
  const [token, setToken] = useState(null);
  const [checking, setChecking] = useState(true); // checking saved login

  // On app load — check if user already has a saved token
  useEffect(() => {
    const saved = localStorage.getItem("token");
    if (!saved) { setChecking(false); return; }

    getMe(saved)
      .then((userData) => {
        setUser(userData);
        setToken(saved);
        setPage("dashboard");
      })
      .catch(() => {
        localStorage.removeItem("token"); // token expired
      })
      .finally(() => setChecking(false));
  }, []);

  function handleLogin(userData, jwt) {
    setUser(userData);
    setToken(jwt);
    localStorage.setItem("token", jwt);
    setPage("dashboard");
  }

  function handleLogout() {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
    setPage("landing");
  }

  function handlePaymentSuccess(newCredits) {
    setUser((prev) => ({ ...prev, credits: newCredits }));
    setPage(user ? "dashboard" : "auth");
  }

  // Show nothing while checking saved session
  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#080810" }}>
        <span className="animate-spin h-8 w-8 border-2 border-violet-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (page === "landing") {
    return (
      <LandingPage
        onGetStarted={() => setPage("auth")}
        onPaymentSuccess={handlePaymentSuccess}
      />
    );
  }

  if (page === "auth") {
    return <AuthPage onLogin={handleLogin} onBack={() => setPage("landing")} />;
  }

  return (
    <DashboardPage
      user={user}
      token={token}
      onLogout={handleLogout}
      onGoToPricing={() => setPage("landing")}
    />
  );
}

export default App;
