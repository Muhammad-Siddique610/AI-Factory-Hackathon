# AI Flood Damage Analyzer — Product Requirements Document

## Description

The AI Flood Damage Analyzer is a hackathon web application that helps disaster response teams and authorities quickly assess flood damage from satellite or drone imagery using AI image segmentation. Users upload an image of a region, the app sends it to an external AI flood-detection API, and the results — including a flood mask overlay, flood area percentage, risk level, and confidence score — are displayed on an interactive results screen. Results can be downloaded as a branded PDF report or shared via a unique link that requires no login.

The app targets disaster response coordinators, municipal authorities, and field responders who need rapid situational awareness during flood events. It is designed to work on both desktop and mobile devices.

## Goals

- **Rapid assessment**: Deliver flood analysis results (mask, percentage, risk level) in under 30 seconds from image upload
- **Actionable output**: Present risk level and flood area percentage as the most visually prominent data points so responders can make decisions at a glance
- **Field-ready**: Fully responsive on mobile so field teams can upload drone imagery from phones
- **Shareable intelligence**: Every analysis generates a unique public URL that can be sent to authorities or teammates without requiring authentication
- **Auditable history**: Logged-in users can review and revisit all their past analyses
- **Graceful failure**: Handle slow responses, timeouts, and errors from the external AI API without crashing — always show a clear, friendly error message

## User Stories

- **As a disaster response coordinator**, I want to upload a satellite image of a flooded region and immediately see what percentage is underwater and the risk level, so I can prioritize resource deployment.
- **As a field responder**, I want to upload drone imagery from my phone and get results quickly, so I can assess local conditions without returning to base.
- **As an authority**, I want to receive a shareable link to an analysis result, so I can review flood assessments without creating an account.
- **As a returning user**, I want to see my history of past analyses, so I can track how flood conditions have changed over time.
- **As a user with pre-flood imagery**, I want to compare before/after images side by side with a draggable slider, so I can clearly visualize the extent of new flooding.
- **As a decision-maker**, I want to download a branded PDF report of an analysis, so I can include it in official briefings and documentation.

## User Flows

### Happy Path — New Analysis

1. User lands on the **Splash Screen** → brief branding/logo animation plays (~2 seconds)
2. Auto-navigates to **Home** → sees app explanation and "Analyze New Image" CTA
3. Clicks "Analyze New Image" → navigates to **Upload Image**
4. Drags-and-drops (or clicks to browse) a satellite/drone image → sees a preview thumbnail
5. Clicks "Analyze" → navigates to **Prediction (Loading)** screen
6. Loading screen shows progress message ("Analyzing flood zones...") while the external `/predict` API is called
7. API returns successfully → navigates to **Results**
8. Results screen displays: original image with flood mask overlay, flood area %, risk level badge (color-coded), confidence score, and plain-language summary
9. User can: download PDF report, copy shareable link, or return home

### Before/After Comparison Flow

1. User is on the **Results** screen after a successful analysis
2. User taps "Compare with Before Image" → prompted to upload a pre-flood image of the same area
3. After uploading the pre-flood image, a draggable slider appears showing pre-flood (left) vs. post-flood with mask (right)
4. User can drag the slider to compare

### Shareable Link Flow

1. After a successful analysis, a unique public URL is generated (e.g., `/share/:resultId`)
2. User copies the link and shares it with an unauthenticated colleague
3. Colleague opens the link → sees a read-only **Results** screen (no download button, no edit ability, but all stats and the mask overlay are visible)
4. Colleague is prompted to "Sign up to analyze your own images" via a subtle CTA

### Authentication Flow

1. From **Home**, user clicks "Sign Up" → enters name, email, password
2. Email verification is sent (or auto-confirmed for hackathon demo)
3. User logs in with email + password
4. "Forgot password" → enters email → receives reset link → sets new password
5. On any protected page, unauthenticated users are redirected to login

### Error Paths

- **Upload fails** (wrong format, too large) → inline error on Upload screen with clear message
- **External AI API times out** → Loading screen transitions to error state: "Analysis is taking longer than expected. Please try again." with a Retry button
- **External AI API returns error** → Loading screen shows friendly error: "We couldn't analyze this image. The image may not contain recognizable terrain. Please try a different image."
- **Duplicate signup email** → inline error on signup form
- **Invalid login credentials** → inline error on login form
- **Unauthorized access to another user's results** → redirect to Home with toast: "You don't have access to that analysis."

