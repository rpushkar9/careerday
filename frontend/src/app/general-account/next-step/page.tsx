'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

export default function NextStepPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-slate-50 text-slate-800 py-16 px-6 md:px-16 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-2xl text-center"
      >
        <h1 className="text-3xl md:text-4xl font-extrabold mb-6">
          What would you like to do next?
        </h1>
        <p className="text-slate-600 mb-12">
          Choose an option to continue your journey.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link href="/general-account/questions">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white rounded-2xl shadow-lg p-8 cursor-pointer hover:shadow-xl transition"
            >
              <h2 className="text-xl font-semibold mb-3 text-[#6d6bd3]">
                Add Additional Questions
              </h2>
              <p className="text-slate-600 text-sm">
                Answer a few extra questions to personalize your experience.
              </p>
            </motion.div>
          </Link>

          <Link href="/explore-careers">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white rounded-2xl shadow-lg p-8 cursor-pointer hover:shadow-xl transition"
            >
              <h2 className="text-xl font-semibold mb-3 text-[#6d6bd3]">
                Explore Careers
              </h2>
              <p className="text-slate-600 text-sm">
                Browse career paths and discover opportunities right away.
              </p>
            </motion.div>
          </Link>
        </div>
      </motion.div>
    </main>
  );
}
