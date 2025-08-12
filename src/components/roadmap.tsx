'use client';

import type React from 'react';
import { useState } from 'react';
import type { RoadmapData, SemesterData, CourseData } from '@/lib/types';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  BookOpen,
  Briefcase,
  GraduationCap,
  Heart,
  Lightbulb,
  DollarSign,
  Award,
} from 'lucide-react';

interface RoadmapProps {
  data: RoadmapData;
}

export function Roadmap({ data }: RoadmapProps) {
  const [activeYear, setActiveYear] = useState('year1');
  const [activeTab, setActiveTab] = useState('academic');

  if (!data || !data.years) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-2xl">Roadmap Error</CardTitle>
          <CardDescription>
            There was a problem generating your roadmap. Please try again.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const totalYears = 4;
  const yearIndex = Number.parseInt(activeYear.replace('year', ''));
  const progress = (yearIndex / totalYears) * 100;
  const yearData = data.years[activeYear];

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <CardTitle className="text-2xl">Your Academic Roadmap</CardTitle>
            <CardDescription>
              Personalized recommendations for {data.major} at Queens College
            </CardDescription>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Award className="h-5 w-5 text-primary" />

            <span>Total Credits: {data.totalDegreeCredits}</span>
            <span className="mx-2">|</span>
            <DollarSign className="h-5 w-5 text-green-600" />
            <span>Total Cost: $29,360</span>
          </div>
        </div>
        <div className="mt-4">
          <div className="flex justify-between text-sm mb-1">
            <span>FULL-TIME 12 Credits | New York State Resident </span>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-4 mb-6">
            <TabsTrigger value="academic">Academic</TabsTrigger>
            <TabsTrigger value="resources">Resources</TabsTrigger>
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="opportunities">Opportunities</TabsTrigger>
          </TabsList>

          <TabsContent value="academic" className="space-y-8">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-semibold">
                Year {yearIndex} Overview
              </h3>
              <div className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-green-600" />
                <span className="font-semibold">
                  ${yearData.totalCost.toLocaleString()}
                </span>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-6">
              <SemesterCard
                title="Fall Semester"
                semesterData={yearData.fall}
              />
            </div>
          </TabsContent>

          {/* <TabsContent value="opportunities" className="space-y-6">
            <SectionItem
              title="Internships"
              icon={<Briefcase className="h-5 w-5 text-blue-500" />}
              items={[
                <a
                  href="https://www.citycollege.edu/cybersecurity-internships"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Cybersecurity Internship at City College: Gain hands-on
                  experience by working on real-world security projects in
                  collaboration with industry partners.
                </a>,
                <a
                  href="https://www.citycollege.edu/tech-internships"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Tech Internships Program: Participate in cybersecurity-focused
                  internships offered by City College's career services.
                </a>,
              ]}
            />

            <SectionItem
              title="Volunteer Work"
              icon={<Heart className="h-5 w-5 text-red-500" />}
              items={[
                <a
                  href="https://www.citycollege.edu/cybersecurity-volunteer"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Volunteer in Cybersecurity Awareness Campaigns: Help the
                  community by volunteering in cybersecurity awareness programs
                  organized by City College.
                </a>,
              ]}
            />

            <SectionItem
              title="Career Fairs"
              icon={<GraduationCap className="h-5 w-5 text-purple-500" />}
              items={[
                <a
                  href="https://www.citycollege.edu/career-fairs"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  City College Career Fair: Attend City College's annual career
                  fair where cybersecurity companies and employers gather to
                  recruit students.
                </a>,
              ]}
            />

            <SectionItem
              title="Workshops"
              icon={<Lightbulb className="h-5 w-5 text-amber-500" />}
              items={[
                <a
                  href="https://www.citycollege.edu/cybersecurity-workshops"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Cybersecurity Workshops: City College offers workshops that
                  focus on network security, ethical hacking, and penetration
                  testing to provide practical knowledge in the field.
                </a>,
                <a
                  href="https://www.citycollege.edu/advanced-cybersecurity"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Advanced Cybersecurity Techniques: Take part in workshops that
                  dive into advanced topics like cryptography, digital
                  forensics, and incident response.
                </a>,
                <a
                  href="https://www.citycollege.edu/it-security-workshops"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  IT Security Workshops: Workshops that offer practical tips to
                  minimize the risk of cybercrime, including password security,
                  encryption basics, and more.
                </a>,
                <a
                  href="https://www.eventbrite.com/e/559909904597"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Keep It Secure: Cybersecurity for Startups and Small
                  Businesses (March 15, 2023, 5:30 PM – 6:30 PM): A workshop
                  focused on protecting yourself and your business from
                  cybersecurity threats.
                </a>,
                <a
                  href="https://cybersecurity.ccny.cuny.edu/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Cybersecurity Master's Program: A comprehensive program
                  focusing on advanced technical skills in cybersecurity,
                  recognized by the NSA as a National Center of Academic
                  Excellence.
                </a>,
                <a
                  href="https://www1.cuny.edu/mu/forum/2023/12/27/ccnys-cybersecurity-masters-program-is-designated-as-a-national-center-of-academic-excellence-in-cyber-defense/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Cyber NYC Internship Program: City College partners with
                  NYCEDC to offer paid internships in the cybersecurity field,
                  providing hands-on training, networking, and real-world
                  experience.
                </a>,
              ]}
            />
          </TabsContent> */}

          <TabsContent value="opportunities" className="space-y-6">
  <SectionItem
    title="Internships"
    icon={<Briefcase className="h-5 w-5 text-blue-500" />}
    items={[
      <a
        href="https://www.qc.cuny.edu/academics/buac/internships/"
        target="_blank"
        rel="noopener noreferrer"
      >
        Queens College Accounting Internship Program: Gain experience in auditing, taxation, and financial analysis with NYC firms.
      </a>,
      <a
        href="https://www.nysscpa.org/prospective/join/student-membership"
        target="_blank"
        rel="noopener noreferrer"
      >
        NYSSCPA Student Membership: Network with accounting professionals and access exclusive internship opportunities.
      </a>,
    ]}
  />

  <SectionItem
    title="Volunteer Work"
    icon={<Heart className="h-5 w-5 text-red-500" />}
    items={[
      <a
        href="https://www.irs.gov/volunteers"
        target="_blank"
        rel="noopener noreferrer"
      >
        Volunteer Income Tax Assistance (VITA): Help prepare tax returns for low-income individuals and families.
      </a>,
    ]}
  />

  <SectionItem
    title="Career Fairs"
    icon={<GraduationCap className="h-5 w-5 text-purple-500" />}
    items={[
      <a
        href="https://career.qc.cuny.edu/events/"
        target="_blank"
        rel="noopener noreferrer"
      >
        Queens College Business & Accounting Career Fair: Meet employers from public accounting firms, private industry, and government agencies.
      </a>,
    ]}
  />

  <SectionItem
    title="Workshops"
    icon={<Lightbulb className="h-5 w-5 text-amber-500" />}
    items={[
      <a
        href="https://www.qc.cuny.edu/academics/buac/events/"
        target="_blank"
        rel="noopener noreferrer"
      >
        CPA Exam Prep Workshops: Guidance on study strategies and application process.
      </a>,
      <a
        href="https://www.aicpa.org/resources/article/career-paths-in-accounting"
        target="_blank"
        rel="noopener noreferrer"
      >
        Career Paths in Accounting: Learn about public, private, government, and nonprofit accounting roles.
      </a>,
    ]}
  />
</TabsContent>


          {/* <TabsContent value="projects" className="space-y-6">
            <h2 className="text-2xl font-semibold text-black">
              Basic Network Security Assessment
            </h2>
            <p className="text-gray-700">
              Objective: Evaluate the security of a small network by identifying
              vulnerabilities, configuring basic firewalls, and implementing
              security best practices.
            </p>

            <h3 className="text-xl font-semibold text-black mt-6">
              Task Description
            </h3>
            <p className="text-gray-700">
              As part of this task, you'll perform a basic network security
              assessment on a sample home or university network. This involves
              identifying potential vulnerabilities, configuring firewall rules,
              and setting up monitoring tools. You'll also learn about common
              attacks and how to defend against them.
            </p>

            <h3 className="text-xl font-semibold text-black mt-6">Steps:</h3>
            <ul className="list-disc pl-6 text-gray-700">
              <li>
                <strong>Network Mapping:</strong> Use tools like{' '}
                <code className="text-purple-600">Nmap</code> to map out the
                devices and services on the local network. Identify open ports
                and any unprotected services that could be vulnerable.
              </li>
              <li>
                <strong>Vulnerability Scanning:</strong> Use vulnerability
                scanners like <code className="text-purple-600">Nessus</code> or{' '}
                <code className="text-purple-600">OpenVAS</code> to scan for
                known vulnerabilities in the network devices. Document and
                classify them based on severity.
              </li>
              <li>
                <strong>Firewall Configuration:</strong> Set up basic firewall
                rules using tools like{' '}
                <code className="text-purple-600">ufw</code> on Linux or Windows
                Defender Firewall on Windows. Block all incoming traffic except
                for essential ports (e.g., HTTP, HTTPS).
              </li>
              <li>
                <strong>Simulate a Basic Attack:</strong> Perform a{' '}
                <strong>Ping of Death</strong> or{' '}
                <strong>Port Scanning Attack</strong> using tools like{' '}
                <code className="text-purple-600">hping</code> or{' '}
                <code className="text-purple-600">Metasploit</code> in a
                controlled environment. Learn how these attacks work and
                document how the firewall should block them.
              </li>
              <li>
                <strong>Incident Response Setup:</strong> Install and configure
                an <strong>Intrusion Detection System (IDS)</strong> like{' '}
                <code className="text-purple-600">Snort</code> to monitor
                traffic and identify potential security incidents. Review logs
                for detected intrusion attempts.
              </li>
              <li>
                <strong>Reporting:</strong> Write a report detailing the
                findings of your network mapping, vulnerability scan, firewall
                configuration, attack simulation, and incident response setup.
                Include recommendations for further network hardening.
              </li>
            </ul>

            <h3 className="text-xl font-semibold text-black mt-6">
              Skills Gained:
            </h3>
            <ul className="list-disc pl-6 text-gray-700">
              <li>
                Knowledge of networking protocols (e.g., TCP/IP, HTTP, HTTPS).
              </li>
              <li>
                Familiarity with network scanning tools (
                <code className="text-purple-600">Nmap</code>,{' '}
                <code className="text-purple-600">Nessus</code>).
              </li>
              <li>
                Basic understanding of firewall configuration and security best
                practices.
              </li>
              <li>
                Experience with Intrusion Detection Systems (IDS) like{' '}
                <code className="text-purple-600">Snort</code>.
              </li>
              <li>
                Hands-on understanding of how cyberattacks work and how to
                defend against them.
              </li>
              <li>Writing professional security reports.</li>
            </ul>
          </TabsContent> */}

          <TabsContent value="projects" className="space-y-6">
  <h2 className="text-2xl font-semibold text-black">
    Financial Statement Analysis Project
  </h2>
  <p className="text-gray-700">
    Objective: Analyze a publicly traded company’s financial statements to evaluate its financial health and make recommendations.
  </p>

  <h3 className="text-xl font-semibold text-black mt-6">Task Description</h3>
  <p className="text-gray-700">
    You'll review the company's balance sheet, income statement, and cash flow statement, calculate key financial ratios, and prepare a summary report for stakeholders.
  </p>

  <h3 className="text-xl font-semibold text-black mt-6">Steps:</h3>
  <ul className="list-disc pl-6 text-gray-700">
    <li>Choose a Fortune 500 company and download its latest annual report.</li>
    <li>Calculate liquidity, profitability, and leverage ratios.</li>
    <li>Identify trends by comparing 3 years of financial data.</li>
    <li>Prepare recommendations for potential investors or management.</li>
  </ul>

  <h3 className="text-xl font-semibold text-black mt-6">Skills Gained:</h3>
  <ul className="list-disc pl-6 text-gray-700">
    <li>Financial statement analysis</li>
    <li>Ratio calculation and interpretation</li>
    <li>Report writing for business audiences</li>
    <li>Business decision-making based on data</li>
  </ul>
</TabsContent>


          {/* <TabsContent value="resources">
            <div className="space-y-6">
              <SectionItem
                title="Cybersecurity Resources for Freshmen"
                icon={<BookOpen className="h-5 w-5 text-primary" />}
                items={[
                  <a
                    href="https://www.coursera.org/courses?query=cybersecurity"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Free online courses on cybersecurity: Check platforms like
                    Coursera for introductory courses.
                  </a>,
                  <a
                    href="https://www.cybrary.it/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Cybrary: Offers free and paid courses focused on
                    cybersecurity and network security.
                  </a>,
                  <a
                    href="https://www.youtube.com/c/TheCyberMentor"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    YouTube Channels: Explore 'The Cyber Mentor' for hands-on
                    learning and tutorials.
                  </a>,
                  <a
                    href="https://www.amazon.com/Web-Application-Hackers-Handbook-Defending/dp/1118026470"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Books: 'The Web Application Hacker's Handbook' for ethical
                    hacking basics.
                  </a>,
                  <a
                    href="https://www.amazon.com/Cybersecurity-Canon-Annual-Collection-Must-Reads/dp/1955179020"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Books: 'The Cybersecurity Canon' for a broad range of
                    security topics.
                  </a>,
                  <p>
                    Practice: Set up a home lab using virtual machines to
                    practice penetration testing and security setups.
                  </p>,
                  <a
                    href="https://www.hackthebox.eu/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Competitions: Participate in Capture The Flag (CTF)
                    competitions to gain practical cybersecurity skills.
                  </a>,
                  <a
                    href="https://www.reddit.com/r/cybersecurity/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Forums and Communities: Join cybersecurity forums like
                    Reddit’s /r/cybersecurity for advice.
                  </a>,
                  <a
                    href="https://www.comptia.org/certifications/security"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Certifications: Start with CompTIA Security+ and Certified
                    Ethical Hacker (CEH).
                  </a>,
                  <a
                    href="https://www.meetup.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Local Meetups: Find or organize meetups through Meetup.com
                    to network with other cybersecurity enthusiasts.
                  </a>,
                  <a
                    href="https://devpost.com/hackathons"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Hackathons: Participate in cybersecurity-focused hackathons
                    to collaborate and learn real-world skills.
                  </a>,
                ]}
              />
            </div>
          </TabsContent> */}


          <TabsContent value="resources">
  <div className="space-y-6">
    <SectionItem
      title="Accounting Resources for Queens College Students"
      icon={<BookOpen className="h-5 w-5 text-primary" />}
      items={[
        <a
          href="https://www.qc.cuny.edu/academics/buac/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Queens College Department of Accounting & Information Systems
        </a>,
        <a
          href="https://www.aicpa.org/"
          target="_blank"
          rel="noopener noreferrer"
        >
          American Institute of CPAs (AICPA)
        </a>,
        <a
          href="https://nasba.org/exams/cpaexam/"
          target="_blank"
          rel="noopener noreferrer"
        >
          CPA Exam Requirements and Registration
        </a>,
        <a
          href="https://www.nysscpa.org/"
          target="_blank"
          rel="noopener noreferrer"
        >
          New York State Society of CPAs
        </a>,
        <a
          href="https://corporatefinanceinstitute.com/resources/accounting/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Corporate Finance Institute - Accounting Tutorials
        </a>,
      ]}
    />
  </div>
</TabsContent>

        </Tabs>
      </CardContent>
    </Card>
  );
}

