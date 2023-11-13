import { Container, Grid, GridCol, Stack, Text, Title } from '@mantine/core';

export default function Page() {
  return (
    <Container c="white">
      <Grid gutter="xl">
        <GridCol span={4}>
          <Stack justify="center" align="center">
            <img src="https://source.unsplash.com/random/300x300" alt="test" />
            <Title order={1}>Lalisa Manobal</Title>
            <Text>Artist: South Korea</Text>
          </Stack>
        </GridCol>
        <GridCol span={4}>
          <Stack justify="center" align="center">
            <img src="https://source.unsplash.com/random/300x300" alt="test" />
            <Title order={1}>Lalisa Manobal</Title>
            <Text>Artist: South Korea</Text>
          </Stack>
        </GridCol>
        <GridCol span={4}>
          <Stack justify="center" align="center">
            <img src="https://source.unsplash.com/random/300x300" alt="test" />
            <Title order={1}>Lalisa Manobal</Title>
            <Text>Artist: South Korea</Text>
          </Stack>
        </GridCol>
      </Grid>
    </Container>
  );
}
