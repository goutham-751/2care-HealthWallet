# Frontend Design Document
## Digital Health Wallet — ReactJS Interface

**Version:** 1.0  
**Author:** Goutham  
**Date:** May 2026  
**Stack:** React 18 + Vite + TailwindCSS + Recharts + React Query

---

## 1. Design Philosophy

### Aesthetic Direction: "Clinical Precision meets Human Warmth"

The Health Wallet is not a cold medical record system. It's a personal health companion — trusted, calm, and empowering. The visual language should communicate:

- **Trust** — clean lines, structured layout, nothing extraneous
- **Clarity** — data is primary; ornamentation serves it, never competes
- **Warmth** — health is personal. The interface should feel like a trusted GP's office, not a government portal

**Visual Identity:**

| Element | Choice | Rationale |
|---------|--------|-----------|
| Display Font | `Fraunces` (serif, variable) | Humanist, warm, authoritative — unexpected in health UI |
| Body Font | `DM Sans` | Modern, highly legible, clinical clarity without coldness |
| Mono Font | `JetBrains Mono` | For values, codes, report IDs |
| Primary Color | `#1B4F72` (deep sapphire) | Trust, depth, medical authority |
| Accent Color | `#2ECC71` (emerald) | Health, vitality, positive indicators |
| Warning Color | `#E74C3C` (clear red) | Out-of-range vitals, alerts |
| Neutral Color | `#F0F4F8` (cool gray-white) | Background; keeps everything airy |
| Surface Color | `#FFFFFF` with subtle `box-shadow` | Cards float; no harsh borders |
| Text Primary | `#1A202C` | Near-black; readable without harshness |
| Text Secondary | `#718096` | Labels, metadata |

**No gradients on white. No purple. No generic SaaS teal-on-white.**

---

## 2. Design System

### 2.1 Color Tokens (CSS Variables)

```css
:root {
  /* Brand */
  --color-primary: #1B4F72;
  --color-primary-light: #2980B9;
  --color-primary-dark: #154360;
  
  /* Health Indicators */
  --color-healthy: #2ECC71;
  --color-warning: #F39C12;
  --color-danger: #E74C3C;
  --color-neutral: #95A5A6;
  
  /* Surfaces */
  --color-bg: #F0F4F8;
  --color-surface: #FFFFFF;
  --color-surface-raised: #FFFFFF;
  --color-border: #E2E8F0;
  
  /* Typography */
  --color-text-primary: #1A202C;
  --color-text-secondary: #718096;
  --color-text-muted: #A0AEC0;
  
  /* Vitals — each vital has its own hue */
  --vital-bp: #9B59B6;      /* purple — BP */
  --vital-sugar: #E67E22;   /* orange — blood sugar */
  --vital-hr: #E74C3C;      /* red — heart rate */
  --vital-spo2: #3498DB;    /* blue — oxygen */
  --vital-weight: #1ABC9C;  /* teal — weight */
  --vital-temp: #F1C40F;    /* yellow — temperature */
  
  /* Spacing */
  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 20px;
  --radius-xl: 28px;
  
  /* Shadows */
  --shadow-sm: 0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04);
  --shadow-md: 0 4px 16px rgba(0,0,0,0.08);
  --shadow-lg: 0 8px 32px rgba(0,0,0,0.10);
}
```

### 2.2 Typography Scale

```css
/* Import */
@import url('https://fonts.googleapis.com/css2?family=Fraunces:wght@400;600;700&family=DM+Sans:wght@400;500;600&family=JetBrains+Mono:wght@400;600&display=swap');

/* Scale */
--text-xs:    0.75rem;   /* 12px — labels */
--text-sm:    0.875rem;  /* 14px — metadata */
--text-base:  1rem;      /* 16px — body */
--text-lg:    1.125rem;  /* 18px — sub-heading */
--text-xl:    1.25rem;   /* 20px — card titles */
--text-2xl:   1.5rem;    /* 24px — page section titles */
--text-3xl:   1.875rem;  /* 30px — dashboard greeting */
--text-4xl:   2.25rem;   /* 36px — hero/landing text */
```

### 2.3 Component Primitives

#### Card
```jsx
// Base card — used everywhere
<div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
  {children}
</div>
```

