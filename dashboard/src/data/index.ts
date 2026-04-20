/**
 * Data-access layer — the ONLY module that imports from data/mock/.
 * All components import from this file, never directly from mock/.
 *
 * Responsibilities:
 * 1. Validate raw mock data with Zod schemas at module load time
 * 2. Derive computed fields (engagementTier, flaggedForAttention)
 * 3. Export typed, validated data + helper functions
 */
import { z } from "zod";
import type {
  Student,
  EngagementTier,
  TrendDirection,
  KPISnapshot,
  KPIPeriodSnapshot,
  EngagementDataPoint,
  MilestoneCategoryCompletion,
} from "@/types";
import type { FilterChip } from "@/lib/constants";
import { ENGAGEMENT_THRESHOLDS } from "@/lib/constants";
import { RawStudentSchema } from "@/schemas/student.schema";
import {
  KPIPeriodSnapshotSchema,
  EngagementDataPointSchema,
  MilestoneCategoryCompletionSchema,
} from "@/schemas/kpi.schema";

import { rawStudents } from "./mock/students";
import {
  rawKpiPrior,
  rawEngagementTimeSeries,
  rawMilestoneCategoryData,
} from "./mock/kpi";

// ── Validation ──────────────────────────────────────────────────────────────

const validatedStudents = z.array(RawStudentSchema).parse(rawStudents);
const validatedKpiPrior = KPIPeriodSnapshotSchema.parse(rawKpiPrior);
const validatedEngagementTimeSeries = z
  .array(EngagementDataPointSchema)
  .parse(rawEngagementTimeSeries);
const validatedMilestoneCategoryData = z
  .array(MilestoneCategoryCompletionSchema)
  .parse(rawMilestoneCategoryData);

// ── Derivation helpers ──────────────────────────────────────────────────────

function deriveEngagementTier(score: number): EngagementTier {
  if (score >= ENGAGEMENT_THRESHOLDS.HIGH) return "High";
  if (score >= ENGAGEMENT_THRESHOLDS.MEDIUM) return "Medium";
  return "Low";
}

function deriveStudent(raw: z.infer<typeof RawStudentSchema>): Student {
  const engagementTier = deriveEngagementTier(raw.engagementScore);
  return {
    ...raw,
    engagementTier,
    flaggedForAttention:
      raw.status === "Needs Attention" || engagementTier === "Low",
  };
}

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

export const students: Student[] = validatedStudents.map(deriveStudent);

export const kpiSnapshot: KPISnapshot = {
  current: computeCurrentKPIPeriod(students),
  prior: validatedKpiPrior,
};

export const engagementTimeSeries: EngagementDataPoint[] =
  validatedEngagementTimeSeries;

export const milestoneCategoryData: MilestoneCategoryCompletion[] =
  validatedMilestoneCategoryData;

// ── Query functions ─────────────────────────────────────────────────────────

export function getStudentById(id: string): Student | undefined {
  return students.find((s) => s.id === id);
}

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
