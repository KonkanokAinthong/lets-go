/* eslint-disable react/self-closing-comp */

'use client';

import 'mapbox-gl/dist/mapbox-gl.css';
import '@mantine/core/styles.css';
import '@mantine/carousel/styles.css';

import React from 'react';
import { MantineProvider, ColorSchemeScript, Container } from '@mantine/core';
import { QueryClient, QueryClientProvider } from 'react-query';
import { IntlProvider } from 'react-intl';
import { theme } from '../theme';

import { Layout } from '@/components/Layout';

import en from '../lang/en.json';
import th from '../lang/th.json';

const messages = {
  en,
  th,
};

export default function RootLayout({ children }: { children: any }) {
  const queryClient = new QueryClient();
  const [locale, setLocale] = React.useState('en');

  const handleLocaleChange = (newLocale: string) => {
    setLocale(newLocale);
  };

  return (
    <html lang={locale}>
      <head>
        <script defer data-domain="letsgo-th.com" src="https://plausible.io/js/script.js"></script>

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
          <IntlProvider locale={locale} messages={messages[locale]}>
            <MantineProvider theme={theme}>
              <Layout locale={locale} onLocaleChange={handleLocaleChange}>
                <Container size="xl" mb="xl">
                  {children}
                </Container>
              </Layout>
            </MantineProvider>
          </IntlProvider>
        </QueryClientProvider>
      </body>
    </html>
  );
}
