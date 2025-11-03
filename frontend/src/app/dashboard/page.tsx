'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { motion } from 'framer-motion';

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [careers, setCareers] = useState<any[]>([]);
  const [hasProfile, setHasProfile] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      window.location.href = '/general-account/login';
      return;
    }

    const userData = JSON.parse(storedUser);
    setUser(userData);

    // Check if profile is complete
    if (userData.profile) {
      setHasProfile(true);

      // Get career recommendations
      const storedCareers = localStorage.getItem('careerRecommendations');
      if (storedCareers) {
        setCareers(JSON.parse(storedCareers));
      }
    }
  }, []);

  if (!user) return null;

  // If user hasn't completed profile setup
  if (!hasProfile) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-slate-50 pt-24 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl mx-auto text-center py-20"
        >
          <div className="bg-white rounded-2xl shadow-xl p-12">
            <div className="text-6xl mb-6">👋</div>
            <h1 className="text-4xl font-bold text-[#6d6bd3] mb-4">
              Welcome back, {user.name}!
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Let's finish setting up your profile so we can generate your
              personalized career roadmap.
            </p>
            <Button
              onClick={() => (window.location.href = '/profile-setup')}
              className="bg-[#6d6bd3] hover:bg-[#5a58b8] text-white px-8 py-6 text-lg rounded-xl"
            >
              Continue Setup →
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  // Full Dashboard for users with completed profiles
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-slate-50 pt-24 pb-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-4xl font-bold text-[#6d6bd3] mb-2">
                Welcome back, {user.name}! 👋
              </h1>
              <p className="text-xl text-gray-600">
                Here's your progress toward your career goals.
              </p>
            </div>
            <div className="flex gap-3">
              <Button
                onClick={() => (window.location.href = '/account-settings')}
                variant="outline"
                className="border-[#6d6bd3] text-[#6d6bd3] hover:bg-[#f0f0ff]"
              >
                ⚙️ Edit Profile
              </Button>
              <Button
                onClick={() => (window.location.href = '/profile-setup')}
                className="bg-[#6d6bd3] hover:bg-[#5a58b8] text-white"
              >
                🎯 Update Interests
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Dashboard Overview - Top 3 Careers */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            🎯 Your Top Career Matches
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {careers.length > 0 ? (
              careers.slice(0, 3).map((career, idx) => (
                <Card
                  key={idx}
                  className="hover:shadow-xl transition-shadow cursor-pointer"
                >
                  <CardHeader>
                    <CardTitle className="text-lg text-[#6d6bd3]">
                      {career.career_title || `Career ${idx + 1}`}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-gray-600">
                            Roadmap Progress
                          </span>
                          <span className="font-semibold text-[#6d6bd3]">
                            {Math.floor(Math.random() * 60) + 20}%
                          </span>
                        </div>
                        <Progress
                          value={Math.floor(Math.random() * 60) + 20}
                          className="h-2"
                        />
                      </div>

                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                        <p className="text-sm text-blue-800">
                          💼 {Math.floor(Math.random() * 5) + 1} new
                          opportunities available
                        </p>
                      </div>

                      <Button
                        onClick={() => {
                          const params = new URLSearchParams({
                            name: user.name,
                            career_title:
                              career.career_title || `Career ${idx + 1}`,
                            career_description: career.career_description || '',
                            salary: career.salary || 'N/A',
                            growth: career.growth || 'N/A',
                            soc_code: career.soc_code || '',
                            school: user.profile?.school || '',
                            major: user.profile?.major || '',
                          });
                          window.location.href = `/roadmap?${params.toString()}`;
                        }}
                        className="w-full bg-[#6d6bd3] hover:bg-[#5a58b8] text-white"
                      >
                        View Roadmap
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card className="col-span-3">
                <CardContent className="py-8 text-center">
                  <p className="text-gray-600">
                    No career matches yet. Complete your profile to get
                    personalized recommendations!
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </motion.div>

        {/* AI Roadmap Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <Card className="shadow-lg">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-2xl text-[#6d6bd3]">
                  🗺️ Your Personalized 4-Year Roadmap
                </CardTitle>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    📥 Download
                  </Button>
                  <Button variant="outline" size="sm">
                    ✏️ Edit
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Year 1 */}
                <div className="border-l-4 border-[#6d6bd3] pl-6 py-4">
                  <h3 className="text-xl font-bold text-gray-800 mb-3">
                    Year 1: Foundation & Exploration
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-purple-50 rounded-lg p-4">
                      <h4 className="font-semibold text-purple-900 mb-2">
                        📚 Courses to Take
                      </h4>
                      <ul className="text-sm text-purple-800 space-y-1">
                        <li>
                          • Intro to {user.profile?.major || 'Your Major'}
                        </li>
                        <li>• Professional Communication</li>
                        <li>• Career Planning Seminar</li>
                      </ul>
                    </div>
                    <div className="bg-purple-50 rounded-lg p-4">
                      <h4 className="font-semibold text-purple-900 mb-2">
                        🎯 Clubs & Activities
                      </h4>
                      <ul className="text-sm text-purple-800 space-y-1">
                        <li>• Join relevant student organizations</li>
                        <li>• Attend career fairs</li>
                        <li>• Network with professors</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Year 2 */}
                <div className="border-l-4 border-[#8b89e6] pl-6 py-4">
                  <h3 className="text-xl font-bold text-gray-800 mb-3">
                    Year 2: Skill Building & Experience
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-indigo-50 rounded-lg p-4">
                      <h4 className="font-semibold text-indigo-900 mb-2">
                        💼 Internships
                      </h4>
                      <ul className="text-sm text-indigo-800 space-y-1">
                        <li>• Summer internship in your field</li>
                        <li>• Part-time positions</li>
                        <li>• Volunteer opportunities</li>
                      </ul>
                    </div>
                    <div className="bg-indigo-50 rounded-lg p-4">
                      <h4 className="font-semibold text-indigo-900 mb-2">
                        🛠️ Skills Development
                      </h4>
                      <ul className="text-sm text-indigo-800 space-y-1">
                        <li>• Technical certifications</li>
                        <li>• Leadership workshops</li>
                        <li>• Online courses (Coursera, LinkedIn Learning)</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Year 3 */}
                <div className="border-l-4 border-[#a8a6f0] pl-6 py-4">
                  <h3 className="text-xl font-bold text-gray-800 mb-3">
                    Year 3: Portfolio & Specialization
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-blue-50 rounded-lg p-4">
                      <h4 className="font-semibold text-blue-900 mb-2">
                        📂 Portfolio Building
                      </h4>
                      <ul className="text-sm text-blue-800 space-y-1">
                        <li>• Create professional portfolio</li>
                        <li>• Showcase 3-5 key projects</li>
                        <li>• Build personal website</li>
                      </ul>
                    </div>
                    <div className="bg-blue-50 rounded-lg p-4">
                      <h4 className="font-semibold text-blue-900 mb-2">
                        🎓 Advanced Learning
                      </h4>
                      <ul className="text-sm text-blue-800 space-y-1">
                        <li>• Specialized coursework</li>
                        <li>• Research opportunities</li>
                        <li>• Industry certifications</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Year 4 */}
                <div className="border-l-4 border-[#c5c3fa] pl-6 py-4">
                  <h3 className="text-xl font-bold text-gray-800 mb-3">
                    Year 4: Career Launch
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-slate-50 rounded-lg p-4">
                      <h4 className="font-semibold text-slate-900 mb-2">
                        🚀 Job Preparation
                      </h4>
                      <ul className="text-sm text-slate-800 space-y-1">
                        <li>• Polish resume & cover letters</li>
                        <li>• Interview preparation</li>
                        <li>• Job search strategy</li>
                      </ul>
                    </div>
                    <div className="bg-slate-50 rounded-lg p-4">
                      <h4 className="font-semibold text-slate-900 mb-2">
                        🌐 Networking
                      </h4>
                      <ul className="text-sm text-slate-800 space-y-1">
                        <li>• LinkedIn optimization</li>
                        <li>• Alumni connections</li>
                        <li>• Industry events & conferences</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <Button
                  className="w-full bg-[#6d6bd3] hover:bg-[#5a58b8] text-white py-6 text-lg"
                  onClick={() => (window.location.href = '/roadmap')}
                >
                  Continue My Plan →
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Recommended Opportunities */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            ✨ Recommended for You
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="hover:shadow-xl transition-shadow">
              <CardHeader>
                <CardTitle className="text-lg">
                  💼 Software Engineering Internship
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">
                  Summer 2026 • Tech Startup
                </p>
                <Button
                  size="sm"
                  className="w-full bg-[#6d6bd3] hover:bg-[#5a58b8]"
                >
                  Learn More
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-xl transition-shadow">
              <CardHeader>
                <CardTitle className="text-lg">
                  🎓 CUNY Career Workshop
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">
                  Nov 15, 2025 • Virtual
                </p>
                <Button
                  size="sm"
                  className="w-full bg-[#6d6bd3] hover:bg-[#5a58b8]"
                >
                  Register
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-xl transition-shadow">
              <CardHeader>
                <CardTitle className="text-lg">
                  📚 Data Analytics Course
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">
                  Free • Coursera Certificate
                </p>
                <Button
                  size="sm"
                  className="w-full bg-[#6d6bd3] hover:bg-[#5a58b8]"
                >
                  Enroll Now
                </Button>
              </CardContent>
            </Card>
          </div>
        </motion.div>

        {/* Explore Tab */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="bg-gradient-to-r from-[#6d6bd3] to-[#8b89e6] text-white">
            <CardContent className="py-8 text-center">
              <h3 className="text-2xl font-bold mb-4">
                🔍 Want to Explore More?
              </h3>
              <p className="text-lg mb-6 opacity-90">
                Discover other career paths and opportunities beyond your
                current matches.
              </p>
              <Button
                onClick={() => (window.location.href = '/explore-careers')}
                className="bg-white text-[#6d6bd3] hover:bg-gray-100 px-8 py-6 text-lg"
              >
                Explore Other Careers
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
