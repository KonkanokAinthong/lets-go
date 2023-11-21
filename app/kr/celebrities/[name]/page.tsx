'use client';

import {
  Center,
  Container,
  Divider,
  Image,
  Stack,
  Tabs,
  TabsList,
  TabsPanel,
  TabsTab,
  Text,
  Title,
} from '@mantine/core';
import axios from 'axios';
import { useParams } from 'next/navigation';
import { useQuery } from 'react-query';

const API_KEY = 'AIzaSyABkNqq2Rnxn7v-unsUUtVfNaPFcufrlbU';

const getPlacebyTextSearch = async (place: string) => {
  try {
    const response = await axios.get(`/api/places?place=${place}`);
    return response.data.data.results;
  } catch (error) {
    console.error(error);
    throw new Error('Failed to fetch data');
  }
};

// const getNearbyPlaces = async (place: string) => {
//   try {
//     const response = await axios.get(`/api/nearby-places?place=${place}`);
//     return response.data.data.results;
//   } catch (error) {
//     console.error(error);
//     throw new Error('Failed to fetch data');
//   }
// };

export default function Page() {
  const { name } = useParams();
  const placeName = 'Temple in Bangkok';
  const { data: places } = useQuery('place', () => getPlacebyTextSearch(placeName as string));
  // const { data: nearbyPlaces } = useQuery('nearbyPlaces', () =>
  //   getNearbyPlaces(placeName as string)
  // );
  // console.log(places);
  // console.log(nearbyPlaces);

  console.log(places);

  return (
    <Container c="white">
      <Stack>
        <Center>
          {/* <Avatar size={200} src={data?.query?.pages?.[randomKey]?.thumbnail?.source} alt="test" /> */}
        </Center>
        <Title order={1} ta="center">
          {decodeURIComponent(name as string)}
        </Title>

        <Tabs defaultValue="info">
          <TabsList mb="xl">
            <TabsTab value="info">ประวัติ</TabsTab>
            <TabsTab value="visited-places">การท่องเที่ยว</TabsTab>
            <TabsTab value="nearby">สถานที่ท่องเที่ยวใกล้เคียง</TabsTab>
          </TabsList>
          {/* <TabsPanel value="info">
            {data?.query?.pages?.[randomKey]?.extract ? (
              <Text
                size="xs"
                dangerouslySetInnerHTML={{
                  __html: data?.query?.pages?.[randomKey]?.extract,
                }}
              />
            ) : (
              <Text size="xs">ไม่มีข้อมูล</Text>
            )}
          </TabsPanel> */}
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
