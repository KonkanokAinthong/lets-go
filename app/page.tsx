import { Carousel, CarouselSlide } from '@mantine/carousel';
import { Box, Button, Container, Grid, GridCol, Image, Stack, Text, Title } from '@mantine/core';
import Link from 'next/link';

export default function HomePage() {
  return (
    <Container size="xl">
      <Stack gap="xl">
        <Title order={1} ta="center" c="white">
          Superstar Check in Thailand
        </Title>
        <section>
          <Stack>
            <Grid justify="center" align="center">
              <GridCol span={4}>
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
              <GridCol span={4}>
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
              <GridCol span={4}>
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
          <Stack my="xl">
            <Title order={1} mb="xl" ta="center" c="white">
              Recommended Series
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
                <Stack justify="center" align="center">
                  <Box w={200} h={100}>
                    <Stack justify="center" align="center">
                      <Image
                        w={200}
                        h={100}
                        src="https://occ-0-7166-92.1.nflxso.net/dnm/api/v6/WNk1mr9x_Cd_2itp6pUM7-lXMJg/AAAABTGDHL1pevsw-uMEJ2Z7YWpZXw4T97TcmVFwRgl4m0uc8Vgut7DgGKAZOoL6bH7s7owTlVeNtiOLcyUZdu7bb2PuCp8DReh5qSe2PgWaIpIEtP2yDvNgsALxWiPDsMFCmDpxS4m2F6dsKW_fTcLxGNJuH_e2M42m2FkbemmzYJbIX0c-tVV7mkqdQ6vFJ940vIBdekxctWnS2M_Kayl0hCtJqb2Pgsf5Tt-mdp0sZHWuzWDRxMW7dJGiuiVAH7WESLPkK-6n87QHgozGlj9mgcsD291aQS7CcnaHJTrIYSC9l88XEt0Z3Fypew.jpg"
                        alt="test"
                      />
                      <Title order={3} ta="center" c="white">
                        Doona!
                      </Title>
                      <Text ta="center" c="white">
                        Korean series
                      </Text>
                    </Stack>
                  </Box>
                </Stack>
              </CarouselSlide>
              <CarouselSlide>
                <Stack justify="center" align="center">
                  <Box w={200} h={100}>
                    <Stack justify="center" align="center">
                      <Image src="https://i.mydramalist.com/pdK54b_4f.jpg" alt="test" />
                      <Title order={3} ta="center" c="white">
                        The name in my heart
                      </Title>
                      <Text ta="center" c="white">
                        Chinese series
                      </Text>
                    </Stack>
                  </Box>
                </Stack>
              </CarouselSlide>
              <CarouselSlide>
                <Stack justify="center" align="center">
                  <Box w={200} h={100}>
                    <Stack justify="center" align="center">
                      <Image
                        w={200}
                        h={100}
                        src="https://www.gmm25.com/2016/upload_2020/images/212005012035288.jpg"
                        alt="test"
                      />
                      <Title order={3} ta="center" c="white">
                        อุ้มรักเกมลวง
                      </Title>
                      <Text ta="center" c="white">
                        Thai series
                      </Text>
                    </Stack>
                  </Box>
                </Stack>
              </CarouselSlide>
              <CarouselSlide>
                <Stack justify="center" align="center">
                  <Box>
                    <Stack justify="center" align="center">
                      <Image
                        w={200}
                        h={100}
                        src="https://occ-0-1174-299.1.nflxso.net/dnm/api/v6/WNk1mr9x_Cd_2itp6pUM7-lXMJg/AAAABXBEbCAl1k42SCJh-O0B47aKU5-hPPK2Nnc090pKhM0mk4Pq5jicd-COFpVDWZDi8jbNiG-4Ec5hRi1AqqfdlKa1Qtazh8zHKhzpf8KT_PyJllmRw18FEnLuWgiyhE5_bmsYmA.jpg"
                        alt="test"
                      />
                      <Title order={3} ta="center" c="white">
                        Crash course on romance
                      </Title>
                      <Text ta="center" c="white">
                        Korean Series
                      </Text>
                    </Stack>
                  </Box>
                </Stack>
              </CarouselSlide>
            </Carousel>
          </Stack>
        </section>
      </Stack>
    </Container>
  );
}
