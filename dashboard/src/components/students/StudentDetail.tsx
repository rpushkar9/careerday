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

interface StudentDetailProps {
  student: Student | null;
  onClose: () => void;
  onAddNote: (studentId: string, text: string) => void;
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
      <SheetContent className="overflow-y-auto sm:max-w-lg">
        {student && (
          <>
            <SheetHeader>
              <SheetTitle>{student.name}</SheetTitle>
              <SheetDescription>
                Career Direction:{" "}
                {student.careerDirection.charAt(0).toUpperCase() +
                  student.careerDirection.slice(1)}
                {" | "}Confidence: {student.confidenceScore} / 5
              </SheetDescription>
            </SheetHeader>

            <div className="mt-6 space-y-6">
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
        )}
      </SheetContent>
    </Sheet>
  );
}
