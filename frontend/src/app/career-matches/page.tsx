'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { Sparkles, TrendingUp, DollarSign, Target } from 'lucide-react';

interface CareerMatch {
  title: string;
  description: string;
  salary: string;
  growth: string;
  matchScore: number;
  soc_code: string;
  soc_title: string;
  cip_code: string;
}

export default function CareerMatchesPage() {
  const router = useRouter();
  const [matches, setMatches] = useState<CareerMatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [userName, setUserName] = useState('');
  const [userMajor, setUserMajor] = useState('');

  useEffect(() => {
    loadCareerMatches();
  }, []);

  const loadCareerMatches = () => {
    try {
      // Get user info
      const userStr = localStorage.getItem('user');
      if (!userStr) {
        router.push('/login');
        return;
      }

      const user = JSON.parse(userStr);
      setUserName(user.name || user.email || 'there');
      
      // Get major from user profile if available
      if (user.profile?.major) {
        setUserMajor(user.profile.major);
      }

      // Get career recommendations from localStorage
      const recommendationsStr = localStorage.getItem('careerRecommendations');
      
      if (!recommendationsStr) {
        setError('No career recommendations found. Please complete your profile first.');
        setLoading(false);
        return;
      }

      const recommendations: CareerMatch[] = JSON.parse(recommendationsStr);
      console.log('Loaded recommendations:', recommendations);

      if (!Array.isArray(recommendations) || recommendations.length === 0) {
        setError('No career matches found. Try updating your profile with different skills or interests.');
      } else {
        setMatches(recommendations);
      }

    } catch (err: any) {
      console.error('Error loading career matches:', err);
      setError('Failed to load career matches. Please try completing your profile again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateRoadmap = (career: CareerMatch) => {
    const userStr = localStorage.getItem('user');
    const user = userStr ? JSON.parse(userStr) : {};
    const profile = user.profile || {};
    
    const params = new URLSearchParams({
      name: user.name || 'Student',
      email: user.email || '',
      school: profile.school || 'CUNY',
      major: profile.major || userMajor,
      year: profile.year || 'Sophomore',
      skills: (profile.skills || []).join(','),
      interests: profile.passions || profile.interests || '',
      career_goals: profile.career_goals || `Become a ${career.title}`,
      career_title: career.title,
      soc_code: career.soc_code,
      career_description: career.description,
      salary: career.salary,
      growth: career.growth,
    });
    router.push(`/roadmap?${params.toString()}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-slate-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#6d6bd3] mx-auto mb-4"></div>
          <div className="text-2xl text-[#6d6bd3] font-semibold">
            Loading your career matches...
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-slate-50 p-6">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle className="text-red-600">No Career Matches Found</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-slate-600">{error}</p>
            <Button
              onClick={() => router.push('/general-account/profile-setup')}
              className="w-full bg-[#6d6bd3] hover:bg-[#5a58b8] text-white"
            >
              Complete Your Profile
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-slate-50 p-6 py-16">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 mb-4">
            <Sparkles className="w-8 h-8 text-[#6d6bd3]" />
            <h1 className="text-4xl font-bold text-[#6d6bd3]">
              Your Top Career Matches
            </h1>
            <Sparkles className="w-8 h-8 text-[#6d6bd3]" />
          </div>
          <p className="text-lg text-slate-600">
            Hey {userName}! {userMajor && `Based on your ${userMajor} major, here are`} 
            {!userMajor && 'Here are'} the careers that match your profile:
          </p>
        </motion.div>

        <div className="space-y-6">
          {matches.map((career, index) => (
            <motion.div
              key={career.soc_code || index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="shadow-lg hover:shadow-xl transition-shadow border-2 border-slate-100">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="text-sm text-[#6d6bd3] font-semibold px-3 py-1 bg-[#6d6bd3]/10 rounded-full">
                          Match #{index + 1}
                        </div>
                        <div className="flex items-center gap-1">
                          <Target className="w-4 h-4 text-[#6d6bd3]" />
                          <span className="text-2xl font-bold text-[#6d6bd3]">
                            {career.matchScore}%
                          </span>
                          <span className="text-sm text-slate-500">Match Score</span>
                        </div>
                      </div>
                      <CardTitle className="text-2xl text-slate-900">
                        {career.title}
                      </CardTitle>
                      {career.soc_title && career.soc_title !== career.title && (
                        <p className="text-sm text-slate-500 mt-1">
                          Also known as: {career.soc_title}
                        </p>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-slate-600 leading-relaxed">
                    {career.description}
                  </p>
                  
                  <div className="grid grid-cols-2 gap-4 p-4 bg-slate-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <DollarSign className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <div className="text-xs text-slate-500 uppercase tracking-wide">
                          Median Salary
                        </div>
                        <div className="font-bold text-lg text-slate-900">
                          {career.salary}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <TrendingUp className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <div className="text-xs text-slate-500 uppercase tracking-wide">
                          Job Growth (10yr)
                        </div>
                        <div className="font-bold text-lg text-slate-900">
                          {career.growth}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-200">
                    <div className="flex items-center justify-between text-xs text-slate-400 mb-4">
                      <span>SOC Code: {career.soc_code}</span>
                      <span>CIP Code: {career.cip_code}</span>
                    </div>
                    
                    {/* NEW: Generate Roadmap Button */}
                    <Button
                      onClick={() => handleGenerateRoadmap(career)}
                      className="w-full bg-[#6d6bd3] hover:bg-[#5a58b8] text-white py-6 text-lg"
                    >
                      🗺️ Generate Career Roadmap
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-12 text-center space-y-4"
        >
          <Card className="bg-[#6d6bd3]/5 border-[#6d6bd3]/20">
            <CardContent className="p-6">
              <p className="text-slate-600">
                💡 Want different recommendations? Update your profile with new skills or interests!
              </p>
            </CardContent>
          </Card>
          
          <div className="flex gap-4 justify-center">
            <Button
              onClick={() => router.push('/general-account/profile-setup')}
              variant="outline"
              className="px-8 py-6 text-lg rounded-xl border-2 border-[#6d6bd3] text-[#6d6bd3] hover:bg-[#6d6bd3]/10"
            >
              Update Profile
            </Button>
            <Button
              onClick={() => router.push('/general-account/dashboard')}
              className="bg-[#6d6bd3] hover:bg-[#5a58b8] text-white px-8 py-6 text-lg rounded-xl"
            >
              Go to Dashboard
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}