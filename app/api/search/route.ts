import axios from 'axios';
import { NextRequest } from 'next/server';

const TMDB_API_KEY = process.env.NEXT_PUBLIC_TMDB_API_TOKEN;

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const search = searchParams.get('search');

  try {
    const response = await axios.get(
      `https://api.themoviedb.org/3/search/person?query=${search}&include_adult=false&language=en-US&page=1`,
      {
        headers: {
          Authorization: `Bearer ${TMDB_API_KEY}`,
          Accept: 'application/json',
        },
      }
    );

    return new Response(
      JSON.stringify(
        response.data.results.map((result) => ({
          id: result.id,
          value: result.id,
          label: result.name,
          profile_path: result?.profile_path
            ? `https://image.tmdb.org/t/p/w500${result.profile_path}`
            : null,
        }))
      ),
      {
        headers: {
          'Content-Type': 'application/json',
        },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Error fetching celebrities:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch celebrities' }), { status: 500 });
  }
}
