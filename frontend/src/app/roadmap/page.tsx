// 'use client';

// import { useSearchParams } from 'next/navigation';
// import StepOne from '@/components/stepone';

// // Type definitions
// type Step = {
//   stage: string;
//   description: string;
//   duration: string;
//   keySkills: string[];
//   resources: string[];
// };

// type Roadmap = {
//   title: string;
//   steps: Step[];
// };

// type Roadmaps = {
//   [career: string]: Roadmap;
// };

// // Your roadmap data with typing
// const allRoadmaps: Roadmaps = {
//   'Cybersecurity Analyst': {
//     title: 'Cybersecurity Analyst',
//     steps: [
//       {
//         stage: 'Fall Semester (Year 1): Computer Science & Networking Basics',
//         description:
//           'Start with foundational computer science courses and networking basics to build a strong understanding of how computers and networks function.',
//         duration: 'Fall (Year 1)',
//         keySkills: [
//           'Networking Basics',
//           'TCP/IP',
//           'Operating Systems',
//           'Intro to Cybersecurity',
//         ],
//         resources: [
//           'CS50 by Harvard',
//           'Khan Academy',
//           'Cisco Networking Academy',
//           'Introduction to Cyber Security by Cisco',
//         ],
//       },
//       {
//         stage: 'Spring Semester (Year 1): Security Fundamentals & Linux',
//         description:
//           'Begin learning the fundamentals of cybersecurity, focusing on security concepts and practical experience with Linux operating systems.',
//         duration: 'Spring (Year 1)',
//         keySkills: [
//           'Linux Administration',
//           'Security Principles',
//           'Introduction to Cryptography',
//           'Ethical Hacking Basics',
//         ],
//         resources: [
//           'CompTIA Security+',
//           'Linux Academy',
//           'Cybrary',
//           'Security+ Exam Prep',
//         ],
//       },
//       // ... more steps for Cybersecurity Analyst ...
//       {
//         stage:
//           'Fall Semester (Year 2): Intermediate Networking & Risk Management',
//         description:
//           'Focus on intermediate networking concepts and risk management strategies, alongside deeper cybersecurity concepts.',
//         duration: 'Fall (Year 2)',
//         keySkills: ['Network Security', 'Firewalls', 'VPNs', 'Risk Management'],
//         resources: [
//           'Network+ Certification',
//           'CompTIA Security+',
//           'Cybrary',
//           'The Cybersecurity Handbook',
//         ],
//       },
//       {
//         stage:
//           'Spring Semester (Year 2): Ethical Hacking & Vulnerability Assessments',
//         description:
//           'Learn more advanced topics like ethical hacking and vulnerability assessments. Use tools like Metasploit to get hands-on experience.',
//         duration: 'Spring (Year 2)',
//         keySkills: [
//           'Ethical Hacking',
//           'Penetration Testing',
//           'Vulnerability Scanning',
//           'Metasploit',
//         ],
//         resources: ['Hack The Box', 'TryHackMe', 'Kali Linux', 'OWASP Top 10'],
//       },
//       {
//         stage:
//           'Fall Semester (Year 3): Penetration Testing & Incident Response',
//         description:
//           'Start specializing in penetration testing, vulnerability assessments, and incident response. Practice through hands-on labs.',
//         duration: 'Fall (Year 3)',
//         keySkills: [
//           'Penetration Testing',
//           'Incident Response',
//           'Forensics',
//           'Attack Simulation',
//         ],
//         resources: [
//           'Certified Ethical Hacker (CEH)',
//           'Kali Linux',
//           'TryHackMe',
//           'Incident Handling Techniques',
//         ],
//       },
//       {
//         stage: 'Spring Semester (Year 3): Advanced Security Topics & Projects',
//         description:
//           'Dive deeper into advanced topics such as advanced cryptography, digital forensics, and build real-world cybersecurity projects and labs.',
//         duration: 'Spring (Year 3)',
//         keySkills: [
//           'Digital Forensics',
//           'Advanced Cryptography',
//           'Security Automation',
//           'Project Development',
//         ],
//         resources: [
//           'Security Operations Center (SOC) Labs',
//           'Advanced Ethical Hacking',
//           'Capture The Flag (CTF) Challenges',
//         ],
//       },
//       {
//         stage: 'Fall Semester (Year 4): Certifications & Interview Prep',
//         description:
//           'Focus on earning key certifications like CISSP, CySA+, and preparing for job interviews with a strong focus on security operations and incident management.',
//         duration: 'Fall (Year 4)',
//         keySkills: ['CISSP', 'CySA+', 'Incident Management', 'Resume Building'],
//         resources: [
//           'CISSP Exam Prep',
//           'CySA+ Certification',
//           'LinkedIn',
//           'Mock Interviews',
//         ],
//       },
//       {
//         stage: 'Spring Semester (Year 4): Internships & Job Search',
//         description:
//           'Focus on applying for internships or full-time positions. Polish your resume, network, and practice mock interviews to land your first cybersecurity role.',
//         duration: 'Spring (Year 4)',
//         keySkills: [
//           'Job Applications',
//           'Resume Building',
//           'Professional Networking',
//           'Interview Techniques',
//         ],
//         resources: [
//           'LinkedIn',
//           'Hired.com',
//           'Tech Interview Prep',
//           'Career Services',
//         ],
//       },
//     ],
//   },

