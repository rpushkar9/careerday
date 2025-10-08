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
    cipCode: '',
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
    console.log('Profile updated:', { ...form, [field]: value });
  };

  const handleMajorChange = (value: string) => {
    // Value format: "Major Name|CIP_CODE"
    const [majorName, cipCode] = value.split('|');
    setForm(prev => ({ 
      ...prev, 
      major: majorName,
      cipCode: cipCode 
    }));
    console.log('Major selected:', majorName, 'CIP:', cipCode);
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

      // Parse skills from textarea to array
      const skillsArray = form.skills
        .split(',')
        .map(s => s.trim())
        .filter(s => s);

      // Prepare data for your FastAPI backend
      const profileData = {
        email: user.email || user.id + '@cuny.edu',
        school: form.school,
        major: form.major,
        cip_code: form.cipCode,
        year: form.year,
        gender: form.gender || null,
        first_generation_student: form.firstGen === 'yes' ? true : form.firstGen === 'no' ? false : null,
        passions: form.interests,
        skills: skillsArray,
        career_goals: form.careerGoals,
      };

      console.log('Sending to backend:', profileData);

      // Call your FastAPI backend
      const res = await fetch('http://localhost:5001/api/student-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profileData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.detail || 'Failed to get career recommendations');
      }

      console.log('Career recommendations:', data);

      // Store recommendations in localStorage
      localStorage.setItem('careerRecommendations', JSON.stringify(data.top_3_careers));
      
      // Update user profile in localStorage
      const updatedUser = {
        ...user,
        profile: profileData,
      };
      localStorage.setItem('user', JSON.stringify(updatedUser));

      // Redirect to career matches
      router.push('/career-matches');
      
    } catch (err: any) {
      console.error('Error:', err);
      alert(err.message || 'Failed to get career recommendations');
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

            {/* Major with CIP Code */}
            <div>
              <Label>Major/Field of Study</Label>
              <Select onValueChange={handleMajorChange} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select your major" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Computer Science|11.0701">Computer Science</SelectItem>
                  <SelectItem value="Business Administration|52.0201">Business Administration</SelectItem>
                  <SelectItem value="Nursing|51.3801">Nursing</SelectItem>
                  <SelectItem value="Psychology|42.0101">Psychology</SelectItem>
                  <SelectItem value="Accounting|52.0301">Accounting</SelectItem>
                  <SelectItem value="Biology|26.0101">Biology</SelectItem>
                  <SelectItem value="Criminal Justice|43.0104">Criminal Justice</SelectItem>
                  <SelectItem value="Education|13.0101">Education</SelectItem>
                  <SelectItem value="English|23.0101">English</SelectItem>
                  <SelectItem value="Finance|52.0801">Finance</SelectItem>
                  <SelectItem value="Marketing|52.1401">Marketing</SelectItem>
                  <SelectItem value="Mathematics|27.0101">Mathematics</SelectItem>
                  <SelectItem value="Engineering|14.0101">Engineering</SelectItem>
                  <SelectItem value="Social Work|44.0701">Social Work</SelectItem>
                  <SelectItem value="Communication|09.0101">Communication</SelectItem>
                  <SelectItem value="Art/Design|50.0401">Art/Design</SelectItem>
                  <SelectItem value="Political Science|45.1001">Political Science</SelectItem>
                  <SelectItem value="Economics|45.0601">Economics</SelectItem>
                </SelectContent>
              </Select>
              {form.cipCode && (
                <p className="text-xs text-gray-500 mt-1">CIP Code: {form.cipCode}</p>
              )}
            </div>

            {/* Year */}
            <div>
              <Label>Year</Label>
              <Select onValueChange={v => handleChange('year', v)} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select your year" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Freshman">Freshman</SelectItem>
                  <SelectItem value="Sophomore">Sophomore</SelectItem>
                  <SelectItem value="Junior">Junior</SelectItem>
                  <SelectItem value="Senior">Senior</SelectItem>
                  <SelectItem value="Graduate Student">Graduate Student</SelectItem>
                  <SelectItem value="Recent Graduate">Recent Graduate</SelectItem>
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
                  <SelectItem value="Female">Female</SelectItem>
                  <SelectItem value="Male">Male</SelectItem>
                  <SelectItem value="Non-binary">Non-binary</SelectItem>
                  <SelectItem value="Prefer not to say">Prefer not to say</SelectItem>
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
              <Label htmlFor="skills">What are your top skills? (comma separated)</Label>
              <Textarea
                id="skills"
                placeholder="e.g., Python, Communication, Leadership, Data Analysis, Problem Solving"
                value={form.skills}
                onChange={e => handleChange('skills', e.target.value)}
                required
                rows={3}
              />
              <p className="text-xs text-gray-500 mt-1">Separate each skill with a comma</p>
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
              {loading ? 'Getting Your Career Matches...' : 'Find My Career Matches 🎯'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
}