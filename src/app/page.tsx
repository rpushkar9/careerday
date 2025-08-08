'use client';
import { useEffect } from 'react'; // Importing useEffect from React
import { StudentForm } from '@/components/student-form';
import Navbar from '@/components/navbar';

const Page = () => {
  useEffect(() => {
    document.title = 'New App Name'; // Change the title dynamically
  }, []); // Empty dependency array ensures it runs only once when the component is mounted

  return (
    <>
      <Navbar />
      {/* Uncomment the following section if you want to display the form */}
      {/* <main className="min-h-screen p-4 md:p-24 max-w-5xl mx-auto">
        <div className="space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">
              Academic Roadmap Generator
            </h1>
            <p className="text-muted-foreground">
              Enter your information to get a personalized academic roadmap
            </p>
          </div>
          <StudentForm />
        </div>
      </main> */}
    </>
  );
};

export default Page;
