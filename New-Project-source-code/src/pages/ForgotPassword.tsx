import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function ForgotPassword() {
  const { resetPassword } = useAuth();

  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!email.trim()) { setError("Please enter your email address."); return; }
    setLoading(true);
    const { error: resetError } = await resetPassword(email);
    setLoading(false);
    if (resetError) { setError(resetError); } else { setSent(true); }
  };

  return (
    <div
      className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4 py-16"
      style={{ background: "#0F172A" }}
    >
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-5"
            style={{ background: "linear-gradient(135deg, #3B82F6, #6366F1)", boxShadow: "0 0 30px rgba(59,130,246,0.3)" }}
          >
            <svg className="w-7 h-7 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
          </div>
          <h1
            className="text-2xl sm:text-3xl font-bold mb-2"
            style={{ fontFamily: "'Space Grotesk', sans-serif", color: "#F1F5F9" }}
          >
            Forgot your password?
          </h1>
          <p className="text-sm" style={{ color: "#64748B" }}>
            Enter your email and we'll send you a reset link.
          </p>
        </div>

        {sent ? (
          <div
            className="glass-card p-8 text-center"
          >
            <div
              className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-5"
              style={{ background: "rgba(16,185,129,0.12)", border: "1px solid rgba(16,185,129,0.3)" }}
            >
              <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-lg font-semibold mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "#F1F5F9" }}>
              Check your inbox
            </h2>
            <p className="text-sm leading-relaxed" style={{ color: "#94A3B8" }}>
              We've sent a password reset link to{" "}
              <span className="font-medium" style={{ color: "#F1F5F9" }}>{email}</span>.
              It may take a few moments to arrive.
            </p>
            <p className="mt-3 text-sm" style={{ color: "#475569" }}>
              Didn't get the email?{" "}
              <button
                onClick={() => { setSent(false); setError(null); }}
                className="font-medium transition-colors cursor-pointer"
                style={{ color: "#60A5FA" }}
              >
                Try again
              </button>
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="glass-card p-7 space-y-4">
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
              <label htmlFor="email" className="block text-sm font-medium mb-1.5" style={{ color: "#94A3B8" }}>Email</label>
              <input
                id="email" type="email" autoComplete="email" value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-dark w-full px-4 py-3 text-sm" placeholder="you@example.com" disabled={loading}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3 text-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Sending…
                </span>
              ) : "Send Reset Link"}
            </button>
          </form>
        )}

        <p className="mt-6 text-center text-sm" style={{ color: "#64748B" }}>
          <Link to="/login" className="font-medium transition-colors cursor-pointer" style={{ color: "#60A5FA" }}>
            ← Back to login
          </Link>
        </p>
      </div>
    </div>
  );
}
