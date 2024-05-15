import { NextResponse } from 'next/server';

interface PlaceSearchParams {
  keyword: string;
  geolocation: string;
  categorycodes?: string;
  provincename?: string;
  searchradius?: number;
  numberofresult?: number;
  pagenumber?: number;
  destination?: string;
  filterByUpdateDate?: string;
}

interface PlaceSearchInfo {
  // Define the structure of the PlaceSearchInfo object based on the API response
  // Example:
  // id: string;
  // name: string;
  // address: string;
  // ...
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const keyword = searchParams.get('keyword');
  const geolocation = searchParams.get('geolocation');
  const categorycodes = searchParams.get('categorycodes');
  const provincename = searchParams.get('provincename');
  const searchradius = searchParams.get('searchradius');
  const numberofresult = searchParams.get('numberofresult');
  const pagenumber = searchParams.get('pagenumber');
  const destination = searchParams.get('destination');
  const filterByUpdateDate = searchParams.get('filterByUpdateDate');

  if (!keyword || !geolocation) {
    return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
  }

  const url = new URL('https://tatapi.tourismthailand.org/tatapi/v5/places/search');

  url.searchParams.append('keyword', keyword);
  url.searchParams.append('geolocation', geolocation);

  if (categorycodes) {
    url.searchParams.append('categorycodes', categorycodes);
  }
  if (provincename) {
    url.searchParams.append('provincename', provincename);
  }
  if (searchradius) {
    url.searchParams.append('searchradius', searchradius);
  }
  if (numberofresult) {
    url.searchParams.append('numberofresult', numberofresult);
  }
  if (pagenumber) {
    url.searchParams.append('pagenumber', pagenumber);
  }
  if (destination) {
    url.searchParams.append('destination', destination);
  }
  if (filterByUpdateDate) {
    url.searchParams.append('filterByUpdateDate', filterByUpdateDate);
  }

  const headers = new Headers();
  headers.append('Content-Type', 'application/json');
  headers.append('Authorization', `Bearer ${process.env.TAT_API_KEY}`);
  headers.append('Accept-Language', 'th');

  try {
    const response = await fetch(url.toString(), {
      method: 'GET',
      headers,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data.result as PlaceSearchInfo[]);
  } catch (error) {
    console.error('Error searching places:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