#### Button Variants
```jsx
// Primary — deep sapphire fill
<button className="bg-[#1B4F72] text-white px-5 py-2.5 rounded-lg
  font-medium text-sm hover:bg-[#154360] transition-colors duration-150">

// Secondary — outlined
<button className="border border-[#1B4F72] text-[#1B4F72] px-5 py-2.5 rounded-lg
  font-medium text-sm hover:bg-[#1B4F72]/5 transition-colors duration-150">

// Ghost — subtle
<button className="text-slate-500 px-4 py-2 rounded-lg text-sm
  hover:bg-slate-100 transition-colors duration-150">

// Danger — destructive action
<button className="bg-[#E74C3C] text-white px-5 py-2.5 rounded-lg
  font-medium text-sm hover:bg-red-700 transition-colors duration-150">
```

#### Badge / Pill (Report Types)
```jsx
const reportTypeBadge = {
  "Blood Test":    "bg-rose-50 text-rose-700 border border-rose-200",
  "X-Ray":         "bg-sky-50 text-sky-700 border border-sky-200",
  "MRI":           "bg-violet-50 text-violet-700 border border-violet-200",
  "ECG":           "bg-orange-50 text-orange-700 border border-orange-200",
  "Prescription":  "bg-emerald-50 text-emerald-700 border border-emerald-200",
  "Other":         "bg-slate-50 text-slate-700 border border-slate-200",
}
```

---

## 3. Application Routes & Page Map

```
/                    → Redirect to /dashboard if logged in, else /login
/login               → LoginPage
/register            → RegisterPage
/dashboard           → DashboardPage (vitals summary + recent reports)
/reports             → ReportsListPage (filterable, searchable)
/reports/:id         → ReportDetailPage (view metadata, file, sharing)
/reports/upload      → UploadReportPage (multi-step form)
/vitals              → VitalsPage (charts + manual entry)
/shared-with-me      → SharedWithMePage (viewer's reports)
/profile             → ProfilePage
```

---

## 4. Page-by-Page Specifications

---

### 4.1 Auth Pages (Login / Register)

**Layout:** Full screen split — left panel brand, right panel form.

**Left Panel (40% width, dark sapphire bg):**
- Large `Fraunces` logotype: "Health Wallet"
- Subtitle: "Your records. Your terms."
- Decorative: subtle anatomical line-art SVG (heart with ECG rhythm line) — very light, low opacity
- Testimonial blurb at bottom

**Right Panel (60% width, white):**
- Centered form card (max-w-sm)
- `Fraunces` heading: "Welcome back" / "Create your account"
- Email + Password inputs with floating labels
- Submit button (full width, primary)
- Toggle between login/register
- Show/hide password toggle icon

**Micro-interactions:**
- Input focus: border shifts to `--color-primary`, label slides up smoothly
- Form submit: button shows spinner inline, text becomes "Signing in..."
- Error: form shakes with `animate-shake` (CSS keyframe)
- Success: brief success state before redirect

---

### 4.2 Dashboard Page

**Layout:** 3-column grid on desktop, stacked on mobile.

**Section 1 — Greeting Header (full width)**
```
"Good morning, Riya"          [Upload Report ▲] [Log Vitals +]
Your health at a glance · Monday, 16 May 2026
```
- Font: `Fraunces` 30px for name
- Two action buttons in top-right header area

**Section 2 — Vitals Summary Cards (row of 4-6 cards)**

Each vital card:
```
┌─────────────────────────┐
│  ♥ Heart Rate           │
│                         │
│   78   bpm              │
│  ───────                │
│  ↓ 3 from last week    │
│  • Normal range         │
└─────────────────────────┘
```
- Icon: vitals-specific SVG icon (not generic emoji)
- Large value in `JetBrains Mono` font
- Trend indicator (arrow + delta) in small text
- Color dot: green (normal) / orange (borderline) / red (out of range)
- Click → navigates to that vital's full chart

**Section 3 — Recent Reports (2/3 width) + Quick Log Vitals (1/3 width)**

Recent Reports panel:
- Title: "Recent Records" with "View all →" link
- List of 5 most recent reports as rows:
  ```
  [PDF icon] Blood Test · CBC Panel         Jan 15, 2026  [View]
  [IMG icon] Chest X-Ray                    Dec 02, 2025  [View]
  ```
- Each row: hover lifts (subtle shadow transition)
- Empty state: illustrated placeholder + "Upload your first report"

