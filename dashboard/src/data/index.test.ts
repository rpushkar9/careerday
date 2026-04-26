import { describe, it, expect } from "vitest";
import { computeCurrentKPIPeriod } from "./index";
import type { Student, Milestone } from "@/types";

function makeMilestone(status: Milestone["status"], id = "m-1"): Milestone {
  return { id, label: "Test", status, category: "Test" };
}

function makeStudent(
  engagementScore: number,
  status: Student["status"],
  milestones: Milestone[],
  id = "s-1",
): Student {
  return {
    id,
    name: "Test Student",
    email: "test@example.com",
    major: "CS",
    graduationYear: 2026,
    careerDirection: "exploring",
    confidenceScore: 3,
    engagementScore,
    engagementTrend: "stable",
    engagementTier: "Medium",
    lastActiveDate: "2026-04-01",
    lastContactedDate: "2026-03-28",
    status,
    milestones,
    advisorNotes: [],
    recentActivity: [],
    flaggedForAttention: false,
  };
}

describe("computeCurrentKPIPeriod", () => {
  it("returns zeros for an empty student list", () => {
    const result = computeCurrentKPIPeriod([]);
    expect(result.totalStudents).toBe(0);
    expect(result.averageEngagementScore).toBe(0);
    expect(result.milestoneCompletionRate).toBe(0);
    expect(result.studentsNeedingAttentionCount).toBe(0);
  });

  it("computes totalStudents as student array length", () => {
    const students = [
      makeStudent(70, "On Track", [], "s-1"),
      makeStudent(50, "On Track", [], "s-2"),
      makeStudent(40, "On Track", [], "s-3"),
    ];
    expect(computeCurrentKPIPeriod(students).totalStudents).toBe(3);
  });

  it("computes averageEngagementScore as rounded arithmetic mean", () => {
    // (80 + 60) / 2 = 70
    const students = [
      makeStudent(80, "On Track", [], "s-1"),
      makeStudent(60, "On Track", [], "s-2"),
    ];
    expect(computeCurrentKPIPeriod(students).averageEngagementScore).toBe(70);
  });

  it("rounds averageEngagementScore to nearest integer", () => {
    // (80 + 61) / 2 = 70.5 → 71
    const students = [
      makeStudent(80, "On Track", [], "s-1"),
      makeStudent(61, "On Track", [], "s-2"),
    ];
    expect(computeCurrentKPIPeriod(students).averageEngagementScore).toBe(71);
  });

  it("computes milestoneCompletionRate as completed/total × 100 to one decimal", () => {
    // s1: 2 completed, 1 pending → 2/3 milestones done
    // s2: 1 completed, 1 pending → 1/2 milestones done
    // total: 3 completed / 5 total = 0.6 → 60.0%
    const students = [
      makeStudent(
        70,
        "On Track",
        [
          makeMilestone("Completed", "m-1"),
          makeMilestone("Completed", "m-2"),
          makeMilestone("Pending", "m-3"),
        ],
        "s-1",
      ),
      makeStudent(
        50,
        "On Track",
        [makeMilestone("Completed", "m-4"), makeMilestone("Pending", "m-5")],
        "s-2",
      ),
    ];
    expect(computeCurrentKPIPeriod(students).milestoneCompletionRate).toBe(
      60.0,
    );
  });

  it("milestoneCompletionRate counts only Completed — not In Progress", () => {
    // 1 Completed, 1 In Progress, 1 Pending → 1/3 = 33.3%
    const students = [
      makeStudent(
        70,
        "On Track",
        [
          makeMilestone("Completed", "m-1"),
          makeMilestone("In Progress", "m-2"),
          makeMilestone("Pending", "m-3"),
        ],
        "s-1",
      ),
    ];
    expect(computeCurrentKPIPeriod(students).milestoneCompletionRate).toBe(
      33.3,
    );
  });

  it("milestoneCompletionRate is 0 when student list has no milestones", () => {
    const students = [makeStudent(70, "On Track", [], "s-1")];
    expect(computeCurrentKPIPeriod(students).milestoneCompletionRate).toBe(0);
  });

  it("counts only students with status === 'Needs Attention'", () => {
    const students = [
      makeStudent(80, "On Track", [], "s-1"),
      makeStudent(30, "Needs Attention", [], "s-2"),
      makeStudent(40, "At Risk", [], "s-3"),
      makeStudent(20, "Needs Attention", [], "s-4"),
    ];
    expect(
      computeCurrentKPIPeriod(students).studentsNeedingAttentionCount,
    ).toBe(2);
  });

  it("'At Risk' status does not count as needing attention", () => {
    const students = [
      makeStudent(38, "At Risk", [], "s-1"),
      makeStudent(42, "At Risk", [], "s-2"),
    ];
    expect(
      computeCurrentKPIPeriod(students).studentsNeedingAttentionCount,
    ).toBe(0);
  });
});
