export type MilestoneStatus = "Completed" | "In Progress" | "Pending";

export type EngagementTrend = "up" | "down" | "stable";

export type EngagementTier = "High" | "Medium" | "Low";

export type StudentStatus = "On Track" | "At Risk" | "Needs Attention";

export type CareerDirection =
  | "clear"
  | "exploring"
  | "uncertain"
  | "undeclared";

export type ActivityEventType =
  | "SurveyCompleted"
  | "JobPostingViewed"
  | "NetworkingEventAttended"
  | "MilestoneCompleted"
  | "ProfileUpdated"
  | "ResourceAccessed";

export type TrendDirection = "up" | "down" | "neutral";

export interface Milestone {
  id: string;
  label: string;
  status: MilestoneStatus;
  category: string;
  completedDate?: string;
}

export interface AdvisorNote {
  id: string;
  text: string;
  authorName: string;
  timestamp: string;
}

export interface ActivityEvent {
  id: string;
  description: string;
  timestamp: string;
  eventType: ActivityEventType;
}

export interface Student {
  id: string;
  name: string;
  email: string;
  major: string;
  graduationYear: number;
  careerDirection: CareerDirection;
  confidenceScore: number;
  engagementScore: number;
  engagementTrend: EngagementTrend;
  engagementTier: EngagementTier;
  lastActiveDate: string;
  lastContactedDate: string;
  status: StudentStatus;
  milestones: Milestone[];
  advisorNotes: AdvisorNote[];
  recentActivity: ActivityEvent[];
  flaggedForAttention: boolean;
}