interface SemesterCardProps {
  title: string;
  semesterData: SemesterData;
}

function SemesterCard({ title, semesterData }: SemesterCardProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">{title}</CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="font-normal">
              {semesterData.totalCredits} Credits
            </Badge>
            <Badge variant="outline" className="font-normal text-green-600">
              ${semesterData.tuition.toLocaleString()}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <CourseSection courses={semesterData.courses} />
      </CardContent>
    </Card>
  );
}

interface CourseSectionProps {
  courses: CourseData[];
}

function CourseSection({ courses }: CourseSectionProps) {
  if (!courses || courses.length === 0) {
    return (
      <div className="p-3 rounded-md border">
        <p className="text-muted-foreground">No courses available.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <BookOpen className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-medium">Courses</h3>
      </div>
      <div className="space-y-2">
        {courses.map((course, index) => (
          <div
            key={index}
            className="flex items-start gap-2 p-3 rounded-md border"
          >
            <Badge
              variant="outline"
              className="mt-0.5 min-w-[60px] text-center"
            >
              {course.code}
            </Badge>
            <div className="flex-1">
              <p className="font-medium">{course.name}</p>
              <p className="text-sm text-muted-foreground">
                {course.credits} credits
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

interface SectionItemProps {
  title: string;
  icon: React.ReactNode;
  items: React.ReactNode[];
}

function SectionItem({ title, icon, items }: SectionItemProps) {
  if (!items || items.length === 0) {
    return (
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          {icon}
          <h3 className="font-medium">{title}</h3>
        </div>
        <div className="p-2 rounded-md border">
          <p className="text-sm text-muted-foreground">
            No {title.toLowerCase()} recommendations available.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-1">
      <div className="flex items-center gap-2">
        {icon}
        <h3 className="font-medium">{title}</h3>
      </div>
      <div className="space-y-2">
        {items.map((item, index) => (
          <div key={index} className="p-2 rounded-md border text-sm">
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}
