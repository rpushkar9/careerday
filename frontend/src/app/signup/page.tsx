'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation'; // Import router for navigation
import './signup.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import MajorJobFinder from '@/components/major-job-finder';

export default function StudentQuestionnaire() {
  const router = useRouter(); // Initialize router

  const [formData, setFormData] = useState({
    fullName: '',
    college: '',
    year: '',
    major: '',
    careerInterest: '',
    academicGoals: '',
    minorsOrDoubleMajors: '',
    coursesTaken: '',
  });

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = e => {
    e.preventDefault();
    console.log(formData); // Process the data here (e.g., send to backend)

    // Redirect to another page after form submission
    router.push('/recommendation'); // Change to the desired page URL
  };

  return (
    <>
      <main className="min-h-screen p-4 md:p-24 max-w-5xl mx-auto">
        <div className="space-y-7">
          <div className="text-center space-y-2">
            <div className="space-y-5">
              {' '}
              {/* Increased space here */}
              <h1 className="text-3xl font-bold tracking-tight">
                Academic Roadmap Generator
              </h1>
              <p className="text-muted-foreground">
                Enter your information to get a personalized academic roadmap
              </p>
            </div>
          </div>
          <MajorJobFinder />
        </div>
      </main>
    </>
  );
}
