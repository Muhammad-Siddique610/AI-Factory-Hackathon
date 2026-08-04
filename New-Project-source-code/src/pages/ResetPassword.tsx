import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function ResetPassword() {
  const { user, isLoading, updatePassword } = useAuth();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!password) { setError("Please enter a new password."); return; }
    if (password.length < 6) { setError("Password must be at least 6 characters."); return; }
    if (password !== confirmPassword) { setError("Passwords do not match."); return; }

    setSubmitting(true);
    const { error: updateError } = await updatePassword(password);
    setSubmitting(false);

    if (updateError) {
      setError(updateError);
    } else {
      setDone(true);
      setTimeout(() => navigate("/home"), 2500);
    }
  };

  /* ── Loading ── */
  if (isLoading) {
    return (
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center" style={{ background: "#0F172A" }}>
        <div className="w-8 h-8 rounded-full border-2 border-[#1E293B] border-t-[#3B82F6] animate-spin" />
      </div>
    );
  }

  /* ── Invalid / expired link ── */
  if (!user) {
    return (
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4 py-16" style={{ background: "#0F172A" }}>
        <div className="w-full max-w-sm text-center">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5"
            style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)" }}
          >
            <svg className="w-7 h-7" fill="none" stroke="#EF4444" viewBox="0 0 24 24" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="15" y1="9" x2="9" y2="15" />
              <line x1="9" y1="9" x2="15" y2="15" />
            </svg>
          </div>
          <h1 className="text-xl font-bold mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "#F1F5F9" }}>
            Invalid or expired link
          </h1>
          <p className="text-sm leading-relaxed mb-7" style={{ color: "#64748B" }}>
            This password reset link is no longer valid. It may have already been used or expired.
          </p>
          <Link to="/forgot-password" className="btn-primary px-6 py-2.5 text-sm cursor-pointer inline-block">
            Request a new link
          </Link>
        </div>
      </div>
    );
  }

  /* ── Success ── */
  if (done) {
    return (
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4 py-16" style={{ background: "#0F172A" }}>
        <div className="w-full max-w-sm text-center">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5"
            style={{ background: "rgba(16,185,129,0.12)", border: "1px solid rgba(16,185,129,0.3)" }}
          >
            <svg className="w-7 h-7" fill="none" stroke="#10B981" viewBox="0 0 24 24" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-xl font-bold mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "#F1F5F9" }}>
            Password updated!
          </h1>
          <p className="text-sm" style={{ color: "#64748B" }}>
            Your new password has been saved. Redirecting you home…
          </p>
          <div className="mt-5 flex justify-center">
            <div className="w-5 h-5 rounded-full border-2 border-[#1E293B] border-t-[#10B981] animate-spin" />
          </div>
        </div>
      </div>
    );
  }

  /* ── Form ── */
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
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "#F1F5F9" }}>
            Set a new password
          </h1>
          <p className="text-sm" style={{ color: "#64748B" }}>
            Resetting password for{" "}
            <span className="font-medium" style={{ color: "#94A3B8" }}>{user.email}</span>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="glass-card p-7 space-y-4">
          {error && (
            <div
              className="p-3.5 rounded-xl text-sm flex items-start gap-2.5"
              role="alert"
              style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", color: "#FCA5A5" }}
            >
              <svg className="w-4 h-4 flex-shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              {error}
            </div>
          )}

          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-1.5" style={{ color: "#94A3B8" }}>
              New Password
            </label>
            <input
              id="password"
              type="password"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-dark w-full px-4 py-3 text-sm"
              placeholder="At least 6 characters"
              disabled={submitting}
            />
          </div>

          <div>
            <label htmlFor="confirm-password" className="block text-sm font-medium mb-1.5" style={{ color: "#94A3B8" }}>
              Confirm New Password
            </label>
            <input
              id="confirm-password"
              type="password"
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="input-dark w-full px-4 py-3 text-sm"
              placeholder="Re-enter your password"
              disabled={submitting}
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="btn-primary w-full py-3 text-sm mt-1 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {submitting ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Updating…
              </span>
            ) : "Update Password"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm" style={{ color: "#64748B" }}>
          <Link to="/login" className="font-medium transition-colors cursor-pointer" style={{ color: "#60A5FA" }}>
            ← Back to login
          </Link>
        </p>
      </div>
    </div>
  );
}
