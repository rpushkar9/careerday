'use client';

import Image from 'next/image';
import Link from 'next/link';
import Container from 'react-bootstrap/Container';
import { Button } from '@/components/ui/button';
import Footer from '@/components/footer';
import Navbar from '@/components/navbar';
import { useState } from 'react';




export default function About() {
  const [showCareerModal, setShowCareerModal] = useState(false);

  return (
    <>


      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-[#6d6bd3] via-[#5a58b8] to-[#6d6bd3] min-h-[600px] overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://public.readdy.ai/ai/img_res/0f842a5615fc80362a29e48bd4ce0497.jpg')] bg-cover opacity-20"></div>
        <div className="max-w-7xl mx-auto px-6 py-28 relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="text-white z-10">
              <h1 className="text-5xl font-extrabold leading-tight mb-6 drop-shadow-lg">
                Design Your Future with
                <span className="block mt-2 text-[#ffffff]">
                  AI-Powered Guidance
                </span>
              </h1>
              <p className="text-xl text-gray-100 mb-8 leading-relaxed">
                Discover your perfect career path, explore top educational
                opportunities, and receive personalized recommendations powered
                by AI.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/signup">
                  <button
                    onClick={() => setShowCareerModal(true)}
                    className="rounded-full bg-white text-[#6d6bd3] px-8 py-4 font-semibold hover:bg-gray-100 transition duration-200 shadow-lg"
                  >
                    Start Your Journey
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="max-w-7xl mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">How It Works</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our career recommendation system uses your unique profile to match
            you with careers that align with your strengths and preferences.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              num: '1',
              title: 'Complete the Survey',
              desc: 'Answer questions about your interests, skills, and values to create your unique profile.',
            },
            {
              num: '2',
              title: 'Get Personalized Recommendations',
              desc: 'Our AI analyzes your responses to match you with careers aligned to your strengths.',
            },
            {
              num: '3',
              title: 'Explore Career Roadmaps',
              desc: 'Dive deeper into each career with detailed paths for education and advancement.',
            },
          ].map((step, i) => (
            <div
              key={i}
              className="text-center p-8 bg-white rounded-2xl shadow-md hover:shadow-xl transition"
            >
              <div className="w-16 h-16 bg-[#6d6bd3] rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-6">
                {step.num}
              </div>
              <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
              <p className="text-gray-600">{step.desc}</p>
            </div>
          ))}
        </div>

        <div className="text-center mt-20">
          <Link href="/survey">
            <Button
              size="lg"
              className="rounded-full px-10 py-4 bg-[#6d6bd3] hover:bg-[#5a58b8] text-lg font-semibold shadow-lg"
            >
              Start Your Career Journey
            </Button>
          </Link>
        </div>
      </div>


    </>
  );
}
