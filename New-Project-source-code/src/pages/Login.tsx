import { useState, type FormEvent } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { APP_NAME } from "../constants/config";

export default function Login() {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const from =
    (location.state as { from?: { pathname: string } })?.from?.pathname || "/home";

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!email.trim() || !password) {
      setError("Please enter both email and password.");
      return;
    }
    setLoading(true);
    const { error: signInError } = await signIn(email, password);
    setLoading(false);
    if (signInError) {
      setError(
        signInError.includes("Invalid login")
          ? "Invalid email or password. Please try again."
          : signInError
      );
    } else {
      navigate(from, { replace: true });
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex" style={{ background: "#0F172A" }}>
      {/* ── Left panel: brand art ── */}
      <div
        className="hidden lg:flex flex-1 flex-col justify-between p-12 relative overflow-hidden dot-grid-bg"
        style={{ background: "linear-gradient(160deg, #080F1E 0%, #0C1729 100%)" }}
      >
        {/* Glow orbs */}
        <div
          className="absolute top-1/4 left-1/4 w-80 h-80 rounded-full pointer-events-none"
          style={{ background: "radial-gradient(ellipse, rgba(59,130,246,0.18) 0%, transparent 70%)", filter: "blur(50px)" }}
        />
        <div
          className="absolute bottom-1/4 right-1/4 w-60 h-60 rounded-full pointer-events-none"
          style={{ background: "radial-gradient(ellipse, rgba(99,102,241,0.15) 0%, transparent 70%)", filter: "blur(50px)" }}
        />

        {/* Logo */}
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #3B82F6, #6366F1)" }}
          >
            <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M2 12s3-4 6-4 6 4 6 4 3-4 6-4" />
              <path d="M2 17s3-4 6-4 6 4 6 4 3-4 6-4" />
            </svg>
          </div>
          <span className="text-xl font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "#F1F5F9" }}>{APP_NAME}</span>
        </div>

        {/* Center text */}
        <div>
          <h2
            className="text-4xl font-bold leading-tight mb-4"
            style={{ fontFamily: "'Space Grotesk', sans-serif", background: "linear-gradient(135deg, #F1F5F9 30%, #60A5FA 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}
          >
            Detect Floods.<br />Save Lives.
          </h2>
          <p className="text-base leading-relaxed" style={{ color: "#64748B" }}>
            AI-powered flood damage assessment for disaster response teams and humanitarian organizations.
          </p>

          {/* Feature pills */}
          <div className="mt-8 flex flex-col gap-3">
            {["< 30 second analysis", "AI flood segmentation", "Shareable PDF reports"].map((f) => (
              <div key={f} className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ background: "rgba(59,130,246,0.15)", border: "1px solid rgba(59,130,246,0.3)" }}>
                  <svg className="w-2.5 h-2.5" viewBox="0 0 24 24" fill="none" stroke="#60A5FA" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-sm" style={{ color: "#94A3B8" }}>{f}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="text-xs" style={{ color: "#334155" }}>Built for disaster response teams.</p>
      </div>

      {/* ── Right panel: form ── */}
      <div className="flex flex-1 items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          {/* Mobile logo */}
          <div className="flex lg:hidden items-center justify-center gap-2 mb-8">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, #3B82F6, #6366F1)" }}
            >
              <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M2 12s3-4 6-4 6 4 6 4 3-4 6-4" />
              </svg>
            </div>
            <span className="text-lg font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{APP_NAME}</span>
          </div>

          <h1
            className="text-2xl sm:text-3xl font-bold mb-1"
            style={{ fontFamily: "'Space Grotesk', sans-serif", color: "#F1F5F9" }}
          >
            Welcome back
          </h1>
          <p className="text-sm mb-8" style={{ color: "#64748B" }}>
            Log in to your {APP_NAME} account
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div
                className="p-3.5 rounded-xl text-sm flex items-start gap-2.5"
                role="alert"
                style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", color: "#FCA5A5" }}
              >
                <svg className="w-4 h-4 flex-shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                {error}
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1.5" style={{ color: "#94A3B8" }}>
                Email
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-dark w-full px-4 py-3 text-sm"
                placeholder="you@example.com"
                disabled={loading}
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="password" className="block text-sm font-medium" style={{ color: "#94A3B8" }}>
                  Password
                </label>
                <Link
                  to="/forgot-password"
                  className="text-xs font-medium transition-colors cursor-pointer"
                  style={{ color: "#3B82F6" }}
                >
                  Forgot password?
                </Link>
              </div>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-dark w-full px-4 py-3 text-sm"
                placeholder="••••••••"
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3 text-sm mt-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Logging in…
                </span>
              ) : "Log In"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm" style={{ color: "#64748B" }}>
            Don't have an account?{" "}
            <Link to="/signup" className="font-medium transition-colors cursor-pointer" style={{ color: "#60A5FA" }}>
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
