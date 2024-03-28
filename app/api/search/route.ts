import { NextResponse } from 'next/server';

const celebrities = [
  {
    name: 'Kim Seon-ho',
    visitedPlaces: ['Paris', 'London', 'New York'],
  },
];

export async function GET(req) {
  const query = new URL(req.url).searchParams.get('query');

  if (typeof query !== 'string') {
    return NextResponse.json({ error: 'Invalid query parameter' });
  }

  const searchQuery = query.toLowerCase();

  const filteredCelebrities = celebrities.filter((celebrity) => {
    const name = celebrity.name.toLowerCase();
    const visitedPlaces = celebrity.visitedPlaces.map((place) => place.toLowerCase());

    return name.includes(searchQuery) || visitedPlaces.some((place) => place.includes(searchQuery));
  });

  return NextResponse.json({ celebrities: filteredCelebrities });
}
