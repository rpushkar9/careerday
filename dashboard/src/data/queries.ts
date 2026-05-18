/**
 * Supabase query functions — all async, all typed.
 * These are the live-data counterparts to the mock data in data/index.ts.
 */

import { supabase } from "@/lib/supabase";
import { deriveStudent, type RawStudent } from "@/lib/derive";
import type {
  Student,
  Milestone,
  AdvisorNote,
  ActivityEvent,
} from "@/types/student";
import type {
  KPIPeriodSnapshot,
  MilestoneCategoryCompletion,
} from "@/types/kpi";
import { z } from "zod";
import {
  ActivityRowSchema,
  MilestoneRowSchema,
  StudentRowSchema,
  AdvisorNoteRowSchema,
} from "@/schemas/student.schema";
import {
  KpiSummaryRowSchema,
  MilestoneCategorySummaryRowSchema,
} from "@/schemas/kpi.schema";

type ActivityRow = z.infer<typeof ActivityRowSchema>;
type MilestoneRow = z.infer<typeof MilestoneRowSchema>;
type StudentRow = z.infer<typeof StudentRowSchema>;
type AdvisorNoteRow = z.infer<typeof AdvisorNoteRowSchema>;

// ── Mappers ──────────────────────────────────────────────────────────────────

function mapActivityRow(row: ActivityRow): ActivityEvent {
  return {
    id: row.id,
    description: row.description,
    eventType: row.event_type,
    timestamp: row.timestamp,
  };
}

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
    name: row.name ?? null,
    email: row.email,
    major: row.major,
    graduationYear: row.graduation_year,
    careerDirection: row.career_direction,
    confidenceScore: row.confidence_score ?? null,
    engagementScore: Number(row.engagement_score),
    engagementTrend: row.engagement_trend ?? null,
    lastActiveDate: row.last_active_date,
    lastContactedDate: row.last_contacted_date,
    status: row.status,
    milestones: (row.milestones ?? []).map(mapMilestone),
    advisorNotes: [],
    recentActivity: (row.recent_activity ?? [])
      .map(mapActivityRow)
      .sort((a, b) => Date.parse(b.timestamp) - Date.parse(a.timestamp)),
    age: row.age ?? null,
    gpa: row.gpa != null ? Number(row.gpa) : null,
    attendanceRate: row.attendance_rate != null ? Number(row.attendance_rate) : null,
    college: row.college ?? null,
    classYear: row.class_year ?? null,
    enrollmentStatus: row.enrollment_status ?? null,
    engagementCategory: row.engagement_category ?? null,
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
    .select("*, milestones(*), recent_activity(*)");

  if (error) throw error;

  return StudentRowSchema.array().parse(data ?? []).map(mapStudentRow);
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

  return AdvisorNoteRowSchema.array().parse(data ?? []).map(mapAdvisorNoteRow);
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

  return mapAdvisorNoteRow(AdvisorNoteRowSchema.parse(data));
}

export async function insertMilestone(
  studentId: string,
  label: string,
  category: string,
): Promise<Milestone> {
  const { data, error } = await supabase
    .from("milestones")
    .insert({
      id: crypto.randomUUID(),
      student_id: studentId,
      label,
      status: "Pending",
      category,
      completed_date: null,
    })
    .select()
    .single();

  if (error) throw error;

  return mapMilestone(MilestoneRowSchema.parse(data));
}

export async function deleteMilestone(milestoneId: string): Promise<void> {
  const { error } = await supabase
    .from("milestones")
    .delete()
    .eq("id", milestoneId);
  if (error) throw error;
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

  const row = KpiSummaryRowSchema.parse(data[0]);
  return {
    totalStudents: Number(row.total_students),
    averageEngagementScore: Number(row.avg_engagement_score),
    milestoneCompletionRate: Number(row.milestone_completion_rate),
    studentsNeedingAttentionCount: Number(row.students_needing_attention_count),
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

  return MilestoneCategorySummaryRowSchema.array().parse(data ?? []).map((row) => ({
    category: row.category,
    completedCount: Number(row.completed_count),
    inProgressCount: Number(row.in_progress_count),
    totalCount: Number(row.total_count),
    completionRate: Number(row.completion_rate),
  }));
}

/**
 * Overwrite a student's status. The student_kpi_summary view reflects this
 * automatically on next fetch.
 */
export async function updateStudentStatus(
  studentId: string,
  status: Student["status"],
): Promise<void> {
  const { error } = await supabase
    .from("students")
    .update({ status })
    .eq("id", studentId);
  if (error) throw error;
}

/**
 * Set last_contacted_date to today (YYYY-MM-DD in UTC).
 * Date-only strings are parsed as UTC midnight by JS, so this round-trips
 * correctly through new Date(str).toLocaleDateString() in the UI.
 * Returns the date string written so the caller can update local state.
 */
export async function markStudentCheckedIn(studentId: string): Promise<string> {
  const today = new Date().toISOString().slice(0, 10);
  const { error } = await supabase
    .from("students")
    .update({ last_contacted_date: today })
    .eq("id", studentId);
  if (error) throw error;
  return today;
}

/**
 * Revert last_contacted_date to a previous date string (undo check-in).
 */
export async function revertStudentCheckedIn(
  studentId: string,
  previousDate: string,
): Promise<void> {
  const { error } = await supabase
    .from("students")
    .update({ last_contacted_date: previousDate })
    .eq("id", studentId);
  if (error) throw error;
}
