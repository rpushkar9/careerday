import type { Student } from "@/types";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
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

interface StudentDetailProps {
  student: Student | null;
  onClose: () => void;
  onAddNote: (studentId: string, text: string) => void;
}

function getReasonText(student: Student): string {
  if (student.status === "Needs Attention")
    return "Low engagement or milestone gaps";
  if (student.status === "At Risk") return "Engagement declining this period";
  return "Flagged for counselor attention";
}

function StudentDetailContent({
  student,
  onAddNote,
}: {
  student: Student;
  onAddNote: (studentId: string, text: string) => void;
}) {
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
        <button
          className="flex flex-col items-center gap-2 p-4 border border-border rounded-2xl hover:bg-secondary transition-colors"
          onClick={() => {}}
          aria-label="Email"
        >
          <Mail className="w-5 h-5 text-primary" />
          <span className="text-xs text-foreground">Email</span>
        </button>
        <button
          className="flex flex-col items-center gap-2 p-4 border border-border rounded-2xl hover:bg-secondary transition-colors"
          onClick={() => {}}
          aria-label="Call"
        >
          <Phone className="w-5 h-5 text-primary" />
          <span className="text-xs text-foreground">Call</span>
        </button>
        <button
          className="flex flex-col items-center gap-2 p-4 border border-border rounded-2xl hover:bg-secondary transition-colors"
          onClick={() => {}}
          aria-label="Message"
        >
          <MessageSquare className="w-5 h-5 text-primary" />
          <span className="text-xs text-foreground">Message</span>
        </button>
      </div>

      <div className="mt-6 space-y-6">
        {/* Support Reason Alert (conditional) */}
        {student.flaggedForAttention && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-amber-100">
                <AlertCircle className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-amber-900">
                  {student.status === "At Risk"
                    ? "At Risk"
                    : student.status === "Needs Attention"
                      ? "Needs Attention"
                      : "Flagged for Review"}
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

        {/* Career Narrative */}
        <section>
          <h3 className="mb-2 text-sm font-semibold">Career Narrative</h3>
          <div className="space-y-2 rounded-md border px-3 py-2 text-sm">
            <div>
              <p className="text-xs text-muted-foreground">Career Goal</p>
              <p className="mt-0.5">
                {student.careerDirection.charAt(0).toUpperCase() +
                  student.careerDirection.slice(1)}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Confidence Score</p>
              <div className="mt-1 flex items-center gap-1.5">
                {[1, 2, 3, 4, 5].map((level) => (
                  <div
                    key={level}
                    className={`h-2.5 w-2.5 rounded-full ${
                      level <= student.confidenceScore
                        ? "bg-primary"
                        : "bg-muted"
                    }`}
                  />
                ))}
                <span className="ml-1 text-xs text-muted-foreground">
                  {student.confidenceScore}/5
                </span>
              </div>
            </div>
          </div>
        </section>

        <section>
          <h3 className="mb-2 text-sm font-semibold">Advisor Notes</h3>
          <AdvisorNotes
            notes={student.advisorNotes}
            onAddNote={(text) => onAddNote(student.id, text)}
          />
        </section>

        <section>
          <h3 className="mb-2 text-sm font-semibold">Milestones</h3>
          <MilestoneList milestones={student.milestones} />
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
          <StudentDetailContent student={student} onAddNote={onAddNote} />
        )}
      </SheetContent>
    </Sheet>
  );
}
