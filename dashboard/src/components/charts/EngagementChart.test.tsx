import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { EngagementChart } from "./EngagementChart";
import { computeBins } from "./engagementBins";
import type { Student } from "@/types";

// Recharts needs ResizeObserver in jsdom
class ResizeObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}
globalThis.ResizeObserver =
  ResizeObserverMock as unknown as typeof ResizeObserver;

function makeStudent(engagementScore: number): Student {
  return {
    id: `s-${engagementScore}`,
    name: null,
    email: `s${engagementScore}@example.com`,
    major: "CS",
    graduationYear: 2027,
    careerDirection: "exploring",
    confidenceScore: null,
    engagementScore,
    engagementTrend: null,
    engagementTier: "Medium",
    lastActiveDate: "2026-05-01",
    lastContactedDate: "2026-05-01",
    status: "On Track",
    milestones: [],
    advisorNotes: [],
    recentActivity: [],
    flaggedForAttention: false,
  };
}

const sampleStudents: Student[] = [
  makeStudent(15),
  makeStudent(35),
  makeStudent(55),
  makeStudent(72),
  makeStudent(88),
];

// ── computeBins unit tests ─────────────────────────────────────────────────────

describe("computeBins", () => {
  it("places score 0 in the 0–20 bin", () => {
    const bins = computeBins([makeStudent(0)]);
    expect(bins[0].count).toBe(1);
    expect(bins[1].count).toBe(0);
  });

  it("places score 19 in the 0–20 bin", () => {
    const bins = computeBins([makeStudent(19)]);
    expect(bins[0].count).toBe(1);
  });

  it("places score 20 in the 20–40 bin (not 0–20)", () => {
    const bins = computeBins([makeStudent(20)]);
    expect(bins[0].count).toBe(0);
    expect(bins[1].count).toBe(1);
  });

  it("places score 39 in the 20–40 bin", () => {
    const bins = computeBins([makeStudent(39)]);
    expect(bins[1].count).toBe(1);
    expect(bins[2].count).toBe(0);
  });

  it("places score 40 in the 40–60 bin (not 20–40)", () => {
    const bins = computeBins([makeStudent(40)]);
    expect(bins[1].count).toBe(0);
    expect(bins[2].count).toBe(1);
  });

  it("places score 60 in the 60–80 bin", () => {
    const bins = computeBins([makeStudent(60)]);
    expect(bins[2].count).toBe(0);
    expect(bins[3].count).toBe(1);
  });

  it("places score 80 in the 80–100 bin", () => {
    const bins = computeBins([makeStudent(80)]);
    expect(bins[3].count).toBe(0);
    expect(bins[4].count).toBe(1);
  });

  it("places score 100 in the 80–100 bin (edge case)", () => {
    const bins = computeBins([makeStudent(100)]);
    expect(bins[4].count).toBe(1);
    // Confirm it doesn't fall into any other bin
    expect(bins.slice(0, 4).every((b) => b.count === 0)).toBe(true);
  });

  it("counts multiple students across bins correctly", () => {
    const bins = computeBins([makeStudent(15), makeStudent(35), makeStudent(55), makeStudent(75), makeStudent(95)]);
    expect(bins.map((b) => b.count)).toEqual([1, 1, 1, 1, 1]);
  });

  it("returns all-zero counts for empty list", () => {
    const bins = computeBins([]);
    expect(bins.every((b) => b.count === 0)).toBe(true);
  });
});

// ── EngagementChart component tests ───────────────────────────────────────────

describe("EngagementChart", () => {
  it("renders a chart container", () => {
    render(<EngagementChart students={sampleStudents} />);
    expect(screen.getByTestId("engagement-chart")).toBeInTheDocument();
  });

  it("renders card wrapper with rounded-2xl class", () => {
    const { container } = render(<EngagementChart students={sampleStudents} />);
    expect(container.querySelector(".rounded-2xl")).toBeInTheDocument();
  });

  it("renders the chart title", () => {
    render(<EngagementChart students={sampleStudents} />);
    expect(
      screen.getByText("Engagement Score Distribution"),
    ).toBeInTheDocument();
  });

  it("renders the recharts responsive container", () => {
    const { container } = render(<EngagementChart students={sampleStudents} />);
    expect(
      container.querySelector(".recharts-responsive-container"),
    ).toBeInTheDocument();
  });

  it("renders subtitle text", () => {
    render(<EngagementChart students={sampleStudents} />);
    expect(
      screen.getByText("Number of students in each score band"),
    ).toBeInTheDocument();
  });
});
