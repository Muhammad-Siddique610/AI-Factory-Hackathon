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

    if (!name.trim()) {
      setError("Please enter your full name.");
      return;
    }
    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }
    if (!password || password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    const { error: signUpError } = await signUp(name, email, password);
    setLoading(false);

    if (signUpError) {
      setError(
        signUpError.includes("already registered") ||
        signUpError.includes("already exists")
          ? "An account with this email already exists. Try logging in instead."
          : signUpError
      );
    } else {
      navigate("/home");
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground text-center">
          Create your account
        </h1>
        <p className="mt-2 text-center text-foreground/60">
          Start analyzing flood imagery with {APP_NAME}
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
                htmlFor="name"
                className="block text-sm font-medium text-foreground"
              >
                Full Name
              </label>
              <input
                id="name"
                type="text"
                autoComplete="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 w-full px-4 py-2.5 border border-border rounded-lg text-sm focus:border-accent focus:ring-3 focus:ring-accent/15 outline-none transition-colors"
                placeholder="Jane Doe"
                disabled={loading}
              />
            </div>
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
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 w-full px-4 py-2.5 border border-border rounded-lg text-sm focus:border-accent focus:ring-3 focus:ring-accent/15 outline-none transition-colors"
                placeholder="At least 6 characters"
                disabled={loading}
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-accent text-white py-2.5 rounded-lg font-semibold hover:opacity-90 active:scale-97 transition-all duration-150 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Creating account…" : "Sign Up"}
            </button>
          </div>
        </form>

        <p className="mt-6 text-center text-sm text-foreground/50">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-accent font-medium hover:underline cursor-pointer"
          >
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
