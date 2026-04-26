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

export const CHART_COLORS = {
  grid: "#e3daff",
  primary: "#6d6bd3",
  secondary: "#9896e0",
  tertiary: "#b8b2f0",
  axis: "#6b7280",
} as const;
