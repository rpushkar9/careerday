'use client';

import React from 'react';
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { User, Network, FileText } from 'lucide-react';
import { motion } from 'framer-motion';

interface Testimonial {
  name: string;
  role: string;
  feedback: string;
  avatar?: string;
}

const testimonials: Testimonial[] = [
  {
    name: 'Alex Johnson',
    role: 'High School Student',
    feedback:
      'CareerDay helped me discover careers I never thought about. The personalized guidance is amazing!',
    avatar: '/avatars/alex.jpg',
  },
  {
    name: 'Maria Gomez',
    role: 'College Student',
    feedback:
      'I love how easy it is to explore career paths and get AI-powered recommendations.',
    avatar: '/avatars/maria.jpg',
  },
  {
    name: 'John Lee',
    role: 'High School Student',
    feedback:
      'The Career Quiz was super helpful in figuring out what I want to do after graduation.',
    avatar: '/avatars/john.jpg',
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.2, duration: 0.6 },
  }),
};

const TestimonialsPage: React.FC = () => {
  return (
    <>
      <main className="bg-white min-h-screen font-sans">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center py-16 px-6 text-[#202022]"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-[#6d6bd3]">
            What Students Say About CareerDay
          </h1>
          <p className="max-w-2xl mx-auto text-lg text-gray-700">
            Discover how CareerDay has helped students explore careers, build
            skills, and achieve their goals with personalized guidance and
            AI-powered insights.
          </p>
        </motion.header>

        {/* Testimonials Grid */}
        <section className="max-w-7xl mx-auto px-6 py-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((t, index) => (
            <motion.div
              key={index}
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              custom={index}
              className="bg-white text-[#202022] p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center bg-gray-100 text-[#6d6bd3] text-3xl">
                <i className="bi bi-person-circle"></i>
              </div>

              <p className="mb-4 text-gray-600 italic">"{t.feedback}"</p>
              <h3 className="font-semibold text-lg text-[#6d6bd3]">{t.name}</h3>
              <span className="text-sm text-gray-500">{t.role}</span>
            </motion.div>
          ))}
        </section>

        {/* Career Services Section */}
        <motion.section
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="bg-gradient-to-b from-[#6d6bd3] to-[#8b89e6] text-center text-white py-20 px-6 mt-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Discover Your Future Career?
          </h2>
          <p className="max-w-2xl mx-auto text-lg mb-12 opacity-90">
            Join thousands of students exploring career paths, building skills,
            and creating personalized roadmaps with CareerDay.
          </p>

          <div className="grid gap-8 md:grid-cols-3 max-w-5xl mx-auto">
            {[
              {
                icon: User,
                title: 'Career Path Exploration',
                desc: 'Learn about industries, roles, and opportunities that match your interests.',
              },
              {
                icon: Network,
                title: 'Skill-Building Challenges',
                desc: 'Gain practical experience through interactive challenges and exercises.',
              },
              {
                icon: FileText,
                title: 'AI-Powered Roadmaps',
                desc: 'Create a personalized career roadmap with actionable steps for success.',
              },
            ].map((card, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                custom={i}
              >
                <Card className="bg-white border-0 shadow-md text-[#202022]">
                  <CardContent className="flex flex-col items-center p-6 space-y-3">
                    <card.icon className="w-10 h-10 text-[#6d6bd3]" />
                    <h3 className="text-lg font-semibold text-[#6d6bd3]">
                      {card.title}
                    </h3>
                    <p className="text-sm text-gray-600">{card.desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="mt-12"
          >
            <Button
              size="lg"
              className="bg-white text-[#6d6bd3] font-semibold hover:bg-gray-100"
            >
              Get Started on Your Career Journey
            </Button>
          </motion.div>
        </motion.section>
      </main>

      {/* Newsletter Signup Section */}
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="bg-[#ffffff] py-24 px-6 text-center"
      >
        <h2 className="text-3xl md:text-4xl font-bold text-[#6d6bd3] mb-4">
          📩 Get Free Career Tips Weekly
        </h2>
        <p className="max-w-xl mx-auto text-gray-600 mb-8">
          Join our newsletter to receive expert career advice, job search
          strategies, and resources to help you succeed — straight to your
          inbox.
        </p>

        <form className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-xl mx-auto">
          <input
            type="email"
            placeholder="Enter your email"
            className="w-full sm:flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#6d6bd3]"
            required
          />
          <Button
            type="submit"
            className="bg-[#6d6bd3] text-white font-semibold px-6 py-3 rounded-lg hover:bg-[#5a57c7] transition"
          >
            Subscribe
          </Button>
        </form>

        <p className="text-sm text-gray-500 mt-6">
          No spam, unsubscribe anytime.
        </p>
      </motion.section>
    </>
  );
};

export default TestimonialsPage;
