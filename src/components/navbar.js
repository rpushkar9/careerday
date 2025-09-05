'use client';
import Link from 'next/link';
import { useState } from 'react';

const Navbar = () => {
  return (
    <>
      <nav className="bg-white shadow-md fixed w-full z-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between h-20 items-center">
            {/* Logo */}
            <div className="flex items-center space-x-12">
              <div className="flex items-center">
                <i className="fas fa-road text-[#6d6bd3] text-3xl mr-3"></i>
                <Link href="/">
                  <span className="text-2xl font-bold bg-gradient-to-r from-[#6d6bd3] to-[#6d6bd3] text-transparent bg-clip-text">
                    CareerDayy
                  </span>
                </Link>
              </div>
              {/* Navigation Links */}
              <div className="hidden md:flex space-x-8">
                <Link
                  href="/explore-careers"
                  className="text-[#6d6bd3] hover:text-[#5a57c1] font-medium"
                >
                  Explore Careers
                </Link>
                <Link
                  href="/testimonials"
                  className="text-[#6d6bd3] hover:text-[#5a57c1] font-medium"
                >
                  Success Stories
                </Link>
              </div>
            </div>
            {/* Right Side Buttons */}
            <div className="flex items-center space-x-4">
              {/* <button className="hidden md:flex items-center space-x-2 px-5 py-2.5 bg-blue-50 text-blue-600 hover:bg-blue-100 transition duration-200 rounded-lg">
                <i className="fas fa-compass"></i>
                <span>Career Quiz</span>
              </button> */}
              {/* General Account / Login */}
              <Link
                href="/general-account"
                className="flex items-center space-x-2 px-5 py-2.5 bg-[#6d6bd3] text-white hover:bg-[#5a57c1] transition duration-200 rounded-lg"
              >
                <i className="fas fa-user-circle text-lg"></i>
                <span>Log In</span>
              </Link>
            </div>
          </div>
        </div>
      </nav>
      <div className="h-20"></div>
    </>
  );
};

export default Navbar;
