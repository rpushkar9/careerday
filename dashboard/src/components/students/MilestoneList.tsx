import type { Milestone, MilestoneStatus } from "@/types";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { EmptyState } from "@/components/shared/EmptyState";
import { CheckCircle, Clock, Circle } from "lucide-react";

interface MilestoneListProps {
  milestones: Milestone[];
}

function getIconStyles(status: MilestoneStatus): {
  bg: string;
  color: string;
  Icon: React.ComponentType<{ className?: string }>;
} {
  switch (status) {
    case "Completed":
      return { bg: "bg-green-100", color: "text-green-600", Icon: CheckCircle };
    case "In Progress":
      return { bg: "bg-amber-100", color: "text-amber-600", Icon: Clock };
    case "Pending":
      return { bg: "bg-gray-100", color: "text-gray-400", Icon: Circle };
  }
}

export function MilestoneList({ milestones }: MilestoneListProps) {
  if (milestones.length === 0) {
    return <EmptyState message="No milestones" />;
  }

  return (
    <ul className="space-y-2">
      {milestones.map((m) => {
        const { bg, color, Icon } = getIconStyles(m.status);
        return (
          <li
            key={m.id}
            className="flex items-start gap-3 rounded-md border px-3 py-2 text-sm"
          >
            <div className={`mt-0.5 rounded-full p-1 ${bg}`}>
              <Icon className={`w-4 h-4 ${color}`} />
            </div>
            <div className="flex-1">
              <p className="text-sm text-foreground">{m.label}</p>
              {m.completedDate && (
                <p className="text-xs text-muted-foreground mt-0.5">
                  {new Date(m.completedDate).toLocaleDateString(undefined, {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
              )}
            </div>
            <StatusBadge status={m.status} />
          </li>
        );
      })}
    </ul>
  );
}
