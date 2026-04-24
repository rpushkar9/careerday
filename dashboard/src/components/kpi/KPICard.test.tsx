import { render, screen } from "@testing-library/react";
import { Users } from "lucide-react";
import { KPICard } from "./KPICard";

describe("KPICard", () => {
  it("renders label and value", () => {
    render(<KPICard label="Total Students" value={30} trend="neutral" icon={Users} />);
    expect(screen.getByText("Total Students")).toBeInTheDocument();
    expect(screen.getByText("30")).toBeInTheDocument();
  });

  it("renders an up arrow when trend is up", () => {
    render(<KPICard label="Completion" value="58%" trend="up" icon={Users} />);
    expect(screen.getByLabelText("Trending up")).toBeInTheDocument();
  });

  it("renders a down arrow when trend is down", () => {
    render(<KPICard label="At Risk" value={5} trend="down" icon={Users} />);
    expect(screen.getByLabelText("Trending down")).toBeInTheDocument();
  });

  it("hides the badge when trend is neutral and no delta (no prior period)", () => {
    render(<KPICard label="Engagement" value="Medium" trend="neutral" icon={Users} />);
    expect(screen.queryByLabelText("No change")).not.toBeInTheDocument();
  });

  it("shows neutral badge when trend is neutral but a delta is provided", () => {
    render(<KPICard label="Engagement" value="Medium" trend="neutral" icon={Users} delta="0%" />);
    expect(screen.getByLabelText("No change")).toBeInTheDocument();
  });

  it("renders optional unit next to value", () => {
    render(<KPICard label="Completion" value={58} trend="up" unit="%" icon={Users} />);
    expect(screen.getByText("%")).toBeInTheDocument();
  });

  it("renders the icon container with bg-secondary/50 class", () => {
    render(<KPICard label="Total Students" value={30} trend="neutral" icon={Users} />);
    const iconContainer = document.querySelector(".bg-secondary\\/50");
    expect(iconContainer).toBeInTheDocument();
  });

  it("renders change badge with delta text when delta is provided", () => {
    render(<KPICard label="Total Students" value={30} trend="up" icon={Users} delta="+8%" />);
    expect(screen.getByText("+8%")).toBeInTheDocument();
  });

  it("renders tooltip trigger (Info icon) when tooltip prop is provided", () => {
    render(
      <KPICard
        label="Average Engagement"
        value={64}
        trend="up"
        icon={Users}
        tooltip="Some tooltip text"
      />
    );
    // The Info icon is rendered as an svg with a title or aria-label; we query by role or test-id
    const infoIcon = document.querySelector("[data-tooltip-trigger]");
    expect(infoIcon).toBeInTheDocument();
  });
});
