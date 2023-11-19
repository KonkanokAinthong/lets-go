'use client';

import { Carousel } from '@mantine/carousel';
import { Box, Container, Image, SimpleGrid, Stack, Title } from '@mantine/core';
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
    const response = await axios.get(
      'https://www.netflix.com/tudum/top10/_next/data/m3mpsocLHP8YPHzG-j91-/south-korea/tv.json'
    );
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
  // const { data: series, isLoading: isSeriesLoading } = useQuery(
  //   'recommendedKoreanSeries',
  //   getRecommendedKoreanSeries
  // );
  if (isTrendingLoading) {
    return <div>Loading...</div>;
  }
  return (
    <Container c="white">
      <Stack>
        <Title order={1} ta="center" c="white">
          Top Trending Korean Celebrities
        </Title>
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
              <Box w={200} h={200}>
                <Image src={celebrity.image} alt="test" w={200} h={200} />
              </Box>
              <Title order={3}>
                <Link href={`/kr/${celebrity.title}`}>{celebrity.title}</Link>
              </Title>
            </div>
          ))}
        </SimpleGrid>

        <section>
          <Stack my="xl">
            <Title order={1} mb="xl" ta="center" c="white">
              Recommended Korean Series
            </Title>
            {/* <Carousel
              withIndicators
              slideSize={{ base: '100%', sm: '50%', md: '25%' }}
              slideGap="md"
              loop
              align="center"
              slidesToScroll={4}
            >
              {series?.pageProps?.data?.weeklyTopTen?.map((serie: any) => (
                <Carousel.Slide key={serie.id}>
                  <Title order={3} ta="center">
                    <Image
                      src={series?.pageProps?.data?.weeklyBoxartUrls[serie.id]?.vertical}
                      alt="test"
                    />
                    <Link href={`/kr/${serie.showName}`}>{serie.showName}</Link>
                  </Title>
                </Carousel.Slide>
              ))}
            </Carousel> */}
          </Stack>
        </section>
      </Stack>
    </Container>
  );
}
