import { useQuery } from 'react-query';

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

const fetchPlaces = async (params: PlaceSearchParams): Promise<PlaceSearchInfo[]> => {
  const url = new URL('/api/places2', window.location.origin);

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined) {
      url.searchParams.append(key, value.toString());
    }
  });

  const response = await fetch(url.toString());

  if (!response.ok) {
    throw new Error('Failed to fetch places');
  }

  const data = await response.json();
  return data as PlaceSearchInfo[];
};

export const useSearchPlaces = (params: PlaceSearchParams) =>
  useQuery<PlaceSearchInfo[], Error>(['places', params], () => fetchPlaces(params));
