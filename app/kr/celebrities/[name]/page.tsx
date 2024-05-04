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

const API_KEY = 'AIzaSyABkNqq2Rnxn7v-unsUUtVfNaPFcufrlbU';

function toRad(value) {
  return (value * Math.PI) / 180;
}

function getDistance(point1, point2) {
  const R = 6371; // Earth's radius in kilometers
  const dLat = toRad(point2.lat - point1.lat);
  const dLon = toRad(point2.lng - point1.lng);
  const lat1 = toRad(point1.lat);
  const lat2 = toRad(point2.lat);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  return distance;
}

const getPlacebyTextSearch = async (places: string[]) => {
  try {
    const promises = places?.map(async (place) => {
      const response = await axios.get(`/api/places?place=${place}`);
      return response.data.data.results[0];
    });

    const results = await Promise.all(promises);
    return results;
  } catch (error) {
    console.error(error);
    return [];
  }
};

const celebrityData = [
  {
    name: 'Lee Min-ho',
    visits: [
      { lat: 13.7563, lng: 100.5018, place: 'Bangkok' },
      { lat: 7.9519, lng: 98.3381, place: 'Phuket' },
    ],
  },
  {
    name: 'Song Hye-kyo',
    visits: [
      { lat: 18.7061, lng: 98.9817, place: 'Chiang Mai' },
      { lat: 12.5683, lng: 99.9576, place: 'Hua Hin' },
    ],
  },
  {
    name: 'Park Seo-joon',
    visits: [
      { lat: 13.7563, lng: 100.5018, place: 'Bangkok' },
      { lat: 9.1412, lng: 99.9236, place: 'Koh Samui' },
    ],
  },
  {
    name: 'Kim Go-eun',
    visits: [
      { lat: 8.0862, lng: 98.9062, place: 'Krabi' },
      { lat: 7.74, lng: 98.7739, place: 'Phi Phi Islands' },
    ],
  },
  {
    name: 'Ji Chang-wook',
    visits: [
      { lat: 12.9177, lng: 100.893, place: 'Pattaya' },
      { lat: 14.3559, lng: 100.5614, place: 'Ayutthaya' },
    ],
  },
];

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

async function getTrendingKoreanCelebrities() {
  try {
    const response = await axios.get('/api/scrape?nationality=Korean');
    return response.data;
  } catch (error) {
    console.error(error);
    throw new Error('Failed to fetch data');
  }
}

const fetchNearbyPlaces = async (location) => {
  const { lat, lng } = location;
  const response = await axios.get(
    `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=1000&type=tourist_attraction&key=${API_KEY}`
  );
  return response.data.results;
};

export default function Page() {
  const [map, setMap] = useState(null);
  const navigate = useRouter();

  const { name } = useParams();
  const decodedName = decodeURIComponent(name as string);
  const [currentLocation, setCurrentLocation] = useState({ lat: 0, lng: 0 });
  const { data: celebs, isLoading: isTrendingLoading } = useQuery(
    ['trendingKoreanCelebrities', decodedName],
    getTrendingKoreanCelebrities
  );

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

  const filter = celebs?.filter((celeb) => celeb.name === decodedName)[0];

  const { data: places } = useQuery(['places', filter?.places], () =>
    getPlacebyTextSearch(decodedName === 'Jackson Wang' ? ['หมูกระทะคนรวย'] : filter.places)
  );

  const { data } = useQuery(['searchCeleb', decodedName], () =>
    searchCelebrity(decodedName as string)
  );
  const { data: info } = useQuery(['info', data?.id], () => getCelebrityInfo(data?.id));

  const { data: nearbyPlaces } = useQuery(['nearbyPlaces', currentLocation], () =>
    fetchNearbyPlaces(currentLocation)
  );

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
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
  });

  if (loadError) {
    return <div>Error loading Google Maps API</div>;
  }

  if (!isLoaded) {
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
                  alt={decodeURIComponent(name as string)}
                />
              ) : (
                <Skeleton height={200} circle />
              )}
            </Center>
            <Title order={1} ta="center">
              {decodeURIComponent(name as string)}
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
                      <Text size="md">ไม่มีข้อมูล</Text>
                    )
                  ) : (
                    <Skeleton height={100} />
                  )}
                </section>
                <section>
                  <Stack>
                    <Title order={3}>Known For</Title>
                    {data ? (
                      <Grid>
                        {data.known_for?.map((item) => (
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
                places.some((place) => place !== undefined) ? (
                  <>
                    <GoogleMap
                      mapContainerStyle={containerStyle}
                      center={currentLocation}
                      zoom={10}
                      onLoad={onLoad}
                      onUnmount={onUnmount}
                    >
                      {places.map((place: any) => (
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
                        >
                          <InfoWindow>
                            <div>
                              <h3>{place?.name}</h3>
                              <p>{place?.formatted_address}</p>
                            </div>
                          </InfoWindow>
                        </Marker>
                      ))}
                    </GoogleMap>
                    <Stack mt="md">
                      {places.map((place: any) => (
                        <article key={place?.name}>
                          <Stack>
                            <Image
                              src={`https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${place?.photos[0].photo_reference}&key=${API_KEY}`}
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
            </TabsPanel>

            <TabsPanel value="nearby">
              <div>
                {isLoaded && currentLocation ? (
                  <>
                    <GoogleMap
                      mapContainerStyle={containerStyle}
                      center={currentLocation}
                      zoom={15}
                      onLoad={onLoad}
                      onUnmount={onUnmount}
                    >
                      <Marker
                        position={currentLocation}
                        icon={{
                          url: `https://image.tmdb.org/t/p/original/${info?.profile_path}`,
                          scaledSize: new window.google.maps.Size(40, 40),
                          anchor: new window.google.maps.Point(20, 20),
                          labelOrigin: new window.google.maps.Point(20, 60),
                        }}
                        title={info?.name}
                        label={{
                          text: info?.name,
                          color: 'black',
                          fontWeight: 'bold',
                          fontSize: '16px',
                        }}
                      />
                      {nearbyPlaces?.map((place: any) => (
                        <Marker
                          key={place.place_id}
                          position={{
                            lat: place.geometry.location.lat,
                            lng: place.geometry.location.lng,
                          }}
                          title={place.name}
                        >
                          <InfoWindow>
                            <div>
                              <h3>{place.name}</h3>
                              <p>{place.vicinity}</p>
                            </div>
                          </InfoWindow>
                        </Marker>
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
        </main>
      </Stack>
    </Container>
  );
}
