# ModelOps — AI Analytics Dashboard

A production-ready analytics dashboard for monitoring AI model performance. Built with React 19, TypeScript, Tailwind CSS, and Recharts.

## Features

- **Real-time metrics** — latency percentiles (p50/p95/p99), token usage, and error rate charts
- **Model health tracking** — per-model status cards with success rate and cost breakdowns
- **Request log explorer** — sortable, filterable table with CSV export and pagination
- **Dark / light theme** — persisted to `localStorage`, respects system preference on first load
- **Loading skeletons & error boundaries** — every data region degrades gracefully
- **Fake API layer** — deterministic generated data with simulated network delay; swap in a real API without touching UI components

## Tech stack

| Layer | Library |
|---|---|
| Framework | React 19 + TypeScript |
| Build tool | Vite 8 |
| Styling | Tailwind CSS 3 |
| Charts | Recharts 3 |
| Icons | Lucide React |

## Local development

### Prerequisites

- Node.js ≥ 18
- npm ≥ 9

### Setup

```bash
git clone https://github.com/<your-username>/ai-dashboard.git
cd ai-dashboard
npm install
```

### Environment variables

The app ships with a generated fake data layer — no API keys are needed to run it. If you want to connect a real backend later:

```bash
cp .env.example .env.local
# Edit .env.local and fill in your values
```

All browser-exposed variables must be prefixed with `VITE_`. See `.env.example` for documented options.

### Run

```bash
npm run dev        # development server at http://localhost:5173
npm run build      # production build → dist/
npm run preview    # preview the production build locally
```

## Deploying to Vercel

### Option A — Vercel dashboard (recommended for first deploy)

1. Push this repo to GitHub (see below).
2. Go to [vercel.com/new](https://vercel.com/new) and click **Import Git Repository**.
3. Select your `ai-dashboard` repo.
4. Vercel auto-detects Vite — the defaults are correct:
   - **Framework preset:** Vite
   - **Build command:** `npm run build`
   - **Output directory:** `dist`
   - **Install command:** `npm install`
5. If you have real environment variables, click **Environment Variables** and add them before deploying. Prefix all browser-facing keys with `VITE_`.
6. Click **Deploy**. Vercel will build and give you a `.vercel.app` URL.

Every push to `main` triggers a new production deploy automatically. Pull requests get isolated preview URLs.

### Option B — Vercel CLI

```bash
npm install -g vercel
vercel login
vercel          # deploys to a preview URL, walks you through project setup
vercel --prod   # promotes to production
```

To add environment variables via CLI:

```bash
vercel env add VITE_API_BASE_URL
```

### `vercel.json` explained

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }],
  "headers": [{ "source": "/assets/(.*)", "headers": [
    { "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }
  ]}]
}
```

- **rewrites** — sends all routes to `index.html` so the SPA handles navigation client-side.
- **headers** — tells browsers to cache hashed asset files for one year (Vite content-hashes filenames, so this is safe).

## Project structure

```
src/
├── api/
│   ├── client.ts       # Fake fetch: configurable delay + optional error simulation
│   ├── data.ts         # Deterministic data generators (time series, logs, summaries)
│   └── endpoints.ts    # Typed API surface — swap implementations here for a real backend
├── components/
│   ├── charts/         # LatencyChart, TokenUsageChart, ErrorRateChart (Recharts)
│   ├── layout/         # Sidebar (collapsible), Header (theme toggle, refresh)
│   ├── table/          # DataTable — sortable, searchable, paginated
│   └── ui/             # Card, Badge, StatCard, Skeleton primitives
├── hooks/
│   └── useAsync.ts     # Generic data-fetching hook: loading / data / error + refetch
├── pages/
│   ├── Dashboard.tsx   # Overview: stat cards, all 3 charts, model summary, recent logs
│   ├── Models.tsx      # Per-model health cards + comparison table
│   └── Logs.tsx        # Full request history with status filter and CSV export
├── providers/
│   ├── ErrorBoundary.tsx  # Class component with retry UI
│   └── ThemeProvider.tsx  # dark/light context + localStorage persistence
└── types/index.ts      # Shared TypeScript types
```

## Connecting a real API

All data fetching flows through `src/api/endpoints.ts`. To swap the fake layer for a real one, replace the implementations there — the `useAsync` hook and all UI components are completely decoupled from the data source.

Example:

```ts
// src/api/endpoints.ts
export const api = {
  getLogs: (limit = 100) =>
    fetch(`${import.meta.env.VITE_API_BASE_URL}/logs?limit=${limit}`, {
      headers: { Authorization: `Bearer ${import.meta.env.VITE_API_KEY}` },
    }).then((r) => r.json()),
}
```
