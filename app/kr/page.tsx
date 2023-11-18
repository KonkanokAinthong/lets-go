import { Carousel, CarouselSlide } from '@mantine/carousel';
import { Box, Container, Grid, GridCol, Image, Stack, Text, Title } from '@mantine/core';
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

export default async function Page() {
  const data = await getTrendingKoreanCelebrities();

  console.log(data);

  return (
    <Container c="white">
      <Stack>
        <Title order={1} ta="center" c="white">
          Top 5 Trending Korean
        </Title>
        <Grid gutter="xl">
          {data?.trendingList?.map((celebrity: any) => (
            <GridCol span={4}>
              <Stack justify="center" align="center" ta="center">
                <Box w={200} h={200}>
                  <Image src={celebrity.image} alt="test" w={200} h={200} />
                </Box>
                <Title order={3}>
                  <Link href="/">{celebrity.title}</Link>
                </Title>
              </Stack>
            </GridCol>
          ))}
        </Grid>
        <section>
          <Stack my="xl">
            <Title order={1} mb="xl" ta="center" c="white">
              Recommended Korean Series
            </Title>
            <Carousel
              withIndicators
              height={500}
              slideSize={{ base: '100%', sm: '50%', md: '25%' }}
              slideGap="md"
              loop
              align="center"
              slidesToScroll={4}
            >
              <CarouselSlide>
                <Image
                  src="https://occ-0-7166-92.1.nflxso.net/dnm/api/v6/WNk1mr9x_Cd_2itp6pUM7-lXMJg/AAAABTGDHL1pevsw-uMEJ2Z7YWpZXw4T97TcmVFwRgl4m0uc8Vgut7DgGKAZOoL6bH7s7owTlVeNtiOLcyUZdu7bb2PuCp8DReh5qSe2PgWaIpIEtP2yDvNgsALxWiPDsMFCmDpxS4m2F6dsKW_fTcLxGNJuH_e2M42m2FkbemmzYJbIX0c-tVV7mkqdQ6vFJ940vIBdekxctWnS2M_Kayl0hCtJqb2Pgsf5Tt-mdp0sZHWuzWDRxMW7dJGiuiVAH7WESLPkK-6n87QHgozGlj9mgcsD291aQS7CcnaHJTrIYSC9l88XEt0Z3Fypew.jpg"
                  alt="test"
                />
                <Title order={3} ta="center" c="white">
                  Doona!
                </Title>
              </CarouselSlide>
              <CarouselSlide>
                <Image src="https://i.mydramalist.com/pdK54b_4f.jpg" alt="test" />
                <Title order={3} ta="center" c="white">
                  The name in my heart
                </Title>
              </CarouselSlide>
              <CarouselSlide>
                <Image
                  src="https://www.gmm25.com/2016/upload_2020/images/212005012035288.jpg"
                  alt="test"
                />
                <Title order={3} ta="center" c="white">
                  อุ้มรักเกมลวง
                </Title>
              </CarouselSlide>
              <CarouselSlide>
                <Image
                  src="https://occ-0-1174-299.1.nflxso.net/dnm/api/v6/WNk1mr9x_Cd_2itp6pUM7-lXMJg/AAAABXBEbCAl1k42SCJh-O0B47aKU5-hPPK2Nnc090pKhM0mk4Pq5jicd-COFpVDWZDi8jbNiG-4Ec5hRi1AqqfdlKa1Qtazh8zHKhzpf8KT_PyJllmRw18FEnLuWgiyhE5_bmsYmA.jpg"
                  alt="test"
                />
                <Title order={3} ta="center" c="white">
                  Crash course on romance
                </Title>
              </CarouselSlide>
            </Carousel>
          </Stack>
        </section>
      </Stack>
    </Container>
  );
}
