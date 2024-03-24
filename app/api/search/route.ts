import { NextResponse } from 'next/server';

const mockCelebrityData = [
  {
    id: 1,
    name: 'Kim Seon Ho',
    image: 'https://example.com/kim-seon-ho.jpg',
    visits: [
      { lat: 13.7563, lng: 100.5018, place: 'Bangkok' },
      { lat: 7.9519, lng: 98.3381, place: 'Phuket' },
    ],
  },
];

export async function GET(req) {
  const query = new URL(req.url).searchParams.get('query');

  if (typeof query !== 'string') {
    return NextResponse.json({ error: 'Invalid query' }, { status: 400 });
  }

  const searchResults = mockCelebrityData.filter((celebrity) =>
    celebrity.name.toLowerCase().includes(query.toLowerCase())
  );

  return NextResponse.json({ data: searchResults });
}
