'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (!token || !userData) {
      // Not logged in, redirect to login
      router.push('/general-account/login');
      return;
    }

    // Parse and set user data
    setUser(JSON.parse(userData));
  }, [router]);

  const handleLogout = () => {
    // Clear localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Redirect to home
    router.push('/');
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg">Loading...</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen pt-24 bg-gradient-to-b from-white to-slate-50 px-6 py-16 md:px-12">
      <div className="max-w-6xl mx-auto">
        {/* Welcome Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-2xl shadow-xl p-8 mb-8"
        >
          <h1 className="text-4xl font-extrabold mb-2">
            Welcome back, <span className="text-[#6d6bd3]">{user.name}</span>! 👋
          </h1>
          <p className="text-slate-600 text-lg">
            Ready to explore your career path?
          </p>
          <div className="mt-4 text-sm text-slate-500">
            Email: {user.email}
          </div>
        </motion.div>

        {/* Dashboard Content */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Career Quiz Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow"
          >
            <div className="text-4xl mb-4">🎯</div>
            <h2 className="text-2xl font-bold mb-2">Career Quiz</h2>
            <p className="text-slate-600 mb-4">
              Discover careers that match your interests, skills, and personality
            </p>
            <Button
              onClick={() => router.push('/general-account/questions')}
              className="w-full bg-[#6d6bd3] hover:bg-[#5a58c2] text-white rounded-xl py-3"
            >
              Take Quiz
            </Button>
          </motion.div>

          {/* Explore Careers Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow"
          >
            <div className="text-4xl mb-4">🔍</div>
            <h2 className="text-2xl font-bold mb-2">Explore Careers</h2>
            <p className="text-slate-600 mb-4">
              Browse through hundreds of career options with detailed information
            </p>
            <Button
              onClick={() => router.push('/explore-careers')}
              className="w-full bg-[#6d6bd3] hover:bg-[#5a58c2] text-white rounded-xl py-3"
            >
              Explore Now
            </Button>
          </motion.div>

          {/* Profile Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow"
          >
            <div className="text-4xl mb-4">👤</div>
            <h2 className="text-2xl font-bold mb-2">My Profile</h2>
            <p className="text-slate-600 mb-4">
              View and update your personal information and preferences
            </p>
            <Button
              onClick={() => alert('Profile page coming soon!')}
              className="w-full bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl py-3"
            >
              View Profile
            </Button>
          </motion.div>

          {/* Saved Careers Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow"
          >
            <div className="text-4xl mb-4">⭐</div>
            <h2 className="text-2xl font-bold mb-2">Saved Careers</h2>
            <p className="text-slate-600 mb-4">
              Access your bookmarked careers and quiz results
            </p>
            <Button
              onClick={() => alert('Saved careers coming soon!')}
              className="w-full bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl py-3"
            >
              View Saved
            </Button>
          </motion.div>
        </div>

        {/* Logout Button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-8 text-center"
        >
          <Button
            onClick={handleLogout}
            className="bg-red-50 hover:bg-red-100 text-red-600 rounded-xl px-8 py-3"
          >
            Logout
          </Button>
        </motion.div>
      </div>
    </main>
  );
}