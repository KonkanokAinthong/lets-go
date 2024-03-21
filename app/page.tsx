'use client';

import { Carousel } from '@mantine/carousel';
import {
  Box,
  Button,
  Card,
  Container,
  Divider,
  Grid,
  GridCol,
  Image,
  Stack,
  Text,
  Title,
} from '@mantine/core';

import axios from 'axios';
import Link from 'next/link';
import { useQuery } from 'react-query';

const getCelebsNews = async () => {
  const response = await axios.get('/api/celebs-news');

  return response?.data.news ?? [];
};

const getTop10Locations = async () => {
  const response = await axios.get('/api/top10-locations');

  return response?.data.locations ?? [];
};

export default function Page() {
  const { data: celebsNews } = useQuery('getCelebsNews', getCelebsNews);
  const { data: top10Locations } = useQuery('getTop10Locations', getTop10Locations);

  return (
    <Container size="xl">
      <Stack gap="xl">
        <section>
          <Carousel align="center" withIndicators loop>
            {celebsNews?.map((news) => (
              <Carousel.Slide w="100%">
                <Card
                  w="100%"
                  h={300}
                  key={news.name}
                  style={{
                    position: 'relative',
                  }}
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
              </Carousel.Slide>
            ))}
          </Carousel>
        </section>
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
                  <Box href="cn" component={Link} w={400} h={400}>
                    <Image
                      src="https://wallpapers.com/images/high/lalisa-manoban-for-mac-yxyymuu7q2mld0kz.webp"
                      alt="test"
                      w={400}
                      h={400}
                    />
                  </Box>
                  <Button size="lg" component={Link} href="/kr" variant="white" c="black">
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
                  <Box href="cn" component={Link} w={400} h={400}>
                    <Image
                      src="https://images.lifestyleasia.com/wp-content/uploads/sites/3/2022/12/14170608/jackson-wang-1600x900.jpeg?tr=w-1600"
                      alt="test"
                      w={400}
                      h={400}
                    />
                  </Box>

                  <Button size="lg" component={Link} href="/cn" variant="white" c="black">
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
                  <Box href="cn" component={Link} w={400} h={400}>
                    <Image
                      w={400}
                      h={400}
                      src="https://pbs.twimg.com/media/FI1KJB8X0AAI50K?format=jpg&name=large"
                      alt="test"
                    />
                  </Box>
                  <Button size="lg" component={Link} href="/th" variant="white" c="black">
                    Thailand
                  </Button>
                </Stack>
              </GridCol>
            </Grid>
          </Stack>
        </section>
        <Divider />

        <Box>
          <Title order={1} ta="left" c="white">
            Top 10 สถานที่ท่องเที่ยวยอดนิยม
          </Title>
        </Box>

        <Divider />
        <section>
          <Grid columns={12} align="stretch">
            {top10Locations?.map((location, index) => (
              <GridCol span={{ xs: 12, sm: 6, md: 12 / 5 }}>
                <Card
                  shadow="sm"
                  radius="lg"
                  p="xl"
                  style={{
                    position: 'relative',
                  }}
                >
                  <Image src={'https://picsum.photos/400/400'} alt={location.title} />
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
          {/* </Stack> */}
        </section>
      </Stack>
    </Container>
  );
}
