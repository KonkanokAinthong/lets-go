'use client';

import { Carousel } from '@mantine/carousel';
import { Avatar, Container, SimpleGrid, Stack, Title } from '@mantine/core';
import axios from 'axios';
import Link from 'next/link';
import { useQuery } from 'react-query';

async function getTrendingThaiCelebrities() {
  const response = await axios.get('/api/trending/celebrities?nationality=Thai');
  return response?.data?.filteredLists ?? [];
}

export default function Page() {
  const { data: filteredLists } = useQuery('trendingThaiCelebrities', getTrendingThaiCelebrities);

  return (
    <Container c="white">
      <Stack>
        <Title order={1} ta="center" c="white">
          Top Trending Thai Celebrities
        </Title>
        <SimpleGrid cols={3}>
          {filteredLists?.map((celebrity: any) => (
            <div
              key={celebrity.title}
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <Avatar src={celebrity.image} alt={celebrity.title} size={150} />
              <Title order={3} ta="center">
                <Link href={`/th/${celebrity.title}`}>{celebrity.title}</Link>
              </Title>
            </div>
          ))}
        </SimpleGrid>

        <section>
          <Stack my="xl">
            <Title order={1} mb="xl" ta="center" c="white">
              Recommended Thai Series
            </Title>
            <Carousel
              withIndicators
              slideSize={{ base: '100%', sm: '50%', md: '25%' }}
              slideGap="md"
              loop
              align="center"
              slidesToScroll={4}
            >
              {/* {series?.pageProps?.data?.weeklyTopTen?.map((serie: any) => (
                <CarouselSlide key={serie.id}>
                  <Title order={3} ta="center">
                    <Image
                      src={series?.pageProps?.data?.weeklyBoxartUrls[serie.id]?.vertical}
                      alt="test"
                    />
                    <Link href={`/kr/${serie.showName}`}>{serie.showName}</Link>
                  </Title>
                </CarouselSlide>
              ))} */}
            </Carousel>
          </Stack>
        </section>
      </Stack>
    </Container>
  );
}
