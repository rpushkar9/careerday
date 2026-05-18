import type { Student } from "@/types";

export const BINS = [
  { label: "0–20", min: 0, max: 20 },
  { label: "20–40", min: 20, max: 40 },
  { label: "40–60", min: 40, max: 60 },
  { label: "60–80", min: 60, max: 80 },
  { label: "80–100", min: 80, max: 101 },
] as const;

export const BIN_COLORS = [
  "#b8b2f0",
  "#9896e0",
  "#7c7ace",
  "#6d6bd3",
  "#5856b8",
] as const;

export function computeBins(students: Student[]) {
  return BINS.map((bin, i) => ({
    label: bin.label,
    count: students.filter(
      (s) => s.engagementScore >= bin.min && s.engagementScore < bin.max,
    ).length,
    color: BIN_COLORS[i],
  }));
}
