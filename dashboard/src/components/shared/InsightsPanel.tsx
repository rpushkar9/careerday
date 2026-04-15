import { TrendingDown, Target, AlertCircle } from "lucide-react";
import type { Student } from "@/types";

interface InsightsPanelProps {
  students: Student[];
}

export function InsightsPanel({ students }: InsightsPanelProps) {
  const decliningEngagementCount = students.filter(
    (s) => s.engagementTrend === "down",
  ).length;

  const unstartedMilestoneCount = students.filter((s) =>
    s.milestones.some((m) => m.status === "Pending"),
  ).length;

  const needsAttentionCount = students.filter(
    (s) => s.status === "Needs Attention",
  ).length;

  return (
    <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
      <h2 className="text-base font-semibold mb-4">Insights This Quarter</h2>
      <ul className="space-y-3">
        <li className="flex items-center gap-3 text-sm">
          <TrendingDown className="w-4 h-4 text-amber-600 flex-shrink-0" />
          <span>
            {decliningEngagementCount}{" "}
            {decliningEngagementCount === 1 ? "student" : "students"} with
            declining engagement
          </span>
        </li>
        <li className="flex items-center gap-3 text-sm">
          <Target className="w-4 h-4 text-blue-500 flex-shrink-0" />
          <span>
            {unstartedMilestoneCount}{" "}
            {unstartedMilestoneCount === 1 ? "student" : "students"} with
            unstarted milestones
          </span>
        </li>
        <li className="flex items-center gap-3 text-sm">
          <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
          <span>
            {needsAttentionCount}{" "}
            {needsAttentionCount === 1 ? "student" : "students"} marked for
            counselor follow-up
          </span>
        </li>
      </ul>
    </div>
  );
}
