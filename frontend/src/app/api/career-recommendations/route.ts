import { NextRequest, NextResponse } from 'next/server';
import { spawn } from 'child_process';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { major, cip_code, interests, skills, university } = body;

    // Try to call Python backend for real recommendations
    try {
      const pythonScript = path.join(
        process.cwd(),
        '..',
        'backend',
        'src',
        'api_runner.py'
      );
      const pythonPath = path.join(
        process.cwd(),
        '..',
        'backend',
        '.venv',
        'bin',
        'python'
      );

      console.log('Python script path:', pythonScript);
      console.log('Python executable path:', pythonPath);
      console.log(
        'Working directory:',
        path.join(process.cwd(), '..', 'backend')
      );

      const pythonProcess = spawn(pythonPath, [pythonScript], {
        cwd: path.join(process.cwd(), '..', 'backend'),
        env: {
          ...process.env,
          PYTHONPATH: path.join(process.cwd(), '..', 'backend', 'src'),
        },
      });

      // Send input to Python process
      const input = JSON.stringify({
        major: major || 'Computer Science',
        cip_code: cip_code || '',
        interests: interests || ['technology', 'problem-solving'],
        skills: skills || ['programming', 'analytics'],
        university: university || 'General',
        top_n: 3,
      });

      console.log('Sending to Python backend:', input);

      let output = '';
      let errorOutput = '';

      pythonProcess.stdout.on('data', data => {
        output += data.toString();
      });

      pythonProcess.stderr.on('data', data => {
        errorOutput += data.toString();
        console.log('Python stderr:', data.toString()); // Log stderr in real-time
      });

      pythonProcess.stdin.write(input);
      pythonProcess.stdin.end();

      // Wait for Python process to complete
      await new Promise((resolve, reject) => {
        pythonProcess.on('close', code => {
          console.log('Python process closed with code:', code);
          console.log('Python stdout length:', output.length);
          console.log('Python stderr length:', errorOutput.length);

          if (code === 0) {
            resolve(output);
          } else {
            console.error('Python process failed with code:', code);
            console.error('Python error output:', errorOutput);
            console.error('Python stdout:', output);
            reject(
              new Error(
                `Python process exited with code ${code}: ${errorOutput}`
              )
            );
          }
        });
      });

      // Parse Python output and return recommendations
      if (output.trim()) {
        try {
          const pythonRecommendations = JSON.parse(output);
          return NextResponse.json(pythonRecommendations);
        } catch (parseError) {
          console.error('Failed to parse Python output:', parseError);
          // Return error response if parsing fails
          return NextResponse.json(
            {
              error: 'Failed to parse Python backend response',
              details: 'Invalid JSON format received from backend',
              fallback: false,
            },
            { status: 500 }
          );
        }
      }

      // If no output or empty output, return error
      return NextResponse.json(
        {
          error: 'No response from Python backend',
          details: 'Backend returned empty response',
          fallback: false,
        },
        { status: 500 }
      );
    } catch (pythonError) {
      console.error('Python backend error:', pythonError);
      // Return error response instead of fallback data
      return NextResponse.json(
        {
          error: 'Failed to generate career recommendations',
          details:
            pythonError instanceof Error
              ? pythonError.message
              : 'Unknown error',
          fallback: false,
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error in career recommendations:', error);
    return NextResponse.json(
      { error: 'Failed to generate career recommendations' },
      { status: 500 }
    );
  }
}
