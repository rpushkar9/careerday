#!/usr/bin/env node
/**
 * Demo seed: inserts advisor notes and recent activity for all 30 students.
 * Leaves students and milestones untouched — run seed-supabase.mjs first.
 *
 * Idempotent via TRUNCATE: running this wipes any notes added through the UI
 * and re-inserts the demo set. Intentional — this is a demo reset tool.
 *
 * Usage:
 *   SUPABASE_URL=https://xxx.supabase.co \
 *   SUPABASE_ANON_KEY=eyJ... \
 *   node scripts/seed-demo-content.mjs
 */

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error('Missing env vars: SUPABASE_URL and SUPABASE_ANON_KEY are required');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// advisor_notes: id omitted — Postgres generates UUID via DEFAULT gen_random_uuid()
const notes = [
  { student_id: "s-001", text: "Very motivated. Interested in biomedical engineering programs.", author_name: "Dr. Martinez", created_at: "2026-04-05T10:30:00Z" },
  { student_id: "s-001", text: "Completed all assessment milestones ahead of schedule.", author_name: "Dr. Martinez", created_at: "2026-03-15T14:00:00Z" },
  { student_id: "s-002", text: "Exploring both CS and design. Suggested UX research as potential bridge.", author_name: "Dr. Martinez", created_at: "2026-04-01T09:00:00Z" },
  { student_id: "s-003", text: "Strong candidate for pre-med track. Recommend she apply to summer research programs.", author_name: "Ms. Thompson", created_at: "2026-04-03T11:00:00Z" },
  { student_id: "s-004", text: "Has not logged in for two weeks. Follow up needed.", author_name: "Dr. Martinez", created_at: "2026-03-20T15:30:00Z" },
  { student_id: "s-005", text: "Interested in nursing but unsure about the commitment. Consider allied health alternatives.", author_name: "Ms. Thompson", created_at: "2026-03-28T09:30:00Z" },
  { student_id: "s-006", text: "Excellent progress. CS program applicant with strong portfolio.", author_name: "Dr. Martinez", created_at: "2026-04-07T10:00:00Z" },
  // s-007 (Emma Thompson) has no notes — intentional: undeclared, needs attention, counselor hasn't engaged yet
  { student_id: "s-008", text: "Considering trades vs. 4-year college. Set up meeting with career tech center.", author_name: "Dr. Martinez", created_at: "2026-03-30T14:00:00Z" },
  { student_id: "s-009", text: "Targeting environmental science programs. Strong essay draft.", author_name: "Ms. Thompson", created_at: "2026-04-06T13:00:00Z" },
  { student_id: "s-010", text: "Seems disengaged. Family situation may be a factor. Connect with school counselor.", author_name: "Dr. Martinez", created_at: "2026-03-25T10:00:00Z" },
  { student_id: "s-011", text: "Interested in journalism. Connected with school newspaper advisor.", author_name: "Ms. Thompson", created_at: "2026-04-02T11:30:00Z" },
  { student_id: "s-012", text: "Between business and psychology. Suggested organizational psych as intersection.", author_name: "Dr. Martinez", created_at: "2026-03-29T16:00:00Z" },
  { student_id: "s-013", text: "Top performer. Accepted to summer research internship at Stanford.", author_name: "Dr. Martinez", created_at: "2026-04-08T09:00:00Z" },
  { student_id: "s-014", text: "No engagement since initial onboarding. Scheduled parent conference.", author_name: "Ms. Thompson", created_at: "2026-03-05T14:00:00Z" },
  { student_id: "s-015", text: "Interested in both art and technology. Suggested digital media programs.", author_name: "Dr. Martinez", created_at: "2026-03-28T10:00:00Z" },
  { student_id: "s-016", text: "Mechanical engineering focused. Setting up factory tour for job shadow.", author_name: "Ms. Thompson", created_at: "2026-04-01T13:30:00Z" },
  { student_id: "s-017", text: "Changed direction three times. Needs help narrowing options.", author_name: "Dr. Martinez", created_at: "2026-03-22T09:00:00Z" },
  { student_id: "s-018", text: "Pursuing accounting. Strong math background. Applying for scholarship.", author_name: "Ms. Thompson", created_at: "2026-04-04T10:30:00Z" },
  { student_id: "s-019", text: "Exploring healthcare vs. education. Interested in school psychology.", author_name: "Dr. Martinez", created_at: "2026-04-02T15:00:00Z" },
  { student_id: "s-020", text: "Struggling academically. Career planning secondary to grade recovery.", author_name: "Ms. Thompson", created_at: "2026-03-15T11:00:00Z" },
  { student_id: "s-021", text: "Veterinary science path. Volunteering at local animal shelter.", author_name: "Dr. Martinez", created_at: "2026-04-07T14:00:00Z" },
  { student_id: "s-022", text: "Missed last two check-ins. Interested in music production but unsure about career viability.", author_name: "Ms. Thompson", created_at: "2026-03-25T09:00:00Z" },
  { student_id: "s-023", text: "Criminal justice major. Interested in forensics. Strong analytical skills.", author_name: "Dr. Martinez", created_at: "2026-04-05T11:00:00Z" },
  { student_id: "s-024", text: "Pressure from family to pursue engineering but more interested in creative writing.", author_name: "Ms. Thompson", created_at: "2026-03-20T16:00:00Z" },
  { student_id: "s-025", text: "Architecture path. Completed excellent portfolio. Strong spatial reasoning.", author_name: "Dr. Martinez", created_at: "2026-04-06T10:00:00Z" },
  { student_id: "s-026", text: "Torn between culinary arts and business management. Suggested restaurant management programs.", author_name: "Ms. Thompson", created_at: "2026-03-30T13:00:00Z" },
  { student_id: "s-027", text: "Pre-law track. Excellent debate team record. Applying to political science programs.", author_name: "Dr. Martinez", created_at: "2026-04-05T15:00:00Z" },
  { student_id: "s-028", text: "Considering gap year. Parents opposed. Needs mediation support.", author_name: "Ms. Thompson", created_at: "2026-03-18T10:30:00Z" },
  { student_id: "s-029", text: "Between social work and teaching. Set up visits to both programs.", author_name: "Dr. Martinez", created_at: "2026-04-01T14:00:00Z" },
  { student_id: "s-030", text: "Civil engineering path. Good GPA in STEM courses. Applying to state university programs.", author_name: "Ms. Thompson", created_at: "2026-04-03T09:00:00Z" },
];

