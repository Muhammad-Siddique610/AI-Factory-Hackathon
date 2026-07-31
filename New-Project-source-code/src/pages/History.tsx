import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Calendar,
  Activity,
  AlertTriangle,
  Upload,
  Loader2,
  RefreshCw,
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

const STATUS_BADGES: Record<string, { label: string; className: string }> = {
  completed: {
    label: "Completed",
    className: "bg-success/10 text-success",
  },
  processing: {
    label: "Processing",
    className: "bg-warning/10 text-warning",
  },
  failed: {
    label: "Failed",
    className: "bg-destructive/10 text-destructive",
  },
  pending: {
    label: "Pending",
    className: "bg-muted text-foreground/50",
  },
};

function SkeletonCard() {
  return (
    <div className="bg-white border border-border rounded-xl overflow-hidden animate-pulse">
      <div className="aspect-[3/2] bg-muted" />
      <div className="p-4 space-y-3">
        <div className="h-4 bg-muted rounded w-1/3" />
        <div className="h-4 bg-muted rounded w-1/2" />
        <div className="h-3 bg-muted rounded w-2/3" />
      </div>
    </div>
  );
}

export default function History() {
  const { user } = useAuth();

  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPredictions = async () => {
    if (!user) return;

    setIsLoading(true);
    setError(null);

    try {
      const { data, error: fetchError } = await supabase
        .from("predictions")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (fetchError) throw new Error(fetchError.message);

      setPredictions((data as Prediction[]) || []);
    } catch (err: any) {
      setError(err.message || "Failed to load analyses.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPredictions();
  }, [user]);

  // ── Loading state ──
  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-12 sm:py-16">
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
          Analysis History
        </h1>
        <p className="mt-2 text-foreground/70">Loading your past analyses…</p>
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </div>
    );
  }

  // ── Error state ──
  if (error) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-12 sm:py-16">
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
          Analysis History
        </h1>
        <div className="mt-8 bg-white border border-border rounded-xl p-12 text-center">
          <AlertTriangle
            className="w-12 h-12 text-destructive/60 mx-auto"
            aria-hidden="true"
          />
          <p className="mt-4 text-foreground/70">Couldn't load your analyses.</p>
          <p className="text-sm text-foreground/40 mt-1">{error}</p>
          <button
            onClick={fetchPredictions}
            className="mt-6 inline-flex items-center gap-2 bg-accent text-white px-6 py-2.5 rounded-lg font-semibold hover:opacity-90 active:scale-97 transition-all duration-150 cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" aria-hidden="true" />
            Retry
          </button>
        </div>
      </div>
    );
  }

  // ── Empty state ──
  if (predictions.length === 0) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-12 sm:py-16">
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
          Analysis History
        </h1>
        <div className="mt-8 bg-white border border-border rounded-xl p-12 text-center">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto">
            <Activity className="w-8 h-8 text-foreground/30" aria-hidden="true" />
          </div>
          <h2 className="mt-4 text-lg font-semibold text-foreground">
            No analyses yet
          </h2>
          <p className="mt-2 text-sm text-foreground/50 max-w-sm mx-auto">
            You haven't analyzed any satellite images yet. Upload your first
            image to detect floods.
          </p>
          <Link
            to="/upload"
            className="mt-6 inline-flex items-center gap-2 bg-accent text-white px-6 py-2.5 rounded-lg font-semibold hover:opacity-90 active:scale-97 transition-all duration-150 cursor-pointer"
          >
            <Upload className="w-4 h-4" aria-hidden="true" />
            Analyze Your First Image
          </Link>
        </div>
      </div>
    );
  }

  // ── Card grid ──
  return (
    <div className="max-w-5xl mx-auto px-4 py-12 sm:py-16">
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
          Analysis History
        </h1>
        <button
          onClick={fetchPredictions}
          className="text-sm text-foreground/50 hover:text-foreground transition-colors cursor-pointer inline-flex items-center gap-1"
          aria-label="Refresh analyses"
        >
          <RefreshCw className="w-3.5 h-3.5" aria-hidden="true" />
          Refresh
        </button>
      </div>
      <p className="text-foreground/70">
        {predictions.length} analys{predictions.length === 1 ? "is" : "es"} —
        review your past flood assessments.
      </p>

      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {predictions.map((p) => {
          const riskLevel = p.risk_level || "unknown";
          const riskLabel =
            riskLevel.charAt(0).toUpperCase() + riskLevel.slice(1);
          const floodPct = p.flood_percentage ?? 0;
          const analyzedDate = new Date(p.created_at).toLocaleDateString(
            "en-US",
            { year: "numeric", month: "short", day: "numeric" }
          );
          const statusBadge = STATUS_BADGES[p.status] || STATUS_BADGES.pending;

          return (
            <Link
              key={p.id}
              to={`/results/${p.id}`}
              className="group bg-white border border-border rounded-xl overflow-hidden shadow-sm hover:shadow-md hover:border-accent/30 transition-all duration-200 cursor-pointer flex flex-col"
            >
              {/* Thumbnail */}
              <div className="aspect-[3/2] bg-muted relative overflow-hidden">
                <img
                  src={p.original_image_url}
                  alt={`Analysis from ${analyzedDate}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
                <span
                  className={`absolute top-2 right-2 px-2 py-0.5 rounded-full text-xs font-semibold ${statusBadge.className}`}
                >
                  {statusBadge.label}
                </span>
              </div>

              {/* Card body */}
              <div className="p-4 flex flex-col gap-2 flex-1">
                <p className="text-sm text-foreground/50 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" aria-hidden="true" />
                  {analyzedDate}
                </p>

                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5">
                    <Activity className="w-4 h-4 text-accent" aria-hidden="true" />
                    <span className="font-semibold text-foreground tabular-nums">
                      {floodPct.toFixed(1)}%
                    </span>
                    <span className="text-xs text-foreground/40">flood</span>
                  </div>
                  <span
                    className={`ml-auto px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize ${
                      RISK_BG[riskLevel] || "bg-muted"
                    } ${RISK_COLORS[riskLevel] || "text-foreground/50"}`}
                  >
                    {riskLabel}
                  </span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
