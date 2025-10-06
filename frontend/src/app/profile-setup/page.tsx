'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useRouter } from 'next/navigation';

export default function ProfileSetupPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    school: '',
    major: '',
    year: '',
    gender: '',
    firstGen: '',
    interests: '',
    skills: '',
    careerGoals: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Get user from localStorage
      const userStr = localStorage.getItem('user');
      if (!userStr) {
        alert('Please log in first');
        router.push('/login');
        return;
      }

      const user = JSON.parse(userStr);

      // Send profile data to backend
      const res = await fetch('http://localhost:5001/api/users/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          ...form,
        }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message);

      console.log('Profile updated:', data);
      
      // Update user in localStorage
      localStorage.setItem('user', JSON.stringify(data.user));

      // Redirect to career matches
      router.push('/career-matches');
    } catch (err: any) {
      alert(err.message || 'Failed to save profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className="flex justify-center items-center min-h-screen bg-gradient-to-b from-white to-slate-50 p-6 py-16"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <Card className="w-full max-w-2xl shadow-xl rounded-2xl">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center text-[#6d6bd3]">
            Complete Your Profile
          </CardTitle>
          <p className="text-center text-slate-600 mt-2">
            Tell us about yourself so we can match you with the best career opportunities.
          </p>
        </CardHeader>

        <CardContent>
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* School (CUNY Dropdown) */}
            <div>
              <Label>School (CUNY)</Label>
              <Select onValueChange={v => handleChange('school', v)} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select your CUNY school" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Baruch College">Baruch College</SelectItem>
                  <SelectItem value="Brooklyn College">Brooklyn College</SelectItem>
                  <SelectItem value="City College of New York">City College of New York</SelectItem>
                  <SelectItem value="College of Staten Island">College of Staten Island</SelectItem>
                  <SelectItem value="Hunter College">Hunter College</SelectItem>
                  <SelectItem value="John Jay College">John Jay College of Criminal Justice</SelectItem>
                  <SelectItem value="Lehman College">Lehman College</SelectItem>
                  <SelectItem value="Medgar Evers College">Medgar Evers College</SelectItem>
                  <SelectItem value="Queens College">Queens College</SelectItem>
                  <SelectItem value="York College">York College</SelectItem>
                  <SelectItem value="New York City College of Technology">New York City College of Technology</SelectItem>
                  <SelectItem value="CUNY School of Professional Studies">CUNY School of Professional Studies</SelectItem>
                  <SelectItem value="CUNY Graduate Center">CUNY Graduate Center</SelectItem>
                  <SelectItem value="CUNY School of Law">CUNY School of Law</SelectItem>
                  <SelectItem value="Guttman Community College">Guttman Community College</SelectItem>
                  <SelectItem value="LaGuardia Community College">LaGuardia Community College</SelectItem>
                  <SelectItem value="Queensborough Community College">Queensborough Community College</SelectItem>
                  <SelectItem value="Bronx Community College">Bronx Community College</SelectItem>
                  <SelectItem value="Hostos Community College">Hostos Community College</SelectItem>
                  <SelectItem value="Kingsborough Community College">Kingsborough Community College</SelectItem>
                  <SelectItem value="Borough of Manhattan Community College">Borough of Manhattan Community College</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Major */}
            <div>
              <Label htmlFor="major">Major/Field of Study</Label>
              <Input
                id="major"
                placeholder="e.g., Computer Science"
                value={form.major}
                onChange={e => handleChange('major', e.target.value)}
                required
              />
            </div>

            {/* Year */}
            <div>
              <Label>Year</Label>
              <Select onValueChange={v => handleChange('year', v)} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select your year" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="freshman">Freshman</SelectItem>
                  <SelectItem value="sophomore">Sophomore</SelectItem>
                  <SelectItem value="junior">Junior</SelectItem>
                  <SelectItem value="senior">Senior</SelectItem>
                  <SelectItem value="graduate">Graduate Student</SelectItem>
                  <SelectItem value="recent-grad">Recent Graduate</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Gender */}
            <div>
              <Label>Gender (Optional)</Label>
              <Select onValueChange={v => handleChange('gender', v)}>
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
              <Select onValueChange={v => handleChange('firstGen', v)} required>
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

            {/* Interests */}
            <div>
              <Label htmlFor="interests">What are you passionate about?</Label>
              <Textarea
                id="interests"
                placeholder="e.g., Technology, helping people, creative problem-solving, data analysis..."
                value={form.interests}
                onChange={e => handleChange('interests', e.target.value)}
                required
                rows={3}
              />
            </div>

            {/* Skills */}
            <div>
              <Label htmlFor="skills">What are your top skills?</Label>
              <Textarea
                id="skills"
                placeholder="e.g., Coding, communication, design, leadership, research..."
                value={form.skills}
                onChange={e => handleChange('skills', e.target.value)}
                required
                rows={3}
              />
            </div>

            {/* Career Goals */}
            <div>
              <Label htmlFor="careerGoals">What are your career goals?</Label>
              <Textarea
                id="careerGoals"
                placeholder="e.g., I want to work in tech and make a positive impact on society..."
                value={form.careerGoals}
                onChange={e => handleChange('careerGoals', e.target.value)}
                required
                rows={4}
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full mt-6 bg-[#6d6bd3] hover:bg-[#5a58b8] text-white rounded-xl py-6 text-lg font-semibold shadow-md disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Find My Career Matches'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
}
