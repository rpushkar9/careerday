import type { Metadata } from 'next';
import '../styles/globals.css';
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';

export const metadata: Metadata = {
  title: 'CareerDayy',
  description: 'Created with love',
  generator: 'dev',
  icons: {
    icon: '/careerday_logo.jpeg', // path inside public/
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-white text-slate-800 transition-all duration-300">
        <Navbar />

        {/* ✅ Added global top padding for all pages */}
        <main className="min-h-screen pt-24">{children}</main>

        <Footer />
      </body>
    </html>
  );
}
