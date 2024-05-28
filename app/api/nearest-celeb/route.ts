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
    const celebPlaces = celeb.geolocation.map((place) => ({
      latitude: place.latitude || 0,
      longitude: place.longitude || 0,
    }));

    const minDistance = Math.min(
      ...celebPlaces.map((place) => getDistance(currentLocation, place))
    );

    return { celeb, distance: minDistance };
  });

  // Find the celebrity with the minimum distance
  const nearestCeleb = celebDistances.reduce((nearest, current) =>
    current.distance < nearest.distance ? current : nearest
  );

  return NextResponse.json({ celeb: nearestCeleb.celeb });
}
