/* eslint-disable react/no-unescaped-entities */

'use client';

import { useDisclosure } from '@mantine/hooks';
import {
  AppShell,
  Autocomplete,
  Box,
  Burger,
  Group,
  Loader,
  NavLink,
  Title,
  rem,
} from '@mantine/core';
import { IconNavigationCheck, IconSearch } from '@tabler/icons-react';
import { useState } from 'react';
import axios from 'axios';

export function Layout({ children }: { children: React.ReactNode }) {
  const [opened, { toggle }] = useDisclosure();
  const [value, setValue] = useState('');
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (query: string) => {
    setValue(query);
    setLoading(true);

    const { data } = await axios.get(`/api/search-places?place=${query}`);
    const places = data.data.predictions.map((prediction: any) => prediction.description);

    setOptions(places);
    setLoading(false);
  };

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{ width: 300, breakpoint: 'sm', collapsed: { desktop: true, mobile: !opened } }}
      padding="md"
    >
      <AppShell.Header>
        <Group h="100%" px="md">
          <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
          <Group justify="space-between" style={{ flex: 1 }}>
            <Box>
              <NavLink
                leftSection={<IconNavigationCheck color="#ff6a1a" />}
                label={
                  <Title order={3} c="#ff6a1a">
                    Let's go
                  </Title>
                }
                href="/"
              />
            </Box>
            <Group>
              <Autocomplete
                placeholder="Type to search"
                value={value}
                data={options}
                onChange={handleSearch}
                rightSection={loading ? <Loader size={16} /> : null}
                leftSection={
                  <IconSearch style={{ width: rem(16), height: rem(16) }} stroke={1.5} />
                }
                visibleFrom="xs"
              />
            </Group>
          </Group>
        </Group>
      </AppShell.Header>

      <AppShell.Navbar py="md" px={4}>
        <Box>
          <NavLink
            leftSection={<IconNavigationCheck color="#ff6a1a" />}
            label={
              <Title order={3} c="#ff6a1a">
                Let's go
              </Title>
            }
            href="/"
          />
        </Box>
      </AppShell.Navbar>

      <AppShell.Main>{children}</AppShell.Main>
    </AppShell>
  );
}
