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


//Step 1
// 'use client';

// import { useSearchParams } from 'next/navigation';
// import { useEffect, useState, useRef } from 'react';
// import { motion } from 'framer-motion';
// import { 
//   Calendar, 
//   BookOpen, 
//   Target, 
//   TrendingUp, 
//   Award,
//   Download,
//   ChevronRight,
//   CheckCircle2,
//   Clock
// } from 'lucide-react';

// type RoadmapResponse = {
//   success: boolean;
//   roadmap: string;
//   student: {
//     name: string;
//     school: string;
//     major: string;
//   };
//   career: {
//     title: string;
//   };
// };

// export default function RoadmapPage() {
//   const searchParams = useSearchParams();
//   const [roadmap, setRoadmap] = useState<string>('');
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string>('');
//   const hasGeneratedRef = useRef(false);

//   // Get all data from URL params
//   const name = searchParams.get('name') || 'Student';
//   const school = searchParams.get('school') || '';
//   const major = searchParams.get('major') || '';
//   const careerTitle = searchParams.get('career_title') || '';
//   const salary = searchParams.get('salary') || 'N/A';
//   const growth = searchParams.get('growth') || 'N/A';

//   useEffect(() => {
//     if (hasGeneratedRef.current) return;

//     const generateRoadmap = async () => {
//       try {
//         setLoading(true);
//         setError('');

//         const response = await fetch('http://localhost:8000/api/generate-roadmap', {
//           method: 'POST',
//           headers: { 'Content-Type': 'application/json' },
//           body: JSON.stringify({
//             name: searchParams.get('name'),
//             email: searchParams.get('email'),
//             school,
//             major,
//             year: searchParams.get('year'),
//             skills: searchParams.get('skills')?.split(',') || [],
//             interests: searchParams.get('interests'),
//             career_goals: searchParams.get('career_goals'),
//             career_title: careerTitle,
//             soc_code: searchParams.get('soc_code'),
//             career_description: searchParams.get('career_description'),
//             salary,
//             growth,
//           }),
//         });

//         if (!response.ok) throw new Error('Failed to generate roadmap');

//         const data: RoadmapResponse = await response.json();
//         setRoadmap(data.roadmap);
//         hasGeneratedRef.current = true;
//       } catch (err) {
//         setError(err instanceof Error ? err.message : 'An error occurred');
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (careerTitle && school && major) {
//       generateRoadmap();
//     } else {
//       setError('Missing required information.');
//       setLoading(false);
//     }
//   }, []);

//   // Parse roadmap into structured sections
//   const parseRoadmap = (text: string) => {
//     const lines = text.split('\n');
//     const sections: Array<{ title: string; content: string[] }> = [];
//     let currentSection: { title: string; content: string[] } | null = null;

//     lines.forEach(line => {
//       if (line.startsWith('##')) {
//         if (currentSection) sections.push(currentSection);
//         currentSection = { title: line.replace('##', '').trim(), content: [] };
//       } else if (currentSection && line.trim()) {
//         currentSection.content.push(line.trim());
//       }
//     });

//     if (currentSection) sections.push(currentSection);
//     return sections;
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-6">
//         <motion.div
//           initial={{ opacity: 0, scale: 0.9 }}
//           animate={{ opacity: 1, scale: 1 }}
//           className="text-center max-w-md"
//         >
//           <div className="relative mb-8">
//             <div className="w-24 h-24 mx-auto border-4 border-[#6d6bd3]/30 border-t-[#6d6bd3] rounded-full animate-spin"></div>
//             <Target className="w-12 h-12 text-[#6d6bd3] absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
//           </div>
//           <h2 className="text-3xl font-bold text-[#6d6bd3] mb-3">
//             Crafting Your Roadmap
//           </h2>
//           <p className="text-gray-600 text-lg">
//             Analyzing your profile and building a personalized career path...
//           </p>
//           <p className="text-gray-500 text-sm mt-2">This takes 30-60 seconds</p>
//         </motion.div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-red-50 to-white flex items-center justify-center p-6">
//         <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
//           <div className="text-center">
//             <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
//               <span className="text-3xl">⚠️</span>
//             </div>
//             <h2 className="text-2xl font-bold text-red-600 mb-2">Oops!</h2>
//             <p className="text-gray-600 mb-6">{error}</p>
//             <button
//               onClick={() => window.history.back()}
//               className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
//             >
//               Go Back
//             </button>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   const sections = parseRoadmap(roadmap);

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
//       {/* Hero Section */}
//       <div className="bg-gradient-to-r from-[#6d6bd3] to-[#5a59b8] text-white py-16 px-6">
//         <div className="max-w-5xl mx-auto">
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.5 }}
//           >
//             <button
//               onClick={() => window.history.back()}
//               className="text-white/80 hover:text-white mb-6 flex items-center gap-2 transition-colors"
//             >
//               ← Back to Career Matches
//             </button>
            
