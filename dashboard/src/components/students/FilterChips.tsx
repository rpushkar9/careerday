import { AlertCircle, TrendingDown, Users, Target } from "lucide-react";
import type { FilterChip } from "@/lib/constants";
import { FILTER_CHIPS } from "@/lib/constants";
import type { Student } from "@/types";

interface FilterChipsProps {
  active: string[];
  onChange: (chips: string[]) => void;
  students: Student[];
}

const CHIP_ICONS: Record<FilterChip, React.ElementType> = {
  All: Users,
  "Needs Attention": AlertCircle,
  "Milestone Behind": Target,
  "Low Engagement": TrendingDown,
};

function computeCount(chip: FilterChip, students: Student[]): number {
  switch (chip) {
    case "All":
      return students.length;
    case "Needs Attention":
      return students.filter((s) => s.status === "Needs Attention").length;
    case "Milestone Behind":
      return students.filter((s) =>
        s.milestones.some((m) => m.status === "Pending"),
      ).length;
    case "Low Engagement":
      return students.filter((s) => s.engagementTier === "Low").length;
  }
}

export function FilterChips({ active, onChange, students }: FilterChipsProps) {
  function handleChipClick(chip: FilterChip) {
    if (active.includes(chip)) {
      // Deselect
      onChange(active.filter((c) => c !== chip));
    } else {
      // Add to active
      onChange([...active, chip]);
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      {FILTER_CHIPS.map((chip) => {
        const isActive = active.includes(chip);
        const Icon = CHIP_ICONS[chip];
        const count = computeCount(chip, students);

        return (
          <button
            key={chip}
            data-active={isActive}
            onClick={() => handleChipClick(chip)}
            className={[
              "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-sm font-medium transition-colors",
              isActive
                ? "bg-primary text-primary-foreground border-primary shadow-sm"
                : "bg-white text-foreground border-border hover:bg-secondary/30",
            ].join(" ")}
          >
            <Icon className="w-3.5 h-3.5" />
            {chip}
            <span
              className={[
                "rounded-full px-1.5 py-0.5 text-xs font-semibold",
                isActive
                  ? "bg-white/20 text-white"
                  : "bg-secondary text-primary",
              ].join(" ")}
            >
              {count}
            </span>
          </button>
        );
      })}
      {active.length > 0 && (
        <button
          onClick={() => onChange([])}
          className="text-xs text-muted-foreground underline hover:text-foreground transition-colors"
        >
          Clear all
        </button>
      )}
    </div>
  );
}
