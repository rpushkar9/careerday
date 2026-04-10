import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  type TooltipProps,
} from "recharts";
import type { MilestoneCategoryCompletion } from "@/types";

interface MilestoneChartProps {
  data: MilestoneCategoryCompletion[];
}

function MilestoneTooltip({ active, payload }: TooltipProps<number, string>) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload as MilestoneCategoryCompletion;
  return (
    <div className="rounded-md border bg-background px-3 py-2 text-sm shadow">
      <p className="font-medium">{d.category}</p>
      <p>Completed: {d.completedCount}</p>
      <p>Total students: {d.totalCount}</p>
      <p>Rate: {Math.round(d.completionRate)}%</p>
    </div>
  );
}

export function MilestoneChart({ data }: MilestoneChartProps) {
  return (
    <div data-testid="milestone-chart">
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="category" tick={{ fontSize: 12 }} />
          <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} unit="%" />
          <Tooltip content={<MilestoneTooltip />} />
          <Bar
            dataKey="completionRate"
            fill="hsl(var(--primary))"
            radius={[4, 4, 0, 0]}
            name="Completion Rate"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