Quick Log Vitals panel:
- Compact form to log a single vital
- Dropdown: select vital type
- Number input for value
- Date/time (defaults to now)
- "Log" button
- Success: value animates into the vitals summary card above

**Section 4 — Mini Vitals Chart (full width)**
- Blood pressure as dual-line chart (last 30 days) at the bottom of dashboard
- Recharts `LineChart` with custom dot and tooltip

---

### 4.3 Reports List Page

**Layout:** Left sidebar filters + main content list.

**Sidebar (260px fixed):**
- "Filters" heading
- Search input (keyword)
- Report Type checkboxes (Blood Test, X-Ray, MRI, ECG, Prescription, Other)
- Date range picker (from / to inputs)
- Vital type filter dropdown
- "Reset Filters" ghost button

**Main Content:**
- Tabs: "My Reports" | "Shared with Me"
- Sort: "Newest first" / "Oldest first" dropdown
- Results count: "Showing 12 of 34 reports"
- Report cards in a 2-column grid (desktop) / 1-column (mobile):

```
┌────────────────────────────────────┐
│  [Blood Test]                      │
│                                    │
│  CBC Complete Panel                │
│  Dr. Priya Clinic                  │
│                                    │
│  📅 January 15, 2026               │
│  Vitals: Sugar 92 · BP 118/76      │
│                                    │
│  [View Report]    [Share ↗]        │
└────────────────────────────────────┘
```

- Report type badge at top-right of card
- Vitals shown as small inline chips
- Empty state per filter combination

**Mobile:** Filters collapsed behind a "Filter" button that opens a bottom sheet.

---

### 4.4 Upload Report Page (Multi-Step Form)

Three-step wizard with progress indicator at top.

**Step 1 — Upload File**
```
Step 1 of 3: Upload File
┌─────────────────────────────────────┐
│                                     │
│       ☁ Drag & drop your file       │
│    PDF, JPG, or PNG · Max 10MB      │
│                                     │
│      [Browse Files]                 │
└─────────────────────────────────────┘
     ← or paste from clipboard →
```
- On file select: preview panel shows PDF thumbnail or image preview
- File name, size shown
- "Remove" button to re-select

**Step 2 — Report Details**
```
Step 2 of 3: Report Details

Title *         [Blood Test — CBC Panel          ]
Report Type *   [Blood Test                    ▼ ]
Report Date *   [2026-01-15                       ]
Notes           [Optional notes...               ]
                                     [— Next Step]
```

**Step 3 — Associated Vitals (Optional)**
```
Step 3 of 3: Add Vitals (Optional)

  [+ Add Vital]

  ┌─────────────────────────────────┐
  │ Blood Sugar (Fasting)  [92] mg/dL  [✕] │
  │ Heart Rate             [78] bpm    [✕] │
  └─────────────────────────────────┘

This step is optional. Vitals help you track trends over time.

[← Back]          [Upload Report ✓]
```

- Vitals are added dynamically with "+ Add Vital" button
- Each vital: type dropdown + value input + unit (auto-filled) + remove
- Upload button: shows progress bar overlay on submit

---

### 4.5 Report Detail Page

**Layout:** Two-column — left 60% content, right 40% sidebar.

**Left — Document Viewer**
- PDF: rendered via `<iframe>` or `react-pdf`
- Image: fullscreen-capable `<img>` with zoom controls
- Download button (shown to Owner always; to Viewer only if `can_download = true`)

**Right — Metadata Sidebar**
```
Report Details
──────────────
Type:     Blood Test
Date:     January 15, 2026
Uploaded: 3 days ago

Vitals in this Report
──────────────────────
🩸 Sugar (Fasting)   92 mg/dL  ● Normal
❤️ Heart Rate         78 bpm    ● Normal
⬆️ BP Systolic       118 mmHg  ● Normal
⬆️ BP Diastolic       76 mmHg  ● Normal

Shared With
────────────
Dr. Suresh Rajan  [Revoke]
Arjun (Family)    [Revoke]

[Share with someone +]
```

**Share Modal:**
```
Share this Report
─────────────────
Enter email address
[dr.suresh@hospital.com         ]

Permissions
○ View only
○ View + Download

[Share Report]
```

---

### 4.6 Vitals Page

**Layout:** Header controls + chart grid.

**Header:**
- Title: "Vitals Tracker"
- Date range selector: [7D] [30D] [90D] [Custom]
- "Log Vitals +" button

