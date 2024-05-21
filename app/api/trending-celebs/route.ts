import { NextRequest } from 'next/server';
import celebritiesData from '../../../celebs.json';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const nationality = searchParams.get('nationality');

  try {
    let filteredCelebrities = celebritiesData;

    if (nationality) {
      filteredCelebrities = celebritiesData.filter(
        (item) => item.nationality?.toLowerCase() === nationality.toLowerCase()
      );
    }

    return new Response(JSON.stringify(filteredCelebrities), {
      headers: {
        'Content-Type': 'application/json',
      },
      status: 200,
    });
  } catch (error) {
    console.error('Error searching celebrities:', error);
    return new Response(JSON.stringify({ error: 'Failed to search celebrities' }), {
      status: 500,
    });
  }
}
