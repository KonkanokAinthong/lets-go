import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const apiKey = process.env.TAT_API_KEY;
    const url = 'https://tatapi.tourismthailand.org/tatapi/v5/routes';
    const params = {};

    const queryString = new URLSearchParams(params).toString();
    const requestUrl = `${url}?${queryString}`;

    const response = await fetch(requestUrl, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
        'Accept-Language': 'th',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    const locations = data.result.map((item: any) => ({
      title: item.route_name,
      image: item.thumbnail_url,
      link: `/route/${item.route_id}`,
    }));

    return NextResponse.json({ locations });
  } catch (error) {
    console.error('Error fetching data from TAT API:', error);
    return NextResponse.json({ error: 'Failed to fetch data from TAT API' }, { status: 500 });
  }
}
