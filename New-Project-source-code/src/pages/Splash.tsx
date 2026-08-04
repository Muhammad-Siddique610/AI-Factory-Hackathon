import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { APP_NAME } from "../constants/config";

export default function Splash() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/home", { replace: true });
    }, 2000);
    return () => clearTimeout(timer);
  }, [navigate]);
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden dot-grid-bg"
      style={{ background: "#080F1E" }}
    >
      {/* Ambient glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at center, rgba(59,130,246,0.18) 0%, transparent 65%)",
        }}
      />

      {/* Logo mark */}
      <div
        className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl flex items-center justify-center animate-fade-scale"
        style={{
          background: "linear-gradient(135deg, #3B82F6 0%, #6366F1 100%)",
          boxShadow: "0 0 60px rgba(59,130,246,0.4), 0 0 120px rgba(99,102,241,0.2)",
        }}
      >
        <svg className="w-10 h-10 sm:w-12 sm:h-12 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M2 10s3-4 6-4 6 4 6 4 3-4 6-4" />
          <path d="M2 16s3-4 6-4 6 4 6 4 3-4 6-4" />
        </svg>
      </div>

      <h1
        className="mt-7 text-4xl sm:text-5xl font-bold tracking-tight animate-fade-up"
        style={{
          fontFamily: "'Space Grotesk', sans-serif",
          background: "linear-gradient(135deg, #F1F5F9 30%, #60A5FA 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        {APP_NAME}
      </h1>

      <p
        className="mt-3 text-base sm:text-lg animate-fade-up-delay"
        style={{ color: "#64748B" }}
      >
        AI-powered flood damage assessment
      </p>

      {/* Loading dots */}
      <div className="mt-12 flex items-center gap-1.5 animate-fade-up-delay">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="w-1.5 h-1.5 rounded-full"
            style={{
              background: "#3B82F6",
              animation: `pulse 1.2s ease-in-out ${i * 0.2}s infinite`,
              opacity: 0.6,
            }}
          />
        ))}
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 0.4; }
          50% { transform: scale(1.5); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
