import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { AdvisorNotes } from "./AdvisorNotes";
import type { AdvisorNote } from "@/types";

const sampleNotes: AdvisorNote[] = [
  {
    id: "n-1",
    text: "First note",
    authorName: "Ms. Smith",
    timestamp: "2026-04-01T10:00:00Z",
  },
  {
    id: "n-2",
    text: "Second note",
    authorName: "Mr. Jones",
    timestamp: "2026-04-02T14:00:00Z",
  },
];

describe("AdvisorNotes", () => {
  it("renders existing notes in order", () => {
    render(<AdvisorNotes notes={sampleNotes} onAddNote={vi.fn()} />);
    const items = screen.getAllByRole("listitem");
    expect(items).toHaveLength(2);
    expect(items[0]).toHaveTextContent("First note");
    expect(items[1]).toHaveTextContent("Second note");
  });

  it('"Add Note" button is disabled when input is empty', () => {
    render(<AdvisorNotes notes={[]} onAddNote={vi.fn()} />);
    expect(screen.getByRole("button", { name: /add note/i })).toBeDisabled();
  });

  it("typing text enables button", async () => {
    render(<AdvisorNotes notes={[]} onAddNote={vi.fn()} />);
    await userEvent.type(screen.getByLabelText(/note text/i), "Hello");
    expect(screen.getByRole("button", { name: /add note/i })).toBeEnabled();
  });

  it('clicking "Add Note" calls onAddNote with trimmed text and clears input', async () => {
    const onAddNote = vi.fn();
    render(<AdvisorNotes notes={[]} onAddNote={onAddNote} />);
    const input = screen.getByLabelText(/note text/i);
    await userEvent.type(input, "  New note  ");
    await userEvent.click(screen.getByRole("button", { name: /add note/i }));
    expect(onAddNote).toHaveBeenCalledWith("New note");
    expect(input).toHaveValue("");
  });

  it("shows empty state when notes is empty", () => {
    render(<AdvisorNotes notes={[]} onAddNote={vi.fn()} />);
    expect(screen.getByText(/no notes yet/i)).toBeInTheDocument();
  });
});
