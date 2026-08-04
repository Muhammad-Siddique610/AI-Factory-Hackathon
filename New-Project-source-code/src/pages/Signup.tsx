import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { APP_NAME } from "../constants/config";

export default function Signup() {
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!name.trim()) { setError("Please enter your full name."); return; }
    if (!email.trim()) { setError("Please enter your email address."); return; }
    if (!password || password.length < 6) { setError("Password must be at least 6 characters."); return; }

    setLoading(true);
    const { error: signUpError } = await signUp(name, email, password);
    setLoading(false);

    if (signUpError) {
      setError(
        signUpError.includes("already registered") || signUpError.includes("already exists")
          ? "An account with this email already exists. Try logging in instead."
          : signUpError
      );
    } else {
      navigate("/home");
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex" style={{ background: "#0F172A" }}>
      {/* ── Left panel ── */}
      <div
        className="hidden lg:flex flex-1 flex-col justify-between p-12 relative overflow-hidden dot-grid-bg"
        style={{ background: "linear-gradient(160deg, #080F1E 0%, #0C1729 100%)" }}
      >
        <div
          className="absolute top-1/3 left-1/3 w-96 h-96 rounded-full pointer-events-none"
          style={{ background: "radial-gradient(ellipse, rgba(99,102,241,0.18) 0%, transparent 70%)", filter: "blur(50px)" }}
        />

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "linear-gradient(135deg, #3B82F6, #6366F1)" }}>
            <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M2 12s3-4 6-4 6 4 6 4 3-4 6-4" />
              <path d="M2 17s3-4 6-4 6 4 6 4 3-4 6-4" />
            </svg>
          </div>
          <span className="text-xl font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "#F1F5F9" }}>{APP_NAME}</span>
        </div>

        <div>
          <h2
            className="text-4xl font-bold leading-tight mb-4"
            style={{ fontFamily: "'Space Grotesk', sans-serif", background: "linear-gradient(135deg, #F1F5F9 30%, #60A5FA 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}
          >
            Join the mission.<br />Protect communities.
          </h2>
          <p className="text-base leading-relaxed" style={{ color: "#64748B" }}>
            Create your account and start analyzing flood imagery with cutting-edge AI.
          </p>

          <div className="mt-8 glass-card p-5 space-y-3">
            <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#3B82F6" }}>Free account includes</p>
            {["Unlimited image uploads", "AI flood segmentation analysis", "Before & after comparison slider", "PDF report generation", "Public shareable links"].map((f) => (
              <div key={f} className="flex items-center gap-3">
                <div className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ background: "rgba(59,130,246,0.15)", border: "1px solid rgba(59,130,246,0.3)" }}>
                  <svg className="w-2 h-2" viewBox="0 0 24 24" fill="none" stroke="#60A5FA" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
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
          <div className="flex lg:hidden items-center justify-center gap-2 mb-8">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "linear-gradient(135deg, #3B82F6, #6366F1)" }}>
              <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M2 12s3-4 6-4 6 4 6 4 3-4 6-4" />
              </svg>
            </div>
            <span className="text-lg font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{APP_NAME}</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold mb-1" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "#F1F5F9" }}>
            Create your account
          </h1>
          <p className="text-sm mb-8" style={{ color: "#64748B" }}>
            Start analyzing flood imagery with {APP_NAME}
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
              <label htmlFor="name" className="block text-sm font-medium mb-1.5" style={{ color: "#94A3B8" }}>Full Name</label>
              <input
                id="name" type="text" autoComplete="name" value={name}
                onChange={(e) => setName(e.target.value)}
                className="input-dark w-full px-4 py-3 text-sm" placeholder="Jane Doe" disabled={loading}
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1.5" style={{ color: "#94A3B8" }}>Email</label>
              <input
                id="email" type="email" autoComplete="email" value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-dark w-full px-4 py-3 text-sm" placeholder="you@example.com" disabled={loading}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-1.5" style={{ color: "#94A3B8" }}>Password</label>
              <input
                id="password" type="password" autoComplete="new-password" value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-dark w-full px-4 py-3 text-sm" placeholder="At least 6 characters" disabled={loading}
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
                  Creating account…
                </span>
              ) : "Create Account"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm" style={{ color: "#64748B" }}>
            Already have an account?{" "}
            <Link to="/login" className="font-medium transition-colors cursor-pointer" style={{ color: "#60A5FA" }}>
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