//   'Software Engineer': {
//     title: 'Software Engineer',
//     steps: [
//       {
//         stage: 'Step 1: Learn Programming Basics',
//         description:
//           'Start with a beginner-friendly language like Python or JavaScript.',
//         duration: '1-2 months',
//         keySkills: ['Variables', 'Loops', 'Conditionals', 'Functions'],
//         resources: ['freeCodeCamp', 'Codecademy', 'CS50 by Harvard'],
//       },
//       {
//         stage: 'Step 2: Master Data Structures & Algorithms',
//         description:
//           'Understand core concepts for technical interviews and problem-solving.',
//         duration: '2-3 months',
//         keySkills: ['Arrays', 'Linked Lists', 'Hash Maps', 'Recursion'],
//         resources: [
//           'LeetCode',
//           'Grokking the Coding Interview',
//           'GeeksforGeeks',
//         ],
//       },
//       {
//         stage: 'Step 3: Learn Web Development',
//         description: 'Build web projects using frontend and backend tech.',
//         duration: '3 months',
//         keySkills: ['HTML', 'CSS', 'JavaScript', 'React', 'Node.js'],
//         resources: ['MDN Docs', 'The Odin Project', 'Full Stack Open'],
//       },
//       {
//         stage: 'Step 4: Build Real Projects',
//         description:
//           'Apply your skills by building portfolio-ready applications.',
//         duration: '2-4 months',
//         keySkills: ['APIs', 'Databases', 'Auth', 'Deployment'],
//         resources: ['GitHub', 'Vercel', 'Render'],
//       },
//       {
//         stage: 'Step 5: Prep for Internships & Jobs',
//         description: 'Polish your resume, network, and practice interviews.',
//         duration: '1-2 months',
//         keySkills: ['System Design', 'Behavioral Interviews', 'LeetCode'],
//         resources: ['Tech Interview Handbook', 'LinkedIn', 'Hired.com'],
//       },
//     ],
//   },

