# Design System Master File

> **LOGIC:** When building a specific page, first check `design-system/pages/[page-name].md`.
> If that file exists, its rules **override** this Master file.
> If not, strictly follow the rules below.

---

**Project:** FloodScope — AI Flood Damage Analyzer
**Generated:** 2026-07-31
**Category:** Civic Tech / Disaster Response SaaS

---

## Global Rules

### Color Palette

| Role | Hex | CSS Variable |
|------|-----|--------------|
| Primary | `#1E3A5F` | `--color-primary` |
| On Primary | `#FFFFFF` | `--color-on-primary` |
| Secondary | `#334155` | `--color-secondary` |
| Accent/CTA | `#2563EB` | `--color-accent` |
| Background | `#F8FAFC` | `--color-background` |
| Foreground | `#0F172A` | `--color-foreground` |
| Muted | `#E8ECF1` | `--color-muted` |
| Border | `#E2E8F0` | `--color-border` |
| Destructive | `#DC2626` | `--color-destructive` |
| Ring | `#2563EB` | `--color-ring` |

**Color Notes:** Professional slate-blue palette. Restrained, high-contrast. Accent blue for CTAs. Destructive red for errors. Dark navy header with light content areas.

### Typography

- **Heading Font:** Inter
- **Body Font:** Inter
- **Mood:** Clean, professional, accessible. High legibility for field use on mobile. Not playful or decorative.
- **Google Fonts:** [Inter](https://fonts.google.com/share?selection.family=Inter:wght@400;500;600;700)

**CSS Import:**
```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
```

### Spacing Variables

| Token | Value | Usage |
|-------|-------|-------|
| `--space-xs` | `4px` / `0.25rem` | Tight gaps |
| `--space-sm` | `8px` / `0.5rem` | Icon gaps, inline spacing |
| `--space-md` | `16px` / `1rem` | Standard padding |
| `--space-lg` | `24px` / `1.5rem` | Section padding |
| `--space-xl` | `32px` / `2rem` | Large gaps |
| `--space-2xl` | `48px` / `3rem` | Section margins |
| `--space-3xl` | `64px` / `4rem` | Hero padding |

### Shadow Depths

| Level | Value | Usage |
|-------|-------|-------|
| `--shadow-sm` | `0 1px 2px rgba(0,0,0,0.05)` | Subtle lift |
| `--shadow-md` | `0 4px 6px rgba(0,0,0,0.1)` | Cards, buttons |
| `--shadow-lg` | `0 10px 15px rgba(0,0,0,0.1)` | Modals, dropdowns |
| `--shadow-xl` | `0 20px 25px rgba(0,0,0,0.15)` | Hero images, featured cards |

---

## Component Specs

### Buttons

```css
/* Primary Button */
.btn-primary {
  background: #2563EB;
  color: white;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  transition: all 200ms ease;
  cursor: pointer;
}

.btn-primary:hover {
  opacity: 0.9;
  transform: translateY(-1px);
}

.btn-primary:active {
  transform: scale(0.97);
}

/* Secondary Button */
.btn-secondary {
  background: transparent;
  color: #1E3A5F;
  border: 2px solid #1E3A5F;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  transition: all 200ms ease;
  cursor: pointer;
}
```

### Cards

```css
.card {
  background: #FFFFFF;
  border: 1px solid #E2E8F0;
  border-radius: 12px;
  padding: 24px;
  box-shadow: var(--shadow-sm);
  transition: all 200ms ease;
  cursor: pointer;
}

.card:hover {
  box-shadow: var(--shadow-md);
  transform: translateY(-2px);
}
```

### Inputs

```css
.input {
  padding: 12px 16px;
  border: 1px solid #E2E8F0;
  border-radius: 8px;
  font-size: 16px;
  transition: border-color 200ms ease;
}

.input:focus {
  border-color: #2563EB;
  outline: none;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.15);
}
```

---

## Style Guidelines

**Style:** Professional & Restrained

**Keywords:** Clean, accessible, high-contrast, civic, authoritative, trustworthy, modern, minimal

**Best For:** Government, disaster response, civic technology, data dashboards, enterprise tools

**Key Effects:** Subtle shadows, minimal animations (150-200ms), no flashy transitions. Focus on clarity and readability.

### Page Pattern

**Pattern Name:** Nav + Content + Footer

- **Conversion Strategy:** Clear primary CTA placement. Use accent color for CTAs.
- **CTA Placement:** Hero + sticky navbar
- **Section Order:** 1. Navbar, 2. Page content, 3. Footer

---

## Anti-Patterns (Do NOT Use)

- ❌ Playful or decorative design
- ❌ Excessive animations or transitions
- ❌ Bright, saturated colors
- ❌ Emojis as icons — Use SVG icons (Lucide)
- ❌ Brand/social icons from `lucide-react` — use `react-icons/si` instead
- ❌ Missing cursor:pointer — All clickable elements must have cursor:pointer
- ❌ Layout-shifting hovers — Avoid scale transforms that shift layout
- ❌ Low contrast text — Maintain 4.5:1 minimum contrast ratio
- ❌ Instant state changes — Always use transitions (150-300ms)
- ❌ Invisible focus states — Focus states must be visible for a11y

---

## Pre-Delivery Checklist

Before delivering any UI code, verify:

- [ ] No emojis used as icons (use SVG instead)
- [ ] UI icons from Lucide; brand/social logos from `react-icons/si`
- [ ] `cursor-pointer` on all clickable elements
- [ ] Hover states with smooth transitions (150-300ms)
- [ ] Light mode: text contrast 4.5:1 minimum
- [ ] Focus states visible for keyboard navigation
- [ ] `prefers-reduced-motion` respected
- [ ] Responsive: 375px, 768px, 1024px, 1440px
- [ ] No content hidden behind fixed navbars
- [ ] No horizontal scroll on mobile

---

## User Preferences (authoritative)

These override any conflicting default above:

- Primary brand color: slate blue (#2563EB) or teal (#0D9488)
- Clean, modern, professional civic-tech look
- High contrast and accessible
- Dark header with light content area
- Restrained color palette — not colorful or playful

---

## Tailwind v4 Tokens (applied to `src/index.css`)

These tokens are the rendering source of truth and are written into `src/index.css` for you. Build with them (`bg-primary`, `text-foreground`, `font-heading`, …); don't move or duplicate the `@import`/`@theme`.

```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

@theme {
  --font-sans: "Inter", ui-sans-serif, system-ui, -apple-system, sans-serif;
  --font-heading: "Inter", ui-sans-serif, system-ui, -apple-system, sans-serif;
  --color-primary: oklch(0.31 0.06 255);
  --color-on-primary: oklch(1.0 0 0);
  --color-secondary: oklch(0.37 0.04 257);
  --color-accent: oklch(0.55 0.19 265);
  --color-background: oklch(0.984 0.003 248);
  --color-foreground: oklch(0.15 0.04 260);
  --color-muted: oklch(0.94 0.008 254);
  --color-border: oklch(0.928 0.013 256);
  --color-destructive: oklch(0.577 0.215 27);
  --color-ring: oklch(0.55 0.19 265);
  --color-success: oklch(0.55 0.18 145);
  --color-warning: oklch(0.65 0.18 85);
}
```
