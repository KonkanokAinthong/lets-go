'use client';

import { Carousel } from '@mantine/carousel';
import { Avatar, Container, Grid, Image, SimpleGrid, Skeleton, Stack, Title } from '@mantine/core';
import axios from 'axios';
import { is } from 'cheerio/lib/api/traversing';
import Link from 'next/link';
import { useQuery } from 'react-query';

const TMDB_API_TOKEN =
  'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxNDg5YjUyNDg3MTdmZjY2NmY3NzhkNzE3NmVmYjdjZiIsInN1YiI6IjY1NTk5ZTI5ZWE4NGM3MTA5NmRmMjk2ZCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.e0lqhUBzvqt4L-OleXqsj8bx_p6yQK46wPabFdYFO1s';

const searchCelebrity = async (nameList: string[]) => {
  try {
    const promises = nameList.map(async (name) => {
      const response = await axios.get(`https://api.themoviedb.org/3/search/person?query=${name}`, {
        headers: {
          Authorization: `Bearer ${TMDB_API_TOKEN}`,
        },
      });
      return response.data.results[0];
    });

    const results = await Promise.all(promises);
    return results;
  } catch (error) {
    // Handle error appropriately
    console.error(error);
    return [];
  }
};

export default function Page() {
  // Thai Celebrities visited places in Thailand
  const thaiCelebs = [
    'Jumpol Adulkittiporn',
    'Atthaphan Phunsawat',
    'Tawan Vihokratana',
    'Thitipoom Techaapaikhun',
  ];

  const { data: celebrities, isLoading } = useQuery('trendingThaiCelebrities', () =>
    searchCelebrity(thaiCelebs)
  );

  // Sort by popularity in descending order
  const sortedByPopularity = celebrities?.map((f) => {
    const tvShows = f.known_for.filter((media) => media.media_type === 'tv');
    tvShows.sort((a, b) => b.popularity - a.popularity); // Sort by popularity descending
    return { ...f, known_for: tvShows };
  });

  const trendingSeries = sortedByPopularity?.map((f) => f?.known_for.map((item) => item)).flat();

  const uniqueNames = Array.from(new Set(trendingSeries?.map((obj) => obj?.name)));

  const uniqueSeries = trendingSeries?.filter((obj) => uniqueNames?.includes(obj?.name));

  console.log(uniqueSeries);

  if (isLoading) {
    return (
      <Container>
        <Stack>
          <Title order={1} ta="center" c="white">
            Top Trending Thai Celebrities
          </Title>
          <SimpleGrid
            cols={{
              xs: 12,
              md: 4,
            }}
          >
            {Array.from({ length: 12 }).map((_, index) => (
              <div
                key={index}
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <Skeleton key={index} circle w={150} h={150} />
              </div>
            ))}
          </SimpleGrid>
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
            <Grid>
              {celebrities?.map((celebrity: any) => (
                <Grid.Col
                  key={celebrity.name}
                  span={{
                    xs: 12,
                    md: 4,
                  }}
                >
                  <div
                    style={{
                      justifyContent: 'center',
                      alignItems: 'center',
                      display: 'flex',
                      flexDirection: 'column',
                    }}
                  >
                    <Stack>
                      <Avatar
                        size={150}
                        src={`https://image.tmdb.org/t/p/original/${celebrity.profile_path}`}
                        alt={celebrity.name}
                      />

                      <Title order={6} ta="center">
                        {celebrity.name}
                      </Title>
                    </Stack>
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
              loop
              align="center"
              slidesToScroll="auto"
            >
              {uniqueSeries?.map((serie: any) => (
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
              ))}
            </Carousel>
          </Stack>
        </section>
      </Stack>
    </Container>
  );
}
