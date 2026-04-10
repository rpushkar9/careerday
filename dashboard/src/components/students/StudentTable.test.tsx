import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { StudentTable } from "./StudentTable";
import type { Student } from "@/types";

function makeStudent(overrides: Partial<Student> = {}): Student {
  return {
    id: "s-001",
    name: "Test Student",
    email: "test.student@university.edu",
    major: "Computer Science",
    graduationYear: 2026,
    careerDirection: "exploring",
    confidenceScore: 3,
    engagementScore: 65,
    engagementTrend: "stable",
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

  it("renders 9 column headers", () => {
    render(
      <StudentTable students={[makeStudent()]} onSelectStudent={vi.fn()} />,
    );
    const headers = screen.getAllByRole("columnheader");
    expect(headers).toHaveLength(9);
    expect(headers.map((h) => h.textContent?.trim())).toEqual([
      "Name",
      "Major",
      "Grad Year",
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

  it("email appears under student name in the first cell", () => {
    const student = makeStudent({
      name: "Jane Doe",
      email: "jane.doe@university.edu",
    });
    render(<StudentTable students={[student]} onSelectStudent={vi.fn()} />);
    expect(screen.getByText("jane.doe@university.edu")).toBeInTheDocument();
    // Name and email are both in the first column
    const nameCell = screen.getByText("Jane Doe").closest("td");
    expect(nameCell).toHaveTextContent("jane.doe@university.edu");
  });

  it("engagement cell contains % for a student", () => {
    const student = makeStudent({ engagementScore: 75 });
    render(<StudentTable students={[student]} onSelectStudent={vi.fn()} />);
    expect(screen.getByText(/75%/)).toBeInTheDocument();
  });

  it("career direction 'exploring' renders a blue badge with text Exploring", () => {
    const student = makeStudent({ careerDirection: "exploring" });
    render(<StudentTable students={[student]} onSelectStudent={vi.fn()} />);
    const badge = screen.getByText("Exploring");
    expect(badge).toBeInTheDocument();
    expect(badge.className).toMatch(/blue/);
  });

  it("status tooltip shows on hover for a non-On Track student", async () => {
    const user = userEvent.setup();
    const student = makeStudent({ status: "At Risk" });
    render(<StudentTable students={[student]} onSelectStudent={vi.fn()} />);

    // Tooltip should not be visible initially
    expect(
      screen.queryByText(/Engagement declining/i),
    ).not.toBeInTheDocument();

    // Hover the status cell container
    const statusCell = screen.getByText("At Risk").closest("td");
    await user.hover(statusCell!);
    expect(screen.getByText(/Engagement declining/i)).toBeInTheDocument();

    // Unhover: tooltip disappears
    await user.unhover(statusCell!);
    expect(
      screen.queryByText(/Engagement declining/i),
    ).not.toBeInTheDocument();
  });

  it("clicking Milestones header sorts rows by completion rate", async () => {
    const user = userEvent.setup();
    const highAchiever = makeStudent({
      id: "s-high",
      name: "High Achiever",
      milestones: [
        { id: "m-1", label: "A", status: "Completed", category: "X" },
        { id: "m-2", label: "B", status: "Completed", category: "X" },
      ],
    });
    const lowAchiever = makeStudent({
      id: "s-low",
      name: "Low Achiever",
      milestones: [
        { id: "m-1", label: "A", status: "Pending", category: "X" },
        { id: "m-2", label: "B", status: "Pending", category: "X" },
      ],
    });

    render(
      <StudentTable
        students={[lowAchiever, highAchiever]}
        onSelectStudent={vi.fn()}
      />,
    );

    // Initial order: Low then High
    let rows = screen.getAllByRole("row").slice(1);
    expect(rows[0]).toHaveTextContent("Low Achiever");

    // Milestones is column index 5 (0-based: Name, Major, Grad Year, Career Direction, Engagement, Milestones)
    const milestonesHeader = screen.getAllByRole("columnheader")[5];
    await user.click(milestonesHeader);
    expect(milestonesHeader.textContent).toContain("▼");
    rows = screen.getAllByRole("row").slice(1);
    expect(rows[0]).toHaveTextContent("High Achiever");
    expect(rows[1]).toHaveTextContent("Low Achiever");

    // Second click → ascending (lower first)
    await user.click(milestonesHeader);
    expect(milestonesHeader.textContent).toContain("▲");
    rows = screen.getAllByRole("row").slice(1);
    expect(rows[0]).toHaveTextContent("Low Achiever");
    expect(rows[1]).toHaveTextContent("High Achiever");
  });
});
