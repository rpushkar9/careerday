import { z } from "zod";

export const MilestoneStatusSchema = z.enum([
  "Completed",
  "In Progress",
  "Pending",
]);
export const EngagementTierSchema = z.enum(["High", "Medium", "Low"]);
export const StudentStatusSchema = z.enum([
  "On Track",
  "At Risk",
  "Needs Attention",
]);
export const EngagementTrendSchema = z.enum(["up", "down", "stable"]);

export const CareerDirectionSchema = z.enum([
  "clear",
  "exploring",
  "uncertain",
  "undeclared",
]);
export const ActivityEventTypeSchema = z.enum([
  "SurveyCompleted",
  "JobPostingViewed",
  "NetworkingEventAttended",
  "MilestoneCompleted",
  "ProfileUpdated",
  "ResourceAccessed",
]);

export const MilestoneSchema = z.object({
  id: z.string(),
  label: z.string().min(1),
  status: MilestoneStatusSchema,
  category: z.string().min(1),
  completedDate: z.string().optional(),
});

export const AdvisorNoteSchema = z.object({
  id: z.string(),
  text: z.string().min(1),
  authorName: z.string().min(1),
  timestamp: z.string().datetime(),
});

export const ActivityEventSchema = z.object({
  id: z.string(),
  description: z.string().min(1),
  timestamp: z.string().datetime(),
  eventType: ActivityEventTypeSchema,
});

export const RawStudentSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  email: z.string().email(),
  major: z.string().min(1),
  graduationYear: z.number().int().min(2025).max(2030),
  careerDirection: CareerDirectionSchema,
  confidenceScore: z.number().int().min(1).max(5),
  engagementScore: z.number().min(0).max(100),
  engagementTrend: EngagementTrendSchema,
  lastActiveDate: z.string(),
  lastContactedDate: z.string(),
  status: StudentStatusSchema,
  milestones: z.array(MilestoneSchema),
  advisorNotes: z.array(AdvisorNoteSchema),
  recentActivity: z.array(ActivityEventSchema),
});
