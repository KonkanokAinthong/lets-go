'use client';

import { Carousel, CarouselSlide } from '@mantine/carousel';
import {
  Box,
  Button,
  Card,
  Container,
  Divider,
  Grid,
  GridCol,
  Image,
  Skeleton,
  Stack,
  Text,
  Title,
} from '@mantine/core';

import Autoplay from 'embla-carousel-autoplay';
import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useQuery } from 'react-query';
import axios from 'axios';
import { FormattedMessage } from 'react-intl';
import { Map, Marker } from 'react-map-gl';
import CELEB_LISTS from '../celebs.json';

const API_ENDPOINTS = {
  celebsNews: '/api/celebs-news',
  top10Locations: '/api/top10-locations',
  searchCelebrity: (name: string) => `https://api.themoviedb.org/3/search/person?query=${name}`,
};

function formatNationality(nationality: string): string {
  switch (nationality?.toLowerCase()) {
    case 'chinese':
      return 'cn';
    case 'thai':
      return 'th';
    case 'korean':
      return 'kr';
    default:
      return '';
  }
}

const QUERY_KEYS = {
  celebsNews: 'getCelebsNews',
  top10Locations: 'getTop10Locations',
  trendingThaiCelebrities: 'trendingThaiCelebrities',
  trendingKoreanCelebrities: 'trendingKoreanCelebrities',
  trendingChineseCelebrities: 'trendingChineseCelebrities',
};

const getPlaceDetails = async (places: string[]) => {
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
              keyword: place,
            },
          }
        );
        return response.data.result.filter((result) => result.place_name === place);
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

const CelebsNewsCarousel = () => {
  const autoplay = useRef(Autoplay({ delay: 5000 }));
  const { data: celebsNews } = useQuery(
    QUERY_KEYS.celebsNews,
    async () => {
      const response = await fetch(API_ENDPOINTS.celebsNews);
      const data = await response.json();
      return data.news ?? [];
    },
    {
      refetchOnWindowFocus: false,
      staleTime: Infinity, // Data will be considered fresh as long as it exists
      cacheTime: 24 * 60 * 60 * 1000, // Cache data for 24 hours (in milliseconds)
    }
  );

  return (
    <Carousel
      align="center"
      withIndicators
      loop
      onMouseEnter={autoplay.current.stop}
      onMouseLeave={autoplay.current.reset}
      plugins={[autoplay.current]}
    >
      {celebsNews?.map((news) => (
        <CarouselSlide key={news.name} w="100%">
          <Card
            w="100%"
            h={300}
            style={{ position: 'relative' }}
            component={Link}
            href={news.link}
            rel="noreferrer"
            target="_blank"
          >
            <Stack dir="column" align="center" justify="center">
              <Image src={news.image} w="100%" h="100%" />
            </Stack>
            <Title
              order={3}
              c="white"
              style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                padding: 16,
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
              }}
            >
              {news.title}
            </Title>
          </Card>
        </CarouselSlide>
      ))}
    </Carousel>
  );
};

