import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { StudentTable } from "./StudentTable";
import type { Student } from "@/types";

function makeStudent(overrides: Partial<Student> = {}): Student {
  return {
    id: "s-001",
    name: "Test Student",
    careerDirection: "exploring",
    confidenceScore: 3,
    engagementScore: 65,
    engagementTier: "Medium",
    lastActiveDate: "2026-04-01",
    lastContactedDate: "2026-03-28",
    status: "On Track",
    milestones: [
      {
        id: "m-1",
        label: "Assessment",
        status: "Completed",
        category: "Assessment",
      },
      {
        id: "m-2",
        label: "Resume",
        status: "In Progress",
        category: "Documents",
      },
    ],
    advisorNotes: [],
    recentActivity: [],
    flaggedForAttention: false,
    ...overrides,
  };
}

function makeStudents(count: number): Student[] {
  return Array.from({ length: count }, (_, i) =>
    makeStudent({
      id: `s-${String(i + 1).padStart(3, "0")}`,
      name: `Student ${i + 1}`,
    }),
  );
}

describe("StudentTable", () => {
  it("renders 30 rows when given 30 students", () => {
    const students = makeStudents(30);
    render(<StudentTable students={students} onSelectStudent={vi.fn()} />);
    const rows = screen.getAllByRole("row");
    // 30 data rows + 1 header row
    expect(rows).toHaveLength(31);
  });

  it("renders 7 column headers", () => {
    render(
      <StudentTable students={[makeStudent()]} onSelectStudent={vi.fn()} />,
    );
    const headers = screen.getAllByRole("columnheader");
    expect(headers).toHaveLength(7);
    expect(headers.map((h) => h.textContent)).toEqual([
      "Name",
      "Career Direction",
      "Engagement",
      "Milestones",
      "Last Active",
      "Last Contacted",
      "Status",
    ]);
  });

  it("renders empty state when given 0 students", () => {
    render(<StudentTable students={[]} onSelectStudent={vi.fn()} />);
    expect(screen.getByText(/no students/i)).toBeInTheDocument();
  });

  it("clicking a row calls onSelectStudent with the correct student", async () => {
    const student = makeStudent({ id: "s-042", name: "Clicked Student" });
    const onSelect = vi.fn();
    render(<StudentTable students={[student]} onSelectStudent={onSelect} />);
    await userEvent.click(screen.getByText("Clicked Student"));
    expect(onSelect).toHaveBeenCalledWith(student);
  });
});
