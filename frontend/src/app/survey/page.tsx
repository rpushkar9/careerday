'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/navbar';
import { ENTRY_LEVEL_EDUCATION } from '@/constants/employmentProjection';

// Types for college and major data
interface CollegeMajorInfo {
  major_name: string;
  college_name: string;
  cip_code: string;
  industry: string;
  degree_type: string;
  median_earnings: number | null;
}

interface SurveyForm {
  university: string;
  major: string;
  cip_code: string;
  degree: string;
}

export default function SurveyPage() {
  const [colleges, setColleges] = useState<string[]>([]);
  const [majors, setMajors] = useState<string[]>([]);
  const [filteredMajors, setFilteredMajors] = useState<string[]>([]);
  const [majorCipMap, setMajorCipMap] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState<SurveyForm>({
    university: '',
    major: '',
    cip_code: '',
    degree: "Bachelor's degree",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Fetch colleges and majors on component mount
  useEffect(() => {
    fetchCollegesAndMajors();
  }, []);

  // Filter majors when university changes
  useEffect(() => {
    if (formData.university) {
      // In a real implementation, you'd filter majors based on what's actually offered at the selected university
      // For now, we'll show all majors since the API gives us the full list
      setFilteredMajors(majors);
    } else {
      setFilteredMajors([]);
    }
    setFormData(prev => ({ ...prev, major: '', cip_code: '' }));
  }, [formData.university, majors]);

  const fetchCollegesAndMajors = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Fetch real data from College Scorecard API
      const response = await fetch('/api/colleges');

      if (!response.ok) {
        throw new Error(`Failed to fetch data: ${response.statusText}`);
      }

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      // Extract unique colleges and majors from the API response
      const collegeData = data as CollegeMajorInfo[];
      const uniqueColleges = [
        ...new Set(collegeData.map(item => item.college_name)),
      ].sort();
      const uniqueMajors = [
        ...new Set(collegeData.map(item => item.major_name)),
      ].sort();

      // Create mapping from major name to CIP code (use first occurrence)
      const majorToCip: Record<string, string> = {};
      collegeData.forEach(item => {
        if (!majorToCip[item.major_name]) {
          majorToCip[item.major_name] = item.cip_code;
        }
      });

      setColleges(uniqueColleges);
      setMajors(uniqueMajors);
      setMajorCipMap(majorToCip);
    } catch (err) {
      setError('Failed to fetch colleges and majors. Please try again.');
      console.error('Error fetching data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.university || !formData.major) {
      setError('Please select both a university and major.');
      return;
    }

    if (!formData.cip_code) {
      setError('CIP code not found for selected major. Please try again.');
      return;
    }

    try {
      // Debug: Log what we're sending
      console.log('Survey form data:', formData);
      console.log('Major CIP mapping:', majorCipMap[formData.major]);

      // Submit the survey data
      const response = await fetch('/api/career-recommendations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          major: formData.major,
          university: formData.university,
          cip_code: formData.cip_code,
          degree: formData.degree,
          interests: [], // Will be expanded in future
          skills: [], // Will be expanded in future
          entry_level_education: formData.degree,
          work_experience: 'None',
          education_filter_type: 'hierarchy',
          experience_filter_type: 'hierarchy',
        }),
      });

      if (response.ok) {
        // Redirect to recommendations page with the CIP code as major_id
        router.push(
          `/recommendation?major_id=${encodeURIComponent(formData.cip_code)}&university=${encodeURIComponent(formData.university)}&major=${encodeURIComponent(formData.major)}`
        );
      } else {
        setError('Failed to submit survey. Please try again.');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
      console.error('Error submitting survey:', err);
    }
  };

  const handleInputChange = (field: keyof SurveyForm, value: string) => {
    if (field === 'major') {
      // When major changes, also set the corresponding CIP code
      setFormData(prev => ({
        ...prev,
        [field]: value,
        cip_code: majorCipMap[value] || '',
      }));
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
    setError(null);
  };

  return (
    <>
      <Navbar />
      <div className="relative bg-gradient-to-br from-[#6d6bd3] via-[#6d6bd3] to-[#6d6bd3] h-[200px] overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://public.readdy.ai/ai/img_res/0f842a5615fc80362a29e48bd4ce0497.jpg')] bg-cover bg-center opacity-20"></div>
        <div className="max-w-7xl mx-auto px-4 py-20 relative h-full flex items-center justify-center">
          <div className="text-white text-center z-10">
            <h1 className="text-4xl font-bold leading-tight mb-4">
              Career Survey
            </h1>
            <p className="text-lg mb-4">
              Tell us about your education to get personalized career
              recommendations
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto mt-10 p-6">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* University Selection */}
            <div>
              <label
                htmlFor="university"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Select Your University
              </label>
              <select
                id="university"
                value={formData.university}
                onChange={e => handleInputChange('university', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#6d6bd3] focus:border-[#6d6bd3]"
                required
                disabled={isLoading}
              >
                <option value="">
                  {isLoading
                    ? 'Loading universities...'
                    : 'Choose a university...'}
                </option>
                {colleges.map((college, index) => (
                  <option key={index} value={college}>
                    {college}
                  </option>
                ))}
              </select>
            </div>

            {/* Major Selection */}
            <div>
              <label
                htmlFor="major"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Select Your Major
              </label>
              <select
                id="major"
                value={formData.major}
                onChange={e => handleInputChange('major', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#6d6bd3] focus:border-[#6d6bd3]"
                required
                disabled={!formData.university || isLoading}
              >
                <option value="">
                  {!formData.university
                    ? 'Please select a university first'
                    : isLoading
                      ? 'Loading majors...'
                      : 'Choose a major...'}
                </option>
                {filteredMajors.map((major, index) => (
                  <option key={index} value={major}>
                    {major}
                  </option>
                ))}
              </select>
            </div>

            {/* Degree Selection */}
            <div>
              <label
                htmlFor="degree"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Select Your Degree Level
              </label>
              <select
                id="degree"
                value={formData.degree}
                onChange={e => handleInputChange('degree', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#6d6bd3] focus:border-[#6d6bd3]"
                required
                disabled={isLoading}
              >
                <option value="">
                  {isLoading ? 'Loading degrees...' : 'Choose a degree...'}
                </option>
                {ENTRY_LEVEL_EDUCATION.map((degree, index) => (
                  <option key={index} value={degree}>
                    {degree}
                  </option>
                ))}
              </select>
            </div>

            {/* Error Display */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={!formData.university || !formData.major || isLoading}
              className="w-full bg-[#6d6bd3] text-white py-3 px-4 rounded-md hover:bg-[#5a58b8] transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Loading...' : 'Get Career Recommendations'}
            </button>
          </form>

          {/* Info Section */}
          <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-md">
            <h3 className="text-sm font-medium text-blue-800 mb-2">
              How it works:
            </h3>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Select your university from our database</li>
              <li>• Choose your major or field of study</li>
              <li>
                • Get personalized career recommendations based on your
                education
              </li>
              <li>
                • Explore career paths, salaries, and growth opportunities
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}
