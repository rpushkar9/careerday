import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { StudentDetail } from "./StudentDetail";
import type { Student, StudentStatus } from "@/types";

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

function renderDetail(
  overrides: Partial<Student> = {},
  handlers: {
    onClose?: () => void;
    onAddNote?: (id: string, text: string) => void;
    onUpdateStatus?: (id: string, status: StudentStatus) => void;
    onCheckIn?: (id: string) => Promise<string>;
    onUndoCheckIn?: (id: string, previousDate: string) => void;
  } = {},
) {
  const s = makeStudent(overrides);
  render(
    <StudentDetail
      student={s}
      onClose={handlers.onClose ?? vi.fn()}
      onAddNote={handlers.onAddNote ?? vi.fn()}
      onUpdateStatus={handlers.onUpdateStatus ?? vi.fn()}
      onCheckIn={handlers.onCheckIn ?? vi.fn().mockResolvedValue("2026-04-23")}
      onUndoCheckIn={handlers.onUndoCheckIn ?? vi.fn()}
    />,
  );
  return s;
}

describe("StudentDetail", () => {
  it("drawer is closed when student is null", () => {
    render(
      <StudentDetail
        student={null}
        onClose={vi.fn()}
        onAddNote={vi.fn()}
        onUpdateStatus={vi.fn()}
        onCheckIn={vi.fn().mockResolvedValue("2026-04-23")}
        onUndoCheckIn={vi.fn()}
      />,
    );
    expect(screen.queryByText("Jane Doe")).not.toBeInTheDocument();
  });

  it("drawer opens when student is set", () => {
    renderDetail();
    expect(screen.getAllByText("Jane Doe").length).toBeGreaterThan(0);
  });

  it("renders student name, careerDirection, and confidence score", () => {
    renderDetail();
    expect(screen.getAllByText("Jane Doe").length).toBeGreaterThan(0);
    expect(screen.getByText(/exploring/i)).toBeInTheDocument();
    expect(screen.getByText(/4.*\/.*5/)).toBeInTheDocument();
  });

  it("calls onClose when drawer close button clicked", async () => {
    const onClose = vi.fn();
    renderDetail({}, { onClose });
    await userEvent.click(screen.getByRole("button", { name: /close/i }));
    expect(onClose).toHaveBeenCalled();
  });

  it("renders Career Narrative section with career direction and confidence", () => {
    renderDetail();
    expect(screen.getByText("Career Narrative")).toBeInTheDocument();
    expect(screen.getByText("Career Direction")).toBeInTheDocument();
    expect(screen.getByText("Self-reported confidence in career direction")).toBeInTheDocument();
    expect(screen.getByText("Actively exploring")).toBeInTheDocument();
    expect(screen.getByText("Fairly confident")).toBeInTheDocument();
  });

  it("onAddNote callback is wired to AdvisorNotes", async () => {
    const onAddNote = vi.fn();
    renderDetail({}, { onAddNote });
    const input = screen.getByLabelText(/note text/i);
    await userEvent.type(input, "Test note");
    await userEvent.click(screen.getByRole("button", { name: /add note/i }));
    expect(onAddNote).toHaveBeenCalledWith("s-042", "Test note");
  });

  it("renders avatar with correct initials for Aisha Johnson", () => {
    renderDetail({ name: "Aisha Johnson" });
    expect(screen.getByText("AJ")).toBeInTheDocument();
  });

  it("renders Email, Schedule, and Message quick action links", () => {
    renderDetail();
    expect(screen.getByRole("link", { name: /email/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /schedule/i })).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /message/i }),
    ).toBeInTheDocument();
  });

  it("shows Needs Attention alert when student is flagged", () => {
    renderDetail({ flaggedForAttention: true, status: "Needs Attention" });
    // "Needs Attention" appears in both the status select trigger and the alert banner
    expect(screen.getAllByText("Needs Attention").length).toBeGreaterThan(0);
    expect(screen.getByText(/low engagement or milestone gaps/i)).toBeInTheDocument();
  });

  it("shows engagement score with percent sign in metrics grid", () => {
    renderDetail();
    expect(screen.getByText("72%")).toBeInTheDocument();
  });

  // Follow-up section
  it("renders Follow-up section with status selector and Check in button", () => {
    renderDetail();
    expect(screen.getByText("Follow-up")).toBeInTheDocument();
    expect(screen.getByRole("combobox")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /check in/i }),
    ).toBeInTheDocument();
  });

  it("shows last checked in label in Follow-up section", () => {
    renderDetail({ lastContactedDate: "2026-03-28" });
    expect(screen.getByText("Last checked in")).toBeInTheDocument();
  });

  it("calls onCheckIn with student id when Check in button clicked", async () => {
    const onCheckIn = vi.fn().mockResolvedValue("2026-04-23");
    renderDetail({}, { onCheckIn });
    await userEvent.click(screen.getByRole("button", { name: /check in/i }));
    expect(onCheckIn).toHaveBeenCalledWith("s-042");
  });

  it("shows Undo button after Check in and calls onUndoCheckIn when clicked", async () => {
    const onUndoCheckIn = vi.fn();
    const onCheckIn = vi.fn().mockResolvedValue("2026-04-23");
    renderDetail({ lastContactedDate: "2026-03-28" }, { onCheckIn, onUndoCheckIn });
    await userEvent.click(screen.getByRole("button", { name: /check in/i }));
    const undoBtn = await screen.findByRole("button", { name: /undo/i });
    await userEvent.click(undoBtn);
    expect(onUndoCheckIn).toHaveBeenCalledWith("s-042", "2026-03-28");
  });
});