// recent_activity: explicit TEXT ids so re-runs are idempotent after truncate
const activity = [
  { id: "a-001-1", student_id: "s-001", description: "Viewed MIT biomedical engineering posting", event_type: "JobPostingViewed", timestamp: "2026-04-08T09:15:00Z" },
  { id: "a-001-2", student_id: "s-001", description: "Updated profile with SAT scores", event_type: "ProfileUpdated", timestamp: "2026-04-06T16:00:00Z" },
  { id: "a-001-3", student_id: "s-001", description: "Completed career interest survey", event_type: "SurveyCompleted", timestamp: "2026-04-01T11:00:00Z" },
  { id: "a-002-1", student_id: "s-002", description: "Attended virtual career fair", event_type: "NetworkingEventAttended", timestamp: "2026-04-07T13:00:00Z" },
  { id: "a-002-2", student_id: "s-002", description: "Accessed design portfolio resources", event_type: "ResourceAccessed", timestamp: "2026-04-05T10:30:00Z" },
  { id: "a-003-1", student_id: "s-003", description: "Completed milestone: Financial Aid", event_type: "MilestoneCompleted", timestamp: "2026-03-10T14:00:00Z" },
  { id: "a-003-2", student_id: "s-003", description: "Viewed Johns Hopkins pre-med program", event_type: "JobPostingViewed", timestamp: "2026-04-08T08:00:00Z" },
  { id: "a-004-1", student_id: "s-004", description: "Accessed career exploration resources", event_type: "ResourceAccessed", timestamp: "2026-03-25T10:00:00Z" },
  { id: "a-005-1", student_id: "s-005", description: "Viewed nursing program comparisons", event_type: "JobPostingViewed", timestamp: "2026-04-06T14:30:00Z" },
  { id: "a-006-1", student_id: "s-006", description: "Updated portfolio with hackathon project", event_type: "ProfileUpdated", timestamp: "2026-04-09T08:00:00Z" },
  { id: "a-006-2", student_id: "s-006", description: "Attended tech industry panel", event_type: "NetworkingEventAttended", timestamp: "2026-04-05T17:00:00Z" },
  { id: "a-007-1", student_id: "s-007", description: "Accessed getting started guide", event_type: "ResourceAccessed", timestamp: "2026-03-15T09:00:00Z" },
  { id: "a-008-1", student_id: "s-008", description: "Viewed electrician apprenticeship programs", event_type: "JobPostingViewed", timestamp: "2026-04-04T11:00:00Z" },
  { id: "a-008-2", student_id: "s-008", description: "Completed skills assessment survey", event_type: "SurveyCompleted", timestamp: "2026-04-02T09:30:00Z" },
  { id: "a-009-1", student_id: "s-009", description: "Submitted UC application", event_type: "MilestoneCompleted", timestamp: "2026-04-08T15:00:00Z" },
  { id: "a-010-1", student_id: "s-010", description: "Accessed stress management resources", event_type: "ResourceAccessed", timestamp: "2026-04-02T16:00:00Z" },
  { id: "a-011-1", student_id: "s-011", description: "Attended journalism career panel", event_type: "NetworkingEventAttended", timestamp: "2026-04-07T14:00:00Z" },
  { id: "a-012-1", student_id: "s-012", description: "Viewed business school rankings", event_type: "JobPostingViewed", timestamp: "2026-04-05T12:00:00Z" },
  { id: "a-013-1", student_id: "s-013", description: "Completed all milestones", event_type: "MilestoneCompleted", timestamp: "2026-04-01T10:00:00Z" },
  { id: "a-013-2", student_id: "s-013", description: "Updated profile with acceptance letter", event_type: "ProfileUpdated", timestamp: "2026-04-09T07:00:00Z" },
  // s-014 (Ethan Brown) has no activity — intentional: lowest-engagement student, exercises the empty-state UI
  { id: "a-015-1", student_id: "s-015", description: "Accessed digital art resources", event_type: "ResourceAccessed", timestamp: "2026-04-03T15:00:00Z" },
  { id: "a-016-1", student_id: "s-016", description: "Viewed engineering internships", event_type: "JobPostingViewed", timestamp: "2026-04-06T11:00:00Z" },
  { id: "a-017-1", student_id: "s-017", description: "Completed personality assessment", event_type: "SurveyCompleted", timestamp: "2026-03-30T14:00:00Z" },
  { id: "a-018-1", student_id: "s-018", description: "Submitted FAFSA application", event_type: "MilestoneCompleted", timestamp: "2026-04-08T09:00:00Z" },
  { id: "a-019-1", student_id: "s-019", description: "Attended education career workshop", event_type: "NetworkingEventAttended", timestamp: "2026-04-07T10:00:00Z" },
  { id: "a-020-1", student_id: "s-020", description: "Accessed tutoring resources", event_type: "ResourceAccessed", timestamp: "2026-03-20T13:00:00Z" },
  { id: "a-021-1", student_id: "s-021", description: "Updated volunteer hours log", event_type: "ProfileUpdated", timestamp: "2026-04-09T08:30:00Z" },
  { id: "a-022-1", student_id: "s-022", description: "Viewed audio engineering programs", event_type: "JobPostingViewed", timestamp: "2026-04-01T16:00:00Z" },
  { id: "a-023-1", student_id: "s-023", description: "Attended forensic science webinar", event_type: "NetworkingEventAttended", timestamp: "2026-04-08T14:00:00Z" },
  { id: "a-024-1", student_id: "s-024", description: "Accessed creative writing scholarships", event_type: "ResourceAccessed", timestamp: "2026-03-28T10:00:00Z" },
  { id: "a-025-1", student_id: "s-025", description: "Submitted architecture school portfolio", event_type: "MilestoneCompleted", timestamp: "2026-04-09T09:00:00Z" },
  { id: "a-026-1", student_id: "s-026", description: "Viewed culinary school programs", event_type: "JobPostingViewed", timestamp: "2026-04-04T14:00:00Z" },
  { id: "a-027-1", student_id: "s-027", description: "Attended mock trial competition", event_type: "NetworkingEventAttended", timestamp: "2026-04-08T17:00:00Z" },
  { id: "a-028-1", student_id: "s-028", description: "Accessed gap year planning resources", event_type: "ResourceAccessed", timestamp: "2026-03-22T11:00:00Z" },
  { id: "a-029-1", student_id: "s-029", description: "Viewed social work program requirements", event_type: "JobPostingViewed", timestamp: "2026-04-06T09:00:00Z" },
  { id: "a-030-1", student_id: "s-030", description: "Viewed state university engineering program", event_type: "JobPostingViewed", timestamp: "2026-04-07T15:00:00Z" },
  { id: "a-030-2", student_id: "s-030", description: "Completed engineering aptitude survey", event_type: "SurveyCompleted", timestamp: "2026-04-05T10:00:00Z" },
];

