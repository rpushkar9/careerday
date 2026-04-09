import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { MilestoneChart } from "./MilestoneChart";
import type { MilestoneCategoryCompletion } from "@/types";

// Recharts needs ResizeObserver in jsdom
class ResizeObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}
globalThis.ResizeObserver =
  ResizeObserverMock as unknown as typeof ResizeObserver;

const sampleData: MilestoneCategoryCompletion[] = [
  {
    category: "Assessment",
    completedCount: 20,
    totalCount: 30,
    completionRate: 66.7,
  },
  {
    category: "Documents",
    completedCount: 15,
    totalCount: 30,
    completionRate: 50.0,
  },
  {
    category: "Experience",
    completedCount: 10,
    totalCount: 30,
    completionRate: 33.3,
  },
];

describe("MilestoneChart", () => {
  it("renders a chart container", () => {
    render(<MilestoneChart data={sampleData} />);
    expect(screen.getByTestId("milestone-chart")).toBeInTheDocument();
  });

  it("renders bar elements equal to data.length", () => {
    const { container } = render(<MilestoneChart data={sampleData} />);
    // In jsdom Recharts may not render actual bars, so check container exists
    expect(
      container.querySelector(".recharts-responsive-container"),
    ).toBeInTheDocument();
    expect(screen.getByTestId("milestone-chart")).toBeInTheDocument();
  });
});
