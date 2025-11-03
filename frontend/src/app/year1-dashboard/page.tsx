'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import Year1Dashboard from '@/components/Year1Dashboard';
import type { Year1Data } from '@/components/Year1Dashboard';
import { useState, useEffect } from 'react';

export default function Year1DashboardPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // State to hold dashboard data
  const [dashboardData, setDashboardData] = useState<Year1Data | null>(null);
  const [studentName, setStudentName] = useState('Student');
  const [careerTitle, setCareerTitle] = useState('Career Goal');

  // FAKE DATA FOR FALLBACK
  const fakeYear1Data: Year1Data = {
    student: { name: 'Sheyla', career_goal: 'Social Science Research Assistant' },
    major: 'Psychology',
    university: 'University of Example',
    year: 1,
    totalYearCredits: 30,
    totalYearCost: 8900,
    fall: {
      courses: [
        { code: 'PSY 101', name: 'Introduction to Psychology', credits: 3 },
        { code: 'ENG 101', name: 'English Composition', credits: 3 },
        { code: 'MATH 105', name: 'Statistics for Behavioral Sciences', credits: 4 },
        { code: 'BIO 110', name: 'General Biology I', credits: 4 },
        { code: 'PSY 120', name: 'Research Methods in Psychology', credits: 3 },
      ],
      totalCredits: 17,
      tuition: 8250,
      opportunities: [
        'Join the Psychology Club',
        'Attend research talks hosted by the Social Sciences department',
      ],
      volunteerWork: ['Volunteer at local mental health center'],
      internships: [],
      projects: ['Mini research project using survey data'],
    },
    spring: {
      courses: [
        { code: 'PSY 210', name: 'Cognitive Psychology', credits: 3 },
        { code: 'SOC 101', name: 'Introduction to Sociology', credits: 3 },
        { code: 'PSY 220', name: 'Developmental Psychology', credits: 3 },
        { code: 'BIO 120', name: 'General Biology II', credits: 4 },
      ],
      totalCredits: 13,
      tuition: 7450,
      opportunities: [
        'Apply for summer research internships',
        'Attend RA training workshops',
      ],
      volunteerWork: ['Support youth outreach program'],
      internships: ['Part-time assistant at Behavioral Research Lab'],
      projects: ['Poster presentation at undergraduate research fair'],
    },
  };

  // Parse URL param on mount
  useEffect(() => {
    const dataParam = searchParams.get('data');
    if (dataParam) {
      try {
        const decodedData = JSON.parse(decodeURIComponent(dataParam));
        if (decodedData && decodedData.fall && decodedData.spring) {
          setDashboardData(decodedData);
          setStudentName(decodedData.student?.name || 'Student');
          setCareerTitle(decodedData.student?.career_goal || 'Career Goal');
          return;
        }
        console.warn('Invalid dataParam, using fake data fallback');
      } catch (err) {
        console.error('Error parsing dataParam, using fake data fallback:', err);
      }
    }

    // fallback to fake data
    setDashboardData(fakeYear1Data);
    setStudentName(fakeYear1Data.student?.name || 'Student');
    setCareerTitle(fakeYear1Data.student?.career_goal || 'Career Goal');
  }, [searchParams]);

  // Render nothing until dashboardData is ready
  if (!dashboardData) return null;

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