## Design & UX

### Design Direction
- Clean, modern, professional — suitable for a civic/disaster-response tool
- Not playful or overly colorful; the brand color should be a restrained blue or teal
- High contrast and accessible typography

### Screen-by-Screen Notes

**Splash Screen**
- Centered app logo + name ("FloodScope" or team-chosen name)
- Subtle pulse/fade animation, auto-transitions after ~2 seconds

**Home**
- Hero section: app name, one-line value prop ("AI-powered flood damage assessment for disaster response teams")
- Brief bullet-point explanation of what the app does
- Prominent "Analyze New Image" button (primary CTA)
- Secondary "View History" link for returning users
- Navigation: Home | History | About + Login/Signup (or avatar + logout if authenticated)

**Upload Image**
- Large drag-and-drop zone with dashed border, "Drop image here or click to browse"
- Accepted formats: JPG, PNG, TIFF/GeoTIFF (if feasible)
- Max file size: 20MB (configurable)
- After selection: image preview thumbnail appears inside drop zone
- "Analyze" button activates once an image is selected
- "Cancel" link to return to Home

**Prediction (Loading)**
- Centered loading animation (pulsing circle or skeleton)
- Status message: "Analyzing flood zones…" → "Processing segmentation mask…" → "Calculating risk assessment…"
- Estimated time indicator or progress dots
- Cancel/timeout handling if API takes >60 seconds

**Results**
- **Hero section**: Original image with semi-transparent flood mask overlay (flooded areas tinted in a contrasting color, e.g., bright cyan or red at partial opacity)
- **Stats panel** (most prominent):
  - Flood Area % — large, bold number
  - Risk Level — color-coded badge (Green "Low", Yellow "Medium", Red "High")
  - Confidence Score — smaller, secondary stat
- **Summary**: One-line plain-language summary below stats (e.g., "42% of this region is flooded — High risk to residential areas.")
- **Action buttons**: "Download Report" (primary), "Compare with Before Image", "Copy Shareable Link"
- **Before/After slider** (when pre-flood image is provided): horizontal draggable slider

**History**
- List of cards, sorted newest-first
- Each card: thumbnail of uploaded image, date, flood area %, risk level badge
- Click/tap a card → navigates to full Results view for that analysis
- Empty state: "No analyses yet. Analyze your first image!" with CTA

**Shareable Result (Public View)**
- Same layout as Results but read-only
- No download button, no history navigation
- Subtle banner at top: "Viewing shared result — Sign up to analyze your own images"

**About**
- Project description, technology used (React, Supabase, U-Net/DeepLabV3+ AI model)
- Team credits

### Responsive Behavior
- Desktop: two-column layout on Results (image left, stats right)
- Tablet/Mobile: single-column stacked layout, image on top, stats below
- Touch-friendly drag-and-drop on mobile upload

## Acceptance Criteria

### Image Upload & AI Analysis
- [ ] User can upload JPG, PNG images via drag-and-drop or file browser
- [ ] Uploaded image shows a preview before submission
- [ ] On submit, the image is stored in Supabase Storage and a prediction record is created in the database
- [ ] The external `/predict` API is called with the image (URL or base64 as configured)
- [ ] If the API responds within 60 seconds, the results (flood mask, area %, risk level, confidence) are stored and displayed
- [ ] If the API times out or errors, the user sees a friendly error message and can retry
- [ ] The external API URL is configurable (environment variable, not hardcoded)

### Results Display
- [ ] Flood mask is visually overlaid on the original image (tinted overlay)
- [ ] Flood area percentage is displayed as a prominent stat
- [ ] Risk level is shown as a color-coded badge (Green=Low, Yellow=Medium, Red=High)
- [ ] Confidence score is displayed
- [ ] A plain-language one-line summary is generated from the results
- [ ] All elements are responsive and legible on mobile

### Before/After Comparison
- [ ] User can upload a pre-flood image on the Results screen
- [ ] A draggable slider compares pre-flood (left) vs. post-flood with mask (right)
- [ ] Slider works on both desktop (mouse drag) and mobile (touch drag)

### PDF Report
- [ ] "Download Report" button generates and downloads a branded PDF
- [ ] PDF contains: original image thumbnail, flood mask, area %, risk level, confidence score, timestamp, and branded header
- [ ] PDF generation happens entirely client-side (no external API call)

