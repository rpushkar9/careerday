import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock supabase before importing queries so env-var guard doesn't run.
const mockUpdate = vi.fn();
const mockEq = vi.fn();

vi.mock("@/lib/supabase", () => ({
  supabase: {
    from: vi.fn(() => ({
      update: mockUpdate,
    })),
  },
}));

// Import after mock is set up.
import {
  updateStudentStatus,
  markStudentCheckedIn,
  revertStudentCheckedIn,
} from "./queries";

beforeEach(() => {
  mockUpdate.mockReset();
  mockEq.mockReset();
  // Default: update returns an object with .eq chained
  mockUpdate.mockReturnValue({ eq: mockEq });
  // Default: eq resolves with no error
  mockEq.mockResolvedValue({ error: null });
});

describe("updateStudentStatus", () => {
  it("calls supabase update with correct status and student id", async () => {
    await updateStudentStatus("s-1", "At Risk");
    expect(mockUpdate).toHaveBeenCalledWith({ status: "At Risk" });
    expect(mockEq).toHaveBeenCalledWith("id", "s-1");
  });

  it("throws when supabase returns an error", async () => {
    mockEq.mockResolvedValue({ error: { message: "db error" } });
    await expect(updateStudentStatus("s-1", "On Track")).rejects.toMatchObject({
      message: "db error",
    });
  });
});

describe("markStudentCheckedIn", () => {
  it("calls supabase update with last_contacted_date set to today", async () => {
    const today = new Date().toISOString().slice(0, 10);
    const result = await markStudentCheckedIn("s-2");
    expect(mockUpdate).toHaveBeenCalledWith({ last_contacted_date: today });
    expect(mockEq).toHaveBeenCalledWith("id", "s-2");
    expect(result).toBe(today);
  });

  it("throws when supabase returns an error", async () => {
    mockEq.mockResolvedValue({ error: { message: "network error" } });
    await expect(markStudentCheckedIn("s-2")).rejects.toMatchObject({
      message: "network error",
    });
  });
});

describe("revertStudentCheckedIn", () => {
  it("calls supabase update with the previous date and correct student id", async () => {
    await revertStudentCheckedIn("s-3", "2026-03-15");
    expect(mockUpdate).toHaveBeenCalledWith({
      last_contacted_date: "2026-03-15",
    });
    expect(mockEq).toHaveBeenCalledWith("id", "s-3");
  });

  it("throws when supabase returns an error", async () => {
    mockEq.mockResolvedValue({ error: { message: "revert error" } });
    await expect(
      revertStudentCheckedIn("s-3", "2026-03-15"),
    ).rejects.toMatchObject({
      message: "revert error",
    });
  });
});