const searchCelebrities = async (celebList: typeof CELEB_LISTS) => {
  try {
    const promises = celebList.map(async (celeb) => {
      try {
        const response = await fetch(API_ENDPOINTS.searchCelebrity(celeb.name), {
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_TMDB_API_TOKEN}`,
          },
        });
        const data = await response.json();
        const tmdbCeleb = data.results[0];

        if (tmdbCeleb) {
          return {
            id: celeb.id, // Override the id with the value from celebs.json
            name: tmdbCeleb.name,
            profile_path: tmdbCeleb.profile_path,
          };
        }
        return null;
      } catch (error) {
        console.error(`Error fetching celebrity data for ${celeb.name}:`, error);
        return null;
      }
    });

    const results = await Promise.all(promises);
    return results.filter((result) => result !== null);
  } catch (error) {
    console.error('Error searching celebrities:', error);
    return [];
  }
};

const SuperstarCheckInThailand = () => {
  const [currentLocation, setCurrentLocation] = useState(null);
  const [nearestCeleb, setNearestCeleb] = useState(null);

  const fetchNearestCeleb = async () => {
    if (currentLocation) {
      const { lat, lng } = currentLocation;
      const response = await axios.get(`/api/nearest-celeb?lat=${lat}&lng=${lng}`);

      setNearestCeleb(response.data.celebs);
    }
  };

  const { data: thCelebrities, isLoading: isLoading_thCelebrities } = useQuery(
    QUERY_KEYS.trendingThaiCelebrities,
    () => searchCelebrities(CELEB_LISTS.filter((celeb) => celeb.nationality === 'Thai')),
    { refetchOnWindowFocus: false, staleTime: Infinity, cacheTime: 24 * 60 * 60 * 1000 }
  );

  const { data: krCelebrities, isLoading: isLoading_krCelebrities } = useQuery(
    QUERY_KEYS.trendingKoreanCelebrities,
    () => searchCelebrities(CELEB_LISTS.filter((celeb) => celeb.nationality === 'Korean')),
    { refetchOnWindowFocus: false, staleTime: Infinity, cacheTime: 24 * 60 * 60 * 1000 }
  );

  const { data: cnCelebrities, isLoading: isLoading_cnCelebrities } = useQuery(
    QUERY_KEYS.trendingChineseCelebrities,
    () => searchCelebrities(CELEB_LISTS.filter((celeb) => celeb.nationality === 'Chinese')),
    { refetchOnWindowFocus: false, staleTime: Infinity, cacheTime: 24 * 60 * 60 * 1000 }
  );

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCurrentLocation({ lat: latitude, lng: longitude });
        },
        (error) => {
          console.error('Error getting current location:', error);
        }
      );
    }
  }, []);

  useEffect(() => {
    fetchNearestCeleb();
  }, [currentLocation]);

  const getRandomCeleb = (region: 'th' | 'cn' | 'kr') => {
    const celebrities = {
      th: thCelebrities,
      kr: krCelebrities,
      cn: cnCelebrities,
    }[region];

    if (!celebrities || celebrities.length === 0) return null;

    const randomIndex = Math.floor(Math.random() * celebrities.length);
    return celebrities[randomIndex];
  };

  const { data: placeDetails } = useQuery(
    ['placeDetails', CELEB_LISTS],
    () => {
      const allPlaces = CELEB_LISTS?.flatMap((celeb) => celeb.placeVisited) || [];
      return getPlaceDetails(allPlaces);
    },
    {
      enabled: !!CELEB_LISTS,
      initialData: { places: [] },
    }
  );

  console.log(placeDetails);

  const bangkokLocation = { lat: 13.7563, lng: 100.5018 };

  const imageTH = getRandomCeleb('th');
  const imageCN = getRandomCeleb('cn');
  const imageKR = getRandomCeleb('kr');

  if (isLoading_thCelebrities || isLoading_krCelebrities || isLoading_cnCelebrities) {
    return (
      <div
        style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}
      >
        <FormattedMessage id="loading" />
      </div>
    );
  }

  return (
    <section>
      <Grid justify="center" align="center" gutter="xl" p="lg">
        <Grid.Col span={{ base: 12, md: 6, lg: 3 }} p="md">
          <Stack justify="center" align="center">
            {bangkokLocation ? (
              <Map
                initialViewState={{
                  longitude: bangkokLocation.lng,
                  latitude: bangkokLocation.lat,
                  zoom: 10,
                }}
                style={{ width: '100%', height: '400px', borderRadius: 8 }}
                mapStyle="mapbox://styles/mapbox/streets-v9"
                mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_API_TOKEN}
              >
                {placeDetails.places.map((place, index) => (
                  <Marker
                    key={index}
                    longitude={place?.longitude}
                    latitude={place?.latitude}
                    onClick={() => {
                      const destination = `${place?.latitude},${place?.longitude}`;
                      const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
                        destination
                      )}`;
                      window.open(googleMapsUrl, '_blank');
                    }}
                    style={{ cursor: 'pointer' }}
                  >
                    <div
                      style={{
                        position: 'relative',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                      }}
                    >
                      <div
                        style={{
                          position: 'absolute',
                          top: '50%',
                          left: '50%',
                          transform: 'translate(-50%, -50%)',
                          width: '64px',
                          height: '64px',
                          borderRadius: '50%',
                          backgroundColor: 'white',
                          border: '6px solid rgba(255, 106, 26, 1)',
                          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                          zIndex: -1,
                        }}
                      >
                        <img
                          src={CELEB_LISTS[index].image}
                          alt="Celebrity Avatar"
                          style={{
                            width: '100%',
                            height: '100%',
                            borderRadius: '50%',
                            objectFit: 'cover',
                          }}
                        />
                      </div>
                      <div
                        style={{
                          // width: 0,
                          // height: 0,
                          borderLeft: '20px solid transparent',
                          borderRight: '20px solid transparent',
                          borderTop: '30px solid rgba(255, 106, 26, 1)',
                          position: 'absolute',
                          top: '24px',
                        }}
                      />
                    </div>
                  </Marker>
                ))}
                {currentLocation && (
                  <Marker longitude={currentLocation.lng} latitude={currentLocation.lat} />
                )}
              </Map>
            ) : (
              <Skeleton height={400} width="100%" />
            )}
            <Button
              size="lg"
              component={Link}
              href={`${formatNationality(
                nearestCeleb?.[0]?.nationality
              )}/celebrities/${nearestCeleb?.[0].id}`}
              variant="default"
            >
              <FormattedMessage id="nearbySuperstars" />
            </Button>
          </Stack>
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 6, lg: 3 }} p="md">
          <Stack justify="center" align="center">
            {imageKR ? (
              <Box href={`kr/celebrities/${imageKR.id}`} component={Link}>
                <Image
                  src={`https://image.tmdb.org/t/p/w400${imageKR.profile_path}`}
                  height={400}
                  style={{
                    borderRadius: 8,
                  }}
                />
              </Box>
            ) : (
              <Skeleton height={400} width="100%" />
            )}
            <Button size="lg" component={Link} href="/kr" variant="default">
              <FormattedMessage id="southKorea" />
            </Button>
          </Stack>
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 6, lg: 3 }} p="md">
          <Stack justify="center" align="center">
            {imageCN ? (
              <Box href={`cn/celebrities/${imageCN.id}`} component={Link}>
                <Image
                  src={`https://image.tmdb.org/t/p/w400${imageCN.profile_path}`}
                  height={400}
                  style={{
                    borderRadius: 8,
                  }}
                />
              </Box>
            ) : (
              <Skeleton height={400} width="100%" />
            )}
            <Button size="lg" component={Link} href="/cn" variant="default">
              <FormattedMessage id="china" />
            </Button>
          </Stack>
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 6, lg: 3 }} p="md">
          <Stack justify="center" align="center">
            {imageTH ? (
              <Box href={`th/celebrities/${imageTH.id}`} component={Link}>
                <Image
                  src={`https://image.tmdb.org/t/p/w400${imageTH.profile_path}`}
                  alt="Thai Celebrity"
                  height={400}
                  style={{
                    borderRadius: 8,
                  }}
                />
              </Box>
            ) : (
              <Skeleton height={400} width="100%" />
            )}
            <Button size="lg" component={Link} href="/th" variant="default">
              <FormattedMessage id="thailand" />
            </Button>
          </Stack>
        </Grid.Col>
      </Grid>
    </section>
  );
};