//   'Computer engineering': {
//     title: 'Computer Engineering',
//     steps: [
//       {
//         stage: 'Step 1: Learn Digital Logic Design',
//         description: 'Start with basic digital logic and circuit design.',
//         duration: '1-2 months',
//         keySkills: ['Binary Systems', 'Boolean Algebra', 'Circuit Design'],
//         resources: ['Coursera', 'edX', 'MIT OpenCourseWare'],
//       },
//       {
//         stage: 'Step 2: Study Microprocessors',
//         description:
//           'Understand how microprocessors work and their architecture.',
//         duration: '2-3 months',
//         keySkills: ['Microprocessors', 'Assembly Language', 'Embedded Systems'],
//         resources: ['UDEMY', 'Intel Documentation', 'ARM Architecture'],
//       },
//       {
//         stage: 'Step 3: Learn Operating Systems',
//         description:
//           'Understand the fundamentals of operating systems and system calls.',
//         duration: '3 months',
//         keySkills: ['Operating Systems', 'Memory Management', 'Concurrency'],
//         resources: [
//           'Operating Systems: Three Easy Pieces',
//           'MIT OpenCourseWare',
//         ],
//       },
//       {
//         stage: 'Step 4: Build Embedded Systems',
//         description:
//           'Learn how to build hardware and software integrated systems.',
//         duration: '3-4 months',
//         keySkills: ['Embedded Programming', 'C Language', 'Microcontroller'],
//         resources: [
//           'ARM University',
//           'Embedded Systems Design by Peter Marwedel',
//         ],
//       },
//       {
//         stage: 'Step 5: Prepare for Internships & Jobs',
//         description: 'Polish your resume and practice problem-solving.',
//         duration: '1-2 months',
//         keySkills: ['System Design', 'Problem Solving', 'Embedded Systems'],
//         resources: ['LinkedIn', 'Tech Interview Handbook'],
//       },
//     ],
//   },

//   'Management Accountant': {
//     title: 'Management Accountant',
//     steps: [
//       {
//         stage: 'Step 1: Master Accounting Fundamentals',
//         description:
//           'Build a strong foundation in accounting principles, financial statements, and cost analysis through Queens College accounting courses.',
//         duration: '1-2 semesters',
//         keySkills: [
//           'Financial Accounting',
//           'Managerial Accounting',
//           'Cost Accounting',
//         ],
//         resources: [
//           'ACCT 101 & 102 at Queens College',
//           'Principles of Accounting by Weygandt',
//           'AccountingCoach',
//         ],
//       },
//       {
//         stage: 'Step 2: Learn Financial Analysis & Reporting',
//         description:
//           'Understand how to prepare internal reports for decision-making and analyze business performance.',
//         duration: '1 semester',
//         keySkills: [
//           'Variance Analysis',
//           'Budgeting',
//           'Financial Statement Analysis',
//         ],
//         resources: [
//           'ACCT 305 at Queens College',
//           'Harvard Business Review articles',
//           'Corporate Finance Institute (CFI)',
//         ],
//       },
//       {
//         stage: 'Step 3: Gain Technology & Tools Skills',
//         description:
//           'Learn to use accounting and finance software to streamline reporting and analysis.',
//         duration: '2-3 months',
//         keySkills: [
//           'Excel (Advanced)',
//           'QuickBooks',
//           'ERP Systems (SAP, Oracle)',
//         ],
//         resources: [
//           'Queens College Computer Lab Workshops',
//           'LinkedIn Learning',
//           'Microsoft Excel for Accountants',
//         ],
//       },
//       {
//         stage: 'Step 4: Apply Knowledge Through Internships',
//         description:
//           'Gain practical experience by interning with NYC-based companies, nonprofits, or government agencies.',
//         duration: '3-6 months',
//         keySkills: [
//           'Budget Preparation',
//           'Internal Reporting',
//           'Team Collaboration',
//         ],
//         resources: ['Queens College Career Center', 'Indeed', 'Handshake'],
//       },
//       {
//         stage: 'Step 5: Prepare for CMA Certification & Jobs',
//         description:
//           'Study for the Certified Management Accountant (CMA) exam and polish your resume for NYC’s competitive job market.',
//         duration: '3-6 months',
//         keySkills: [
//           'Strategic Planning',
//           'Ethics in Accounting',
//           'Professional Networking',
//         ],
//         resources: [
//           'IMA CMA Review Course',
//           'Gleim CMA Review',
//           'LinkedIn Networking Events in NYC',
//         ],
//       },
//     ],
//   },
//   // Add more careers if needed
// };

// export default function RoadmapPage() {
//   const searchParams = useSearchParams();
//   const career = searchParams.get('career') || 'Software Engineer';
//   const careerKey = career as keyof typeof allRoadmaps;
//   const roadmap = allRoadmaps[careerKey];

