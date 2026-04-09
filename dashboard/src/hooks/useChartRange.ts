import { useState } from "react";

export type ChartRange = 7 | 30 | 90;

const LABELS: Record<ChartRange, string> = {
  7: "Last 7 days",
  30: "Last 30 days",
  90: "Last 90 days",
};

export function useChartRange(defaultRange: ChartRange = 30) {
  const [range, setRange] = useState<ChartRange>(defaultRange);

  return {
    range,
    setRange,
    label: LABELS[range],
  };
}
