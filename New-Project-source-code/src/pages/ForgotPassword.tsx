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

    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    setLoading(true);
    const { error: resetError } = await resetPassword(email);
    setLoading(false);

    if (resetError) {
      setError(resetError);
    } else {
      setSent(true);
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground text-center">
          Forgot your password?
        </h1>
        <p className="mt-2 text-center text-foreground/60">
          Enter your email and we&apos;ll send you a reset link.
        </p>

        {sent ? (
          <div className="mt-8 bg-white border border-border rounded-xl p-6 shadow-sm text-center">
            <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-6 h-6 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h2 className="text-lg font-semibold text-foreground">
              Check your inbox
            </h2>
            <p className="mt-2 text-sm text-foreground/60">
              We&apos;ve sent a password reset link to{" "}
              <span className="font-medium text-foreground">{email}</span>.
              It may take a few moments to arrive.
            </p>
            <p className="mt-3 text-sm text-foreground/40">
              Didn&apos;t get the email? Check your spam folder or{" "}
              <button
                onClick={() => {
                  setSent(false);
                  setError(null);
                }}
                className="text-accent hover:underline cursor-pointer"
              >
                try again
              </button>
              .
            </p>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="mt-8 bg-white border border-border rounded-xl p-6 shadow-sm"
          >
            {error && (
              <div
                className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm"
                role="alert"
              >
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-foreground"
                >
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 w-full px-4 py-2.5 border border-border rounded-lg text-sm focus:border-accent focus:ring-3 focus:ring-accent/15 outline-none transition-colors"
                  placeholder="you@example.com"
                  disabled={loading}
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-accent text-white py-2.5 rounded-lg font-semibold hover:opacity-90 active:scale-97 transition-all duration-150 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Sending…" : "Send Reset Link"}
              </button>
            </div>
          </form>
        )}

        <p className="mt-6 text-center text-sm text-foreground/50">
          <Link
            to="/login"
            className="text-accent font-medium hover:underline cursor-pointer"
          >
            Back to login
          </Link>
        </p>
      </div>
    </div>
  );
}
