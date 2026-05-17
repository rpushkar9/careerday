import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { EngagementChart } from "./EngagementChart";
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