//             <div className="flex items-center gap-3 mb-4">
//               <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
//                 <Target className="w-8 h-8" />
//               </div>
//               <h1 className="text-5xl font-bold">Your Career Roadmap</h1>
//             </div>

//             <div className="grid md:grid-cols-3 gap-6 mt-8">
//               <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
//                 <div className="flex items-center gap-3 mb-2">
//                   <Award className="w-6 h-6" />
//                   <h3 className="font-semibold text-lg">Career Goal</h3>
//                 </div>
//                 <p className="text-white/90 text-xl font-bold">{careerTitle}</p>
//               </div>

//               <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
//                 <div className="flex items-center gap-3 mb-2">
//                   <TrendingUp className="w-6 h-6" />
//                   <h3 className="font-semibold text-lg">Salary Range</h3>
//                 </div>
//                 <p className="text-white/90 text-xl font-bold">{salary}</p>
//               </div>

//               <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
//                 <div className="flex items-center gap-3 mb-2">
//                   <BookOpen className="w-6 h-6" />
//                   <h3 className="font-semibold text-lg">Your Major</h3>
//                 </div>
//                 <p className="text-white/90 text-xl font-bold">{major}</p>
//               </div>
//             </div>
//           </motion.div>
//         </div>
//       </div>

//       {/* Roadmap Content */}
//       <div className="max-w-5xl mx-auto px-6 py-12">
//         <div className="space-y-8">
//           {sections.map((section, index) => (
//             <motion.div
//               key={index}
//               initial={{ opacity: 0, y: 30 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ delay: index * 0.1 }}
//               className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100"
//             >
//               <div className="bg-gradient-to-r from-[#6d6bd3]/10 to-purple-50 p-6 border-b border-gray-100">
//                 <div className="flex items-start gap-4">
//                   <div className="flex-shrink-0">
//                     <div className="w-12 h-12 bg-[#6d6bd3] rounded-xl flex items-center justify-center text-white font-bold text-lg">
//                       {index + 1}
//                     </div>
//                   </div>
//                   <div className="flex-1">
//                     <h2 className="text-2xl font-bold text-gray-900 mb-2">
//                       {section.title}
//                     </h2>
//                     {index < sections.length - 1 && (
//                       <div className="flex items-center gap-2 text-sm text-gray-500">
//                         <Clock className="w-4 h-4" />
//                         <span>Step {index + 1} of {sections.length}</span>
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               </div>

//               <div className="p-6 space-y-4">
//                 {section.content.map((item, itemIndex) => {
//                   const isBullet = item.startsWith('-') || item.startsWith('•');
//                   const cleanItem = isBullet ? item.substring(1).trim() : item;
                  
//                   return (
//                     <div
//                       key={itemIndex}
//                       className={`flex items-start gap-3 ${
//                         isBullet ? 'pl-4' : ''
//                       }`}
//                     >
//                       {isBullet && (
//                         <CheckCircle2 className="w-5 h-5 text-[#6d6bd3] flex-shrink-0 mt-0.5" />
//                       )}
//                       <p className="text-gray-700 leading-relaxed flex-1">
//                         {cleanItem}
//                       </p>
//                     </div>
//                   );
//                 })}
//               </div>

//               {index < sections.length - 1 && (
//                 <div className="px-6 pb-6">
//                   <div className="flex items-center justify-center">
//                     <ChevronRight className="w-6 h-6 text-[#6d6bd3]" />
//                   </div>
//                 </div>
//               )}
//             </motion.div>
//           ))}
//         </div>

//         {/* Action Buttons */}
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 0.5 }}
//           className="mt-12 flex flex-wrap gap-4 justify-center"
//         >
//           <button
//             onClick={() => {
//               const blob = new Blob([roadmap], { type: 'text/markdown' });
//               const url = URL.createObjectURL(blob);
//               const a = document.createElement('a');
//               a.href = url;
//               a.download = `${careerTitle.replace(/\s+/g, '-')}-Roadmap.md`;
//               a.click();
//               URL.revokeObjectURL(url);
//             }}
//             className="flex items-center gap-2 px-8 py-4 bg-[#6d6bd3] text-white rounded-xl hover:bg-[#5a59b8] transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
//           >
//             <Download className="w-5 h-5" />
//             Download Roadmap
//           </button>

