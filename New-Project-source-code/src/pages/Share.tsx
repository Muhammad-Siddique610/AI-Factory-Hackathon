import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import ReactCompareImage from "react-compare-image";
import {
  AlertTriangle,
  Activity,
  Target,
  Calendar,
  Loader2,
  Copy,
  Check,
  Upload,
} from "lucide-react";
import { supabase } from "../lib/supabase";
import { useAuth } from "../contexts/AuthContext";

interface Prediction {
  id: string;
  user_id: string;
  original_image_url: string;
  mask_url: string | null;
  status: string;
  risk_level: string | null;
  flood_percentage: number | null;
  confidence: number | null;
  is_public: boolean;
  created_at: string;
}

const RISK_COLORS: Record<string, string> = {
  low: "text-success",
  medium: "text-warning",
  high: "text-destructive",
  critical: "text-destructive",
};

const RISK_BG: Record<string, string> = {
  low: "bg-success/10",
  medium: "bg-warning/10",
  high: "bg-destructive/10",
  critical: "bg-destructive/10",
};

export default function Share() {
  const { predictionId } = useParams<{ predictionId: string }>();
  const { user } = useAuth();

  const [prediction, setPrediction] = useState<Prediction | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const shareUrl = predictionId
    ? `${window.location.origin}/share/${predictionId}`
    : "";

  useEffect(() => {
    if (!predictionId) return;

    const fetchPrediction = async () => {
      try {
        const { data, error: fetchError } = await supabase
          .from("predictions")
          .select("*")
          .eq("id", predictionId)
          .single();

        if (fetchError) throw new Error(fetchError.message);
        if (!data) throw new Error("Prediction not found.");
        if (!data.is_public && data.user_id !== user?.id) {
          throw new Error("This analysis is not publicly shared.");
        }

        setPrediction(data as Prediction);
      } catch (err: any) {
        setError(err.message || "Could not load the shared analysis.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPrediction();
  }, [predictionId, user]);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback for older browsers
      const input = document.createElement("input");
      input.value = shareUrl;
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      document.body.removeChild(input);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const isOwner = user?.id === prediction?.user_id;

  // ── Loading state ──
  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 py-16">
        <Loader2 className="w-8 h-8 text-accent animate-spin" aria-hidden="true" />
        <p className="mt-4 text-sm text-foreground/50">Loading shared analysis…</p>
      </div>
    );
  }

  // ── Error state ──
  if (error || !prediction) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 py-16 text-center">
        <AlertTriangle
          className="w-12 h-12 text-destructive/60"
          aria-hidden="true"
        />
        <h1 className="mt-4 text-xl font-semibold text-foreground">
          {error || "Analysis not found"}
        </h1>
        <p className="mt-2 text-sm text-foreground/50 max-w-md">
          This analysis may have been removed, set to private, or the link is invalid.
        </p>
        <Link
          to="/signup"
          className="mt-6 bg-accent text-white px-6 py-2.5 rounded-lg text-sm font-semibold hover:opacity-90 active:scale-97 transition-all duration-150 cursor-pointer"
        >
          Try FloodScope Yourself
        </Link>
      </div>
    );
  }

  // ── Failed state ──
  if (prediction.status === "failed") {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 py-16 text-center">
        <AlertTriangle
          className="w-12 h-12 text-destructive/60"
          aria-hidden="true"
        />
        <h1 className="mt-4 text-xl font-semibold text-foreground">
          Analysis Failed
        </h1>
        <p className="mt-2 text-sm text-foreground/50 max-w-md">
          The AI was unable to analyze this image.
        </p>
      </div>
    );
  }

  // ── Still processing ──
  if (prediction.status === "processing") {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 py-16 text-center">
        <div className="w-12 h-12 border-4 border-muted border-t-accent rounded-full animate-spin" />
        <h1 className="mt-4 text-xl font-semibold text-foreground">
          Processing
        </h1>
        <p className="mt-2 text-sm text-foreground/50 max-w-md">
          This analysis is still being processed. Check back soon.
        </p>
      </div>
    );
  }

  // ── Completed ──
  const riskLevel = prediction.risk_level || "unknown";
  const riskLabel = riskLevel.charAt(0).toUpperCase() + riskLevel.slice(1);
  const floodPct = prediction.flood_percentage ?? 0;
  const confidence = prediction.confidence ?? 0;
  const analyzedDate = new Date(prediction.created_at).toLocaleDateString(
    "en-US",
    { year: "numeric", month: "long", day: "numeric" }
  );
  const maskImageUrl = prediction.mask_url || prediction.original_image_url;
  const hasOverlay = !!prediction.mask_url;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 sm:py-12">
      {/* Banner for non-owners */}
      {!isOwner && (
        <div className="bg-accent/10 border border-accent/20 rounded-lg px-4 py-3 mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <p className="text-sm text-accent">
            You're viewing a shared analysis.{" "}
            <span className="hidden sm:inline">
              Sign up to detect floods in your own satellite images.
            </span>
          </p>
          <Link
            to="/signup"
            className="inline-flex items-center gap-1.5 bg-accent text-white px-4 py-2 rounded-lg text-sm font-semibold hover:opacity-90 active:scale-97 transition-all duration-150 cursor-pointer whitespace-nowrap"
          >
            <Upload className="w-3.5 h-3.5" aria-hidden="true" />
            Try It Yourself
          </Link>
        </div>
      )}

      {/* Owner banner */}
      {isOwner && (
        <div className="bg-success/10 border border-success/20 rounded-lg px-4 py-3 mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <p className="text-sm text-success">
            This is your analysis. Anyone with the link can view it.
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyLink}
              className="inline-flex items-center gap-1.5 border border-success/30 text-success px-4 py-2 rounded-lg text-sm font-semibold hover:bg-success/15 active:scale-97 transition-all duration-150 cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5" aria-hidden="true" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" aria-hidden="true" />
                  Copy Link
                </>
              )}
            </button>
            <Link
              to={`/results/${prediction.id}`}
              className="inline-flex items-center gap-1.5 bg-accent text-white px-4 py-2 rounded-lg text-sm font-semibold hover:opacity-90 active:scale-97 transition-all duration-150 cursor-pointer"
            >
              Full Results
            </Link>
          </div>
        </div>
      )}

      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
          Flood Analysis
        </h1>
        <p className="mt-1 text-sm text-foreground/50 flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5" aria-hidden="true" />
          {analyzedDate}
        </p>
      </div>

      {/* Stats cards */}
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-border rounded-xl p-6 shadow-sm">
          <p className="text-sm text-foreground/50 flex items-center gap-1.5">
            <Activity className="w-4 h-4" aria-hidden="true" />
            Flood Area
          </p>
          <p className="text-3xl font-bold text-foreground mt-1 tabular-nums">
            {floodPct.toFixed(1)}%
          </p>
          <div className="mt-2 w-full h-1.5 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-accent rounded-full transition-all duration-700"
              style={{ width: `${Math.min(floodPct, 100)}%` }}
            />
          </div>
        </div>

        <div className="bg-white border border-border rounded-xl p-6 shadow-sm">
          <p className="text-sm text-foreground/50 flex items-center gap-1.5">
            <AlertTriangle className="w-4 h-4" aria-hidden="true" />
            Risk Level
          </p>
          <p
            className={`text-3xl font-bold mt-1 capitalize ${RISK_COLORS[riskLevel] || "text-foreground"}`}
          >
            {riskLabel}
          </p>
          <span
            className={`inline-block mt-2 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
              RISK_BG[riskLevel] || "bg-muted text-foreground/50"
            } ${RISK_COLORS[riskLevel] || "text-foreground/50"}`}
          >
            {riskLabel} Risk
          </span>
        </div>

        <div className="bg-white border border-border rounded-xl p-6 shadow-sm">
          <p className="text-sm text-foreground/50 flex items-center gap-1.5">
            <Target className="w-4 h-4" aria-hidden="true" />
            Confidence
          </p>
          <p className="text-3xl font-bold text-foreground mt-1 tabular-nums">
            {confidence.toFixed(1)}%
          </p>
          <div className="mt-2 w-full h-1.5 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-success rounded-full transition-all duration-700"
              style={{ width: `${Math.min(confidence, 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Comparison slider */}
      <div className="mt-8">
        <h2 className="text-lg font-semibold text-foreground mb-4">
          Before &amp; After Comparison
        </h2>
        {hasOverlay ? (
          <div className="rounded-xl overflow-hidden border border-border">
            <ReactCompareImage
              leftImage={prediction.original_image_url}
              leftImageAlt="Original satellite image"
              leftImageLabel="Original"
              rightImage={maskImageUrl}
              rightImageAlt="Flood mask overlay"
              rightImageLabel="Flood Mask"
              sliderLineColor="#2563EB"
              sliderLineWidth={3}
              handleSize={44}
              hover
            />
          </div>
        ) : (
          <div className="rounded-xl border border-border bg-muted/30 p-12 text-center">
            <p className="text-foreground/40">
              Flood mask overlay is not yet available for this image.
            </p>
          </div>
        )}
      </div>

      {/* CTA for non-owners at bottom */}
      {!isOwner && (
        <div className="mt-10 flex flex-col items-center text-center">
          <p className="text-foreground/70 text-sm max-w-md">
            Want to analyze your own satellite imagery for flood detection?
          </p>
          <Link
            to="/signup"
            className="mt-4 bg-accent text-white px-8 py-3 rounded-lg text-base font-semibold hover:opacity-90 active:scale-97 transition-all duration-150 cursor-pointer inline-flex items-center gap-2"
          >
            <Upload className="w-4 h-4" aria-hidden="true" />
            Get Started Free
          </Link>
        </div>
      )}
    </div>
  );
}
