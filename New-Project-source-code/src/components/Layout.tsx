import { useState } from "react";
import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { APP_NAME } from "../constants/config";

export default function Layout() {
  const { user, signOut } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await signOut();
    navigate("/home");
  };

  const isActive = (path: string) => location.pathname === path;
  const navLinkClass = (path: string) =>
    `text-sm font-medium transition-colors cursor-pointer ${
      isActive(path)
        ? "text-accent"
        : "text-on-primary/80 hover:text-accent"
    }`;

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      {/* Navbar */}
      <header className="sticky top-0 z-50 bg-primary text-on-primary shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link
              to="/home"
              className="text-xl font-bold tracking-tight hover:opacity-90 transition-opacity cursor-pointer"
            >
              {APP_NAME}
            </Link>

            {/* Desktop nav links */}
            <nav className="hidden md:flex items-center gap-6">
              <Link
                to="/home"
                className={navLinkClass("/home")}
              >
                Home
              </Link>
              <Link
                to="/history"
                className={navLinkClass("/history")}
              >
                History
              </Link>
              <Link
                to="/about"
                className={navLinkClass("/about")}
              >
                About
              </Link>
            </nav>

            {/* Desktop auth section */}
            <div className="hidden md:flex items-center gap-3">
              {user ? (
                <>
                  <Link
                    to="/upload"
                    className="bg-accent text-white px-4 py-2 rounded-lg text-sm font-semibold hover:opacity-90 active:scale-97 transition-all duration-150 cursor-pointer"
                  >
                    Analyze New Image
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="text-sm font-medium hover:text-accent transition-colors cursor-pointer"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="text-sm font-medium hover:text-accent transition-colors cursor-pointer"
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    className="bg-accent text-white px-4 py-2 rounded-lg text-sm font-semibold hover:opacity-90 active:scale-97 transition-all duration-150 cursor-pointer"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>

            {/* Mobile hamburger */}
            <button
              className="md:hidden p-2 rounded-md hover:bg-white/10 transition-colors cursor-pointer"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
              aria-expanded={mobileMenuOpen}
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {mobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>

          {/* Mobile menu */}
          {mobileMenuOpen && (
            <nav className="md:hidden pb-4 flex flex-col gap-3">
              <Link
                to="/home"
                className={navLinkClass("/home")}
                onClick={() => setMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/history"
                className={navLinkClass("/history")}
                onClick={() => setMobileMenuOpen(false)}
              >
                History
              </Link>
              <Link
                to="/about"
                className={navLinkClass("/about")}
                onClick={() => setMobileMenuOpen(false)}
              >
                About
              </Link>
              <hr className="border-white/20" />
              {user ? (
                <>
                  <Link
                    to="/upload"
                    className="bg-accent text-white px-4 py-2 rounded-lg text-sm font-semibold text-center hover:opacity-90 transition-all cursor-pointer"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Analyze New Image
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setMobileMenuOpen(false);
                    }}
                    className="text-sm font-medium hover:text-accent transition-colors cursor-pointer text-left"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="text-sm font-medium hover:text-accent transition-colors cursor-pointer"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    className="bg-accent text-white px-4 py-2 rounded-lg text-sm font-semibold text-center hover:opacity-90 transition-all cursor-pointer"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </nav>
          )}
        </div>
      </header>

      {/* Page content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-primary text-on-primary/70 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm">
          &copy; {new Date().getFullYear()} {APP_NAME}. Built for disaster
          response teams.
        </div>
      </footer>
    </div>
  );
}
