'use client';

import ChatInterface from '@/components/ChatInterface';
import {
  Avatar,
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
import { GoogleMap, InfoWindow, Marker, useJsApiLoader } from '@react-google-maps/api';
import axios from 'axios';
import { useParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { useQuery } from 'react-query';

const API_KEY = 'AIzaSyABkNqq2Rnxn7v-unsUUtVfNaPFcufrlbU';

const TMDB_API_TOKEN =
  'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxNDg5YjUyNDg3MTdmZjY2NmY3NzhkNzE3NmVmYjdjZiIsInN1YiI6IjY1NTk5ZTI5ZWE4NGM3MTA5NmRmMjk2ZCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.e0lqhUBzvqt4L-OleXqsj8bx_p6yQK46wPabFdYFO1s';

const searchCelebrity = async (name: string) => {
  const data = await axios.get(
    `https://api.themoviedb.org/3/search/person?query=${name}&include_adult=false&language=en-US&page=1`,
    {
      headers: {
        Authorization: `Bearer ${TMDB_API_TOKEN}`,
      },
    }
  );
  return data.data?.results?.[0] ?? [];
};

const getCelebrityInfo = async (person_id: string) => {
  const data = await axios.get(`https://api.themoviedb.org/3/person/${person_id}`, {
    headers: {
      Authorization: `Bearer ${TMDB_API_TOKEN}`,
    },
  });

  return data.data;
};

const getPlacebyTextSearch = async (place: string) => {
  try {
    const response = await axios.get(`/api/places?place=${place}`);
    return response.data.data.results;
  } catch (error) {
    console.error(error);
    throw new Error('Failed to fetch data');
  }
};

// const getNearbyPlaces = async (lat: string, long: string) => {
//   // try {
//   //   const response = await axios.get(`/api/nearby-places?place=${place}`);
//   //   return response.data.data.results;
//   // } catch (error) {
//   //   console.error(error);
//   //   throw new Error('Failed to fetch data');
//   // }
// };

export default function Page() {
  const [currentLocation, setCurrentLocation] = useState({ lat: 0, lng: 0 });
  const [map, setMap] = useState(null);
  const { name } = useParams();
  const placeName = 'หัวหิน';
  const { data: celebrity, isLoading: isCelebrityLoading } = useQuery('celebrity', () =>
    searchCelebrity(name as string)
  );
  const { data: celebrityInfo, isLoading: isCelebbrityInfoLoading } = useQuery(
    'celebrityInfo',
    () => getCelebrityInfo(celebrity?.id),
    {
      enabled: !!celebrity?.id,
    }
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
  const { data: places, isLoading: isPlacesLoading } = useQuery('place', () =>
    getPlacebyTextSearch(placeName as string)
  );
  // const { data: nearbyPlaces } = useQuery('nearbyPlaces', () =>
  //   getNearbyPlaces(placeName as string)
  // );

  const { data: info } = useQuery('info', () => getCelebrityInfo(celebrity?.id), {
    enabled: !!celebrity?.id,
  });

  const containerStyle = {
    width: '100%',
    height: '600px',
  };

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
  });

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

  if (loadError) {
    return <div>Error loading Google Maps API</div>;
  }

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  if (isCelebrityLoading || isCelebbrityInfoLoading || isPlacesLoading) {
    return <Loader />;
  }

  return (
    <Container c="white">
      <Stack>
        <Center>
          <Avatar
            size={200}
            src={`https://image.tmdb.org/t/p/original/${celebrityInfo?.profile_path}`}
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
                {celebrityInfo?.biography ? (
                  <Text size="md">{celebrityInfo?.biography}</Text>
                ) : (
                  <Text size="md">ไม่มีข้อมูล</Text>
                )}
              </div>
              <div>
                <Title order={3}>Known For</Title>
                <Grid>
                  {celebrity?.known_for?.map((item) => (
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
                        <Stack>
                          <Title order={3} ta="center">
                            {item.name}
                          </Title>
                        </Stack>
                      </Stack>
                    </Grid.Col>
                  ))}
                </Grid>
              </div>
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
            <iframe
              title="map"
              src="https://www.google.com/maps/place/Jae+Wan,+1700+%E0%B8%96%E0%B8%99%E0%B8%99+%E0%B8%9A%E0%B8%A3%E0%B8%A3%E0%B8%97%E0%B8%B1%E0%B8%94%E0%B8%97%E0%B8%AD%E0%B8%87+Khwaeng+Rong+Muang,+Khet+Pathum+Wan,+Bangkok+10330/@13.7396492,100.5222225,17z/data=!4m14!1m7!3m6!1s0x30e299293ebc3217:0xdb2ef36a28b04a9e!2zSmFlIFdhbiwgMTcwMCDguJbguJnguJkg4Lia4Lij4Lij4LiX4Lix4LiU4LiX4Lit4LiHIEtod2FlbmcgUm9uZyBNdWFuZywgS2hldCBQYXRodW0gV2FuLCBCYW5na29rIDEwMzMw!8m2!3d13.7396492!4d100.5222225!16s%2Fg%2F1ydxc43jr!3m5!1s0x30e299293ebc3217:0xdb2ef36a28b04a9e!8m2!3d13.7396492!4d100.5222225!16s%2Fg%2F1ydxc43jr"
              width="100%"
              height="450"
              allowFullScreen
              loading="lazy"
            />
          </TabsPanel>
          <TabsPanel value="chatgpt-planner">
            <ChatInterface />
          </TabsPanel>
        </Tabs>
      </Stack>
    </Container>
  );
}
