import { useState, useRef, useEffect } from "react";
import type { Student, StudentStatus } from "@/types";
import { idToAvatar } from "@/lib/initials";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { AdvisorNotes } from "./AdvisorNotes";
import { MilestoneList } from "./MilestoneList";
import { ActivityFeed } from "./ActivityFeed";
import {
  Mail,
  AlertCircle,
  TrendingUp,
  Target,
  Calendar,
} from "lucide-react";
import { STUDENT_STATUSES } from "@/lib/constants";
import type { CareerDirection } from "@/types";

const DIRECTION_LABELS: Record<
  CareerDirection,
  { label: string; description: string }
> = {
  clear: {
    label: "Clear direction",
    description:
      "Student has identified a specific career path and is actively working toward it.",
  },
  exploring: {
    label: "Actively exploring",
    description:
      "Considering multiple options and gathering information before committing to a path.",
  },
  uncertain: {
    label: "Feeling uncertain",
    description:
      "Not yet sure what direction to take — may benefit from additional career exploration support.",
  },
  undeclared: {
    label: "Undeclared",
    description:
      "No career direction identified yet. Common for first-year students or those in transition.",
  },
};

const CONFIDENCE_LABELS: Record<number, string> = {
  1: "Very uncertain",
  2: "Somewhat uncertain",
  3: "Neutral",
  4: "Fairly confident",
  5: "Very confident",
};

interface StudentDetailProps {
  student: Student | null;
  onClose: () => void;
  onAddNote: (studentId: string, text: string) => void;
  onAddMilestone: (studentId: string, label: string, category: string) => void;
  onDeleteMilestone: (studentId: string, milestoneId: string) => void;
  onUpdateStatus: (studentId: string, status: StudentStatus) => void;
  onCheckIn: (studentId: string) => Promise<string | null>;
  onUndoCheckIn: (studentId: string, previousDate: string) => void;
}

function getReasonText(student: Student): string {
  if (student.status === "Needs Attention")
    return "Low engagement or milestone gaps";
  return "Engagement declining this period";
}

