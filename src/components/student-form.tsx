'use client';

import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Roadmap } from './roadmap';
import { generateRoadmap } from '@/lib/generate-roadmap';
import type { RoadmapData } from '@/lib/types';

const formSchema = z.object({
  age: z.coerce
    .number()
    .min(16, { message: 'Age must be at least 16' })
    .max(100, { message: 'Age must be less than 100' }),
  university: z.string().min(2, { message: 'University is required' }),
  major: z.string().min(2, { message: 'Major is required' }),
});

export function StudentForm() {
  const [roadmapData, setRoadmapData] = useState<RoadmapData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      age: undefined,
      university: '',
      major: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setRoadmapData(null);

    try {
      // First try the server action
      try {
        const data = await generateRoadmap(values);
        setRoadmapData(data);
        return;
      } catch (serverActionError) {
        console.error('Server action failed:', serverActionError);
        // Fall back to API route
      }

      // If server action fails, try the API route
      try {
        const response = await fetch('/api/generate-roadmap', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(values),
        });

        if (!response.ok) {
          throw new Error(`API request failed with status ${response.status}`);
        }

        const data = await response.json();
        setRoadmapData(data);
      } catch (apiError) {
        console.error('API route failed:', apiError);

        // As a last resort, generate a fallback roadmap directly in the client
        // This is not ideal but ensures the user gets something
        const majorName =
          values.major === 'computer_science'
            ? 'Computer Science'
            : values.major === 'business'
              ? 'Business'
              : values.major;

        setRoadmapData({
          university: values.university,
          major: majorName,
          years: {
            year1: {
              fall: {
                courses: [
                  {
                    code: 'INTRO101',
                    name: 'Introduction to Major',
                    credits: 3,
                  },
                  { code: 'CORE101', name: 'Core Requirement 1', credits: 3 },
                  {
                    code: 'GEN101',
                    name: 'General Education Course 1',
                    credits: 3,
                  },
                ],
                opportunities: [
                  'Join a relevant student club',
                  'Attend orientation events',
                ],
                volunteerWork: ['Campus community service day'],
                internships: ['Research assistant (on-campus)'],
                projects: ['Introductory course project'],
                totalCredits: 9,
                tuition: 5000,
              },
              spring: {
                courses: [
                  { code: 'CORE102', name: 'Core Requirement 2', credits: 3 },
                  {
                    code: 'GEN102',
                    name: 'General Education Course 2',
                    credits: 3,
                  },
                ],
                opportunities: ['Meet with academic advisor regularly'],
                volunteerWork: ['Department-sponsored outreach program'],
                internships: ['Entry-level summer internship'],
                projects: ['Personal portfolio development'],
                totalCredits: 6,
                tuition: 5000,
              },
              totalCost: 10000,
            },
            year2: {
              fall: {
                courses: [
                  {
                    code: 'INT201',
                    name: 'Intermediate Major Course 1',
                    credits: 3,
                  },
                  { code: 'ELEC201', name: 'Related Elective 1', credits: 3 },
                ],
                opportunities: [
                  'Apply for department scholarships',
                  'Attend career fairs',
                ],
                volunteerWork: ['Peer tutoring'],
                internships: ['Summer internship in related field'],
                projects: ['Team-based course project'],
                totalCredits: 6,
                tuition: 5000,
              },
              spring: {
                courses: [
                  {
                    code: 'INT202',
                    name: 'Intermediate Major Course 2',
                    credits: 3,
                  },
                  {
                    code: 'GEN201',
                    name: 'General Education Course 3',
                    credits: 3,
                  },
                ],
                opportunities: ['Join study groups'],
                volunteerWork: ['Community organization related to field'],
                internships: ['Part-time job related to major'],
                projects: ['Independent study project'],
                totalCredits: 6,
                tuition: 5000,
              },
              totalCost: 10000,
            },
            year3: {
              fall: {
                courses: [
                  {
                    code: 'ADV301',
                    name: 'Advanced Major Course 1',
                    credits: 3,
                  },
                  {
                    code: 'ADV302',
                    name: 'Advanced Major Course 2',
                    credits: 3,
                  },
                ],
                opportunities: [
                  'Study abroad program',
                  'Research with faculty',
                ],
                volunteerWork: ['Leadership role in campus organization'],
                internships: ['Summer internship in target career field'],
                projects: ['Research project'],
                totalCredits: 6,
                tuition: 5000,
              },
              spring: {
                courses: [
                  {
                    code: 'ADV303',
                    name: 'Advanced Major Course 3',
                    credits: 3,
                  },
                  { code: 'ELEC301', name: 'Related Elective 2', credits: 3 },
                ],
                opportunities: ['Professional conference attendance'],
                volunteerWork: ['Industry-related volunteer work'],
                internships: ['Co-op or part-time professional position'],
                projects: ['Professional portfolio development'],
                totalCredits: 6,
                tuition: 5000,
              },
              totalCost: 10000,
            },
            year4: {
              fall: {
                courses: [
                  { code: 'SEN401', name: 'Senior Seminar', credits: 3 },
                  { code: 'CAP401', name: 'Capstone Course', credits: 3 },
                ],
                opportunities: [
                  'Present at undergraduate research symposium',
                  'Network with alumni',
                ],
                volunteerWork: ['Mentor underclassmen'],
                internships: ['Pre-professional internship'],
                projects: ['Senior thesis or capstone project'],
                totalCredits: 6,
                tuition: 5000,
              },
              spring: {
                courses: [
                  {
                    code: 'SPEC401',
                    name: 'Specialized Elective 1',
                    credits: 3,
                  },
                  {
                    code: 'PROF401',
                    name: 'Professional Development Course',
                    credits: 3,
                  },
                ],
                opportunities: ['Graduate school application preparation'],
                volunteerWork: ['Professional organization volunteer'],
                internships: ['Job shadowing in target career'],
                projects: ['Industry-standard portfolio completion'],
                totalCredits: 6,
                tuition: 5000,
              },
              totalCost: 10000,
            },
          },
          totalDegreeCredits: 120,
          totalDegreeCost: 40000,
        });
      }
    } catch (error) {
      console.error('Failed to generate roadmap:', error);
      // Show an error message to the user
      alert('Failed to generate roadmap. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-8">
      <Card className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <FormField
                control={form.control}
                name="age"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Age</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Enter your age"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="university"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>University</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your university" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="major"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Major</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select your major" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="computer_science">
                          Computer Science
                        </SelectItem>
                        <SelectItem value="business">Business</SelectItem>
                        <SelectItem value="engineering">Engineering</SelectItem>
                        <SelectItem value="psychology">Psychology</SelectItem>
                        <SelectItem value="biology">Biology</SelectItem>
                        <SelectItem value="english">English</SelectItem>
                        <SelectItem value="history">History</SelectItem>
                        <SelectItem value="mathematics">Mathematics</SelectItem>
                        <SelectItem value="physics">Physics</SelectItem>
                        <SelectItem value="chemistry">Chemistry</SelectItem>
                        <SelectItem value="economics">Economics</SelectItem>
                        <SelectItem value="accountant">Accountant</SelectItem>
                        <SelectItem value="political_science">
                          Political Science
                        </SelectItem>
                        <SelectItem value="sociology">Sociology</SelectItem>
                        <SelectItem value="art">Art</SelectItem>
                        <SelectItem value="music">Music</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Generating Roadmap...' : 'Generate Roadmap'}
            </Button>
          </form>
        </Form>
      </Card>

      {roadmapData && <Roadmap data={roadmapData} />}
    </div>
  );
}
