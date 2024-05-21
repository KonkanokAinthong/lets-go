'use client';

import {
  Avatar,
  Box,
  Breadcrumbs,
  Button,
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
import { Map } from 'react-map-gl';
import ChatInterface from '@/components/ChatInterface';
import { useSearchPlaces } from '@/hooks/useSearchPlaces';
import { useAttractionDetails } from '@/hooks/useAttractionDetails';

const API_KEY = 'AIzaSyBKRFuroEmi6ocPRQzuBuX4ULAFiYTvTGo';

/**
 * Retrieves celebrity data by ID from the API.
 * @param celebId - The ID of the celebrity to retrieve.
 * @returns The celebrity data.
 * @throws An error if there was a problem retrieving the celebrity data.
 */
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

/**
 * Searches for a celebrity by name using The Movie Database (TMDb) API.
 * @param name - The name of the celebrity to search for.
 * @returns The first search result from the TMDb API.
 */
const searchCelebrity = async (name: string) => {
  const data = await axios.get(`https://api.themoviedb.org/3/search/person?query=${name}`, {
    headers: {
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_TMDB_API_TOKEN}`,
    },
  });
  return data.data.results[0];
};

/**
 * Retrieves detailed information about a celebrity using the TMDb API.
 * @param person_id - The ID of the celebrity to retrieve information for.
 * @returns The detailed celebrity information from the TMDb API.
 */
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

/**
 * Fetches nearby places based on a given location using the Google Places API.
 * @param location - The location to search for nearby places.
 * @returns An array of nearby places.
 */
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

/**
 * Retrieves details for a list of places.
 * @param places - An array of place names to retrieve details for.
 * @returns An object containing the detailed place information.
 */
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
              keyword: place.name,
            },
          }
        );

        return response.data.result[response.data.result.length - 1];
      } catch (error) {
        if (error.response && error.response.status === 404) {
          return null;
        }
        throw error;
      }
    });

    const results = await Promise.allSettled(promises);
    console.log(results);
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
  const mapContainerRef = useRef(null);

  // const { data: places } = useSearchPlaces({ geolocation: '13.7563,100.5018', keyword: 'Bangkok' });

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
    () => getPlaceDetails(celebrity?.placeVisited),
    {
      refetchOnWindowFocus: false,
      initialData: { places: [] },
      enabled: !!celebrity?.placeVisited,
    }
  );

  const { data: placeDetails } = useQuery(
    ['placeDetails', selectedPlace],
    () => getPlaceDetailFromPlaceId(selectedPlace?.place_id),
    {
      refetchOnWindowFocus: false,
      enabled: !!selectedPlace,
    }
  );

  const { data: nearbyPlaces } = useQuery(
    ['nearbyPlaces', places?.places],
    () => fetchNearbyPlaces(),
    {
      enabled: !!places,
      refetchOnWindowFocus: false,
    }
  );

  // const { data: searchPlaces } = useSearchPlaces({
  //   keyword: celebrity?.placeVisited,
  //   geolocation: `${currentLocation.lat},${currentLocation.lng}`,
  // });

  // const { data: attractionsDetails } = useAttractionDetails(searchPlaces?.[0]?.place_id);

  const [biography, setBiography] = useState('');
  const [isFetching, setIsFetching] = useState(false);

  console.log(places);

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

  const [mapInstance, setMapInstance] = useState(null);

  useEffect(() => {
    if (mapInstance) {
      mapInstance.resize();
    }
  }, [mapInstance]);

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
              {/* <div>
                <Map
                  style={{ width: '100%', height: '400px' }}
                  initialViewState={{
                    latitude: currentLocation.lat,
                    longitude: currentLocation.lng,
                    zoom: 10,
                  }}
                  mapStyle="mapbox://styles/mapbox/streets-v9"
                  mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_API_TOKEN}
                  onLoad={(evt) => {
                    setMapInstance(evt.target);
                  }}
                />
              </div> */}
              {places ? (
                <Stack>
                  <Divider />
                  <Stack>
                    <Title order={3}>Visited Places</Title>
                    <Grid>
                      {places.places.map((place) => (
                        <Grid.Col key={place.place_id}>
                          <Stack>
                            <Image src={place?.thumbnail_url} alt={place.place_name} />
                            {/* {placeDetails.hit_score ? (
                              <Text>ระดับความฮิต: {placeDetails?.hit_score}</Text>
                            ) : null}

                            <Text>วิธีการเดินทาง: {placeDetails?.how_to_travel}</Text> */}
                            <Stack>
                              <Title order={2}>ประวัติและความเป็นมา</Title>
                              <Text>{placeDetails?.place_information?.detail}</Text>
                            </Stack>
                            <Stack>
                              <Title order={2}>ที่ตั้ง</Title>
                              <Text>
                                {place?.location.address} {place?.location.sub_district}{' '}
                                {place?.location.district} {place?.location.province}{' '}
                                {place?.location.postcode}
                              </Text>
                            </Stack>
                            <Stack>
                              <Title order={2}>เวลาทำการ</Title>
                              <Text>
                                {placeDetails?.place_information?.open_now ? 'เปิดอยู่' : 'ปิดแล้ว'}
                              </Text>
                            </Stack>
                            <Stack>
                              <Title order={2}>เบอร์โทร</Title>
                              <Text>{placeDetails?.contact?.phones[0]}</Text>
                            </Stack>
                            <Stack>
                              <Title order={2}>กิจกรรมแนะนำ</Title>
                              <Stack>
                                {placeDetails?.place_information?.activities.map((activity) => (
                                  <Stack key={activity.id}>
                                    <Text>{activity}</Text>
                                  </Stack>
                                ))}
                              </Stack>
                            </Stack>
                          </Stack>
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
                            <Stack>
                              <Skeleton height={20} />
                              <Skeleton height={20} />
                            </Stack>
                          </Grid.Col>
                        ))}
                    </Grid>
                  </Stack>
                </Stack>
              )}
            </TabsPanel>
            <TabsPanel value="nearby">
              <Map
                style={{ width: '100%', height: '100%' }}
                initialViewState={{
                  latitude: currentLocation.lat,
                  longitude: currentLocation.lng,
                  zoom: 10,
                }}
                mapStyle="mapbox://styles/mapbox/streets-v9"
                mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_API_TOKEN}
              />
            </TabsPanel>
            <TabsPanel value="chatgpt-planner">
              <ChatInterface visitedPlaces={[]} />
            </TabsPanel>
          </Tabs>
        </main>
      </Stack>
    </Container>
  );
}
