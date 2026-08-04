import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Calendar, Activity, AlertTriangle, Upload, Loader2, RefreshCw } from "lucide-react";
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

const RISK_STYLE: Record<string, { color: string; bg: string; border: string }> = {
  low:      { color: "#10B981", bg: "rgba(16,185,129,0.1)",  border: "rgba(16,185,129,0.3)" },
  medium:   { color: "#F59E0B", bg: "rgba(245,158,11,0.1)",  border: "rgba(245,158,11,0.3)" },
  high:     { color: "#EF4444", bg: "rgba(239,68,68,0.1)",   border: "rgba(239,68,68,0.3)" },
  critical: { color: "#EF4444", bg: "rgba(239,68,68,0.15)",  border: "rgba(239,68,68,0.45)" },
};

const STATUS_STYLE: Record<string, { label: string; color: string; bg: string; border: string }> = {
  completed: { label: "Complete",   color: "#10B981", bg: "rgba(16,185,129,0.15)",  border: "rgba(16,185,129,0.3)" },
  processing: { label: "Processing", color: "#F59E0B", bg: "rgba(245,158,11,0.15)", border: "rgba(245,158,11,0.3)" },
  failed:    { label: "Failed",     color: "#EF4444", bg: "rgba(239,68,68,0.15)",   border: "rgba(239,68,68,0.3)" },
  pending:   { label: "Pending",    color: "#94A3B8", bg: "rgba(71,85,105,0.15)",   border: "rgba(71,85,105,0.3)" },
};

function SkeletonCard() {
  return (
    <div className="glass-card overflow-hidden animate-pulse">
      <div className="aspect-[3/2]" style={{ background: "rgba(30,41,59,0.5)" }} />
      <div className="p-4 space-y-3">
        <div className="h-3 rounded-full w-1/3" style={{ background: "rgba(51,65,85,0.8)" }} />
        <div className="h-4 rounded-full w-1/2" style={{ background: "rgba(51,65,85,0.8)" }} />
        <div className="h-3 rounded-full w-2/3" style={{ background: "rgba(51,65,85,0.6)" }} />
      </div>
    </div>
  );
}

