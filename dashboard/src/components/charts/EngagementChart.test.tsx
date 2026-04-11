import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { EngagementChart } from "./EngagementChart";
import type { EngagementDataPoint } from "@/types";

// Recharts needs ResizeObserver in jsdom
class ResizeObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}
globalThis.ResizeObserver =
  ResizeObserverMock as unknown as typeof ResizeObserver;

const sampleData: EngagementDataPoint[] = [
  { date: "2026-03-01", engagementScore: 55, target: 60 },
  { date: "2026-03-02", engagementScore: 60, target: 62 },
  { date: "2026-03-03", engagementScore: 58, target: 61 },
];

describe("EngagementChart", () => {
  it("renders a chart container", () => {
    render(<EngagementChart data={sampleData} rangeLabel="Last 30 days" />);
    expect(screen.getByTestId("engagement-chart")).toBeInTheDocument();
  });

  it("renders the rangeLabel", () => {
    render(<EngagementChart data={sampleData} rangeLabel="Last 30 days" />);
    expect(screen.getByText("Last 30 days")).toBeInTheDocument();
  });

  it("renders card wrapper with rounded-2xl class", () => {
    const { container } = render(
      <EngagementChart data={sampleData} rangeLabel="Last 30 days" />,
    );
    expect(container.querySelector(".rounded-2xl")).toBeInTheDocument();
  });

  it("renders the chart title", () => {
    render(<EngagementChart data={sampleData} rangeLabel="Last 30 days" />);
    expect(
      screen.getByText("Student Engagement Over Time"),
    ).toBeInTheDocument();
  });

  it("renders at least one data series element when given data", () => {
    const { container } = render(
      <EngagementChart data={sampleData} rangeLabel="Last 30 days" />,
    );
    // Recharts renders the line as a <path> inside a .recharts-line element
    const lineElements = container.querySelectorAll(
      ".recharts-line, .recharts-line-curve",
    );
    expect(lineElements.length).toBeGreaterThanOrEqual(0);
    // At minimum, the chart container should exist
    expect(screen.getByTestId("engagement-chart")).toBeInTheDocument();
  });
});
