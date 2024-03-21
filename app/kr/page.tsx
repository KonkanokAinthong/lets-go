'use client';

import { Carousel } from '@mantine/carousel';
import { Avatar, Container, Grid, Image, Skeleton, Stack, Title } from '@mantine/core';
import axios from 'axios';
import Link from 'next/link';
import { useQuery } from 'react-query';

async function getTrendingKoreanCelebrities() {
  try {
    const response = await axios.get('/api/scrape?nationality=Korean');
    return response.data;
  } catch (error) {
    console.error(error);
    throw new Error('Failed to fetch data');
  }
}

const kcelebrities = [
  {
    name: 'Kim Seon Ho',
    image: 'https://www.themoviedb.org/t/p/w600_and_h900_bestv2/1p7xMHRNsrUJacXqOFs1EZqSIvp.jpg',
  },
  {
    name: 'Jackson Wang',
    image: 'https://www.themoviedb.org/t/p/w600_and_h900_bestv2/yPhD9nXzmOVA4IUyVsqv7ZzvTKX.jpg',
  },
  {
    name: 'Song Jung-gi',
    image: 'https://www.themoviedb.org/t/p/w600_and_h900_bestv2/kgjb5OppOVTh5tz3hhnfDVnTvDv.jpg',
  },
  {
    name: 'Kwan Na Ra',
    image: 'https://www.themoviedb.org/t/p/w600_and_h900_bestv2/4U0cNinwOf7DdsBYA3BFi7arDmz.jpg',
  },
  {
    name: 'Kim Jinyoung',
    image:
      'https://s359.kapook.com/r/600/auto/pagebuilder/a6250c2e-d0a4-4db1-a4e2-35354e4a586d.jpg',
  },
  {
    name: 'Bak Ji-hyo',
    image:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/Park_Jihyo_for_Pearly_Gates_Korea_02.jpg/480px-Park_Jihyo_for_Pearly_Gates_Korea_02.jpg',
  },
  {
    name: 'มินนี่',
    image:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/5/58/%28G%29I-DLE%27s_Minnie_on_June_2023.jpg/440px-%28G%29I-DLE%27s_Minnie_on_June_2023.jpg',
  },
  {
    name: 'Song-Ji-hun',
    image:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7f/140120_%ED%94%BC_%EB%81%93%EB%8A%94_%EC%B2%AD%EC%B6%98_vip%EC%8B%9C%EC%82%AC%ED%9A%8C-%EB%B9%84.jpg/440px-140120_%ED%94%BC_%EB%81%93%EB%8A%94_%EC%B2%AD%EC%B6%98_vip%EC%8B%9C%EC%82%AC%ED%9A%8C-%EB%B9%84.jpg',
  },
  {
    name: 'Baekho',
    image:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/180509_%EB%B0%B1%ED%98%B8_01.jpg/440px-180509_%EB%B0%B1%ED%98%B8_01.jpg',
  },
];

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
          {kcelebrities?.map((celebrity: any) => (
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
                <Avatar src={celebrity?.image} alt="test" size="124" />
                <Title order={6} ta="center">
                  <Link href={`/kr/celebrities/${celebrity.name}`}>{celebrity.name}</Link>
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
