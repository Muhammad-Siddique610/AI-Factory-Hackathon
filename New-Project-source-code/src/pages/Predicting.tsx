import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

const STEPS = [
  { label: "Uploading image…",              key: "uploading",      icon: "↑" },
  { label: "Preprocessing image…",          key: "preprocessing",  icon: "⚙" },
  { label: "Running flood segmentation AI…", key: "segmenting",    icon: "🧠" },
  { label: "Analyzing flood areas…",        key: "analyzing",      icon: "📊" },
  { label: "Generating report data…",       key: "reporting",      icon: "📄" },
];

const POLL_INTERVAL_MS = 3000;
const SIMULATED_STEP_DURATION_MS = 2500;
const MAX_POLL_TIME_MS = 120_000;



export default function Predicting() {
  const { predictionId } = useParams<{ predictionId: string }>();
  const navigate = useNavigate();

  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const stepTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef(Date.now());

  useEffect(() => {
    if (!predictionId) return;

    let stepIndex = 0;
    stepTimerRef.current = setInterval(() => {
      stepIndex++;
      if (stepIndex < STEPS.length) {
        setCurrentStep(stepIndex);
        setProgress((stepIndex / (STEPS.length - 1)) * 100);
      }
    }, SIMULATED_STEP_DURATION_MS);

    const checkPrediction = async () => {
      try {
        const { data, error: fetchError } = await supabase
          .from("predictions").select("status, result_data").eq("id", predictionId).single();
        if (fetchError) return;
        if (data?.status === "completed" || data?.status === "failed") {
          if (stepTimerRef.current) clearInterval(stepTimerRef.current);
          if (pollRef.current) clearInterval(pollRef.current);
          setProgress(100);
          setCurrentStep(STEPS.length - 1);
          setTimeout(() => {
            if (data?.status === "completed") navigate(`/results/${predictionId}`);
            else setError("The AI analysis encountered an error. Please try again.");
          }, 1200);
        }
        if (Date.now() - startTimeRef.current > MAX_POLL_TIME_MS) {
          if (stepTimerRef.current) clearInterval(stepTimerRef.current);
          if (pollRef.current) clearInterval(pollRef.current);
          setError("Analysis is taking longer than expected. Please check your History page.");
        }
      } catch { /* Silently retry */ }
    };

    checkPrediction();
    pollRef.current = setInterval(checkPrediction, POLL_INTERVAL_MS);
    return () => {
      if (stepTimerRef.current) clearInterval(stepTimerRef.current);
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [predictionId, navigate]);

  return (
    <div
      className="min-h-[calc(100vh-64px)] flex flex-col items-center justify-center px-4 py-16 dot-grid-bg"
      style={{ background: "linear-gradient(160deg, #080F1E 0%, #0F172A 100%)" }}
    >
      {/* Ambient glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse at center, rgba(59,130,246,0.1) 0%, transparent 60%)" }}
      />

      <div className="relative flex flex-col items-center max-w-sm w-full">
        {/* Pulsing rings */}
        <div className="relative mb-12">
          <div className="absolute w-32 h-32 rounded-full -inset-10 animate-ping"
            style={{ border: "1px solid rgba(59,130,246,0.12)", animationDuration: "2s" }} />
          <div className="absolute w-24 h-24 rounded-full -inset-7 animate-ping"
            style={{ border: "1px solid rgba(59,130,246,0.2)", animationDuration: "2s", animationDelay: "0.3s" }} />
          <div
            className="relative w-20 h-20 rounded-2xl flex items-center justify-center"
            style={{
              background: "linear-gradient(135deg, #3B82F6 0%, #6366F1 100%)",
              boxShadow: "0 0 40px rgba(59,130,246,0.4), 0 0 80px rgba(99,102,241,0.2)",
            }}
          >
            <svg className="w-9 h-9 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M2 10s3-4 6-4 6 4 6 4 3-4 6-4" />
              <path d="M2 16s3-4 6-4 6 4 6 4 3-4 6-4" />
            </svg>
          </div>
        </div>

        <h2 className="text-xl font-bold text-center mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "#F1F5F9" }}>
          {error ? "Analysis Error" : "Analyzing Flood Zones"}
        </h2>

        {error ? (
          <div className="mt-4 text-center">
            <p className="text-sm mb-6" style={{ color: "#EF4444" }}>{error}</p>
            <button
              onClick={() => navigate("/upload")}
              className="btn-primary px-6 py-2.5 text-sm cursor-pointer"
            >
              Try Again
            </button>
          </div>
        ) : (
          <>
            <p className="text-sm text-center mb-8" style={{ color: "#64748B" }}>
              {STEPS[currentStep]?.label ?? STEPS[STEPS.length - 1].label}
            </p>

            {/* Progress bar */}
            <div className="w-full mb-6">
              <div className="flex justify-between text-xs mb-2" style={{ color: "#475569" }}>
                <span>Processing</span>
                <span style={{ fontFamily: "'Space Mono', monospace", color: "#60A5FA" }}>
                  {Math.round(Math.max(progress, 5))}%
                </span>
              </div>
              <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(30,41,59,0.8)", border: "1px solid rgba(59,130,246,0.12)" }}>
                <div
                  className="h-full rounded-full transition-all duration-700 ease-out"
                  style={{
                    width: `${Math.max(progress, 5)}%`,
                    background: "linear-gradient(90deg, #3B82F6, #6366F1)",
                    boxShadow: "0 0 10px rgba(59,130,246,0.5)",
                  }}
                />
              </div>
            </div>

            {/* Step list */}
            <div className="w-full space-y-2.5">
              {STEPS.map((step, i) => {
                const isDone = i < currentStep;
                const isActive = i === currentStep;
                return (
                  <div
                    key={step.key}
                    className="flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-300"
                    style={{
                      background: isActive ? "rgba(59,130,246,0.08)" : "transparent",
                      border: isActive ? "1px solid rgba(59,130,246,0.2)" : "1px solid transparent",
                    }}
                  >
                    <div
                      className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-xs transition-all duration-300"
                      style={{
                        background: isDone
                          ? "rgba(16,185,129,0.15)"
                          : isActive
                          ? "rgba(59,130,246,0.2)"
                          : "rgba(30,41,59,0.5)",
                        border: isDone
                          ? "1px solid rgba(16,185,129,0.4)"
                          : isActive
                          ? "1px solid rgba(59,130,246,0.4)"
                          : "1px solid rgba(51,65,85,0.5)",
                      }}
                    >
                      {isDone ? (
                        <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M5 13l4 4L19 7" />
                        </svg>
                      ) : isActive ? (
                        <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: "#3B82F6" }} />
                      ) : (
                        <div className="w-1.5 h-1.5 rounded-full" style={{ background: "#334155" }} />
                      )}
                    </div>
                    <span
                      className="text-sm transition-colors duration-300"
                      style={{
                        color: isDone ? "#10B981" : isActive ? "#F1F5F9" : "#475569",
                        fontWeight: isActive ? "500" : "400",
                      }}
                    >
                      {step.label}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Prediction ID */}
            <p className="mt-8 text-xs" style={{ color: "#334155", fontFamily: "'Space Mono', monospace" }}>
              ID: {predictionId?.slice(0, 8)}…
            </p>
          </>
        )}
      </div>
    </div>
  );
}
