'use client';

import { useState } from 'react';
import Filters from '@/components/explore-careers/Filters';
import QuizBanner from '@/components/explore-careers/QuizBanner';
import CareerCard from '@/components/explore-careers/CareerCard';
import SearchBar from '@/components/explore-careers/SearchBar';

import { motion } from 'framer-motion';

export default function CareerDatabasePage() {
  const [search, setSearch] = useState('');

  const careers = [
    {
      title: 'Software Engineer',
      description:
        'Design, develop, test, and maintain computer applications to solve problems and meet user needs',
      majors: [
        'Computer Science',
        'Software Engineering',
        'Computer Engineering',
      ],
      income: '$60-80k',
      education: "Bachelor's degree",
    },
    {
      title: 'UX Designer',
      description:
        'Research, prototype, and refine interfaces to enhance overall user experience with a product or service',
      majors: [
        'Human-Computer Interaction',
        'Graphic Design',
        'Computer Science',
      ],
      income: '$60-80k',
      education: "Bachelor's degree",
    },
    {
      title: 'Pharmacist',
      description:
        'Prepare, dispense, and provide guidance on medications, ensuring their safe use for patients',
      majors: [
        'Pharmaceutical Sciences',
        'Biology',
        'Chemistry',
        'Biochemistry',
      ],
      income: '$40-60k',
      education: "Bachelor's degree",
    },
    {
      title: 'Accountant',
      description:
        "Review and analyze financial records, tracking a company's or individual's income, expenses, and tax liabilities",
      majors: ['Accounting', 'Business Management', 'Finance'],
      income: '$40-60k',
      education: "Bachelor's degree",
    },
  ];

  return (
    <>
      <main className="min-h-screen bg-gradient-to-b from-white to-slate-50 text-slate-800 py-16 px-6 md:px-16">
        {/* Page Header */}
        <section className="text-center mb-16">
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl font-extrabold md:text-6xl tracking-tight"
          >
            Explore <span className="text-[#6d6bd3]">Careers</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mt-4 max-w-3xl mx-auto text-lg text-slate-600"
          >
            Discover your perfect career path, compare salaries, and explore
            educational requirements to design your future with confidence.
          </motion.p>
        </section>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-12">
          <SearchBar search={search} setSearch={setSearch} />
        </div>

        {/* Quiz Banner */}
        <div className="my-10 max-w-4xl mx-auto">
          <QuizBanner />
        </div>

        {/* Content */}
        <div className="flex flex-col md:flex-row gap-10 max-w-6xl mx-auto">
          {/* Sidebar Filters */}
          <aside className="md:w-1/4 bg-white rounded-2xl p-6 shadow-md sticky top-24">
            <Filters />
          </aside>

          {/* Career Cards */}
          <section className="flex-1 flex flex-col gap-6">
            {careers
              .filter(c => c.title.toLowerCase().includes(search.toLowerCase()))
              .map((career, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                  className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-2xl transition-shadow duration-300"
                >
                  <CareerCard {...career} />
                </motion.div>
              ))}
          </section>
        </div>
      </main>
    </>
  );
}
