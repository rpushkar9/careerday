import type { KPISnapshot } from "@/types";
import { deriveTrend } from "@/data";
import { KPICard } from "./KPICard";

interface KPIGridProps {
  snapshot: KPISnapshot;
}

export function KPIGrid({ snapshot }: KPIGridProps) {
  const { current, prior } = snapshot;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <KPICard
        label="Total Students"
        value={current.totalStudents}
        trend={deriveTrend(current.totalStudents, prior.totalStudents)}
      />
      <KPICard
        label="Average Engagement"
        value={current.averageEngagementTier}
        trend={deriveTrend(
          tierToNumber(current.averageEngagementTier),
          tierToNumber(prior.averageEngagementTier),
        )}
      />
      <KPICard
        label="Milestone Completion"
        value={Math.round(current.milestoneCompletionRate)}
        unit="%"
        trend={deriveTrend(
          current.milestoneCompletionRate,
          prior.milestoneCompletionRate,
        )}
      />
      <KPICard
        label="Students Needing Attention"
        value={current.studentsNeedingAttentionCount}
        trend={deriveTrend(
          // Fewer students needing attention is better — invert so "down" = "up" (good)
          -current.studentsNeedingAttentionCount,
          -prior.studentsNeedingAttentionCount,
        )}
      />
    </div>
  );
}

/** Map engagement tier to a number for trend comparison. */
function tierToNumber(tier: string): number {
  switch (tier) {
    case "High":
      return 3;
    case "Medium":
      return 2;
    case "Low":
      return 1;
    default:
      return 0;
  }
}
