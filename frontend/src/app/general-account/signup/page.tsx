'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function SignupPage() {
  const router = useRouter();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const nameInput = (document.getElementById('name') as HTMLInputElement)?.value;
    const emailInput = (document.getElementById('email') as HTMLInputElement)?.value;
    const passwordInput = (document.getElementById('password') as HTMLInputElement)?.value;

    // Client-side validation
    if (passwordInput.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    const url = 'http://localhost:5001/api/auth/signup';

    setLoading(true);

    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: nameInput, email: emailInput, password: passwordInput }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message);

      localStorage.setItem('user', JSON.stringify(data.user));

      router.push('/profile-setup');
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center px-6 py-16 bg-gradient-to-b from-white to-slate-50">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        <h1 className="text-3xl font-extrabold text-center mb-6">Create Your Account</h1>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="name">Full Name</Label>
            <Input id="name" type="text" placeholder="Enter your name" required />
          </div>

          <div>
            <Label htmlFor="email">Email Address</Label>
            <Input id="email" type="email" placeholder="Enter your email" required />
          </div>

          <div>
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" placeholder="Enter your password" required />
            <p className="text-xs text-gray-500 mt-1">Must be at least 6 characters</p>
          </div>

          <Button 
            type="submit" 
            disabled={loading}
            className="w-full bg-[#6d6bd3] text-white py-3 rounded-xl disabled:opacity-50"
          >
            {loading ? 'Creating Account...' : 'Sign Up'}
          </Button>
        </form>
      </div>
    </main>
  );
}