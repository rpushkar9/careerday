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

  // Add error handling for missing data
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

  // Calculate progress through the degree (simplified)
  const totalYears = 4;
  const yearIndex = Number.parseInt(activeYear.replace('year', ''));
  const progress = (yearIndex / totalYears) * 100;

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <CardTitle className="text-2xl">Your Academic Roadmap</CardTitle>
            <CardDescription>
              Personalized recommendations for {data.major} at {data.university}
            </CardDescription>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Award className="h-5 w-5 text-primary" />
            <span>Total Credits: {data.totalDegreeCredits}</span>
            <span className="mx-2">|</span>
            <DollarSign className="h-5 w-5 text-green-600" />
            <span>Total Cost: ${data.totalDegreeCost.toLocaleString()}</span>
          </div>
        </div>
        <div className="mt-4">
          <div className="flex justify-between text-sm mb-1">
            <span>Year {activeYear.replace('year', '')}</span>
            <span>{progress.toFixed(0)}% Complete</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </CardHeader>
      <CardContent>
        <Tabs
          defaultValue="year1"
          value={activeYear}
          onValueChange={setActiveYear}
        >
          <TabsList className="grid grid-cols-4 mb-6">
            <TabsTrigger value="year1">Year 1</TabsTrigger>
            <TabsTrigger value="year2">Year 2</TabsTrigger>
            <TabsTrigger value="year3">Year 3</TabsTrigger>
            <TabsTrigger value="year4">Year 4</TabsTrigger>
          </TabsList>

          {Object.entries(data.years).map(([yearKey, yearData]) => (
            <TabsContent key={yearKey} value={yearKey} className="space-y-8">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-semibold">
                  Year {yearKey.replace('year', '')} Overview
                </h3>
                <div className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-green-600" />
                  <span className="font-semibold">
                    ${yearData.totalCost.toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <SemesterCard
                  title="Fall Semester"
                  semesterData={yearData.fall}
                />
                <SemesterCard
                  title="Spring Semester"
                  semesterData={yearData.spring}
                />
              </div>
            </TabsContent>
          ))}
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
      <CardContent className="space-y-4">
        <CourseSection courses={semesterData.courses} />

        <div className="grid grid-cols-1 gap-3">
          <SectionItem
            title="Opportunities"
            icon={<Lightbulb className="h-5 w-5 text-amber-500" />}
            items={semesterData.opportunities}
          />
          <SectionItem
            title="Volunteer Work"
            icon={<Heart className="h-5 w-5 text-red-500" />}
            items={semesterData.volunteerWork}
          />
          <SectionItem
            title="Internships"
            icon={<Briefcase className="h-5 w-5 text-blue-500" />}
            items={semesterData.internships}
          />
          <SectionItem
            title="Projects"
            icon={<GraduationCap className="h-5 w-5 text-purple-500" />}
            items={semesterData.projects}
          />
        </div>
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
  items: string[];
}

function SectionItem({ title, icon, items }: SectionItemProps) {
  // Handle empty arrays
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
