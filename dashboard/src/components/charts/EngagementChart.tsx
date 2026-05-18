import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import type { Student } from "@/types";
import { CHART_COLORS } from "@/lib/constants";
import { computeBins } from "./engagementBins";

interface EngagementChartProps {
  students: Student[];
}

export function EngagementChart({ students }: EngagementChartProps) {
  const data = computeBins(students);

  return (
    <div
      data-testid="engagement-chart"
      role="img"
      aria-label="Engagement score distribution"
      className="bg-card border border-border rounded-2xl p-8 shadow-sm"
    >
      <div className="mb-6">
        <h3 className="text-lg font-medium text-foreground">
          Engagement Score Distribution
        </h3>
        <p className="text-sm text-muted-foreground">
          Number of students in each score band
        </p>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} barCategoryGap="30%">
          <CartesianGrid strokeDasharray="3 3" stroke={CHART_COLORS.grid} vertical={false} />
          <XAxis dataKey="label" tick={{ fontSize: 12 }} />
          <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
          <Tooltip
            cursor={{ fill: "rgba(109,107,211,0.08)" }}
            formatter={(value: number) => [value, "Students"]}
            contentStyle={{
              backgroundColor: "#ffffff",
              border: `1px solid ${CHART_COLORS.primary}`,
              borderRadius: "12px",
              padding: "12px",
            }}
          />
          <Bar dataKey="count" radius={[6, 6, 0, 0]}>
            {data.map((entry, index) => (
              <Cell key={index} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
