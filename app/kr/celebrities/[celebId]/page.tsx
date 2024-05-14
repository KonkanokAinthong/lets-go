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
import { GoogleMap, InfoWindow, Marker, useJsApiLoader } from '@react-google-maps/api';
import axios from 'axios';
import { useParams, useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { IconArrowLeft } from '@tabler/icons-react';
import ChatInterface from '@/components/ChatInterface';

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
const getCelebrityInfo = async (person_id: string) => {
  const data = await axios.get(`https://api.themoviedb.org/3/person/${person_id}`, {
    headers: {
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_TMDB_API_TOKEN}`,
    },
  });
  return data.data;
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
const getPlaceDetails = async (places: string[]) => {
  try {
    const promises = places.map(async (place) => {
      const response = await axios.get(`/api/places?query=${encodeURIComponent(place)}`);
      return response.data.data.results;
    });
    const results = await Promise.all(promises);
    const flattenedResults = results.flat();
    return { places: flattenedResults };
  } catch (error) {
    console.error(error);
    return { places: [] };
  }
};

export default function Page() {
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [map, setMap] = useState(null);
  const navigate = useRouter();

  const { celebId } = useParams();

  const [currentLocation, setCurrentLocation] = useState({ lat: 0, lng: 0 });

  const onLoad = useCallback(
    (map) => {
      map.setCenter(currentLocation);
      map.setZoom(10);
      setMap(map);
    },
    [currentLocation]
  );

  const onUnmount = useCallback((map) => {
    setMap(null);
  }, []);

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

  const { data: info } = useQuery(['info', celebInfo?.id], () => getCelebrityInfo(celebInfo?.id), {
    enabled: !!celebInfo?.id,
    refetchOnWindowFocus: false,
  });

  const { data: places } = useQuery(
    ['places', celebrity?.placeVisited],
    () => getPlaceDetails(celebrity?.placeVisited),
    {
      refetchOnWindowFocus: false,
      initialData: { places: [] },
    }
  );

  const { data: nearbyPlaces } = useQuery(
    ['nearbyPlaces', places?.places],
    () => fetchNearbyPlaces(places?.places[0].geometry.location),
    {
      enabled: !!places,
      refetchOnWindowFocus: false,
    }
  );

  console.log(places);

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

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: 'AIzaSyBKRFuroEmi6ocPRQzuBuX4ULAFiYTvTGo',
  });

  if (loadError) {
    return <div>Error loading Google Maps API</div>;
  }

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

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
              {places ? (
                places.places.some((place) => place !== undefined) ? (
                  <>
                    <GoogleMap
                      mapContainerStyle={containerStyle}
                      center={currentLocation}
                      zoom={10}
                      onLoad={onLoad}
                      onUnmount={onUnmount}
                    >
                      {places.places.map((place: any) => (
                        <Marker
                          key={place?.name}
                          position={{
                            lat: place?.geometry.location.lat,
                            lng: place?.geometry.location.lng,
                          }}
                          icon={{
                            url: `https://image.tmdb.org/t/p/original/${info?.profile_path}`,
                            scaledSize: new window.google.maps.Size(40, 40),
                            anchor: new window.google.maps.Point(20, 20),
                            labelOrigin: new window.google.maps.Point(20, 60),
                          }}
                          title={place?.name}
                          label={{
                            text: place?.name,
                            color: 'black',
                            fontWeight: 'bold',
                            fontSize: '16px',
                          }}
                        />
                      ))}
                    </GoogleMap>

                    <Stack mt="md">
                      {places.places.map((place: any) => (
                        <article key={place?.name}>
                          <Stack spacing="md">
                            <Image
                              src={`https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${place?.photos[0].photo_reference}&key=${API_KEY}`}
                              alt={place?.name}
                            />
                            <Stack spacing="sm">
                              <Title order={3} ta="center">
                                {place?.name}
                                {console.log(place)}
                              </Title>
                              <Text size="sm">{place?.formatted_address}</Text>
                              <Stack dir="row" justify="space-between" align="center">
                                <Stack ta="center" justify="center">
                                  <Rating value={place?.rating} fractions={2} />
                                  <Text size="xs">{`User Ratings: ${place?.user_ratings_total}`}</Text>
                                </Stack>
                                <Box ta="center">
                                  {place?.opening_hours?.open_now ? (
                                    <Title c="green" size="xs" w={500}>
                                      Open Now
                                    </Title>
                                  ) : (
                                    <Title c="red" size="xs" w={500}>
                                      Closed Now
                                    </Title>
                                  )}
                                </Box>
                              </Stack>
                              <Stack spacing="sm">
                                <Text size="xs" w={500}>
                                  {`Phone: ${place?.phone_number || 'Not available'}`}
                                </Text>
                                <Text size="xs" w={500}>
                                  {`Website: ${place?.website || 'Not available'}`}
                                </Text>
                                <Text size="xs" w={500}>
                                  {`Price Level: ${place?.price_level || 'Not available'}`}
                                </Text>
                                <Text size="xs" w={500}>
                                  {`Types: ${place?.types?.join(', ') || 'Not available'}`}
                                </Text>
                              </Stack>
                            </Stack>
                            <Divider size="md" w="100%" />
                          </Stack>
                        </article>
                      ))}
                    </Stack>
                  </>
                ) : (
                  <Text size="xs">ไม่มีข้อมูล</Text>
                )
              ) : (
                <Stack justify="center" align="center">
                  {Array(3)
                    .fill(0)
                    .map((_, index) => (
                      <article key={index}>
                        <Stack>
                          <Skeleton height={200} />
                          <Stack>
                            <Skeleton height={30} width="50%" mx="auto" />
                            <Skeleton height={20} width="80%" mx="auto" />
                          </Stack>
                          <Skeleton height={450} />
                          <Divider size="md" w="100%" />
                        </Stack>
                      </article>
                    ))}
                </Stack>
              )}
            </TabsPanel>

            <TabsPanel value="nearby">
              <div>
                {isLoaded && places?.places[0] ? (
                  <>
                    <GoogleMap
                      mapContainerStyle={containerStyle}
                      center={{
                        lat: places.places[0].geometry.location.lat,
                        lng: places.places[0].geometry.location.lng,
                      }}
                      zoom={100}
                      onLoad={onLoad}
                      onUnmount={onUnmount}
                    >
                      <Marker
                        position={{
                          lat: places.places[0].geometry.location.lat,
                          lng: places.places[0].geometry.location.lng,
                        }}
                        icon={{
                          url: `https://image.tmdb.org/t/p/original/${info?.profile_path}`,
                          scaledSize: new window.google.maps.Size(40, 40),
                          anchor: new window.google.maps.Point(20, 20),
                          labelOrigin: new window.google.maps.Point(20, 60),
                        }}
                        title={info?.name}
                      />
                      {nearbyPlaces?.map((place: any) => (
                        <Marker
                          key={place.id}
                          position={{
                            lat: place.location.latitude,
                            lng: place.location.longitude,
                          }}
                          onClick={() => setSelectedPlace(place)}
                          title={place.displayName.text}
                        />
                      ))}
                      {selectedPlace && (
                        <InfoWindow
                          position={{
                            lat: selectedPlace.location.latitude,
                            lng: selectedPlace.location.longitude,
                          }}
                          onCloseClick={() => setSelectedPlace(null)}
                        >
                          <div
                            style={{
                              color: 'black',
                            }}
                          >
                            <h2>{selectedPlace.displayName.text}</h2>
                            <p>{selectedPlace.formattedAddress}</p>
                          </div>
                        </InfoWindow>
                      )}
                    </GoogleMap>
                  </>
                ) : (
                  <Skeleton height={600} />
                )}
              </div>
            </TabsPanel>
            <TabsPanel value="chatgpt-planner">
              <ChatInterface />
            </TabsPanel>
          </Tabs>
        </main>
      </Stack>
    </Container>
  );
}
