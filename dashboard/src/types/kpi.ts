import type { EngagementTier } from "./student";

export interface KPIPeriodSnapshot {
  totalStudents: number;
  averageEngagementTier: EngagementTier;
  milestoneCompletionRate: number;
  studentsNeedingAttentionCount: number;
}

export interface KPISnapshot {
  current: KPIPeriodSnapshot;
  prior: KPIPeriodSnapshot;
}

export interface EngagementDataPoint {
  date: string;
  engagementScore: number;
}

export interface MilestoneCategoryCompletion {
  category: string;
  completedCount: number;
  totalCount: number;
  completionRate: number;
}
