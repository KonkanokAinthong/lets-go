/* eslint-disable react/no-unescaped-entities */

'use client';

import {
  Avatar,
  Breadcrumbs,
  Button,
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
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';
import { IconArrowLeft } from '@tabler/icons-react';
import axios from 'axios';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import ChatInterface from '@/components/ChatInterface';

const API_KEY = 'AIzaSyABkNqq2Rnxn7v-unsUUtVfNaPFcufrlbU';

const getWikipediaBiography = async (name: string) => {
  try {
    let formattedName = name;

    // Check if the name needs to be replaced
    switch (name.toLowerCase()) {
      case 'li zi ting':
        formattedName = 'Mimi lee';
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

  const { data: places } = useQuery(['places', celebrity?.placeVisited], () =>
    getPlaceDetails(celebrity?.placeVisited)
  );

  const { data: nearbyPlaces } = useQuery(
    ['nearbyPlaces', places?.places],
    () => fetchNearbyPlaces(places?.places[0].geometry.location),
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

  const containerStyle = {
    width: '100%',
    height: '600px',
  };

  console.log(biography);

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
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
            <Stack justify="center" align="center">
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
                          <Stack>
                            <Image
                              src={`https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${place?.photos?.[0].photo_reference}&key=${API_KEY}`}
                              alt={place?.name}
                            />
                            <Stack>
                              <Title order={3} ta="center">
                                {place?.name}
                              </Title>
                              <Text size="xs">{place?.formatted_address}</Text>
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
            </Stack>
          </TabsPanel>
          <TabsPanel value="nearby">
            <div>
              {isLoaded && places?.places[0] ? (
                <>
                  <GoogleMap
                    mapContainerStyle={containerStyle}
                    center={places?.places?.[0]?.geometry?.location}
                    zoom={75}
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
                        title={place.displayName.text}
                      />
                    ))}
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
      </Stack>
    </Container>
  );
}
