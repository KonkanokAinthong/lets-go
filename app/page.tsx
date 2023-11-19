import { Carousel, CarouselSlide } from '@mantine/carousel';
import { Box, Button, Container, Grid, GridCol, Image, Stack, Title } from '@mantine/core';
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
          <Stack>
            <Title order={1} mb="xl" ta="center" c="white">
              Recommended Celebrities
            </Title>
            <Carousel
              withIndicators
              height={500}
              slideSize={{ base: '100%', sm: '50%', md: '25%' }}
              slideGap="md"
              loop
              align="center"
              slidesToScroll={4}
            ></Carousel>
          </Stack>
        </section>
      </Stack>
    </Container>
  );
}
