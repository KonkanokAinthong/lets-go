import { NextResponse } from 'next/server';
import axios from 'axios';

const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const place = searchParams.get('place');

  try {
    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${encodeURIComponent(
        place as string
      )}&inputtype=textquery&fields=place_id&key=${API_KEY}`
    );

    const placeId = response.data.candidates[0]?.place_id;

    console.log(response.data);

    if (placeId) {
      const detailsResponse = await axios.get(
        `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=name,formatted_address,geometry,opening_hours,rating,user_ratings_total,photos,editorial_summary,types&key=${API_KEY}`
      );

      console.log(detailsResponse.data);

      const placeDetails = detailsResponse.data.result;

      if (placeDetails && placeDetails.photos) {
        const photoResponse = await axios.get(
          `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${placeDetails.photos[0].photo_reference}&key=${API_KEY}`
        );
        placeDetails.photo = photoResponse.request.responseURL;
      }

      return NextResponse.json(placeDetails);
    }
    return NextResponse.json({ error: 'Place not found' }, { status: 404 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'An error occurred' }, { status: 500 });
  }
}
