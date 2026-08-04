import { Link } from "react-router-dom";
import { Upload, History, Zap, Eye, FileText } from "lucide-react";
import { APP_NAME } from "../constants/config";
import { useAuth } from "../contexts/AuthContext";

const features = [
  {
    icon: Zap,
    title: "Rapid Analysis",
    desc: "Upload an image and get AI-powered flood segmentation with risk assessment in under 30 seconds.",
    color: "#3B82F6",
    rgb: "59,130,246",
  },
  {
    icon: Eye,
    title: "Before & After Comparison",
    desc: "Compare pre-flood and post-flood imagery side by side with an interactive drag slider.",
    color: "#6366F1",
    rgb: "99,102,241",
  },
  {
    icon: FileText,
    title: "Shareable Reports",
    desc: "Generate branded PDF reports and share results via a unique public link — no login required for viewers.",
    color: "#10B981",
    rgb: "16,185,129",
  },
];

const stats = [
  { value: "< 30s", label: "Analysis time" },
  { value: "AI", label: "Flood segmentation" },
  { value: "PDF", label: "Instant reports" },
];

/* ── Animated satellite analysis frame ── */
function AnalysisFrame() {
  return (
    <div className="relative w-full max-w-lg mx-auto lg:mx-0" style={{ aspectRatio: "4/3" }}>
      {/* Outer glow */}
      <div
        className="absolute -inset-4 rounded-3xl pointer-events-none"
        style={{
          background: "radial-gradient(ellipse, rgba(59,130,246,0.18) 0%, transparent 70%)",
          filter: "blur(20px)",
        }}
      />

      {/* Main frame container */}
      <div
        className="relative w-full h-full rounded-2xl overflow-hidden"
        style={{
          background: "linear-gradient(145deg, #0C1A2E 0%, #0A1422 50%, #0D1F35 100%)",
          border: "1px solid rgba(59,130,246,0.25)",
          boxShadow: "0 0 0 1px rgba(59,130,246,0.08), 0 32px 64px rgba(0,0,0,0.6)",
        }}
      >
        {/* Top bar – HUD header */}
        <div
          className="flex items-center justify-between px-3 py-2"
          style={{ borderBottom: "1px solid rgba(59,130,246,0.15)", background: "rgba(15,23,42,0.6)" }}
        >
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full" style={{ background: "#EF4444" }} />
            <div className="w-2 h-2 rounded-full" style={{ background: "#F59E0B" }} />
            <div className="w-2 h-2 rounded-full" style={{ background: "#10B981" }} />
          </div>
          <span className="text-xs font-mono" style={{ color: "#3B82F6" }}>FLOODSCOPE_ANALYSIS_v2.4</span>
          <div className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: "#10B981" }} />
            <span className="text-xs font-mono" style={{ color: "#10B981" }}>LIVE</span>
          </div>
        </div>

        {/* Simulated satellite imagery area */}
        <div className="relative flex-1 overflow-hidden" style={{ height: "calc(100% - 88px)" }}>
          {/* Fake terrain grid */}
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `
                linear-gradient(rgba(59,130,246,0.04) 1px, transparent 1px),
                linear-gradient(90deg, rgba(59,130,246,0.04) 1px, transparent 1px)
              `,
              backgroundSize: "24px 24px",
            }}
          />

          {/* Terrain patches — simulated imagery */}
          <div className="absolute inset-0">
            {/* Dark zone patches */}
            <div className="absolute rounded-lg" style={{ top: "15%", left: "10%", width: "35%", height: "28%", background: "rgba(30,58,95,0.5)", border: "1px solid rgba(59,130,246,0.1)" }} />
            <div className="absolute rounded-md" style={{ top: "50%", left: "5%", width: "25%", height: "20%", background: "rgba(20,40,70,0.6)", border: "1px solid rgba(59,130,246,0.08)" }} />
            <div className="absolute rounded-md" style={{ top: "30%", left: "55%", width: "38%", height: "30%", background: "rgba(15,35,60,0.55)", border: "1px solid rgba(59,130,246,0.1)" }} />
            {/* "Flood" zones — bright blue highlights */}
            <div className="absolute rounded-md" style={{ top: "20%", left: "18%", width: "22%", height: "14%", background: "rgba(59,130,246,0.22)", border: "1px solid rgba(59,130,246,0.4)" }} />
            <div className="absolute rounded-sm" style={{ top: "55%", left: "35%", width: "30%", height: "18%", background: "rgba(59,130,246,0.18)", border: "1px solid rgba(59,130,246,0.35)" }} />
            <div className="absolute rounded-md" style={{ top: "35%", left: "60%", width: "20%", height: "12%", background: "rgba(99,102,241,0.2)", border: "1px solid rgba(99,102,241,0.4)" }} />
            {/* Small accent patches */}
            <div className="absolute rounded-sm" style={{ top: "68%", left: "15%", width: "12%", height: "8%", background: "rgba(59,130,246,0.14)" }} />
            <div className="absolute rounded-sm" style={{ top: "72%", left: "65%", width: "18%", height: "10%", background: "rgba(59,130,246,0.12)" }} />
          </div>

          {/* ── SCAN LINE ── sweeps top-to-bottom on loop */}
          <div
            className="absolute left-0 right-0 pointer-events-none"
            style={{
              height: "3px",
              background: "linear-gradient(90deg, transparent 0%, rgba(59,130,246,0.8) 20%, rgba(96,165,250,1) 50%, rgba(59,130,246,0.8) 80%, transparent 100%)",
              boxShadow: "0 0 12px 4px rgba(59,130,246,0.4), 0 0 24px 8px rgba(59,130,246,0.15)",
              animation: "scanDown 3s linear infinite",
              top: 0,
            }}
          />
          {/* Scan line trail glow */}
          <div
            className="absolute left-0 right-0 pointer-events-none"
            style={{
              height: "60px",
              background: "linear-gradient(180deg, rgba(59,130,246,0.08) 0%, transparent 100%)",
              animation: "scanDown 3s linear infinite",
              top: 0,
              marginTop: "-57px",
            }}
          />

          {/* ── CORNER BRACKETS ── */}
          {/* Top-left */}
          <div className="absolute top-2 left-2 w-6 h-6" style={{ borderTop: "2px solid #3B82F6", borderLeft: "2px solid #3B82F6" }} />
          {/* Top-right */}
          <div className="absolute top-2 right-2 w-6 h-6" style={{ borderTop: "2px solid #3B82F6", borderRight: "2px solid #3B82F6" }} />
          {/* Bottom-left */}
          <div className="absolute bottom-2 left-2 w-6 h-6" style={{ borderBottom: "2px solid #3B82F6", borderLeft: "2px solid #3B82F6" }} />
          {/* Bottom-right */}
          <div className="absolute bottom-2 right-2 w-6 h-6" style={{ borderBottom: "2px solid #3B82F6", borderRight: "2px solid #3B82F6" }} />

          {/* Center crosshair */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="relative w-8 h-8">
              <div className="absolute top-1/2 left-0 right-0 h-px" style={{ background: "rgba(59,130,246,0.4)" }} />
              <div className="absolute left-1/2 top-0 bottom-0 w-px" style={{ background: "rgba(59,130,246,0.4)" }} />
              <div className="absolute top-1/2 left-1/2 w-3 h-3 rounded-full -translate-x-1/2 -translate-y-1/2"
                style={{ border: "1.5px solid rgba(59,130,246,0.6)" }} />
            </div>
          </div>

          {/* ── FLOATING HUD CHIPS ── */}
          {/* Risk indicator */}
          <div
            className="absolute flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold font-mono"
            style={{
              top: "12%", right: "8%",
              background: "rgba(239,68,68,0.15)",
              border: "1px solid rgba(239,68,68,0.4)",
              color: "#FCA5A5",
              backdropFilter: "blur(8px)",
              animation: "floatUp 4s ease-in-out infinite",
            }}
          >
            <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: "#EF4444" }} />
            RISK: HIGH
          </div>

          {/* Flood % */}
          <div
            className="absolute px-2.5 py-1 rounded-lg text-xs font-semibold font-mono"
            style={{
              bottom: "20%", left: "8%",
              background: "rgba(59,130,246,0.15)",
              border: "1px solid rgba(59,130,246,0.4)",
              color: "#93C5FD",
              backdropFilter: "blur(8px)",
              animation: "floatUp 4s ease-in-out 1s infinite",
            }}
          >
            FLOOD: 67.3%
          </div>

          {/* Confidence */}
          <div
            className="absolute px-2.5 py-1 rounded-lg text-xs font-semibold font-mono"
            style={{
              bottom: "10%", right: "10%",
              background: "rgba(16,185,129,0.12)",
              border: "1px solid rgba(16,185,129,0.35)",
              color: "#6EE7B7",
              backdropFilter: "blur(8px)",
              animation: "floatUp 4s ease-in-out 2s infinite",
            }}
          >
            CONF: 94.1%
          </div>

          {/* Pulsing target dots on flood zones */}
          <div className="absolute" style={{ top: "23%", left: "22%" }}>
            <div className="w-3 h-3 rounded-full" style={{ background: "#EF4444", boxShadow: "0 0 0 0 rgba(239,68,68,0.4)", animation: "radarPulse 2s ease-out infinite" }} />
          </div>
          <div className="absolute" style={{ top: "58%", left: "45%" }}>
            <div className="w-2.5 h-2.5 rounded-full" style={{ background: "#F59E0B", boxShadow: "0 0 0 0 rgba(245,158,11,0.4)", animation: "radarPulse 2s ease-out 0.7s infinite" }} />
          </div>
          <div className="absolute" style={{ top: "38%", left: "65%" }}>
            <div className="w-2 h-2 rounded-full" style={{ background: "#3B82F6", boxShadow: "0 0 0 0 rgba(59,130,246,0.4)", animation: "radarPulse 2s ease-out 1.4s infinite" }} />
          </div>
        </div>

        {/* Bottom status bar */}
        <div
          className="flex items-center justify-between px-3 py-2 text-xs font-mono"
          style={{ borderTop: "1px solid rgba(59,130,246,0.12)", background: "rgba(8,15,30,0.7)", color: "#475569" }}
        >
          <span style={{ color: "#3B82F6" }}>■ ANALYZING</span>
          <span>SAT-IMG-20240812.tif</span>
          <span style={{ color: "#10B981" }}>3 zones detected</span>
        </div>
      </div>

      {/* Floating side labels */}
      <div
        className="absolute -right-3 top-1/4 px-2 py-1 rounded-md text-xs font-mono"
        style={{
          background: "rgba(239,68,68,0.1)",
          border: "1px solid rgba(239,68,68,0.3)",
          color: "#FCA5A5",
          writingMode: "vertical-rl",
          transform: "rotate(180deg)",
        }}
      >
        CRITICAL ZONE
      </div>

      {/* Keyframes injected locally */}
      <style>{`
        @keyframes scanDown {
          0%   { top: -4px; }
          100% { top: 100%; }
        }
        @keyframes radarPulse {
          0%   { box-shadow: 0 0 0 0 rgba(239,68,68,0.6); }
          70%  { box-shadow: 0 0 0 12px rgba(239,68,68,0); }
          100% { box-shadow: 0 0 0 0 rgba(239,68,68,0); }
        }
        @keyframes floatUp {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-6px); }
        }
      `}</style>
    </div>
  );
}

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="relative overflow-hidden" style={{ background: "#0F172A" }}>
      {/* Background dot grid pattern */}
      <div className="absolute inset-0 dot-grid-bg pointer-events-none opacity-60" />

      {/* Ambient background glows */}
      <div
        className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(59, 130, 246, 0.12) 0%, rgba(99, 102, 241, 0.05) 50%, transparent 70%)",
          filter: "blur(60px)",
        }}
      />
      <div
        className="absolute top-2/3 right-10 w-[400px] h-[300px] rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(99, 102, 241, 0.08) 0%, transparent 70%)",
          filter: "blur(50px)",
        }}
      />

      {/* ── HERO SECTION ── */}
      <section className="relative pt-12 pb-20 md:pt-20 md:pb-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          
          {/* Left Column — Copy & CTAs */}
          <div className="text-center lg:text-left space-y-6">
            {/* Status Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold font-mono tracking-wide"
              style={{
                background: "rgba(59, 130, 246, 0.1)",
                border: "1px solid rgba(59, 130, 246, 0.3)",
                color: "#60A5FA",
              }}
            >
              <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: "#3B82F6" }} />
              AI-Powered Flood Detection
            </div>

            {/* Headline */}
            <h1
              className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1]"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              <span style={{ color: "#F1F5F9" }}>Instant Satellite</span>
              <br />
              <span
                style={{
                  background: "linear-gradient(135deg, #60A5FA 0%, #3B82F6 40%, #818CF8 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Flood Segmentation
              </span>
            </h1>

            {/* Subheadline */}
            <p className="text-lg sm:text-xl leading-relaxed max-w-xl mx-auto lg:mx-0" style={{ color: "#94A3B8" }}>
              Upload satellite or aerial imagery to detect flooded areas, evaluate risk levels, and generate emergency response reports in seconds.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <Link
                to={user ? "/upload" : "/signup"}
                className="btn-primary px-8 py-3.5 text-base flex items-center justify-center gap-2.5 w-full sm:w-auto cursor-pointer"
              >
                <Upload className="w-5 h-5" />
                <span>{user ? "Start Analysis" : "Try FloodScope Free"}</span>
              </Link>
              <Link
                to="/about"
                className="btn-ghost px-8 py-3.5 text-base flex items-center justify-center gap-2 w-full sm:w-auto cursor-pointer"
              >
                <span>Learn How It Works</span>
              </Link>
            </div>

            {/* Quick Stats bar */}
            <div
              className="grid grid-cols-3 gap-4 pt-6 max-w-md mx-auto lg:mx-0 border-t"
              style={{ borderColor: "rgba(59, 130, 246, 0.12)" }}
            >
              {stats.map(({ value, label }) => (
                <div key={label} className="text-center lg:text-left">
                  <div
                    className="text-xl sm:text-2xl font-bold font-mono"
                    style={{
                      background: "linear-gradient(135deg, #93C5FD, #60A5FA)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                    }}
                  >
                    {value}
                  </div>
                  <div className="text-xs mt-0.5" style={{ color: "#64748B" }}>
                    {label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column — Animated Satellite Hero Frame */}
          <AnalysisFrame />

        </div>
      </section>

      {/* Wave separator */}
      <div className="relative w-full overflow-hidden leading-none pointer-events-none" style={{ height: "60px" }}>
        <svg
          className="relative block w-full h-full"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <path
            d="M0,0 C150,90 350,-40 500,40 C650,120 900,10 1200,40 L1200,120 L0,120 Z"
            fill="rgba(30, 41, 59, 0.3)"
          />
          <path
            d="M0,20 C200,100 450,0 700,60 C950,120 1100,30 1200,60 L1200,120 L0,120 Z"
            fill="rgba(15, 23, 42, 0.8)"
          />
        </svg>
      </div>

      {/* ── FEATURES SECTION ── */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2
            className="text-3xl sm:text-4xl font-bold tracking-tight"
            style={{ color: "#F1F5F9", fontFamily: "'Space Grotesk', sans-serif" }}
          >
            Everything you need in one place
          </h2>
          <p className="mt-3 text-base" style={{ color: "#94A3B8" }}>
            Designed for disaster response teams, researchers, and emergency planners.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map(({ icon: Icon, title, desc, color, rgb }) => (
            <div
              key={title}
              className="glass-card glass-card-hover p-8 relative overflow-hidden group"
            >
              {/* Top ambient color bar */}
              <div
                className="absolute top-0 left-0 right-0 h-1"
                style={{ background: `linear-gradient(90deg, ${color}, transparent)` }}
              />

              {/* Icon Container */}
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-6"
                style={{
                  background: `rgba(${rgb}, 0.12)`,
                  border: `1px solid rgba(${rgb}, 0.3)`,
                }}
              >
                <Icon className="w-6 h-6" style={{ color }} />
              </div>

              {/* Title & Desc */}
              <h3 className="text-xl font-bold mb-3" style={{ color: "#F1F5F9" }}>
                {title}
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: "#94A3B8" }}>
                {desc}
              </p>

              {/* Subtle hover glow */}
              <div
                className="absolute -bottom-10 -right-10 w-32 h-32 rounded-full pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{
                  background: `radial-gradient(circle, rgba(${rgb}, 0.15) 0%, transparent 70%)`,
                  filter: "blur(20px)",
                }}
              />
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section className="relative py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div
          className="glass-card p-10 md:p-14 text-center relative overflow-hidden"
          style={{
            borderColor: "rgba(59, 130, 246, 0.3)",
            background: "linear-gradient(135deg, rgba(30, 41, 59, 0.8) 0%, rgba(15, 23, 42, 0.9) 100%)",
          }}
        >
          {/* Ambient glow in banner */}
          <div
            className="absolute -top-20 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full pointer-events-none"
            style={{
              background: "radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, transparent 70%)",
              filter: "blur(40px)",
            }}
          />

          <h2
            className="text-3xl sm:text-4xl font-bold tracking-tight mb-4 relative z-10"
            style={{ color: "#F1F5F9" }}
          >
            Ready to analyze flood impact?
          </h2>
          <p className="text-base sm:text-lg max-w-xl mx-auto mb-8 relative z-10" style={{ color: "#94A3B8" }}>
            Get instant AI segmentation and detailed damage risk metrics in seconds.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 relative z-10">
            <Link
              to={user ? "/upload" : "/signup"}
              className="btn-primary px-8 py-3.5 text-base cursor-pointer w-full sm:w-auto text-center"
            >
              {user ? "Go to Upload" : "Create Free Account"}
            </Link>
            {user && (
              <Link
                to="/history"
                className="btn-ghost px-8 py-3.5 text-base flex items-center justify-center gap-2 cursor-pointer w-full sm:w-auto"
              >
                <History className="w-4 h-4" />
                <span>View Past Analyses</span>
              </Link>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