**Chart Grid (2 columns on desktop):**

Each vital gets its own card:
```
┌────────────────────────────────────┐
│  Blood Pressure    [7D] [30D] [90D]│
│  ─────────────────────────────     │
│  [Area chart: Recharts]            │
│  Systolic ──  Diastolic - -        │
│                                    │
│  Range: 112–124 / 72–80            │
│  Avg: 118 / 76   ● Normal          │
└────────────────────────────────────┘
```

**Chart specs:**
- `AreaChart` with `LinearGradient` fill (subtle, matches vital color)
- Custom `Tooltip`: shows exact value + timestamp on hover
- `ReferenceLine` for normal range boundaries (dashed gray line)
- Values outside normal range: dot colored red

**Log Vitals Modal:**
```
Log a Vital
────────────
Vital Type *    [Heart Rate              ▼]
Value *         [78              ] bpm
Date & Time *   [Today, 10:42 AM          ]
Note            [After morning walk...    ]

[Log Vital]
```

**Below Charts — Vitals History Table:**
| Date | Vital | Value | Status |
|------|-------|-------|--------|
| May 15 | Heart Rate | 78 bpm | Normal |
| May 14 | Sugar | 104 mg/dL | Normal |

---

### 4.7 Shared With Me Page (Viewer)

**Layout:** Similar to Reports List but read-only framing.

- Banner at top: "You have read-only access to these reports. You cannot upload or delete."
- Each report card shows: shared by name + date shared
- No "Share" or "Delete" buttons visible
- Download button shown only if `can_download = true`

---

## 5. Navigation Structure

### Sidebar Navigation (Desktop)
```
┌─────────────────┐
│  Health Wallet  │
│  ─────────────  │
│  @ Dashboard    │
│  📋 Reports     │
│  📈 Vitals      │
│  👥 Shared      │
│  ─────────────  │
│  ⚙ Profile      │
│  ← Logout       │
└─────────────────┘
```
- Fixed left sidebar, 240px wide
- Active state: left border accent `--color-primary`, bg `#EBF5FB`
- Logo: "Health Wallet" in `Fraunces`, sapphire color

### Mobile Navigation
- Bottom tab bar with 4 tabs: Dashboard, Reports, Vitals, Shared
- Upload button: floating action button (FAB) — sapphire circle, `+` icon

---

## 6. State Management Architecture

### Approach: React Query + React Context

**AuthContext** (global, persisted in localStorage):
```js
// Stores: { user: { id, name, email }, isAuthenticated }
// Actions: login(), logout(), refreshUser()
```

**React Query** for all server state:
```js
// Reports
useQuery(['reports', filters])         // list
useQuery(['report', id])               // single
useMutation(uploadReport)
useMutation(deleteReport)

// Vitals
useQuery(['vitals', { type, from, to }])
useMutation(logVital)

// Shares
useQuery(['shares-mine'])
useQuery(['shares-with-me'])
useMutation(shareReport)
useMutation(revokeShare)
```

**Local component state** only for: form inputs, UI toggles (modal open/closed), filter selections before query submission.

---

## 7. Component Library Breakdown

