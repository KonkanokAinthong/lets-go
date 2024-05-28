/* eslint-disable react/no-unescaped-entities */

'use client';

import {
  Avatar,
  Breadcrumbs,
  Button,
  Card,
  Center,
  Container,
  Divider,
  Grid,
  Image,
  Loader,
  Skeleton,
  Stack,
  Tabs,
  TabsList,
  TabsPanel,
  TabsTab,
  Text,
  Title,
} from '@mantine/core';

import { IconArrowLeft } from '@tabler/icons-react';
import axios from 'axios';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import ChatInterface from '@/components/ChatInterface';
import { Map } from 'react-map-gl';

const API_KEY = 'AIzaSyBKRFuroEmi6ocPRQzuBuX4ULAFiYTvTGo';

const getWikipediaBiography = async (name: string) => {
  try {
    let formattedName = name;

    // Check if the name needs to be replaced
    switch (name.toLowerCase()) {
      case 'li zi ting':
        formattedName = 'Mimi Lee';
        break;
      case 'yang yang':
        formattedName = 'Yang Yang (actor)';
        break;
      default:
        break;
    }

    const response = await fetch(
      `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(formattedName)}`
    );
    const data = await response.json();
    return data.extract;
  } catch (error) {
    console.error('Error fetching Wikipedia biography:', error);
    return null;
  }
};

const getCelebrityById = async (celebId: string) => {
  try {
    const response = await axios.get(`/api/celebrities?id=${celebId}`);
    return response.data;
  } catch (error) {
    console.error('Error retrieving celebrity:', error);
    throw error;
  }
};

