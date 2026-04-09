import { z } from "zod";
import { EngagementTierSchema } from "./student.schema";

const KPIPeriodSnapshotSchema = z.object({
  totalStudents: z.number().int().min(0),
  averageEngagementTier: EngagementTierSchema,
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
});

export const MilestoneCategoryCompletionSchema = z.object({
  category: z.string().min(1),
  completedCount: z.number().int().min(0),
  totalCount: z.number().int().min(1),
  completionRate: z.number().min(0).max(100),
});
