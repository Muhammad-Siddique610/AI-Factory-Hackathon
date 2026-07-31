import { APP_NAME } from "../constants/config";
import { Code2, Cpu, Database, Globe, Layers, Shield } from "lucide-react";

const techStack = [
  { icon: Globe, name: "React 18 + TypeScript", detail: "Vite 7 — Frontend" },
  { icon: Layers, name: "Tailwind CSS v4", detail: "Styling & Design System" },
  { icon: Database, name: "Supabase", detail: "Auth, Database, Storage, Edge Functions" },
  { icon: Cpu, name: "AI Segmentation Model", detail: "U-Net / DeepLabV3+ for flood detection" },
  { icon: Code2, name: "jspdf + html2canvas", detail: "PDF report generation" },
  { icon: Shield, name: "Row Level Security", detail: "User data isolation & public sharing" },
];

const team = [
  { name: "Alex Chen", role: "Full-Stack Developer" },
  { name: "Priya Sharma", role: "AI/ML Engineer" },
  { name: "Marcus Johnson", role: "UX Designer" },
  { name: "Sarah Okafor", role: "Product Lead" },
];

export default function About() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12 sm:py-16">
      <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
        About {APP_NAME}
      </h1>

      <div className="mt-8 space-y-10 text-foreground/80">
        {/* Description */}
        <div>
          <p className="leading-relaxed">
            {APP_NAME} is an AI-powered flood damage assessment tool built for
            disaster response teams, municipal authorities, and humanitarian
            organizations. It uses deep learning image segmentation models to
            analyze satellite and drone imagery, identifying flooded areas and
            providing risk assessments in seconds — enabling faster, data-driven
            decisions during critical moments.
          </p>
          <p className="mt-4 leading-relaxed">
            Upload an image, and our AI model produces a detailed flood mask
            overlay, calculates the percentage of flooded area, and assigns a
            risk level. Results can be compared side-by-side with an interactive
            before/after slider, downloaded as a branded PDF report, or shared
            publicly with a simple link.
          </p>
        </div>

        {/* Tech Stack */}
        <div>
          <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <Code2 className="w-5 h-5 text-accent" aria-hidden="true" />
            Technology Stack
          </h2>
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
            {techStack.map(({ icon: Icon, name, detail }) => (
              <div
                key={name}
                className="flex items-start gap-3 bg-white border border-border rounded-lg p-4"
              >
                <div className="w-8 h-8 rounded-md bg-accent/10 text-accent flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Icon className="w-4 h-4" aria-hidden="true" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">{name}</p>
                  <p className="text-xs text-foreground/50 mt-0.5">{detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Team */}
        <div>
          <h2 className="text-lg font-semibold text-foreground">Team</h2>
          <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-4">
            {team.map(({ name, role }) => (
              <div
                key={name}
                className="bg-white border border-border rounded-lg p-4 text-center"
              >
                <div className="w-12 h-12 rounded-full bg-accent/10 text-accent flex items-center justify-center mx-auto font-bold text-lg">
                  {name.charAt(0)}
                </div>
                <p className="mt-3 text-sm font-semibold text-foreground">
                  {name}
                </p>
                <p className="text-xs text-foreground/50">{role}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Footer note */}
        <p className="text-sm text-foreground/40 pt-4 border-t border-border">
          Built for hackathon demonstration purposes. &copy;{" "}
          {new Date().getFullYear()} {APP_NAME}.
        </p>
      </div>
    </div>
  );
}
