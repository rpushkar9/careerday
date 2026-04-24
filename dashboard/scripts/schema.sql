-- ============================================================
-- CareerDayy Counselor Dashboard — Supabase Schema
-- Paste into Supabase Studio > SQL Editor and run.
-- ============================================================

-- ── Auth / RLS note ─────────────────────────────────────────────────────────
-- Row-Level Security is intentionally NOT enabled on any table.
-- This dashboard uses the Supabase anon key for all reads and writes.
-- All visitors see all students — acceptable for the capstone demo.
-- Before production use: enable RLS and add policies tied to Supabase Auth.
-- ────────────────────────────────────────────────────────────────────────────

-- Students
CREATE TABLE IF NOT EXISTS students (
  id                 TEXT PRIMARY KEY,
  name               TEXT        NOT NULL,
  email              TEXT        NOT NULL,
  major              TEXT        NOT NULL,
  graduation_year    INTEGER     NOT NULL,
  career_direction   TEXT        NOT NULL CHECK (career_direction IN ('clear', 'exploring', 'uncertain', 'undeclared')),
  confidence_score   INTEGER     NOT NULL,
  engagement_score   NUMERIC     NOT NULL,
  engagement_trend   TEXT        NOT NULL CHECK (engagement_trend IN ('up', 'down', 'stable')),
  last_active_date   DATE        NOT NULL,
  last_contacted_date DATE       NOT NULL,
  status             TEXT        NOT NULL CHECK (status IN ('On Track', 'At Risk', 'Needs Attention'))
);

-- Milestones (child of students)
CREATE TABLE IF NOT EXISTS milestones (
  id             TEXT PRIMARY KEY,
  student_id     TEXT        NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  label          TEXT        NOT NULL,
  status         TEXT        NOT NULL CHECK (status IN ('Completed', 'In Progress', 'Pending')),
  category       TEXT        NOT NULL CHECK (category IN ('Assessment', 'Documents', 'Experience', 'Applications', 'Financial')),
  completed_date DATE
);

-- Advisor Notes (child of students)
CREATE TABLE IF NOT EXISTS advisor_notes (
  id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id   TEXT        NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  text         TEXT        NOT NULL,
  author_name  TEXT        NOT NULL DEFAULT 'Counselor',
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ── Views ────────────────────────────────────────────────────

-- KPI summary: one row, four aggregate fields
-- Uses a CTE to pre-aggregate milestones so the student-level COUNT/AVG
-- are not inflated by the one-to-many join.
CREATE OR REPLACE VIEW student_kpi_summary AS
WITH milestone_stats AS (
  SELECT
    student_id,
    COUNT(*)                                    AS total,
    COUNT(*) FILTER (WHERE status = 'Completed') AS completed
  FROM milestones
  GROUP BY student_id
)
SELECT
  COUNT(s.id)::INTEGER                                                     AS total_students,
  COALESCE(ROUND(AVG(s.engagement_score))::INTEGER, 0)                    AS avg_engagement_score,
  COALESCE(
    ROUND(
      SUM(COALESCE(ms.completed, 0))::NUMERIC
      / NULLIF(SUM(COALESCE(ms.total, 0)), 0) * 100,
      1
    ),
    0
  )::NUMERIC                                                               AS milestone_completion_rate,
  COUNT(*) FILTER (WHERE s.status = 'Needs Attention')::INTEGER           AS students_needing_attention_count
FROM students s
LEFT JOIN milestone_stats ms ON ms.student_id = s.id;

-- Milestone category summary: one row per category
CREATE OR REPLACE VIEW milestone_category_summary AS
SELECT
  category,
  COUNT(*) FILTER (WHERE status = 'Completed')::INTEGER    AS completed_count,
  COUNT(*) FILTER (WHERE status = 'In Progress')::INTEGER  AS in_progress_count,
  COUNT(*)::INTEGER                                         AS total_count,
  COALESCE(
    ROUND(
      COUNT(*) FILTER (WHERE status = 'Completed')::NUMERIC
      / NULLIF(COUNT(*), 0) * 100,
      1
    ),
    0
  )::NUMERIC                                               AS completion_rate
FROM milestones
GROUP BY category;
