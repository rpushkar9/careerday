'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/navbar';

// Define a Job type
type Job = {
  title: string;
  description: string;
  salary: string;
  growth: string;
  matchScore: number;
};

export default function RecommendedJobsPage() {
  const [recommendedJobs, setRecommendedJobs] = useState<Job[]>([]); // Use the Job type
  const [university, setUniversity] = useState('');
  const router = useRouter();

  useEffect(() => {
    setRecommendedJobs([
      {
        title: 'Computer Engineering',
        description: 'Designs and develops computer systems and components.',
        salary: '$100,000',
        growth: '10%',
        matchScore: 70,
      },
      {
        title: 'Software Engineering',
        description: 'Develops and maintains software applications.',
        salary: '$110,000',
        growth: '12%',
        matchScore: 50,
      },
      {
        title: 'Engineering',
        description:
          'Applies scientific principles to design and build structures and systems.',
        salary: '$95,000',
        growth: '8%',
        matchScore: 70,
      },
      {
        title: 'Software Developer',
        description:
          'Develops and maintains software applications using programming languages.',
        matchScore: 92,
        salary: '$105,000',
        growth: '25%',
      },
      {
        title: 'Data Scientist',
        description:
          'Analyzes large data sets to uncover insights and support decision-making.',
        matchScore: 87,
        salary: '$120,000',
        growth: '36%',
      },
      {
        title: 'Cybersecurity Analyst',
        description:
          'Protects systems and networks from cyber threats and vulnerabilities.',
        salary: '$98,000',
        growth: '33%',
        matchScore: 86,
      },
      {
        title: 'Clinical Psychologist',
        description:
          'Diagnoses and treats mental health disorders through talk therapy and behavioral interventions.',
        salary: '$85,000',
        growth: '10%',
        matchScore: 80,
      },

      {
        title: 'Civil Engineer',
        description:
          'Designs and oversees infrastructure projects like roads, buildings, and water systems.',
        salary: '$88,000',
        growth: '7%',
        matchScore: 70,
      },
      {
        title: 'Policy Analyst',
        description:
          'Researches and evaluates policy issues to inform government or organizational decisions.',
        salary: '$78,000',
        growth: '9%',
        matchScore: 85,
      },
      {
        title: 'Biomedical Researcher',
        description:
          'Conducts scientific studies to understand diseases and develop new treatments.',
        salary: '$95,000',
        growth: '11%',
        matchScore: 77,
      },
      {
        title: 'Graphic Designer',
        description:
          'Creates visual concepts to communicate ideas in digital and print formats.',
        salary: '$58,000',
        growth: '3%',
        matchScore: 85,
      },
    ]);
  }, []);

  const handleLearnMore = (job: Job) => {
    // Use router.push to navigate to a detailed page for the selected job
    router.push(`/roadmap?career=${encodeURIComponent(job.title)}`);
  };

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
              {university && ` at ${university}`}
            </p>
          </div>
        </div>
      </div>
      <div className="max-w-3xl mx-auto mt-10 p-6 space-y-6">
        {recommendedJobs.length > 0 ? (
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
        ) : (
          <p className="text-center text-gray-500">
            No recommendations available.
          </p>
        )}
      </div>
    </>
  );
}
