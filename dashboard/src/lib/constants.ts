export const ENGAGEMENT_THRESHOLDS = {
  HIGH: 70,
  MEDIUM: 40,
} as const;

export const TIME_RANGES = [7, 30, 90] as const;

export type FilterChip =
  | "All"
  | "High Priority"
  | "Milestone Behind"
  | "Recently Active";

export const FILTER_CHIPS: FilterChip[] = [
  "All",
  "High Priority",
  "Milestone Behind",
  "Recently Active",
];
