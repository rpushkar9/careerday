import { useState } from "react";
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
  kpiSnapshot,
  students as initialStudents,
  engagementTimeSeries,
  milestoneCategoryData,
  sliceEngagementData,
} from "@/data";
import { useStudentTable } from "@/hooks/useStudentTable";
import { useChartRange, type ChartRange } from "@/hooks/useChartRange";
import type { Student, AdvisorNote } from "@/types";
import { TIME_RANGES } from "@/lib/constants";

function App() {
  const [studentData, setStudentData] = useState<Student[]>(initialStudents);

  const {
    filteredStudents,
    searchQuery,
    setSearchQuery,
    activeChips,
    setActiveChips,
  } = useStudentTable(studentData);

  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const { range, setRange, label: rangeLabel } = useChartRange();

  function handleAddNote(studentId: string, text: string) {
    const newNote: AdvisorNote = {
      id: `note-${Date.now()}`,
      text,
      authorName: "Counselor",
      timestamp: new Date().toISOString(),
    };

    setStudentData((prev) =>
      prev.map((s) =>
        s.id === studentId
          ? { ...s, advisorNotes: [newNote, ...s.advisorNotes] }
          : s,
      ),
    );

    // Also update selectedStudent so the drawer reflects the new note
    setSelectedStudent((prev) =>
      prev && prev.id === studentId
        ? { ...prev, advisorNotes: [newNote, ...prev.advisorNotes] }
        : prev,
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
        <KPIGrid snapshot={kpiSnapshot} />
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
        <MilestoneChart data={milestoneCategoryData} />
      </section>

      <StudentDetail
        student={selectedStudent}
        onClose={() => setSelectedStudent(null)}
        onAddNote={handleAddNote}
      />
    </DashboardLayout>
  );
}

export default App;
