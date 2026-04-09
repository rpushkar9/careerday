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
  EngagementDataPoint,
  MilestoneCategoryCompletion,
} from "@/types";
import type { FilterChip } from "@/lib/constants";
import { ENGAGEMENT_THRESHOLDS } from "@/lib/constants";
import { RawStudentSchema } from "@/schemas/student.schema";
import {
  KPISnapshotSchema,
  EngagementDataPointSchema,
  MilestoneCategoryCompletionSchema,
} from "@/schemas/kpi.schema";

import { rawStudents } from "./mock/students";
import {
  rawKpiSnapshot,
  rawEngagementTimeSeries,
  rawMilestoneCategoryData,
} from "./mock/kpi";

// ── Validation ──────────────────────────────────────────────────────────────

const validatedStudents = z.array(RawStudentSchema).parse(rawStudents);
const validatedKpiSnapshot = KPISnapshotSchema.parse(rawKpiSnapshot);
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

// ── Public exports ──────────────────────────────────────────────────────────

export const students: Student[] = validatedStudents.map(deriveStudent);

export const kpiSnapshot: KPISnapshot = validatedKpiSnapshot;

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
    case "High Priority":
      return list.filter((s) => s.flaggedForAttention);
    case "Milestone Behind":
      return list.filter((s) =>
        s.milestones.some(
          (m) => m.status === "In Progress" || m.status === "Pending",
        ),
      );
    case "Recently Active": {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      return list.filter((s) => new Date(s.lastActiveDate) >= sevenDaysAgo);
    }
  }
}

export function sliceEngagementData(
  data: EngagementDataPoint[],
  days: number,
): EngagementDataPoint[] {
  return data.slice(-days);
}
