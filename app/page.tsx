'use client';

import { Carousel } from '@mantine/carousel';
import {
  Box,
  Button,
  Card,
  Container,
  Divider,
  Grid,
  Image,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import axios from 'axios';
import Link from 'next/link';
import { useQuery } from 'react-query';

export const getCelebsNews = async () => {
  const response = await axios.get('/api/celebs-news');
  return response?.data.news ?? [];
};

export const getTop10Locations = async () => {
  const response = await axios.get('/api/top10-locations');
  console.log(response.data);
  return response?.data.locations ?? [];
};

export const CelebsNewsCarousel = () => {
  const { data: celebsNews } = useQuery('getCelebsNews', getCelebsNews);

  return (
    <Carousel align="center" withIndicators loop>
      {celebsNews?.map((news) => (
        <Carousel.Slide key={news.name} w="100%">
          <Card w="100%" h={300} style={{ position: 'relative' }}>
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
        </Carousel.Slide>
      ))}
    </Carousel>
  );
};

const SuperstarCheckInThailand = () => {
  const getRandomCelebsImages = async () => {
    const response = await axios.get('/api/recommended/celebrities?national=th');
    return response?.data.images ?? [];
  };
  const celebNearMeImage = getRandomCelebsImages();

  return (
    <section>
      <Grid justify="center" align="center" gutter="xl" p="lg">
        <Grid.Col span={{ base: 12, md: 6, lg: 3 }} p="md">
          <Stack justify="center" align="center">
            <Box href="near-me" component={Link}>
              <Image src={celebNearMeImage} alt="Celeb Near Me" />
            </Box>
            <Button size="lg" component={Link} href="/kr" variant="filled">
              Superstar nearby me
            </Button>
          </Stack>
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 6, lg: 3 }} p="md">
          <Stack justify="center" align="center">
            <Box href="kr" component={Link}>
              <Image src={getRandomCelebsImages()} alt="Random Image" />
            </Box>
            <Button size="lg" component={Link} href="/kr" variant="filled">
              South Korea
            </Button>
          </Stack>
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 6, lg: 3 }} p="md">
          <Stack justify="center" align="center">
            <Box href="cn" component={Link}>
              <Image src={getRandomCelebsImages()} alt="Random Image" />
            </Box>
            <Button size="lg" component={Link} href="/cn" variant="filled">
              China
            </Button>
          </Stack>
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 6, lg: 3 }} p="md">
          <Stack justify="center" align="center">
            <Box href="th" component={Link}>
              <Image src={getRandomCelebsImages()} alt="Random Image" />
            </Box>
            <Button size="lg" component={Link} href="/th" variant="filled">
              Thailand
            </Button>
          </Stack>
        </Grid.Col>
      </Grid>
    </section>
  );
};

const Top10Locations = () => {
  const { data: top10Locations } = useQuery('getTop10Locations', getTop10Locations);

  return (
    <section>
      <Grid columns={12} align="stretch">
        {top10Locations?.map((location, index) => (
          <Grid.Col key={location.title} span={{ xs: 12, sm: 6, md: 12 / 5 }}>
            <Card
              shadow="sm"
              radius="lg"
              p="xl"
              style={{ position: 'relative' }}
              component={Link}
              href={`/locations/${location.title}`}
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
          </Grid.Col>
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
