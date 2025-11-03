// components/Year1Dashboard.tsx
'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Calendar,
  BookOpen,
  Target,
  Download,
  GraduationCap,
  DollarSign,
  Home,
} from 'lucide-react';
import SemesterCard from './SemesterCard';
import StatCard from './StatCard';
import SuccessTips from './SuccessTips';
import NextSteps from './NextSteps';

export interface Course {
  code: string;
  name: string;
  credits: number;
  description?: string;
}

export interface SemesterData {
  totalCredits: number;
  tuition: number;
  courses: Course[];
  opportunities: string[];
  volunteerWork: string[];
  internships: string[];
  projects: string[];
}

export interface Year1Data {
  major: string;
  university: string;
  year: number;
  totalYearCost: number;
  totalYearCredits: number;
  scraped?: boolean;
  fall: SemesterData;
  spring: SemesterData;
  student?: {
    name: string;
    email?: string;
    career_goal: string;
  };
}

interface Year1DashboardProps {
  data: Year1Data;
  studentName: string;
  careerTitle: string;
  onBack?: () => void;
  onViewFullRoadmap?: () => void;
}

export default function Year1Dashboard({
  data,
  studentName,
  careerTitle,
  onBack,
  onViewFullRoadmap,
}: Year1DashboardProps) {
  const [expandedSemester, setExpandedSemester] = useState<
    'fall' | 'spring' | ''
  >('fall');

  const handleExport = () => {
    const dataStr = JSON.stringify(data, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${studentName}-Year1-Plan.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-[#6d6bd3] to-[#5a59b8] text-white py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {onBack && (
              <button
                onClick={onBack}
                className="text-white/80 hover:text-white mb-6 flex items-center gap-2 transition-colors"
              >
                ← Back to Roadmap
              </button>
            )}

            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                <GraduationCap className="w-10 h-10" />
              </div>
              <div>
                <h1 className="text-5xl font-bold mb-2">Year 1 Dashboard</h1>
                <p className="text-white/90 text-xl">
                  Your First Year at {data.university}
                </p>
              </div>
            </div>

            <div className="mt-8 p-6 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20">
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <p className="text-white/70 text-sm mb-1">Student</p>
                  <p className="text-white font-bold text-lg">{studentName}</p>
                </div>
                <div>
                  <p className="text-white/70 text-sm mb-1">Major</p>
                  <p className="text-white font-bold text-lg">{data.major}</p>
                </div>
                <div>
                  <p className="text-white/70 text-sm mb-1">Career Goal</p>
                  <p className="text-white font-bold text-lg">{careerTitle}</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="max-w-7xl mx-auto px-6 -mt-12 relative z-10">
        <div className="grid md:grid-cols-4 gap-6 mb-12">
          <StatCard
            icon={BookOpen}
            title="Total Credits"
            value={(data?.totalYearCredits ?? 0).toString()}
            subtitle="For Year 1"
            color="#6d6bd3"
          />
          <StatCard
            icon={DollarSign}
            title="Total Cost"
            value={`$${(data?.totalYearCost ?? 0).toLocaleString()}`}
            subtitle="Tuition for Year 1"
            color="#10b981"
          />
          <StatCard
            icon={Calendar}
            title="Fall Semester"
            value={(data?.fall?.totalCredits ?? 0).toString()}
            subtitle={`${data?.fall?.courses?.length ?? 0} courses`}
            color="#f59e0b"
          />
          <StatCard
            icon={Calendar}
            title="Spring Semester"
            value={(data?.spring?.totalCredits ?? 0).toString()}
            subtitle={`${data?.spring?.courses?.length ?? 0} courses`}
            color="#06b6d4"
          />
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl shadow-lg p-6 mb-12 border border-gray-100"
        >
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <Target className="w-6 h-6 text-[#6d6bd3]" />
              <div>
                <h3 className="text-lg font-bold text-gray-900">
                  Your Year 1 Journey
                </h3>
                <p className="text-gray-600 text-sm">
                  Track your progress and stay on course
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleExport}
                className="flex items-center gap-2 px-5 py-2.5 bg-[#6d6bd3] text-white rounded-lg hover:bg-[#5a59b8] transition-all shadow-md hover:shadow-lg"
              >
                <Download className="w-4 h-4" />
                Export Plan
              </button>
              <button
                onClick={() => window.print()}
                className="flex items-center gap-2 px-5 py-2.5 bg-white text-gray-700 rounded-lg hover:bg-gray-50 transition-all shadow-md hover:shadow-lg border border-gray-200"
              >
                🖨️ Print
              </button>
            </div>
          </div>
        </motion.div>

        {/* Semester Cards */}
        <div className="space-y-8 mb-12">
          <SemesterCard
            semester="fall"
            data={data.fall}
            isExpanded={expandedSemester === 'fall'}
            onToggle={() =>
              setExpandedSemester(expandedSemester === 'fall' ? '' : 'fall')
            }
          />

          <SemesterCard
            semester="spring"
            data={data.spring}
            isExpanded={expandedSemester === 'spring'}
            onToggle={() =>
              setExpandedSemester(expandedSemester === 'spring' ? '' : 'spring')
            }
          />
        </div>

        {/* Success Tips */}
        <SuccessTips />

        {/* Next Steps */}
        <NextSteps />

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center pb-12"
        >
          <div className="bg-gradient-to-r from-[#6d6bd3]/10 to-purple-100 rounded-2xl p-8 border border-[#6d6bd3]/20">
            <p className="text-gray-700 text-lg mb-3">
              🎓 <strong>Ready to start your journey, {studentName}?</strong>
            </p>
            <p className="text-gray-600 mb-6">
              This personalized plan is designed to help you succeed at{' '}
              {data.university}
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              {onViewFullRoadmap && (
                <button
                  onClick={onViewFullRoadmap}
                  className="flex items-center gap-2 px-6 py-3 bg-[#6d6bd3] text-white rounded-xl hover:bg-[#5a59b8] transition-all shadow-md hover:shadow-lg"
                >
                  <Home className="w-5 h-5" />
                  View Full Roadmap
                </button>
              )}
              <button
                onClick={() => (window.location.href = '/')}
                className="flex items-center gap-2 px-6 py-3 bg-white text-gray-700 rounded-xl hover:bg-gray-50 transition-all shadow-md hover:shadow-lg border border-gray-200"
              >
                Start Over
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
