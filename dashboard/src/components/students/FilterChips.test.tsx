import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { FilterChips } from "./FilterChips";
import { FILTER_CHIPS } from "@/lib/constants";

describe("FilterChips", () => {
  it("renders all four chips", () => {
    render(<FilterChips active="All" onChange={vi.fn()} />);
    for (const chip of FILTER_CHIPS) {
      expect(screen.getByRole("button", { name: chip })).toBeInTheDocument();
    }
  });

  it('"All" is visually distinguished when active', () => {
    render(<FilterChips active="All" onChange={vi.fn()} />);
    const allButton = screen.getByRole("button", { name: "All" });
    // The active chip uses "default" variant; others use "outline"
    expect(allButton).toHaveAttribute("data-active", "true");
  });

  it("clicking a chip calls onChange with the chip value", async () => {
    const onChange = vi.fn();
    render(<FilterChips active="All" onChange={onChange} />);
    await userEvent.click(
      screen.getByRole("button", { name: "High Priority" }),
    );
    expect(onChange).toHaveBeenCalledWith("High Priority");
  });

  it("active chip is visually distinguished", () => {
    render(<FilterChips active="Milestone Behind" onChange={vi.fn()} />);
    expect(
      screen.getByRole("button", { name: "Milestone Behind" }),
    ).toHaveAttribute("data-active", "true");
    expect(screen.getByRole("button", { name: "All" })).toHaveAttribute(
      "data-active",
      "false",
    );
  });
});
