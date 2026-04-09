import { render, screen } from "@testing-library/react";
import { DashboardLayout } from "./DashboardLayout";

describe("DashboardLayout", () => {
  it("renders the header with the dashboard title", () => {
    render(
      <DashboardLayout>
        <div>child</div>
      </DashboardLayout>,
    );
    expect(
      screen.getByText("CareerDayy Counselor Dashboard"),
    ).toBeInTheDocument();
  });

  it("renders children in the main content area", () => {
    render(
      <DashboardLayout>
        <p>test content</p>
      </DashboardLayout>,
    );
    expect(screen.getByText("test content")).toBeInTheDocument();
  });
});
