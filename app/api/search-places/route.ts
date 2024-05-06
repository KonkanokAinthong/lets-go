/* eslint-disable @typescript-eslint/no-unused-vars */
import axios from 'axios';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const query = new URL(request.url).searchParams.get('query');

  try {
    const response = await axios.get(
      `https://api.themoviedb.org/3/search/person?query=${query}&include_adult=true&language=en-US&page=1`,
      {
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_TMDB_API_TOKEN}`,
        },
      }
    );
    const { data } = response;

    return NextResponse.json({ data });
  } catch (error) {
    console.error('Error searching celebrities:', error);
    return NextResponse.json({ error: 'Failed to search celebrities' }, { status: 500 });
  }
}
