/**
 * Milestone, activity, and advisor-note templates bucketed by engagement level.
 * Extracted from the original synthetic seed so new pilot students still have
 * plausible activity history that matches their engagement category.
 *
 * GREEN  → high-completion profile (4–5 milestones, many Completed)
 * YELLOW → mid-progress profile  (2–3 milestones, mix of Completed/In Progress)
 * RED    → early/stalled profile  (1–2 milestones, mostly Pending/In Progress)
 */

export const MILESTONE_TEMPLATES = {
  Green: [
    [
      { label: 'Career Assessment',      status: 'Completed',   category: 'Assessment',   completedDate: '2026-02-10' },
      { label: 'Resume Draft',           status: 'Completed',   category: 'Profile',      completedDate: '2026-03-01' },
      { label: 'Job Shadow',             status: 'Completed',   category: 'Experience',   completedDate: '2026-03-20' },
      { label: 'Job Applications',       status: 'In Progress', category: 'Applications' },
    ],
    [
      { label: 'Career Assessment',      status: 'Completed',   category: 'Assessment',   completedDate: '2026-01-15' },
      { label: 'LinkedIn Profile',       status: 'Completed',   category: 'Profile',      completedDate: '2026-02-01' },
      { label: 'Job Shadow',             status: 'Completed',   category: 'Experience',   completedDate: '2026-02-28' },
      { label: 'Internship Applications',status: 'Completed',   category: 'Applications', completedDate: '2026-03-15' },
      { label: 'Job Applications',       status: 'In Progress', category: 'Applications' },
    ],
    [
      { label: 'Career Assessment',      status: 'Completed',   category: 'Assessment',   completedDate: '2026-01-20' },
      { label: 'LinkedIn Profile',       status: 'Completed',   category: 'Profile',      completedDate: '2026-02-10' },
      { label: 'Internship Applications',status: 'Completed',   category: 'Applications', completedDate: '2026-03-15' },
      { label: 'Job Shadow',             status: 'Completed',   category: 'Experience',   completedDate: '2026-03-25' },
      { label: 'Job Applications',       status: 'In Progress', category: 'Applications' },
    ],
    [
      { label: 'Career Assessment',      status: 'Completed',   category: 'Assessment',   completedDate: '2026-01-30' },
      { label: 'LinkedIn Profile',       status: 'Completed',   category: 'Profile',      completedDate: '2026-02-20' },
      { label: 'Job Shadow',             status: 'Completed',   category: 'Experience',   completedDate: '2026-03-05' },
      { label: 'Job Applications',       status: 'In Progress', category: 'Applications' },
    ],
  ],

  Yellow: [
    [
      { label: 'Career Assessment',      status: 'Completed',   category: 'Assessment',   completedDate: '2026-02-15' },
      { label: 'Resume Draft',           status: 'In Progress', category: 'Profile' },
      { label: 'Informational Interview',status: 'Pending',     category: 'Networking' },
    ],
    [
      { label: 'Career Assessment',      status: 'Completed',   category: 'Assessment',   completedDate: '2026-02-01' },
      { label: 'LinkedIn Profile',       status: 'Completed',   category: 'Profile',      completedDate: '2026-02-28' },
      { label: 'Internship Applications',status: 'In Progress', category: 'Applications' },
    ],
    [
      { label: 'Career Assessment',      status: 'Completed',   category: 'Assessment',   completedDate: '2026-02-10' },
      { label: 'Resume Draft',           status: 'Completed',   category: 'Profile',      completedDate: '2026-03-01' },
      { label: 'Internship Applications',status: 'In Progress', category: 'Applications' },
    ],
    [
      { label: 'Career Assessment',      status: 'Completed',   category: 'Assessment',   completedDate: '2026-02-25' },
      { label: 'Resume Draft',           status: 'In Progress', category: 'Profile' },
    ],
  ],

  Red: [
    [
      { label: 'Career Assessment',      status: 'In Progress', category: 'Assessment' },
    ],
    [
      { label: 'Career Assessment',      status: 'Pending',     category: 'Assessment' },
    ],
    [
      { label: 'Career Assessment',      status: 'Completed',   category: 'Assessment',   completedDate: '2026-03-01' },
    ],
    [
      { label: 'Career Assessment',      status: 'In Progress', category: 'Assessment' },
      { label: 'Resume Draft',           status: 'Pending',     category: 'Profile' },
    ],
  ],
};

export const ACTIVITY_TEMPLATES = {
  Green: [
    [
      { event_type: 'MilestoneCompleted',        description: 'Completed Job Shadow milestone',        timestamp: '2026-03-20T14:00:00Z' },
      { event_type: 'ProfileUpdated',            description: 'Updated LinkedIn profile',              timestamp: '2026-03-10T10:00:00Z' },
      { event_type: 'JobPostingViewed',          description: 'Viewed software engineer posting',      timestamp: '2026-04-01T09:00:00Z' },
    ],
    [
      { event_type: 'SurveyCompleted',           description: 'Completed career readiness survey',     timestamp: '2026-04-05T11:00:00Z' },
      { event_type: 'NetworkingEventAttended',   description: 'Attended campus career fair',           timestamp: '2026-03-28T16:00:00Z' },
      { event_type: 'MilestoneCompleted',        description: 'Completed Internship Applications',     timestamp: '2026-03-15T13:00:00Z' },
    ],
  ],
  Yellow: [
    [
      { event_type: 'SurveyCompleted',           description: 'Completed career interests survey',     timestamp: '2026-03-15T10:00:00Z' },
      { event_type: 'ResourceAccessed',          description: 'Accessed resume writing guide',         timestamp: '2026-04-01T11:00:00Z' },
    ],
    [
      { event_type: 'JobPostingViewed',          description: 'Viewed marketing internship posting',   timestamp: '2026-03-25T14:00:00Z' },
      { event_type: 'ProfileUpdated',            description: 'Updated career preferences',            timestamp: '2026-04-02T09:00:00Z' },
    ],
  ],
  Red: [
    [
      { event_type: 'ResourceAccessed',          description: 'Accessed career exploration resources', timestamp: '2026-03-10T10:00:00Z' },
    ],
    [],
  ],
};

export const NOTE_TEMPLATES = {
  Green: [
    'Strong progress — has completed multiple milestones ahead of schedule. Encouraged to start networking outreach.',
    'Very engaged student. Resume is polished and they have started applying. Follow up on job shadow experience.',
  ],
  Yellow: [
    'Making progress but resume still in draft. Scheduled a follow-up to review before submitting applications.',
    'Student is exploring options. Suggested attending the career fair next month to narrow direction.',
  ],
  Red: [
    'Has not completed career assessment yet. Reached out to schedule a meeting to unblock next steps.',
    'Engagement is low. Sent reminder email about upcoming advising drop-in hours.',
  ],
};