### Shareable Link
- [ ] Each analysis result has a unique, public URL (`/share/:resultId`)
- [ ] Public URL displays results without requiring authentication
- [ ] Public view is read-only (no download, no edit)
- [ ] Authenticated users can view their own results at `/results/:resultId`

### User Accounts
- [ ] Signup with name, email, password (password hashed via Supabase Auth)
- [ ] Login with email + password
- [ ] Logout clears session
- [ ] "Forgot password" sends password reset email
- [ ] Two roles exist: "user" (default) and "admin" (manually assigned in Supabase)
- [ ] Protected routes redirect unauthenticated users to login

### Prediction History
- [ ] Every analysis is saved with: user ID, uploaded image URL, flood mask URL, area %, risk level, confidence score, timestamp
- [ ] History page shows all analyses for the logged-in user, newest first
- [ ] Each history card shows thumbnail, date, area %, risk level
- [ ] Clicking a card navigates to the full Results view
- [ ] Users cannot access another user's results (enforced by RLS and app-level checks)

### Error Handling
- [ ] Failed login shows inline error (not a crash)
- [ ] Duplicate signup email shows inline error
- [ ] Failed upload shows inline error with reason
- [ ] Failed API call shows error screen with Retry
- [ ] Unauthorized access redirects with a toast message

## Out of Scope

- **Admin Panel** — deferred; admins can be managed manually via Supabase dashboard for the hackathon
- **TIFF/GeoTIFF support** — nice-to-have; accept JPG/PNG for MVP, add TIFF if time permits
- **Real-time collaboration** — not in scope
- **Push notifications** — not in scope
- **Email verification enforcement** — can be bypassed for hackathon demo convenience
- **Multi-language support** — English only for MVP

## Open Questions

- **App name**: "FloodScope" suggested — team should confirm or choose alternative
- **External API `/predict` contract**: Exact request/response format (JSON schema) should be finalized with the AI teammate before integration begins. Assumptions for now:
  - Request: `POST /predict` with image (multipart/form-data or base64 JSON)
  - Response: `{ mask_image_url: string, flood_percentage: number, risk_level: "Low" | "Medium" | "High", confidence: number }`
- **Flood mask format**: Will the AI team return the mask as a separate PNG image (overlay) or as a GeoJSON polygon? The PRD assumes a transparent PNG overlay for simplicity.
- **Brand color**: Team to decide on primary brand color (suggested: slate blue `#2563EB` or teal `#0D9488`)

## Implementation Notes

### Tech Stack
| Layer | Technology |
|-------|-----------|
| Framework | React 18 + TypeScript |
| Build tool | Vite 7 |
| Styling | Tailwind CSS v4 |
| Routing | React Router v6 |
| Backend / Auth / DB / Storage | Supabase |
| PDF generation | `jspdf` (client-side) |
| Image comparison slider | `react-compare-image` or custom |
| External AI API | Configurable URL, called via `fetch` |

### Supabase Schema (proposed)

**Table: `profiles`**
- `id` (uuid, FK → auth.users)
- `name` (text)
- `role` (text, default: 'user')
- `created_at` (timestamptz)

**Table: `predictions`**
- `id` (uuid, PK)
- `user_id` (uuid, FK → auth.users)
- `original_image_url` (text) — Supabase Storage path
- `mask_image_url` (text) — returned by AI API
- `flood_percentage` (float)
- `risk_level` (text) — 'Low', 'Medium', 'High'
- `confidence` (float)
- `summary` (text)
- `pre_flood_image_url` (text, nullable)
- `is_public` (boolean, default: true)
- `created_at` (timestamptz)

**Storage Buckets**: `images` (for uploads), `masks` (for AI-returned masks), `reports` (for generated PDFs)

### Route Map
| Path | Screen | Auth Required |
|------|--------|:---:|
| `/` | Splash → redirects to `/home` | No |
| `/home` | Home | No |
| `/upload` | Upload Image | Yes |
| `/predicting/:predictionId` | Prediction (Loading) | Yes |
| `/results/:predictionId` | Results | Yes |
| `/share/:predictionId` | Public Shareable Result | No |
| `/history` | History | Yes |
| `/about` | About | No |
| `/login` | Login | No |
| `/signup` | Signup | No |
| `/forgot-password` | Forgot Password | No |

### Environment Variables
```
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
VITE_AI_PREDICT_API_URL=
VITE_AI_PREDICT_TIMEOUT_MS=60000
```
