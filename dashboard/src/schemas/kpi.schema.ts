import { z } from "zod";

// ── DB row schemas (snake_case) ───────────────────────────────────────────────

export const KpiSummaryRowSchema = z.object({
  total_students: z.union([z.number(), z.string()]),
  avg_engagement_score: z.union([z.number(), z.string()]),
  milestone_completion_rate: z.union([z.number(), z.string()]),
  students_needing_attention_count: z.union([z.number(), z.string()]),
});

export const MilestoneCategorySummaryRowSchema = z.object({
  category: z.string(),
  completed_count: z.union([z.number(), z.string()]),
  in_progress_count: z.union([z.number(), z.string()]),
  total_count: z.union([z.number(), z.string()]),
  completion_rate: z.union([z.number(), z.string()]),
});

// ── App-level schemas (camelCase) ─────────────────────────────────────────────

export const KPIPeriodSnapshotSchema = z.object({
  totalStudents: z.number().int().min(0),
  averageEngagementScore: z.number().min(0).max(100),
  milestoneCompletionRate: z.number().min(0).max(100),
  studentsNeedingAttentionCount: z.number().int().min(0),
});

export const KPISnapshotSchema = z.object({
  current: KPIPeriodSnapshotSchema,
  prior: KPIPeriodSnapshotSchema,
});

export const EngagementDataPointSchema = z.object({
  date: z.string(),
  engagementScore: z.number().min(0).max(100),
  target: z.number().min(0).max(100),
});

export const MilestoneCategoryCompletionSchema = z.object({
  category: z.string().min(1),
  completedCount: z.number().int().min(0),
  inProgressCount: z.number().int().min(0),
  totalCount: z.number().int().min(1),
  completionRate: z.number().min(0).max(100),
});
