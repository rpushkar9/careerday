import { describe, it, expect, vi, beforeEach } from "vitest";

// vi.mock is hoisted above const declarations, so mockFrom must be created
// via vi.hoisted() to be accessible inside the factory.
const { mockFrom } = vi.hoisted(() => ({ mockFrom: vi.fn() }));

vi.mock("@/lib/supabase", () => ({
  supabase: { from: mockFrom },
}));

// Import after mock is set up.
import {
  updateStudentStatus,
  markStudentCheckedIn,
  revertStudentCheckedIn,
  fetchStudents,
  fetchAdvisorNotes,
  insertAdvisorNote,
  fetchKpiSummary,
  fetchMilestoneCategorySummary,
} from "./queries";

// ── Write operation helpers ───────────────────────────────────────────────────

function makeUpdateChain(result: { error: unknown }) {
  const mockEq = vi.fn().mockResolvedValue(result);
  const mockUpdate = vi.fn().mockReturnValue({ eq: mockEq });
  mockFrom.mockReturnValue({ update: mockUpdate });
  return { mockUpdate, mockEq };
}

// ── Read operation helpers ────────────────────────────────────────────────────

function makeSelectChain(result: { data: unknown; error: unknown }) {
  const mockSelect = vi.fn().mockResolvedValue(result);
  mockFrom.mockReturnValue({ select: mockSelect });
  return { mockSelect };
}

function makeSelectEqOrderChain(result: { data: unknown; error: unknown }) {
  const mockOrder = vi.fn().mockResolvedValue(result);
  const mockEq = vi.fn().mockReturnValue({ order: mockOrder });
  const mockSelect = vi.fn().mockReturnValue({ eq: mockEq });
  mockFrom.mockReturnValue({ select: mockSelect });
  return { mockSelect, mockEq, mockOrder };
}

function makeInsertSelectSingleChain(result: { data: unknown; error: unknown }) {
  const mockSingle = vi.fn().mockResolvedValue(result);
  const mockSelectAfterInsert = vi.fn().mockReturnValue({ single: mockSingle });
  const mockInsert = vi.fn().mockReturnValue({ select: mockSelectAfterInsert });
  mockFrom.mockReturnValue({ insert: mockInsert });
  return { mockInsert, mockSelectAfterInsert, mockSingle };
}

beforeEach(() => {
  mockFrom.mockReset();
});

// ── updateStudentStatus ───────────────────────────────────────────────────────

describe("updateStudentStatus", () => {
  it("calls supabase update with correct status and student id", async () => {
    const { mockUpdate, mockEq } = makeUpdateChain({ error: null });
    await updateStudentStatus("s-1", "At Risk");
    expect(mockUpdate).toHaveBeenCalledWith({ status: "At Risk" });
    expect(mockEq).toHaveBeenCalledWith("id", "s-1");
  });

  it("throws when supabase returns an error", async () => {
    makeUpdateChain({ error: { message: "db error" } });
    await expect(updateStudentStatus("s-1", "On Track")).rejects.toMatchObject({
      message: "db error",
    });
  });
});

// ── markStudentCheckedIn ──────────────────────────────────────────────────────

describe("markStudentCheckedIn", () => {
  it("writes today's UTC date and returns it", async () => {
    const today = new Date().toISOString().slice(0, 10);
    const { mockUpdate, mockEq } = makeUpdateChain({ error: null });
    const result = await markStudentCheckedIn("s-2");
    expect(mockUpdate).toHaveBeenCalledWith({ last_contacted_date: today });
    expect(mockEq).toHaveBeenCalledWith("id", "s-2");
    expect(result).toBe(today);
  });

  it("throws when supabase returns an error", async () => {
    makeUpdateChain({ error: { message: "network error" } });
    await expect(markStudentCheckedIn("s-2")).rejects.toMatchObject({
      message: "network error",
    });
  });
});

// ── revertStudentCheckedIn ────────────────────────────────────────────────────

describe("revertStudentCheckedIn", () => {
  it("calls supabase update with the previous date and correct student id", async () => {
    const { mockUpdate, mockEq } = makeUpdateChain({ error: null });
    await revertStudentCheckedIn("s-3", "2026-03-15");
    expect(mockUpdate).toHaveBeenCalledWith({
      last_contacted_date: "2026-03-15",
    });
    expect(mockEq).toHaveBeenCalledWith("id", "s-3");
  });

  it("throws when supabase returns an error", async () => {
    makeUpdateChain({ error: { message: "revert error" } });
    await expect(
      revertStudentCheckedIn("s-3", "2026-03-15"),
    ).rejects.toMatchObject({
      message: "revert error",
    });
  });
});

// ── fetchStudents ─────────────────────────────────────────────────────────────

const minimalStudentRow = {
  id: "s-1",
  name: "Test Student",
  email: "test@test.com",
  major: "Computer Science",
  graduation_year: 2026,
  career_direction: "clear" as const,
  confidence_score: 4,
  engagement_score: 85,
  engagement_trend: "up" as const,
  last_active_date: "2026-04-01",
  last_contacted_date: "2026-03-15",
  status: "On Track" as const,
  milestones: [],
  recent_activity: [],
};

