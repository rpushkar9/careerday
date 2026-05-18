import type { ActivityEvent, ActivityEventType, Milestone } from "@/types";
import { EmptyState } from "@/components/shared/EmptyState";
import {
  ClipboardCheck,
  Briefcase,
  Users,
  CheckCircle2,
  UserCircle,
  BookOpen,
} from "lucide-react";

interface ActivityFeedProps {
  activity: ActivityEvent[];
  milestones?: Milestone[];
}

function eventIcon(type: ActivityEventType) {
  switch (type) {
    case "SurveyCompleted":
      return <ClipboardCheck className="w-3.5 h-3.5" />;
    case "JobPostingViewed":
      return <Briefcase className="w-3.5 h-3.5" />;
    case "NetworkingEventAttended":
      return <Users className="w-3.5 h-3.5" />;
    case "MilestoneCompleted":
      return <CheckCircle2 className="w-3.5 h-3.5 text-green-600" />;
    case "ProfileUpdated":
      return <UserCircle className="w-3.5 h-3.5" />;
    case "ResourceAccessed":
      return <BookOpen className="w-3.5 h-3.5" />;
  }
}

function milestoneEvents(milestones: Milestone[]): ActivityEvent[] {
  return milestones
    .filter((m) => m.status === "Completed" && m.completedDate)
    .map((m) => ({
      id: `milestone-${m.id}`,
      description: `Completed milestone: ${m.label} (${m.category})`,
      timestamp: m.completedDate!,
      eventType: "MilestoneCompleted" as ActivityEventType,
    }));
}

export function ActivityFeed({ activity, milestones = [] }: ActivityFeedProps) {
  const derived = milestoneEvents(milestones);
  const seenIds = new Set<string>();
  const all = [...activity, ...derived]
    .filter((e) => {
      if (seenIds.has(e.id)) return false;
      seenIds.add(e.id);
      return true;
    })
    .sort((a, b) => Date.parse(b.timestamp) - Date.parse(a.timestamp));

  if (all.length === 0) {
    return <EmptyState message="No recent activity" />;
  }

  return (
    <ul className="space-y-2">
      {all.map((event) => (
        <li key={event.id} className="flex items-start gap-3 text-sm">
          <span className="mt-0.5 shrink-0 text-muted-foreground">
            {eventIcon(event.eventType)}
          </span>
          <time
            className="shrink-0 text-muted-foreground"
            dateTime={event.timestamp}
          >
            {new Date(event.timestamp).toLocaleDateString(undefined, {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
          </time>
          <span>{event.description}</span>
        </li>
      ))}
    </ul>
  );
}
