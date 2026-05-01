import { useState, useEffect, useMemo, useRef } from "react";
import { AlertCircle, X } from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { InsightsPanel } from "@/components/shared/InsightsPanel";
import { KPIGrid } from "@/components/kpi/KPIGrid";
import { FilterChips } from "@/components/students/FilterChips";
import { StudentTable } from "@/components/students/StudentTable";
import { StudentDetail } from "@/components/students/StudentDetail";
import { Input } from "@/components/ui/input";
import { EngagementChart } from "@/components/charts/EngagementChart";
import { MilestoneChart } from "@/components/charts/MilestoneChart";
import { Button } from "@/components/ui/button";
import { engagementTimeSeries, sliceEngagementData } from "@/data";
import {
  fetchStudents,
  fetchAdvisorNotes,
  insertAdvisorNote,
  fetchKpiSummary,
  fetchMilestoneCategorySummary,
  updateStudentStatus,
  markStudentCheckedIn,
  revertStudentCheckedIn,
} from "@/data/queries";
import { deriveStudent } from "@/lib/derive";
import { useStudentTable } from "@/hooks/useStudentTable";
import { useChartRange, type ChartRange } from "@/hooks/useChartRange";
import type {
  Student,
  KPIPeriodSnapshot,
  MilestoneCategoryCompletion,
  StudentStatus,
} from "@/types";
import { TIME_RANGES } from "@/lib/constants";

const zeroKpi: KPIPeriodSnapshot = {
  totalStudents: 0,
  averageEngagementScore: 0,
  milestoneCompletionRate: 0,
  studentsNeedingAttentionCount: 0,
};

