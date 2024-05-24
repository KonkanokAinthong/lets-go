'use client';

import {
  Avatar,
  Box,
  Breadcrumbs,
  Button,
  Card,
  Center,
  Container,
  Divider,
  Grid,
  Image,
  Rating,
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
import { useEffect, useRef, useState } from 'react';
import { useQuery } from 'react-query';
import { IconArrowLeft } from '@tabler/icons-react';
import { Map, Marker } from 'react-map-gl';
import ChatInterface from '@/components/ChatInterface';

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
    let formattedName = name;

    // Check if the name needs to be replaced
    switch (name.toLowerCase()) {
      case 'ณิชา ยนตรรักษ์':
        formattedName = 'Minnie';
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

const searchCelebrity = async (name: string) => {
  const data = await axios.get(`https://api.themoviedb.org/3/search/person?query=${name}`, {
    headers: {
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_TMDB_API_TOKEN}`,
    },
  });
  return data.data.results[0];
};

const getCelebrityInfo = async (
  person_id: string,
  options: {
    language?: string;
  }
) => {
  const data = await axios.get(
    `https://api.themoviedb.org/3/person/${person_id}?language=${options.language}`,
    {
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_TMDB_API_TOKEN}`,
      },
    }
  );
  return data.data;
};

const getPlaceDetailFromPlaceId = async (placeId: string) => {
  const response = await axios.get(
    `https://tatapi.tourismthailand.org/tatapi/v5/attraction/${placeId}`,
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization:
          'Bearer Gb6UecYN9hyd8JhU6Fs1wUl4mpJaY6Nb6)O)CLN)deKcdMmHpoaDMyH0Bj5ychzyHQSPcb6p5BDAfr4b9WowEa0=====2',
        'Accept-Language': 'th',
      },
    }
  );
  return response.data.result;
};

const fetchNearbyPlaces = async (places) => {
  const promises = places.map(async (place) => {
    const response = await axios.get('https://search.longdo.com/mapsearch/json/search', {
      params: {
        keyword: place.name,
        area: `${place.lat},${place.lng}`,
        span: '1km',
        limit: 10,
        key: process.env.NEXT_PUBLIC_LONGDO_API_KEY,
      },
    });
    return response.data.data;
  });

  const results = await Promise.all(promises);
  return results.flat();
};

const getPlaceDetails = async (places: any) => {
  try {
    const promises = places.map(async (place) => {
      try {
        const response = await axios.get(
          'https://tatapi.tourismthailand.org/tatapi/v5/places/search',
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization:
                'Bearer Gb6UecYN9hyd8JhU6Fs1wUl4mpJaY6Nb6)O)CLN)deKcdMmHpoaDMyH0Bj5ychzyHQSPcb6p5BDAfr4b9WowEa0=====2',
              'Accept-Language': 'th',
            },
            params: {
              geolocation: `${place.lat},${place.lng}`,
            },
          }
        );
        console.log(response);

        return response.data.result;
      } catch (error) {
        if (error.response && error.response.status === 404) {
          return null;
        }
        throw error;
      }
    });

    const results = await Promise.allSettled(promises);

    const fulfilledResults = results
      .filter((result) => result.status === 'fulfilled')
      .map((result) => result.value)
      .filter((result) => result !== null);

    const flattenedResults = fulfilledResults.flat();
    return { places: flattenedResults };
  } catch (error) {
    return { places: [] };
  }
};

