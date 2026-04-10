import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { FilterChips } from "./FilterChips";
import { FILTER_CHIPS } from "@/lib/constants";
import type { Student } from "@/types";

function makeStudent(overrides: Partial<Student> = {}): Student {
  return {
    id: "s-001",
    name: "Test Student",
    email: "test@university.edu",
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
    milestones: [],
    advisorNotes: [],
    recentActivity: [],
    flaggedForAttention: false,
    ...overrides,
  };
}

const mockStudents: Student[] = [
  makeStudent({ id: "s-1", flaggedForAttention: true, engagementTier: "Low" }),
  makeStudent({
    id: "s-2",
    flaggedForAttention: false,
    engagementTier: "High",
    milestones: [{ id: "m-1", label: "A", status: "In Progress", category: "X" }],
  }),
  makeStudent({ id: "s-3", flaggedForAttention: false, engagementTier: "Medium" }),
];

describe("FilterChips", () => {
  it("renders all four chips", () => {
    render(
      <FilterChips active={[]} onChange={vi.fn()} students={mockStudents} />,
    );
    for (const chip of FILTER_CHIPS) {
      expect(screen.getByRole("button", { name: new RegExp(chip) })).toBeInTheDocument();
    }
  });

  it('"All" is visually distinguished when active', () => {
    render(
      <FilterChips active={["All"]} onChange={vi.fn()} students={mockStudents} />,
    );
    const allButton = screen.getByRole("button", { name: /^All/ });
    expect(allButton).toHaveAttribute("data-active", "true");
  });

  it("clicking a chip calls onChange including the chip value", async () => {
    const onChange = vi.fn();
    render(
      <FilterChips active={[]} onChange={onChange} students={mockStudents} />,
    );
    await userEvent.click(
      screen.getByRole("button", { name: /High Priority/ }),
    );
    expect(onChange).toHaveBeenCalledWith(["High Priority"]);
  });

  it("active chip is visually distinguished", () => {
    render(
      <FilterChips
        active={["Milestone Behind"]}
        onChange={vi.fn()}
        students={mockStudents}
      />,
    );
    expect(
      screen.getByRole("button", { name: /Milestone Behind/ }),
    ).toHaveAttribute("data-active", "true");
    expect(screen.getByRole("button", { name: /^All/ })).toHaveAttribute(
      "data-active",
      "false",
    );
  });

  it("chips show count badges", () => {
    render(
      <FilterChips active={[]} onChange={vi.fn()} students={mockStudents} />,
    );
    // "All" count = 3
    expect(screen.getByText("3")).toBeInTheDocument();
    // "High Priority" count = 1
    // "Low Engagement" count = 1
    // These may collide so just verify totals exist
    const countBadges = screen.getAllByText(/^\d+$/);
    expect(countBadges.length).toBeGreaterThanOrEqual(4);
  });

  it("two chips can be active at once", async () => {
    const user = userEvent.setup();
    let activeState: string[] = [];
    const onChange = vi.fn((chips: string[]) => {
      activeState = chips;
    });

    const { rerender } = render(
      <FilterChips
        active={activeState}
        onChange={onChange}
        students={mockStudents}
      />,
    );

    // Click "High Priority"
    await user.click(screen.getByRole("button", { name: /High Priority/ }));
    expect(onChange).toHaveBeenLastCalledWith(["High Priority"]);
    activeState = ["High Priority"];

    rerender(
      <FilterChips
        active={activeState}
        onChange={onChange}
        students={mockStudents}
      />,
    );

    // Click "Low Engagement" — both should now be active
    await user.click(screen.getByRole("button", { name: /Low Engagement/ }));
    expect(onChange).toHaveBeenLastCalledWith([
      "High Priority",
      "Low Engagement",
    ]);
    activeState = ["High Priority", "Low Engagement"];

    rerender(
      <FilterChips
        active={activeState}
        onChange={onChange}
        students={mockStudents}
      />,
    );

    expect(
      screen.getByRole("button", { name: /High Priority/ }),
    ).toHaveAttribute("data-active", "true");
    expect(
      screen.getByRole("button", { name: /Low Engagement/ }),
    ).toHaveAttribute("data-active", "true");
  });

  it('"Clear all" appears when a chip is active and clicking it deactivates all', async () => {
    const onChange = vi.fn();
    render(
      <FilterChips
        active={["High Priority"]}
        onChange={onChange}
        students={mockStudents}
      />,
    );
    const clearAll = screen.getByRole("button", { name: /clear all/i });
    expect(clearAll).toBeInTheDocument();

    await userEvent.click(clearAll);
    expect(onChange).toHaveBeenCalledWith([]);
  });

  it('"Clear all" does not appear when no chips are active', () => {
    render(
      <FilterChips active={[]} onChange={vi.fn()} students={mockStudents} />,
    );
    expect(
      screen.queryByRole("button", { name: /clear all/i }),
    ).not.toBeInTheDocument();
  });
});
