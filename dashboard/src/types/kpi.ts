export interface KPIPeriodSnapshot {
  totalStudents: number;
  averageEngagementScore: number;
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
  target: number;
}

export interface MilestoneCategoryCompletion {
  category: string;
  completedCount: number;
  inProgressCount: number;
  totalCount: number;
  completionRate: number;
}
