'use client';

import { Carousel } from '@mantine/carousel';
import { Avatar, Container, Grid, Image, Skeleton, Stack, Title } from '@mantine/core';
import axios from 'axios';
import Link from 'next/link';
import { useQuery } from 'react-query';

async function getTrendingChineseCelebrities() {
  try {
    const response = await axios.get('/api/trending-celebs?nationality=Chinese');

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
  const { data: celebrities, isLoading } = useQuery(
    'trendingChineseCelebrities',
    getTrendingChineseCelebrities
  );

  if (isLoading) {
    return (
      <Container size="xl" c="white">
        <Stack>
          <Title order={1} ta="center" c="white">
            Top Trending Chinese Celebrities
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
      <Stack>
        <Title order={1} ta="center" c="white">
          Top Trending Chinese Celebrities
        </Title>
        <Grid gutter={64} columns={24} align="center" justify="center">
          {celebrities?.map((celebrity: any) => (
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
                <Avatar
                  src={celebrity?.image}
                  alt="test"
                  size="124"
                  component={Link}
                  href={`/cn/celebrities/${celebrity?.id}`}
                />
                <Title order={6} ta="center">
                  <Link href={`/cn/celebrities/${celebrity?.id}`}>{celebrity?.name}</Link>
                </Title>
              </div>
            </Grid.Col>
          ))}
        </Grid>

        <section>
          <Stack my="xl">
            <Title order={1} mb="xl" ta="center" c="white">
              Recommended Chinese Series
            </Title>
            <Carousel
              slideSize={{ base: '100%', sm: '50%', md: '25%' }}
              slideGap="md"
              align="center"
              slidesToScroll="auto"
            >
              {mockSeries?.map((serie: any) => (
                <Carousel.Slide key={serie.title}>
                  <Stack>
                    <Image src={serie?.image} alt={serie?.title} />
                    <Title order={6} ta="center">
                      {serie.title}
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
