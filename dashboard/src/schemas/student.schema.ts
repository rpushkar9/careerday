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
  timestamp: z.string().datetime({ offset: true }),
});

export const ActivityEventSchema = z.object({
  id: z.string(),
  description: z.string().min(1),
  timestamp: z.string().datetime({ offset: true }),
  eventType: ActivityEventTypeSchema,
});

// ── DB row schemas (snake_case, mirrors Supabase table columns) ──────────────

export const ActivityRowSchema = z.object({
  id: z.string(),
  description: z.string(),
  event_type: ActivityEventTypeSchema,
  timestamp: z.string(),
});

export const MilestoneRowSchema = z.object({
  id: z.string(),
  label: z.string(),
  status: MilestoneStatusSchema,
  category: z.string(),
  completed_date: z.string().nullable().optional(),
});

export const EngagementCategorySchema = z.enum(["Red", "Yellow", "Green"]);

export const StudentRowSchema = z.object({
  id: z.string(),
  name: z.string().nullable().optional(),
  email: z.string().min(3),
  major: z.string(),
  graduation_year: z.number(),
  career_direction: CareerDirectionSchema,
  confidence_score: z.number().nullable().optional(),
  engagement_score: z.union([z.number(), z.string()]),
  engagement_trend: EngagementTrendSchema.nullable().optional(),
  last_active_date: z.string(),
  last_contacted_date: z.string(),
  status: StudentStatusSchema,
  milestones: z.array(MilestoneRowSchema).nullable(),
  recent_activity: z.array(ActivityRowSchema).nullable(),
  // Pilot data columns
  age: z.number().nullable().optional(),
  gpa: z.union([z.number(), z.string()]).nullable().optional(),
  attendance_rate: z.union([z.number(), z.string()]).nullable().optional(),
  college: z.string().nullable().optional(),
  class_year: z.string().nullable().optional(),
  enrollment_status: z.string().nullable().optional(),
  engagement_category: EngagementCategorySchema.nullable().optional(),
});

export const AdvisorNoteRowSchema = z.object({
  id: z.string(),
  text: z.string(),
  author_name: z.string(),
  created_at: z.string(),
});

// ── App-level schemas (camelCase) ────────────────────────────────────────────

export const RawStudentSchema = z.object({
  id: z.string(),
  name: z.string().nullable().optional(),
  email: z.string().min(3),
  major: z.string().min(1),
  graduationYear: z.number().int().min(2025).max(2035),
  careerDirection: CareerDirectionSchema,
  confidenceScore: z.number().int().min(1).max(5).nullable().optional(),
  engagementScore: z.number().min(0).max(100),
  engagementTrend: EngagementTrendSchema.nullable().optional(),
  lastActiveDate: z.string(),
  lastContactedDate: z.string(),
  status: StudentStatusSchema,
  milestones: z.array(MilestoneSchema),
  advisorNotes: z.array(AdvisorNoteSchema),
  recentActivity: z.array(ActivityEventSchema),
  // Pilot data fields
  age: z.number().nullable().optional(),
  gpa: z.number().nullable().optional(),
  attendanceRate: z.number().nullable().optional(),
  college: z.string().nullable().optional(),
  classYear: z.string().nullable().optional(),
  enrollmentStatus: z.string().nullable().optional(),
  engagementCategory: EngagementCategorySchema.nullable().optional(),
});
