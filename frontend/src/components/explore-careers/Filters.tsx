'use client';

import { useState } from 'react';

interface FiltersProps {
  onFilterChange: (filters: {
    educationLevel: string;
    minSalary: number | null;
    industry: string;
    major: string;
  }) => void;
}

export default function Filters({ onFilterChange }: FiltersProps) {
  const [educationLevel, setEducationLevel] = useState('');
  const [salaryRange, setSalaryRange] = useState('');
  const [industry, setIndustry] = useState('');
  const [major, setMajor] = useState('');

  const handleFilterChange = () => {
    // Parse salary range to get minimum salary in thousands
    let minSalary = null;
    if (salaryRange === '$40-60k') minSalary = 40;
    else if (salaryRange === '$60-80k') minSalary = 60;
    else if (salaryRange === '$80-100k') minSalary = 80;
    else if (salaryRange === '$100k+') minSalary = 100;

    onFilterChange({
      educationLevel,
      minSalary,
      industry
    });
  };

  // Apply filters whenever any dropdown changes
  const handleChange = (setter: (value: string) => void, value: string) => {
    setter(value);
    // Small delay to ensure state updates before applying filters
    setTimeout(() => {
      let minSalary = null;
      const currentSalary = value.includes('$') ? value : salaryRange;
      
      if (currentSalary === '$40-60k') minSalary = 40;
      else if (currentSalary === '$60-80k') minSalary = 60;
      else if (currentSalary === '$80-100k') minSalary = 80;
      else if (currentSalary === '$100k+') minSalary = 100;

      onFilterChange({
        educationLevel: setter === setEducationLevel ? value : educationLevel,
        minSalary,
        industry: setter === setIndustry ? value : industry
      });
    }, 0);
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-bold text-gray-900">Filters</h3>

      {/* Industry */}
      <div>
        <label className="block font-medium mb-2 text-gray-700">Industry</label>
        <select 
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#6d6bd3] transition"
          value={industry}
          onChange={(e) => handleChange(setIndustry, e.target.value)}
        >
          <option value="">All Industries</option>
          <option value="finance">Finance</option>
          <option value="healthcare">Healthcare</option>
          <option value="technology">Technology</option>
          <option value="education">Education</option>
          <option value="engineering">Engineering</option>
          <option value="business">Business</option>
        </select>
      </div>

      {/* Salary */}
      <div>
        <label className="block font-medium mb-2 text-gray-700">Salary Range</label>
        <select 
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#6d6bd3] transition"
          value={salaryRange}
          onChange={(e) => handleChange(setSalaryRange, e.target.value)}
        >
          <option value="">All Salaries</option>
          <option value="$40-60k">$40k - $60k</option>
          <option value="$60-80k">$60k - $80k</option>
          <option value="$80-100k">$80k - $100k</option>
          <option value="$100k+">$100k+</option>
        </select>
      </div>

      {/* Education */}
      <div>
        <label className="block font-medium mb-2 text-gray-700">Education Level</label>
        <select 
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#6d6bd3] transition"
          value={educationLevel}
          onChange={(e) => handleChange(setEducationLevel, e.target.value)}
        >
          <option value="">All Education Levels</option>
          <option value="High school diploma or equivalent">High School</option>
          <option value="Associate's degree">Associate's Degree</option>
          <option value="Bachelor's degree">Bachelor's Degree</option>
          <option value="Master's degree">Master's Degree</option>
          <option value="Doctoral or professional degree">PhD/Professional</option>
        </select>
      </div>

      {/* Clear Filters Button */}
      <button
        onClick={() => {
          setEducationLevel('');
          setSalaryRange('');
          setIndustry('');
          onFilterChange({
            educationLevel: '',
            minSalary: null,
            industry: ''
          });
        }}
        className="w-full mt-4 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-medium"
      >
        Clear All Filters
      </button>
    </div>
  );
}