```
src/
├── components/
│   ├── layout/
│   │   ├── Sidebar.jsx           # Desktop nav
│   │   ├── MobileNav.jsx         # Bottom tab bar
│   │   ├── Header.jsx            # Page-level header
│   │   └── AppLayout.jsx         # Wrapper with Sidebar + content
│   │
│   ├── ui/
│   │   ├── Button.jsx            # All button variants
│   │   ├── Badge.jsx             # Report type badges
│   │   ├── Card.jsx              # Base card wrapper
│   │   ├── Modal.jsx             # Accessible modal (focus trap)
│   │   ├── Input.jsx             # Floating label input
│   │   ├── Select.jsx            # Styled select dropdown
│   │   ├── DatePicker.jsx        # Date input with calendar
│   │   ├── FileDropZone.jsx      # Drag-and-drop upload area
│   │   ├── Spinner.jsx           # Loading states
│   │   ├── Toast.jsx             # Notification toasts
│   │   └── EmptyState.jsx        # Illustrated empty states
│   │
│   ├── vitals/
│   │   ├── VitalCard.jsx         # Summary card on dashboard
│   │   ├── VitalChart.jsx        # Recharts AreaChart per vital
│   │   ├── VitalStatusDot.jsx    # Green/orange/red indicator
│   │   ├── LogVitalModal.jsx     # Modal for manual vital entry
│   │   └── VitalsHistoryTable.jsx
│   │
│   ├── reports/
│   │   ├── ReportCard.jsx        # Card in grid list
│   │   ├── ReportRow.jsx         # Row in list view
│   │   ├── ReportFilters.jsx     # Sidebar filter panel
│   │   ├── ReportViewer.jsx      # PDF/image viewer
│   │   ├── UploadWizard.jsx      # 3-step upload form
│   │   └── ShareModal.jsx        # Share dialog
│   │
│   └── sharing/
│       ├── SharesList.jsx        # "Shared by me" list
│       └── SharedReportCard.jsx  # Card for shared-with-me view
│
├── pages/
│   ├── LoginPage.jsx
│   ├── RegisterPage.jsx
│   ├── DashboardPage.jsx
│   ├── ReportsListPage.jsx
│   ├── ReportDetailPage.jsx
│   ├── UploadReportPage.jsx
│   ├── VitalsPage.jsx
│   ├── SharedWithMePage.jsx
│   └── ProfilePage.jsx
│
├── api/
│   ├── axios.js                  # Axios instance with interceptors
│   ├── auth.js                   # Auth API functions
│   ├── reports.js                # Reports API functions
│   ├── vitals.js                 # Vitals API functions
│   └── shares.js                 # Shares API functions
│
├── context/
│   └── AuthContext.jsx
│
├── hooks/
│   ├── useAuth.js
│   ├── useReports.js
│   ├── useVitals.js
│   └── useShares.js
│
└── utils/
    ├── vitalRanges.js            # Normal range definitions per vital
    ├── formatters.js             # Date, number formatters
    └── constants.js              # Report types, vital types arrays
```

---

## 8. Vitals Normal Ranges Reference

```js
// utils/vitalRanges.js
export const VITAL_RANGES = {
  bp_systolic:     { min: 90,  max: 120, unit: 'mmHg',  warn: [120, 130], danger: 130 },
  bp_diastolic:    { min: 60,  max: 80,  unit: 'mmHg',  warn: [80, 90],   danger: 90  },
  heart_rate:      { min: 60,  max: 100, unit: 'bpm',   warn: [100, 110], danger: 110 },
  blood_sugar_f:   { min: 70,  max: 99,  unit: 'mg/dL', warn: [100, 125], danger: 126 },
  blood_sugar_pp:  { min: 70,  max: 139, unit: 'mg/dL', warn: [140, 199], danger: 200 },
  spo2:            { min: 95,  max: 100, unit: '%',      warn: [92, 95],   danger: 92  },
  temperature:     { min: 97,  max: 99,  unit: '°F',    warn: [99, 100],  danger: 100 },
};

export function getVitalStatus(type, value) {
  const range = VITAL_RANGES[type];
  if (!range) return 'unknown';
  if (value >= range.min && value <= range.max) return 'normal';
  if (value < range.min || value >= range.danger) return 'danger';
  return 'warning';
}
```

---

## 9. Chart Configuration (Recharts)

### Blood Pressure (Dual Line)
```jsx
<ComposedChart data={bpData}>
  <defs>
    <linearGradient id="bpGrad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="5%"  stopColor="var(--vital-bp)" stopOpacity={0.2}/>
      <stop offset="95%" stopColor="var(--vital-bp)" stopOpacity={0}/>
    </linearGradient>
  </defs>
  <CartesianGrid strokeDasharray="3 3" stroke="#F0F4F8" />
  <XAxis dataKey="date" tick={{ fontSize: 12, fill: '#718096' }} />
  <YAxis domain={[60, 160]} tick={{ fontSize: 12, fill: '#718096' }} />
  <Tooltip content={<CustomBPTooltip />} />
  <ReferenceLine y={120} stroke="#E74C3C" strokeDasharray="4 4" label="Upper" />
  <Area type="monotone" dataKey="systolic" stroke="var(--vital-bp)"
    fill="url(#bpGrad)" strokeWidth={2} dot={<CustomDot />} />
  <Line type="monotone" dataKey="diastolic" stroke="var(--vital-bp)"
    strokeDasharray="5 5" strokeWidth={2} dot={false} />
</ComposedChart>
```