export default function Page() {
  const [selectedPlace, setSelectedPlace] = useState(null);
  const navigate = useRouter();

  const { celebId } = useParams();

  const [currentLocation, setCurrentLocation] = useState({ lat: 0, lng: 0 });

  const { data: celebrity, isLoading: isCelebrityLoading } = useQuery(
    ['celebrity', celebId],
    () => getCelebrityById(celebId as string),
    {
      enabled: !!celebId,
      refetchOnWindowFocus: false,
    }
  );

  const { data: celebInfo } = useQuery(
    ['searchCelebrity', celebrity?.name],
    () => searchCelebrity(celebrity?.name),
    {
      enabled: !!celebrity?.name,
      refetchOnWindowFocus: false,
    }
  );

  const { data: info } = useQuery(
    ['info', celebInfo?.id],
    () =>
      getCelebrityInfo(celebInfo?.id, {
        language: document.documentElement.lang,
      }),
    {
      enabled: !!celebInfo?.id,
      refetchOnWindowFocus: false,
    }
  );

  const { data: places } = useQuery(
    ['places', celebrity?.placeVisited],
    () => getPlaceDetails(celebrity.placeVisited.map((place) => place)),
    {
      refetchOnWindowFocus: false,
      initialData: { places: [] },
      enabled: !!celebrity?.placeVisited,
    }
  );

  console.log(places);

  const { data: placeDetails } = useQuery(
    ['placeDetails', selectedPlace],
    () => getPlaceDetailFromPlaceId(selectedPlace?.place_id),
    {
      refetchOnWindowFocus: false,
      enabled: !!selectedPlace,
    }
  );

  const { data: nearbyPlaces } = useQuery(
    ['nearbyPlaces', celebrity?.placeVisited],
    () => fetchNearbyPlaces(celebrity?.placeVisited || []),
    {
      enabled: !!celebrity?.placeVisited,
      refetchOnWindowFocus: false,
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
            <Stack>
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
              <Title order={1} ta="center" mb={24}>
                {celebrity?.name}
              </Title>
            </Stack>
          </section>

          <Tabs defaultValue="info">
            <nav>
              <TabsList mb="xl" grow>
                <TabsTab value="info">ประวัติ</TabsTab>
                <TabsTab value="visited-places">การท่องเที่ยว</TabsTab>
                <TabsTab value="nearby">สถานที่ท่องเที่ยวใกล้เคียง</TabsTab>
                <TabsTab value="chatgpt-planner">วางแผนการเดินทาง</TabsTab>
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
              {places ? (
                <Stack>
                  <Stack>
                    <Title order={3}>Visited Places</Title>
                    <Grid>
                      {places.places.map((place) => (
                        <Grid.Col key={place.place_id}>
                          <Card shadow="sm" p="md">
                            <Card.Section>
                              <Image
                                src={place?.thumbnail_url}
                                alt={place.place_name}
                                height={200}
                              />
                            </Card.Section>
                            <Stack mt="md">
                              <Title order={3}>{place.place_name}</Title>
                              <Stack>
                                <Title order={4}>ประวัติและความเป็นมา</Title>
                                <Text>{placeDetails?.place_information?.detail}</Text>
                              </Stack>
                              <Stack>
                                <Title order={4}>ที่ตั้ง</Title>
                                <Text>
                                  {place?.location.address} {place?.location.sub_district}{' '}
                                  {place?.location.district} {place?.location.province}{' '}
                                  {place?.location.postcode}
                                </Text>
                              </Stack>
                              <Stack>
                                <Title order={4}>เวลาทำการ</Title>
                                <Text>
                                  {placeDetails?.place_information?.open_now
                                    ? 'เปิดอยู่'
                                    : 'ปิดแล้ว'}
                                </Text>
                              </Stack>
                              <Stack>
                                <Title order={4}>เบอร์โทร</Title>
                                <Text>{placeDetails?.contact?.phones[0]}</Text>
                              </Stack>
                              <Stack>
                                <Title order={4}>กิจกรรมแนะนำ</Title>
                                <Stack>
                                  {placeDetails?.place_information?.activities.map((activity) => (
                                    <Text key={activity.id}>{activity}</Text>
                                  ))}
                                </Stack>
                              </Stack>
                            </Stack>
                          </Card>
                        </Grid.Col>
                      ))}
                    </Grid>
                  </Stack>
                </Stack>
              ) : (
                <Stack>
                  <Divider />
                  <Stack>
                    <Title order={3}>Visited Places</Title>
                    <Grid>
                      {Array(3)
                        .fill(0)
                        .map((_, index) => (
                          <Grid.Col key={index}>
                            <Card shadow="sm" p="md">
                              <Skeleton height={200} />
                              <Stack mt="md">
                                <Skeleton height={20} width="70%" />
                                <Skeleton height={20} width="50%" />
                              </Stack>
                            </Card>
                          </Grid.Col>
                        ))}
                    </Grid>
                  </Stack>
                </Stack>
              )}
            </TabsPanel>
            <TabsPanel value="nearby">
              <Map
                latitude={currentLocation.lat}
                longitude={currentLocation.lng}
                zoom={12}
                mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_API_TOKEN}
                style={{ width: 1000, height: 400 }}
                mapStyle="mapbox://styles/mapbox/streets-v9"
              >
                {/* {nearbyPlaces?.map((place) => (
                  <Marker
                    key={place?.id}
                    latitude={place?.lat}
                    longitude={place?.lon}
                    offset={{
                      x: -20,
                      y: -40,
                    }}
                  >
                    <Avatar
                      size={40}
                      src={place?.icon}
                      alt={place?.name}
                      onClick={() => setSelectedPlace(place)}
                    />
                  </Marker>
                ))} */}
              </Map>
            </TabsPanel>
            <TabsPanel value="chatgpt-planner">
              <ChatInterface visitedPlaces={celebrity.placeVisited} />
            </TabsPanel>
          </Tabs>
        </main>
      </Stack>
    </Container>
  );
}
