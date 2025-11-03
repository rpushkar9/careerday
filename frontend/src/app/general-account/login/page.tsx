// 'use client';

// import { useState } from 'react';
// import { motion } from 'framer-motion';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { useRouter } from 'next/navigation';

// export default function LoginPage() {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState('');
//   const [loading, setLoading] = useState(false);
//   const router = useRouter();

//   const handleLogin = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setError('');
//     setLoading(true);

//     try {
//       // Call your backend API
//       const response = await fetch('http://localhost:5000/api/auth/login', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ email, password }),
//       });

//       const data = await response.json();

//       if (!response.ok) {
//         // Handle error from backend
//         throw new Error(data.message || 'Login failed');
//       }

//       // Success! Store token and user info
//       localStorage.setItem('token', data.token);
//       localStorage.setItem('user', JSON.stringify(data.user));

//       // Redirect to dashboard
//       router.push('/general-account/dashboard');
//     } catch (err: any) {
//       setError(err.message || 'Invalid email or password');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <main className="min-h-screen pt-40 bg-gradient-to-b from-white to-slate-50 flex items-center justify-center px-6 py-16 md:px-12">
//       <motion.div
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.6 }}
//         className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8"
//       >
//         <motion.h1 className="text-3xl md:text-4xl font-extrabold text-center mb-6">
//           Welcome <span className="text-[#6d6bd3]">Back</span>
//         </motion.h1>
//         <p className="text-center text-slate-600 mb-8">
//           Log in to continue your career journey.
//         </p>

//         {/* Error Message */}
//         {error && (
//           <motion.div
//             initial={{ opacity: 0, y: -10 }}
//             animate={{ opacity: 1, y: 0 }}
//             className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6"
//           >
//             {error}
//           </motion.div>
//         )}

//         <form onSubmit={handleLogin} className="space-y-6">
//           <div>
//             <Label htmlFor="email">Email Address</Label>
//             <Input
//               id="email"
//               type="email"
//               placeholder="Enter your email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               className="rounded-xl mt-1"
//               required
//               disabled={loading}
//             />
//           </div>
//           <div>
//             <Label htmlFor="password">Password</Label>
//             <Input
//               id="password"
//               type="password"
//               placeholder="Enter your password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               className="rounded-xl mt-1"
//               required
//               disabled={loading}
//             />
//           </div>

//           <Button
//             type="submit"
//             className="w-full mt-2 bg-[#6d6bd3] hover:bg-[#5a58c2] text-white rounded-xl py-6 text-lg font-semibold shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
//             disabled={loading}
//           >
//             {loading ? 'Logging in...' : 'Log In'}
//           </Button>
//         </form>

//         <p className="text-center text-slate-600 mt-6">
//           Don't have an account?{' '}
//           <a
//             href="/general-account/signup"
//             className="text-[#6d6bd3] font-semibold hover:underline"
//           >
//             Sign Up
//           </a>
//         </p>

//         <div className="text-center mt-8">
//           <a
//             href="/explore-careers"
//             className="text-sm text-slate-500 hover:text-slate-700"
//           >
//             Continue without an account →
//           </a>
//         </div>
//       </motion.div>
//     </main>
//   );
// }
'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function LoginPage() {
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const emailInput = (document.getElementById('email') as HTMLInputElement)
      ?.value;
    const passwordInput = (
      document.getElementById('password') as HTMLInputElement
    )?.value;

    const url = 'http://localhost:5001/api/auth/login';

    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailInput, password: passwordInput }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message);

      localStorage.setItem('user', JSON.stringify(data.user));
      localStorage.setItem('token', data.token);

      router.push('/dashboard');
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center px-6 py-16 bg-gradient-to-b from-white to-slate-50">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        <h1 className="text-3xl font-extrabold text-center mb-6">
          Welcome Back
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              required
            />
          </div>

          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              required
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-[#6d6bd3] text-white py-3 rounded-xl"
          >
            Log In
          </Button>
        </form>
      </div>
    </main>
  );
}
