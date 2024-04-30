import axios from 'axios';
import { NextRequest } from 'next/server';

const TMDB_API_KEY =
  'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxNDg5YjUyNDg3MTdmZjY2NmY3NzhkNzE3NmVmYjdjZiIsInN1YiI6IjY1NTk5ZTI5ZWE4NGM3MTA5NmRmMjk2ZCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.e0lqhUBzvqt4L-OleXqsj8bx_p6yQK46wPabFdYFO1s';

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

    console.log(response.data.results[0]);

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
