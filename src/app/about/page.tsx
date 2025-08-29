'use client';

import Image from 'next/image';
import Link from 'next/link';

import Container from 'react-bootstrap/Container';
// import { Button } from "react-bootstrap";
import { Button } from '@/components/ui/button';

import { useState } from 'react'; // Import useState for component state management

// import Navbar from "@/components/Navbar";


import { motion } from 'framer-motion';

export default function AboutPage() {
  return (
    <>

      <main className="min-h-screen bg-gradient-to-b from-white to-slate-50 text-slate-800">
        {/* Hero */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 -z-10 opacity-40 [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]">
            <svg
              className="w-[140%] h-[140%] -translate-x-1/5 -translate-y-1/5"
              viewBox="0 0 600 600"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g filter="url(#a)">
                <path
                  d="M477.8 214.3c36.3 67-4.2 151.7-76.7 197.6-72.5 45.9-175.2 53-236.3 5.2-61.1-47.8-80.6-153.4-39.3-221.8 41.2-68.4 142.3-99.6 221.9-77.9 79.6 21.7 94.1 29.9 130.4 96.9Z"
                  fill="currentColor"
                  className="text-[#6d6bd3]/20"
                />
              </g>
              <defs>
                <filter
                  id="a"
                  x="0"
                  y="0"
                  width="600"
                  height="600"
                  filterUnits="userSpaceOnUse"
                  colorInterpolationFilters="sRGB"
                >
                  <feGaussianBlur stdDeviation="60" />
                </filter>
              </defs>
            </svg>
          </div>
          <div className="mx-auto max-w-6xl px-6 py-20 md:py-28">
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-4xl font-extrabold tracking-tight md:text-6xl"
            >
              About <span className="text-[#6d6bd3]">CareerDayy</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="mt-5 max-w-3xl text-lg leading-7 text-slate-600"
            >
              We make career discovery clear, actionable, and inspiring so the
              next step isn’t scary, it’s exciting.
            </motion.p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="/get-started"
                className="inline-flex items-center justify-center rounded-2xl border border-transparent bg-[#6d6bd3] px-5 py-3 text-white shadow-sm transition hover:bg-[#5b59c0]"
              >
                Get Started
              </a>
              <a
                href="#contact"
                className="inline-flex items-center justify-center rounded-2xl border border-slate-300 bg-white px-5 py-3 text-slate-700 shadow-sm transition hover:border-slate-400"
              >
                Talk to Us
              </a>
            </div>
          </div>
        </section>

        {/* Mission */}
        <section className="mx-auto max-w-6xl px-6 py-12 md:py-16">
          <div className="grid gap-8 md:grid-cols-5 md:gap-12">
            <div className="md:col-span-3">
              <h2 className="text-2xl font-bold md:text-3xl">Our Mission</h2>
              <p className="mt-4 text-slate-600">
                CareerDayy helps students explore careers, plan their path, and
                access opportunities. Our AI-powered platform bridges the gap
                between education and employment, empowering students to pursue
                fulfilling careers.
              </p>
              <p className="mt-4 text-slate-600">
                Whether you’re a student or career switcher, we meet you where
                you are and help you move forward with confidence.
              </p>
            </div>
            <div className="md:col-span-2">
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h3 className="text-lg font-semibold">At a Glance</h3>
                <ul className="mt-4 space-y-3 text-slate-700">
                  <li className="flex items-start gap-3">
                    <span
                      className="mt-1 h-2 w-2 rounded-full"
                      style={{ backgroundColor: '#6d6bd3' }}
                    />{' '}
                    Clarity over complexity
                  </li>
                  <li className="flex items-start gap-3">
                    <span
                      className="mt-1 h-2 w-2 rounded-full"
                      style={{ backgroundColor: '#6d6bd3' }}
                    />{' '}
                    Practical, step-by-step guidance
                  </li>
                  <li className="flex items-start gap-3">
                    <span
                      className="mt-1 h-2 w-2 rounded-full"
                      style={{ backgroundColor: '#6d6bd3' }}
                    />{' '}
                    Community and accountability
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="bg-white/70 py-12 md:py-16">
          <div className="mx-auto max-w-6xl px-6">
            <h2 className="text-2xl font-bold md:text-3xl">What We Value</h2>
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {[
                {
                  title: 'Clarity',
                  desc: 'We turn career noise into a simple plan you can follow.',
                },
                {
                  title: 'Confidence',
                  desc: 'Resources and reps that help you move without second‑guessing.',
                },
                {
                  title: 'Momentum',
                  desc: 'Action beats anxiety. We focus on small wins that stack.',
                },
                {
                  title: 'Community',
                  desc: 'You’re not alone. Learn with your peers.',
                },
              ].map(v => (
                <motion.div
                  key={v.title}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ duration: 0.4 }}
                  className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
                >
                  <h3 className="text-lg font-semibold">{v.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {v.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* How We Help */}
        <section className="mx-auto max-w-6xl px-6 py-12 md:py-16">
          <div className="grid gap-8 lg:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-2xl font-bold md:text-3xl">How We Help</h2>
              <ul className="mt-6 space-y-4 text-slate-700">
                <li className="flex gap-3">
                  <span
                    className="mt-2 inline-block h-3 w-3 rounded-full"
                    style={{ backgroundColor: '#6d6bd3' }}
                  />{' '}
                  Guided career pathways
                </li>
                <li className="flex gap-3">
                  <span
                    className="mt-2 inline-block h-3 w-3 rounded-full"
                    style={{ backgroundColor: '#6d6bd3' }}
                  />{' '}
                  AI-powered career recommendations
                </li>
                <li className="flex gap-3">
                  <span
                    className="mt-2 inline-block h-3 w-3 rounded-full"
                    style={{ backgroundColor: '#6d6bd3' }}
                  />{' '}
                  Resocurces and Tips
                </li>
              </ul>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-2xl font-bold md:text-3xl">Who It’s For</h2>
              <p className="mt-4 text-slate-600">
                Students exploring options, career changers, and professionals
                ready to level up.
              </p>
              <div className="mt-6 grid grid-cols-2 gap-3">
                {[
                  'High School Seniors',
                  'Career Switchers',
                  'College Students',
                ].map(p => (
                  <div
                    key={p}
                    className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700"
                  >
                    {p}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Founder Note */}
        <section className="bg-white py-12 md:py-16">
          <div className="mx-auto max-w-4xl px-6">
            <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-white to-[#6d6bd3]/10 p-6 shadow-sm md:p-10">
              <div className="flex flex-col items-start gap-4 md:flex-row md:items-center md:gap-6">
                <div
                  className="h-32 w-32 shrink-0 overflow-hidden rounded-full bg-slate-200"
                  aria-hidden
                >
                  <Image
                    src="/Sheyla-pic.jpg"
                    alt="Founder"
                    width={64}
                    height={64}
                    className="h-full w-full object-cover rounded-full"
                  />
                </div>

                <div>
                  <h3 className="text-xl font-semibold">
                    A Note from Our Founder
                  </h3>
                  <p className="mt-2 text-slate-600">
                    We started CareerDayy to turn confusion into clarity. Our
                    goal is simple: give you a plan you can actually follow and
                    the support to follow through.
                  </p>
                  <p className="mt-4 text-slate-700 font-medium">
                    — The CareerDayy Team
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="mx-auto max-w-6xl px-6 py-12 md:py-16">
          <h2 id="faq" className="text-2xl font-bold md:text-3xl">
            Frequently Asked Questions
          </h2>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {[
              {
                q: 'Is CareerDayy free?',
                a: 'Access depends on your university. Many students can use CareerDayy for free through their school.',
              },

              {
                q: 'Can you help me switch careers?',
                a: 'Absolutely. We map your transferable skills and create a practical transition plan.',
              },
              {
                q: 'Do you partner with schools or orgs?',
                a: 'Yes, we run workshops and programs with universities and local libraries.',
              },
            ].map(item => (
              <div
                key={item.q}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
              >
                <p className="font-medium">{item.q}</p>
                <p className="mt-2 text-slate-600">{item.a}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Contact CTA */}
        {/* <section id="contact" className="bg-[#6d6bd3] py-14 text-white">
          <div className="mx-auto max-w-6xl px-6">
            <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
              <div>
                <h2 className="text-2xl font-bold md:text-3xl">Ready to take your next step?</h2>
                <p className="mt-2 text-[#6d6bd3]/40">Reach out—we’d love to hear where you’re headed.</p>
              </div>
              <a
                href="mailto:hello@careerdayy.com"
                className="inline-flex items-center justify-center rounded-2xl bg-white px-5 py-3 font-medium text-[#6d6bd3] shadow-sm transition hover:bg-[#e0e0ff]"
              >
                hello@careerdayy.com
              </a>
            </div>
          </div>
        </section> */}

     
      </main>
    </>
  );
}
