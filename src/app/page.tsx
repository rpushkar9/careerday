
'use client';

import Image from 'next/image';
import Link from 'next/link';
import Container from 'react-bootstrap/Container';
// import { Button } from "react-bootstrap";
import { Button } from '@/components/ui/button';

import { useState } from 'react'; // Import useState for component state management

// import Navbar from "@/components/Navbar";
import './about.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from '@/components/navbar'; // Adjust the relative path if needed

export default function About() {
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false); // State to toggle profile menu
  const [showCareerModal, setShowCareerModal] = useState(false); // State to toggle the career modal

  return (
    <>
      <Navbar />

      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-[#6d6bd3] via-[#6d6bd3] to-[#6d6bd3] min-h-[600px] overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://public.readdy.ai/ai/img_res/0f842a5615fc80362a29e48bd4ce0497.jpg')] opacity-20"></div>
        <div className="max-w-7xl mx-auto px-4 py-20 relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="text-white z-10">
              <h1 className="text-5xl font-bold leading-tight mb-6">
                Design Your Future with
                <span className="block mt-2">AI-Powered Guidance</span>
              </h1>
              <p className="text-xl  text-white mb-8 leading-relaxed">
                Discover your perfect career path, explore top educational
                opportunities, and receive personalized recommendations powered
                by advanced AI technology.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/signup">
                  <button
                    onClick={() => setShowCareerModal(true)}
                    className="!rounded-button bg-white text-[#6d6bd3] px-8 py-4 font-semibold hover:bg-blue-50 transition duration-200 shadow-lg"
                  >
                    <i className="fas fa-rocket mr-2"></i>
                    Start Your Journey
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">How It Works</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our career recommendation system uses your unique profile to match
            you with careers that align with your strengths and preferences.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center p-6 border rounded-lg shadow-sm">
            <div className="w-16 h-16 bg-[#6d6bd3] rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
              1
            </div>
            <h3 className="text-xl font-semibold mb-2">Complete the Survey</h3>
            <p className="text-gray-600">
              Answer questions about your interests, skills, values, and
              preferences to create your unique profile.
            </p>
          </div>

          <div className="text-center p-6 border rounded-lg shadow-sm">
            <div className="w-16 h-16 bg-[#6d6bd3] rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
              2
            </div>
            <h3 className="text-xl font-semibold mb-2">
              Get Personalized Recommendations
            </h3>
            <p className="text-gray-600">
              Our algorithm analyzes your responses to identify careers that
              match your profile.
            </p>
          </div>

          <div className="text-center p-6 border rounded-lg shadow-sm">
            <div className="w-16 h-16 bg-[#6d6bd3] rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
              3
            </div>
            <h3 className="text-xl font-semibold mb-2">
              Explore Career Roadmaps
            </h3>
            <p className="text-gray-600">
              Dive deeper into each recommended career with detailed roadmaps
              for education, skills, and advancement.
            </p>
          </div>
        </div>

        <div className="text-center mt-16">
          <Link href="/survey">
            <Button size="lg" className="bg-[#6d6bd3] hover:bg-[#5a58b8]">
              Start Your Career Journey
            </Button>
          </Link>
        </div>
      </div>
    </>
  );
}
