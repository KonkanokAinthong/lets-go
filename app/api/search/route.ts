import { NextRequest } from 'next/server';
import celebritiesData from '../../../celebs.json';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const search = searchParams.get('search');

  try {
    const filteredResults = celebritiesData.filter((item) =>
      item.name.toLowerCase().includes(search.toLowerCase())
    );

    const formattedResults = filteredResults.map((result) => ({
      id: result.id,
      value: result.id,
      label: result.name,
      profile_path: result.image || null,
    }));

    return new Response(JSON.stringify(formattedResults), {
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