describe("fetchStudents", () => {
  it("maps rows to Student shape and defaults advisorNotes to []", async () => {
    makeSelectChain({ data: [minimalStudentRow], error: null });
    const result = await fetchStudents();
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe("s-1");
    expect(result[0].advisorNotes).toEqual([]);
  });

  it("coerces numeric-string engagement_score to number", async () => {
    makeSelectChain({
      data: [{ ...minimalStudentRow, engagement_score: "72" }],
      error: null,
    });
    const result = await fetchStudents();
    expect(typeof result[0].engagementScore).toBe("number");
    expect(result[0].engagementScore).toBe(72);
  });

  it("returns empty array when data is empty", async () => {
    makeSelectChain({ data: [], error: null });
    const result = await fetchStudents();
    expect(result).toEqual([]);
  });

  it("throws when supabase returns an error", async () => {
    makeSelectChain({ data: null, error: { message: "fetch error" } });
    await expect(fetchStudents()).rejects.toMatchObject({ message: "fetch error" });
  });

  it("throws ZodError when row shape is invalid", async () => {
    makeSelectChain({ data: [{ id: 123, name: null }], error: null });
    await expect(fetchStudents()).rejects.toThrow();
  });
});

// ── fetchAdvisorNotes ─────────────────────────────────────────────────────────

const minimalNoteRow = {
  id: "n-1",
  text: "Good progress",
  author_name: "Counselor",
  created_at: "2026-04-01T10:00:00Z",
};

describe("fetchAdvisorNotes", () => {
  it("maps rows to AdvisorNote shape", async () => {
    makeSelectEqOrderChain({ data: [minimalNoteRow], error: null });
    const result = await fetchAdvisorNotes("s-1");
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe("n-1");
    expect(result[0].authorName).toBe("Counselor");
    expect(result[0].timestamp).toBe("2026-04-01T10:00:00Z");
  });

  it("returns empty array when no notes exist", async () => {
    makeSelectEqOrderChain({ data: [], error: null });
    const result = await fetchAdvisorNotes("s-1");
    expect(result).toEqual([]);
  });

  it("throws when supabase returns an error", async () => {
    makeSelectEqOrderChain({ data: null, error: { message: "notes error" } });
    await expect(fetchAdvisorNotes("s-1")).rejects.toMatchObject({
      message: "notes error",
    });
  });
});

// ── insertAdvisorNote ─────────────────────────────────────────────────────────

describe("insertAdvisorNote", () => {
  it("returns the mapped AdvisorNote on success", async () => {
    makeInsertSelectSingleChain({ data: minimalNoteRow, error: null });
    const result = await insertAdvisorNote("s-1", "Good progress");
    expect(result.id).toBe("n-1");
    expect(result.text).toBe("Good progress");
    expect(result.authorName).toBe("Counselor");
  });

  it("throws when supabase returns an error", async () => {
    makeInsertSelectSingleChain({ data: null, error: { message: "insert error" } });
    await expect(insertAdvisorNote("s-1", "text")).rejects.toMatchObject({
      message: "insert error",
    });
  });

  it("throws ZodError when returned row shape is invalid", async () => {
    makeInsertSelectSingleChain({ data: { id: null }, error: null });
    await expect(insertAdvisorNote("s-1", "text")).rejects.toThrow();
  });
});

// ── fetchKpiSummary ───────────────────────────────────────────────────────────

const minimalKpiRow = {
  total_students: 30,
  avg_engagement_score: 72.5,
  milestone_completion_rate: 65,
  students_needing_attention_count: 5,
};

describe("fetchKpiSummary", () => {
  it("maps KPI row to snapshot shape", async () => {
    makeSelectChain({ data: [minimalKpiRow], error: null });
    const result = await fetchKpiSummary();
    expect(result.totalStudents).toBe(30);
    expect(result.averageEngagementScore).toBe(72.5);
    expect(result.milestoneCompletionRate).toBe(65);
    expect(result.studentsNeedingAttentionCount).toBe(5);
  });

  it("coerces string fields to numbers", async () => {
    makeSelectChain({
      data: [{ ...minimalKpiRow, total_students: "30", avg_engagement_score: "72.5" }],
      error: null,
    });
    const result = await fetchKpiSummary();
    expect(typeof result.totalStudents).toBe("number");
    expect(typeof result.averageEngagementScore).toBe("number");
  });

  it("returns zero snapshot when data is empty", async () => {
    makeSelectChain({ data: [], error: null });
    const result = await fetchKpiSummary();
    expect(result).toEqual({
      totalStudents: 0,
      averageEngagementScore: 0,
      milestoneCompletionRate: 0,
      studentsNeedingAttentionCount: 0,
    });
  });

  it("throws when supabase returns an error", async () => {
    makeSelectChain({ data: null, error: { message: "kpi error" } });
    await expect(fetchKpiSummary()).rejects.toMatchObject({ message: "kpi error" });
  });

  it("throws ZodError when row shape is invalid", async () => {
    makeSelectChain({ data: [{ total_students: "not a thing" }], error: null });
    await expect(fetchKpiSummary()).rejects.toThrow();
  });
});

// ── fetchMilestoneCategorySummary ─────────────────────────────────────────────

describe("fetchMilestoneCategorySummary", () => {
  it("maps category rows correctly", async () => {
    makeSelectChain({
      data: [
        {
          category: "Academics",
          completed_count: 10,
          in_progress_count: 3,
          total_count: 15,
          completion_rate: 66.7,
        },
      ],
      error: null,
    });
    const result = await fetchMilestoneCategorySummary();
    expect(result).toHaveLength(1);
    expect(result[0].category).toBe("Academics");
    expect(result[0].completedCount).toBe(10);
    expect(result[0].completionRate).toBe(66.7);
  });

  it("returns empty array when data is empty", async () => {
    makeSelectChain({ data: [], error: null });
    expect(await fetchMilestoneCategorySummary()).toEqual([]);
  });

  it("throws when supabase returns an error", async () => {
    makeSelectChain({ data: null, error: { message: "cat error" } });
    await expect(fetchMilestoneCategorySummary()).rejects.toMatchObject({
      message: "cat error",
    });
  });
});
