-- Migration: 2026-05-16 Pilot data integration
-- Adds new CSV-sourced columns, makes name/confidence_score/engagement_trend nullable.
-- Idempotent: uses IF NOT EXISTS / IF EXISTS guards.

-- ── Drop NOT NULL constraints ────────────────────────────────────────────────
ALTER TABLE students ALTER COLUMN name DROP NOT NULL;
ALTER TABLE students ALTER COLUMN confidence_score DROP NOT NULL;
ALTER TABLE students ALTER COLUMN engagement_trend DROP NOT NULL;

-- ── Add new columns (all nullable for backwards compatibility) ────────────────
ALTER TABLE students ADD COLUMN IF NOT EXISTS age INTEGER;
ALTER TABLE students ADD COLUMN IF NOT EXISTS gpa NUMERIC;
ALTER TABLE students ADD COLUMN IF NOT EXISTS attendance_rate NUMERIC;
ALTER TABLE students ADD COLUMN IF NOT EXISTS college TEXT;
ALTER TABLE students ADD COLUMN IF NOT EXISTS class_year TEXT;
ALTER TABLE students ADD COLUMN IF NOT EXISTS enrollment_status TEXT;
ALTER TABLE students ADD COLUMN IF NOT EXISTS engagement_category TEXT CHECK (engagement_category IN ('Red', 'Yellow', 'Green'));
