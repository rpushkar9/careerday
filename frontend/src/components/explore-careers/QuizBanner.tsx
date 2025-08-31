'use client';

import { Button } from '@/components/ui/button';

export default function QuizBanner() {
  return (
    <div className="flex flex-col md:flex-row items-center justify-between bg-gradient-to-r from-[#6d6bd3]/20 to-[#8b84f2]/20 border rounded-2xl p-6 shadow-sm">
      <div className="mb-4 md:mb-0">
        <p className="text-lg font-semibold text-[#6d6bd3]">
          Feeling Overwhelmed?
        </p>
        <p className="text-sm text-gray-600">
          Take this quiz and let us guide you with personalized career options.
        </p>
      </div>
      <Button
        className="rounded-full px-6 py-2 text-white shadow-sm transition hover:bg-[#5b59c0] focus:outline-none focus:ring-0 active:bg-[#5b59c0]"
        style={{
          backgroundColor: '#6d6bd3',
          color: '#ffffff',
        }}
      >
        Take the Quiz
      </Button>
    </div>
  );
}