const Top10Locations = () => {
  const { data: top10Locations, isLoading } = useQuery(
    QUERY_KEYS.top10Locations,
    async () => {
      const response = await fetch('/api/top10-locations');
      const data = await response.json();
      return data.locations ?? [];
    },
    {
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      cacheTime: 24 * 60 * 60 * 1000,
    }
  );

  const memoizedLocations = useMemo(() => top10Locations, [top10Locations]);

  if (isLoading) {
    return (
      <section>
        <Grid columns={12} align="stretch">
          {[...Array(10)].map((_, index) => (
            <GridCol key={index} span={{ xs: 12, sm: 6, md: 12 / 5 }}>
              <Card shadow="sm" radius="lg" p="xl">
                <Skeleton height={200} width="100%" />
                <Skeleton height={20} width="70%" mt="md" />
                <Skeleton height={20} width="50%" mt="sm" />
              </Card>
            </GridCol>
          ))}
        </Grid>
      </section>
    );
  }

  return (
    <section>
      <Grid columns={12} align="stretch">
        {memoizedLocations?.map((location, index) => (
          <GridCol key={location.title} span={{ xs: 12, sm: 6, md: 12 / 5 }}>
            <Card
              shadow="sm"
              radius="lg"
              p="xl"
              style={{ position: 'relative' }}
              component={Link}
              href={location.link}
              rel="noreferrer"
              target="_blank"
            >
              <Image src={location?.image} alt={location.title} />
              <Title
                order={3}
                c="white"
                style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  padding: 16,
                  backgroundColor: 'rgba(0, 0, 0, 0.5)',
                }}
              >
                <FormattedMessage
                  id="rank"
                  values={{
                    rank: index + 1,
                  }}
                />
              </Title>
              <Text size="md" c="black" lineClamp={3}>
                {location.title}
              </Text>
            </Card>
          </GridCol>
        ))}
      </Grid>
    </section>
  );
};

export default function Page() {
  return (
    <Container size="xl">
      <Stack gap="xl">
        <CelebsNewsCarousel />
        <Title order={1} ta="start" c="white">
          <FormattedMessage id="superstarCheckInThailand" />
        </Title>
        <SuperstarCheckInThailand />
        <Divider />
        <Box>
          <Title order={1} ta="left" c="white">
            <FormattedMessage id="top10Destinations" />
          </Title>
        </Box>
        <Divider />
        <Top10Locations />
      </Stack>
    </Container>
  );
}
