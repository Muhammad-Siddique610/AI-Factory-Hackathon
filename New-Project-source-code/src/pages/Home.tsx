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
          0%, 100% { transform: translateY(0px);   opacity: 0.85; }
          50%       { transform: translateY(-5px);  opacity: 1;    }
        }
        @keyframes drawBracket {
          from { opacity: 0; transform: scale(0.85); }
          to   { opacity: 1; transform: scale(1);    }
        }
      `}</style>
    </div>
  );
}

export default function Home() {
  const { user } = useAuth();

  return (
    <div>
      {/* ── Hero ── */}
      <section
        className="relative overflow-hidden dot-grid-bg"
        style={{ background: "linear-gradient(160deg, #080F1E 0%, #0F172A 50%, #0C1729 100%)" }}
      >
        {/* Ambient blobs */}
        <div className="absolute top-0 left-0 w-[700px] h-[500px] pointer-events-none"
          style={{ background: "radial-gradient(ellipse at 30% 40%, rgba(59,130,246,0.1) 0%, transparent 60%)", filter: "blur(60px)" }} />
        <div className="absolute bottom-0 right-0 w-[500px] h-[400px] pointer-events-none"
          style={{ background: "radial-gradient(ellipse at 70% 60%, rgba(99,102,241,0.1) 0%, transparent 60%)", filter: "blur(60px)" }} />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">

            {/* ── Left: text content ── */}
            <div>
              {/* Label pill */}
              <div
                className="inline-flex items-center gap-2 mb-6 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-widest"
                style={{ background: "rgba(59,130,246,0.1)", border: "1px solid rgba(59,130,246,0.3)", color: "#60A5FA" }}
              >
                <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: "#3B82F6" }} />
                AI-Powered Flood Intelligence
              </div>

              <h1
                className="text-5xl sm:text-6xl font-bold tracking-tight leading-tight"
                style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  background: "linear-gradient(135deg, #F1F5F9 20%, #93C5FD 60%, #60A5FA 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Detect Floods.<br />Save Lives.
              </h1>

              <p className="mt-6 text-base sm:text-lg leading-relaxed max-w-lg" style={{ color: "#94A3B8" }}>
                AI-powered flood damage assessment for disaster response teams. Upload
                satellite or drone imagery and get flood segmentation, risk level, and
                area analysis in seconds.
              </p>

              {/* CTAs */}
              <div className="mt-9 flex flex-col sm:flex-row gap-3">
                <Link to="/upload" className="btn-primary px-7 py-3.5 text-base cursor-pointer inline-flex items-center justify-center gap-2">
                  <Upload className="w-4 h-4" aria-hidden="true" />
                  Analyze New Image
                </Link>
                <Link to="/history" className="btn-ghost px-7 py-3.5 text-base cursor-pointer inline-flex items-center justify-center gap-2">
                  <History className="w-4 h-4" aria-hidden="true" />
                  View History
                </Link>
              </div>

              {/* Stat badges */}
              <div className="mt-8 flex flex-wrap gap-3">
                {stats.map(({ value, label }) => (
                  <div key={label} className="flex items-center gap-2 px-3.5 py-1.5 rounded-full text-sm"
                    style={{ background: "rgba(30,41,59,0.6)", border: "1px solid rgba(59,130,246,0.15)", color: "#94A3B8" }}>
                    <span className="font-bold" style={{ color: "#60A5FA", fontFamily: "'Space Grotesk', sans-serif" }}>{value}</span>
                    <span>{label}</span>
                  </div>
                ))}
              </div>

              {/* Guest CTA */}
              {!user && (
                <div className="mt-8 pt-8" style={{ borderTop: "1px solid rgba(59,130,246,0.1)" }}>
                  <p className="text-sm mb-4" style={{ color: "#64748B" }}>
                    New to {APP_NAME}? Create a free account to start analyzing.
                  </p>
                  <Link to="/signup" className="btn-ghost inline-flex items-center gap-2 px-7 py-3 text-base cursor-pointer">
                    Get Started — Free Account
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                  </Link>
                </div>
              )}
            </div>

            {/* ── Right: animated analysis frame ── */}
            <div className="hidden lg:block">
              <AnalysisFrame />
            </div>
          </div>
        </div>

        {/* SVG wave separator */}
        <div className="relative w-full overflow-hidden" style={{ marginBottom: "-2px", lineHeight: 0 }}>
          <svg
            viewBox="0 0 1440 80"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="none"
            style={{ display: "block", width: "100%", height: "80px" }}
          >
            <defs>
              <linearGradient id="waveGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="rgba(59,130,246,0.3)" />
                <stop offset="50%" stopColor="rgba(99,102,241,0.2)" />
                <stop offset="100%" stopColor="rgba(59,130,246,0.3)" />
              </linearGradient>
            </defs>
            {/* Back wave */}
            <path
              d="M0,40 C200,80 400,0 600,40 C800,80 1000,0 1200,40 C1350,70 1420,30 1440,40 L1440,80 L0,80 Z"
              fill="rgba(10,17,32,0.9)"
            />
            {/* Front wave with glow */}
            <path
              d="M0,55 C180,20 360,70 540,45 C720,20 900,65 1080,40 C1260,15 1370,55 1440,45 L1440,80 L0,80 Z"
              fill="#0A1120"
            />
            {/* Animated wave line */}
            <path
              d="M0,40 C200,80 400,0 600,40 C800,80 1000,0 1200,40 C1350,70 1420,30 1440,40"
              fill="none"
              stroke="url(#waveGrad)"
              strokeWidth="1.5"
              style={{ animation: "waveLine 4s ease-in-out infinite alternate" }}
            />
          </svg>
        </div>

        <style>{`
          @keyframes waveLine {
            0%   { d: path("M0,40 C200,80 400,0 600,40 C800,80 1000,0 1200,40 C1350,70 1420,30 1440,40"); }
            100% { d: path("M0,45 C200,10 400,70 600,35 C800,5  1000,60 1200,30 C1350,55 1420,15 1440,45"); }
          }
        `}</style>
      </section>

      {/* ── Features ── */}
      <section className="py-20 sm:py-28" style={{ background: "#0A1120" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "#3B82F6" }}>
              How It Works
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "#F1F5F9" }}>
              Everything you need in one place
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map(({ icon: Icon, title, desc, color, rgb }) => (
              <div key={title} className="glass-card glass-card-hover p-7 flex flex-col gap-4">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: `rgba(${rgb}, 0.12)`, boxShadow: `0 0 20px rgba(${rgb}, 0.2)` }}
                >
                  <Icon className="w-5 h-5" style={{ color }} aria-hidden="true" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "#F1F5F9" }}>
                    {title}
                  </h3>
                  <p className="text-sm leading-relaxed" style={{ color: "#94A3B8" }}>{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
