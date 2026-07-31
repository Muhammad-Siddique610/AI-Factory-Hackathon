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

  const from = (location.state as { from?: { pathname: string } })?.from
    ?.pathname || "/home";

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
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground text-center">
          Welcome back
        </h1>
        <p className="mt-2 text-center text-foreground/60">
          Log in to your {APP_NAME} account
        </p>

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
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-foreground"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 w-full px-4 py-2.5 border border-border rounded-lg text-sm focus:border-accent focus:ring-3 focus:ring-accent/15 outline-none transition-colors"
                placeholder="••••••••"
                disabled={loading}
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-accent text-white py-2.5 rounded-lg font-semibold hover:opacity-90 active:scale-97 transition-all duration-150 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Logging in…" : "Log In"}
            </button>
          </div>

          <div className="mt-4 text-center text-sm text-foreground/50">
            <Link
              to="/forgot-password"
              className="text-accent hover:underline cursor-pointer"
            >
              Forgot password?
            </Link>
          </div>
        </form>

        <p className="mt-6 text-center text-sm text-foreground/50">
          Don&apos;t have an account?{" "}
          <Link
            to="/signup"
            className="text-accent font-medium hover:underline cursor-pointer"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
