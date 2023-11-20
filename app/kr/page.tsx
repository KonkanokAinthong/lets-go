'use client';

import { Carousel } from '@mantine/carousel';
import { Avatar, Container, Image, SimpleGrid, Skeleton, Stack, Text, Title } from '@mantine/core';
import axios from 'axios';
import Link from 'next/link';
import { useQuery } from 'react-query';

async function getTrendingKoreanCelebrities() {
  try {
    const response = await axios.get('http://localhost:3000/api/scrape');
    return response.data;
  } catch (error) {
    console.error(error);
    throw new Error('Failed to fetch data');
  }
}

async function getRecommendedKoreanSeries() {
  try {
    const response = await axios.get('/api/recommended/series?nationality=Korean Drama');
    return response.data;
  } catch (error) {
    console.error(error);
    throw new Error('Failed to fetch data');
  }
}

export default function Page() {
  const { data: trending, isLoading: isTrendingLoading } = useQuery(
    'trendingKoreanCelebrities',
    getTrendingKoreanCelebrities
  );
  const { data: series, isLoading: isSeriesLoading } = useQuery(
    'recommendedKoreanSeries',
    getRecommendedKoreanSeries
  );

  if (isTrendingLoading || isSeriesLoading) {
    return (
      <Container>
        <Stack>
          <SimpleGrid
            cols={{
              xs: 12,
              md: 3,
            }}
          >
            {Array.from({ length: 12 }).map((_, index) => (
              <div
                key={index}
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <Skeleton key={index} w={200} h={200} />
              </div>
            ))}
          </SimpleGrid>
        </Stack>
      </Container>
    );
  }
  return (
    <Container c="white">
      <Stack>
        <Title order={1} ta="center" c="white">
          Top Trending Korean Celebrities
        </Title>
        <div>
          <SimpleGrid
            cols={{
              xs: 12,
              md: 3,
            }}
          >
            {trending?.trendingLists?.map((celebrity: any) => (
              <div
                key={celebrity.title}
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <Avatar src={celebrity.image} alt="test" size={150} />
                <Title order={3}>
                  <Link href={`/kr/${celebrity.title}`}>{celebrity.title}</Link>
                </Title>
              </div>
            ))}
          </SimpleGrid>
        </div>

        <section>
          <Stack my="xl">
            <Title order={1} mb="xl" ta="center" c="white">
              Recommended Korean Series
            </Title>
            <Carousel
              slideSize={{ base: '100%', sm: '50%', md: '25%' }}
              slideGap="md"
              loop
              align="center"
              slidesToScroll={4}
            >
              {series.map((serie: any) => (
                <Carousel.Slide key={serie.title}>
                  <Title order={3} ta="center">
                    <Image src={serie?.image} alt={serie?.title} />
                    <Link href={`/kr/series/${serie.title}`}>{serie.title}</Link>
                    <Text size="xs">{serie.description}</Text>
                  </Title>
                </Carousel.Slide>
              ))}
            </Carousel>
          </Stack>
        </section>
      </Stack>
    </Container>
  );
}
