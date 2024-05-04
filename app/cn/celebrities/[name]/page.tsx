/* eslint-disable react/no-unescaped-entities */
'use client';

import {
  Avatar,
  Center,
  Container,
  Divider,
  Grid,
  Image,
  Loader,
  Stack,
  Tabs,
  TabsList,
  TabsPanel,
  TabsTab,
  Text,
  Title,
} from '@mantine/core';
import axios from 'axios';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useQuery } from 'react-query';

const API_KEY = 'AIzaSyABkNqq2Rnxn7v-unsUUtVfNaPFcufrlbU';

const TMDB_API_TOKEN =
  'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxNDg5YjUyNDg3MTdmZjY2NmY3NzhkNzE3NmVmYjdjZiIsInN1YiI6IjY1NTk5ZTI5ZWE4NGM3MTA5NmRmMjk2ZCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.e0lqhUBzvqt4L-OleXqsj8bx_p6yQK46wPabFdYFO1s';

const searchCelebrity = async (name: string) => {
  const data = await axios.get(
    `https://api.themoviedb.org/3/search/person?query=${name}&include_adult=false&language=en-US&page=1`,
    {
      headers: {
        Authorization: `Bearer ${TMDB_API_TOKEN}`,
      },
    }
  );
  return data.data.results[0];
};

const getCelebrityInfo = async (person_id: string) => {
  const data = await axios.get(`https://api.themoviedb.org/3/person/${person_id}`, {
    headers: {
      Authorization: `Bearer ${TMDB_API_TOKEN}`,
    },
  });

  return data.data;
};

const getPlacebyTextSearch = async (place: string) => {
  try {
    const response = await axios.get(`/api/places?place=${place}`);
    return response.data.data.results;
  } catch (error) {
    console.error(error);
    throw new Error('Failed to fetch data');
  }
};

// const getNearbyPlaces = async (lat: string, long: string) => {
//   // try {
//   //   const response = await axios.get(`/api/nearby-places?place=${place}`);
//   //   return response.data.data.results;
//   // } catch (error) {
//   //   console.error(error);
//   //   throw new Error('Failed to fetch data');
//   // }
// };

