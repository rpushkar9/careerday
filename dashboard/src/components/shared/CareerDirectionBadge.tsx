import type { Student } from "@/types";

const CAREER_DIRECTION_STYLES: Record<
  Student["careerDirection"],
  { className: string; label: string }
> = {
  clear: {
    className:
      "bg-green-50 text-green-700 border border-green-200 rounded-lg px-2 py-0.5 text-xs",
    label: "Clear",
  },
  exploring: {
    className:
      "bg-blue-50 text-blue-700 border border-blue-200 rounded-lg px-2 py-0.5 text-xs",
    label: "Exploring",
  },
  uncertain: {
    className:
      "bg-amber-50 text-amber-700 border border-amber-200 rounded-lg px-2 py-0.5 text-xs",
    label: "Uncertain",
  },
  undeclared: {
    className:
      "bg-gray-100 text-gray-600 border border-gray-300 rounded-lg px-2 py-0.5 text-xs",
    label: "Undeclared",
  },
};

interface CareerDirectionBadgeProps {
  direction: Student["careerDirection"];
}

export function CareerDirectionBadge({ direction }: CareerDirectionBadgeProps) {
  const { className, label } = CAREER_DIRECTION_STYLES[direction];
  return <span className={className}>{label}</span>;
}
