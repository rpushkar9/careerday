import type { FilterChip } from "@/lib/constants";
import { FILTER_CHIPS } from "@/lib/constants";
import { Button } from "@/components/ui/button";

interface FilterChipsProps {
  active: FilterChip;
  onChange: (chip: FilterChip) => void;
}

export function FilterChips({ active, onChange }: FilterChipsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {FILTER_CHIPS.map((chip) => (
        <Button
          key={chip}
          variant={chip === active ? "default" : "outline"}
          size="sm"
          data-active={chip === active}
          onClick={() => onChange(chip)}
        >
          {chip}
        </Button>
      ))}
    </div>
  );
}
