/* eslint-disable react/no-unescaped-entities */

import {
  Avatar,
  Center,
  Container,
  Stack,
  Tabs,
  TabsList,
  TabsPanel,
  TabsTab,
  Text,
  Title,
} from '@mantine/core';

export default async function Page() {
  const topic = 'Lisa_(rapper)'; // Replace with the desired Wikipedia page title or topic

  const data = await fetch(
    `https://th.wikipedia.org/w/api.php?action=query&titles=${topic}&prop=extracts|pageimages|info&pithumbsize=400&inprop=url&redirects=&format=json&origin=*`
  )
    .then((response) => response.json())
    .catch((error) => {
      console.error('Error fetching data:', error);
    });

  const html = await fetch('http://localhost:3000/api/scrape');
  console.log(html);
  return (
    <Container c="white">
      <Stack>
        <Center>
          <Avatar size={200} src={data.query.pages['848451'].thumbnail.source} alt="test" />
        </Center>
        <Title order={1} ta="center">
          Lalisa Manobal
        </Title>

        <Text ta="center" c="white">
          Artist: South Korea
        </Text>

        <Tabs>
          <TabsList mb="xl">
            <TabsTab value="info">ประวัติ</TabsTab>
            <TabsTab value="visited-places">การท่องเที่ยว</TabsTab>
            <TabsTab value="nearby">สถานที่ท่องเที่ยวใกล้เคียง</TabsTab>
          </TabsList>

          <TabsPanel value="info">
            <Text
              size="xs"
              dangerouslySetInnerHTML={{
                __html: data.query.pages['848451'].extract,
              }}
            />
          </TabsPanel>
          <TabsPanel value="visited-places">
            <iframe
              title="map"
              src="https://www.google.com/maps/place/Jae+Wan,+1700+%E0%B8%96%E0%B8%99%E0%B8%99+%E0%B8%9A%E0%B8%A3%E0%B8%A3%E0%B8%97%E0%B8%B1%E0%B8%94%E0%B8%97%E0%B8%AD%E0%B8%87+Khwaeng+Rong+Muang,+Khet+Pathum+Wan,+Bangkok+10330/@13.7396492,100.5222225,17z/data=!4m14!1m7!3m6!1s0x30e299293ebc3217:0xdb2ef36a28b04a9e!2zSmFlIFdhbiwgMTcwMCDguJbguJnguJkg4Lia4Lij4Lij4LiX4Lix4LiU4LiX4Lit4LiHIEtod2FlbmcgUm9uZyBNdWFuZywgS2hldCBQYXRodW0gV2FuLCBCYW5na29rIDEwMzMw!8m2!3d13.7396492!4d100.5222225!16s%2Fg%2F1ydxc43jr!3m5!1s0x30e299293ebc3217:0xdb2ef36a28b04a9e!8m2!3d13.7396492!4d100.5222225!16s%2Fg%2F1ydxc43jr"
              width="100%"
              height="450"
              allowFullScreen
              loading="lazy"
            />
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
