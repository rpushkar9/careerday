import type { MilestoneStatus, StudentStatus } from "@/types";
import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: MilestoneStatus | StudentStatus;
}

const STATUS_STYLES: Record<MilestoneStatus | StudentStatus, string> = {
  Completed: "bg-green-100 text-green-800",
  "In Progress": "bg-blue-100 text-blue-800",
  Pending: "bg-gray-100 text-gray-600",
  "On Track": "bg-green-100 text-green-800",
  "At Risk": "bg-yellow-100 text-yellow-800",
  "Needs Attention": "bg-red-100 text-red-800",
};

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        STATUS_STYLES[status],
      )}
    >
      {status}
    </span>
  );
}