async function seed() {
  // Truncate first so re-runs are clean
  // UUID cast: supabase-js requires a valid UUID for neq on a UUID column.
  // The nil UUID (all zeros) is valid but astronomically unlikely to exist;
  // using a known-invalid string would cause a cast error in Postgres.
  const { error: tErr1 } = await supabase.from('advisor_notes').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  if (tErr1) {
    console.error('Failed to clear advisor_notes:', tErr1.message);
    process.exit(1);
  }

  const { error: tErr2 } = await supabase.from('recent_activity').delete().neq('id', '__never__');
  if (tErr2) {
    console.error('Failed to clear recent_activity:', tErr2.message);
    process.exit(1);
  }

  // Insert notes
  const { error: nErr } = await supabase.from('advisor_notes').insert(notes);
  if (nErr) {
    console.error('Failed to insert advisor_notes:', nErr.message);
    process.exit(1);
  }
  console.log(`✓ Inserted ${notes.length} advisor notes`);

  // Insert activity
  const { error: aErr } = await supabase.from('recent_activity').insert(activity);
  if (aErr) {
    console.error('Failed to insert recent_activity:', aErr.message);
    process.exit(1);
  }
  console.log(`✓ Inserted ${activity.length} activity events`);

  console.log('Demo seed complete.');
}

seed().catch(err => {
  console.error('Unexpected error:', err);
  process.exit(1);
});
