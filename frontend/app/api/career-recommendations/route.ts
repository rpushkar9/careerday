import { NextRequest, NextResponse } from 'next/server';
import { spawn } from 'child_process';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { major, interests, skills, university } = body;

    // Call Python backend for real recommendations
    try {
      const pythonScript = path.join(process.cwd(), 'backend', 'src', 'api_wrapper.py');
      const pythonProcess = spawn('python3', [pythonScript], {
        cwd: path.join(process.cwd(), 'backend'),
        env: { ...process.env, PYTHONPATH: path.join(process.cwd(), 'backend', 'src') }
      });

      // Send input to Python process
      const input = JSON.stringify({
        major: major || 'Computer Science',
        interests: interests || ['technology', 'problem-solving'],
        skills: skills || ['programming', 'analytics'],
        university: university || 'General'
      });

      let output = '';
      let errorOutput = '';

      pythonProcess.stdout.on('data', (data) => {
        output += data.toString();
      });

      pythonProcess.stderr.on('data', (data) => {
        errorOutput += data.toString();
      });

      pythonProcess.stdin.write(input);
      pythonProcess.stdin.end();

      // Wait for Python process to complete
      await new Promise((resolve, reject) => {
        pythonProcess.on('close', (code) => {
          if (code === 0) {
            resolve(output);
          } else {
            reject(new Error(`Python process exited with code ${code}: ${errorOutput}`));
          }
        });
      });

      // Parse Python output and return recommendations
      // For now, return the mock data structure that matches frontend expectations
      // TODO: Parse actual Python output when real recommendations are implemented
      
      const recommendations = [
        {
          title: 'Software Engineer',
          description: 'Develops and maintains software applications using programming languages.',
          salary: '$105,000',
          growth: '25%',
          matchScore: 92,
        },
        {
          title: 'Data Scientist',
          description: 'Analyzes large data sets to uncover insights and support decision-making.',
          salary: '$120,000',
          growth: '36%',
          matchScore: 87,
        },
        {
          title: 'Product Manager',
          description: 'Leads product development and strategy for software products.',
          salary: '$115,000',
          growth: '28%',
          matchScore: 85,
        },
      ];

      return NextResponse.json(recommendations);

    } catch (pythonError) {
      console.error('Python backend error:', pythonError);
      
      // Fallback to mock data if Python backend fails
      const fallbackRecommendations = [
        {
          title: 'Software Engineer',
          description: 'Develops and maintains software applications using programming languages.',
          salary: '$105,000',
          growth: '25%',
          matchScore: 92,
        },
        {
          title: 'Data Scientist',
          description: 'Analyzes large data sets to uncover insights and support decision-making.',
          salary: '$120,000',
          growth: '36%',
          matchScore: 87,
        },
        {
          title: 'Product Manager',
          description: 'Leads product development and strategy for software products.',
          salary: '$115,000',
          growth: '28%',
          matchScore: 85,
        },
      ];

      return NextResponse.json(fallbackRecommendations);
    }

  } catch (error) {
    console.error('Error in career recommendations:', error);
    return NextResponse.json(
      { error: 'Failed to generate career recommendations' },
      { status: 500 }
    );
  }
}
