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

  const currentLocation = {
    latitude: parseFloat(lat),
    longitude: parseFloat(lng),
  };

  // Find the nearest celebrity based on their visited places
  const nearestCeleb = CELEB_LISTS.reduce(
    (nearest, celeb) => {
      const celebPlaces = celeb.placeVisited.map((place) => ({
        latitude: place.geometry?.location?.lat || 0,
        longitude: place.geometry?.location?.lng || 0,
      }));

      const minDistance = Math.min(
        ...celebPlaces.map((place) => getDistance(currentLocation, place))
      );

      if (minDistance < nearest.distance) {
        return {
          celeb,
          distance: minDistance,
        };
      }

      return nearest;
    },
    {
      celeb: null,
      distance: Infinity,
    }
  );

  if (nearestCeleb.celeb) {
    return NextResponse.json({ celeb: nearestCeleb.celeb });
  }

  return NextResponse.json({ error: 'No nearby celebrity found' }, { status: 404 });
}
