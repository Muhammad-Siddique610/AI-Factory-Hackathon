import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

type Theme = "dark" | "light";
interface ThemeContextValue { theme: Theme; isDark: boolean; toggleTheme: () => void; }
const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

const DARK_VARS: Record<string, string> = {
  "--bg-base":        "#0F172A",
  "--bg-deep":        "#080F1E",
  "--bg-surface":     "#0A1120",
  "--text-primary":   "#F1F5F9",
  "--text-secondary": "#94A3B8",
  "--text-muted":     "#64748B",
  "--text-faint":     "#475569",
  "--glass-bg":       "rgba(30,41,59,0.65)",
  "--glass-border":   "rgba(59,130,246,0.18)",
  "--glass-hover-bg": "rgba(30,41,59,0.8)",
  "--input-bg":       "rgba(15,23,42,0.8)",
  "--input-border":   "rgba(59,130,246,0.22)",
  "--nav-bg":         "rgba(15,23,42,0.85)",
  "--nav-border":     "rgba(59,130,246,0.15)",
  "--footer-bg":      "#080F1E",
  "--footer-border":  "rgba(59,130,246,0.1)",
  "--scrollbar-track":"#0F172A",
  "--scrollbar-thumb":"#334155",
  "--dot-color":      "rgba(59,130,246,0.12)",
  "--btn-ghost-color":"#F1F5F9",
};

const LIGHT_VARS: Record<string, string> = {
  "--bg-base":        "#F0F6FF",
  "--bg-deep":        "#E2EFFE",
  "--bg-surface":     "#EBF2FF",
  "--text-primary":   "#0F172A",
  "--text-secondary": "#334155",
  "--text-muted":     "#475569",
  "--text-faint":     "#64748B",
  "--glass-bg":       "rgba(255,255,255,0.8)",
  "--glass-border":   "rgba(59,130,246,0.2)",
  "--glass-hover-bg": "rgba(255,255,255,0.95)",
  "--input-bg":       "rgba(255,255,255,0.95)",
  "--input-border":   "rgba(59,130,246,0.3)",
  "--nav-bg":         "rgba(240,246,255,0.92)",
  "--nav-border":     "rgba(59,130,246,0.12)",
  "--footer-bg":      "#E2EFFE",
  "--footer-border":  "rgba(59,130,246,0.12)",
  "--scrollbar-track":"#E2EFFE",
  "--scrollbar-thumb":"#93C5FD",
  "--dot-color":      "rgba(59,130,246,0.08)",
  "--btn-ghost-color":"#1E40AF",
};

function applyVars(vars: Record<string, string>) {
  const root = document.documentElement;
  Object.entries(vars).forEach(([k, v]) => root.style.setProperty(k, v));
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => {
    return (localStorage.getItem("fs-theme") as Theme) ?? "dark";
  });

  useEffect(() => {
    applyVars(theme === "dark" ? DARK_VARS : LIGHT_VARS);
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("fs-theme", theme);
  }, [theme]);

  // Apply immediately on first mount
  useEffect(() => {
    applyVars(theme === "dark" ? DARK_VARS : LIGHT_VARS);
    document.documentElement.setAttribute("data-theme", theme);
  }, []); // eslint-disable-line

  const toggleTheme = () => setTheme(t => t === "dark" ? "light" : "dark");

  return (
    <ThemeContext.Provider value={{ theme, isDark: theme === "dark", toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
