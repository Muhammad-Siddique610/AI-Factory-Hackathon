import { APP_NAME } from "../constants/config";
import { Code2, Cpu, Database, Globe, Layers, Shield } from "lucide-react";

const techStack = [
  { icon: Globe,    name: "React 18 + TypeScript",   detail: "Vite 7 — Frontend",                             color: "#3B82F6" },
  { icon: Layers,   name: "Tailwind CSS v4",          detail: "Styling & Design System",                       color: "#6366F1" },
  { icon: Database, name: "Supabase",                 detail: "Auth, Database, Storage, Edge Functions",       color: "#10B981" },
  { icon: Cpu,      name: "AI Segmentation Model",    detail: "U-Net / DeepLabV3+ for flood detection",        color: "#F59E0B" },
  { icon: Code2,    name: "jspdf + html2canvas",      detail: "PDF report generation",                         color: "#EC4899" },
  { icon: Shield,   name: "Row Level Security",       detail: "User data isolation & public sharing",          color: "#60A5FA" },
];

const team = [
  { name: "Amaim Farooq",          role: "AI/ML Engineer",                      initials: "AF", color: "#6366F1" },
  { name: "Muhammad Siddique",     role: "Full Stack Developer",                initials: "MS", color: "#3B82F6" },
  { name: "Abubakar Mughal",       role: "Full Stack Developer",                initials: "AM", color: "#10B981" },
  { name: "Ayesha Arshad",         role: "AI/ML Engineer",                      initials: "AA", color: "#F59E0B" },
  { name: "Muhammad Sohaib Farooq",role: "AI/ML Engineer",                      initials: "SF", color: "#EC4899" },
  { name: "Fatima Shahid",         role: "Product Manager",                     initials: "FS", color: "#06B6D4" },
];


function colorToRgba(hex: string, alpha: number) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

export default function About() {
  return (
    <div className="min-h-screen" style={{ background: "#0F172A" }}>
      <div className="max-w-3xl mx-auto px-4 py-12 sm:py-16">
        {/* Header */}
        <div className="mb-10">
          <div
            className="inline-flex items-center gap-2 mb-4 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-widest"
            style={{ background: "rgba(59,130,246,0.1)", border: "1px solid rgba(59,130,246,0.3)", color: "#60A5FA" }}
          >
            About
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "#F1F5F9" }}>
            About {APP_NAME}
          </h1>
        </div>

        <div className="space-y-10">
          {/* Description */}
          <div className="glass-card p-7">
            <p className="leading-relaxed text-sm" style={{ color: "#94A3B8" }}>
              {APP_NAME} is an AI-powered flood damage assessment tool built for disaster response teams, municipal
              authorities, and humanitarian organizations. It uses deep learning image segmentation models to analyze
              satellite and drone imagery, identifying flooded areas and providing risk assessments in seconds —
              enabling faster, data-driven decisions during critical moments.
            </p>
            <p className="mt-4 leading-relaxed text-sm" style={{ color: "#94A3B8" }}>
              Upload an image, and our AI model produces a detailed flood mask overlay, calculates the percentage of
              flooded area, and assigns a risk level. Results can be compared side-by-side with an interactive
              before/after slider, downloaded as a branded PDF report, or shared publicly with a simple link.
            </p>
          </div>

          {/* Tech Stack */}
          <div>
            <h2
              className="text-lg font-bold mb-5 flex items-center gap-2"
              style={{ fontFamily: "'Space Grotesk', sans-serif", color: "#F1F5F9" }}
            >
              <Code2 className="w-5 h-5" style={{ color: "#3B82F6" }} aria-hidden="true" />
              Technology Stack
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {techStack.map(({ icon: Icon, name, detail, color }) => (
                <div key={name} className="glass-card glass-card-hover flex items-start gap-3.5 p-4">
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
                    style={{
                      background: colorToRgba(color, 0.12),
                      border: `1px solid ${colorToRgba(color, 0.25)}`,
                    }}
                  >
                    <Icon className="w-4 h-4" style={{ color }} aria-hidden="true" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold" style={{ color: "#F1F5F9" }}>{name}</p>
                    <p className="text-xs mt-0.5" style={{ color: "#64748B" }}>{detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Team */}
          <div>
            <h2 className="text-lg font-bold mb-5" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "#F1F5F9" }}>
              Team
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {team.map(({ name, role, initials, color, photo }: { name: string; role: string; initials: string; color: string; photo?: string }) => (
                <div key={name} className="glass-card glass-card-hover p-5 text-center">
                  {photo ? (
                    /* Real photo with glowing ring */
                    <div
                      className="w-14 h-14 rounded-2xl mx-auto overflow-hidden"
                      style={{
                        border: `2px solid ${colorToRgba(color, 0.5)}`,
                        boxShadow: `0 0 16px ${colorToRgba(color, 0.3)}`,
                      }}
                    >
                      <img
                        src={photo}
                        alt={name}
                        className="w-full h-full object-cover object-top"
                        style={{ transform: "scaleX(-1)" }}
                      />
                    </div>
                  ) : (
                    /* Initials badge */
                    <div
                      className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto font-bold text-base"
                      style={{
                        background: colorToRgba(color, 0.12),
                        border: `1px solid ${colorToRgba(color, 0.3)}`,
                        color,
                        fontFamily: "'Space Grotesk', sans-serif",
                      }}
                    >
                      {initials}
                    </div>
                  )}
                  <p className="mt-3 text-sm font-semibold" style={{ color: "#F1F5F9" }}>{name}</p>
                  <p className="text-xs mt-0.5" style={{ color: "#64748B" }}>{role}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Footer note */}
          <p
            className="text-xs pt-6"
            style={{ color: "#334155", borderTop: "1px solid rgba(59,130,246,0.1)" }}
          >
            Built for hackathon demonstration purposes. © {new Date().getFullYear()} {APP_NAME}.
          </p>
        </div>
      </div>
    </div>
  );
}
