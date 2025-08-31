'use client';

import { useSearchParams } from 'next/navigation';
import StepOne from '@/components/stepone';

// Type definitions
type Step = {
  stage: string;
  description: string;
  duration: string;
  keySkills: string[];
  resources: string[];
};

type Roadmap = {
  title: string;
  steps: Step[];
};

type Roadmaps = {
  [career: string]: Roadmap;
};

// Your roadmap data with typing
const allRoadmaps: Roadmaps = {
  'Cybersecurity Analyst': {
    title: 'Cybersecurity Analyst',
    steps: [
      {
        stage: 'Fall Semester (Year 1): Computer Science & Networking Basics',
        description:
          'Start with foundational computer science courses and networking basics to build a strong understanding of how computers and networks function.',
        duration: 'Fall (Year 1)',
        keySkills: [
          'Networking Basics',
          'TCP/IP',
          'Operating Systems',
          'Intro to Cybersecurity',
        ],
        resources: [
          'CS50 by Harvard',
          'Khan Academy',
          'Cisco Networking Academy',
          'Introduction to Cyber Security by Cisco',
        ],
      },
      {
        stage: 'Spring Semester (Year 1): Security Fundamentals & Linux',
        description:
          'Begin learning the fundamentals of cybersecurity, focusing on security concepts and practical experience with Linux operating systems.',
        duration: 'Spring (Year 1)',
        keySkills: [
          'Linux Administration',
          'Security Principles',
          'Introduction to Cryptography',
          'Ethical Hacking Basics',
        ],
        resources: [
          'CompTIA Security+',
          'Linux Academy',
          'Cybrary',
          'Security+ Exam Prep',
        ],
      },
      // ... more steps for Cybersecurity Analyst ...
      {
        stage:
          'Fall Semester (Year 2): Intermediate Networking & Risk Management',
        description:
          'Focus on intermediate networking concepts and risk management strategies, alongside deeper cybersecurity concepts.',
        duration: 'Fall (Year 2)',
        keySkills: ['Network Security', 'Firewalls', 'VPNs', 'Risk Management'],
        resources: [
          'Network+ Certification',
          'CompTIA Security+',
          'Cybrary',
          'The Cybersecurity Handbook',
        ],
      },
      {
        stage:
          'Spring Semester (Year 2): Ethical Hacking & Vulnerability Assessments',
        description:
          'Learn more advanced topics like ethical hacking and vulnerability assessments. Use tools like Metasploit to get hands-on experience.',
        duration: 'Spring (Year 2)',
        keySkills: [
          'Ethical Hacking',
          'Penetration Testing',
          'Vulnerability Scanning',
          'Metasploit',
        ],
        resources: ['Hack The Box', 'TryHackMe', 'Kali Linux', 'OWASP Top 10'],
      },
      {
        stage:
          'Fall Semester (Year 3): Penetration Testing & Incident Response',
        description:
          'Start specializing in penetration testing, vulnerability assessments, and incident response. Practice through hands-on labs.',
        duration: 'Fall (Year 3)',
        keySkills: [
          'Penetration Testing',
          'Incident Response',
          'Forensics',
          'Attack Simulation',
        ],
        resources: [
          'Certified Ethical Hacker (CEH)',
          'Kali Linux',
          'TryHackMe',
          'Incident Handling Techniques',
        ],
      },
      {
        stage: 'Spring Semester (Year 3): Advanced Security Topics & Projects',
        description:
          'Dive deeper into advanced topics such as advanced cryptography, digital forensics, and build real-world cybersecurity projects and labs.',
        duration: 'Spring (Year 3)',
        keySkills: [
          'Digital Forensics',
          'Advanced Cryptography',
          'Security Automation',
          'Project Development',
        ],
        resources: [
          'Security Operations Center (SOC) Labs',
          'Advanced Ethical Hacking',
          'Capture The Flag (CTF) Challenges',
        ],
      },
      {
        stage: 'Fall Semester (Year 4): Certifications & Interview Prep',
        description:
          'Focus on earning key certifications like CISSP, CySA+, and preparing for job interviews with a strong focus on security operations and incident management.',
        duration: 'Fall (Year 4)',
        keySkills: ['CISSP', 'CySA+', 'Incident Management', 'Resume Building'],
        resources: [
          'CISSP Exam Prep',
          'CySA+ Certification',
          'LinkedIn',
          'Mock Interviews',
        ],
      },
      {
        stage: 'Spring Semester (Year 4): Internships & Job Search',
        description:
          'Focus on applying for internships or full-time positions. Polish your resume, network, and practice mock interviews to land your first cybersecurity role.',
        duration: 'Spring (Year 4)',
        keySkills: [
          'Job Applications',
          'Resume Building',
          'Professional Networking',
          'Interview Techniques',
        ],
        resources: [
          'LinkedIn',
          'Hired.com',
          'Tech Interview Prep',
          'Career Services',
        ],
      },
    ],
  },

  'Software Engineer': {
    title: 'Software Engineer',
    steps: [
      {
        stage: 'Step 1: Learn Programming Basics',
        description:
          'Start with a beginner-friendly language like Python or JavaScript.',
        duration: '1-2 months',
        keySkills: ['Variables', 'Loops', 'Conditionals', 'Functions'],
        resources: ['freeCodeCamp', 'Codecademy', 'CS50 by Harvard'],
      },
      {
        stage: 'Step 2: Master Data Structures & Algorithms',
        description:
          'Understand core concepts for technical interviews and problem-solving.',
        duration: '2-3 months',
        keySkills: ['Arrays', 'Linked Lists', 'Hash Maps', 'Recursion'],
        resources: [
          'LeetCode',
          'Grokking the Coding Interview',
          'GeeksforGeeks',
        ],
      },
      {
        stage: 'Step 3: Learn Web Development',
        description: 'Build web projects using frontend and backend tech.',
        duration: '3 months',
        keySkills: ['HTML', 'CSS', 'JavaScript', 'React', 'Node.js'],
        resources: ['MDN Docs', 'The Odin Project', 'Full Stack Open'],
      },
      {
        stage: 'Step 4: Build Real Projects',
        description:
          'Apply your skills by building portfolio-ready applications.',
        duration: '2-4 months',
        keySkills: ['APIs', 'Databases', 'Auth', 'Deployment'],
        resources: ['GitHub', 'Vercel', 'Render'],
      },
      {
        stage: 'Step 5: Prep for Internships & Jobs',
        description: 'Polish your resume, network, and practice interviews.',
        duration: '1-2 months',
        keySkills: ['System Design', 'Behavioral Interviews', 'LeetCode'],
        resources: ['Tech Interview Handbook', 'LinkedIn', 'Hired.com'],
      },
    ],
  },

  'Computer engineering': {
    title: 'Computer Engineering',
    steps: [
      {
        stage: 'Step 1: Learn Digital Logic Design',
        description: 'Start with basic digital logic and circuit design.',
        duration: '1-2 months',
        keySkills: ['Binary Systems', 'Boolean Algebra', 'Circuit Design'],
        resources: ['Coursera', 'edX', 'MIT OpenCourseWare'],
      },
      {
        stage: 'Step 2: Study Microprocessors',
        description:
          'Understand how microprocessors work and their architecture.',
        duration: '2-3 months',
        keySkills: ['Microprocessors', 'Assembly Language', 'Embedded Systems'],
        resources: ['UDEMY', 'Intel Documentation', 'ARM Architecture'],
      },
      {
        stage: 'Step 3: Learn Operating Systems',
        description:
          'Understand the fundamentals of operating systems and system calls.',
        duration: '3 months',
        keySkills: ['Operating Systems', 'Memory Management', 'Concurrency'],
        resources: [
          'Operating Systems: Three Easy Pieces',
          'MIT OpenCourseWare',
        ],
      },
      {
        stage: 'Step 4: Build Embedded Systems',
        description:
          'Learn how to build hardware and software integrated systems.',
        duration: '3-4 months',
        keySkills: ['Embedded Programming', 'C Language', 'Microcontroller'],
        resources: [
          'ARM University',
          'Embedded Systems Design by Peter Marwedel',
        ],
      },
      {
        stage: 'Step 5: Prepare for Internships & Jobs',
        description: 'Polish your resume and practice problem-solving.',
        duration: '1-2 months',
        keySkills: ['System Design', 'Problem Solving', 'Embedded Systems'],
        resources: ['LinkedIn', 'Tech Interview Handbook'],
      },
    ],
  },

  'Management Accountant': {
    title: 'Management Accountant',
    steps: [
      {
        stage: 'Step 1: Master Accounting Fundamentals',
        description:
          'Build a strong foundation in accounting principles, financial statements, and cost analysis through Queens College accounting courses.',
        duration: '1-2 semesters',
        keySkills: [
          'Financial Accounting',
          'Managerial Accounting',
          'Cost Accounting',
        ],
        resources: [
          'ACCT 101 & 102 at Queens College',
          'Principles of Accounting by Weygandt',
          'AccountingCoach',
        ],
      },
      {
        stage: 'Step 2: Learn Financial Analysis & Reporting',
        description:
          'Understand how to prepare internal reports for decision-making and analyze business performance.',
        duration: '1 semester',
        keySkills: [
          'Variance Analysis',
          'Budgeting',
          'Financial Statement Analysis',
        ],
        resources: [
          'ACCT 305 at Queens College',
          'Harvard Business Review articles',
          'Corporate Finance Institute (CFI)',
        ],
      },
      {
        stage: 'Step 3: Gain Technology & Tools Skills',
        description:
          'Learn to use accounting and finance software to streamline reporting and analysis.',
        duration: '2-3 months',
        keySkills: [
          'Excel (Advanced)',
          'QuickBooks',
          'ERP Systems (SAP, Oracle)',
        ],
        resources: [
          'Queens College Computer Lab Workshops',
          'LinkedIn Learning',
          'Microsoft Excel for Accountants',
        ],
      },
      {
        stage: 'Step 4: Apply Knowledge Through Internships',
        description:
          'Gain practical experience by interning with NYC-based companies, nonprofits, or government agencies.',
        duration: '3-6 months',
        keySkills: [
          'Budget Preparation',
          'Internal Reporting',
          'Team Collaboration',
        ],
        resources: ['Queens College Career Center', 'Indeed', 'Handshake'],
      },
      {
        stage: 'Step 5: Prepare for CMA Certification & Jobs',
        description:
          'Study for the Certified Management Accountant (CMA) exam and polish your resume for NYC’s competitive job market.',
        duration: '3-6 months',
        keySkills: [
          'Strategic Planning',
          'Ethics in Accounting',
          'Professional Networking',
        ],
        resources: [
          'IMA CMA Review Course',
          'Gleim CMA Review',
          'LinkedIn Networking Events in NYC',
        ],
      },
    ],
  },
  // Add more careers if needed
};

export default function RoadmapPage() {
  const searchParams = useSearchParams();
  const career = searchParams.get('career') || 'Software Engineer';
  const careerKey = career as keyof typeof allRoadmaps;
  const roadmap = allRoadmaps[careerKey];

  if (!roadmap) {
    return (
      <div className="p-10 text-center">
        <p>
          No roadmap found for the career path: {career}. Please choose a valid
          career.
        </p>
        <p>Available careers:</p>
        <ul>
          {Object.keys(allRoadmaps).map(careerKey => (
            <li key={careerKey}>
              <a
                href={`/roadmap?career=${careerKey}`}
                className="text-blue-600 hover:underline"
              >
                {careerKey}
              </a>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  return (
    <>
      <div className="max-w-4xl mx-auto mt-10 p-6 space-y-6">
        <h1 className="text-3xl font-bold text-center mb-8 text-[#6d6bd3]">
          Roadmap for {roadmap.title}
        </h1>

        {roadmap.steps.map((step, index) => (
          <StepOne
            key={index}
            number={index + 1}
            semester={step.duration}
            title={step.stage}
            description={step.description}
            skills={step.keySkills}
            resources={step.resources}
          />
        ))}
      </div>
    </>
  );
}
