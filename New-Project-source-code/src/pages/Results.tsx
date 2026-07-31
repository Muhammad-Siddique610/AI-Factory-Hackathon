import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import ReactCompareImage from "react-compare-image";
import {
  AlertTriangle,
  Activity,
  Target,
  Download,
  Share2,
  ArrowLeft,
  Loader2,
  Calendar,
  Check,
} from "lucide-react";
import { supabase } from "../lib/supabase";
import { generatePdfReport } from "../utils/pdfReport";

interface Prediction {
  id: string;
  original_image_url: string;
  mask_url: string | null;
  status: string;
  risk_level: string | null;
  flood_percentage: number | null;
  confidence: number | null;
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

export default function Results() {
  const { predictionId } = useParams<{ predictionId: string }>();
  const navigate = useNavigate();

  const [prediction, setPrediction] = useState<Prediction | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadDone, setDownloadDone] = useState(false);

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

        setPrediction(data as Prediction);
      } catch (err: any) {
        setError(err.message || "Could not load prediction results.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPrediction();
  }, [predictionId]);

  const handleDownload = async () => {
    if (!prediction || isDownloading) return;
    setIsDownloading(true);
    try {
      await generatePdfReport({
        id: prediction.id,
        originalImageUrl: prediction.original_image_url,
        maskUrl: prediction.mask_url,
        floodPercentage: prediction.flood_percentage ?? 0,
        riskLevel: prediction.risk_level || "unknown",
        confidence: prediction.confidence ?? 0,
        createdAt: prediction.created_at,
      });
      setDownloadDone(true);
      setTimeout(() => setDownloadDone(false), 3000);
    } catch (err: any) {
      // Let the user know if something went wrong
      alert("We couldn't generate the PDF. Please try again.");
    } finally {
      setIsDownloading(false);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 py-16">
        <Loader2 className="w-8 h-8 text-accent animate-spin" aria-hidden="true" />
        <p className="mt-4 text-sm text-foreground/50">Loading results…</p>
      </div>
    );
  }

  // Error state
  if (error || !prediction) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 py-16 text-center">
        <AlertTriangle
          className="w-12 h-12 text-destructive/60"
          aria-hidden="true"
        />
        <h1 className="mt-4 text-xl font-semibold text-foreground">
          {error || "Something went wrong"}
        </h1>
        <p className="mt-2 text-sm text-foreground/50 max-w-md">
          We couldn't load the analysis results. The prediction may have been
          removed or the link is invalid.
        </p>
        <button
          onClick={() => navigate("/history")}
          className="mt-6 bg-accent text-white px-6 py-2.5 rounded-lg text-sm font-semibold hover:opacity-90 active:scale-97 transition-all duration-150 cursor-pointer"
        >
          View History
        </button>
      </div>
    );
  }

  // Still processing
  if (prediction.status === "processing") {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 py-16 text-center">
        <div className="w-12 h-12 border-4 border-muted border-t-accent rounded-full animate-spin" />
        <h1 className="mt-4 text-xl font-semibold text-foreground">
          Still Processing
        </h1>
        <p className="mt-2 text-sm text-foreground/50 max-w-md">
          This analysis is still in progress. We'll update results as soon as
          they're ready.
        </p>
        <Link
          to={`/predicting/${prediction.id}`}
          className="mt-6 bg-accent text-white px-6 py-2.5 rounded-lg text-sm font-semibold hover:opacity-90 active:scale-97 transition-all duration-150 cursor-pointer"
        >
          Check Progress
        </Link>
      </div>
    );
  }

  // Failed
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
          The AI was unable to analyze this image. It may not contain
          recognizable flood features, or the image quality was too low.
        </p>
        <button
          onClick={() => navigate("/upload")}
          className="mt-6 bg-accent text-white px-6 py-2.5 rounded-lg text-sm font-semibold hover:opacity-90 active:scale-97 transition-all duration-150 cursor-pointer"
        >
          Try Another Image
        </button>
      </div>
    );
  }

  // Completed — render full results
  const riskLevel = prediction.risk_level || "unknown";
  const riskLabel =
    riskLevel.charAt(0).toUpperCase() + riskLevel.slice(1);
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
      {/* Back link */}
      <Link
        to="/history"
        className="inline-flex items-center gap-1.5 text-sm text-foreground/50 hover:text-foreground transition-colors cursor-pointer mb-6"
      >
        <ArrowLeft className="w-4 h-4" aria-hidden="true" />
        Back to History
      </Link>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
            Analysis Results
          </h1>
          <p className="mt-1 text-sm text-foreground/50 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5" aria-hidden="true" />
            {analyzedDate}
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex gap-3">
          <Link
            to={`/share/${prediction.id}`}
            className="inline-flex items-center gap-2 border border-border text-foreground px-4 py-2.5 rounded-lg text-sm font-semibold hover:bg-muted active:scale-97 transition-all duration-150 cursor-pointer"
          >
            <Share2 className="w-4 h-4" aria-hidden="true" />
            Share
          </Link>
          <button
            onClick={handleDownload}
            disabled={isDownloading}
            className="inline-flex items-center gap-2 bg-accent text-white px-4 py-2.5 rounded-lg text-sm font-semibold hover:opacity-90 active:scale-97 transition-all duration-150 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isDownloading ? (
              <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
            ) : downloadDone ? (
              <Check className="w-4 h-4" aria-hidden="true" />
            ) : (
              <Download className="w-4 h-4" aria-hidden="true" />
            )}
            {isDownloading ? "Generating…" : downloadDone ? "Downloaded" : "Download Report"}
          </button>
        </div>
      </div>

      {/* Stats cards */}
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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

        <div className="bg-white border border-border rounded-xl p-6 shadow-sm">
          <p className="text-sm text-foreground/50">Status</p>
          <p className="text-3xl font-bold text-success mt-1 capitalize">
            {prediction.status}
          </p>
          <span className="inline-block mt-2 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-success/10 text-success">
            Complete
          </span>
        </div>
      </div>

      {/* Comparison slider — before/after */}
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

      {/* Individual views */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-sm font-semibold text-foreground/50 uppercase tracking-wide mb-3">
            Original Image
          </h3>
          <div className="rounded-xl overflow-hidden border border-border">
            <img
              src={prediction.original_image_url}
              alt="Original satellite image"
              className="w-full object-cover"
            />
          </div>
        </div>
        <div>
          <h3 className="text-sm font-semibold text-foreground/50 uppercase tracking-wide mb-3">
            Flood Mask Overlay
          </h3>
          {hasOverlay ? (
            <div className="rounded-xl overflow-hidden border border-border">
              <img
                src={maskImageUrl}
                alt="Flood mask overlay"
                className="w-full object-cover"
              />
            </div>
          ) : (
            <div className="rounded-xl border border-border bg-muted/30 p-12 text-center">
              <p className="text-foreground/40 text-sm">
                Mask overlay not available.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Bottom actions */}
      <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
        <Link
          to="/upload"
          className="inline-flex items-center justify-center gap-2 bg-accent text-white px-8 py-3 rounded-lg text-base font-semibold hover:opacity-90 active:scale-97 transition-all duration-150 cursor-pointer"
        >
          Analyze Another Image
        </Link>
        <Link
          to="/history"
          className="inline-flex items-center justify-center gap-2 border border-border text-foreground px-8 py-3 rounded-lg text-base font-semibold hover:bg-muted active:scale-97 transition-all duration-150 cursor-pointer"
        >
          View History
        </Link>
      </div>
    </div>
  );
}
