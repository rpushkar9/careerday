'use client';
import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Navbar from '@/components/navbar';

// Define a Job type
type Job = {
  title: string;
  description: string;
  salary: string;
  growth: string;
  matchScore: number;
};

function RecommendedJobsContent() {
  const [recommendedJobs, setRecommendedJobs] = useState<Job[]>([]); // Use the Job type
  const [university, setUniversity] = useState('');
  const [major, setMajor] = useState('');
  const [majorId, setMajorId] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [hasAttemptedFetch, setHasAttemptedFetch] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  // Read query parameters on component mount
  useEffect(() => {
    const universityParam = searchParams.get('university');
    const majorParam = searchParams.get('major');
    const majorIdParam = searchParams.get('major_id');

    if (universityParam) setUniversity(universityParam);
    if (majorParam) setMajor(majorParam);
    if (majorIdParam) setMajorId(majorIdParam);
  }, [searchParams]);

  useEffect(() => {
    // Fetch career recommendations from API
    const fetchRecommendations = async () => {
      // Check if we have the required CIP code
      if (!majorId) {
        console.error('No CIP code provided');
        setIsLoading(false);
        setHasAttemptedFetch(true);
        return;
      }

      setIsLoading(true);
      setHasAttemptedFetch(true);
      try {
        const response = await fetch('/api/career-recommendations', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            major: major || 'Computer Science', // Use major from survey or default
            cip_code: majorId || '', // Use CIP code from survey
            interests: ['technology', 'problem-solving'],
            skills: ['programming', 'analytics'],
            university: university || 'General',
            entry_level_education: "Bachelor's degree",
            // No need to pass work_experience since it is "None" by default
          }),
        });

        if (response.ok) {
          const data = await response.json();

          // Check if the response contains an error
          if (data.error) {
            console.error('API returned error:', data.error);
            setRecommendedJobs([]); // Clear jobs to show error state
            return;
          }

          console.log('Setting recommended jobs:', data);
          setRecommendedJobs(data);
        } else {
          console.error('Failed to fetch recommendations');
          setRecommendedJobs([]); // Clear jobs to show error state
        }
      } catch (error) {
        console.error('Error fetching recommendations:', error);
        setRecommendedJobs([]); // Clear jobs to show error state
      } finally {
        console.log('Setting loading to false, hasAttemptedFetch:', true);
        setIsLoading(false);
      }
    };

    fetchRecommendations();
  }, [university, majorId, major]);

  const handleLearnMore = (job: Job) => {
    // Use router.push to navigate to a detailed page for the selected job
    router.push(`/roadmap?career=${encodeURIComponent(job.title)}`);
  };

  // Debug: Log current state
  console.log('Render state:', {
    isLoading,
    hasAttemptedFetch,
    recommendedJobsLength: recommendedJobs.length,
  });

  return (
    <>
      <Navbar />
      <div className="relative bg-gradient-to-br from-[#6d6bd3] via-[#6d6bd3] to-[#6d6bd3] h-[200px] overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://public.readdy.ai/ai/img_res/0f842a5615fc80362a29e48bd4ce0497.jpg')] bg-cover bg-center opacity-20"></div>
        <div className="max-w-7xl mx-auto px-4 py-20 relative h-full flex items-center justify-center">
          <div className="text-white text-center z-10">
            <h1 className="text-4xl font-bold leading-tight mb-4">
              Your Top 3 Career Matches
            </h1>
            <p className="text-lg mb-4">
              Personalized recommendations based on your profile
            </p>
          </div>
        </div>
      </div>
      <div className="max-w-3xl mx-auto mt-10 p-6 space-y-6">
        {isLoading ? (
          <div className="text-center py-12">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-8">
              <h2 className="text-2xl font-bold text-blue-800 mb-4">
                Generating Your Recommendations...
              </h2>
              <p className="text-blue-600 mb-6">
                Our AI is analyzing your major and finding the best career
                matches for you.
              </p>
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            </div>
          </div>
        ) : !majorId ? (
          <div className="text-center py-12">
            <div className="bg-red-50 border border-red-200 rounded-lg p-8">
              <h2 className="text-2xl font-bold text-red-800 mb-4">
                Missing Information
              </h2>
              <p className="text-red-600 mb-6">
                No major/CIP code provided. Please go back to the survey to
                select your major.
              </p>
              <button
                onClick={() => router.push('/survey')}
                className="bg-[#6d6bd3] text-white px-6 py-3 rounded-md hover:bg-[#5a58b8] transition-colors"
              >
                Go to Survey
              </button>
            </div>
          </div>
        ) : recommendedJobs.length === 0 ? (
          <div className="text-center py-12">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-8">
              <h2 className="text-2xl font-bold text-yellow-800 mb-4">
                No Recommendations Found
              </h2>
              <p className="text-yellow-600 mb-6">
                We couldn't find career recommendations for your major and
                degree level. This might be due to insufficient data or specific
                filtering requirements.
              </p>
              <button
                onClick={() => router.push('/survey')}
                className="bg-[#6d6bd3] text-white px-6 py-3 rounded-md hover:bg-[#5a58b8] transition-colors"
              >
                Try Different Options
              </button>
            </div>
          </div>
        ) : (
          recommendedJobs
            .sort((a, b) => b.matchScore - a.matchScore) // sort by best match
            .slice(0, 3) // take top 3
            .map((job, index) => (
              <div
                key={index}
                className="border rounded-lg p-6 grid grid-cols-1 md:grid-cols-3 gap-4 items-center bg-white shadow-sm"
              >
                <div className="md:col-span-2">
                  <h3 className="text-lg font-semibold flex items-center mb-2">
                    <span className="mr-2">💼</span> {job.title}
                  </h3>
                  <p className="text-gray-600">
                    {job.description || 'Description not available'}
                  </p>
                  {job.matchScore && (
                    <div className="mt-2">
                      <div className="flex items-center">
                        <span className="text-sm font-medium mr-2">
                          Match Score:
                        </span>
                        <div className="w-full bg-gray-200 rounded-full h-2.5 mr-2 max-w-[150px]">
                          <div
                            className="bg-[#6d6bd3] h-2.5 rounded-full"
                            style={{ width: `${job.matchScore}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium">
                          {job.matchScore}%
                        </span>
                      </div>
                    </div>
                  )}
                </div>
                <div className="text-right">
                  {job.salary ? (
                    <p className="text-sm text-gray-700 mb-1">
                      <span className="font-semibold">
                        Median Yearly Income:
                      </span>{' '}
                      {job.salary}
                    </p>
                  ) : (
                    <p className="text-sm text-gray-500 mb-1 italic">
                      Median Yearly Income: Not Available
                    </p>
                  )}

                  {job.growth ? (
                    <p className="text-sm text-gray-700 mb-2">
                      <span className="font-semibold">
                        Projected Job Growth:
                      </span>{' '}
                      {job.growth}
                    </p>
                  ) : (
                    <p className="text-sm text-gray-500 mb-2 italic">
                      Projected Job Growth: Not Available
                    </p>
                  )}

                  <button
                    onClick={() => handleLearnMore(job)}
                    className="mt-2 bg-[#6d6bd3] text-white px-4 py-2 rounded-md hover:bg-[#5a58b8] transition-colors"
                  >
                    Learn More
                  </button>
                </div>
              </div>
            ))
        )}
      </div>
    </>
  );
}

export default function RecommendedJobsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <RecommendedJobsContent />
    </Suspense>
  );
}
