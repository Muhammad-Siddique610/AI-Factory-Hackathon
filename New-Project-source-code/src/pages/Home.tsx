import { Link } from "react-router-dom";
import { Upload, History, Zap, Eye, FileText } from "lucide-react";
import { APP_NAME } from "../constants/config";
import { useAuth } from "../contexts/AuthContext";

const features = [
  {
    icon: Zap,
    title: "Rapid Analysis",
    desc: "Upload an image and get AI-powered flood segmentation with risk assessment in under 30 seconds.",
  },
  {
    icon: Eye,
    title: "Before & After Comparison",
    desc: "Compare pre-flood and post-flood imagery side by side with an interactive slider.",
  },
  {
    icon: FileText,
    title: "Shareable Reports",
    desc: "Generate branded PDF reports and share results via a unique public link — no login required for viewers.",
  },
];

export default function Home() {
  const { user } = useAuth();

  return (
    <div>
      {/* Hero */}
      <section className="bg-primary text-on-primary py-20 sm:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
            {APP_NAME}
          </h1>
          <p className="mt-4 text-lg sm:text-xl text-on-primary/70 max-w-2xl mx-auto">
            AI-powered flood damage assessment for disaster response teams.
            Upload satellite or drone imagery and get flood segmentation,
            risk level, and area analysis in seconds.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/upload"
              className="bg-accent text-white px-8 py-3 rounded-lg text-lg font-semibold hover:opacity-90 active:scale-97 transition-all duration-150 cursor-pointer inline-flex items-center justify-center gap-2"
            >
              <Upload className="w-5 h-5" aria-hidden="true" />
              Analyze New Image
            </Link>
            <Link
              to="/history"
              className="border border-on-primary/30 text-on-primary px-8 py-3 rounded-lg text-lg font-semibold hover:bg-on-primary/10 transition-colors duration-150 cursor-pointer inline-flex items-center justify-center gap-2"
            >
              <History className="w-5 h-5" aria-hidden="true" />
              View History
            </Link>
          </div>

          {/* Unauthenticated CTA */}
          {!user && (
            <div className="mt-8 pt-8 border-t border-on-primary/15">
              <p className="text-on-primary/60 text-sm mb-4">
                New to {APP_NAME}? Create a free account to start analyzing.
              </p>
              <Link
                to="/signup"
                className="inline-flex items-center gap-2 border-2 border-white/80 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-white hover:text-primary transition-all duration-150 cursor-pointer"
              >
                Get Started — Create Account
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Features */}
      <section className="py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground text-center mb-12">
            How It Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="bg-white border border-border rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-200"
              >
                <div className="w-10 h-10 rounded-lg bg-accent/10 text-accent flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5" aria-hidden="true" />
                </div>
                <h3 className="text-lg font-semibold text-foreground">
                  {title}
                </h3>
                <p className="mt-2 text-sm text-foreground/70">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
