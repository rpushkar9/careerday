'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function GeneralAccountPage() {
  const [isLogin, setIsLogin] = useState(true);
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (isLogin) {
      console.log('Logging in...');
      // 👉 If you want login to also go to questions, keep this the same
      router.push('/general-account/questions');
    } else {
      console.log('Creating account...');
      // 👉 After signup → send them to the background questions
      router.push('/general-account/questions');
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-slate-50 flex items-center justify-center px-6 py-16 md:px-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8"
      >
        {/* Header */}
        <motion.h1 className="text-3xl md:text-4xl font-extrabold text-center mb-6">
          {isLogin ? (
            'Welcome Back'
          ) : (
            <>
              Create <span className="text-[#6d6bd3]">Your Account</span>
            </>
          )}
        </motion.h1>
        <p className="text-center text-slate-600 mb-8">
          {isLogin
            ? 'Log in to access your personalized career journey.'
            : 'Sign up to start your career exploration with AI-powered guidance.'}
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {!isLogin && (
            <div>
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="Enter your name"
                className="rounded-xl mt-1"
              />
            </div>
          )}
          <div>
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              className="rounded-xl mt-1"
            />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              className="rounded-xl mt-1"
            />
          </div>

          <Button
            type="submit"
            className="w-full mt-2 bg-[#6d6bd3] hover:bg-[#5a58c2] text-white rounded-xl py-6 text-lg font-semibold shadow-md"
          >
            {isLogin ? 'Log In' : 'Sign Up'}
          </Button>
        </form>

        {/* Switch between login / signup */}
        <p className="text-center text-slate-600 mt-6">
          {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
          <button
            type="button"
            onClick={() => setIsLogin(!isLogin)}
            className="text-[#6d6bd3] font-semibold hover:underline"
          >
            {isLogin ? 'Sign Up' : 'Log In'}
          </button>
        </p>

        {/* Optional link to continue without account */}
        <div className="text-center mt-8">
          <Link
            href="/explore-careers"
            className="text-sm text-slate-500 hover:text-slate-700"
          >
            Continue without an account →
          </Link>
        </div>
      </motion.div>
    </main>
  );
}
