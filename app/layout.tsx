import '@mantine/core/styles.css';
import '@mantine/carousel/styles.css';
import React from 'react';
import { MantineProvider, ColorSchemeScript, Container } from '@mantine/core';
import { theme } from '../theme';
import { HeaderSearch } from '@/components/HeaderSearch';
import { Layout } from '@/components/Layout';

export const metadata = {
  title: "Let's go",
  description: 'I am using Mantine with Next.js!',
};

export default function RootLayout({ children }: { children: any }) {
  return (
    <html lang="en">
      <head>
        <ColorSchemeScript />
        <link rel="shortcut icon" href="/favicon.svg" />
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width, user-scalable=no"
        />
      </head>
      <body
        style={{
          background: 'linear-gradient(45deg, rgba(255, 106, 26, 1) 17%, rgba(26, 16, 10, 1) 100%)',
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'fixed',
          backgroundSize: 'cover',
        }}
      >
        <MantineProvider theme={theme}>
          <Layout>
            <Container size="xl" mb="xl">
              {children}
            </Container>
          </Layout>
        </MantineProvider>
      </body>
    </html>
  );
}
