'use client';

import { Carousel } from '@mantine/carousel';
import { Avatar, Container, Grid, Image, Skeleton, Stack, Text, Title } from '@mantine/core';
import { IconCrown } from '@tabler/icons-react';
import axios from 'axios';
import Link from 'next/link';
import { FormattedMessage } from 'react-intl';
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

async function getCelebrityDetails(id: string) {
  try {
    const response = await axios.get(`/api/celebs/${id}`);
    return response.data;
  } catch (error) {
    console.error(error);
    throw new Error('Failed to fetch data');
  }
}

const mockSeries = [
  {
    title: 'The Legend of White Snake',
    image: 'https://www.themoviedb.org/t/p/w600_and_h900_bestv2/1ZYBRDnpgMcDI3h5ZovCRS2NJvX.jpg',
  },
  {
    title: 'Word of Honor',
    image: 'https://www.themoviedb.org/t/p/w600_and_h900_bestv2/op0ZXBZodAc12CVqEN55KxD0FYe.jpg',
  },
  {
    title: 'The Shiny Group',
    image: 'https://www.themoviedb.org/t/p/w600_and_h900_bestv2/rE6vK2eX04zEw35MOd6ykStz8CA.jpg',
  },
];

export default function Page() {
  const { data: celebs, isLoading: isTrendingLoading } = useQuery(
    'getTrendingThaiCelebrities',
    getTrendingThaiCelebrities
  );

  console.log(celebs);

  // Sort by popularity in descending order
  const sortedByPopularity = celebs?.map((f) => {
    const trendingSeries = f.trendingSeries;
    trendingSeries?.sort((a, b) => b.trendingPoint - a.trendingPoint); // Sort by trendingPoint descending
    return { ...f, trendingSeries };
  });

  const allSeries = sortedByPopularity?.map((f) => f?.trendingSeries).flat();

  const uniqueNames = Array.from(new Set(allSeries?.map((obj) => obj?.title)));

  const uniqueSeries = allSeries?.filter((obj) => uniqueNames?.includes(obj?.title));

  const mockSeries = [
    {
      title: 'Dark Blue Kiss',
      image: 'https://image.tmdb.org/t/p/w1280/ey2BZaCaJllWy7BGAw6J4zNfPK4.jpg',
    },
    {
      title: 'The Blue Hour',
      image: 'https://image.tmdb.org/t/p/w1280/beu6ezZZohhBxpADatVgEmxKXcb.jpg',
    },
    {
      title: 'Theory of Love',
      image: 'https://www.themoviedb.org/t/p/w600_and_h900_bestv2/rE6vK2eX04zEw35MOd6ykStz8CA.jpg',
    },
    {
      title: 'Not Me',
      image: 'https://image.tmdb.org/t/p/w1280/u55CWUrewbvR8PG3AGjIkgRB6u1.jpg',
    },
  ];

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
              <FormattedMessage id="topTrendingThaiCelebrities" />
            </Title>
            <Grid gutter={64} columns={24} justify="center" align="center">
              {celebs?.map((celebrity: any, index) => (
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
                      position: 'relative',
                    }}
                  >
                    {index === 0 && (
                      <IconCrown
                        size={64}
                        style={{
                          position: 'absolute',
                          top: -48,
                          zIndex: 1,
                          fill: 'gold',
                          stroke: 'gold',
                        }}
                      />
                    )}
                    <Avatar
                      size={124}
                      src={celebrity.image}
                      alt={celebrity.name}
                      component={Link}
                      href={`/th/celebrities/${celebrity?.id}`}
                    />
                    <div
                      style={{
                        position: 'absolute',
                        bottom: 40,
                        borderRadius: '50%',
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        padding: '4px 8px',
                      }}
                    >
                      <Text fw={700} fz="md" c="white">
                        #{index + 1}
                      </Text>
                    </div>
                    <Title order={6} ta="center">
                      <Link href={`/th/celebrities/${celebrity?.id}`}>
                        {index === 0 ? celebs[0]?.name : celebrity?.englishName}
                        <div>{celebrity?.thaiName}</div>
                      </Link>
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
              <FormattedMessage id="recommendedThaiSeries" />
            </Title>
            <Carousel
              slideSize={{ base: '100%', sm: '50%', md: '25%' }}
              slideGap="md"
              align="center"
              slidesToScroll="auto"
            >
              {mockSeries?.map((serie: any) => (
                <Carousel.Slide key={serie?.title}>
                  <Stack>
                    <Image src={serie?.image} alt={serie?.title} />
                    <Title order={6} ta="center">
                      {serie?.title}
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
