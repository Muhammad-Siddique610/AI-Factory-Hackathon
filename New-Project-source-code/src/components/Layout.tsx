import { useState } from "react";
import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { APP_NAME } from "../constants/config";

export default function Layout() {
  const { user, signOut } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [logoClicked, setLogoClicked] = useState(false);

  const handleLogoClick = () => {
    if (logoClicked) return;
    setLogoClicked(true);
    setTimeout(() => setLogoClicked(false), 650);
  };
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await signOut();
    navigate("/home");
  };

  const isActive = (path: string) => location.pathname === path;

  const navLinkClass = (path: string) =>
    `text-sm font-medium transition-all duration-200 cursor-pointer relative pb-0.5 ${
      isActive(path)
        ? "text-[#60A5FA] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-[#3B82F6] after:rounded-full"
        : "text-[#94A3B8] hover:text-[#F1F5F9]"
    }`;

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "#0F172A", color: "#F1F5F9" }}>
      {/* ── Navbar ── */}
      <header
        className="sticky top-0 z-50"
        style={{
          background: "rgba(15, 23, 42, 0.85)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(59, 130, 246, 0.15)",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link
              to="/home"
              onClick={handleLogoClick}
              className="relative flex items-center gap-2.5 cursor-pointer select-none"
              style={{ textDecoration: "none" }}
            >
              {/* Wave / water icon — spring-bounce on click */}
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{
                  background: "linear-gradient(135deg, #3B82F6, #6366F1)",
                  transform: logoClicked ? "scale(1.35) rotate(20deg)" : "scale(1) rotate(0deg)",
                  boxShadow: logoClicked
                    ? "0 0 0 8px rgba(59,130,246,0.15), 0 0 30px rgba(59,130,246,0.6), 0 0 60px rgba(99,102,241,0.3)"
                    : "none",
                  transition: logoClicked
                    ? "transform 0.15s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.15s ease"
                    : "transform 0.45s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.45s ease",
                }}
              >
                <svg
                  className="w-4 h-4 text-white"
                  viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                  style={{
                    transform: logoClicked ? "scale(1.15)" : "scale(1)",
                    transition: "transform 0.4s cubic-bezier(0.34,1.56,0.64,1)",
                  }}
                >
                  <path d="M2 12s3-4 6-4 6 4 6 4 3-4 6-4" />
                  <path d="M2 17s3-4 6-4 6 4 6 4 3-4 6-4" />
                </svg>
              </div>
              {/* Logo text — slides & brightens on click */}
              <span
                className="text-lg font-bold tracking-tight"
                style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  color: logoClicked ? "#93C5FD" : "#F1F5F9",
                  transform: logoClicked ? "translateX(3px)" : "translateX(0)",
                  transition: "color 0.3s ease, transform 0.35s cubic-bezier(0.34,1.56,0.64,1)",
                  display: "inline-block",
                }}
              >
                {APP_NAME}
              </span>
              {/* Ripple ring */}
              {logoClicked && (
                <span
                  className="absolute rounded-full pointer-events-none"
                  style={{
                    width: "40px",
                    height: "40px",
                    border: "2px solid rgba(59,130,246,0.6)",
                    animation: "logoRipple 0.6s ease-out forwards",
                  }}
                />
              )}
            </Link>

            <style>{`
              @keyframes logoRipple {
                0%   { transform: scale(1);   opacity: 0.8; }
                100% { transform: scale(2.5); opacity: 0;   }
              }
            `}</style>

            {/* Desktop nav */}
            <nav className="hidden md:flex items-center gap-7">
              <Link to="/home" className={navLinkClass("/home")}>Home</Link>
              <Link to="/history" className={navLinkClass("/history")}>History</Link>
              <Link to="/about" className={navLinkClass("/about")}>About</Link>
            </nav>

            {/* Desktop auth */}
            <div className="hidden md:flex items-center gap-3">
              {user ? (
                <>
                  <Link
                    to="/upload"
                    className="btn-primary px-4 py-2 text-sm cursor-pointer inline-flex items-center gap-1.5"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                      <polyline points="17 8 12 3 7 8"/>
                      <line x1="12" y1="3" x2="12" y2="15"/>
                    </svg>
                    Analyze Image
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="text-sm font-medium text-[#94A3B8] hover:text-[#F1F5F9] transition-colors cursor-pointer"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="text-sm font-medium text-[#94A3B8] hover:text-[#F1F5F9] transition-colors cursor-pointer"
                  >
                    Log In
                  </Link>
                  <Link
                    to="/signup"
                    className="btn-primary px-4 py-2 text-sm cursor-pointer"
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>

            {/* Mobile hamburger */}
            <button
              className="md:hidden p-2 rounded-lg cursor-pointer transition-colors"
              style={{ color: "#94A3B8" }}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
              aria-expanded={mobileMenuOpen}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>

          {/* Mobile menu */}
          {mobileMenuOpen && (
            <nav
              className="md:hidden pb-5 flex flex-col gap-4 pt-2"
              style={{ borderTop: "1px solid rgba(59,130,246,0.12)" }}
            >
              <Link to="/home" className={navLinkClass("/home")} onClick={() => setMobileMenuOpen(false)}>Home</Link>
              <Link to="/history" className={navLinkClass("/history")} onClick={() => setMobileMenuOpen(false)}>History</Link>
              <Link to="/about" className={navLinkClass("/about")} onClick={() => setMobileMenuOpen(false)}>About</Link>
              <div style={{ height: "1px", background: "rgba(59,130,246,0.12)" }} />
              {user ? (
                <>
                  <Link
                    to="/upload"
                    className="btn-primary px-4 py-2.5 text-sm text-center cursor-pointer"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Analyze Image
                  </Link>
                  <button
                    onClick={() => { handleLogout(); setMobileMenuOpen(false); }}
                    className="text-sm font-medium text-left text-[#94A3B8] hover:text-[#F1F5F9] transition-colors cursor-pointer"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="text-sm font-medium text-[#94A3B8] hover:text-[#F1F5F9] transition-colors cursor-pointer" onClick={() => setMobileMenuOpen(false)}>Log In</Link>
                  <Link to="/signup" className="btn-primary px-4 py-2.5 text-sm text-center cursor-pointer" onClick={() => setMobileMenuOpen(false)}>Get Started</Link>
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
      <footer style={{ background: "#080F1E", borderTop: "1px solid rgba(59,130,246,0.1)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div
                className="w-6 h-6 rounded-md flex items-center justify-center"
                style={{ background: "linear-gradient(135deg, #3B82F6, #6366F1)" }}
              >
                <svg className="w-3 h-3 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M2 12s3-4 6-4 6 4 6 4 3-4 6-4" />
                </svg>
              </div>
              <span className="text-sm font-semibold" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "#64748B" }}>
                {APP_NAME}
              </span>
            </div>
            <p className="text-xs" style={{ color: "#475569" }}>
              © {new Date().getFullYear()} {APP_NAME}. Built for disaster response teams.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
