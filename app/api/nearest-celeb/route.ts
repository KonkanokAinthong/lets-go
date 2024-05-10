import { NextResponse } from 'next/server';
import { getDistance } from 'geolib';
import CELEB_LISTS from '../../../celebs.json';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const lat = searchParams.get('lat');
  const lng = searchParams.get('lng');

  if (!lat || !lng) {
    return NextResponse.json({ error: 'Missing latitude or longitude' }, { status: 400 });
  }

  const currentLocation = { latitude: parseFloat(lat), longitude: parseFloat(lng) };

  // Calculate the distance from the current location to each celebrity's visited places
  const celebDistances = CELEB_LISTS.map((celeb) => {
    const celebPlaces = celeb.placeVisited.map((place) => ({
      latitude: place.geometry?.location?.lat || 0,
      longitude: place.geometry?.location?.lng || 0,
    }));

    const minDistance = Math.min(
      ...celebPlaces.map((place) => getDistance(currentLocation, place))
    );

    return {
      celeb,
      distance: minDistance,
    };
  });

  // Sort the celebrities by distance in ascending order
  const sortedCelebs = celebDistances.sort((a, b) => a.distance - b.distance);

  return NextResponse.json({ celebs: sortedCelebs.map((item) => item.celeb) });
}
