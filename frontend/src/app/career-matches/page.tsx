'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { Sparkles, TrendingUp, DollarSign } from 'lucide-react';

interface CareerMatch {
  title: string;
  description: string;
  avgSalary: string;
  growth: string;
  skills: string[];
}

export default function CareerMatchesPage() {
  const router = useRouter();
  const [matches, setMatches] = useState<CareerMatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    fetchCareerMatches();
  }, []);

  const fetchCareerMatches = async () => {
    try {
      const userStr = localStorage.getItem('user');
      if (!userStr) {
        router.push('/login');
        return;
      }

      const user = JSON.parse(userStr);
      setUserName(user.name);

      const res = await fetch('http://localhost:5001/api/users/career-matches', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message);

      setMatches(data.matches);
    } catch (err: any) {
      alert(err.message || 'Failed to load career matches');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl text-[#6d6bd3]">Loading your matches...</div>
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
            Hey {userName}! Based on your profile, here are the careers that match your skills and interests:
          </p>
        </motion.div>

        <div className="space-y-6">
          {matches.map((career, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="text-sm text-[#6d6bd3] font-semibold mb-2">
                        Match #{index + 1}
                      </div>
                      <CardTitle className="text-2xl">{career.title}</CardTitle>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-slate-600">{career.description}</p>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-5 h-5 text-green-600" />
                      <div>
                        <div className="text-sm text-slate-500">Avg. Salary</div>
                        <div className="font-semibold">{career.avgSalary}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-blue-600" />
                      <div>
                        <div className="text-sm text-slate-500">Job Growth</div>
                        <div className="font-semibold">{career.growth}</div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="text-sm text-slate-500 mb-2">Key Skills:</div>
                    <div className="flex flex-wrap gap-2">
                      {career.skills.map((skill, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 bg-[#6d6bd3]/10 text-[#6d6bd3] rounded-full text-sm font-medium"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Button
            onClick={() => router.push('/general-account/dashboard')}
            className="bg-[#6d6bd3] hover:bg-[#5a58b8] text-white px-8 py-6 text-lg rounded-xl"
          >
            Go to Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
}