export default function History() {
  const { user } = useAuth();
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchPredictions = async () => {
    if (!user) return;
    setError(null);
    try {
      const { data, error: fetchError } = await supabase
        .from("predictions").select("*").eq("user_id", user.id).order("created_at", { ascending: false });
      if (fetchError) throw new Error(fetchError.message);
      setPredictions((data as Prediction[]) || []);
    } catch (err: any) {
      setError(err.message || "Failed to load analyses.");
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchPredictions();
  };

  useEffect(() => { fetchPredictions(); }, [user]);

  /* ── Loading ── */
  if (isLoading) return (
    <div className="min-h-screen" style={{ background: "#0F172A" }}>
      <div className="max-w-6xl mx-auto px-4 py-12 sm:py-16">
        <div className="mb-10">
          <h1 className="text-2xl sm:text-3xl font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "#F1F5F9" }}>Analysis History</h1>
          <p className="mt-2 text-sm" style={{ color: "#64748B" }}>Loading your past analyses…</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3].map((i) => <SkeletonCard key={i} />)}
        </div>
      </div>
    </div>
  );

  /* ── Error ── */
  if (error) return (
    <div className="min-h-screen" style={{ background: "#0F172A" }}>
      <div className="max-w-6xl mx-auto px-4 py-12 sm:py-16">
        <h1 className="text-2xl sm:text-3xl font-bold mb-8" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "#F1F5F9" }}>Analysis History</h1>
        <div className="glass-card p-16 text-center">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-5"
            style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)" }}>
            <AlertTriangle className="w-6 h-6" style={{ color: "#EF4444" }} aria-hidden="true" />
          </div>
          <p className="font-semibold mb-1" style={{ color: "#F1F5F9" }}>Couldn't load your analyses</p>
          <p className="text-sm mb-6" style={{ color: "#64748B" }}>{error}</p>
          <button onClick={fetchPredictions} className="btn-primary inline-flex items-center gap-2 px-5 py-2.5 text-sm cursor-pointer">
            <RefreshCw className="w-4 h-4" aria-hidden="true" />
            Retry
          </button>
        </div>
      </div>
    </div>
  );

  /* ── Empty ── */
  if (predictions.length === 0) return (
    <div className="min-h-screen" style={{ background: "#0F172A" }}>
      <div className="max-w-6xl mx-auto px-4 py-12 sm:py-16">
        <h1 className="text-2xl sm:text-3xl font-bold mb-8" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "#F1F5F9" }}>Analysis History</h1>
        <div className="glass-card p-20 text-center">
          <div
            className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6"
            style={{ background: "rgba(59,130,246,0.08)", border: "1px solid rgba(59,130,246,0.2)" }}
          >
            <Activity className="w-9 h-9" style={{ color: "#3B82F6" }} aria-hidden="true" />
          </div>
          <h2 className="text-xl font-bold mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "#F1F5F9" }}>No analyses yet</h2>
          <p className="text-sm mb-8 max-w-sm mx-auto" style={{ color: "#64748B" }}>
            You haven't analyzed any satellite images yet. Upload your first image to detect floods.
          </p>
          <Link to="/upload" className="btn-primary inline-flex items-center gap-2 px-6 py-3 text-sm cursor-pointer">
            <Upload className="w-4 h-4" aria-hidden="true" />
            Analyze Your First Image
          </Link>
        </div>
      </div>
    </div>
  );

  /* ── Grid ── */
  return (
    <div className="min-h-screen" style={{ background: "#0F172A" }}>
      <div className="max-w-6xl mx-auto px-4 py-12 sm:py-16">
        {/* Header */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "#F1F5F9" }}>
              Analysis History
            </h1>
            <p className="mt-1.5 text-sm" style={{ color: "#64748B" }}>
              {predictions.length} analys{predictions.length === 1 ? "is" : "es"} — review your past flood assessments.
            </p>
          </div>

          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="btn-ghost inline-flex items-center gap-1.5 px-3.5 py-2 text-sm cursor-pointer disabled:opacity-50"
            aria-label="Refresh analyses"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin" : ""}`} aria-hidden="true" />
            Refresh
          </button>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {predictions.map((p) => {
            const riskLevel = p.risk_level || "unknown";
            const riskLabel = riskLevel.charAt(0).toUpperCase() + riskLevel.slice(1);
            const floodPct = p.flood_percentage ?? 0;
            const analyzedDate = new Date(p.created_at).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
            const statusStyle = STATUS_STYLE[p.status] || STATUS_STYLE.pending;
            const riskStyle = RISK_STYLE[riskLevel];

            return (
              <Link
                key={p.id}
                to={`/results/${p.id}`}
                className="glass-card glass-card-hover overflow-hidden flex flex-col cursor-pointer"
              >
                {/* Thumbnail */}
                <div className="aspect-[16/9] relative overflow-hidden" style={{ background: "#080F1E" }}>
                  <img
                    src={p.original_image_url}
                    alt={`Analysis from ${analyzedDate}`}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    style={{ transition: "transform 0.3s ease" }}
                    loading="lazy"
                    onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
                    onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                  />
                  {/* Status badge */}
                  <span
                    className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full text-xs font-semibold"
                    style={{ color: statusStyle.color, background: statusStyle.bg, border: `1px solid ${statusStyle.border}` }}
                  >
                    {statusStyle.label}
                  </span>
                </div>

                {/* Card body */}
                <div className="p-4 flex flex-col gap-3 flex-1">
                  <p className="text-xs flex items-center gap-1.5" style={{ color: "#64748B" }}>
                    <Calendar className="w-3 h-3" aria-hidden="true" />
                    {analyzedDate}
                  </p>

                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5">
                      <Activity className="w-3.5 h-3.5" style={{ color: "#3B82F6" }} aria-hidden="true" />
                      <span className="font-bold tabular-nums text-sm" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "#60A5FA" }}>
                        {floodPct.toFixed(1)}%
                      </span>
                      <span className="text-xs" style={{ color: "#475569" }}>flooded</span>
                    </div>

                    {riskStyle && (
                      <span
                        className="ml-auto px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize"
                        style={{ color: riskStyle.color, background: riskStyle.bg, border: `1px solid ${riskStyle.border}` }}
                      >
                        {riskLabel}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
