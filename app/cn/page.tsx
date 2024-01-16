'use client';

import { Carousel } from '@mantine/carousel';
import { Avatar, Container, Grid, Image, Skeleton, Stack, Title } from '@mantine/core';
import axios from 'axios';
import Link from 'next/link';
import { useQuery } from 'react-query';

async function getTrendingChineseCelebrities() {
  const response = await axios.get('/api/scrape?nationality=Chinese');

  return response?.data ?? [];
}

const mockCelebrities = [
  {
    name: 'เนเน่ พรนับพัน',
    image:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/7/74/Nene%E9%83%91%E4%B9%83%E9%A6%A8.jpg/440px-Nene%E9%83%91%E4%B9%83%E9%A6%A8.jpg',
  },
  {
    name: 'ซันนี่ เกวลิน หรือ ซันนี่ หยาง',
    image:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/Sunnee_as_Thai_Festival_Ambassador.jpg/440px-Sunnee_as_Thai_Festival_Ambassador.jpg',
  },
  {
    name: 'มีมี่ พร้อมวิไล หรือ มีมี่ ลี',
    image: 'https://f.ptcdn.info/829/077/000/rew3y51lnk6uWXZKxfDlK-o.jpg',
  },
  {
    name: 'นาย กรชิต หรือ นาย INTO1',
    image: 'https://mpics.mgronline.com/pics/Images/565000010259901.JPEG',
  },
  {
    name: 'แพทริค ณัฐวรรธ์ หรือ แพทริค INTO',
    image: 'https://s359.kapook.com/pagebuilder/91cfa2ce-7761-4df4-b198-fc05f2ad347e.jpg',
  },
  {
    name: 'หยางหยาง',
    image:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0e/Yang_profile_pic.jpg/440px-Yang_profile_pic.jpg',
  },
  {
    name: 'กงจวิ้น',
    image:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/0/09/GJ_Cannes2.jpg/440px-GJ_Cannes2.jpg',
  },
  {
    name: 'Ju Jingyi',
    image:
      'https://sudsapda.com/app/uploads/2020/11/006VxdWHgy1gjxdf3by06j32yo1z4x6p-scaled-e1605325397374.jpg',
  },
  {
    name: 'Cheng Xiao',
    image:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/180317_%EC%9A%B0%EC%A3%BC%EC%86%8C%EB%85%80_%EB%AF%B8%EB%8B%88%ED%8C%AC%EB%AF%B8%ED%8C%85_%EC%A7%81%EC%B0%8D_%2819%29.jpg/440px-180317_%EC%9A%B0%EC%A3%BC%EC%86%8C%EB%85%80_%EB%AF%B8%EB%8B%88%ED%8C%AC%EB%AF%B8%ED%8C%85_%EC%A7%81%EC%B0%8D_%2819%29.jpg',
  },
  { name: 'หลี่ข่ายซิน', image: 'https://entertain.teenee.com/chinese_star/img8/670257.jpg' },
];

const mockSeries = [
  {
    title: 'The Legend of White Snake',
    image: 'https://www.themoviedb.org/t/p/w600_and_h900_bestv2/1ZYBRDnpgMcDI3h5ZovCRS2NJvX.jpg',
  },
  {
    title: 'Word of Honor',
    image: 'https://www.themoviedb.org/t/p/w600_and_h900_bestv2/op0ZXBZodAc12CVqEN55KxD0FYe.jpg',
  },
  {
    title: 'The Shiny Group',
    image: 'https://www.themoviedb.org/t/p/w600_and_h900_bestv2/rE6vK2eX04zEw35MOd6ykStz8CA.jpg',
  },
];

export default function Page() {
  const { data: celebrities, isLoading } = useQuery(
    'trendingChineseCelebrities',
    getTrendingChineseCelebrities
  );

  if (isLoading) {
    return (
      <Container size="xl" c="white">
        <Stack>
          <Title order={1} ta="center" c="white">
            Top Trending Chinese Celebrities
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
      <Stack>
        <Title order={1} ta="center" c="white">
          Top Trending Chinese Celebrities
        </Title>
        <Grid gutter={64} columns={24} align="center" justify="center">
          {mockCelebrities?.map((celebrity: any) => (
            <Grid.Col
              key={celebrity?.name}
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
                <Avatar size={124} src={celebrity?.image} alt={celebrity.name} />
                <Title order={6} ta="center">
                  <Link href={`/cn/celebrities/${celebrity.name}`}>{celebrity.name}</Link>
                </Title>
              </div>
            </Grid.Col>
          ))}
        </Grid>

        <section>
          <Stack my="xl">
            <Title order={1} mb="xl" ta="center" c="white">
              Recommended Chinese Series
            </Title>
            <Carousel
              slideSize={{ base: '100%', sm: '50%', md: '25%' }}
              slideGap="md"
              align="center"
              slidesToScroll="auto"
            >
              {mockSeries?.map((serie: any) => (
                <Carousel.Slide key={serie.title}>
                  <Stack>
                    <Image src={serie?.image} alt={serie?.title} />
                    <Title order={6} ta="center">
                      {serie.title}
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
