import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

const STEPS = [
  { label: "Uploading image…", key: "uploading" },
  { label: "Preprocessing image…", key: "preprocessing" },
  { label: "Running flood segmentation AI…", key: "segmenting" },
  { label: "Analyzing flood areas…", key: "analyzing" },
  { label: "Generating report data…", key: "reporting" },
];

const POLL_INTERVAL_MS = 3000;
const SIMULATED_STEP_DURATION_MS = 2500;
const MAX_POLL_TIME_MS = 120_000; // 2 minutes timeout

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

    // Simulate step progression
    let stepIndex = 0;
    stepTimerRef.current = setInterval(() => {
      stepIndex++;
      if (stepIndex < STEPS.length) {
        setCurrentStep(stepIndex);
        setProgress((stepIndex / (STEPS.length - 1)) * 100);
      }
    }, SIMULATED_STEP_DURATION_MS);

    // Poll Supabase for actual prediction status
    const checkPrediction = async () => {
      try {
        const { data, error: fetchError } = await supabase
          .from("predictions")
          .select("status, result_data")
          .eq("id", predictionId)
          .single();

        if (fetchError) {
          // Prediction not found — keep polling
          return;
        }

        if (data?.status === "completed" || data?.status === "failed") {
          // Clean up timers
          if (stepTimerRef.current) clearInterval(stepTimerRef.current);
          if (pollRef.current) clearInterval(pollRef.current);

          // Complete progress
          setProgress(100);
          setCurrentStep(STEPS.length - 1);

          // Short delay so the user sees completion, then navigate
          setTimeout(() => {
            if (data?.status === "completed") {
              navigate(`/results/${predictionId}`);
            } else {
              setError("The AI analysis encountered an error. Please try again.");
            }
          }, 1200);
        }

        // Check timeout
        if (Date.now() - startTimeRef.current > MAX_POLL_TIME_MS) {
          if (stepTimerRef.current) clearInterval(stepTimerRef.current);
          if (pollRef.current) clearInterval(pollRef.current);
          setError("Analysis is taking longer than expected. Please check your History page.");
        }
      } catch {
        // Silently retry on network errors
      }
    };

    // First check immediately, then poll
    checkPrediction();
    pollRef.current = setInterval(checkPrediction, POLL_INTERVAL_MS);

    return () => {
      if (stepTimerRef.current) clearInterval(stepTimerRef.current);
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [predictionId, navigate]);

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 py-16">
      {/* Animated pulsing rings */}
      <div className="relative mb-10">
        {/* Outer ring */}
        <div className="absolute inset-0 w-24 h-24 -m-12 rounded-full border-2 border-accent/20 animate-ping" />
        {/* Middle ring */}
        <div
          className="absolute inset-0 w-20 h-20 -m-10 rounded-full border-2 border-accent/30 animate-ping"
          style={{ animationDelay: "0.3s", animationDuration: "2s" }}
        />
        {/* Center dot */}
        <div className="relative w-4 h-4 mx-auto rounded-full bg-accent shadow-[0_0_20px_rgba(37,99,235,0.5)]" />
      </div>

      {/* Title */}
      <h2 className="text-xl font-semibold text-foreground">
        {error ? "Analysis Error" : "Analyzing Flood Zones"}
      </h2>

      {/* Error state */}
      {error ? (
        <div className="mt-6 text-center max-w-md">
          <p className="text-destructive text-sm">{error}</p>
          <button
            onClick={() => navigate("/upload")}
            className="mt-6 bg-accent text-white px-6 py-2.5 rounded-lg text-sm font-semibold hover:opacity-90 active:scale-97 transition-all duration-150 cursor-pointer"
          >
            Try Again
          </button>
        </div>
      ) : (
        <>
          {/* Progress bar */}
          <div className="mt-8 w-full max-w-sm">
            <div className="h-1.5 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-accent rounded-full transition-all duration-700 ease-out"
                style={{ width: `${Math.max(progress, 5)}%` }}
              />
            </div>
          </div>

          {/* Step indicator */}
          <p className="mt-4 text-sm text-foreground/50 transition-opacity duration-300">
            {STEPS[currentStep]?.label ?? STEPS[STEPS.length - 1].label}
          </p>

          {/* Step dots */}
          <div className="mt-8 flex items-center gap-2">
            {STEPS.map((step, i) => (
              <div
                key={step.key}
                className={`w-2 h-2 rounded-full transition-all duration-500 ${
                  i < currentStep
                    ? "bg-accent scale-100"
                    : i === currentStep
                    ? "bg-accent scale-125 shadow-[0_0_8px_rgba(37,99,235,0.5)]"
                    : "bg-muted scale-100"
                }`}
              />
            ))}
          </div>

          {/* Prediction ID (subtle) */}
          <p className="mt-10 text-xs text-foreground/30 font-mono">
            ID: {predictionId?.slice(0, 8)}
          </p>
        </>
      )}
    </div>
  );
}
