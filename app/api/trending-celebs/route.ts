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

    // Sort the filtered celebrities by trending points in descending order
    filteredCelebrities.sort((a, b) => (b.trendingPoint || 0) - (a.trendingPoint || 0));

    console.log('Filtered celebrities:', filteredCelebrities);

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
