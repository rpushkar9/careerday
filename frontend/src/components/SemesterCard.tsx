// components/SemesterCard.tsx
'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp } from 'lucide-react';
import type { SemesterData } from './Year1Dashboard';

interface SemesterCardProps {
  semester: 'fall' | 'spring';
  data?: SemesterData; // made optional for safety
  isExpanded: boolean;
  onToggle: () => void;
}

export default function SemesterCard({
  semester,
  data,
  isExpanded,
  onToggle,
}: SemesterCardProps) {
  const config = {
    fall: {
      name: 'Fall Semester',
      color: 'from-orange-400 to-yellow-300',
    },
    spring: {
      name: 'Spring Semester',
      color: 'from-cyan-400 to-blue-300',
    },
  }[semester];

  // Safely extract values (use defaults if missing)
  const courses = data?.courses ?? [];
  const totalCredits = data?.totalCredits ?? 0;
  const tuition = data?.tuition ?? 0;
  const opportunities = data?.opportunities ?? [];
  const volunteerWork = data?.volunteerWork ?? [];
  const internships = data?.internships ?? [];
  const projects = data?.projects ?? [];

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-6 bg-gradient-to-r from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-200 transition-colors"
      >
        <div className="flex items-center gap-4 text-left">
          <div
            className={`w-3 h-16 rounded-full bg-gradient-to-b ${config.color}`}
          />
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-1">
              {config.name}
            </h2>
            <p className="text-gray-600">
              {courses.length} courses • {totalCredits} credits • $
              {tuition.toLocaleString()}
            </p>
          </div>
        </div>
        <div className="text-gray-500">
          {isExpanded ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
        </div>
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.4 }}
            className="p-6 border-t border-gray-100 bg-white"
          >
            {/* Courses Section */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Courses
              </h3>
              {courses.length > 0 ? (
                <ul className="grid md:grid-cols-2 gap-4">
                  {courses.map((course, idx) => (
                    <li
                      key={idx}
                      className="p-4 border border-gray-200 rounded-xl hover:shadow-md transition-shadow"
                    >
                      <p className="font-bold text-gray-900">
                        {course.code} — {course.name}
                      </p>
                      <p className="text-gray-600 text-sm">
                        {course.credits} credits
                      </p>
                      {course.description && (
                        <p className="text-gray-500 text-sm mt-1">
                          {course.description}
                        </p>
                      )}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500 italic">No courses listed yet.</p>
              )}
            </div>

            {/* Opportunities Section */}
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Opportunities
                </h3>
                {opportunities.length > 0 ? (
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    {opportunities.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500 italic">
                    No opportunities listed.
                  </p>
                )}
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Volunteer Work
                </h3>
                {volunteerWork.length > 0 ? (
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    {volunteerWork.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500 italic">
                    No volunteer work added.
                  </p>
                )}
              </div>
            </div>

            {/* Internships / Projects Section */}
            <div className="grid md:grid-cols-2 gap-8 mt-8">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Internships
                </h3>
                {internships.length > 0 ? (
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    {internships.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500 italic">No internships listed.</p>
                )}
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Projects
                </h3>
                {projects.length > 0 ? (
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    {projects.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500 italic">No projects added yet.</p>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
