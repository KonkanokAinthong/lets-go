import { useQuery } from 'react-query';

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

const fetchAttractionDetails = async (placeId: string): Promise<AttractionDetails> => {
  const response = await fetch(`/api/attraction/${placeId}`);

  if (!response.ok) {
    throw new Error('Failed to fetch attraction details');
  }

  const data = await response.json();
  return data as AttractionDetails;
};

export const useAttractionDetails = (placeId: string) =>
  useQuery<AttractionDetails, Error>(
    ['attractionDetails', placeId],
    () => fetchAttractionDetails(placeId),
    {
      enabled: !!placeId,
    }
  );