export default function Page() {
  const { name } = useParams();
  const placeName = 'Old Phuket Town';
  const { data: celebrity, isLoading: isCelebrityLoading } = useQuery(['celebrity'], () =>
    searchCelebrity(name as string)
  );
  const { data: celebrityInfo, isLoading: isCelebbrityInfoLoading } = useQuery(
    ['celebrityInfo', celebrity?.id],
    () => getCelebrityInfo(celebrity?.id),
    {
      enabled: !!celebrity?.id,
    }
  );
  console.log(name);
  console.log(celebrity);

  const { data: places, isLoading: isPlacesLoading } = useQuery('place', () =>
    getPlacebyTextSearch(placeName as string)
  );
  // const { data: nearbyPlaces } = useQuery('nearbyPlaces', () =>
  //   getNearbyPlaces(placeName as string)
  // );

  console.log(places);

  if (isCelebrityLoading || isCelebbrityInfoLoading || isPlacesLoading) {
    return <Loader />;
  }

  return (
    <Container c="white">
      <Stack>
        <Center>
          <Avatar
            size={200}
            src={`https://image.tmdb.org/t/p/original/${celebrityInfo?.profile_path}`}
            alt="test"
          />
        </Center>
        <Title order={1} ta="center">
          {decodeURIComponent(name as string)}
        </Title>

        <Tabs defaultValue="info">
          <TabsList mb="xl" grow>
            <TabsTab value="info">ประวัติ</TabsTab>
            <TabsTab value="visited-places">การท่องเที่ยว</TabsTab>
            <TabsTab value="nearby">สถานที่ท่องเที่ยวใกล้เคียง</TabsTab>
          </TabsList>
          <TabsPanel value="info">
            <Stack>
              <div>
                {celebrityInfo?.biography ? (
                  <Text size="md">{celebrityInfo?.biography}</Text>
                ) : decodeURIComponent(name as string) === 'Ju Jingyi' ? (
                  <Text size="md">
                    จวี จิ้งอี (จีนตัวย่อ: 鞠婧祎; จีนตัวเต็ม: 鞠婧禕; พินอิน: Jū Jìngyī; เกิด 18
                    มิถุนายน ค.ศ. 1994) หรือที่รู้จักกันในชื่อ เสี่ยวจวี (小鞠) เป็นนักร้อง นักเต้น
                    นักแสดงชาวจีน โด่งดังและเป็นที่รู้จักจากบทบาทในเรื่อง ตำนานรักนางพญางูขาว
                    ที่จวีจิ้งอี เป็นนักแสดงนำในเรื่อง
                    และจวีจิ้งอียังเป็นสมาชิกรุ่นที่สองของวงไอดอลจีน SNH48 ทีม NII
                    ปัจจุบันอยู่ภายใต้สังกัด Shanghai Siba culture media Ltd.[1]
                    ในงานเลือกตั้งประจำปีของวง SNH48 จวี จิ้งอี ได้รับตำแหน่ง อันดับ 4 ในปี 2014,
                    อันดับ 2 ในปี 2015, และอันดับ 1 ในปี 2016 และ 2017 จากสมาชิกในวงทั้งหมดกว่า 100
                    คน[1] และเป็นคนแรกที่ได้รับตำแหน่งอันดับ 1 สองปีซ้อน[2] แฟนคลับชาวจีนต่างเรียก
                    จวี จิ้งอี ว่าเป็น "ไอดอลในรอบ 4000 ปี" มาตั้งแต่ปี 2014
                    แต่ด้วยความเข้าใจผิดเล็กน้อย ทำให้สื่อมวลชนญี่ปุ่น เรียก จวี จิ้งอี ว่า
                    "สวยที่สุดในรอบ 4000 ปี" และทำให้ความนิยมของเธอเพิ่มขึ้นนับตั้งแต่นั้น[3][4]
                  </Text>
                ) : (
                  <Text size="md">ไม่มีข้อมูล</Text>
                )}
              </div>
              <div>
                <Stack>
                  <Title order={3}>Known For</Title>
                  <Grid>
                    {celebrity?.known_for?.map((item) => (
                      <Grid.Col
                        span={{
                          xs: 12,
                          md: 4,
                        }}
                      >
                        <Stack key={item.id}>
                          <Image
                            src={`https://image.tmdb.org/t/p/original/${item.poster_path}`}
                            alt="test"
                          />
                          <Text component={Link} href="" ta="center">
                            {item.name ?? item.title}
                          </Text>
                        </Stack>
                      </Grid.Col>
                    ))}
                  </Grid>
                </Stack>
              </div>
            </Stack>
          </TabsPanel>
          <TabsPanel value="visited-places">
            <Stack justify="center" align="center">
              {places?.map((place: any) => (
                <Stack key={place.name}>
                  <Image
                    src={`https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${place.photos[0].photo_reference}&key=${API_KEY}`}
                    alt="test"
                  />
                  <Stack>
                    <Title order={3} ta="center">
                      {place.name}
                    </Title>
                    <Text size="xs">{place.formatted_address}</Text>
                  </Stack>
                  <iframe
                    title="map"
                    src={`https://www.google.com/maps/embed/v1/view?key=${API_KEY}&center=${place.geometry.location.lat},${place.geometry.location.lng}&zoom=15`}
                    width="100%"
                    height="450"
                    allowFullScreen
                    loading="lazy"
                  />
                  <Divider size="md" w="100%" />
                </Stack>
              ))}
            </Stack>
          </TabsPanel>
          <TabsPanel value="nearby">
            <iframe
              title="map"
              src="https://www.google.com/maps/place/Jae+Wan,+1700+%E0%B8%96%E0%B8%99%E0%B8%99+%E0%B8%9A%E0%B8%A3%E0%B8%A3%E0%B8%97%E0%B8%B1%E0%B8%94%E0%B8%97%E0%B8%AD%E0%B8%87+Khwaeng+Rong+Muang,+Khet+Pathum+Wan,+Bangkok+10330/@13.7396492,100.5222225,17z/data=!4m14!1m7!3m6!1s0x30e299293ebc3217:0xdb2ef36a28b04a9e!2zSmFlIFdhbiwgMTcwMCDguJbguJnguJkg4Lia4Lij4Lij4LiX4Lix4LiU4LiX4Lit4LiHIEtod2FlbmcgUm9uZyBNdWFuZywgS2hldCBQYXRodW0gV2FuLCBCYW5na29rIDEwMzMw!8m2!3d13.7396492!4d100.5222225!16s%2Fg%2F1ydxc43jr!3m5!1s0x30e299293ebc3217:0xdb2ef36a28b04a9e!8m2!3d13.7396492!4d100.5222225!16s%2Fg%2F1ydxc43jr"
              width="100%"
              height="450"
              allowFullScreen
              loading="lazy"
            />
          </TabsPanel>
        </Tabs>
      </Stack>
    </Container>
  );
}
