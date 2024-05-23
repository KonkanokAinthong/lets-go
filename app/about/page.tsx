/* eslint-disable react/no-unescaped-entities */

'use client';

import React from 'react';
import { Container, Title, Text } from '@mantine/core';

const AboutPage = () => (
  <Container size="xl" c="white">
    <Title order={1} mb="xl">
      About Our App
    </Title>
    <Text size="lg">
      Welcome to our app! We are a team of passionate developers dedicated to creating innovative
      and user-friendly applications that cater to the needs of our users.
    </Text>
    <Text size="lg" mt="xl">
      Our mission is to provide a seamless and enjoyable experience for everyone who uses our app.
      We believe in transparency, and we strive to keep our users informed about the latest updates
      and features.
    </Text>
    <Text size="lg" mt="xl">
      At the core of our app, you'll find a powerful set of tools and features designed to simplify
      your daily tasks and enhance your productivity. We are constantly working on improving our app
      and adding new functionalities based on user feedback.
    </Text>
    <Text size="lg" mt="xl">
      We would like to extend our sincere gratitude to the Tourism Authority of Thailand (TAT) for
      providing the TAT API, which allows us to integrate valuable information about Thailand's
      tourist attractions, recommended routes, and more. The TAT API has been instrumental in
      enhancing the user experience and providing comprehensive travel information to our users.
    </Text>
    <Text size="lg" mt="xl">
      We would also like to thank The Movie Database (TMDB) for their exceptional API, which enables
      us to fetch movie and TV show data, including details about Korean celebrities and dramas. The
      TMDB API has greatly enriched our app's content and allows us to provide our users with
      up-to-date information about their favorite Korean entertainment.
    </Text>
    <Text size="lg" mt="xl">
      We are incredibly grateful to both the TAT and TMDB for their valuable APIs, which have
      significantly contributed to the success and functionality of our app. Their dedication to
      providing accurate and reliable data has been crucial in delivering a top-notch user
      experience.
    </Text>
    <Text size="lg" mt="xl">
      If you have any questions, suggestions, or concerns, please don't hesitate to reach out to us.
      We value your input and are always eager to hear from our users.
    </Text>
  </Container>
);

export default AboutPage;
