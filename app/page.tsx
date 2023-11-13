import { Carousel, CarouselSlide } from '@mantine/carousel';
import { Avatar, Button, Container, Grid, GridCol, Stack, Text, Title } from '@mantine/core';

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
                  <img src="https://source.unsplash.com/random/400x400" alt="test" />
                  <Button size="lg">South Korea</Button>
                </Stack>
              </GridCol>
              <GridCol span={4}>
                <Stack justify="center" align="center">
                  <img src="https://source.unsplash.com/random/400x400" alt="test" />
                  <Button size="lg">South Korea</Button>
                </Stack>
              </GridCol>
              <GridCol span={4}>
                <Stack justify="center" align="center">
                  <img src="https://source.unsplash.com/random/400x400" alt="test" />
                  <Button size="lg">South Korea</Button>
                </Stack>
              </GridCol>
            </Grid>
          </Stack>
        </section>
        <section>
          <Stack my="xl">
            <Title order={1} mb="xl" ta="center" c="white">
              Superstar Recommended
            </Title>
            <Carousel
              withIndicators
              height={300}
              slideSize={{ base: '100%', sm: '50%', md: '25%' }}
              slideGap="md"
              loop
              align="center"
              slidesToScroll={4}
            >
              <CarouselSlide>
                <Stack justify="center" align="center">
                  <Avatar size={200} src="https://source.unsplash.com/random/400x400" alt="test" />
                  <Title order={1} ta="center" c="white">
                    Lisa Manobal
                  </Title>
                  <Text ta="center" c="white">
                    Artist: South Korea
                  </Text>
                </Stack>
              </CarouselSlide>
              <CarouselSlide>
                <Stack justify="center" align="center">
                  <Avatar size={200} src="https://source.unsplash.com/random/400x400" alt="test" />
                  <Title order={1} ta="center" c="white">
                    Lisa Manobal
                  </Title>
                  <Text ta="center" c="white">
                    Artist: South Korea
                  </Text>
                </Stack>
              </CarouselSlide>
              <CarouselSlide>
                <Stack justify="center" align="center">
                  <Avatar size={200} src="https://source.unsplash.com/random/400x400" alt="test" />
                  <Title order={1} ta="center" c="white">
                    Lisa Manobal
                  </Title>
                  <Text ta="center" c="white">
                    Artist: South Korea
                  </Text>
                </Stack>
              </CarouselSlide>
              <CarouselSlide>
                <Stack justify="center" align="center">
                  <Avatar size={200} src="https://source.unsplash.com/random/400x400" alt="test" />
                  <Title order={1} ta="center" c="white">
                    Lisa Manobal
                  </Title>
                  <Text ta="center" c="white">
                    Artist: South Korea
                  </Text>
                </Stack>
              </CarouselSlide>
            </Carousel>
          </Stack>
        </section>
      </Stack>
    </Container>
  );
}
