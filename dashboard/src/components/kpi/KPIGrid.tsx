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
        trend={
          prior
            ? deriveTrend(current.totalStudents, prior.totalStudents)
            : "neutral"
        }
        delta={
          prior
            ? pctDelta(current.totalStudents, prior.totalStudents)
            : undefined
        }
        icon={Users}
      />
      <KPICard
        label="Average Engagement"
        value={Math.round(current.averageEngagementScore)}
        unit="%"
        trend={
          prior
            ? deriveTrend(
                current.averageEngagementScore,
                prior.averageEngagementScore,
              )
            : "neutral"
        }
        delta={
          prior
            ? pctDelta(
                current.averageEngagementScore,
                prior.averageEngagementScore,
              )
            : undefined
        }
        icon={TrendingUp}
        tooltip="Reflects logged platform activity. For advising support only — not used for ranking."
      />
      <KPICard
        label="Milestone Completion"
        value={Math.round(current.milestoneCompletionRate)}
        unit="%"
        trend={
          prior
            ? deriveTrend(
                current.milestoneCompletionRate,
                prior.milestoneCompletionRate,
              )
            : "neutral"
        }
        delta={
          prior
            ? pctDelta(
                current.milestoneCompletionRate,
                prior.milestoneCompletionRate,
              )
            : undefined
        }
        icon={Target}
      />
      <KPICard
        label="Students Needing Attention"
        value={current.studentsNeedingAttentionCount}
        trend={
          prior
            ? deriveTrend(
                // Fewer students needing attention is better — invert so "up" = good (count fell)
                -current.studentsNeedingAttentionCount,
                -prior.studentsNeedingAttentionCount,
              )
            : "neutral"
        }
        delta={
          prior
            ? pctDelta(
                -current.studentsNeedingAttentionCount,
                -prior.studentsNeedingAttentionCount,
              )
            : undefined
        }
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
