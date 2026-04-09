import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { StudentDetail } from "./StudentDetail";
import type { Student } from "@/types";

const student: Student = {
  id: "s-042",
  name: "Jane Doe",
  careerDirection: "exploring",
  confidenceScore: 4,
  engagementScore: 72,
  engagementTier: "High",
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
  ],
  advisorNotes: [
    {
      id: "n-1",
      text: "Good progress",
      authorName: "Advisor",
      timestamp: "2026-04-01T10:00:00Z",
    },
  ],
  recentActivity: [
    {
      id: "a-1",
      description: "Completed survey",
      timestamp: "2026-04-01T09:00:00Z",
      eventType: "SurveyCompleted",
    },
  ],
  flaggedForAttention: false,
};

describe("StudentDetail", () => {
  it("drawer is closed when student is null", () => {
    render(
      <StudentDetail student={null} onClose={vi.fn()} onAddNote={vi.fn()} />,
    );
    expect(screen.queryByText("Jane Doe")).not.toBeInTheDocument();
  });

  it("drawer opens when student is set", () => {
    render(
      <StudentDetail student={student} onClose={vi.fn()} onAddNote={vi.fn()} />,
    );
    expect(screen.getByText("Jane Doe")).toBeInTheDocument();
  });

  it("renders student name, careerDirection, and confidence score", () => {
    render(
      <StudentDetail student={student} onClose={vi.fn()} onAddNote={vi.fn()} />,
    );
    expect(screen.getByText("Jane Doe")).toBeInTheDocument();
    expect(screen.getByText(/exploring/i)).toBeInTheDocument();
    expect(screen.getByText(/4.*\/.*5/)).toBeInTheDocument();
  });

  it("calls onClose when drawer close button clicked", async () => {
    const onClose = vi.fn();
    render(
      <StudentDetail student={student} onClose={onClose} onAddNote={vi.fn()} />,
    );
    await userEvent.click(screen.getByRole("button", { name: /close/i }));
    expect(onClose).toHaveBeenCalled();
  });

  it("onAddNote callback is wired to AdvisorNotes", async () => {
    const onAddNote = vi.fn();
    render(
      <StudentDetail
        student={student}
        onClose={vi.fn()}
        onAddNote={onAddNote}
      />,
    );
    const input = screen.getByLabelText(/note text/i);
    await userEvent.type(input, "Test note");
    await userEvent.click(screen.getByRole("button", { name: /add note/i }));
    expect(onAddNote).toHaveBeenCalledWith("s-042", "Test note");
  });
});
