'use client';

import { Carousel } from '@mantine/carousel';
import { Avatar, Box, Button, Container, Grid, GridCol, Image, Stack, Title } from '@mantine/core';

import axios from 'axios';
import Link from 'next/link';
import { useQuery } from 'react-query';

async function getRecommendedCelebrities() {
  const response = await axios.get('/api/scrape');

  return response?.data ?? [];
}

const NATIONALITY = {
  'South Korean': 'kr',
  Chinese: 'cn',
  Thai: 'th',
};

const mock = [
  {
    name: 'Kim Seon Ho',
    image: 'https://upload.wikimedia.org/wikipedia/commons/7/7e/Kim_Seonho_TEACHA0508.png',
    nationality: 'South Korean',
  },
  {
    name: 'Jackson Wang',
    image:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/4/45/Jackson_Wang_at_a_mini_fanmeeting_outside_%22Show%21_Music_Core%22_studios%2C_1_June_2019_02.jpg/440px-Jackson_Wang_at_a_mini_fanmeeting_outside_%22Show%21_Music_Core%22_studios%2C_1_June_2019_02.jpg',
    nationality: 'Chinese',
  },
  {
    name: 'Jumpol Adulkittiporn',
    image: 'https://image.tmdb.org/t/p/original//alCgpzXB50QWfck3KFlfzkRnXSW.jpg',
    nationality: 'Thai',
  },
  {
    name: 'Atthaphan Phunsawat',
    image: 'https://image.tmdb.org/t/p/original//uJ1THfL7y8tuWpCNpow6eoPIr27.jpg',
    nationality: 'Thai',
  },
  {
    name: 'Tawan Vihokratana',
    image: 'https://image.tmdb.org/t/p/original//3UvwJGTDRXVYjUfaiLQuk7vKqHR.jpg',
    nationality: 'Thai',
  },
];

export default function Page() {
  const { data: recommendedCelebrities } = useQuery(
    'recommendedCelebrities',
    getRecommendedCelebrities
  );

  console.log(recommendedCelebrities);
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
                  <Box w={400} h={400}>
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
                  <Box w={400} h={400}>
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
              {mock?.map((celebrity: any) => (
                <Carousel.Slide key={celebrity.name}>
                  <Stack justify="center" align="center">
                    <Avatar size={150} src={celebrity?.image} alt={celebrity?.name} />
                    <Title order={6} ta="center">
                      <Link
                        href={`/${
                          NATIONALITY[celebrity.nationality as keyof typeof NATIONALITY]
                        }/celebrities/${celebrity.name}`}
                      >
                        {celebrity.name}
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
