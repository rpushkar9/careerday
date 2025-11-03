
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
import { motion } from 'framer-motion';

export default function AccountSettingsPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [successMessage, setSuccessMessage] = useState('');

  const [accountForm, setAccountForm] = useState({
    name: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [profileForm, setProfileForm] = useState({
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

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      window.location.href = '/general-account/login';
      return;
    }

    const userData = JSON.parse(storedUser);
    setUser(userData);

    setAccountForm({
      name: userData.name || '',
      email: userData.email || '',
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });

    if (userData.profile) {
      setProfileForm({
        school: userData.profile.school || '',
        major: userData.profile.major || '',
        cipCode: userData.profile.cip_code || '',
        year: userData.profile.year || '',
        gender: userData.profile.gender || '',
        firstGen: userData.profile.first_generation_student === true ? 'yes' : userData.profile.first_generation_student === false ? 'no' : '',
        interests: userData.profile.passions || '',
        skills: Array.isArray(userData.profile.skills) ? userData.profile.skills.join(', ') : '',
        careerGoals: userData.profile.career_goals || '',
      });
    }
  }, []);

  const handleAccountUpdate = () => {
    setLoading(true);
    setSuccessMessage('');

    try {
      if (accountForm.newPassword) {
        if (accountForm.newPassword !== accountForm.confirmPassword) {
          alert('New passwords do not match');
          setLoading(false);
          return;
        }
        if (accountForm.newPassword.length < 6) {
          alert('Password must be at least 6 characters');
          setLoading(false);
          return;
        }
      }

      const updatedUser = {
        ...user,
        name: accountForm.name,
        email: accountForm.email,
      };
      
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      
      setSuccessMessage('Account information updated successfully!');
      
      setAccountForm(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      }));

    } catch (error) {
      console.error('Error updating account:', error);
      alert('Failed to update account information');
    } finally {
      setLoading(false);
    }
  };

  const handleProfileUpdate = () => {
    setLoading(true);
    setSuccessMessage('');

    try {
      const skillsArray = profileForm.skills
        .split(',')
        .map(s => s.trim())
        .filter(s => s);

      const updatedProfile = {
        school: profileForm.school,
        major: profileForm.major,
        cip_code: profileForm.cipCode,
        year: profileForm.year,
        gender: profileForm.gender || null,
        first_generation_student: profileForm.firstGen === 'yes' ? true : profileForm.firstGen === 'no' ? false : null,
        passions: profileForm.interests,
        skills: skillsArray,
        career_goals: profileForm.careerGoals,
      };

      const updatedUser = {
        ...user,
        profile: updatedProfile,
      };

      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      
      setSuccessMessage('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleMajorChange = (value: string) => {
    const [majorName, cipCode] = value.split('|');
    setProfileForm(prev => ({ 
      ...prev, 
      major: majorName,
      cipCode: cipCode 
    }));
  };

  const handleDeleteAccount = () => {
    if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      localStorage.removeItem('user');
      localStorage.removeItem('careerRecommendations');
      window.location.href = '/';
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-slate-50 pt-24 pb-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
      >
        <h1 className="text-4xl font-bold text-[#6d6bd3] mb-8">Account Settings</h1>

        {successMessage && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg mb-6"
          >
            ✓ {successMessage}
          </motion.div>
        )}

        <div className="flex space-x-4 mb-6 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('profile')}
            className={`pb-4 px-2 font-medium transition-colors ${
              activeTab === 'profile'
                ? 'text-[#6d6bd3] border-b-2 border-[#6d6bd3]'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            👤 Profile Information
          </button>
          <button
            onClick={() => setActiveTab('account')}
            className={`pb-4 px-2 font-medium transition-colors ${
              activeTab === 'account'
                ? 'text-[#6d6bd3] border-b-2 border-[#6d6bd3]'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            ⚙️ Account Details
          </button>
        </div>

        {activeTab === 'profile' && (
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl text-[#6d6bd3]">
                🎓 Academic & Career Profile
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <Label>School (CUNY)</Label>
                  <Select value={profileForm.school} onValueChange={v => setProfileForm(prev => ({ ...prev, school: v }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your CUNY school" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Baruch College">Baruch College</SelectItem>
                      <SelectItem value="Brooklyn College">Brooklyn College</SelectItem>
                      <SelectItem value="City College of New York">City College of New York</SelectItem>
                      <SelectItem value="Hunter College">Hunter College</SelectItem>
                      <SelectItem value="Queens College">Queens College</SelectItem>
                      <SelectItem value="York College">York College</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Major/Field of Study</Label>
                  <Select value={`${profileForm.major}|${profileForm.cipCode}`} onValueChange={handleMajorChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your major" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Computer Science|11.0701">Computer Science</SelectItem>
                      <SelectItem value="Business Administration|52.0201">Business Administration</SelectItem>
                      <SelectItem value="Nursing|51.3801">Nursing</SelectItem>
                      <SelectItem value="Psychology|42.0101">Psychology</SelectItem>
                      <SelectItem value="Accounting|52.0301">Accounting</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Year</Label>
                  <Select value={profileForm.year} onValueChange={v => setProfileForm(prev => ({ ...prev, year: v }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your year" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Freshman">Freshman</SelectItem>
                      <SelectItem value="Sophomore">Sophomore</SelectItem>
                      <SelectItem value="Junior">Junior</SelectItem>
                      <SelectItem value="Senior">Senior</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Gender (Optional)</Label>
                  <Select value={profileForm.gender} onValueChange={v => setProfileForm(prev => ({ ...prev, gender: v }))}>
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

                <div>
                  <Label>First-generation college student?</Label>
                  <Select value={profileForm.firstGen} onValueChange={v => setProfileForm(prev => ({ ...prev, firstGen: v }))}>
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

                <div>
                  <Label>Passions & Interests</Label>
                  <Textarea
                    value={profileForm.interests}
                    onChange={e => setProfileForm(prev => ({ ...prev, interests: e.target.value }))}
                    rows={3}
                    placeholder="What are you passionate about?"
                  />
                </div>

                <div>
                  <Label>Skills (comma separated)</Label>
                  <Textarea
                    value={profileForm.skills}
                    onChange={e => setProfileForm(prev => ({ ...prev, skills: e.target.value }))}
                    rows={3}
                    placeholder="e.g., Python, Leadership, Communication"
                  />
                </div>

                <div>
                  <Label>Career Goals</Label>
                  <Textarea
                    value={profileForm.careerGoals}
                    onChange={e => setProfileForm(prev => ({ ...prev, careerGoals: e.target.value }))}
                    rows={4}
                    placeholder="What are your career aspirations?"
                  />
                </div>

                <Button
                  onClick={handleProfileUpdate}
                  disabled={loading}
                  className="w-full bg-[#6d6bd3] hover:bg-[#5a58b8] text-white py-3 rounded-lg"
                >
                  {loading ? 'Updating...' : 'Update Profile'}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === 'account' && (
          <div className="space-y-6">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl text-[#6d6bd3]">
                  👤 Account Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <Label>Full Name</Label>
                    <Input
                      value={accountForm.name}
                      onChange={e => setAccountForm(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div>
                    <Label>Email Address</Label>
                    <Input
                      type="email"
                      value={accountForm.email}
                      onChange={e => setAccountForm(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="your.email@cuny.edu"
                    />
                  </div>

                  <div className="border-t pt-6 mt-6">
                    <h3 className="text-lg font-semibold mb-4 text-gray-700">Change Password</h3>
                    
                    <div className="space-y-4">
                      <div>
                        <Label>Current Password</Label>
                        <Input
                          type="password"
                          value={accountForm.currentPassword}
                          onChange={e => setAccountForm(prev => ({ ...prev, currentPassword: e.target.value }))}
                          placeholder="Enter current password"
                        />
                      </div>

                      <div>
                        <Label>New Password</Label>
                        <Input
                          type="password"
                          value={accountForm.newPassword}
                          onChange={e => setAccountForm(prev => ({ ...prev, newPassword: e.target.value }))}
                          placeholder="Enter new password (min 6 characters)"
                        />
                      </div>

                      <div>
                        <Label>Confirm New Password</Label>
                        <Input
                          type="password"
                          value={accountForm.confirmPassword}
                          onChange={e => setAccountForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                          placeholder="Confirm new password"
                        />
                      </div>
                    </div>
                  </div>

                  <Button
                    onClick={handleAccountUpdate}
                    disabled={loading}
                    className="w-full bg-[#6d6bd3] hover:bg-[#5a58b8] text-white py-3 rounded-lg"
                  >
                    {loading ? 'Updating...' : 'Update Account'}
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg border-red-200">
              <CardHeader>
                <CardTitle className="text-2xl text-red-600">
                  ⚠️ Danger Zone
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Once you delete your account, there is no going back. All your data, including saved career paths and progress, will be permanently deleted.
                </p>
                <Button
                  onClick={handleDeleteAccount}
                  className="bg-red-600 hover:bg-red-700 text-white"
                >
                  🗑️ Delete Account
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </motion.div>
    </div>
  );
}