import { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  type TooltipProps,
} from "recharts";
import type { MilestoneCategoryCompletion } from "@/types";
import { CHART_COLORS } from "@/lib/constants";

interface MilestoneChartProps {
  data: MilestoneCategoryCompletion[];
}

const CATEGORY_LABELS: Record<string, string> = {
  Assessment: "Career Assessment",
  Profile: "Resume & Profile",
  Networking: "Networking",
  Experience: "Internship & Industry Experience",
  Applications: "Job Applications",
};

function labelFor(category: string): string {
  return CATEGORY_LABELS[category] ?? category;
}

function MilestoneTooltip({ active, payload }: TooltipProps<number, string>) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload as MilestoneCategoryCompletion;
  return (
    <div
      className="rounded-md border bg-background px-3 py-2 text-sm shadow"
      style={{
        backgroundColor: "#ffffff",
        border: `1px solid ${CHART_COLORS.primary}`,
        borderRadius: "12px",
        padding: "12px",
      }}
    >
      <p className="font-medium">{d.category}</p>
      <p>Completed: {d.completedCount}</p>
      <p>In Progress: {d.inProgressCount}</p>
      <p>Total students: {d.totalCount}</p>
    </div>
  );
}

export function MilestoneChart({ data }: MilestoneChartProps) {
  const chartData = useMemo(
    () => data.map((d) => ({ ...d, category: labelFor(d.category) })),
    [data],
  );

  return (
    <div
      data-testid="milestone-chart"
      role="img"
      aria-label="Milestone completion status by category"
      className="bg-card border border-border rounded-2xl p-8 shadow-sm"
    >
      <div className="mb-6">
        <h3 className="text-lg font-medium text-foreground">
          Milestone Completion Status
        </h3>
        <p className="text-sm text-muted-foreground">
          Progress across key career milestones
        </p>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData} layout="vertical">
          <CartesianGrid
            strokeDasharray="3 3"
            stroke={CHART_COLORS.grid}
          />
          <XAxis
            type="number"
            stroke={CHART_COLORS.axis}
            tick={{ fontSize: 12 }}
          />
          <YAxis
            type="category"
            dataKey="category"
            stroke={CHART_COLORS.axis}
            tick={{ fontSize: 12 }}
            width={170}
          />
          <Tooltip content={<MilestoneTooltip />} />
          <Legend wrapperStyle={{ paddingTop: "16px" }} />
          <Bar
            dataKey="completedCount"
            fill={CHART_COLORS.primary}
            radius={[0, 8, 8, 0]}
            name="Completed"
          />
          <Bar
            dataKey="inProgressCount"
            fill={CHART_COLORS.tertiary}
            radius={[0, 8, 8, 0]}
            name="In Progress"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
