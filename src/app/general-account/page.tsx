'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

export default function SignupPage() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
  });

  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', form);

    // after signup success -> go to next step
    router.push('/general-account/next-step');
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-slate-50 text-slate-800 py-16 px-6 md:px-16 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8"
      >
        <motion.h1 className="text-3xl md:text-4xl font-extrabold text-center tracking-tight">
          Create <span className="text-[#6d6bd3]">Your Account</span>
        </motion.h1>

        <motion.p className="mt-3 text-center text-slate-600 text-base">
          Sign up to explore careers, build skills, and design your future.
        </motion.p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-5">
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">
              Full Name
            </label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-base focus:ring-2 focus:ring-[#6d6bd3] focus:outline-none"
              placeholder="John Anderson"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-base focus:ring-2 focus:ring-[#6d6bd3] focus:outline-none"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-base focus:ring-2 focus:ring-[#6d6bd3] focus:outline-none"
              placeholder="••••••••"
            />
          </div>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            type="submit"
            className="w-full bg-[#6d6bd3] text-white rounded-xl py-3 font-semibold text-lg shadow-md hover:shadow-xl transition-all duration-300"
          >
            Sign Up
          </motion.button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-500">
          Already have an account?{' '}
          <a href="/login" className="text-[#6d6bd3] font-medium hover:underline">
            Log In
          </a>
        </p>
      </motion.div>
    </main>
  );
}
