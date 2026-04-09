import type { Milestone } from "@/types";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { EmptyState } from "@/components/shared/EmptyState";

interface MilestoneListProps {
  milestones: Milestone[];
}

export function MilestoneList({ milestones }: MilestoneListProps) {
  if (milestones.length === 0) {
    return <EmptyState message="No milestones" />;
  }

  return (
    <ul className="space-y-2">
      {milestones.map((m) => (
        <li
          key={m.id}
          className="flex items-center justify-between rounded-md border px-3 py-2 text-sm"
        >
          <span>{m.label}</span>
          <StatusBadge status={m.status} />
        </li>
      ))}
    </ul>
  );
}
