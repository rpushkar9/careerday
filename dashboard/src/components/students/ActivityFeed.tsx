import type { ActivityEvent } from "@/types";
import { EmptyState } from "@/components/shared/EmptyState";

interface ActivityFeedProps {
  activity: ActivityEvent[];
}

export function ActivityFeed({ activity }: ActivityFeedProps) {
  if (activity.length === 0) {
    return <EmptyState message="No recent activity" />;
  }

  return (
    <ul className="space-y-2">
      {activity.map((event) => (
        <li key={event.id} className="flex items-start gap-3 text-sm">
          <time
            className="shrink-0 text-muted-foreground"
            dateTime={event.timestamp}
          >
            {new Date(event.timestamp).toLocaleDateString()}
          </time>
          <span>{event.description}</span>
        </li>
      ))}
    </ul>
  );
}
