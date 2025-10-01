'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    // TEMP: store user in localStorage
    const user = { name: 'John Anderson', email };
    localStorage.setItem('user', JSON.stringify(user));

    // Redirect to dashboard
    router.push('/general-account/dashboard');
  };

  return (
    <main className="min-h-screen pt-40 bg-gradient-to-b from-white to-slate-50 flex items-center justify-center px-6 py-16 md:px-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8"
      >
        <motion.h1 className="text-3xl md:text-4xl font-extrabold text-center mb-6">
          Welcome Back
        </motion.h1>
        <p className="text-center text-slate-600 mb-8">
          Log in to access your personalized career journey.
        </p>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="rounded-xl mt-1"
              required
            />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="rounded-xl mt-1"
              required
            />
          </div>

          <Button
            type="submit"
            className="w-full mt-2 bg-[#6d6bd3] hover:bg-[#5a58c2] text-white rounded-xl py-6 text-lg font-semibold shadow-md"
          >
            Log In
          </Button>
        </form>

        <p className="text-center text-slate-600 mt-6">
          Don't have an account?{' '}
          <a
            href="/general-account/signup"
            className="text-[#6d6bd3] font-semibold hover:underline"
          >
            Sign Up
          </a>
        </p>

        <div className="text-center mt-8">
          <a
            href="/explore-careers"
            className="text-sm text-slate-500 hover:text-slate-700"
          >
            Continue without an account →
          </a>
        </div>
      </motion.div>
    </main>
  );
}
