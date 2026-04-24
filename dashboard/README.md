# CareerDay — Counselor Dashboard

A tool for career counselors and advisors to view and manage individual student career progress at a glance.

**Sponsor:** CareerDayy

---

## Live Demo

**Deployed:** [careerday.vercel.app](https://careerday.vercel.app)

| Resource | Link |
|---|---|
| Live app | https://careerday.vercel.app |
| Figma prototype | https://doll-dazzle-04316546.figma.site |
| GitHub repo | https://github.com/rpushkar9/careerday |

---

## Stack

| Layer | Technology |
|---|---|
| Framework | Vite + React 18 + TypeScript |
| Styling | Tailwind CSS + shadcn/ui |
| Table | TanStack Table v8 |
| Charts | Recharts |
| Validation | Zod |
| Tests | Vitest + React Testing Library |
| Database | Supabase (PostgreSQL) |
| Deployment | Vercel |
| Package manager | pnpm |

---

## Overview

Counselors need a consolidated view of each student's career readiness — without digging through separate tools or asking students to self-report in meetings. The Counselor Dashboard brings together a student's career narrative, milestone progress, advisor notes, and recent activity into a single, scannable interface.

Student data, milestones, KPI aggregates, and advisor notes all persist in Supabase. Notes written in the UI are saved immediately and survive page refreshes and redeployments.

---

## Backend / Data Layer

The dashboard uses **Supabase** (hosted PostgreSQL) as its backend. There is no separate API server — the frontend talks directly to Supabase via the JS client using the public anon key.

### Tables

| Table | Purpose |
|---|---|
| `students` | One row per student — profile, scores, status, career direction |
| `milestones` | Career readiness milestones for each student (child of students) |
| `advisor_notes` | Timestamped notes written by counselors (child of students) |

### Views

| View | Purpose |
|---|---|
| `student_kpi_summary` | Aggregated KPI row: total students, avg engagement, milestone completion rate, attention count |
| `milestone_category_summary` | Per-category milestone completion stats used by the milestone chart |

Both views are read by the frontend on load — no aggregation happens in the browser.

### Data access pattern

All database calls live in `src/data/queries.ts`. `App.tsx` calls them on mount and passes results down as props. No components query Supabase directly.

```
App.tsx (on mount)
  ├── fetchStudents()              → students + milestones
  ├── fetchKpiSummary()            → student_kpi_summary view
  └── fetchMilestoneCategorySummary() → milestone_category_summary view

App.tsx (on student drawer open)
  └── fetchAdvisorNotes(studentId) → advisor_notes for that student

App.tsx (on note submit)
  └── insertAdvisorNote(studentId, text) → writes to advisor_notes
```

### Schema

Run `scripts/schema.sql` once in Supabase Studio (SQL editor) to create all tables and views. Run `scripts/seed-supabase.mjs` once to seed 30 students.

**Row-Level Security is intentionally off** — capstone demo, all visitors see all data. Enable RLS before any real production use.

---

## Dashboard Sections

### KPI Cards
Four summary cards at the top: total students, average engagement score, milestone completion rate, students needing attention. Values come from the `student_kpi_summary` database view — not computed in the browser.

### Career Narrative
Displays the student's stated career goal alongside a self-reported confidence level (e.g., 4/5). Gives counselors immediate context before a meeting or check-in.

### Advisor Notes
Timestamped notes added by the advisor. Supports adding new notes and viewing the full note history. Notes are written to Supabase immediately and persist across sessions.

### Career Milestones
A checklist of key career readiness milestones (e.g., Resume Reviewed, Mock Interview Scheduled) with status badges:
- **Completed**
- **In Progress**
- **Pending**

### Recent Activity
A chronological feed of recent student actions — such as completing a survey, viewing job postings, or attending a networking event — so counselors can see engagement without asking.

---

## Running Locally

**Prerequisites:** Node.js 18+ and [pnpm](https://pnpm.io/installation)

### 1. Install dependencies

```bash
# from the dashboard/ directory
pnpm install
```

### 2. Configure environment variables

Create `dashboard/.env.local`:

```
VITE_SUPABASE_URL=https://xondjyloknyigiovvoas.supabase.co
VITE_SUPABASE_ANON_KEY=<anon key — ask the project owner>
```

The app throws a descriptive error at startup if either variable is missing.

> **Key format**: Use the JWT anon key (starts with `eyJhbGci...`), not the new `sb_publishable_*` format. Supabase JS v2 requires the JWT format.

### 3. Start the dev server

```bash
pnpm dev   # → http://localhost:5173
```

### Other commands

```bash
pnpm build         # production build → dist/
pnpm preview       # serve the production build locally
pnpm test          # Vitest watch mode
pnpm test --run    # single run (CI)
pnpm lint          # ESLint
pnpm lint:fix      # ESLint auto-fix
pnpm format        # Prettier (write)
pnpm format:check  # Prettier (check — CI gate)
npx tsc --noEmit   # type-check only
```

> All commands must be run from the `dashboard/` directory, not the repo root.

---

## Deployment

Deployed to Vercel. The project root is `dashboard/` — Vercel runs `pnpm build` from there.

**Required Vercel environment variables:**

| Variable | Value |
|---|---|
| `VITE_SUPABASE_URL` | `https://xondjyloknyigiovvoas.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | JWT anon key from Supabase project settings |

> **Important**: Removing or changing a Vercel env var triggers an automatic redeploy. If that causes the wrong commit to deploy, run `vercel --prod` from the monorepo root (`careerday/`, not `dashboard/`) to force the correct deployment.

