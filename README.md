<div align="center">

# 🎓 CareerDay

### A career-guidance platform that turns a student's major and interests into data-backed career paths — and gives counselors a live view of every student's readiness.

![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-15-000000?logo=nextdotjs&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)
![Supabase](https://img.shields.io/badge/Supabase-Postgres-3ECF8E?logo=supabase&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-Python-009688?logo=fastapi&logoColor=white)
![Vercel](https://img.shields.io/badge/Deployed-Vercel-000000?logo=vercel&logoColor=white)
![Tests](https://img.shields.io/badge/tests-150%20passing-brightgreen)

**Live:** [mycareer.day](https://www.mycareer.day/) (student portal) · [careerday.vercel.app](https://careerday.vercel.app) (counselor dashboard)

</div>

---

<div align="center">

### Counselor Dashboard — every student's career readiness at a glance

![CareerDay Counselor Dashboard](docs/screenshots/counselor-dashboard.png)

</div>

---

## What it is

Students often don't know which careers their major leads to, and counselors have no consolidated
view of who needs help. **CareerDay** closes both gaps with three connected parts:

| Part | What it does | Stack |
|------|--------------|-------|
| **Student portal** (`frontend/`) | Onboarding survey → career matches → explore careers → roadmaps | Next.js 15 (App Router), React 19, TypeScript, Tailwind, shadcn/ui |
| **Recommendation engine** (`backend/`) | Scores & ranks occupations from a student's field of study | Python, FastAPI, pandas, scikit-learn |
| **Counselor dashboard** (`dashboard/`) | Live cohort analytics + per-student follow-up on a **real 47-student pilot** | Vite + React + TypeScript, Supabase (Postgres), TanStack Table, Recharts |

> **Featured component:** the **Counselor Dashboard** (`dashboard/`) is the deepest slice of this repo —
> a production analytics tool backed by a real Queens College pilot dataset. See
> [`dashboard/README.md`](dashboard/README.md) for its full write-up.

## Highlights

- **Data-driven recommendations.** A **5-factor weighted model** (skill similarity, pay, projected
  growth, education & location fit) ranks occupations using **TF-IDF + cosine similarity** over **5+
  federal labor datasets** (BLS SOC, CIP crosswalk, OEWS wages, Employment Projections).
- **Real pilot, real persistence.** The counselor dashboard runs on a **47-student pilot** (Queens
  College), stored in **Supabase** across a normalized 4-table schema with 2 server-side SQL
  aggregation views — no browser-side math.
- **Counselor workflow.** KPI cards, engagement-distribution and milestone-completion charts, an
  auto-computed insights panel, a filterable/searchable student table, and a per-student detail
  drawer (follow-up check-in with undo, advisor notes, milestone add/delete, activity feed).
- **Engineering rigor.** **150 automated tests** (Vitest + RTL) across 14 files, runtime **Zod**
  validation, error boundaries, and a CI gate (format + lint + build) — deployed on **Vercel**.

## Architecture

```
frontend/   Next.js 15 student portal ──▶ src/app/api/*  (proxy routes)
                                              │
backend/    FastAPI recommendation engine ◀──┘   (5-factor scoring over federal labor data)
            + Node/Express auth service

dashboard/  Vite + React counselor dashboard ──▶ Supabase (Postgres: 4 tables + 2 SQL views)
```

- **API proxy pattern:** the student portal never calls external services directly — all external
  calls go through Next.js Route Handlers in `src/app/api/`.
- **Dashboard data flow:** all DB calls live in `dashboard/src/data/queries.ts`; the root component
  fetches on mount and passes results down as props (no component queries Supabase directly).

## Tech stack

**Frontend:** Next.js 15, React 19, TypeScript, Vite, Tailwind CSS, shadcn/ui (Radix), TanStack Table, Recharts, Zod
**Backend / Data:** Python, FastAPI, pandas, scikit-learn, Node/Express, Supabase (PostgreSQL), MongoDB, Pusher
**Testing / Infra:** Vitest, React Testing Library, ESLint, Prettier, GitHub Actions CI, Vercel, Railway

## Getting started

```bash
# Student portal
cd frontend && pnpm install && pnpm dev

# Counselor dashboard (see dashboard/README.md for Supabase env setup)
cd dashboard && pnpm install && pnpm dev        # → http://localhost:5173
```

CI (`.github/workflows/check.yml`) runs format check, lint, and build on every push.

## About this project

CareerDay was built as a **CareerDayy capstone**. This repository showcases the full platform, with
the **Counselor Dashboard** (design system, Supabase data layer, tests, and UX) as the component I
own end-to-end. See [`dashboard/README.md`](dashboard/README.md) for the deep dive.
