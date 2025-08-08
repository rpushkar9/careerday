import { Roadmap } from '@/components/roadmap'; // Adjust path according to your project structure
import type { RoadmapData } from '@/lib/types'; // Import the types as needed
import './step.css';
import Navbar from '@/components/navbar';

// Example roadmap data to pass into the component
const roadmapData: RoadmapData = {
  major: 'Computer Science',
  university: 'Queens College',
  totalDegreeCredits: 120,
  totalDegreeCost: 50000,
  years: {
    year1: {
      totalCost: 12000,
      fall: {
        totalCredits: 15,
        tuition: 6000,
        courses: [
          { code: 'CS101', name: 'Intro to CS', credits: 3 },
          { code: 'MATH101', name: 'Calculus I', credits: 3 },
          { code: 'ENG101', name: 'English Composition', credits: 3 },
          { code: 'HIST101', name: 'World History', credits: 3 },
          { code: 'PE101', name: 'Physical Education', credits: 3 },
        ],
        opportunities: ['Hackathon 1', 'CS Club', 'Tech Talk'],
        volunteerWork: ['Library Assistant', 'Community Outreach'],
        internships: ['Summer Internship at TechCorp'],
        projects: ['Personal Portfolio Website', 'Beginner Coding Project'],
      },
      spring: {
        totalCredits: 15,
        tuition: 6000,
        courses: [
          { code: 'CS102', name: 'Data Structures', credits: 3 },
          { code: 'MATH102', name: 'Calculus II', credits: 3 },
          { code: 'ENG102', name: 'Advanced Composition', credits: 3 },
          { code: 'PSY101', name: 'Intro to Psychology', credits: 3 },
          { code: 'CS103', name: 'Intro to Web Development', credits: 3 },
        ],
        opportunities: ['Tech Talk 1', 'Career Fair'],
        volunteerWork: ['Community Volunteer', 'Tutoring at School'],
        internships: ['Spring Internship at CodeLab'],
        projects: ['Machine Learning Project', 'Personal Website Enhancement'],
      },
    },
    year2: {
      totalCost: 13000,
      fall: {
        totalCredits: 15,
        tuition: 6500,
        courses: [
          { code: 'CS201', name: 'Algorithms', credits: 3 },
          { code: 'CS202', name: 'Discrete Mathematics', credits: 3 },
          { code: 'MATH201', name: 'Linear Algebra', credits: 3 },
          { code: 'PHIL101', name: 'Introduction to Philosophy', credits: 3 },
          { code: 'BIO101', name: 'Intro to Biology', credits: 3 },
        ],
        opportunities: ['Tech Internship 1', 'Student Research', 'Hackathon 2'],
        volunteerWork: ['Mentoring Program', 'Community Outreach'],
        internships: ['Internship at TechCo', 'Research Assistant at Lab'],
        projects: ['Algorithm Optimization', 'Open-Source Contribution'],
      },
      spring: {
        totalCredits: 15,
        tuition: 6500,
        courses: [
          { code: 'CS203', name: 'Operating Systems', credits: 3 },
          { code: 'CS204', name: 'Database Systems', credits: 3 },
          { code: 'ENG201', name: 'Technical Writing', credits: 3 },
          { code: 'MATH202', name: 'Probability & Statistics', credits: 3 },
          { code: 'PE102', name: 'Physical Education II', credits: 3 },
        ],
        opportunities: ['Hackathon 3', 'Coding Bootcamp'],
        volunteerWork: ['Tutoring Program', 'Food Bank Volunteer'],
        internships: ['Internship at SoftWorks', 'Database Admin Assistant'],
        projects: ['OS Simulation Project', 'Database Management Project'],
      },
    },
    year3: {
      totalCost: 14000,
      fall: {
        totalCredits: 15,
        tuition: 7000,
        courses: [
          { code: 'CS301', name: 'Computer Networks', credits: 3 },
          { code: 'CS302', name: 'Software Engineering', credits: 3 },
          { code: 'CS303', name: 'Artificial Intelligence', credits: 3 },
          { code: 'MATH301', name: 'Advanced Calculus', credits: 3 },
          { code: 'PSY301', name: 'Cognitive Psychology', credits: 3 },
        ],
        opportunities: ['Internship Fair', 'Career Development Workshop'],
        volunteerWork: [
          'Mentor for Younger Students',
          'Tutoring High School Students',
        ],
        internships: [
          'Tech Internship at Google',
          'Software Engineering Intern at XYZ Corp',
        ],
        projects: ['AI Chatbot', 'Software Development Lifecycle Simulation'],
      },
      spring: {
        totalCredits: 15,
        tuition: 7000,
        courses: [
          { code: 'CS304', name: 'Cybersecurity', credits: 3 },
          { code: 'CS305', name: 'Mobile App Development', credits: 3 },
          { code: 'MATH302', name: 'Mathematical Modeling', credits: 3 },
          { code: 'ENG301', name: 'Advanced Technical Writing', credits: 3 },
          { code: 'SOC101', name: 'Introduction to Sociology', credits: 3 },
        ],
        opportunities: ['Internship in Cybersecurity', 'App Development Club'],
        volunteerWork: ['Local Tech Meetups', 'Non-profit Web Development'],
        internships: [
          'Cybersecurity Internship at InfoSec Corp',
          'Mobile App Developer Intern',
        ],
        projects: [
          'Mobile App for Students',
          'Web Security Enhancement Project',
        ],
      },
    },
    year4: {
      totalCost: 15000,
      fall: {
        totalCredits: 15,
        tuition: 7500,
        courses: [
          { code: 'CS401', name: 'Cloud Computing', credits: 3 },
          { code: 'CS402', name: 'Big Data', credits: 3 },
          { code: 'CS403', name: 'Capstone Project', credits: 3 },
          { code: 'MATH401', name: 'Advanced Statistics', credits: 3 },
          { code: 'CS404', name: 'Advanced Software Engineering', credits: 3 },
        ],
        opportunities: ['Career Fairs', 'Job Shadowing', 'Start-Up Incubator'],
        volunteerWork: ['Tech Mentor', 'Developer at Open Source Projects'],
        internships: [
          'Capstone Project at XYZ Corp',
          'Cloud Engineer Internship',
        ],
        projects: ['Cloud-Based Application', 'Big Data Analytics Project'],
      },
      spring: {
        totalCredits: 15,
        tuition: 7500,
        courses: [
          { code: 'CS405', name: 'Machine Learning', credits: 3 },
          { code: 'CS406', name: 'Blockchain Development', credits: 3 },
          { code: 'ENG402', name: 'Business Communication', credits: 3 },
          { code: 'PHIL301', name: 'Ethics in Technology', credits: 3 },
          { code: 'CS407', name: 'Human-Computer Interaction', credits: 3 },
        ],
        opportunities: ['Hackathon 4', 'Start-Up Mentoring', 'Tech Job Fairs'],
        volunteerWork: ['Open-Source Contributor', 'Mentor for Interns'],
        internships: [
          'Blockchain Developer Internship',
          'Machine Learning Intern',
        ],
        projects: ['Blockchain Application', 'HCI Research Paper'],
      },
    },
  },
};

export default function StepNumberPage() {
  return (
    <>
      <Navbar />
      <div className="container mx-auto p-4 mt-8">
        {' '}
        {/* Added margin-top to create space */}
        <h1 className="text-2xl font-bold mb-4">Step: Academic Roadmap</h1>
        {/* Pass the roadmap data to the Roadmap component */}
        <Roadmap data={roadmapData} />
      </div>
    </>
  );
}
