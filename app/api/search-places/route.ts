/* eslint-disable @typescript-eslint/no-unused-vars */
import axios from 'axios';
import { NextResponse } from 'next/server';

const TMDB_API_KEY =
  'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxNDg5YjUyNDg3MTdmZjY2NmY3NzhkNzE3NmVmYjdjZiIsInN1YiI6IjY1NTk5ZTI5ZWE4NGM3MTA5NmRmMjk2ZCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.e0lqhUBzvqt4L-OleXqsj8bx_p6yQK46wPabFdYFO1s';

export async function GET(request: Request) {
  const query = new URL(request.url).searchParams.get('query');

  try {
    const response = await axios.get(
      `https://api.themoviedb.org/3/search/person?query=${query}&include_adult=true&language=en-US&page=1`,
      {
        headers: {
          Authorization: `Bearer ${TMDB_API_KEY}`,
        },
      }
    );
    const { data } = response;
    console.log(data);
    return NextResponse.json({ data });
  } catch (error) {
    console.error('Error searching celebrities:', error);
    return NextResponse.json({ error: 'Failed to search celebrities' }, { status: 500 });
  }
}
