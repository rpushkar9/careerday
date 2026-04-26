import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import type { EngagementDataPoint } from "@/types";
import { CHART_COLORS } from "@/lib/constants";

interface EngagementChartProps {
  data: EngagementDataPoint[];
  rangeLabel: string;
}

export function EngagementChart({ data, rangeLabel }: EngagementChartProps) {
  return (
    <div
      data-testid="engagement-chart"
      role="img"
      aria-label="Student engagement over time"
      className="bg-card border border-border rounded-2xl p-8 shadow-sm"
    >
      <div className="mb-6">
        <h3 className="text-lg font-medium text-foreground">
          Student Engagement Over Time
        </h3>
        <p className="text-sm text-muted-foreground">
          Monthly engagement rates and targets
        </p>
        <p className="text-xs text-muted-foreground/60 mt-1">{rangeLabel}</p>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke={CHART_COLORS.grid} />
          <XAxis
            dataKey="date"
            tickFormatter={(d: string) =>
              new Date(d).toLocaleDateString(undefined, {
                month: "short",
                day: "numeric",
              })
            }
            tick={{ fontSize: 12 }}
          />
          <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
          <Tooltip
            labelFormatter={(d: string) => new Date(d).toLocaleDateString()}
            contentStyle={{
              backgroundColor: "#ffffff",
              border: `1px solid ${CHART_COLORS.primary}`,
              borderRadius: "12px",
              padding: "12px",
            }}
          />
          <Legend wrapperStyle={{ paddingTop: "16px" }} />
          <Line
            type="monotone"
            dataKey="engagementScore"
            stroke={CHART_COLORS.primary}
            strokeWidth={2}
            dot={false}
            name="Engagement"
          />
          <Line
            type="monotone"
            dataKey="target"
            stroke={CHART_COLORS.secondary}
            strokeWidth={2}
            strokeDasharray="5 5"
            dot={false}
            name="Target"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
