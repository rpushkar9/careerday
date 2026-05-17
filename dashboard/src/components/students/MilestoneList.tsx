import { useState } from "react";
import type { Milestone, MilestoneStatus } from "@/types";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { EmptyState } from "@/components/shared/EmptyState";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CheckCircle, Clock, Circle, Trash2 } from "lucide-react";
import { MILESTONE_CATEGORIES } from "@/lib/constants";

interface MilestoneListProps {
  milestones: Milestone[];
  onAddMilestone?: (label: string, category: string) => void;
  onDeleteMilestone?: (id: string) => void;
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

export function MilestoneList({ milestones, onAddMilestone, onDeleteMilestone }: MilestoneListProps) {
  const [label, setLabel] = useState("");
  const [category, setCategory] = useState<string>(MILESTONE_CATEGORIES[0].value);

  function handleAdd() {
    const trimmed = label.trim();
    if (!trimmed || !onAddMilestone) return;
    onAddMilestone(trimmed, category);
    setLabel("");
    setCategory(MILESTONE_CATEGORIES[0].value);
  }

  return (
    <div className="space-y-3">
      {onAddMilestone && (
        <div className="flex gap-2">
          <Input
            placeholder="Milestone label…"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            aria-label="Milestone label"
            className="flex-1"
          />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            aria-label="Milestone category"
            className="rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          >
            {MILESTONE_CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
          <Button size="sm" disabled={label.trim().length === 0} onClick={handleAdd}>
            Add
          </Button>
        </div>
      )}

      {milestones.length === 0 ? (
        <EmptyState message="No milestones" />
      ) : (
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
                  <p className="text-xs text-muted-foreground">{m.category}</p>
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
                {onDeleteMilestone && (
                  <button
                    onClick={() => onDeleteMilestone(m.id)}
                    aria-label={`Delete milestone ${m.label}`}
                    className="ml-1 text-muted-foreground hover:text-destructive transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
