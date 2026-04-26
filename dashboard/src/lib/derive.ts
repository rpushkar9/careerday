import { ENGAGEMENT_THRESHOLDS } from "@/lib/constants";
import type { Student, EngagementTier } from "@/types/student";

export type RawStudent = Omit<
  Student,
  "engagementTier" | "flaggedForAttention"
>;

export function deriveEngagementTier(score: number): EngagementTier {
  if (score >= ENGAGEMENT_THRESHOLDS.HIGH) return "High";
  if (score >= ENGAGEMENT_THRESHOLDS.MEDIUM) return "Medium";
  return "Low";
}

export function deriveStudent(raw: RawStudent): Student {
  const engagementTier = deriveEngagementTier(raw.engagementScore);
  return {
    ...raw,
    engagementTier,
    // flaggedForAttention drives the filter chip ("Low Engagement" + "Needs Attention").
    // The drawer alert banner uses student.status directly so counselor overrides always
    // take effect regardless of engagement tier. The two are intentionally decoupled.
    flaggedForAttention:
      raw.status === "Needs Attention" || engagementTier === "Low",
  };
}
