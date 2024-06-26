'use client';

import {
  Avatar,
  Breadcrumbs,
  Button,
  Card,
  Center,
  Container,
  Grid,
  Image,
  Select,
  Skeleton,
  Stack,
  Tabs,
  TabsList,
  TabsPanel,
  TabsTab,
  Text,
  Title,
} from '@mantine/core';

import axios from 'axios';
import { useParams, useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { IconArrowLeft } from '@tabler/icons-react';

import ChatInterface from '@/components/ChatInterface';

const API_KEY = 'AIzaSyBKRFuroEmi6ocPRQzuBuX4ULAFiYTvTGo';

const getCelebrityById = async (celebId: string) => {
  try {
    const response = await axios.get(`/api/celebrities?id=${celebId}`);
    return response.data;
  } catch (error) {
    console.error('Error retrieving celebrity:', error);
    throw error;
  }
};

const getWikipediaBiography = async (name: string) => {
  try {
    const response = await fetch(
      `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(name)}`
    );
    const data = await response.json();
    return data.extract;
  } catch (error) {
    console.error('Error fetching Wikipedia biography:', error);
    return null;
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
  const [selectedPlace, setSelectedPlace] = useState(null);

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

  console.log('celebrity:', celebInfo);

  const { data: places } = useQuery(
    ['places', celebrity?.placeVisited],
    () => getPlaceDetails(celebrity?.placeVisited),
    {
      initialData: { places: [] },
      enabled: !!celebrity?.placeVisited,
    }
  );

  const { data: nearbyPlaces } = useQuery(
    ['nearbyPlaces', places?.places],
    () => fetchNearbyPlaces(places?.places?.[0]?.geometry?.location),
    {
      enabled: !!places,
    }
  );

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

  if (isCelebrityLoading) {
    return <div>Loading...</div>;
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
        <main>
          <section>
            <Center>
              {info ? (
                <Avatar
                  size={200}
                  src={`https://image.tmdb.org/t/p/original/${info?.profile_path}`}
                />
              ) : (
                <Skeleton height={200} circle />
              )}
            </Center>
            <Title order={1} ta="center">
              {celebrity?.name}
            </Title>
          </section>

          <Tabs defaultValue="info">
            <nav>
              <TabsList mb="xl" grow>
                <TabsTab value="info">ประวัติ</TabsTab>
                <TabsTab value="visited-places">การท่องเที่ยว</TabsTab>
                <TabsTab value="nearby">สถานที่ท่องเที่ยวใกล้เคียง</TabsTab>
                <TabsTab value="chatgpt-planner">Trip Planner</TabsTab>
              </TabsList>
            </nav>
            <TabsPanel value="info">
              <Stack>
                <section>
                  {info ? (
                    info.biography ? (
                      <Text size="md">{info.biography}</Text>
                    ) : (
                      <Text size="md">{biography}</Text>
                    )
                  ) : (
                    <Skeleton height={100} />
                  )}
                </section>
                <section>
                  <Stack>
                    <Title order={3}>Known For</Title>
                    {celebInfo ? (
                      <Grid>
                        {celebInfo.known_for?.map((item) => (
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
                              <Text ta="center">{item.name ?? item.title}</Text>
                            </Stack>
                          </Grid.Col>
                        ))}
                      </Grid>
                    ) : (
                      <Grid>
                        {Array(3)
                          .fill(0)
                          .map((_, index) => (
                            <Grid.Col
                              span={{
                                xs: 12,
                                md: 4,
                              }}
                              key={index}
                            >
                              <Stack>
                                <Skeleton height={200} />
                                <Skeleton height={20} width="50%" mx="auto" />
                              </Stack>
                            </Grid.Col>
                          ))}
                      </Grid>
                    )}
                  </Stack>
                </section>
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

            <TabsPanel value="nearby">
              <Stack>
                <Select
                  label="เลือกสถานที่"
                  placeholder="เลือกสถานที่"
                  data={celebrity?.placeVisited?.map((place) => ({
                    value: place,
                    label: place,
                  }))}
                  onChange={(value) => {
                    setSelectedPlace(value);
                  }}
                />
                <iframe
                  title="map"
                  width="100%"
                  height="450"
                  style={{ border: 0 }}
                  loading="lazy"
                  allowFullScreen
                  referrerPolicy="no-referrer-when-downgrade"
                  src={`https://www.google.com/maps/embed/v1/search?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&q=${selectedPlace}`}
                />
              </Stack>
            </TabsPanel>
            <TabsPanel value="chatgpt-planner">
              <ChatInterface visitedPlaces={celebrity?.placeVisited} />
            </TabsPanel>
          </Tabs>
        </main>
      </Stack>
    </Container>
  );
}
