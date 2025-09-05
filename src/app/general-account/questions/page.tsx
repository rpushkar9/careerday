'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useRouter } from 'next/navigation';

export default function CareerQuizPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    school: '',
    major: '',
    gender: '',
    firstGen: '',
    careerInterest: '',
  });

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Quiz Answers:', form);
    // 👉 Route to results or next quiz step
    router.push('/explore-careers'); 
  };

  return (
    <motion.div
      className="flex justify-center items-center min-h-screen bg-gradient-to-b from-white to-slate-50 p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <Card className="w-full max-w-lg shadow-xl rounded-2xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center text-[#6d6bd3]">
            Tell Us About Yourself
          </CardTitle>
          <p className="text-center text-slate-600 mt-2">
            Answer a few quick questions so we can recommend the best career paths for you.
          </p>
        </CardHeader>

        <CardContent>
          <form className="space-y-5" onSubmit={handleSubmit}>
            {/* School */}
            <div>
              <Label htmlFor="school">What school do you go to?</Label>
              <Input
                id="school"
                placeholder="Enter your school"
                value={form.school}
                onChange={(e) => handleChange('school', e.target.value)}
              />
            </div>

            {/* Major */}
            <div>
              <Label htmlFor="major">Your Major</Label>
              <Input
                id="major"
                placeholder="Enter your major"
                value={form.major}
                onChange={(e) => handleChange('major', e.target.value)}
              />
            </div>

            {/* Gender */}
            <div>
              <Label>Gender (Optional)</Label>
              <Select onValueChange={(v) => handleChange('gender', v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="nonbinary">Non-binary</SelectItem>
                  <SelectItem value="preferNot">Prefer not to say</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* First-Gen */}
            <div>
              <Label>Are you a first-generation college student?</Label>
              <Select onValueChange={(v) => handleChange('firstGen', v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select option" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="yes">Yes</SelectItem>
                  <SelectItem value="no">No</SelectItem>
                  <SelectItem value="unsure">Not sure</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Career Interest */}
            <div>
              <Label>Your Career Interest</Label>
              <Input
                id="careerInterest"
                placeholder="e.g. UX Design, Engineering, Healthcare"
                value={form.careerInterest}
                onChange={(e) => handleChange('careerInterest', e.target.value)}
              />
            </div>

            <Button
              type="submit"
              className="w-full mt-4 bg-[#6d6bd3] hover:bg-[#5a58b8] text-white rounded-xl py-6 text-lg font-semibold shadow-md"
            >
              See My Career Matches
            </Button>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
}
