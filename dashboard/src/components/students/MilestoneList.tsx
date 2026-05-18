import { useState } from "react";
import type { Milestone, MilestoneStatus } from "@/types";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { EmptyState } from "@/components/shared/EmptyState";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);

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
            className="flex-1 border-border"
          />
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger aria-label="Milestone category" className="w-48 border-border">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {MILESTONE_CATEGORIES.map((c) => (
                <SelectItem key={c.value} value={c.value}>
                  {c.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
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
                  <p className="text-xs text-muted-foreground">
                    {MILESTONE_CATEGORIES.find((c) => c.value === m.category)?.label ?? m.category}
                  </p>
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
                  pendingDeleteId === m.id ? (
                    <div className="ml-1 flex items-center gap-1 shrink-0 text-xs">
                      <button
                        onClick={() => { onDeleteMilestone(m.id); setPendingDeleteId(null); }}
                        aria-label={`Confirm delete milestone ${m.label}`}
                        className="text-destructive hover:underline font-medium"
                      >
                        Delete
                      </button>
                      <span className="text-muted-foreground">|</span>
                      <button
                        onClick={() => setPendingDeleteId(null)}
                        aria-label="Cancel delete"
                        className="text-muted-foreground hover:underline"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setPendingDeleteId(m.id)}
                      aria-label={`Delete milestone ${m.label}`}
                      className="ml-1 text-muted-foreground hover:text-destructive transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
