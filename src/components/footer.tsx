'use client';
import Link from 'next/link';
import { animate } from 'framer-motion';


  const Footer = () => {

  const scrollToFAQ = () => {
    const faq = document.getElementById('faq');
    if (faq) {
      animate(0, faq.offsetTop, {
        duration: 0.8,
        onUpdate: (latest) => window.scrollTo(0, latest),
      });
    }
  };

  return (
    <footer className="bg-[#6d6bd3] text-white py-10 mt-10">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Logo & About */}
        <div>
          <h2 className="text-2xl font-bold">CareerDay</h2>
          <p className="mt-3 text-sm">
            Helping students discover careers, build skills, and achieve their
            goals with personalized guidance.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/about" className="text-white hover:text-white">
                About Us
              </Link>
            </li>
           
         <li>
  <a
    href="https://mail.google.com/mail/?view=cm&to=sheylavperez@gmail.com&su=Hello&body=Hi%20Sheyla"
    target="_blank"
    rel="noopener noreferrer"
    className="text-white hover:text-white"
  >
    Contact
  </a>
</li>

            {/* <li>
              <Link href="/blog" className="text-white hover:text-white">
                Blog
              </Link>
            </li> */}
          </ul>
        </div>

        {/* Resources */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Resources</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/roadmap" className="text-white hover:text-white">
                Career Roadmaps
              </Link>
            </li>
            <li>
              <Link href="/quiz" className="text-white hover:text-white">
                Career Quiz
              </Link>
            </li>
            <li>
              <Link href="/about#faq" className="text-white hover:text-white">
                FAQ
              </Link>
            </li>
            {/* <li>
              <Link href="/support" className="text-white hover:text-white">
                Support
              </Link>
            </li> */}
          </ul>
        </div>

        {/* Social Media */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Connect With Us</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <a
                href="https://www.linkedin.com/company/23careerday/?viewAsMember=true"
                target="_blank"
                className="text-white hover:text-white"
              >
                LinkedIn
              </a>
            </li>
            {/* <li>
              <a
                href="https://twitter.com"
                target="_blank"
                className="text-white hover:text-white"
              >
                Twitter
              </a>
            </li> */}
            <li>
              <a
                href="https://www.instagram.com/careerdayy/?igsh=MTVybnVoaXZ5dXNlOQ%3D%3D&utm_source=qr#"
                target="_blank"
                className="text-white hover:text-white"
              >
                Instagram
              </a>
            </li>
            {/* <li>
              <a
                href="mailto:info@careerday.com"
                className="text-white hover:text-white"
              >
                Email Us
              </a>
            </li> */}
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-700 mt-8 pt-4 text-center text-sm">
        © {new Date().getFullYear()} CareerDay. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
