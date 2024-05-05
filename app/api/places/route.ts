import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_API_KEY;

  if (!apiKey) {
    return NextResponse.json({ error: 'API key not provided' }, { status: 400 });
  }

  const { searchParams } = new URL(request.url);

  const latitude = searchParams.get('latitude');
  const longitude = searchParams.get('longitude');
  const searchText = searchParams.get('query');
  const type = searchParams.get('type');

  let url: string;

  if (type === 'nearby' && latitude && longitude) {
    url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=1500&key=${apiKey}`;
  } else if (searchText) {
    url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(
      searchText
    )}&key=${apiKey}`;
  } else {
    return NextResponse.json({ error: 'Invalid request parameters' }, { status: 400 });
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