const searchCelebrity = async (name: string) => {
  const data = await axios.get(`https://api.themoviedb.org/3/search/person?query=${name}`, {
    headers: {
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_TMDB_API_TOKEN}`,
    },
  });
  return data.data.results[0];
};

const getCelebrityInfo = async (person_id: string) => {
  const data = await axios.get(`https://api.themoviedb.org/3/person/${person_id}`, {
    headers: {
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_TMDB_API_TOKEN}`,
    },
  });

  return data.data;
};

const fetchNearbyPlaces = async (location) => {
  const { lat, lng } = location;

  const response = await axios.post(
    'https://places.googleapis.com/v1/places:searchNearby',
    {
      languageCode: 'th',
      regionCode: 'TH',
      includedTypes: ['restaurant'],
      rankPreference: 'DISTANCE',
      maxResultCount: 10,
      locationRestriction: {
        circle: {
          center: {
            latitude: lat,
            longitude: lng,
          },
          radius: 1000.0,
        },
      },
    },
    {
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': API_KEY,
        'X-Goog-FieldMask': '*',
      },
    }
  );

  return response.data.places;
};

const getPlaceDetails = async (places: string[]) => {
  try {
    const promises = places.map(async (place) => {
      const response = await axios.get(`/api/places2?place=${encodeURIComponent(place)}`);
      return response.data;
    });

    const results = await Promise.all(promises);
    const filteredResults = results.filter((result) => result !== undefined);

    return { places: filteredResults };
  } catch (error) {
    console.error(error);
    return { places: [] };
  }
};

export default function Page() {
  const navigate = useRouter();

  const { celebId } = useParams();

  const [currentLocation, setCurrentLocation] = useState({ lat: 0, lng: 0 });

  const { data: celebrity, isLoading: isCelebrityLoading } = useQuery(
    ['celebrity', celebId],
    () => getCelebrityById(celebId as string),
    {
      enabled: !!celebId,
    }
  );

  const { data: celebInfo } = useQuery(
    ['searchCelebrity', celebrity?.name],
    () => searchCelebrity(celebrity?.name),
    {
      enabled: !!celebrity?.name,
    }
  );

  const { data: info } = useQuery(['info', celebInfo?.id], () => getCelebrityInfo(celebInfo?.id), {
    enabled: !!celebInfo?.id,
  });

  const { data: places } = useQuery(
    ['places', celebrity?.placeVisited],
    () => getPlaceDetails(celebrity?.placeVisited),
    {
      initialData: { places: [] },
      enabled: !!celebrity?.placeVisited,
    }
  );

  console.log(places);

  // const { data: nearbyPlaces } = useQuery(
  //   ['nearbyPlaces', places?.places],
  //   () => fetchNearbyPlaces(places?.places[0].geometry.location),
  //   {
  //     enabled: !!places,
  //   }
  // );

  const [biography, setBiography] = useState('');
  const [isFetching, setIsFetching] = useState(false);

  useEffect(() => {
    const fetchBiography = async () => {
      if (!info?.biography && celebrity?.name) {
        setIsFetching(true);
        const wikipediaBiography = await getWikipediaBiography(celebrity.name);
        setBiography(wikipediaBiography || 'No biography available');
        setIsFetching(false);
      }
    };

    fetchBiography();
  }, [info?.biography, celebrity?.name]);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error('Error getting current location:', error);
        }
      );
    }
  }, []);

  const containerStyle = {
    width: '100%',
    height: '600px',
  };

  if (isCelebrityLoading) {
    return <div>Loading...</div>;
  }

  if (isCelebrityLoading) {
    return <Loader />;
  }

  return (
    <Container c="white">
      <Stack>
        <header>
          <Breadcrumbs>
            <Button
              variant="subtle"
              c="white"
              leftSection={<IconArrowLeft size={16} />}
              onClick={() => navigate.back()}
            >
              Back
            </Button>
          </Breadcrumbs>
        </header>
        <Center>
          <Avatar
            size={200}
            src={`https://image.tmdb.org/t/p/original/${info?.profile_path}`}
            alt="test"
          />
        </Center>
        <Title order={1} ta="center">
          {celebrity?.name}
        </Title>

        <Tabs defaultValue="info">
          <TabsList mb="xl" grow>
            <TabsTab value="info">ประวัติ</TabsTab>
            <TabsTab value="visited-places">การท่องเที่ยว</TabsTab>
            <TabsTab value="nearby">สถานที่ท่องเที่ยวใกล้เคียง</TabsTab>
            <TabsTab value="chatgpt-planner">Trip Planner</TabsTab>
          </TabsList>
          <TabsPanel value="info">
            <Stack>
              <div>
                {info?.biography ? (
                  <Text size="md">{info?.biography}</Text>
                ) : (
                  <Text size="md">{biography}</Text>
                )}
              </div>
              <div>
                <Stack>
                  <Title order={3}>Known For</Title>
                  <Grid>
                    {celebInfo?.known_for?.map((item) => (
                      <Grid.Col
                        span={{
                          xs: 12,
                          md: 4,
                        }}
                        key={item.id}
                      >
                        <Stack>
                          <Image
                            src={`https://image.tmdb.org/t/p/original/${item.poster_path}`}
                            alt={item.name ?? item.title}
                          />
                          <Text component={Link} href="" ta="center">
                            {item.name ?? item.title}
                          </Text>
                        </Stack>
                      </Grid.Col>
                    ))}
                  </Grid>
                </Stack>
              </div>
            </Stack>
          </TabsPanel>

          <TabsPanel value="visited-places">
            {celebrity?.placeVisited && celebrity.placeVisited.length > 0 ? (
              <Stack>
                <Title order={3}>สถานที่ท่องเที่ยวที่เคยไป</Title>
                <Grid>
                  {places.places.map((place, index) => (
                    <Grid.Col key={index} span={12}>
                      <Card shadow="sm" p="md">
                        <Stack mt="md">
                          <Image
                            src={`https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${place.photos[0].photo_reference}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`}
                            alt={place.name}
                          />
                          <Title order={4}>{place.name}</Title>
                          {place.editorial_summary && (
                            <div>
                              <Title order={5}>Biography:</Title>
                              <Text>{place.editorial_summary.overview}</Text>
                            </div>
                          )}
                          {place.types && (
                            <div>
                              <Title order={5}>Activities:</Title>
                              <ul>
                                {place.types.map((type, typeIndex) => (
                                  <li key={typeIndex}>{type}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </Stack>
                      </Card>
                    </Grid.Col>
                  ))}
                </Grid>
              </Stack>
            ) : (
              <Text>ไม่มีข้อมูลสถานที่ท่องเที่ยวที่ไปแล้ว</Text>
            )}
          </TabsPanel>

          <TabsPanel value="nearby"></TabsPanel>
          <TabsPanel value="chatgpt-planner">
            <ChatInterface visitedPlaces={celebrity.placeVisited} />
          </TabsPanel>
        </Tabs>
      </Stack>
    </Container>
  );
}
