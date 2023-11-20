'use client';

import { Carousel } from '@mantine/carousel';
import {
  Avatar,
  Box,
  Button,
  Container,
  Grid,
  GridCol,
  Image,
  Loader,
  Stack,
  Title,
} from '@mantine/core';

import axios from 'axios';
import Link from 'next/link';
import { useQuery } from 'react-query';

async function getTrendingCelebrities() {
  try {
    const response = await axios.get('/api/trending/celebrities');
    return response.data;
  } catch (error) {
    console.error(error);
    throw new Error('Failed to fetch data');
  }
}

const NATIONALITY = {
  'South Korean': 'kr',
  Chinese: 'cn',
  Thai: 'th',
};

export default function HomePage() {
  const { data: trending, isLoading: isTrendingLoading } = useQuery(
    'trendingCelebrities',
    getTrendingCelebrities
  );

  console.log(trending);

  if (isTrendingLoading) {
    return <Loader />;
  }

  return (
    <Container size="xl">
      <Stack gap="xl">
        <Title order={1} ta="center" c="white">
          Superstar Check in Thailand
        </Title>
        <section>
          <Stack>
            <Grid justify="center" align="center">
              <GridCol
                span={{
                  xs: 12,
                  md: 4,
                }}
              >
                <Stack justify="center" align="center">
                  <Box w={400} h={400}>
                    <Image
                      src="https://wallpapers.com/images/high/lalisa-manoban-for-mac-yxyymuu7q2mld0kz.webp"
                      alt="test"
                      w={400}
                      h={400}
                    />
                  </Box>
                  <Button size="lg" component={Link} href="/kr">
                    South Korea
                  </Button>
                </Stack>
              </GridCol>
              <GridCol
                span={{
                  xs: 12,
                  md: 4,
                }}
              >
                <Stack justify="center" align="center">
                  <Box w={400} h={400}>
                    <Image
                      src="https://images.lifestyleasia.com/wp-content/uploads/sites/3/2022/12/14170608/jackson-wang-1600x900.jpeg?tr=w-1600"
                      alt="test"
                      w={400}
                      h={400}
                    />
                  </Box>

                  <Button size="lg" component={Link} href="/cn">
                    China
                  </Button>
                </Stack>
              </GridCol>
              <GridCol
                span={{
                  xs: 12,
                  md: 4,
                }}
              >
                <Stack justify="center" align="center">
                  <Box w={400} h={400}>
                    <Image
                      w={400}
                      h={400}
                      src="https://pbs.twimg.com/media/FI1KJB8X0AAI50K?format=jpg&name=large"
                      alt="test"
                    />
                  </Box>
                  <Button size="lg" component={Link} href="/th">
                    Thailand
                  </Button>
                </Stack>
              </GridCol>
            </Grid>
          </Stack>
        </section>
        <section>
          <Stack>
            <Title order={1} mb="xl" ta="center" c="white">
              Recommended Celebrities
            </Title>
            <Carousel
              slideSize={{ base: '100%', sm: '50%', md: '25%' }}
              slideGap="md"
              loop
              align="center"
              slidesToScroll={4}
            >
              {trending?.trendingLists?.map((celebrity: any) => (
                <Carousel.Slide key={celebrity.title}>
                  <Stack justify="center" align="center">
                    <Avatar size={150} src={celebrity?.image} alt={celebrity?.title} />
                    <Title order={3} ta="center">
                      <Link
                        href={`/${
                          NATIONALITY[celebrity.nationality as keyof typeof NATIONALITY]
                        }/celebrities/${celebrity.title}`}
                      >
                        {celebrity.title}
                      </Link>
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
