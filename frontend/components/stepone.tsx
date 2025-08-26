// components/StepOne.tsx
'use client';
import React from 'react';
import Link from 'next/link'; // Import the Link component from Next.js

interface StepProps {
  number: number;
  semester: string;
  title: string;
  description: string;
  skills: string[];
  resources: string[];
}

export default function StepOne({
  number,
  semester,
  title,
  description,
  skills,
  resources,
}: StepProps) {
  return (
    <div className="flex items-start mb-10 relative">
      <div className="flex flex-col items-center mr-4">
        <div className="bg-[#6d6bd3] text-white w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold z-10">
          {number}
        </div>
      </div>
      <div className="bg-white shadow-md rounded-lg p-4 w-full">
        <p className="font-semibold text-gray-700 mb-1">{semester}</p>
        <h3 className="text-lg font-bold">{title}</h3>
        <p className="text-gray-600 mb-3">{description}</p>

        <p className="text-gray-700 font-semibold">Key Skills:</p>
        <ul className="list-disc pl-6 text-gray-600 mb-3">
          {skills.map((skill, i) => (
            <li key={i}>{skill}</li>
          ))}
        </ul>

        <p className="text-gray-700 font-semibold">Resources:</p>
        <ul className="list-disc pl-6 text-gray-600">
          {resources.map((resource, i) => (
            <li key={i}>{resource}</li>
          ))}
        </ul>

        {/* Learn More Button wrapped in Link */}
        <Link href={`/step/${number}`}>
          <button className="mt-4 px-4 py-2 bg-[#6d6bd3] text-white rounded hover:bg-[#5a5abc]">
            Learn More
          </button>
        </Link>
      </div>
    </div>
  );
}
