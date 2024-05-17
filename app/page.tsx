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
  Loader,
  Skeleton,
  Stack,
  Text,
  Title,
} from '@mantine/core';

import Autoplay from 'embla-carousel-autoplay';
import Link from 'next/link';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useQuery } from 'react-query';
import axios from 'axios';
import { FormattedMessage } from 'react-intl';
import { Map, Marker } from 'react-map-gl';
import CELEB_LISTS from '../celebs.json';
import 'mapbox-gl/dist/mapbox-gl.css';

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
  const [map, setMap] = useState(null);
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
      staleTime: Infinity,
      cacheTime: 24 * 60 * 60 * 1000,
    }
  );

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
                    longitude={place?.geometry?.location?.lng}
                    latitude={place?.geometry?.location?.lat}
                    style={{ zIndex: 10, cursor: 'pointer', height: 20 }}
                  >
                    <img
                      src={`${nearestCeleb?.[index]?.image}`}
                      alt="Celebrity"
                      style={{ width: '40px', height: '40px', borderRadius: '50%' }}
                    />
                  </Marker>
                ))}
                {currentLocation && (
                  <Marker longitude={currentLocation.lng} latitude={currentLocation.lat}>
                    <div
                      style={{
                        width: '10px',
                        height: '10px',
                        backgroundColor: 'blue',
                        borderRadius: '50%',
                      }}
                    />
                  </Marker>
                )}
              </Map>
            ) : (
              <Skeleton height={400} width="100%" />
            )}
            <Button
              size="lg"
              component={Link}
              href={`${formatNationality(
                nearestCeleb?.nationality
              )}/celebrities/${nearestCeleb?.id}`}
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
