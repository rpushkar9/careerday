import { TrendingUp, TrendingDown, AlertCircle } from "lucide-react";
import type { Student } from "@/types";

interface InsightsPanelProps {
  students: Student[];
}

export function InsightsPanel({ students }: InsightsPanelProps) {
  const upTrendCount = students.filter((s) => s.engagementTrend === "up").length;
  const lowEngagementCount = students.filter((s) => s.engagementTier === "Low").length;
  const flaggedCount = students.filter((s) => s.flaggedForAttention).length;

  return (
    <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
      <h2 className="text-base font-semibold mb-4">Insights This Quarter</h2>
      <ul className="space-y-3">
        <li className="flex items-center gap-3 text-sm">
          <TrendingUp className="w-4 h-4 text-green-600 flex-shrink-0" />
          <span>{upTrendCount} {upTrendCount === 1 ? "student" : "students"} trending upward in engagement</span>
        </li>
        <li className="flex items-center gap-3 text-sm">
          <TrendingDown className="w-4 h-4 text-amber-600 flex-shrink-0" />
          <span>{lowEngagementCount} {lowEngagementCount === 1 ? "student" : "students"} with low engagement</span>
        </li>
        <li className="flex items-center gap-3 text-sm">
          <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0" />
          <span>{flaggedCount} {flaggedCount === 1 ? "student" : "students"} flagged for attention</span>
        </li>
      </ul>
    </div>
  );
}
