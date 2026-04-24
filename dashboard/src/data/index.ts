/**
 * Data-access layer — the ONLY module that imports from data/mock/.
 * All components import from this file, never directly from mock/.
 *
 * Responsibilities:
 * 1. Validate raw mock engagement data with Zod schemas at module load time
 * 2. Export the validated engagementTimeSeries array
 * 3. Export utility functions: filterByChip, sliceEngagementData,
 *    deriveTrend, computeCurrentKPIPeriod
 *
 * Static data arrays (students, kpiSnapshot, milestoneCategoryData) are NOT
 * exported here. Live data comes from src/data/queries.ts (Supabase).
 * computeCurrentKPIPeriod is retained for unit tests; App.tsx uses
 * fetchKpiSummary() from the database view instead.
 */
import { z } from "zod";
import type {
  Student,
  TrendDirection,
  KPIPeriodSnapshot,
  EngagementDataPoint,
} from "@/types";
import type { FilterChip } from "@/lib/constants";
import { EngagementDataPointSchema } from "@/schemas/kpi.schema";

import { rawEngagementTimeSeries } from "./mock/kpi";

// ── Validation ──────────────────────────────────────────────────────────────

const validatedEngagementTimeSeries = z
  .array(EngagementDataPointSchema)
  .parse(rawEngagementTimeSeries);

// ── Derivation helpers ──────────────────────────────────────────────────────

export function deriveTrend(current: number, prior: number): TrendDirection {
  if (current > prior) return "up";
  if (current < prior) return "down";
  return "neutral";
}

/**
 * Derive the current-period KPI snapshot from the live student array.
 * All four fields are computed from the same dataset, so they are always
 * consistent with each other and with filter chip counts.
 *
 * - averageEngagementScore: arithmetic mean of engagementScore, rounded to integer
 * - milestoneCompletionRate: completed milestones / total milestones × 100,
 *   rounded to one decimal place
 * - studentsNeedingAttentionCount: students with status === "Needs Attention"
 * - totalStudents: students.length
 */
export function computeCurrentKPIPeriod(
  studentList: Student[],
): KPIPeriodSnapshot {
  const totalStudents = studentList.length;

  const averageEngagementScore =
    totalStudents === 0
      ? 0
      : Math.round(
          studentList.reduce((sum, s) => sum + s.engagementScore, 0) /
            totalStudents,
        );

  const allMilestones = studentList.flatMap((s) => s.milestones);
  const completedCount = allMilestones.filter(
    (m) => m.status === "Completed",
  ).length;
  const milestoneCompletionRate =
    allMilestones.length === 0
      ? 0
      : Math.round((completedCount / allMilestones.length) * 1000) / 10;

  const studentsNeedingAttentionCount = studentList.filter(
    (s) => s.status === "Needs Attention",
  ).length;

  return {
    totalStudents,
    averageEngagementScore,
    milestoneCompletionRate,
    studentsNeedingAttentionCount,
  };
}

// ── Public exports ──────────────────────────────────────────────────────────

export const engagementTimeSeries: EngagementDataPoint[] =
  validatedEngagementTimeSeries;

// ── Query functions ─────────────────────────────────────────────────────────

export function filterByChip(list: Student[], chip: FilterChip): Student[] {
  switch (chip) {
    case "All":
      return list;
    case "Needs Attention":
      return list.filter((s) => s.status === "Needs Attention");
    case "Milestone Behind":
      return list.filter((s) =>
        s.milestones.some((m) => m.status === "Pending"),
      );
    case "Low Engagement":
      return list.filter((s) => s.engagementTier === "Low");
  }
}

export function sliceEngagementData(
  data: EngagementDataPoint[],
  days: number,
): EngagementDataPoint[] {
  return data.slice(-days);
}
