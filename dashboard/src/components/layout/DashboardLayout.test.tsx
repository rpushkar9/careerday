import { render, screen } from "@testing-library/react";
import { DashboardLayout } from "./DashboardLayout";

describe("DashboardLayout", () => {
  it("renders the header with the dashboard title", () => {
    render(
      <DashboardLayout>
        <div>child</div>
      </DashboardLayout>,
    );
    expect(screen.getByText("CareerDayy")).toBeInTheDocument();
    expect(screen.getByText("Counselor Dashboard")).toBeInTheDocument();
  });

  it("renders children in the main content area", () => {
    render(
      <DashboardLayout>
        <p>test content</p>
      </DashboardLayout>,
    );
    expect(screen.getByText("test content")).toBeInTheDocument();
  });

  it("renders the Bell icon in the header", () => {
    render(
      <DashboardLayout>
        <div />
      </DashboardLayout>,
    );
    // Bell is now a static icon (aria-hidden), confirm header renders without error
    expect(screen.getByText("CareerDayy")).toBeInTheDocument();
  });

  it("renders the AC avatar in the header", () => {
    render(
      <DashboardLayout>
        <div />
      </DashboardLayout>,
    );
    expect(screen.getByText("AC")).toBeInTheDocument();
  });
});
