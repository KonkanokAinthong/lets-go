import { NextRequest } from 'next/server';
import celebritiesData from '../../../celebs.json';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');

  try {
    const celebrity = celebritiesData.find((item) => item.id === parseInt(id, 10));

    if (!celebrity) {
      return new Response(JSON.stringify({ error: 'Celebrity not found' }), {
        status: 404,
      });
    }

    const formattedResult = {
      id: celebrity.id,
      name: celebrity.name,
      placeVisited: celebrity.placeVisited,
      nationality: celebrity.nationality,
      profile_path: celebrity.image || null,
    };

    return new Response(JSON.stringify(formattedResult), {
      headers: {
        'Content-Type': 'application/json',
      },
      status: 200,
    });
  } catch (error) {
    console.error('Error retrieving celebrity:', error);
    return new Response(JSON.stringify({ error: 'Failed to retrieve celebrity' }), {
      status: 500,
    });
  }
}
