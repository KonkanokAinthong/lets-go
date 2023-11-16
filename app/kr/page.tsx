import { Box, Container, Grid, GridCol, Image, Stack, Text, Title } from '@mantine/core';
import Link from 'next/link';

export default function Page() {
  return (
    <Container c="white">
      <Grid gutter="xl">
        <GridCol span={4}>
          <Stack justify="center" align="center">
            <Box w={200} h={200}>
              <Image
                w={200}
                h={200}
                src="https://wallpapers.com/images/high/lalisa-manoban-for-mac-yxyymuu7q2mld0kz.webp"
                alt="test"
              />
            </Box>
            <Title order={4}>
              <Link href="/kr/lalisa-manobal">Lalisa Manobal</Link>
            </Title>
          </Stack>
        </GridCol>
        <GridCol span={4}>
          <Stack justify="center" align="center">
            <Box w={200} h={200}>
              <Image
                src="https://filmfare.wwmindia.com/content/2023/sep/agooddaytobeadogchaeunwoo11693806876.jpg"
                alt="test"
                width={200}
                height={200}
              />
            </Box>
            <Title order={4}>Chan Eun Woo</Title>
          </Stack>
        </GridCol>
        <GridCol span={4}>
          <Stack justify="center" align="center">
            <Box>
              <Image
                width={200}
                height={200}
                src="https://upload.wikimedia.org/wikipedia/commons/2/2e/Lee_Jong-suk_March_2018.png"
                alt="test"
              />
            </Box>
            <Title order={4}>Lee Jong Suk</Title>
          </Stack>
        </GridCol>
      </Grid>
    </Container>
  );
}
