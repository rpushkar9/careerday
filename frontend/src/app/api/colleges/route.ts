import { NextResponse } from 'next/server';
import { fetchNYCMajors } from '@/lib/college';

export async function GET() {
  try {
    const data = await fetchNYCMajors();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching colleges and majors:', error);

    // If it's a fetch error, there might be HTML instead of JSON
    if (error instanceof Error && error.message.includes('Unexpected token')) {
      return NextResponse.json(
        {
          error:
            'API returned invalid response. Please check your API key and try again.',
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Failed to fetch data',
      },
      { status: 500 }
    );
  }
}
