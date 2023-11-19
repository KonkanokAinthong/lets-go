import { Carousel, CarouselSlide } from '@mantine/carousel';
import { Box, Container, Image, SimpleGrid, Stack, Title } from '@mantine/core';
import Link from 'next/link';

async function getTrendingKoreanCelebrities() {
  const response = await fetch('http://localhost:3000/api/scrape', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    cache: 'no-store',
  });

  if (!response.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error('Failed to fetch data');
  }
  const data = await response.json();

  return data;
}

async function getRecommendedKoreanSeries() {
  const response = await fetch(
    'https://www.netflix.com/tudum/top10/_next/data/m3mpsocLHP8YPHzG-j91-/south-korea/tv.json',
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    }
  );

  if (!response.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error('Failed to fetch data');
  }
  const data = await response.json();

  return data;
}

export default async function Page() {
  const data = await getTrendingKoreanCelebrities();
  const series = await getRecommendedKoreanSeries();

  console.log(series);

  return (
    <Container c="white">
      <Stack>
        <Title order={1} ta="center" c="white">
          Top Trending Korean Celebrities
        </Title>
        <SimpleGrid cols={3}>
          {data?.trendingLists?.map((celebrity: any) => (
            <div
              key={celebrity.title}
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <Box w={200} h={200}>
                <Image src={celebrity.image} alt="test" w={200} h={200} />
              </Box>
              <Title order={3}>
                <Link href={`/kr/${celebrity.title}`}>{celebrity.title}</Link>
              </Title>
            </div>
          ))}
        </SimpleGrid>

        <section>
          <Stack my="xl">
            <Title order={1} mb="xl" ta="center" c="white">
              Recommended Korean Series
            </Title>
            <Carousel
              withIndicators
              slideSize={{ base: '100%', sm: '50%', md: '25%' }}
              slideGap="md"
              loop
              align="center"
              slidesToScroll={4}
            >
              {series?.pageProps?.data?.weeklyTopTen?.map((serie: any) => (
                <CarouselSlide key={serie.id}>
                  <Title order={3} ta="center">
                    <Image
                      src={series?.pageProps?.data?.weeklyBoxartUrls[serie.id]?.vertical}
                      alt="test"
                    />
                    <Link href={`/kr/${serie.showName}`}>{serie.showName}</Link>
                  </Title>
                </CarouselSlide>
              ))}
            </Carousel>
          </Stack>
        </section>
      </Stack>
    </Container>
  );
}
