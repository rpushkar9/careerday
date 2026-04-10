import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { InsightsPanel } from "./InsightsPanel";
import type { Student } from "@/types";

function makeStudent(overrides: Partial<Student> = {}): Student {
  return {
    id: "s-1",
    name: "Test Student",
    email: "test@example.com",
    major: "CS",
    graduationYear: 2026,
    careerDirection: "exploring",
    confidenceScore: 3,
    engagementScore: 60,
    engagementTrend: "stable",
    engagementTier: "Medium",
    lastActiveDate: "2026-04-01",
    lastContactedDate: "2026-03-28",
    status: "On Track",
    milestones: [],
    advisorNotes: [],
    recentActivity: [],
    flaggedForAttention: false,
    ...overrides,
  };
}

const students: Student[] = [
  makeStudent({ id: "s-1", engagementTrend: "up" }),
  makeStudent({ id: "s-2", engagementTrend: "up" }),
  makeStudent({ id: "s-3", engagementTrend: "down", engagementTier: "Low" }),
  makeStudent({ id: "s-4", engagementTier: "Low" }),
  makeStudent({ id: "s-5", flaggedForAttention: true }),
  makeStudent({ id: "s-6" }),
];

describe("InsightsPanel", () => {
  it("renders the section heading", () => {
    render(<InsightsPanel students={students} />);
    expect(screen.getByText("Insights This Quarter")).toBeInTheDocument();
  });

  it("shows correct count of students with engagementTrend up", () => {
    render(<InsightsPanel students={students} />);
    expect(screen.getByText(/2 students trending upward/i)).toBeInTheDocument();
  });

  it("shows correct count of students with low engagement", () => {
    render(<InsightsPanel students={students} />);
    expect(screen.getByText(/2 students with low engagement/i)).toBeInTheDocument();
  });

  it("shows correct count of flagged students", () => {
    render(<InsightsPanel students={students} />);
    expect(screen.getByText(/1 student flagged for attention/i)).toBeInTheDocument();
  });
});
