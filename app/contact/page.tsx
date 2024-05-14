'use client';

import React from 'react';
import { Container, Title, TextInput, Textarea, Button, Group } from '@mantine/core';

const ContactPage = () => (
  <Container size="xl" c="white">
    <Title order={1} mb="xl">
      Contact Us
    </Title>
    <form>
      <TextInput label="Name" placeholder="Your name" required />
      <TextInput label="Email" placeholder="Your email" type="email" required mt="md" />
      <Textarea label="Message" placeholder="Your message" minRows={4} required mt="md" />
      <Group mt="xl">
        <Button type="submit">Submit</Button>
      </Group>
    </form>
  </Container>
);

export default ContactPage;
