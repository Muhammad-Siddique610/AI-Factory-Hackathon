import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import ReactCompareImage from "react-compare-image";
import {
  AlertTriangle, Activity, Target, Download, Share2,
  ArrowLeft, Loader2, Calendar, Check,
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

const RISK_STYLE: Record<string, { color: string; bg: string; border: string; glow: string }> = {
  low:      { color: "#10B981", bg: "rgba(16,185,129,0.1)",  border: "rgba(16,185,129,0.3)",  glow: "rgba(16,185,129,0.2)" },
  medium:   { color: "#F59E0B", bg: "rgba(245,158,11,0.1)",  border: "rgba(245,158,11,0.3)",  glow: "rgba(245,158,11,0.2)" },
  high:     { color: "#EF4444", bg: "rgba(239,68,68,0.1)",   border: "rgba(239,68,68,0.3)",   glow: "rgba(239,68,68,0.2)" },
  critical: { color: "#EF4444", bg: "rgba(239,68,68,0.15)",  border: "rgba(239,68,68,0.45)",  glow: "rgba(239,68,68,0.3)" },
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
        const { data, error: fetchError } = await supabase.from("predictions").select("*").eq("id", predictionId).single();
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
    } catch {
      alert("We couldn't generate the PDF. Please try again.");
    } finally {
      setIsDownloading(false);
    }
  };

  /* ── Loading ── */
  if (isLoading) return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 py-16" style={{ background: "#0F172A" }}>
      <div className="w-10 h-10 rounded-full border-2 border-[#1E293B] border-t-[#3B82F6] animate-spin" />
      <p className="mt-4 text-sm" style={{ color: "#475569" }}>Loading results…</p>
    </div>
  );

  /* ── Error ── */
  if (error || !prediction) return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 py-16 text-center" style={{ background: "#0F172A" }}>
      <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-5"
        style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)" }}>
        <AlertTriangle className="w-7 h-7" style={{ color: "#EF4444" }} aria-hidden="true" />
      </div>
      <h1 className="text-xl font-bold mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "#F1F5F9" }}>{error || "Something went wrong"}</h1>
      <p className="text-sm max-w-md mb-6" style={{ color: "#64748B" }}>We couldn't load the analysis results. The prediction may have been removed or the link is invalid.</p>
      <button onClick={() => navigate("/history")} className="btn-primary px-6 py-2.5 text-sm cursor-pointer">View History</button>
    </div>
  );

  /* ── Still processing ── */
  if (prediction.status === "processing") return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 py-16 text-center" style={{ background: "#0F172A" }}>
      <div className="w-12 h-12 rounded-full border-2 border-[#1E293B] border-t-[#3B82F6] animate-spin mb-5" />
      <h1 className="text-xl font-bold mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "#F1F5F9" }}>Still Processing</h1>
      <p className="text-sm max-w-md mb-6" style={{ color: "#64748B" }}>This analysis is still in progress. We'll update results as soon as they're ready.</p>
      <Link to={`/predicting/${prediction.id}`} className="btn-primary px-6 py-2.5 text-sm cursor-pointer">Check Progress</Link>
    </div>
  );

  /* ── Failed ── */
  if (prediction.status === "failed") return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 py-16 text-center" style={{ background: "#0F172A" }}>
      <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-5"
        style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)" }}>
        <AlertTriangle className="w-7 h-7" style={{ color: "#EF4444" }} aria-hidden="true" />
      </div>
      <h1 className="text-xl font-bold mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "#F1F5F9" }}>Analysis Failed</h1>
      <p className="text-sm max-w-md mb-6" style={{ color: "#64748B" }}>The AI was unable to analyze this image. It may not contain recognizable flood features, or the image quality was too low.</p>
      <button onClick={() => navigate("/upload")} className="btn-primary px-6 py-2.5 text-sm cursor-pointer">Try Another Image</button>
    </div>
  );

  /* ── Completed ── */
  const riskLevel = prediction.risk_level || "unknown";
  const riskLabel = riskLevel.charAt(0).toUpperCase() + riskLevel.slice(1);
  const riskStyle = RISK_STYLE[riskLevel] || { color: "#94A3B8", bg: "rgba(30,41,59,0.5)", border: "rgba(71,85,105,0.4)", glow: "transparent" };
  const floodPct = prediction.flood_percentage ?? 0;
  const confidence = prediction.confidence ?? 0;
  const analyzedDate = new Date(prediction.created_at).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  const maskImageUrl = prediction.mask_url || prediction.original_image_url;
  const hasOverlay = !!prediction.mask_url;

  return (
    <div className="min-h-screen" style={{ background: "#0F172A" }}>
      <div className="max-w-5xl mx-auto px-4 py-8 sm:py-12">
        {/* Back */}
        <Link to="/history" className="inline-flex items-center gap-1.5 text-sm mb-7 transition-colors cursor-pointer"
          style={{ color: "#475569" }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "#94A3B8")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "#475569")}
        >
          <ArrowLeft className="w-4 h-4" aria-hidden="true" />
          Back to History
        </Link>

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-5 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "#F1F5F9" }}>
              Analysis Results
            </h1>
            <p className="mt-1.5 text-sm flex items-center gap-1.5" style={{ color: "#64748B" }}>
              <Calendar className="w-3.5 h-3.5" aria-hidden="true" />
              {analyzedDate}
            </p>
          </div>

          <div className="flex gap-3 flex-wrap">
            <Link
              to={`/share/${prediction.id}`}
              className="btn-ghost inline-flex items-center gap-2 px-4 py-2.5 text-sm cursor-pointer"
            >
              <Share2 className="w-4 h-4" aria-hidden="true" />
              Share
            </Link>
            <button
              onClick={handleDownload}
              disabled={isDownloading}
              className="btn-primary inline-flex items-center gap-2 px-4 py-2.5 text-sm cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isDownloading ? <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
               : downloadDone ? <Check className="w-4 h-4" aria-hidden="true" />
               : <Download className="w-4 h-4" aria-hidden="true" />}
              {isDownloading ? "Generating…" : downloadDone ? "Downloaded" : "Download Report"}
            </button>
          </div>
        </div>

        {/* ── Stat cards ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* Flood Area */}
          <div className="glass-card p-5">
            <p className="text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 mb-3" style={{ color: "#64748B" }}>
              <Activity className="w-3.5 h-3.5" aria-hidden="true" />
              Flood Area
            </p>
            <p className="text-3xl font-bold tabular-nums" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "#60A5FA" }}>
              {floodPct.toFixed(1)}%
            </p>
            <div className="mt-3 h-1 rounded-full overflow-hidden" style={{ background: "rgba(59,130,246,0.15)" }}>
              <div className="h-full rounded-full transition-all duration-700"
                style={{ width: `${Math.min(floodPct, 100)}%`, background: "linear-gradient(90deg, #3B82F6, #6366F1)" }} />
            </div>
          </div>

          {/* Risk Level */}
          <div className="glass-card p-5">
            <p className="text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 mb-3" style={{ color: "#64748B" }}>
              <AlertTriangle className="w-3.5 h-3.5" aria-hidden="true" />
              Risk Level
            </p>
            <p className="text-3xl font-bold capitalize" style={{ fontFamily: "'Space Grotesk', sans-serif", color: riskStyle.color }}>
              {riskLabel}
            </p>
            <span
              className="inline-block mt-2 px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize"
              style={{ color: riskStyle.color, background: riskStyle.bg, border: `1px solid ${riskStyle.border}` }}
            >
              {riskLabel} Risk
            </span>
          </div>

          {/* Confidence */}
          <div className="glass-card p-5">
            <p className="text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 mb-3" style={{ color: "#64748B" }}>
              <Target className="w-3.5 h-3.5" aria-hidden="true" />
              Confidence
            </p>
            <p className="text-3xl font-bold tabular-nums" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "#10B981" }}>
              {confidence.toFixed(1)}%
            </p>
            <div className="mt-3 h-1 rounded-full overflow-hidden" style={{ background: "rgba(16,185,129,0.15)" }}>
              <div className="h-full rounded-full transition-all duration-700"
                style={{ width: `${Math.min(confidence, 100)}%`, background: "#10B981" }} />
            </div>
          </div>

          {/* Status */}
          <div className="glass-card p-5">
            <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: "#64748B" }}>Status</p>
            <p className="text-3xl font-bold capitalize" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "#10B981" }}>
              Done
            </p>
            <span
              className="inline-block mt-2 px-2.5 py-0.5 rounded-full text-xs font-semibold"
              style={{ color: "#10B981", background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.3)" }}
            >
              Complete
            </span>
          </div>
        </div>

        {/* ── Comparison slider ── */}
        <div className="mb-8">
          <h2 className="text-sm font-semibold uppercase tracking-wider mb-4" style={{ color: "#64748B" }}>
            Before & After Comparison
          </h2>
          {hasOverlay ? (
            <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid rgba(59,130,246,0.2)" }}>
              <ReactCompareImage
                leftImage={prediction.original_image_url}
                leftImageAlt="Original satellite image"
                leftImageLabel="Original"
                rightImage={maskImageUrl}
                rightImageAlt="Flood mask overlay"
                rightImageLabel="Flood Mask"
                sliderLineColor="#3B82F6"
                sliderLineWidth={3}
                handleSize={44}
                hover
              />
            </div>
          ) : (
            <div
              className="rounded-2xl p-16 text-center"
              style={{ background: "rgba(15,23,42,0.5)", border: "1px solid rgba(59,130,246,0.12)" }}
            >
              <p className="text-sm" style={{ color: "#475569" }}>Flood mask overlay is not yet available for this image.</p>
            </div>
          )}
        </div>

        {/* ── Individual views ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: "#64748B" }}>Original Image</h3>
            <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid rgba(59,130,246,0.15)" }}>
              <img src={prediction.original_image_url} alt="Original satellite image" className="w-full object-cover" />
            </div>
          </div>
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: "#64748B" }}>Flood Mask Overlay</h3>
            {hasOverlay ? (
              <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid rgba(59,130,246,0.15)" }}>
                <img src={maskImageUrl} alt="Flood mask overlay" className="w-full object-cover" />
              </div>
            ) : (
              <div
                className="rounded-2xl p-16 text-center h-full flex items-center justify-center"
                style={{ background: "rgba(15,23,42,0.5)", border: "1px solid rgba(59,130,246,0.12)" }}
              >
                <p className="text-sm" style={{ color: "#475569" }}>Mask overlay not available.</p>
              </div>
            )}
          </div>
        </div>

        {/* ── Bottom actions ── */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/upload" className="btn-primary px-8 py-3 text-base cursor-pointer inline-flex items-center justify-center gap-2">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="17 8 12 3 7 8"/>
              <line x1="12" y1="3" x2="12" y2="15"/>
            </svg>
            Analyze Another Image
          </Link>
          <Link to="/history" className="btn-ghost px-8 py-3 text-base cursor-pointer inline-flex items-center justify-center gap-2">
            View History
          </Link>
        </div>
      </div>
    </div>
  );
}
