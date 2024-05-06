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
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';
import axios from 'axios';
import Autoplay from 'embla-carousel-autoplay';
import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useQuery } from 'react-query';

const API_ENDPOINTS = {
  celebsNews: '/api/celebs-news',
  top10Locations: '/api/top10-locations',
  searchCelebrity: (name: string) => `https://api.themoviedb.org/3/search/person?query=${name}`,
};

const QUERY_KEYS = {
  celebsNews: 'getCelebsNews',
  top10Locations: 'getTop10Locations',
  trendingThaiCelebrities: 'trendingThaiCelebrities',
  trendingKoreanCelebrities: 'trendingKoreanCelebrities',
  trendingChineseCelebrities: 'trendingChineseCelebrities',
};

const CELEB_LISTS = {
  thai: [
    'Jumpol Adulkittiporn',
    'Atthaphan Phunsawat',
    'Tawan Vihokratana',
    'Thitipoom Techaapaikhun',
    'Ranee Campen',
    'Nadech Kugimiya',
    'Urassaya Sperbund',
    'Prin Suparat',
    'Davika Hoorne',
    'Kimberly Ann Voltemas',
  ],
  korean: [
    'Kim Seon Ho',
    'Jackson Wang',
    'Song Jung-gi',
    'Kwan Na Ra',
    'Kim Jinyoung',
    'Bak Ji-hyo',
    'Minnie',
    'Song-Ji-hun',
    'Baekho',
    'Kunpimook Bhuwakul',
  ],
  chinese: [
    'Ju Jingyi',
    'Cheng Xiao',
    'Li Kaixin',
    'Yang Yang',
    'Gong Jun',
    'Yang Yang',
    'Pornnappan Pornpenpipat',
  ],
};

const CelebsNewsCarousel = () => {
  const autoplay = useRef(Autoplay({ delay: 5000 }));
  const { data: celebsNews } = useQuery(
    QUERY_KEYS.celebsNews,
    async () => {
      const response = await axios.get(API_ENDPOINTS.celebsNews);
      return response?.data.news ?? [];
    },
    {
      cacheTime: 5 * 60 * 1000,
      staleTime: 2 * 60 * 1000,
      refetchOnWindowFocus: false,
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

const searchCelebrities = async (nameList: string[]) => {
  try {
    const promises = nameList.map((name) =>
      axios.get(API_ENDPOINTS.searchCelebrity(name), {
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_TMDB_API_TOKEN}`,
        },
      })
    );

    const responses = await Promise.all(promises);

    return responses.map((response) => response.data.results[0] ?? null);
  } catch (error) {
    console.error(error);
    return [];
  }
};

const SuperstarCheckInThailand = () => {
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: 'AIzaSyABkNqq2Rnxn7v-unsUUtVfNaPFcufrlbU',
  });
  const [map, setMap] = useState(null);
  const [currentLocation, setCurrentLocation] = useState(null);

  const { data: thCelebrities } = useQuery(
    QUERY_KEYS.trendingThaiCelebrities,
    () => searchCelebrities(CELEB_LISTS.thai),
    { refetchOnWindowFocus: false, initialData: [] }
  );

  console.log(thCelebrities);

  const { data: krCelebrities } = useQuery(
    QUERY_KEYS.trendingKoreanCelebrities,
    () => searchCelebrities(CELEB_LISTS.korean),
    { refetchOnWindowFocus: false, initialData: [] }
  );

  const { data: cnCelebrities } = useQuery(
    QUERY_KEYS.trendingChineseCelebrities,
    () => searchCelebrities(CELEB_LISTS.chinese),
    { refetchOnWindowFocus: false, initialData: [] }
  );

  const onLoad = useCallback((map) => {
    setMap(map);
  }, []);

  const onUnmount = useCallback((map) => {
    setMap(null);
  }, []);

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

  const getRandomCeleb = (region: 'th' | 'cn' | 'kr') => {
    if (!thCelebrities || !krCelebrities || !cnCelebrities) return null;
    const celebrities = {
      th: thCelebrities,
      kr: krCelebrities,
      cn: cnCelebrities,
    }[region];

    const validCelebrities = celebrities?.filter(Boolean) ?? [];
    const randomIndex = Math.floor(Math.random() * validCelebrities.length);
    return validCelebrities[randomIndex];
  };

  const imageTH = getRandomCeleb('th');
  const imageCN = getRandomCeleb('cn');
  const imageKR = getRandomCeleb('kr');

  if (loadError) return 'Error loading maps';
  if (!isLoaded) return 'Loading Maps';

  return (
    <section>
      <Grid justify="center" align="center" gutter="xl" p="lg">
        <Grid.Col span={{ base: 12, md: 6, lg: 3 }} p="md">
          <Stack justify="center" align="center">
            {currentLocation && (
              <GoogleMap
                mapContainerStyle={{ width: '100%', height: '400px' }}
                center={currentLocation}
                zoom={10}
                onLoad={onLoad}
                onUnmount={onUnmount}
              >
                <Marker position={currentLocation} />
              </GoogleMap>
            )}
            <Button size="lg" component={Link} href="/kr" variant="default">
              Superstar nearby me
            </Button>
          </Stack>
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 6, lg: 3 }} p="md">
          <Stack justify="center" align="center">
            <Box href={`kr/celebrities/${imageKR?.name}`} component={Link}>
              <Image src={`https://image.tmdb.org/t/p/w400${imageKR?.profile_path}`} height={400} />
            </Box>
            <Button size="lg" component={Link} href="/kr" variant="default">
              South Korea
            </Button>
          </Stack>
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 6, lg: 3 }} p="md">
          <Stack justify="center" align="center">
            <Box href={`cn/${imageCN?.name}`} component={Link}>
              <Image src={`https://image.tmdb.org/t/p/w400${imageCN?.profile_path}`} height={400} />
            </Box>
            <Button size="lg" component={Link} href="/cn" variant="default">
              China
            </Button>
          </Stack>
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 6, lg: 3 }} p="md">
          <Stack justify="center" align="center">
            <Box href={`th/${imageTH?.name}`} component={Link}>
              <Image
                src={`https://image.tmdb.org/t/p/w400${imageTH?.profile_path}`}
                alt="Thai Celebrity"
                height={400}
              />
            </Box>
            <Button size="lg" component={Link} href="/th" variant="default">
              Thailand
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
      const response = await axios.get(API_ENDPOINTS.top10Locations);
      return response?.data.locations ?? [];
    },
    {
      cacheTime: 10 * 60 * 1000,
      staleTime: 5 * 60 * 1000,
      refetchOnWindowFocus: false,
    }
  );

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
        {top10Locations?.map((location, index) => (
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
                อันดับ {index + 1}
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
          Superstar Check in Thailand
        </Title>
        <SuperstarCheckInThailand />
        <Divider />
        <Box>
          <Title order={1} ta="left" c="white">
            Top 10 tourist destinations
          </Title>
        </Box>
        <Divider />
        <Top10Locations />
      </Stack>
    </Container>
  );
}
