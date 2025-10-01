'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

interface User {
  name: string;
  email: string;
}

export default function Navbar() {
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  // Check localStorage for logged-in user
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  const handleSignOut = () => {
    localStorage.removeItem('user');
    setUser(null);
    setIsProfileMenuOpen(false);
  };

  return (
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
              <Link href="/explore-careers" className="text-[#6d6bd3] hover:text-[#5a57c1] font-medium">
                Explore Careers
              </Link>
              <Link href="/testimonials" className="text-[#6d6bd3] hover:text-[#5a57c1] font-medium">
                Success Stories
              </Link>
            </div>
          </div>

          {/* Right Side Buttons */}
          <div className="flex items-center space-x-4">
            {user ? (
              // Profile Dropdown
              <div className="relative">
                <button
                  onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                  className="flex items-center space-x-2 px-5 py-2.5 bg-[#6d6bd3] text-white hover:bg-[#5a57c1] transition duration-200 rounded-lg"
                >
                  <i className="fas fa-user-circle text-lg"></i>
                  <span>{user.name}</span>
                </button>

                {isProfileMenuOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl py-2 border border-gray-100">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="font-medium text-gray-800">{user.name}</p>
                      <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                    <Link href="/account-settings" className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-50">
                      <i className="fas fa-user-cog w-5 text-gray-400"></i>
                      <span className="ml-3">Account Settings</span>
                    </Link>
                    <Link href="/my-progress" className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-50">
                      <i className="fas fa-chart-line w-5 text-gray-400"></i>
                      <span className="ml-3">My Progress</span>
                    </Link>
                    <Link href="/saved-paths" className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-50">
                      <i className="fas fa-bookmark w-5 text-gray-400"></i>
                      <span className="ml-3">Saved Paths</span>
                    </Link>
                    <div className="border-t border-gray-100 mt-2">
                      <button
                        onClick={handleSignOut}
                        className="flex items-center w-full px-4 py-3 text-red-600 hover:bg-gray-50"
                      >
                        <i className="fas fa-sign-out-alt w-5"></i>
                        <span className="ml-3">Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link
                  href="/general-account/login"
                  className="px-4 py-2 bg-[#6d6bd3] text-white rounded-lg hover:bg-[#5a57c1]"
                >
                  Login
                </Link>
                <Link
                  href="/general-account/signup"
                  className="px-4 py-2 border border-[#6d6bd3] text-[#6d6bd3] rounded-lg hover:bg-[#f0f0ff]"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
