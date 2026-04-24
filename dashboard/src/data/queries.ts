/**
 * Supabase query functions — all async, all typed.
 * These are the live-data counterparts to the mock data in data/index.ts.
 *
 * deriveStudent/deriveEngagementTier are intentionally inlined here because
 * data/index.ts does not export them (they are module-private there).
 */

import { supabase } from "@/lib/supabase";
import { ENGAGEMENT_THRESHOLDS } from "@/lib/constants";
import type {
  Student,
  EngagementTier,
  Milestone,
  AdvisorNote,
} from "@/types/student";
import type {
  KPIPeriodSnapshot,
  MilestoneCategoryCompletion,
} from "@/types/kpi";

// ── Derivation helpers (mirrored from data/index.ts, not exported from there) ─

type RawStudent = Omit<Student, "engagementTier" | "flaggedForAttention">;

function deriveEngagementTier(score: number): EngagementTier {
  if (score >= ENGAGEMENT_THRESHOLDS.HIGH) return "High";
  if (score >= ENGAGEMENT_THRESHOLDS.MEDIUM) return "Medium";
  return "Low";
}

function deriveStudent(raw: RawStudent): Student {
  const engagementTier = deriveEngagementTier(raw.engagementScore);
  return {
    ...raw,
    engagementTier,
    flaggedForAttention:
      raw.status === "Needs Attention" || engagementTier === "Low",
  };
}

// ── DB row shapes ────────────────────────────────────────────────────────────
// These interfaces mirror the Supabase table columns. The casts (data as StudentRow[])
// are unchecked — they trust that the DB contains values matching the TypeScript
// unions (e.g. status: "On Track"|"At Risk"|"Needs Attention"). The schema.sql
// enforces this at the DB level via CHECK constraints. If you add a new status
// value, update both the TS union and the CHECK constraint.

interface StudentRow {
  id: string;
  name: string;
  email: string;
  major: string;
  graduation_year: number;
  career_direction: Student["careerDirection"];
  confidence_score: number;
  engagement_score: number;
  engagement_trend: Student["engagementTrend"];
  last_active_date: string;
  last_contacted_date: string;
  status: Student["status"];
  milestones: MilestoneRow[] | null;
}

interface MilestoneRow {
  id: string;
  label: string;
  status: Milestone["status"];
  category: string;
  completed_date?: string | null;
}

interface AdvisorNoteRow {
  id: string;
  text: string;
  author_name: string;
  created_at: string;
}

interface KpiSummaryRow {
  total_students: number | string;
  avg_engagement_score: number | string;
  milestone_completion_rate: number | string;
  students_needing_attention_count: number | string;
}

interface MilestoneCategorySummaryRow {
  category: string;
  completed_count: number | string;
  in_progress_count: number | string;
  total_count: number | string;
  completion_rate: number | string;
}

// ── Mappers ──────────────────────────────────────────────────────────────────

function mapMilestone(row: MilestoneRow): Milestone {
  return {
    id: row.id,
    label: row.label,
    status: row.status,
    category: row.category,
    ...(row.completed_date ? { completedDate: row.completed_date } : {}),
  };
}

function mapStudentRow(row: StudentRow): Student {
  const raw: RawStudent = {
    id: row.id,
    name: row.name,
    email: row.email,
    major: row.major,
    graduationYear: row.graduation_year,
    careerDirection: row.career_direction,
    confidenceScore: row.confidence_score,
    engagementScore: row.engagement_score,
    engagementTrend: row.engagement_trend,
    lastActiveDate: row.last_active_date,
    lastContactedDate: row.last_contacted_date,
    status: row.status,
    milestones: (row.milestones ?? []).map(mapMilestone),
    advisorNotes: [],
    recentActivity: [],
  };
  return deriveStudent(raw);
}

function mapAdvisorNoteRow(row: AdvisorNoteRow): AdvisorNote {
  return {
    id: row.id,
    text: row.text,
    authorName: row.author_name,
    timestamp: row.created_at,
  };
}

// ── Query functions ──────────────────────────────────────────────────────────

/**
 * Fetch all students with their nested milestones.
 * advisorNotes and recentActivity are not stored on the student row;
 * they default to [] here and are loaded on demand via fetchAdvisorNotes.
 */
export async function fetchStudents(): Promise<Student[]> {
  const { data, error } = await supabase
    .from("students")
    .select("*, milestones(*)");

  if (error) throw error;

  return ((data ?? []) as StudentRow[]).map(mapStudentRow);
}

/**
 * Fetch all advisor notes for a given student, newest first.
 */
export async function fetchAdvisorNotes(
  studentId: string,
): Promise<AdvisorNote[]> {
  const { data, error } = await supabase
    .from("advisor_notes")
    .select("*")
    .eq("student_id", studentId)
    .order("created_at", { ascending: false });

  if (error) throw error;

  return ((data ?? []) as AdvisorNoteRow[]).map(mapAdvisorNoteRow);
}

/**
 * Insert a new advisor note and return the persisted row.
 */
export async function insertAdvisorNote(
  studentId: string,
  text: string,
): Promise<AdvisorNote> {
  const { data, error } = await supabase
    .from("advisor_notes")
    .insert({ student_id: studentId, text, author_name: "Counselor" })
    .select()
    .single();

  if (error) throw error;

  return mapAdvisorNoteRow(data as AdvisorNoteRow);
}

/**
 * Fetch the aggregated KPI summary from the student_kpi_summary view.
 * Returns all-zeros if the view is empty (students table is empty).
 */
export async function fetchKpiSummary(): Promise<KPIPeriodSnapshot> {
  const { data, error } = await supabase
    .from("student_kpi_summary")
    .select("*");

  if (error) throw error;

  if (!data || data.length === 0) {
    return {
      totalStudents: 0,
      averageEngagementScore: 0,
      milestoneCompletionRate: 0,
      studentsNeedingAttentionCount: 0,
    };
  }

  const row = data[0] as KpiSummaryRow;
  return {
    totalStudents: Number(row.total_students),
    averageEngagementScore: Number(row.avg_engagement_score),
    milestoneCompletionRate: Number(row.milestone_completion_rate),
    studentsNeedingAttentionCount: Number(
      row.students_needing_attention_count,
    ),
  };
}

/**
 * Fetch per-category milestone completion stats from the
 * milestone_category_summary view.
 */
export async function fetchMilestoneCategorySummary(): Promise<
  MilestoneCategoryCompletion[]
> {
  const { data, error } = await supabase
    .from("milestone_category_summary")
    .select("*");

  if (error) throw error;

  return ((data ?? []) as MilestoneCategorySummaryRow[]).map((row) => ({
    category: row.category,
    completedCount: Number(row.completed_count),
    inProgressCount: Number(row.in_progress_count),
    totalCount: Number(row.total_count),
    completionRate: Number(row.completion_rate),
  }));
}
