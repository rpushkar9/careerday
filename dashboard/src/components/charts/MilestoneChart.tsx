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

interface MilestoneChartProps {
  data: MilestoneCategoryCompletion[];
}

function MilestoneTooltip({ active, payload }: TooltipProps<number, string>) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload as MilestoneCategoryCompletion;
  return (
    <div
      className="rounded-md border bg-background px-3 py-2 text-sm shadow"
      style={{
        backgroundColor: "#ffffff",
        border: "1px solid #6d6bd3",
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
  return (
    <div
      data-testid="milestone-chart"
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
        <BarChart data={data} layout="vertical">
          <CartesianGrid strokeDasharray="3 3" stroke="#e3daff" />
          <XAxis type="number" stroke="#6b7280" tick={{ fontSize: 12 }} />
          <YAxis
            type="category"
            dataKey="category"
            stroke="#6b7280"
            tick={{ fontSize: 12 }}
            width={120}
          />
          <Tooltip content={<MilestoneTooltip />} />
          <Legend wrapperStyle={{ paddingTop: "16px" }} />
          <Bar
            dataKey="completedCount"
            fill="#6d6bd3"
            radius={[0, 8, 8, 0]}
            name="Completed"
          />
          <Bar
            dataKey="inProgressCount"
            fill="#e3daff"
            radius={[0, 8, 8, 0]}
            name="In Progress"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
