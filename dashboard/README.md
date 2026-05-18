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

The dashboard is backed by a real 47-student pilot dataset from Queens College, imported from CSV and stored in Supabase. Student data, milestones, KPI aggregates, and advisor notes all persist in Supabase and survive page refreshes and redeployments.

---

## Backend / Data Layer

The dashboard uses **Supabase** (hosted PostgreSQL) as its backend. There is no separate API server — the frontend talks directly to Supabase via the JS client using the public anon key.

### Tables

| Table | Purpose |
|---|---|
| `students` | One row per student — profile, scores, status, career direction, pilot fields (GPA, attendance, college, class year, age, enrollment status) |
| `milestones` | Career readiness milestones for each student (child of students) |
| `advisor_notes` | Timestamped notes written by counselors (child of students) |
| `recent_activity` | Timestamped activity events per student (surveys, job views, networking events) |

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
  ├── fetchStudents()                  → students + milestones + recent_activity
  ├── fetchKpiSummary()                → student_kpi_summary view
  └── fetchMilestoneCategorySummary()  → milestone_category_summary view

App.tsx (on student drawer open)
  └── fetchAdvisorNotes(studentId)     → advisor_notes for that student

App.tsx (on note submit)
  └── insertAdvisorNote(studentId, text) → writes to advisor_notes

App.tsx (on milestone add/delete)
  ├── insertMilestone(studentId, label, category)
  └── deleteMilestone(milestoneId)
```

### Schema

Run `scripts/schema.sql` once in Supabase Studio (SQL editor) to create all tables and views. The pilot data migration is at `scripts/migrations/2026-05-16_pilot_data.sql`.

`scripts/seed-supabase.mjs` seeds synthetic students with realistic milestone and activity templates (see `scripts/templates/engagement-templates.mjs`).

**Row-Level Security is intentionally off** — capstone demo, all visitors see all data. Enable RLS before any real production use.

---

## Dashboard Sections

### KPI Cards
Four summary cards at the top: total students, average engagement score, milestone completion rate, students needing attention. Values come from the `student_kpi_summary` database view — not computed in the browser.

### Engagement Score Distribution
A histogram showing how students are distributed across five engagement bands (0–20, 20–40, 40–60, 60–80, 80–100), rendered in a purple ramp from light to dark. Gives counselors a quick read on overall cohort health.

### Milestone Completion Chart
A horizontal bar chart showing Completed vs. In Progress counts for each of the five milestone categories: Assessment, Resume & Profile, Networking, Work Experience, and Applications. Always displays all five categories even if a category has no data yet.

### Insights Panel
Surfaces two automatically computed alerts: students with engagement below 40 who haven't been contacted recently, and students with no milestones completed. Counselors can expand each alert to see the affected student list.

### Student Table
Filterable, searchable table of all students with inline status badges and engagement scores. Supports filter chips (At Risk, Needs Attention, High/Medium/Low engagement tier) and free-text search by student ID, email, or major.

### Student Detail (side drawer)
Opens when a student row is clicked. Contains:

- **Follow-up** — status selector and one-click check-in with an 8-second undo window
- **Career Narrative** — career direction label and self-reported confidence score (1–5 dot scale)
- **Academic Profile** — pilot data fields: college, class year, age, GPA (×4 normalized), attendance rate, enrollment status
- **Milestones** — add and delete milestones with category labels and inline delete confirmation
- **Advisor Notes** — add and view timestamped counselor notes, persisted to Supabase
- **Recent Activity** — chronological feed of student events merged with completed milestone events

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
pnpm test --run    # single run (CI) — 150 tests across 14 files
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
