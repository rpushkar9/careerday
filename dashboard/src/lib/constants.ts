export const ENGAGEMENT_THRESHOLDS = {
  HIGH: 70,
  MEDIUM: 40,
} as const;

export const TIME_RANGES = [7, 30, 90] as const;

export type FilterChip =
  | "All"
  | "Needs Attention"
  | "Milestone Behind"
  | "Low Engagement";

export const FILTER_CHIPS: FilterChip[] = [
  "All",
  "Needs Attention",
  "Milestone Behind",
  "Low Engagement",
];

export const STUDENT_STATUSES = [
  "On Track",
  "At Risk",
  "Needs Attention",
] as const;
