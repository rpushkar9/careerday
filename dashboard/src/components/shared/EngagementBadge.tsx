import type { EngagementTier } from "@/types";
import { cn } from "@/lib/utils";

interface EngagementBadgeProps {
  tier: EngagementTier;
}

const TIER_STYLES: Record<EngagementTier, string> = {
  High: "bg-green-100 text-green-800",
  Medium: "bg-yellow-100 text-yellow-800",
  Low: "bg-red-100 text-red-800",
};

export function EngagementBadge({ tier }: EngagementBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        TIER_STYLES[tier],
      )}
    >
      {tier}
    </span>
  );
}
