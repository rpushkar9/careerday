import type { EngagementDataPoint } from "@/types";

/** 90 daily cohort-average engagement data points, ending 2026-04-09. */
function generateEngagementTimeSeries(): EngagementDataPoint[] {
  const points: EngagementDataPoint[] = [];
  const end = new Date("2026-04-09");

  // Seed values: start around 50, trend up to ~62 with noise
  let score = 50;
  for (let i = 89; i >= 0; i--) {
    const date = new Date(end);
    date.setDate(date.getDate() - i);

    // Gradual upward trend with daily noise
    const trend = (89 - i) * 0.12; // +0 to +10.68 over 90 days
    const noise = Math.sin(i * 0.7) * 5 + Math.cos(i * 1.3) * 3;
    score = Math.max(30, Math.min(85, 50 + trend + noise));

    // Target ramps from 60 to 75 over 90 days
    const target = Math.round(60 + (89 - i) * (15 / 89));
    points.push({
      date: date.toISOString().split("T")[0],
      engagementScore: Math.round(score * 10) / 10,
      target,
    });
  }

  return points;
}

export const rawEngagementTimeSeries: EngagementDataPoint[] =
  generateEngagementTimeSeries();
