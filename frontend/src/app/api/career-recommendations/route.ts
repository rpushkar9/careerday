import { NextRequest, NextResponse } from 'next/server';

// Railway backend URL - you'll need to update this with your actual Railway URL
const RAILWAY_BACKEND_URL =
  process.env.RAILWAY_BACKEND_URL || 'http://localhost:8000';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { major, cip_code, interests, skills, university, top_n = 3 } = body;

    console.log('RAILWAY_BACKEND_URL', RAILWAY_BACKEND_URL);

    // Call Railway backend
    const response = await fetch(
      `${RAILWAY_BACKEND_URL}/api/career-recommendations`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          major: major || 'Computer Science',
          cip_code: cip_code || '',
          interests: interests || ['technology', 'problem-solving'],
          skills: skills || ['programming', 'analytics'],
          university: university || 'General',
          top_n: top_n,
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Railway backend error:', errorData);
      return NextResponse.json(
        {
          error: 'Failed to generate career recommendations',
          details: errorData.detail || 'Backend service error',
          fallback: false,
        },
        { status: response.status }
      );
    }

    const recommendations = await response.json();
    return NextResponse.json(recommendations);
  } catch (error) {
    console.error('Error in career recommendations:', error);
    return NextResponse.json(
      {
        error: 'Failed to generate career recommendations',
        details: error instanceof Error ? error.message : 'Unknown error',
        fallback: false,
      },
      { status: 500 }
    );
  }
}
