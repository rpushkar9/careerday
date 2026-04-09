import { render, screen } from "@testing-library/react";
import { KPICard } from "./KPICard";

describe("KPICard", () => {
  it("renders label and value", () => {
    render(<KPICard label="Total Students" value={30} trend="neutral" />);
    expect(screen.getByText("Total Students")).toBeInTheDocument();
    expect(screen.getByText("30")).toBeInTheDocument();
  });

  it("renders an up arrow when trend is up", () => {
    render(<KPICard label="Completion" value="58%" trend="up" />);
    expect(screen.getByLabelText("Trending up")).toBeInTheDocument();
  });

  it("renders a down arrow when trend is down", () => {
    render(<KPICard label="At Risk" value={5} trend="down" />);
    expect(screen.getByLabelText("Trending down")).toBeInTheDocument();
  });

  it("renders a neutral indicator when trend is neutral", () => {
    render(<KPICard label="Engagement" value="Medium" trend="neutral" />);
    expect(screen.getByLabelText("No change")).toBeInTheDocument();
  });

  it("renders optional unit next to value", () => {
    render(<KPICard label="Completion" value={58} trend="up" unit="%" />);
    expect(screen.getByText("%")).toBeInTheDocument();
  });
});
