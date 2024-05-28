import { NextResponse } from 'next/server';

const TMDB_API_KEY = 'your_tmdb_api_key';

export async function GET(request: Request) {
  const countryParam = new URL(request.url).searchParams.get('nationality');

  const countryMapping: { [key: string]: string } = {
    Thailand: 'TH',
    Korean: 'KR',
    China: 'CN',
  };

  const countryCode = countryMapping[countryParam || ''];

  if (!countryCode) {
    return NextResponse.json({ error: 'Invalid country parameter' }, { status: 400 });
  }

  const response = await fetch(
    `https://api.themoviedb.org/3/trending/tv/week?api_key=${TMDB_API_KEY}&with_original_language=${countryCode}`
  );

  if (!response.ok) {
    return NextResponse.json({ error: 'Failed to fetch data from TMDB API' }, { status: 500 });
  }

  const data = await response.json();
  const trendingLists = data.results.map((item: any) => ({
    title: item.name,
    image: item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : null,
    nationality: countryParam,
  }));

  return NextResponse.json({ trendingLists });
}
