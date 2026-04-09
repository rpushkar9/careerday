import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { EngagementDataPoint } from "@/types";

interface EngagementChartProps {
  data: EngagementDataPoint[];
  rangeLabel: string;
}

export function EngagementChart({ data, rangeLabel }: EngagementChartProps) {
  return (
    <div data-testid="engagement-chart">
      <p className="mb-2 text-sm text-muted-foreground">{rangeLabel}</p>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
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
          />
          <Line
            type="monotone"
            dataKey="engagementScore"
            stroke="hsl(var(--primary))"
            strokeWidth={2}
            dot={false}
            name="Engagement"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
