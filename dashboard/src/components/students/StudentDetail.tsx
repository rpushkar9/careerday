import { useState, useRef, useEffect } from "react";
import type { Student, StudentStatus } from "@/types";
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
  Phone,
  MessageSquare,
  AlertCircle,
  TrendingUp,
  Target,
  Calendar,
} from "lucide-react";
import { STUDENT_STATUSES } from "@/lib/constants";
import type { CareerDirection } from "@/types";

const DIRECTION_LABELS: Record<CareerDirection, { label: string; description: string }> = {
  clear:      { label: "Clear direction",    description: "Student has identified a specific career path and is actively working toward it." },
  exploring:  { label: "Actively exploring", description: "Considering multiple options and gathering information before committing to a path." },
  uncertain:  { label: "Feeling uncertain",  description: "Not yet sure what direction to take — may benefit from additional career exploration support." },
  undeclared: { label: "Undeclared",         description: "No career direction identified yet. Common for first-year students or those in transition." },
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
  onUpdateStatus: (studentId: string, status: StudentStatus) => void;
  onCheckIn: (studentId: string) => Promise<string>;
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
  onUpdateStatus,
  onCheckIn,
  onUndoCheckIn,
}: {
  student: Student;
  onAddNote: (studentId: string, text: string) => void;
  onUpdateStatus: (studentId: string, status: StudentStatus) => void;
  onCheckIn: (studentId: string) => Promise<string>;
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

  useEffect(() => () => {
    if (undoTimerRef.current) clearTimeout(undoTimerRef.current);
    if (undoIntervalRef.current) clearInterval(undoIntervalRef.current);
  }, []);

  const initials = student.name
    .split(" ")
    .map((n) => n[0])
    .join("");
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
        <SheetTitle>{student.name}</SheetTitle>
        <SheetDescription>
          {student.major} · Class of {student.graduationYear}
        </SheetDescription>
      </SheetHeader>

      {/* Avatar + name header */}
      <div className="mb-4 flex items-center gap-4">
        <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
          <span className="text-primary-foreground text-xl font-medium">
            {initials}
          </span>
        </div>
        <div>
          <h2 className="text-lg font-semibold">{student.name}</h2>
          <p className="text-sm text-muted-foreground">
            {student.major} · Class of {student.graduationYear}
          </p>
        </div>
      </div>

      {/* Quick Action Buttons */}
      <div className="grid grid-cols-3 gap-3">
        <a
          href={`mailto:${student.email}`}
          className="flex flex-col items-center gap-2 p-4 border border-border rounded-2xl hover:bg-secondary transition-colors"
          aria-label={`Email ${student.name}`}
        >
          <Mail className="w-5 h-5 text-primary" />
          <span className="text-xs text-foreground">Email</span>
        </a>
        <a
          href={`mailto:${student.email}?subject=Meeting+request`}
          className="flex flex-col items-center gap-2 p-4 border border-border rounded-2xl hover:bg-secondary transition-colors"
          aria-label={`Schedule meeting with ${student.name}`}
        >
          <Phone className="w-5 h-5 text-primary" />
          <span className="text-xs text-foreground">Schedule</span>
        </a>
        <a
          href={`mailto:${student.email}`}
          className="flex flex-col items-center gap-2 p-4 border border-border rounded-2xl hover:bg-secondary transition-colors"
          aria-label={`Message ${student.name}`}
        >
          <MessageSquare className="w-5 h-5 text-primary" />
          <span className="text-xs text-foreground">Message</span>
        </a>
      </div>

      <div className="mt-6 space-y-6">
        {/* Support Reason Alert (conditional) */}
        {student.status !== "On Track" && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
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
              <span className="text-xs text-muted-foreground whitespace-nowrap">Status</span>
              <Select
                value={student.status}
                onValueChange={(val) => {
                  if ((STUDENT_STATUSES as readonly string[]).includes(val))
                    onUpdateStatus(student.id, val as StudentStatus);
                }}
              >
                <SelectTrigger className="h-8 w-44 text-xs">
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
                      onUndoCheckIn(student.id, undoDate);
                      setUndoDate(null);
                    }}
                  >
                    Undo ({undoSecondsLeft}s)
                  </Button>
                  <div className="w-20 h-0.5 rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full bg-muted-foreground/50 transition-all duration-1000 ease-linear"
                      style={{ width: `${(undoSecondsLeft / UNDO_SECONDS) * 100}%` }}
                    />
                  </div>
                </div>
              ) : (
                <Button
                  size="sm"
                  variant="outline"
                  disabled={checkingIn}
                  onClick={async () => {
                    const prev = student.lastContactedDate;
                    setCheckingIn(true);
                    try {
                      const newDate = await onCheckIn(student.id);
                      if (newDate) {
                        setUndoDate(prev);
                        if (undoTimerRef.current) clearTimeout(undoTimerRef.current);
                        undoTimerRef.current = setTimeout(() => setUndoDate(null), 8000);
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
              <p className="text-xs text-muted-foreground mb-1">Career Direction</p>
              <p className="font-medium">{DIRECTION_LABELS[student.careerDirection].label}</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {DIRECTION_LABELS[student.careerDirection].description}
              </p>
            </div>
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
                        level <= student.confidenceScore ? "bg-primary" : "bg-muted"
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
          </div>
        </section>

        <section>
          <h3 className="mb-2 text-sm font-semibold">Milestones</h3>
          <MilestoneList milestones={student.milestones} />
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
          <ActivityFeed activity={student.recentActivity} />
        </section>
      </div>
    </>
  );
}

export function StudentDetail({
  student,
  onClose,
  onAddNote,
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
            onUpdateStatus={onUpdateStatus}
            onCheckIn={onCheckIn}
            onUndoCheckIn={onUndoCheckIn}
          />
        )}
      </SheetContent>
    </Sheet>
  );
}
