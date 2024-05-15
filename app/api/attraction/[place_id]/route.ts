import { NextResponse } from 'next/server';

interface AttractionDetails {
  // Define the structure of the AttractionDetails object based on the API response
  // Example:
  // id: string;
  // name: string;
  // description: string;
  // openingHours: string;
  // telephone: string;
  // email: string;
  // ...
}

export async function GET(request: Request, { params }: { params: { place_id: string } }) {
  const placeId = params.place_id;

  const url = `https://tatapi.tourismthailand.org/tatapi/v5/attraction/${placeId}`;

  const headers = new Headers();
  headers.append('Content-Type', 'application/json');
  headers.append('Authorization', `Bearer ${process.env.TAT_API_KEY}`);
  headers.append('Accept-Language', 'th');

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data as AttractionDetails);
  } catch (error) {
    console.error('Error fetching attraction details:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