//           <button
//             onClick={() => window.print()}
//             className="flex items-center gap-2 px-8 py-4 bg-white text-gray-700 rounded-xl hover:bg-gray-50 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 border border-gray-200"
//           >
//             🖨️ Print Roadmap
//           </button>
//         </motion.div>

//         {/* Footer Message */}
//         <motion.div
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           transition={{ delay: 0.7 }}
//           className="mt-12 text-center"
//         >
//           <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8 border border-blue-100">
//             <p className="text-gray-700 text-lg mb-2">
//               🎯 <strong>Personalized for {name}</strong>
//             </p>
//             <p className="text-gray-600">
//               {school} • {major} • Path to {careerTitle}
//             </p>
//           </div>
//         </motion.div>
//       </div>
//     </div>
//   );
// }


// app/roadmap/page.tsx
'use client';
import { useSearchParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, Sparkles, ArrowRight, Download, RefreshCw } from 'lucide-react';

export default function RoadmapPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [aiRoadmap, setAiRoadmap] = useState('');
  const [showAiRoadmap, setShowAiRoadmap] = useState(false);

  // Get user data from URL params
  const studentName = searchParams.get('name') || searchParams.get('career_title') || 'Student';
  const university = searchParams.get('university') || searchParams.get('school') || '';
  const major = searchParams.get('major') || '';
  const careerGoal = searchParams.get('career') || searchParams.get('career_title') || '';
  
  // Get career data from URL
  const careerTitle = searchParams.get('career_title') || careerGoal;
  const careerDescription = searchParams.get('career_description') || '';
  const salary = searchParams.get('salary') || 'N/A';
  const growth = searchParams.get('growth') || 'N/A';
  const socCode = searchParams.get('soc_code') || '';

  useEffect(() => {
    // Auto-generate AI roadmap when page loads
    if (careerTitle) {
      generateAiRoadmap();
    }
  }, []);

  const generateAiRoadmap = async () => {
    setLoading(true);

    try {
      // Get user profile from localStorage
      const userStr = localStorage.getItem('user');
      if (!userStr) {
        console.error('No user found');
        return;
      }

      const user = JSON.parse(userStr);
      const profile = user.profile || {};

      // Prepare request data
      const requestData = {
        name: user.name || user.email || studentName,
        email: user.email || profile.email || '',
        school: profile.school || university || 'Queens College',
        major: profile.major || major || 'Computer Science',
        year: profile.year || 'Freshman',
        skills: profile.skills || [],
        interests: profile.passions || profile.interests || 'Technology',
        career_goals: profile.career_goals || `Become a ${careerTitle}`,
        career_title: careerTitle,
        soc_code: socCode,
        career_description: careerDescription,
        salary: salary,
        growth: growth
      };

      console.log('Generating AI roadmap with:', requestData);

      // Call the backend API
      const response = await fetch('http://localhost:5001/api/generate-roadmap', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to generate roadmap');
      }

      const data = await response.json();
      console.log('AI Roadmap generated:', data);

      if (data.success && data.roadmap) {
        setAiRoadmap(data.roadmap);
        setShowAiRoadmap(true);
      }
      
    } catch (err) {
      console.error('Error generating AI roadmap:', err);
      alert('Failed to generate AI roadmap. Make sure the backend is running on port 5001.');
    } finally {
      setLoading(false);
    }
  };

  const handleViewYear1 = async () => {
    setLoading(true);
    
    try {
      // Call backend API to scrape Year 1 data
      const response = await fetch('http://localhost:5001/api/scrape-year1-data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          university: university,
          major: major,
          career_goal: careerGoal,
          student_name: studentName,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch Year 1 data');
      }

      const year1Data = await response.json();
      
      // Add student info to the data
      year1Data.student = {
        name: studentName,
        career_goal: careerGoal,
      };

      // Navigate to Year 1 Dashboard with data
      const encodedData = encodeURIComponent(JSON.stringify(year1Data));
      router.push(`/year1-dashboard?data=${encodedData}`);
      
    } catch (error) {
      console.error('Error loading Year 1 dashboard:', error);
      alert('Failed to load Year 1 dashboard. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const downloadRoadmap = () => {
    const blob = new Blob([aiRoadmap], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `career-roadmap-${careerTitle.replace(/\s+/g, '-')}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <GraduationCap className="w-12 h-12 text-[#6d6bd3]" />
            <h1 className="text-5xl font-bold text-gray-900">Your Career Roadmap</h1>
          </div>
          <p className="text-xl text-gray-600">
            {studentName}'s path to becoming a {careerTitle || careerGoal}
          </p>
          <p className="text-gray-500 mt-2">
            {major} at {university}
          </p>
        </motion.div>

        {/* AI Roadmap Section */}
        {showAiRoadmap && aiRoadmap && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-3xl font-bold text-gray-900">AI-Generated Career Roadmap</h2>
              <div className="flex gap-3">
                <button
                  onClick={downloadRoadmap}
                  className="bg-white border-2 border-[#6d6bd3] text-[#6d6bd3] px-4 py-2 rounded-xl font-semibold hover:bg-[#6d6bd3] hover:text-white transition-colors flex items-center gap-2"
                >
                  <Download className="w-5 h-5" />
                  Download
                </button>
                <button
                  onClick={generateAiRoadmap}
                  disabled={loading}
                  className="bg-white border-2 border-gray-300 text-gray-700 px-4 py-2 rounded-xl font-semibold hover:bg-gray-50 transition-colors flex items-center gap-2 disabled:opacity-50"
                >
                  <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                  Regenerate
                </button>
              </div>
            </div>
            
            <div className="bg-white rounded-2xl shadow-xl p-8 prose prose-lg max-w-none prose-headings:text-[#6d6bd3] prose-a:text-[#6d6bd3]">
              {aiRoadmap.split('\n').map((line, index) => {
                if (line.startsWith('# ')) {
                  return <h1 key={index} className="text-3xl font-bold text-[#6d6bd3] mt-8 mb-4">{line.substring(2)}</h1>;
                } else if (line.startsWith('## ')) {
                  return <h2 key={index} className="text-2xl font-bold text-[#6d6bd3] mt-6 mb-3">{line.substring(3)}</h2>;
                } else if (line.startsWith('### ')) {
                  return <h3 key={index} className="text-xl font-bold text-gray-900 mt-4 mb-2">{line.substring(4)}</h3>;
                } else if (line.startsWith('**') && line.endsWith('**')) {
                  return <p key={index} className="font-bold text-gray-900 mt-3">{line.substring(2, line.length - 2)}</p>;
                } else if (line.startsWith('- ')) {
                  return <li key={index} className="ml-6 text-gray-700">{line.substring(2)}</li>;
                } else if (line.trim()) {
                  return <p key={index} className="text-gray-700 my-2">{line}</p>;
                }
                return <br key={index} />;
              })}
            </div>
          </motion.div>
        )}

        {/* Loading State */}
        {loading && !aiRoadmap && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="w-16 h-16 border-4 border-[#6d6bd3] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-xl text-gray-600">Generating your personalized roadmap...</p>
          </motion.div>
        )}

        {/* Year 1 Highlight Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-[#6d6bd3] to-[#5a59b8] text-white rounded-3xl shadow-2xl p-8 mb-12 relative overflow-hidden"
        >
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-24 -translate-x-24"></div>
          
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <Sparkles className="w-8 h-8" />
              <h2 className="text-3xl font-bold">Year 1 Deep Dive</h2>
            </div>
            
            <p className="text-white/90 text-lg mb-6 max-w-2xl">
              Get a detailed breakdown of your first year with course schedules, 
              tuition information, career opportunities, and personalized guidance.
            </p>

            <div className="grid md:grid-cols-3 gap-4 mb-8">
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
                <div className="text-2xl font-bold mb-1">📚 Courses</div>
                <div className="text-white/80 text-sm">Detailed course breakdown</div>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
                <div className="text-2xl font-bold mb-1">💼 Opportunities</div>
                <div className="text-white/80 text-sm">Internships & projects</div>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
                <div className="text-2xl font-bold mb-1">💰 Budget</div>
                <div className="text-white/80 text-sm">Real tuition estimates</div>
              </div>
            </div>

            <button
              onClick={handleViewYear1}
              disabled={loading}
              className="flex items-center gap-3 px-8 py-4 bg-white text-[#6d6bd3] rounded-xl font-bold text-lg hover:shadow-2xl transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-[#6d6bd3] border-t-transparent rounded-full animate-spin"></div>
                  Loading Your Dashboard...
                </>
              ) : (
                <>
                  View Year 1 Dashboard
                  <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                </>
              )}
            </button>
          </div>
        </motion.div>

        {/* Rest of your existing roadmap content */}
        <div className="space-y-8">
          {/* Your existing 4-year roadmap visualization */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">4-Year Overview</h3>
            {/* Your existing roadmap timeline/cards */}
          </div>
        </div>

        {/* Back Button */}
        <div className="text-center mt-8">
          <button
            onClick={() => router.push('/career-matches')}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-8 py-3 rounded-xl font-semibold transition-colors"
          >
            Back to Career Matches
          </button>
        </div>
      </div>
    </div>
  );
}