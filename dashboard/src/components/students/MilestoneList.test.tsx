import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { MilestoneList } from "./MilestoneList";
import type { Milestone } from "@/types";

function makeMilestone(overrides: Partial<Milestone> = {}): Milestone {
  return {
    id: "m-1",
    label: "Update resume",
    status: "Pending",
    category: "Profile",
    ...overrides,
  };
}

describe("MilestoneList", () => {
  it("shows empty state when no milestones", () => {
    render(<MilestoneList milestones={[]} />);
    expect(screen.getByText(/no milestones/i)).toBeInTheDocument();
  });

  it("renders milestone label", () => {
    render(<MilestoneList milestones={[makeMilestone()]} />);
    expect(screen.getByText("Update resume")).toBeInTheDocument();
  });

  it("renders category label (not raw DB value)", () => {
    render(<MilestoneList milestones={[makeMilestone({ category: "Profile" })]} />);
    expect(screen.getByText("Resume & Profile")).toBeInTheDocument();
    expect(screen.queryByText(/^Profile$/)).not.toBeInTheDocument();
  });

  it("renders 'Career Assessment' label for Assessment category", () => {
    render(<MilestoneList milestones={[makeMilestone({ category: "Assessment" })]} />);
    expect(screen.getByText("Career Assessment")).toBeInTheDocument();
  });

  it("Add button is disabled when label is empty", () => {
    render(<MilestoneList milestones={[]} onAddMilestone={vi.fn()} />);
    expect(screen.getByRole("button", { name: /^add$/i })).toBeDisabled();
  });

  it("Add button enables when label is not empty", async () => {
    render(<MilestoneList milestones={[]} onAddMilestone={vi.fn()} />);
    await userEvent.type(screen.getByLabelText(/milestone label/i), "New goal");
    expect(screen.getByRole("button", { name: /^add$/i })).not.toBeDisabled();
  });

  it("calls onAddMilestone with trimmed label and selected category", async () => {
    const onAdd = vi.fn();
    render(<MilestoneList milestones={[]} onAddMilestone={onAdd} />);
    await userEvent.type(screen.getByLabelText(/milestone label/i), "  Network event  ");
    await userEvent.click(screen.getByRole("button", { name: /^add$/i }));
    expect(onAdd).toHaveBeenCalledWith("Network event", expect.any(String));
  });

  it("clears the label input after successful add", async () => {
    render(<MilestoneList milestones={[]} onAddMilestone={vi.fn()} />);
    const input = screen.getByLabelText(/milestone label/i);
    await userEvent.type(input, "Goal");
    await userEvent.click(screen.getByRole("button", { name: /^add$/i }));
    expect(input).toHaveValue("");
  });

  it("shows delete trash button when onDeleteMilestone is provided", () => {
    render(<MilestoneList milestones={[makeMilestone()]} onDeleteMilestone={vi.fn()} />);
    expect(screen.getByRole("button", { name: /delete milestone update resume/i })).toBeInTheDocument();
  });

  it("clicking trash shows inline Delete/Cancel confirm", async () => {
    render(<MilestoneList milestones={[makeMilestone()]} onDeleteMilestone={vi.fn()} />);
    await userEvent.click(screen.getByRole("button", { name: /delete milestone update resume/i }));
    expect(screen.getByRole("button", { name: /confirm delete/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /cancel delete/i })).toBeInTheDocument();
  });

  it("Cancel hides confirm and does not call onDeleteMilestone", async () => {
    const onDelete = vi.fn();
    render(<MilestoneList milestones={[makeMilestone()]} onDeleteMilestone={onDelete} />);
    await userEvent.click(screen.getByRole("button", { name: /delete milestone update resume/i }));
    await userEvent.click(screen.getByRole("button", { name: /cancel delete/i }));
    expect(onDelete).not.toHaveBeenCalled();
    expect(screen.queryByRole("button", { name: /confirm delete/i })).not.toBeInTheDocument();
  });

  it("confirming delete calls onDeleteMilestone with the milestone id", async () => {
    const onDelete = vi.fn();
    render(<MilestoneList milestones={[makeMilestone({ id: "m-42" })]} onDeleteMilestone={onDelete} />);
    await userEvent.click(screen.getByRole("button", { name: /delete milestone update resume/i }));
    await userEvent.click(screen.getByRole("button", { name: /confirm delete/i }));
    expect(onDelete).toHaveBeenCalledWith("m-42");
  });

  it("does not show delete button when onDeleteMilestone is absent", () => {
    render(<MilestoneList milestones={[makeMilestone()]} />);
    expect(screen.queryByRole("button", { name: /delete milestone/i })).not.toBeInTheDocument();
  });
});
