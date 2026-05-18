import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { ActivityFeed } from "./ActivityFeed";
import type { ActivityEvent, Milestone } from "@/types";

function makeEvent(overrides: Partial<ActivityEvent> = {}): ActivityEvent {
  return {
    id: "a-1",
    description: "Completed survey",
    timestamp: "2026-05-01T10:00:00Z",
    eventType: "SurveyCompleted",
    ...overrides,
  };
}

function makeMilestone(overrides: Partial<Milestone> = {}): Milestone {
  return {
    id: "m-1",
    label: "Update resume",
    status: "Completed",
    category: "Profile",
    completedDate: "2026-04-20T00:00:00Z",
    ...overrides,
  };
}

describe("ActivityFeed", () => {
  it("shows empty state when no activity and no milestones", () => {
    render(<ActivityFeed activity={[]} />);
    expect(screen.getByText(/no recent activity/i)).toBeInTheDocument();
  });

  it("renders activity events", () => {
    render(<ActivityFeed activity={[makeEvent()]} />);
    expect(screen.getByText("Completed survey")).toBeInTheDocument();
  });

  it("derives milestone completion events from completed milestones", () => {
    render(<ActivityFeed activity={[]} milestones={[makeMilestone()]} />);
    expect(screen.getByText(/completed milestone.*update resume/i)).toBeInTheDocument();
  });

  it("does NOT derive events for Pending milestones", () => {
    render(
      <ActivityFeed
        activity={[]}
        milestones={[makeMilestone({ status: "Pending", completedDate: undefined })]}
      />,
    );
    expect(screen.getByText(/no recent activity/i)).toBeInTheDocument();
  });

  it("does NOT derive events for In Progress milestones", () => {
    render(
      <ActivityFeed
        activity={[]}
        milestones={[makeMilestone({ status: "In Progress", completedDate: undefined })]}
      />,
    );
    expect(screen.getByText(/no recent activity/i)).toBeInTheDocument();
  });

  it("does NOT derive events for completed milestones missing completedDate", () => {
    render(
      <ActivityFeed
        activity={[]}
        milestones={[makeMilestone({ status: "Completed", completedDate: undefined })]}
      />,
    );
    expect(screen.getByText(/no recent activity/i)).toBeInTheDocument();
  });

  it("sorts events newest first", () => {
    const older = makeEvent({ id: "a-old", description: "Old event", timestamp: "2026-04-01T00:00:00Z" });
    const newer = makeEvent({ id: "a-new", description: "New event", timestamp: "2026-05-01T00:00:00Z" });
    render(<ActivityFeed activity={[older, newer]} />);
    const items = screen.getAllByRole("listitem");
    expect(items[0]).toHaveTextContent("New event");
    expect(items[1]).toHaveTextContent("Old event");
  });

  it("merges activity and milestone events and sorts newest first", () => {
    const event = makeEvent({ id: "a-1", timestamp: "2026-04-10T00:00:00Z" });
    const milestone = makeMilestone({ id: "m-1", completedDate: "2026-05-01T00:00:00Z" });
    render(<ActivityFeed activity={[event]} milestones={[milestone]} />);
    const items = screen.getAllByRole("listitem");
    // milestone (May 1) should come before activity (Apr 10)
    expect(items[0]).toHaveTextContent(/completed milestone/i);
    expect(items[1]).toHaveTextContent("Completed survey");
  });

  it("deduplicates events with the same id (activity wins over derived)", () => {
    const activityEvent = makeEvent({ id: "milestone-m-1", description: "Server event" });
    const milestone = makeMilestone({ id: "m-1", completedDate: "2026-05-01T00:00:00Z" });
    render(<ActivityFeed activity={[activityEvent]} milestones={[milestone]} />);
    // Only one event with id milestone-m-1 should appear
    expect(screen.getByText("Server event")).toBeInTheDocument();
    expect(screen.queryByText(/completed milestone/i)).not.toBeInTheDocument();
  });

  it("uses consistent date format (abbreviated month)", () => {
    render(<ActivityFeed activity={[makeEvent({ timestamp: "2026-05-01T10:00:00Z" })]} />);
    // Should match "May 1, 2026" or locale variant — at minimum should NOT be raw ISO
    const time = screen.getByRole("time");
    expect(time.textContent).toMatch(/may/i);
  });
});
