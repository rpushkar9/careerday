'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import Year1Dashboard from '@/components/Year1Dashboard';
import type { Year1Data } from '@/components/Year1Dashboard';

export default function Year1DashboardPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const dataParam = searchParams.get('data');

  // ✅ FAKE DATA FOR TESTING
  const fakeYear1Data: Year1Data = {
    student: {
      name: "Sheyla",
      career_goal: "Social Science Research Assistant",
    },
    major: "Psychology",
    university: "University of Example",
    year: 1,
    totalYearCredits: 30,
    totalYearCost: 8900,
    fall: {
      courses: [
        { code: "PSY 101", name: "Introduction to Psychology", credits: 3 },
        { code: "ENG 101", name: "English Composition", credits: 3 },
        { code: "MATH 105", name: "Statistics for Behavioral Sciences", credits: 4 },
        { code: "BIO 110", name: "General Biology I", credits: 4 },
        { code: "PSY 120", name: "Research Methods in Psychology", credits: 3 },
      ],
      totalCredits: 17,
      tuition: 8250,
      opportunities: [
        "Join the Psychology Club",
        "Attend research talks hosted by the Social Sciences department",
      ],
      volunteerWork: ["Volunteer at local mental health center"],
      internships: [],
      projects: ["Mini research project using survey data"],
    },
    spring: {
      courses: [
        { code: "PSY 210", name: "Cognitive Psychology", credits: 3 },
        { code: "SOC 101", name: "Introduction to Sociology", credits: 3 },
        { code: "PSY 220", name: "Developmental Psychology", credits: 3 },
        { code: "BIO 120", name: "General Biology II", credits: 4 },
      ],
      totalCredits: 13,
      tuition: 7450,
      opportunities: [
        "Apply for summer research internships",
        "Attend RA training workshops",
      ],
      volunteerWork: ["Support youth outreach program"],
      internships: ["Part-time assistant at Behavioral Research Lab"],
      projects: ["Poster presentation at undergraduate research fair"],
    },
  };

  // ✅ Default values
  let dashboardData: Year1Data = fakeYear1Data;
  let studentName = fakeYear1Data.student?.name || 'Student';
  let careerTitle = fakeYear1Data.student?.career_goal || 'Career Goal';

  // ✅ Try to load from URL if valid
  try {
    if (dataParam) {
      const decodedData = JSON.parse(decodeURIComponent(dataParam));
      if (decodedData && decodedData.fall && decodedData.spring) {
        dashboardData = decodedData;
        studentName = decodedData.student?.name || 'Student';
        careerTitle = decodedData.student?.career_goal || 'Career Goal';
      } else {
        console.warn('Invalid dataParam, using fake data fallback');
      }
    } else {
      console.info('No dataParam found — using fake data.');
    }
  } catch (error) {
    console.error('Error parsing dashboard data, using fake fallback:', error);
  }

  return (
    <Year1Dashboard
      data={dashboardData}
      studentName={studentName}
      careerTitle={careerTitle}
      onBack={() => router.push('/roadmap')}
      onViewFullRoadmap={() => router.push('/roadmap')}
    />
  );
}
