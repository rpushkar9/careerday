import type {
  KPISnapshot,
  EngagementDataPoint,
  MilestoneCategoryCompletion,
} from "@/types";

export const rawKpiSnapshot: KPISnapshot = {
  current: {
    totalStudents: 30,
    averageEngagementTier: "Medium",
    milestoneCompletionRate: 58.4,
    studentsNeedingAttentionCount: 7,
  },
  prior: {
    totalStudents: 30,
    averageEngagementTier: "Medium",
    milestoneCompletionRate: 52.1,
    studentsNeedingAttentionCount: 9,
  },
};

/** 90 daily cohort-average engagement data points, ending 2026-04-09. */
function generateEngagementTimeSeries(): EngagementDataPoint[] {
  const points: EngagementDataPoint[] = [];
  const end = new Date("2026-04-09");

  // Seed values: start around 50, trend up to ~62 with noise
  let score = 50;
  for (let i = 89; i >= 0; i--) {
    const date = new Date(end);
    date.setDate(date.getDate() - i);

    // Gradual upward trend with daily noise
    const trend = (89 - i) * 0.12; // +0 to +10.68 over 90 days
    const noise = Math.sin(i * 0.7) * 5 + Math.cos(i * 1.3) * 3;
    score = Math.max(30, Math.min(85, 50 + trend + noise));

    points.push({
      date: date.toISOString().split("T")[0],
      engagementScore: Math.round(score * 10) / 10,
    });
  }

  return points;
}

export const rawEngagementTimeSeries: EngagementDataPoint[] =
  generateEngagementTimeSeries();

export const rawMilestoneCategoryData: MilestoneCategoryCompletion[] = [
  {
    category: "Assessment",
    completedCount: 25,
    totalCount: 30,
    completionRate: 83.3,
  },
  {
    category: "Documents",
    completedCount: 16,
    totalCount: 30,
    completionRate: 53.3,
  },
  {
    category: "Experience",
    completedCount: 8,
    totalCount: 20,
    completionRate: 40.0,
  },
  {
    category: "Applications",
    completedCount: 10,
    totalCount: 22,
    completionRate: 45.5,
  },
  {
    category: "Financial",
    completedCount: 5,
    totalCount: 12,
    completionRate: 41.7,
  },
];