//   if (!roadmap) {
//     return (
//       <div className="p-10 text-center">
//         <p>
//           No roadmap found for the career path: {career}. Please choose a valid
//           career.
//         </p>
//         <p>Available careers:</p>
//         <ul>
//           {Object.keys(allRoadmaps).map(careerKey => (
//             <li key={careerKey}>
//               <a
//                 href={`/roadmap?career=${careerKey}`}
//                 className="text-blue-600 hover:underline"
//               >
//                 {careerKey}
//               </a>
//             </li>
//           ))}
//         </ul>
//       </div>
//     );
//   }

//   return (
//     <>
//       <div className="max-w-4xl mx-auto mt-10 p-6 space-y-6">
//         <h1 className="text-3xl font-bold text-center mb-8 text-[#6d6bd3]">
//           Roadmap for {roadmap.title}
//         </h1>

//         {roadmap.steps.map((step, index) => (
//           <StepOne
//             key={index}
//             number={index + 1}
//             semester={step.duration}
//             title={step.stage}
//             description={step.description}
//             skills={step.keySkills}
//             resources={step.resources}
//           />
//         ))}
//       </div>
//     </>
//   );
// }
'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  BookOpen, 
  Target, 
  TrendingUp, 
  Award,
  Download,
  ChevronRight,
  CheckCircle2,
  Clock
} from 'lucide-react';

type RoadmapResponse = {
  success: boolean;
  roadmap: string;
  student: {
    name: string;
    school: string;
    major: string;
  };
  career: {
    title: string;
  };
};

