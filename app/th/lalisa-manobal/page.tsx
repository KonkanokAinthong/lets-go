/* eslint-disable react/no-unescaped-entities */

import {
  Avatar,
  Center,
  Container,
  Stack,
  Tabs,
  TabsList,
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
  return (
    <Container c="white">
      <Stack>
        <Center>
          <Avatar size={200} src={data.query.pages['848451'].thumbnail.source} alt="test" />
        </Center>
        <Text
          size="xs"
          dangerouslySetInnerHTML={{
            __html: data.query.pages['848451'].extract,
          }}
        />
        {/* <Tabs defaultValue="gallery">
          <TabsList mb="xl">
            <TabsTab value="gallery">ประวัติ</TabsTab>
            <TabsTab value="messages">การท่องเที่ยว</TabsTab>
            <TabsTab value="settings">สถานที่ท่องเที่ยวใกล้เคียง</TabsTab>
          </TabsList>

          <Tabs.Panel value="gallery">
            <Stack justify="center" align="center">
              <img src="https://source.unsplash.com/random/400x400" alt="test" />
              <Title order={1} ta="center">
                Lalisa Manobal
              </Title>
              <Text>
                Lalisa Manobal (also spelled Manoban;[a] born Pranpriya Manobal;[b][4] March 27,
                1997), known mononymously as Lisa,[c] is a Thai rapper, singer and dancer. She is a
                member of the South Korean girl group Blackpink, which debuted under YG
                Entertainment in August 2016.[5] Lisa made her solo debut with her single album
                Lalisa in September 2021, which made her the first female artist to sell 736,000
                copies of an album in its first week in South Korea. The music video for its lead
                single of the same name recorded 73.6 million views in 24 hours on YouTube, setting
                the record for the most-viewed music video in the first 24 hours on the platform by
                a solo artist. Lalisa and its viral second single "Money" became the first album and
                song by a K-pop soloist to reach 1 billion streams on Spotify, respectively. Lisa
                earned several accolades throughout her career, including eight Guinness World
                Records, a Gaon Chart Music Award, a Mnet Asian Music Award, and the first MTV Video
                Music Award and MTV Europe Music Award ever won by a K-pop soloist. She has been the
                most-followed K-pop artist on Instagram since 2019.
              </Text>
            </Stack>
          </Tabs.Panel>
          <Tabs.Panel value="messages">Messages tab content</Tabs.Panel>
          <Tabs.Panel value="settings">Settings tab content</Tabs.Panel>
        </Tabs> */}
      </Stack>
    </Container>
  );
}
