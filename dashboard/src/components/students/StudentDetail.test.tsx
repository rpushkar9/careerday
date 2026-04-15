import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { StudentDetail } from "./StudentDetail";
import type { Student } from "@/types";

function makeStudent(overrides: Partial<Student> = {}): Student {
  return {
    id: "s-042",
    name: "Jane Doe",
    email: "jane@example.com",
    major: "Computer Science",
    graduationYear: 2027,
    careerDirection: "exploring",
    confidenceScore: 4,
    engagementScore: 72,
    engagementTrend: "stable",
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
    ...overrides,
  };
}

const student = makeStudent();

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
    expect(screen.getAllByText("Jane Doe").length).toBeGreaterThan(0);
  });

  it("renders student name, careerDirection, and confidence score", () => {
    render(
      <StudentDetail student={student} onClose={vi.fn()} onAddNote={vi.fn()} />,
    );
    expect(screen.getAllByText("Jane Doe").length).toBeGreaterThan(0);
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

  it("renders Career Narrative section with career direction and confidence score", () => {
    render(
      <StudentDetail student={student} onClose={vi.fn()} onAddNote={vi.fn()} />,
    );
    expect(screen.getByText("Career Narrative")).toBeInTheDocument();
    expect(screen.getByText("Career Direction")).toBeInTheDocument();
    expect(screen.getByText("Confidence Score")).toBeInTheDocument();
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

  it("renders avatar with correct initials for Aisha Johnson", () => {
    const s = makeStudent({ name: "Aisha Johnson" });
    render(
      <StudentDetail student={s} onClose={vi.fn()} onAddNote={vi.fn()} />,
    );
    expect(screen.getByText("AJ")).toBeInTheDocument();
  });

  it("renders Email, Call, and Message quick action buttons", () => {
    render(
      <StudentDetail student={student} onClose={vi.fn()} onAddNote={vi.fn()} />,
    );
    expect(screen.getByRole("button", { name: /email/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /call/i })).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /message/i }),
    ).toBeInTheDocument();
  });

  it("shows Needs Attention alert when student is flagged", () => {
    const flagged = makeStudent({
      flaggedForAttention: true,
      status: "Needs Attention",
    });
    render(
      <StudentDetail student={flagged} onClose={vi.fn()} onAddNote={vi.fn()} />,
    );
    expect(screen.getByText("Needs Attention")).toBeInTheDocument();
  });

  it("shows engagement score with percent sign in metrics grid", () => {
    render(
      <StudentDetail student={student} onClose={vi.fn()} onAddNote={vi.fn()} />,
    );
    expect(screen.getByText("72%")).toBeInTheDocument();
  });
});
