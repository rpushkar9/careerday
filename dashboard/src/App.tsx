import { useState, useEffect } from "react";
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
import {
  engagementTimeSeries,
  sliceEngagementData,
} from "@/data";
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
import type { Student, KPIPeriodSnapshot, MilestoneCategoryCompletion, StudentStatus } from "@/types";
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
  const [milestoneCatData, setMilestoneCatData] = useState<MilestoneCategoryCompletion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<Error | null>(null);

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
        if (!cancelled) setLoadError(e instanceof Error ? e : new Error(String(e)));
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }
    loadData();
    return () => { cancelled = true; };
  }, []);

  const {
    filteredStudents,
    searchQuery,
    setSearchQuery,
    activeChips,
    setActiveChips,
  } = useStudentTable(studentData);

  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const selectedStudentId = selectedStudent?.id;
  const { range, setRange, label: rangeLabel } = useChartRange();

  useEffect(() => {
    if (!selectedStudentId) return;
    let cancelled = false;
    fetchAdvisorNotes(selectedStudentId)
      .then((notes) => {
        if (cancelled) return;
        setStudentData((prev) =>
          prev.map((s) => (s.id === selectedStudentId ? { ...s, advisorNotes: notes } : s))
        );
        setSelectedStudent((prev) =>
          prev?.id === selectedStudentId ? { ...prev, advisorNotes: notes } : prev
        );
      })
      .catch(() => {
        // Notes fetch failed silently — drawer shows previously loaded notes (or empty state)
      });
    return () => { cancelled = true; };
  }, [selectedStudentId]);

  async function handleAddNote(studentId: string, text: string) {
    try {
      const newNote = await insertAdvisorNote(studentId, text);
      setStudentData((prev) =>
        prev.map((s) =>
          s.id === studentId ? { ...s, advisorNotes: [newNote, ...s.advisorNotes] } : s
        )
      );
      setSelectedStudent((prev) =>
        prev?.id === studentId ? { ...prev, advisorNotes: [newNote, ...prev.advisorNotes] } : prev
      );
    } catch {
      // Per spec: on insert failure, note is not added and no success signal is shown
    }
  }

  async function handleUpdateStatus(studentId: string, status: StudentStatus) {
    try {
      await updateStudentStatus(studentId, status);
      setStudentData((prev) =>
        prev.map((s) => (s.id === studentId ? deriveStudent({ ...s, status }) : s))
      );
      setSelectedStudent((prev) =>
        prev?.id === studentId ? deriveStudent({ ...prev, status }) : prev
      );
      // Re-fetch KPI so "Students Needing Attention" count reflects the change
      fetchKpiSummary().then(setKpiData).catch(() => {});
    } catch {
      // Silent — same pattern as handleAddNote
    }
  }

  async function handleCheckIn(studentId: string): Promise<string> {
    try {
      const today = await markStudentCheckedIn(studentId);
      setStudentData((prev) =>
        prev.map((s) => (s.id === studentId ? { ...s, lastContactedDate: today } : s))
      );
      setSelectedStudent((prev) =>
        prev?.id === studentId ? { ...prev, lastContactedDate: today } : prev
      );
      return today;
    } catch {
      return "";
    }
  }

  async function handleUndoCheckIn(studentId: string, previousDate: string) {
    try {
      await revertStudentCheckedIn(studentId, previousDate);
      setStudentData((prev) =>
        prev.map((s) =>
          s.id === studentId ? { ...s, lastContactedDate: previousDate } : s
        )
      );
      setSelectedStudent((prev) =>
        prev?.id === studentId ? { ...prev, lastContactedDate: previousDate } : prev
      );
    } catch {
      // Silent
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
          <EngagementChart
            data={sliceEngagementData(engagementTimeSeries, range)}
            rangeLabel={rangeLabel}
          />
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
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-xs"
          />
        </div>
        <StudentTable
          students={filteredStudents}
          onSelectStudent={setSelectedStudent}
        />
      </section>

      <StudentDetail
        student={selectedStudent}
        onClose={() => setSelectedStudent(null)}
        onAddNote={handleAddNote}
        onUpdateStatus={handleUpdateStatus}
        onCheckIn={handleCheckIn}
        onUndoCheckIn={handleUndoCheckIn}
      />
    </DashboardLayout>
  );
}

export default App;
