'use client';

import { Carousel } from '@mantine/carousel';
import { Avatar, Container, Grid, Image, Skeleton, Stack, Title } from '@mantine/core';
import axios from 'axios';
import Link from 'next/link';
import { useQuery } from 'react-query';

async function getTrendingKoreanCelebrities() {
  try {
    const response = await axios.get('/api/trending-celebs?nationality=Korean');

    return response.data;
  } catch (error) {
    console.error(error);
    throw new Error('Failed to fetch data');
  }
}

const kdramaRecommendations = [
  {
    actor: 'Kim Seon Ho',
    series: [
      {
        title: 'Start-Up',
        posterImage:
          'https://www.themoviedb.org/t/p/w600_and_h900_bestv2/hxJQ3A2wtreuWDnVBbzzXI3YlOE.jpg',
      },
    ],
  },
  {
    actor: 'Song Jung-gi',
    series: [
      {
        title: 'Vincenzo',
        posterImage:
          'https://www.themoviedb.org/t/p/w600_and_h900_bestv2/dvXJgEDQXhL9Ouot2WkBHpQiHGd.jpg',
      },
    ],
  },
  {
    actor: 'Kwan Na Ra',
    series: [
      {
        title: 'Itaewon Class',
        posterImage:
          'https://www.themoviedb.org/t/p/w600_and_h900_bestv2/qg7q0piY0fTt2enlIRHwKKRwNjS.jpg',
      },
    ],
  },
];

export default function Page() {
  const { data: celebs, isLoading: isTrendingLoading } = useQuery(
    'trendingKoreanCelebrities',
    getTrendingKoreanCelebrities
  );

  if (isTrendingLoading) {
    return (
      <Container size="xl" c="white">
        <Stack>
          <Title order={1} ta="center" c="white">
            Top Trending Korean Celebrities
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
    <Container size="xl" c="white">
      <Stack justify="center" align="center">
        <Title order={1} mb={48} ta="center" c="white">
          Top Trending Korean Celebrities
        </Title>

        <Grid gutter={64} columns={24} justify="center" align="center">
          {celebs?.map((celebrity: any) => (
            <Grid.Col
              key={celebrity?.name}
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
                <Avatar src={celebrity?.image} alt="test" size="124" />
                <Title order={6} ta="center">
                  <Link href={`/kr/celebrities/${celebrity?.id}`}>{celebrity?.name}</Link>
                </Title>
              </div>
            </Grid.Col>
          ))}
        </Grid>

        <section>
          <Stack my="xl">
            <Title order={1} mb="xl" ta="center" c="white">
              Recommended Korean Series
            </Title>
            <Carousel
              slideSize={{ base: '100%', sm: '50%', md: '25%' }}
              slideGap="md"
              align="center"
              slidesToScroll="auto"
            >
              {kdramaRecommendations.map((serie: any) => (
                <Carousel.Slide key={serie.series[0]?.title}>
                  <Stack>
                    <Image src={serie.series[0]?.posterImage} alt={serie.series[0]?.title} />
                    <Title order={6} ta="center">
                      {serie.series[0]?.title}
                    </Title>
                  </Stack>
                </Carousel.Slide>
              ))}
            </Carousel>
          </Stack>
        </section>
      </Stack>
    </Container>
  );
}
