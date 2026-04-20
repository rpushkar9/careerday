# CareerDay — Counselor Dashboard

A tool for career counselors and advisors to view and manage individual student career progress at a glance.

**Sponsor:** CareerDayy

---

## Live Demo

> **Uses typed mock data — not connected to a live backend.**

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
| Framework | Vite + React 19 |
| Language | TypeScript 6 |
| Styling | Tailwind CSS + shadcn/ui |
| Table | TanStack Table v8 |
| Charts | Recharts |
| Validation | Zod |
| Tests | Vitest + React Testing Library |
| Package manager | pnpm |

---

## Overview

Counselors need a consolidated view of each student's career readiness — without digging through separate tools or asking students to self-report in meetings. The Counselor Dashboard brings together a student's career narrative, milestone progress, advisor notes, and recent activity into a single, scannable interface.

> All data is anonymized mock data bundled with the app. No backend or authentication is required.

---

## Dashboard Sections

### Career Narrative
Displays the student's stated career goal alongside a self-reported confidence level (e.g., 4/5). Gives counselors immediate context before a meeting or check-in.

### Advisor Notes
Timestamped notes added by the advisor. Supports adding new notes and viewing the full note history — creating a lightweight, persistent record of advising interactions.

### Career Milestones
A checklist of key career readiness milestones (e.g., Resume Reviewed, Mock Interview Scheduled) with status badges:
- **Completed**
- **In Progress**
- **Pending**

### Recent Activity
A chronological feed of recent student actions — such as completing a survey, viewing job postings, or attending a networking event — so counselors can see engagement without asking.

---

## Running the App

This is a standalone Vite + React SPA. No backend or environment variables are required — all data is typed mock data bundled with the app.

**Prerequisites:** Node.js 18+ and [pnpm](https://pnpm.io/installation)

```bash
# from the dashboard/ directory
pnpm install       # install dependencies (first time only)
pnpm dev           # start local dev server at http://localhost:5173
```

**Other commands:**

```bash
pnpm build         # production build → dist/
pnpm preview       # serve the production build locally
pnpm test          # run unit tests (Vitest)
pnpm lint          # ESLint
pnpm format        # Prettier (write)
pnpm format:check  # Prettier (check only — used in CI)
```

> All commands must be run from the `dashboard/` directory, not the repo root.
