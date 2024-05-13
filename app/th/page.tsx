'use client';

import { Carousel } from '@mantine/carousel';
import { Avatar, Container, Grid, Image, Skeleton, Stack, Title } from '@mantine/core';
import axios from 'axios';
import Link from 'next/link';
import { useQuery } from 'react-query';

async function getTrendingThaiCelebrities() {
  try {
    const response = await axios.get('/api/trending-celebs?nationality=Thai');

    return response.data;
  } catch (error) {
    console.error(error);
    throw new Error('Failed to fetch data');
  }
}

export default function Page() {
  const { data: celebs, isLoading: isTrendingLoading } = useQuery(
    'trendingKoreanCelebrities',
    getTrendingThaiCelebrities
  );

  // // Sort by popularity in descending order
  // const sortedByPopularity = celebs?.map((f) => {
  //   const tvShows = f.known_for.filter((media) => media.media_type === 'tv');
  //   tvShows.sort((a, b) => b.popularity - a.popularity); // Sort by popularity descending
  //   return { ...f, known_for: tvShows };
  // });

  // const trendingSeries = sortedByPopularity?.map((f) => f?.known_for.map((item) => item)).flat();

  // const uniqueNames = Array.from(new Set(trendingSeries?.map((obj) => obj?.name)));

  // const uniqueSeries = trendingSeries?.filter((obj) => uniqueNames?.includes(obj?.name));

  if (isTrendingLoading) {
    return (
      <Container size="xl">
        <Stack>
          <Title order={1} ta="center" c="white">
            Top Trending Thai Celebrities
          </Title>
          <Grid columns={24} gutter={64} justify="center" align="center">
            {Array.from({ length: 12 }).map((_, index) => (
              <Grid.Col
                span={{
                  xs: 12,
                  md: 8,
                }}
              >
                <div
                  key={index}
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  <Skeleton key={index} circle w={124} h={124} />
                </div>
              </Grid.Col>
            ))}
          </Grid>
        </Stack>
      </Container>
    );
  }

  return (
    <Container c="white">
      <Stack>
        <section>
          <Stack>
            <Title order={1} ta="center" c="white">
              Top Trending Thai Celebrities
            </Title>
            <Grid gutter={64} columns={24} justify="center" align="center">
              {celebs?.map((celebrity: any) => (
                <Grid.Col
                  key={celebrity.name}
                  span={{
                    xs: 12,
                    md: 8,
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      alignItems: 'center',
                      gap: 16,
                    }}
                  >
                    <Avatar
                      size={124}
                      src={`https://image.tmdb.org/t/p/original/${celebrity.image}`}
                      alt={celebrity.name}
                      component={Link}
                      href={`/th/celebrities/${celebrity?.id}`}
                    />
                    <Title order={6} ta="center">
                      <Link href={`/th/celebrities/${celebrity.id}`}>{celebrity.name}</Link>
                    </Title>
                  </div>
                </Grid.Col>
              ))}
            </Grid>
          </Stack>
        </section>

        <section>
          <Stack my="xl">
            <Title order={1} mb="xl" ta="center" c="white">
              Recommended Thai Series
            </Title>
            <Carousel
              slideSize={{ base: '100%', sm: '50%', md: '25%' }}
              slideGap="md"
              align="center"
              slidesToScroll="auto"
            >
              {/* {uniqueSeries?.map((serie: any) => (
                <Carousel.Slide key={serie.name}>
                  <Stack>
                    <Image
                      src={`https://image.tmdb.org/t/p/original/${serie.poster_path}`}
                      alt={serie.name}
                    />
                    <Title order={6} ta="center">
                      {serie.name}
                    </Title>
                  </Stack>
                </Carousel.Slide>
              ))} */}
            </Carousel>
          </Stack>
        </section>
      </Stack>
    </Container>
  );
}
