/* eslint-disable react/no-unescaped-entities */

'use client';

import { Container, Stack, Tabs, Text, Title } from '@mantine/core';

export default function Page() {
  return (
    <Container c="white">
      <Stack>
        <Tabs defaultValue="gallery">
          <Tabs.List mb="xl">
            <Tabs.Tab value="gallery">ประวัติ</Tabs.Tab>
            <Tabs.Tab value="messages">การท่องเที่ยว</Tabs.Tab>
            <Tabs.Tab value="settings">สถานที่ท่องเที่ยวใกล้เคียง</Tabs.Tab>
          </Tabs.List>

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
        </Tabs>
      </Stack>
    </Container>
  );
}