### Single Vital (Area Chart)
```jsx
<AreaChart data={heartRateData}>
  <defs>
    <linearGradient id="hrGrad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="5%"  stopColor="var(--vital-hr)" stopOpacity={0.25}/>
      <stop offset="95%" stopColor="var(--vital-hr)" stopOpacity={0}/>
    </linearGradient>
  </defs>
  <Area type="monotone" dataKey="value"
    stroke="var(--vital-hr)" fill="url(#hrGrad)" strokeWidth={2} />
  <Tooltip content={<CustomTooltip unit="bpm" />} />
</AreaChart>
```

---

## 10. Responsive Breakpoints

```css
/* Mobile first */
/* sm: 640px — large phones */
/* md: 768px — tablets */
/* lg: 1024px — desktop */
/* xl: 1280px — wide desktop */
```

**Layout switches:**
- Dashboard vitals cards: 2 cols (mobile) → 3 cols (md) → 4 cols (lg)
- Reports list: 1 col (mobile) → 2 cols (md) → 2 cols (lg) + sidebar
- Sidebar nav: hidden (mobile) → fixed 240px (lg+)
- Bottom tab bar: visible (mobile) → hidden (lg+)

---

## 11. Key UI Interactions & Animations

| Interaction | Implementation |
|-------------|----------------|
| Page enter | `opacity: 0 → 1` + `translateY(8px) → 0` over 200ms |
| Card hover | `translateY(-2px)` + `shadow-md → shadow-lg` over 150ms |
| Button click | Scale `0.97` on `mousedown`, restore on `mouseup` |
| Modal open | Overlay fades in; modal slides up 16px into position |
| Form error shake | 3-step `translateX` keyframe: `0 → -8px → 8px → 0` over 300ms |
| Chart data load | Recharts built-in animate; initial render fades each line |
| Toast notifications | Slides in from top-right, auto-dismisses after 4s |
| Upload progress | Thin progress bar under header; animated shimmer |
| File drop | Drop zone border pulses to primary color; icon bounces |

---

## 12. Accessibility Checklist

- [ ] All inputs have `<label>` associations (or `aria-label`)
- [ ] Modal traps focus; `Escape` closes it
- [ ] Color is never the sole indicator (status dot + text label)
- [ ] WCAG AA contrast ratio met for all text
- [ ] Charts include `aria-label` descriptions for screen readers
- [ ] Keyboard-navigable file drop zone (`Enter`/`Space` opens file picker)
- [ ] All icon-only buttons have `aria-label`
- [ ] Error messages announced via `role="alert"`

---

## 13. Environment & Setup

```bash
# Create Vite + React project
npm create vite@latest client -- --template react
cd client

# Install dependencies
npm install axios @tanstack/react-query recharts react-router-dom
npm install react-hook-form react-pdf react-dropzone
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

**`tailwind.config.js`:**
```js
module.exports = {
  content: ['./src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['Fraunces', 'serif'],
        body: ['DM Sans', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        primary: '#1B4F72',
        'primary-light': '#2980B9',
        healthy: '#2ECC71',
        warning: '#F39C12',
        danger: '#E74C3C',
      }
    }
  }
}
```

**`vite.config.js`:**
```js
export default {
  server: {
    proxy: {
      '/api': 'http://localhost:5000'   // Proxy API calls to backend
    }
  }
}
```

---

## 14. API Integration Pattern

```js
// api/axios.js
import axios from 'axios';

const api = axios.create({ baseURL: '/api', withCredentials: true });

// Request interceptor: attach JWT
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Response interceptor: handle 401
api.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export default api;
```

---

## 15. Error States & Empty States

Every page must handle:

| State | Display |
|-------|---------|
| Loading | Skeleton loaders (not spinner spinners) — gray animated shimmer blocks |
| Error | Error card with retry button + error message |
| Empty (no reports yet) | Illustrated SVG + "Upload your first report" CTA |
| Empty (filters return nothing) | "No reports match your filters" + "Reset filters" link |
| 403 Unauthorized | "You don't have access to this report" page |
| 404 Not Found | Friendly 404 with navigation back to dashboard |

**Skeleton loader pattern:**
```jsx
<div className="animate-pulse">
  <div className="h-4 bg-slate-200 rounded w-3/4 mb-2" />
  <div className="h-4 bg-slate-200 rounded w-1/2" />
</div>
```
