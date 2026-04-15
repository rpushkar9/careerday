import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { InsightsPanel } from "./InsightsPanel";
import type { Student, Milestone } from "@/types";

function makeMilestone(status: Milestone["status"], id = "m-1"): Milestone {
  return { id, label: "Test", status, category: "Test" };
}

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
  // declining engagement (2)
  makeStudent({ id: "s-1", engagementTrend: "down" }),
  makeStudent({ id: "s-2", engagementTrend: "down" }),
  // unstarted milestone (1 — s-3 has a Pending milestone)
  makeStudent({
    id: "s-3",
    engagementTrend: "stable",
    milestones: [
      makeMilestone("Completed", "m-1"),
      makeMilestone("Pending", "m-2"),
    ],
  }),
  // needs attention (1)
  makeStudent({ id: "s-4", status: "Needs Attention" }),
  // baseline — none of the above
  makeStudent({ id: "s-5" }),
];

describe("InsightsPanel", () => {
  it("renders the section heading", () => {
    render(<InsightsPanel students={students} />);
    expect(screen.getByText("Insights This Quarter")).toBeInTheDocument();
  });

  it("shows correct count of students with declining engagement", () => {
    render(<InsightsPanel students={students} />);
    expect(
      screen.getByText(/2 students with declining engagement/i),
    ).toBeInTheDocument();
  });

  it("shows correct count of students with unstarted milestones", () => {
    render(<InsightsPanel students={students} />);
    expect(
      screen.getByText(/1 student with unstarted milestones/i),
    ).toBeInTheDocument();
  });

  it("shows correct count of students marked for counselor follow-up", () => {
    render(<InsightsPanel students={students} />);
    expect(
      screen.getByText(/1 student marked for counselor follow-up/i),
    ).toBeInTheDocument();
  });

  it("shows 0 for each category when list is empty", () => {
    render(<InsightsPanel students={[]} />);
    // All three bullets should show 0
    const zeros = screen.getAllByText(/^0 students/i);
    expect(zeros).toHaveLength(3);
  });
});
