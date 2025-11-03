'use client';
import { useSearchParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  GraduationCap,
  Sparkles,
  ArrowRight,
  Download,
  RefreshCw,
  Heart,
  Save,
  Check,
} from 'lucide-react';

export default function RoadmapPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [aiRoadmap, setAiRoadmap] = useState('');
  const [showAiRoadmap, setShowAiRoadmap] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [showSaveSuccess, setShowSaveSuccess] = useState(false);

  // Get user data from URL params
  const studentName =
    searchParams.get('name') || searchParams.get('career_title') || 'Student';
  const university =
    searchParams.get('university') || searchParams.get('school') || '';
  const major = searchParams.get('major') || '';
  const careerGoal =
    searchParams.get('career') || searchParams.get('career_title') || '';

  // Get career data from URL
  const careerTitle = searchParams.get('career_title') || careerGoal;
  const careerDescription = searchParams.get('career_description') || '';
  const salary = searchParams.get('salary') || 'N/A';
  const growth = searchParams.get('growth') || 'N/A';
  const socCode = searchParams.get('soc_code') || '';

  useEffect(() => {
    // Check if this roadmap is already saved/liked
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const user = JSON.parse(userStr);
      const savedRoadmaps = user.savedRoadmaps || [];
      const existingRoadmap = savedRoadmaps.find(
        r => r.careerTitle === careerTitle
      );
      if (existingRoadmap) {
        setIsSaved(true);
        setIsLiked(existingRoadmap.isLiked || false);
        if (existingRoadmap.roadmapContent) {
          setAiRoadmap(existingRoadmap.roadmapContent);
          setShowAiRoadmap(true);
        }
      }
    }

    // Auto-generate AI roadmap when page loads if not already saved
    if (careerTitle && !isSaved) {
      generateAiRoadmap();
    }
  }, []);

  const generateAiRoadmap = async () => {
    setLoading(true);

    try {
      const userStr = localStorage.getItem('user');
      if (!userStr) {
        console.error('No user found');
        return;
      }

      const user = JSON.parse(userStr);
      const profile = user.profile || {};

      const requestData = {
        name: user.name || user.email || studentName,
        email: user.email || profile.email || '',
        school: profile.school || university || 'Queens College',
        major: profile.major || major || 'Computer Science',
        year: profile.year || 'Freshman',
        skills: profile.skills || [],
        interests: profile.passions || profile.interests || 'Technology',
        career_goals: profile.career_goals || `Become a ${careerTitle}`,
        career_title: careerTitle,
        soc_code: socCode,
        career_description: careerDescription,
        salary: salary,
        growth: growth,
      };

      console.log('Generating AI roadmap with:', requestData);

      const response = await fetch(
        'http://localhost:5002/api/generate-roadmap',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestData),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to generate roadmap');
      }

      const data = await response.json();
      console.log('AI Roadmap generated:', data);

      if (data.success && data.roadmap) {
        setAiRoadmap(data.roadmap);
        setShowAiRoadmap(true);
      }
    } catch (err) {
      console.error('Error generating AI roadmap:', err);
      alert(
        'Failed to generate AI roadmap. Make sure the backend is running on port 5002.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleLike = () => {
    setIsLiked(!isLiked);

    // Update localStorage
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const user = JSON.parse(userStr);
      const savedRoadmaps = user.savedRoadmaps || [];
      const roadmapIndex = savedRoadmaps.findIndex(
        r => r.careerTitle === careerTitle
      );

      if (roadmapIndex !== -1) {
        savedRoadmaps[roadmapIndex].isLiked = !isLiked;
        user.savedRoadmaps = savedRoadmaps;
        localStorage.setItem('user', JSON.stringify(user));
      }
    }
  };

  const handleSave = () => {
    if (!aiRoadmap) {
      alert('Please generate a roadmap first!');
      return;
    }

    const userStr = localStorage.getItem('user');
    if (!userStr) {
      alert('Please log in to save roadmaps.');
      return;
    }

    const user = JSON.parse(userStr);
    const savedRoadmaps = user.savedRoadmaps || [];

    // Check if already saved
    const existingIndex = savedRoadmaps.findIndex(
      r => r.careerTitle === careerTitle
    );

    const roadmapData = {
      careerTitle,
      careerDescription,
      salary,
      growth,
      socCode,
      roadmapContent: aiRoadmap,
      isLiked: isLiked,
      savedAt: new Date().toISOString(),
      university,
      major,
    };

    if (existingIndex !== -1) {
      // Update existing
      savedRoadmaps[existingIndex] = roadmapData;
    } else {
      // Add new
      savedRoadmaps.push(roadmapData);
    }

    user.savedRoadmaps = savedRoadmaps;
    localStorage.setItem('user', JSON.stringify(user));

    setIsSaved(true);
    setShowSaveSuccess(true);
    setTimeout(() => setShowSaveSuccess(false), 3000);
  };

  const handleViewYear1 = async () => {
    setLoading(true);

    try {
      const response = await fetch(
        'http://localhost:5002/api/scrape-year1-data',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            university: university,
            major: major,
            career_goal: careerGoal,
            student_name: studentName,
          }),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch Year 1 data');
      }

      const year1Data = await response.json();

      year1Data.student = {
        name: studentName,
        career_goal: careerGoal,
      };

      const encodedData = encodeURIComponent(JSON.stringify(year1Data));
      router.push(`/year1-dashboard?data=${encodedData}`);
    } catch (error) {
      console.error('Error loading Year 1 dashboard:', error);
      alert('Failed to load Year 1 dashboard. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const downloadRoadmap = () => {
    const blob = new Blob([aiRoadmap], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `career-roadmap-${careerTitle.replace(/\s+/g, '-')}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <GraduationCap className="w-12 h-12 text-[#6d6bd3]" />
            <h1 className="text-5xl font-bold text-gray-900">
              Your Career Roadmap
            </h1>
          </div>
          <p className="text-xl text-gray-600">
            {studentName}'s path to becoming a {careerTitle || careerGoal}
          </p>
          <p className="text-gray-500 mt-2">
            {major} at {university}
          </p>
        </motion.div>

        {/* Save Success Message */}
        {showSaveSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="fixed top-24 right-8 bg-green-500 text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 z-50"
          >
            <Check className="w-6 h-6" />
            <span className="font-semibold">
              Roadmap saved to your dashboard!
            </span>
          </motion.div>
        )}

        {/* AI Roadmap Section */}
        {showAiRoadmap && aiRoadmap && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-3xl font-bold text-gray-900">
                AI-Generated Career Roadmap
              </h2>
              <div className="flex gap-3">
                <button
                  onClick={handleLike}
                  className={`${
                    isLiked
                      ? 'bg-red-500 text-white border-red-500'
                      : 'bg-white border-gray-300 text-gray-700 hover:bg-red-50'
                  } border-2 px-4 py-2 rounded-xl font-semibold transition-all flex items-center gap-2`}
                >
                  <Heart
                    className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`}
                  />
                  {isLiked ? 'Liked' : 'Like'}
                </button>
                <button
                  onClick={handleSave}
                  className={`${
                    isSaved
                      ? 'bg-green-500 text-white border-green-500'
                      : 'bg-white border-[#6d6bd3] text-[#6d6bd3] hover:bg-[#6d6bd3] hover:text-white'
                  } border-2 px-4 py-2 rounded-xl font-semibold transition-all flex items-center gap-2`}
                >
                  {isSaved ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    <Save className="w-5 h-5" />
                  )}
                  {isSaved ? 'Saved' : 'Save'}
                </button>
                <button
                  onClick={downloadRoadmap}
                  className="bg-white border-2 border-gray-300 text-gray-700 px-4 py-2 rounded-xl font-semibold hover:bg-gray-50 transition-colors flex items-center gap-2"
                >
                  <Download className="w-5 h-5" />
                  Download
                </button>
                <button
                  onClick={generateAiRoadmap}
                  disabled={loading}
                  className="bg-white border-2 border-gray-300 text-gray-700 px-4 py-2 rounded-xl font-semibold hover:bg-gray-50 transition-colors flex items-center gap-2 disabled:opacity-50"
                >
                  <RefreshCw
                    className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`}
                  />
                  Regenerate
                </button>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-xl p-8 prose prose-lg max-w-none prose-headings:text-[#6d6bd3] prose-a:text-[#6d6bd3]">
              {aiRoadmap.split('\n').map((line, index) => {
                if (line.startsWith('# ')) {
                  return (
                    <h1
                      key={index}
                      className="text-3xl font-bold text-[#6d6bd3] mt-8 mb-4"
                    >
                      {line.substring(2)}
                    </h1>
                  );
                } else if (line.startsWith('## ')) {
                  return (
                    <h2
                      key={index}
                      className="text-2xl font-bold text-[#6d6bd3] mt-6 mb-3"
                    >
                      {line.substring(3)}
                    </h2>
                  );
                } else if (line.startsWith('### ')) {
                  return (
                    <h3
                      key={index}
                      className="text-xl font-bold text-gray-900 mt-4 mb-2"
                    >
                      {line.substring(4)}
                    </h3>
                  );
                } else if (line.startsWith('**') && line.endsWith('**')) {
                  return (
                    <p key={index} className="font-bold text-gray-900 mt-3">
                      {line.substring(2, line.length - 2)}
                    </p>
                  );
                } else if (line.startsWith('- ')) {
                  return (
                    <li key={index} className="ml-6 text-gray-700">
                      {line.substring(2)}
                    </li>
                  );
                } else if (line.trim()) {
                  return (
                    <p key={index} className="text-gray-700 my-2">
                      {line}
                    </p>
                  );
                }
                return <br key={index} />;
              })}
            </div>
          </motion.div>
        )}

        {/* Loading State */}
        {loading && !aiRoadmap && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="w-16 h-16 border-4 border-[#6d6bd3] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-xl text-gray-600">
              Generating your personalized roadmap...
            </p>
          </motion.div>
        )}

        {/* Year 1 Highlight Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-[#6d6bd3] to-[#5a59b8] text-white rounded-3xl shadow-2xl p-8 mb-12 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-24 -translate-x-24"></div>

          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <Sparkles className="w-8 h-8" />
              <h2 className="text-3xl font-bold">Year 1 Deep Dive</h2>
            </div>

            <p className="text-white/90 text-lg mb-6 max-w-2xl">
              Get a detailed breakdown of your first year with course schedules,
              tuition information, career opportunities, and personalized
              guidance.
            </p>

            <div className="grid md:grid-cols-3 gap-4 mb-8">
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
                <div className="text-2xl font-bold mb-1">📚 Courses</div>
                <div className="text-white/80 text-sm">
                  Detailed course breakdown
                </div>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
                <div className="text-2xl font-bold mb-1">💼 Opportunities</div>
                <div className="text-white/80 text-sm">
                  Internships & projects
                </div>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
                <div className="text-2xl font-bold mb-1">💰 Budget</div>
                <div className="text-white/80 text-sm">
                  Real tuition estimates
                </div>
              </div>
            </div>

            <button
              onClick={handleViewYear1}
              disabled={loading}
              className="flex items-center gap-3 px-8 py-4 bg-white text-[#6d6bd3] rounded-xl font-bold text-lg hover:shadow-2xl transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-[#6d6bd3] border-t-transparent rounded-full animate-spin"></div>
                  Loading Your Dashboard...
                </>
              ) : (
                <>
                  View Year 1 Dashboard
                  <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                </>
              )}
            </button>
          </div>
        </motion.div>

        {/* Back Button */}
        <div className="text-center mt-8 flex gap-4 justify-center">
          <button
            onClick={() => router.push('/career-matches')}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-8 py-3 rounded-xl font-semibold transition-colors"
          >
            Back to Career Matches
          </button>
          <button
            onClick={() => router.push('/dashboard')}
            className="bg-[#6d6bd3] hover:bg-[#5a58b8] text-white px-8 py-3 rounded-xl font-semibold transition-colors"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}
