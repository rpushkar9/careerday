'use client';

import { Button } from '@/components/ui/button';

interface CareerCardProps {
  title: string;
  description: string;
  majors: string[];
  income: string;
  education: string;
}

export default function CareerCard({
  title,
  description,
  majors,
  income,
  education,
}: CareerCardProps) {
  return (
    <div className="flex flex-col md:flex-row justify-between border rounded-2xl shadow-sm bg-white p-6 transition hover:shadow-md">
      {/* Left Content */}
      <div className="flex-1">
        <h2 className="text-xl font-bold text-gray-900">{title}</h2>
        <p className="text-gray-600 mt-2 mb-3">{description}</p>
        <p className="text-sm">
          <span className="font-semibold text-gray-800">Majors:</span>{' '}
          {majors.join(', ')}
        </p>
      </div>

      {/* Right Content */}
      <div
        className="mt-4 md:mt-0 md:ml-6 p-4 rounded-xl text-center w-full md:w-56"
        style={{ backgroundColor: '#e4e0f8' }} // light purple background
      >
        <p className="text-sm text-gray-600">Median Yearly Income</p>
        <p className="text-lg font-bold text-gray-900">{income}</p>
        <p className="text-sm text-gray-600 mt-3">Most Common Education</p>
        <p className="font-bold text-gray-900">{education}</p>
        <Button
          className="mt-4 w-full font-medium text-white rounded-full shadow-sm transition"
          style={{ backgroundColor: '#6d6bd3' }}
          onMouseEnter={e =>
            (e.currentTarget.style.backgroundColor = '#5b59c0')
          }
          onMouseLeave={e =>
            (e.currentTarget.style.backgroundColor = '#6d6bd3')
          }
        >
          Learn More
        </Button>
      </div>
    </div>
  );
}