function App() {
  const [studentData, setStudentData] = useState<Student[]>([]);
  const [kpiData, setKpiData] = useState<KPIPeriodSnapshot | null>(null);
  const [milestoneCatData, setMilestoneCatData] = useState<
    MilestoneCategoryCompletion[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<Error | null>(null);
  const [kpiVersion, setKpiVersion] = useState(0);
  const [actionError, setActionError] = useState<string | null>(null);
  const errorTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  function showActionError(msg: string) {
    if (errorTimerRef.current) clearTimeout(errorTimerRef.current);
    setActionError(msg);
    errorTimerRef.current = setTimeout(() => setActionError(null), 5000);
  }

  useEffect(() => () => { if (errorTimerRef.current) clearTimeout(errorTimerRef.current); }, []);

  useEffect(() => {
    let cancelled = false;
    async function loadData() {
      try {
        const [students, kpi, milestoneCats] = await Promise.all([
          fetchStudents(),
          fetchKpiSummary(),
          fetchMilestoneCategorySummary(),
        ]);
        if (cancelled) return;
        setStudentData(students);
        setKpiData(kpi);
        setMilestoneCatData(milestoneCats);
      } catch (e) {
        if (!cancelled)
          setLoadError(e instanceof Error ? e : new Error(String(e)));
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }
    loadData();
    return () => {
      cancelled = true;
    };
  }, []);

  const {
    filteredStudents,
    searchQuery,
    setSearchQuery,
    activeChips,
    setActiveChips,
  } = useStudentTable(studentData);

  // M8: single source of truth — derive selectedStudent from studentData
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(
    null,
  );
  const selectedStudent: Student | null =
    studentData.find((s) => s.id === selectedStudentId) ?? null;

  const { range, setRange, label: rangeLabel } = useChartRange();
  const engagementChartData = useMemo(
    () => sliceEngagementData(engagementTimeSeries, range),
    [range],
  );

  useEffect(() => {
    if (!selectedStudentId) return;
    let cancelled = false;
    fetchAdvisorNotes(selectedStudentId)
      .then((notes) => {
        if (cancelled) return;
        // Updating studentData is enough — selectedStudent is derived from it
        setStudentData((prev) =>
          prev.map((s) =>
            s.id === selectedStudentId ? { ...s, advisorNotes: notes } : s,
          ),
        );
      })
      .catch(() => {
        console.warn("Failed to fetch advisor notes for", selectedStudentId);
      });
    return () => {
      cancelled = true;
    };
  }, [selectedStudentId]);

  // Cancellable KPI refresh — triggered by incrementing kpiVersion after a write
  useEffect(() => {
    if (kpiVersion === 0) return;
    let cancelled = false;
    fetchKpiSummary()
      .then((kpi) => { if (!cancelled) setKpiData(kpi); })
      .catch(() => { /* best-effort */ });
    return () => { cancelled = true; };
  }, [kpiVersion]);

  async function handleAddNote(studentId: string, text: string) {
    try {
      const newNote = await insertAdvisorNote(studentId, text);
      setStudentData((prev) =>
        prev.map((s) =>
          s.id === studentId
            ? { ...s, advisorNotes: [newNote, ...s.advisorNotes] }
            : s,
        ),
      );
    } catch {
      showActionError("Couldn't save note. Please try again.");
    }
  }

  async function handleUpdateStatus(studentId: string, status: StudentStatus) {
    try {
      await updateStudentStatus(studentId, status);
      setStudentData((prev) =>
        prev.map((s) =>
          s.id === studentId ? deriveStudent({ ...s, status }) : s,
        ),
      );
      setKpiVersion((v) => v + 1);
    } catch {
      showActionError("Couldn't update status. Please try again.");
    }
  }

  // M1: return null on failure so callers can distinguish error from a real date
  async function handleCheckIn(studentId: string): Promise<string | null> {
    try {
      const today = await markStudentCheckedIn(studentId);
      setStudentData((prev) =>
        prev.map((s) =>
          s.id === studentId ? { ...s, lastContactedDate: today } : s,
        ),
      );
      return today;
    } catch {
      showActionError("Check-in failed. Please try again.");
      return null;
    }
  }

  async function handleUndoCheckIn(studentId: string, previousDate: string) {
    try {
      await revertStudentCheckedIn(studentId, previousDate);
      setStudentData((prev) =>
        prev.map((s) =>
          s.id === studentId ? { ...s, lastContactedDate: previousDate } : s,
        ),
      );
    } catch {
      showActionError("Couldn't undo check-in. Please try again.");
    }
  }

  if (loadError) throw loadError;

  if (isLoading) {
    return (
      <DashboardLayout>
        <p className="p-8 text-sm text-muted-foreground">Loading…</p>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      {actionError && (
        <div
          role="alert"
          className="mb-4 flex items-center gap-2 rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900"
        >
          <AlertCircle className="h-4 w-4 shrink-0 text-amber-500" aria-hidden="true" />
          <span className="flex-1">{actionError}</span>
          <button
            onClick={() => {
              if (errorTimerRef.current) clearTimeout(errorTimerRef.current);
              setActionError(null);
            }}
            className="ml-2 text-amber-500 hover:text-amber-700"
            aria-label="Dismiss error"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      )}
      <InsightsPanel students={studentData} />

      <section aria-label="Key performance indicators" className="mt-6">
        <div className="mb-6">
          <h2 className="text-2xl font-semibold">Dashboard Overview</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Track student engagement and career milestone progress
          </p>
        </div>
        <KPIGrid snapshot={{ current: kpiData ?? zeroKpi }} />
      </section>

      <section
        aria-label="Charts"
        className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2"
      >
        <div>
          <div className="mb-3 flex items-center justify-end">
            <div className="flex gap-1">
              {TIME_RANGES.map((r) => (
                <Button
                  key={r}
                  variant={r === range ? "default" : "outline"}
                  size="sm"
                  onClick={() => setRange(r as ChartRange)}
                >
                  {r}d
                </Button>
              ))}
            </div>
          </div>
          <EngagementChart data={engagementChartData} rangeLabel={rangeLabel} />
        </div>
        <MilestoneChart data={milestoneCatData} />
      </section>

      <section aria-label="Student overview" className="mt-8 space-y-4">
        <div>
          <h2 className="text-lg font-semibold">Student Overview</h2>
          <p className="text-sm text-muted-foreground">
            Monitor individual student progress
          </p>
        </div>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <FilterChips
            active={activeChips}
            onChange={setActiveChips}
            students={studentData}
          />
          <Input
            placeholder="Search students..."
            aria-label="Search students by name or career direction"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-xs"
          />
        </div>
        <StudentTable
          students={filteredStudents}
          onSelectStudent={(s) => setSelectedStudentId(s.id)}
        />
      </section>

      <StudentDetail
        student={selectedStudent}
        onClose={() => setSelectedStudentId(null)}
        onAddNote={handleAddNote}
        onUpdateStatus={handleUpdateStatus}
        onCheckIn={handleCheckIn}
        onUndoCheckIn={handleUndoCheckIn}
      />
    </DashboardLayout>
  );
}

export default App;
