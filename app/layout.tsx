'use client';

import '@mantine/core/styles.css';
import '@mantine/carousel/styles.css';
import React from 'react';
import { MantineProvider, ColorSchemeScript, Container } from '@mantine/core';
import { QueryClient, QueryClientProvider } from 'react-query';
import { theme } from '../theme';

import { Layout } from '@/components/Layout';

export default function RootLayout({ children }: { children: any }) {
  const queryClient = new QueryClient();
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
        <QueryClientProvider client={queryClient}>
          <MantineProvider theme={theme}>
            <Layout>
              <Container size="xl" mb="xl">
                {children}
              </Container>
            </Layout>
          </MantineProvider>
        </QueryClientProvider>
      </body>
    </html>
  );
}
