import { Users, TrendingUp, Target, AlertCircle } from "lucide-react";
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
        delta={pctDelta(current.totalStudents, prior.totalStudents)}
        icon={Users}
      />
      <KPICard
        label="Average Engagement"
        value={Math.round(current.averageEngagementScore)}
        unit="%"
        trend={deriveTrend(current.averageEngagementScore, prior.averageEngagementScore)}
        delta={pctDelta(current.averageEngagementScore, prior.averageEngagementScore)}
        icon={TrendingUp}
        tooltip="Metric calculated from student platform activity. For advising support only. Not used for ranking."
      />
      <KPICard
        label="Milestone Completion"
        value={Math.round(current.milestoneCompletionRate)}
        unit="%"
        trend={deriveTrend(
          current.milestoneCompletionRate,
          prior.milestoneCompletionRate,
        )}
        delta={pctDelta(current.milestoneCompletionRate, prior.milestoneCompletionRate)}
        icon={Target}
      />
      <KPICard
        label="Students Needing Attention"
        value={current.studentsNeedingAttentionCount}
        trend={deriveTrend(
          // Fewer students needing attention is better — invert so "down" = "up" (good)
          -current.studentsNeedingAttentionCount,
          -prior.studentsNeedingAttentionCount,
        )}
        delta={pctDelta(current.studentsNeedingAttentionCount, prior.studentsNeedingAttentionCount)}
        icon={AlertCircle}
      />
    </div>
  );
}

/** Format a percentage delta between two numbers, e.g. "+8%" or "-3%". */
function pctDelta(current: number, prior: number): string | undefined {
  if (prior === 0) return undefined;
  const pct = Math.round(((current - prior) / prior) * 100);
  if (pct === 0) return undefined;
  return pct > 0 ? `+${pct}%` : `${pct}%`;
}
