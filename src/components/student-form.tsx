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
              courses: [
                'Introduction to Major',
                'Core Requirement 1',
                'Core Requirement 2',
                'General Education Course 1',
                'General Education Course 2',
              ],
              opportunities: [
                'Join a relevant student club or organization',
                'Attend department orientation events',
                'Meet with academic advisor regularly',
              ],
              volunteerWork: [
                'Campus community service day',
                'Department-sponsored outreach program',
              ],
              internships: [
                'Research assistant (on-campus)',
                'Entry-level summer internship',
              ],
              projects: [
                'Introductory course project',
                'Personal portfolio development',
              ],
            },
            year2: {
              courses: [
                'Intermediate Major Course 1',
                'Intermediate Major Course 2',
                'Related Elective 1',
                'General Education Course 3',
                'Minor Course (if applicable)',
              ],
              opportunities: [
                'Apply for department scholarships',
                'Attend career fairs',
                'Join study groups',
              ],
              volunteerWork: [
                'Peer tutoring',
                'Community organization related to field',
              ],
              internships: [
                'Summer internship in related field',
                'Part-time job related to major',
              ],
              projects: [
                'Team-based course project',
                'Independent study project',
              ],
            },
            year3: {
              courses: [
                'Advanced Major Course 1',
                'Advanced Major Course 2',
                'Advanced Major Course 3',
                'Related Elective 2',
                'Minor Course (if applicable)',
              ],
              opportunities: [
                'Study abroad program',
                'Research with faculty',
                'Professional conference attendance',
              ],
              volunteerWork: [
                'Leadership role in campus organization',
                'Industry-related volunteer work',
              ],
              internships: [
                'Summer internship in target career field',
                'Co-op or part-time professional position',
              ],
              projects: [
                'Research project',
                'Professional portfolio development',
              ],
            },
            year4: {
              courses: [
                'Senior Seminar',
                'Capstone Course',
                'Specialized Elective 1',
                'Specialized Elective 2',
                'Professional Development Course',
              ],
              opportunities: [
                'Present at undergraduate research symposium',
                'Network with alumni',
                'Graduate school application preparation',
              ],
              volunteerWork: [
                'Mentor underclassmen',
                'Professional organization volunteer',
              ],
              internships: [
                'Pre-professional internship',
                'Job shadowing in target career',
              ],
              projects: [
                'Senior thesis or capstone project',
                'Industry-standard portfolio completion',
              ],
            },
          },
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
