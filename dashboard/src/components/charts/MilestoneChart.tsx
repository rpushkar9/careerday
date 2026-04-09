import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { MilestoneCategoryCompletion } from "@/types";

interface MilestoneChartProps {
  data: MilestoneCategoryCompletion[];
}

export function MilestoneChart({ data }: MilestoneChartProps) {
  return (
    <div data-testid="milestone-chart">
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="category" tick={{ fontSize: 12 }} />
          <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} unit="%" />
          <Tooltip
            formatter={(value: number) => [
              `${Math.round(value)}%`,
              "Completion",
            ]}
          />
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
