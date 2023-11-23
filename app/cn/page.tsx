'use client';

import { Carousel } from '@mantine/carousel';
import { Avatar, Container, Image, SimpleGrid, Stack, Text, Title } from '@mantine/core';
import axios from 'axios';
import Link from 'next/link';
import { useQuery } from 'react-query';

async function getTrendingChineseCelebrities() {
  const response = await axios.get('/api/trending/celebrities?nationality=Chinese');

  return response?.data.data ?? [];
}

async function getRecommendedChineseSeries() {
  const response = await axios.get('/api/recommended/series?nationality=Chinese Drama');

  return response.data ?? [];
}

export default function Page() {
  const { data: celebrities } = useQuery(
    'trendingChineseCelebrities',
    getTrendingChineseCelebrities
  );

  console.log(celebrities);

  const { data: series } = useQuery('recommendedChineseSeries', getRecommendedChineseSeries);

  console.log(series);

  return (
    <Container c="white">
      <Stack>
        <Title order={1} ta="center" c="white">
          Top Trending Chinese Celebrities
        </Title>
        <SimpleGrid
          cols={{
            xs: 12,
            md: 4,
          }}
        >
          {/* {filteredLists?.map((celebrity: any) => (
            <div
              key={celebrity.title}
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <Avatar size={150} src={celebrity.image} alt={celebrity.title} />

              <Title order={3}>
                <Link href={`/cn/celebrities/${celebrity.title}`}>{celebrity.title}</Link>
              </Title>
            </div>
          ))} */}
        </SimpleGrid>

        <section>
          <Stack my="xl">
            <Title order={1} mb="xl" ta="center" c="white">
              Recommended Chinese Series
            </Title>
            <Carousel
              slideSize={{ base: '100%', sm: '50%', md: '25%' }}
              slideGap="md"
              loop
              slidesToScroll={4}
            >
              {/* {series?.map((serie: any) => (
                <Carousel.Slide key={serie.title}>
                  <Title order={3} ta="center">
                    <Image src={serie?.image} alt={serie?.title} />
                    <Link href={`/cn/series/${serie.title}`}>{serie.title}</Link>
                    <Text size="xs">{serie.description}</Text>
                  </Title>
                </Carousel.Slide>
              ))} */}
            </Carousel>
          </Stack>
        </section>
      </Stack>
    </Container>
  );
}
