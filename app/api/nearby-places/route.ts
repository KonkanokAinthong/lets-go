import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;

  if (!apiKey) {
    return NextResponse.json({ error: 'API key not provided' }, { status: 400 });
  }

  const { searchParams } = new URL(request.url);

  const latitude = searchParams.get('latitude');
  const longitude = searchParams.get('longitude');
  const radius = searchParams.get('radius');
  const searchText = searchParams.get('query');

  if (!searchText) {
    return NextResponse.json({ error: 'Search query not provided' }, { status: 400 });
  }

  let url: string;

  if (latitude && longitude && radius) {
    url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=${radius}&key=${apiKey}`;
  } else {
    url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(
      searchText
    )}&key=${apiKey}`;
  }

  try {
    const response = await fetch(url);

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json({ error: errorData.error_message }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json({ data });
  } catch (error) {
    console.error('Error fetching data from Google Maps API:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