export default function RoadmapPage() {
  const searchParams = useSearchParams();
  const [roadmap, setRoadmap] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const hasGeneratedRef = useRef(false);

  // Get all data from URL params
  const name = searchParams.get('name') || 'Student';
  const school = searchParams.get('school') || '';
  const major = searchParams.get('major') || '';
  const careerTitle = searchParams.get('career_title') || '';
  const salary = searchParams.get('salary') || 'N/A';
  const growth = searchParams.get('growth') || 'N/A';

  useEffect(() => {
    if (hasGeneratedRef.current) return;

    const generateRoadmap = async () => {
      try {
        setLoading(true);
        setError('');

        const response = await fetch('http://localhost:8000/api/generate-roadmap', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: searchParams.get('name'),
            email: searchParams.get('email'),
            school,
            major,
            year: searchParams.get('year'),
            skills: searchParams.get('skills')?.split(',') || [],
            interests: searchParams.get('interests'),
            career_goals: searchParams.get('career_goals'),
            career_title: careerTitle,
            soc_code: searchParams.get('soc_code'),
            career_description: searchParams.get('career_description'),
            salary,
            growth,
          }),
        });

        if (!response.ok) throw new Error('Failed to generate roadmap');

        const data: RoadmapResponse = await response.json();
        setRoadmap(data.roadmap);
        hasGeneratedRef.current = true;
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    if (careerTitle && school && major) {
      generateRoadmap();
    } else {
      setError('Missing required information.');
      setLoading(false);
    }
  }, []);

  // Parse roadmap into structured sections
  const parseRoadmap = (text: string) => {
    const lines = text.split('\n');
    const sections: Array<{ title: string; content: string[] }> = [];
    let currentSection: { title: string; content: string[] } | null = null;

    lines.forEach(line => {
      if (line.startsWith('##')) {
        if (currentSection) sections.push(currentSection);
        currentSection = { title: line.replace('##', '').trim(), content: [] };
      } else if (currentSection && line.trim()) {
        currentSection.content.push(line.trim());
      }
    });

    if (currentSection) sections.push(currentSection);
    return sections;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md"
        >
          <div className="relative mb-8">
            <div className="w-24 h-24 mx-auto border-4 border-[#6d6bd3]/30 border-t-[#6d6bd3] rounded-full animate-spin"></div>
            <Target className="w-12 h-12 text-[#6d6bd3] absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
          </div>
          <h2 className="text-3xl font-bold text-[#6d6bd3] mb-3">
            Crafting Your Roadmap
          </h2>
          <p className="text-gray-600 text-lg">
            Analyzing your profile and building a personalized career path...
          </p>
          <p className="text-gray-500 text-sm mt-2">This takes 30-60 seconds</p>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-white flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">⚠️</span>
            </div>
            <h2 className="text-2xl font-bold text-red-600 mb-2">Oops!</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={() => window.history.back()}
              className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  const sections = parseRoadmap(roadmap);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-[#6d6bd3] to-[#5a59b8] text-white py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <button
              onClick={() => window.history.back()}
              className="text-white/80 hover:text-white mb-6 flex items-center gap-2 transition-colors"
            >
              ← Back to Career Matches
            </button>
            
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                <Target className="w-8 h-8" />
              </div>
              <h1 className="text-5xl font-bold">Your Career Roadmap</h1>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mt-8">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                <div className="flex items-center gap-3 mb-2">
                  <Award className="w-6 h-6" />
                  <h3 className="font-semibold text-lg">Career Goal</h3>
                </div>
                <p className="text-white/90 text-xl font-bold">{careerTitle}</p>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                <div className="flex items-center gap-3 mb-2">
                  <TrendingUp className="w-6 h-6" />
                  <h3 className="font-semibold text-lg">Salary Range</h3>
                </div>
                <p className="text-white/90 text-xl font-bold">{salary}</p>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                <div className="flex items-center gap-3 mb-2">
                  <BookOpen className="w-6 h-6" />
                  <h3 className="font-semibold text-lg">Your Major</h3>
                </div>
                <p className="text-white/90 text-xl font-bold">{major}</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Roadmap Content */}
      <div className="max-w-5xl mx-auto px-6 py-12">
        <div className="space-y-8">
          {sections.map((section, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100"
            >
              <div className="bg-gradient-to-r from-[#6d6bd3]/10 to-purple-50 p-6 border-b border-gray-100">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-[#6d6bd3] rounded-xl flex items-center justify-center text-white font-bold text-lg">
                      {index + 1}
                    </div>
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                      {section.title}
                    </h2>
                    {index < sections.length - 1 && (
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Clock className="w-4 h-4" />
                        <span>Step {index + 1} of {sections.length}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="p-6 space-y-4">
                {section.content.map((item, itemIndex) => {
                  const isBullet = item.startsWith('-') || item.startsWith('•');
                  const cleanItem = isBullet ? item.substring(1).trim() : item;
                  
                  return (
                    <div
                      key={itemIndex}
                      className={`flex items-start gap-3 ${
                        isBullet ? 'pl-4' : ''
                      }`}
                    >
                      {isBullet && (
                        <CheckCircle2 className="w-5 h-5 text-[#6d6bd3] flex-shrink-0 mt-0.5" />
                      )}
                      <p className="text-gray-700 leading-relaxed flex-1">
                        {cleanItem}
                      </p>
                    </div>
                  );
                })}
              </div>

              {index < sections.length - 1 && (
                <div className="px-6 pb-6">
                  <div className="flex items-center justify-center">
                    <ChevronRight className="w-6 h-6 text-[#6d6bd3]" />
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-12 flex flex-wrap gap-4 justify-center"
        >
          <button
            onClick={() => {
              const blob = new Blob([roadmap], { type: 'text/markdown' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = `${careerTitle.replace(/\s+/g, '-')}-Roadmap.md`;
              a.click();
              URL.revokeObjectURL(url);
            }}
            className="flex items-center gap-2 px-8 py-4 bg-[#6d6bd3] text-white rounded-xl hover:bg-[#5a59b8] transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            <Download className="w-5 h-5" />
            Download Roadmap
          </button>

          <button
            onClick={() => window.print()}
            className="flex items-center gap-2 px-8 py-4 bg-white text-gray-700 rounded-xl hover:bg-gray-50 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 border border-gray-200"
          >
            🖨️ Print Roadmap
          </button>
        </motion.div>

        {/* Footer Message */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="mt-12 text-center"
        >
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8 border border-blue-100">
            <p className="text-gray-700 text-lg mb-2">
              🎯 <strong>Personalized for {name}</strong>
            </p>
            <p className="text-gray-600">
              {school} • {major} • Path to {careerTitle}
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}