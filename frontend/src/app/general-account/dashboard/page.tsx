'use client';

import { useEffect, useState } from 'react';

interface User {
  name: string;
  email: string;
}

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  if (!user) return <p>Loading...</p>;

  return (
    <div className="min-h-screen pt-40 flex flex-col items-center justify-center bg-slate-50 p-6">
      <h1 className="text-3xl font-bold mb-4">Welcome, {user.name}!</h1>
      <p className="text-slate-600 mb-6">{user.email}</p>
      <p className="text-center">Here you can explore the website, check your progress, and saved paths.</p>
    </div>
  );
}
