'use client';

import {
  Avatar,
  Button,
  Center,
  Container,
  Divider,
  Grid,
  Image,
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
import ChatInterface from '@/components/ChatInterface';
import {
  IconArrowBack,
  IconArrowBigLeft,
  IconArrowBigLeftFilled,
  IconArrowLeftCircle,
  IconArrowsLeft,
} from '@tabler/icons-react';

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
      console.log(response);
      return response.data.data.results[0];
    });

    const results = await Promise.all(promises);
    console.log(results);
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

const TMDB_API_TOKEN =
  'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxNDg5YjUyNDg3MTdmZjY2NmY3NzhkNzE3NmVmYjdjZiIsInN1YiI6IjY1NTk5ZTI5ZWE4NGM3MTA5NmRmMjk2ZCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.e0lqhUBzvqt4L-OleXqsj8bx_p6yQK46wPabFdYFO1s';

const searchCelebrity = async (name: string) => {
  const data = await axios.get(`https://api.themoviedb.org/3/search/person?query=${name}`, {
    headers: {
      Authorization: `Bearer ${TMDB_API_TOKEN}`,
    },
  });
  return data.data.results[0];
};

const getCelebrityInfo = async (person_id: string) => {
  const data = await axios.get(`https://api.themoviedb.org/3/person/${person_id}`, {
    headers: {
      Authorization: `Bearer ${TMDB_API_TOKEN}`,
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
    googleMapsApiKey: 'AIzaSyABkNqq2Rnxn7v-unsUUtVfNaPFcufrlbU',
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
        <div>
          <Button variant="white" onClick={() => navigate.back()}>
            <IconArrowBigLeftFilled
              style={{
                color: 'black',
              }}
              size={24}
            />
          </Button>
        </div>
        <Center>
          <Avatar
            size={200}
            src={`https://image.tmdb.org/t/p/original/${info?.profile_path}`}
            alt="test"
          />
        </Center>
        <Title order={1} ta="center">
          {decodeURIComponent(name as string)}
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
                  <Text size="md">ไม่มีข้อมูล</Text>
                )}
              </div>
              <div>
                <Stack>
                  <Title order={3}>Known For</Title>
                  <Grid>
                    {data?.known_for?.map((item) => (
                      <Grid.Col
                        span={{
                          xs: 12,
                          md: 4,
                        }}
                      >
                        <Stack key={item.id}>
                          <Image
                            src={`https://image.tmdb.org/t/p/original/${item.poster_path}`}
                            alt="test"
                          />
                          <Text ta="center">{item.name ?? item.title}</Text>
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
              {places?.some((place) => place !== undefined) ? (
                places?.map((place: any) => (
                  <Stack key={place?.name}>
                    <Image
                      src={`https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${place?.photos[0].photo_reference}&key=${API_KEY}`}
                      alt="test"
                    />
                    <Stack>
                      <Title order={3} ta="center">
                        {place?.name}
                      </Title>
                      <Text size="xs">{place?.formatted_address}</Text>
                    </Stack>
                    <iframe
                      title="map"
                      src={`https://www.google.com/maps/embed/v1/view?key=${API_KEY}&center=${place?.geometry.location.lat},${place?.geometry.location.lng}&zoom=15`}
                      width="100%"
                      height="450"
                      allowFullScreen
                      loading="lazy"
                    />
                    <Divider size="md" w="100%" />
                  </Stack>
                ))
              ) : (
                <Text size="xs">ไม่มีข้อมูล</Text>
              )}
            </Stack>
          </TabsPanel>
          <TabsPanel value="nearby">
            <div>
              {isLoaded && currentLocation ? (
                <>
                  <GoogleMap
                    mapContainerStyle={containerStyle}
                    center={currentLocation}
                    zoom={10}
                    onLoad={onLoad}
                    onUnmount={onUnmount}
                  >
                    {/* {celebrityData
                      .filter((celebrity) =>
                        celebrity.visits.some(
                          (visit) =>
                            getDistance(currentLocation, { lat: visit.lat, lng: visit.lng }) <= 50 // Filter places within 50km radius
                        )
                      )
                      .map((celebrity, index) =>
                        celebrity.visits
                          .filter(
                            (visit) =>
                              getDistance(currentLocation, { lat: visit.lat, lng: visit.lng }) <= 50 // Filter places within 50km radius
                          )
                          .map((visit, visitIndex) => (
                            <Marker
                              key={`${index}-${visitIndex}`}
                              position={{ lat: visit.lat, lng: visit.lng }}
                            >
                              {visit.place}
                            </Marker>
                          ))
                      )} */}
                    {celebrityData.map((celebrity, index) =>
                      celebrity.visits.map((visit, visitIndex) => (
                        <Marker
                          key={`${index}-${visitIndex}`}
                          position={{ lat: visit.lat, lng: visit.lng }}
                          icon={{
                            url: `https://image.tmdb.org/t/p/original/${info?.profile_path}`,
                            scaledSize: new window.google.maps.Size(40, 40),
                            anchor: new window.google.maps.Point(20, 20),
                            labelOrigin: new window.google.maps.Point(20, 60),
                          }}
                          title={celebrity.name}
                          label={{
                            text: celebrity.name,
                            color: 'black',
                            fontWeight: 'bold',
                            fontSize: '16px',
                          }}
                        />
                      ))
                    )}
                  </GoogleMap>
                  {/* <Stack mt="md">
                    {celebrityData
                      .filter((celebrity) =>
                        celebrity.visits.some(
                          (visit) =>
                            getDistance(currentLocation, { lat: visit.lat, lng: visit.lng }) <= 50 // Filter places within 50km radius
                        )
                      )
                      .map((celebrity, index) => (
                        <div key={index}>
                          <Title order={3}>{celebrity.name}</Title>
                          <Stack>
                            {celebrity.visits
                              .filter(
                                (visit) =>
                                  getDistance(currentLocation, {
                                    lat: visit.lat,
                                    lng: visit.lng,
                                  }) <= 50 // Filter places within 50km radius
                              )
                              .map((visit, visitIndex) => (
                                <Card key={visitIndex} shadow="sm" p="md" radius="md" withBorder>
                                  <Text size="sm" color="dimmed">
                                    {visit.place}
                                  </Text>
                                </Card>
                              ))}
                          </Stack>
                        </div>
                      ))}
                  </Stack> */}
                </>
              ) : (
                <p>Loading...</p>
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