function StudentDetailContent({
  student,
  onAddNote,
  onAddMilestone,
  onDeleteMilestone,
  onUpdateStatus,
  onCheckIn,
  onUndoCheckIn,
}: {
  student: Student;
  onAddNote: (studentId: string, text: string) => void;
  onAddMilestone: (studentId: string, label: string, category: string) => void;
  onDeleteMilestone: (studentId: string, milestoneId: string) => void;
  onUpdateStatus: (studentId: string, status: StudentStatus) => void;
  onCheckIn: (studentId: string) => Promise<string | null>;
  onUndoCheckIn: (studentId: string, previousDate: string) => void;
}) {
  const UNDO_SECONDS = 8;
  const [checkingIn, setCheckingIn] = useState(false);
  const [undoDate, setUndoDate] = useState<string | null>(null);
  const [undoSecondsLeft, setUndoSecondsLeft] = useState<number>(UNDO_SECONDS);
  const undoTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const undoIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (undoDate) {
      setUndoSecondsLeft(UNDO_SECONDS);
      undoIntervalRef.current = setInterval(() => {
        setUndoSecondsLeft((s) => Math.max(0, s - 1));
      }, 1000);
    } else {
      if (undoIntervalRef.current) clearInterval(undoIntervalRef.current);
    }
    return () => {
      if (undoIntervalRef.current) clearInterval(undoIntervalRef.current);
    };
  }, [undoDate]);

  useEffect(
    () => () => {
      if (undoTimerRef.current) clearTimeout(undoTimerRef.current);
      if (undoIntervalRef.current) clearInterval(undoIntervalRef.current);
    },
    [],
  );

  const avatar = idToAvatar(student.id);
  const completed = student.milestones.filter(
    (m) => m.status === "Completed",
  ).length;
  const total = student.milestones.length;
  const lastActive = new Date(student.lastActiveDate).toLocaleDateString(
    undefined,
    { month: "short", day: "numeric" },
  );

  return (
    <>
      {/* Visually-hidden sheet header for accessibility */}
      <SheetHeader className="sr-only">
        <SheetTitle>{student.id}</SheetTitle>
        <SheetDescription>
          {student.major}{student.college ? ` · ${student.college}` : ""} · Class of {student.graduationYear}
        </SheetDescription>
      </SheetHeader>

      {/* Avatar + ID header */}
      <div className="mb-6 flex items-center gap-4">
        <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
          <span className="text-primary-foreground text-xl font-medium font-mono">
            {avatar}
          </span>
        </div>
        <div className="flex-1">
          <h2 className="text-lg font-semibold font-mono">{student.id}</h2>
          <p className="text-sm text-muted-foreground">
            {student.major}{student.college ? ` · ${student.college}` : ""} · Class of {student.graduationYear}
          </p>
          <a
            href={`mailto:${student.email}`}
            aria-label={`Email ${student.id}`}
            className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors mt-0.5"
          >
            <Mail className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
            {student.email}
          </a>
        </div>
      </div>

      <div className="mt-2 space-y-6">
        {/* Support Reason Alert (conditional) */}
        {student.status !== "On Track" && (
          <div
            role="status"
            className="bg-amber-50 border border-amber-200 rounded-2xl p-4"
          >
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-amber-100">
                <AlertCircle className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-amber-900">
                  {student.status}
                </h3>
                <p className="text-sm text-amber-700">
                  {getReasonText(student)}
                </p>
                <p className="text-xs text-amber-600 mt-1">
                  Consider scheduling a check-in.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Metrics Mini-Grid */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-secondary/50 border border-border rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-primary" />
              <span className="text-xs text-muted-foreground">Engagement</span>
            </div>
            <p className="text-xl font-semibold text-foreground">
              {student.engagementScore}%
            </p>
          </div>
          <div className="bg-secondary/50 border border-border rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Target className="w-4 h-4 text-primary" />
              <span className="text-xs text-muted-foreground">Milestones</span>
            </div>
            <p className="text-xl font-semibold text-foreground">
              {completed}/{total}
            </p>
          </div>
          <div className="bg-secondary/50 border border-border rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="w-4 h-4 text-primary" />
              <span className="text-xs text-muted-foreground">Last Active</span>
            </div>
            <p className="text-sm font-medium text-foreground">{lastActive}</p>
          </div>
        </div>

        {/* Follow-up */}
        <section>
          <h3 className="mb-2 text-sm font-semibold">Follow-up</h3>
          <div className="space-y-3 rounded-md border px-3 py-3">
            <div className="flex items-center justify-between gap-4">
              <span className="text-xs text-muted-foreground whitespace-nowrap">
                Status
              </span>
              <Select
                value={student.status}
                onValueChange={(val) => {
                  if ((STUDENT_STATUSES as readonly string[]).includes(val))
                    onUpdateStatus(student.id, val as StudentStatus);
                }}
              >
                <SelectTrigger className="h-8 w-44 text-xs border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {STUDENT_STATUSES.map((s) => (
                    <SelectItem key={s} value={s} className="text-xs">
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs text-muted-foreground">Last checked in</p>
                <p className="text-sm font-medium">
                  {new Date(student.lastContactedDate).toLocaleDateString(
                    undefined,
                    { month: "short", day: "numeric", year: "numeric" },
                  )}
                </p>
              </div>
              {undoDate ? (
                <div className="flex flex-col items-end gap-1">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-muted-foreground h-7 px-2"
                    onClick={() => {
                      if (undoTimerRef.current)
                        clearTimeout(undoTimerRef.current);
                      onUndoCheckIn(student.id, undoDate);
                      setUndoDate(null);
                    }}
                  >
                    Undo ({undoSecondsLeft}s)
                  </Button>
                  <div className="w-20 h-0.5 rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full bg-muted-foreground/50 transition-all duration-1000 ease-linear"
                      style={{
                        width: `${(undoSecondsLeft / UNDO_SECONDS) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              ) : (
                <Button
                  size="sm"
                  variant="outline"
                  className="border-border"
                  disabled={checkingIn}
                  onClick={async () => {
                    const prev = student.lastContactedDate;
                    setCheckingIn(true);
                    try {
                      const newDate = await onCheckIn(student.id);
                      if (newDate) {
                        setUndoDate(prev);
                        if (undoTimerRef.current)
                          clearTimeout(undoTimerRef.current);
                        undoTimerRef.current = setTimeout(
                          () => setUndoDate(null),
                          8000,
                        );
                      }
                    } finally {
                      setCheckingIn(false);
                    }
                  }}
                >
                  Check in
                </Button>
              )}
            </div>
          </div>
        </section>

        {/* Career Narrative */}
        <section>
          <h3 className="mb-2 text-sm font-semibold">Career Narrative</h3>
          <div className="space-y-3 rounded-md border px-3 py-3 text-sm">
            <div>
              <p className="text-xs text-muted-foreground mb-1">
                Career Direction
              </p>
              <p className="font-medium">
                {DIRECTION_LABELS[student.careerDirection].label}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {DIRECTION_LABELS[student.careerDirection].description}
              </p>
            </div>
            {student.confidenceScore != null && (
              <div className="border-t pt-3">
                <p className="text-xs text-muted-foreground mb-1">
                  Self-reported confidence in career direction
                </p>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((level) => (
                      <div
                        key={level}
                        className={`h-2.5 w-2.5 rounded-full ${
                          level <= student.confidenceScore!
                            ? "bg-primary"
                            : "bg-muted"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm font-medium">
                    {CONFIDENCE_LABELS[student.confidenceScore] ?? "—"}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    ({student.confidenceScore}/5)
                  </span>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Pilot Data: academic + attendance metrics */}
        {(student.gpa != null || student.attendanceRate != null || student.college || student.classYear || student.age != null || student.enrollmentStatus) && (
          <section>
            <h3 className="mb-2 text-sm font-semibold">Academic Profile</h3>
            <div className="grid grid-cols-2 gap-3 text-sm">
              {student.college && (
                <div className="rounded-md border px-3 py-2">
                  <p className="text-xs text-muted-foreground">College</p>
                  <p className="font-medium">{student.college}</p>
                </div>
              )}
              {student.classYear && (
                <div className="rounded-md border px-3 py-2">
                  <p className="text-xs text-muted-foreground">Class Year</p>
                  <p className="font-medium">{student.classYear}</p>
                </div>
              )}
              {student.age != null && (
                <div className="rounded-md border px-3 py-2">
                  <p className="text-xs text-muted-foreground">Age</p>
                  <p className="font-medium">{student.age}</p>
                </div>
              )}
              {student.gpa != null && (
                <div className="rounded-md border px-3 py-2">
                  <p className="text-xs text-muted-foreground">GPA</p>
                  <p className="font-medium">{(Math.min(student.gpa, 1) * 4).toFixed(2)} / 4.0</p>
                </div>
              )}
              {student.attendanceRate != null && (
                <div className="rounded-md border px-3 py-2">
                  <p className="text-xs text-muted-foreground">Attendance Rate</p>
                  <p className="font-medium">{(student.attendanceRate * 100).toFixed(0)}%</p>
                </div>
              )}
              {student.enrollmentStatus && (
                <div className="rounded-md border px-3 py-2">
                  <p className="text-xs text-muted-foreground">Enrollment</p>
                  <p className="font-medium">{student.enrollmentStatus}</p>
                </div>
              )}
            </div>
          </section>
        )}

        <section>
          <h3 className="mb-2 text-sm font-semibold">Milestones</h3>
          <MilestoneList
            milestones={student.milestones}
            onAddMilestone={(label, category) =>
              onAddMilestone(student.id, label, category)
            }
            onDeleteMilestone={(milestoneId) =>
              onDeleteMilestone(student.id, milestoneId)
            }
          />
        </section>

        <section>
          <h3 className="mb-2 text-sm font-semibold">Advisor Notes</h3>
          <AdvisorNotes
            notes={student.advisorNotes}
            onAddNote={(text) => onAddNote(student.id, text)}
          />
        </section>

        <section>
          <h3 className="mb-2 text-sm font-semibold">Recent Activity</h3>
          <ActivityFeed activity={student.recentActivity} milestones={student.milestones} />
        </section>
      </div>
    </>
  );
}

export function StudentDetail({
  student,
  onClose,
  onAddNote,
  onAddMilestone,
  onDeleteMilestone,
  onUpdateStatus,
  onCheckIn,
  onUndoCheckIn,
}: StudentDetailProps) {
  return (
    <Sheet
      open={student !== null}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <SheetContent className="overflow-y-auto sm:max-w-[600px]">
        {student && (
          <StudentDetailContent
            student={student}
            onAddNote={onAddNote}
            onAddMilestone={onAddMilestone}
            onDeleteMilestone={onDeleteMilestone}
            onUpdateStatus={onUpdateStatus}
            onCheckIn={onCheckIn}
            onUndoCheckIn={onUndoCheckIn}
          />
        )}
      </SheetContent>
    </Sheet>
  );
}
