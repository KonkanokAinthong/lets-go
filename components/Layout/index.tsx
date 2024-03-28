/* eslint-disable react/no-unescaped-entities */

'use client';

import { useDisclosure } from '@mantine/hooks';
import {
  AppShell,
  Autocomplete,
  Box,
  Burger,
  Group,
  Image,
  Loader,
  NavLink,
  Title,
  rem,
} from '@mantine/core';
import { IconSearch } from '@tabler/icons-react';
import { useState } from 'react';

export function Layout({ children }: { children: React.ReactNode }) {
  const [opened, { toggle }] = useDisclosure();
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (query: string) => {
    if (query.trim().length >= 3) {
      try {
        setLoading(true);
        const response = await fetch(`/api/search?query=${encodeURIComponent(query)}`);
        const data = await response.json();

        if (response) {
          const formattedOptions = data?.celebrities?.map?.((celebrity) => ({
            value: celebrity.name,
            label: celebrity.name,
            visitedPlaces: celebrity.visitedPlaces,
          }));
          setOptions(formattedOptions);
        } else {
          console.error('Error:', data.error);
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    } else {
      setOptions([]);
    }
  };

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{
        width: 300,
        breakpoint: 'sm',
        collapsed: { desktop: true, mobile: !opened },
      }}
      padding="md"
    >
      <AppShell.Header>
        <Group h="100%" px="md">
          <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
          <Group justify="space-between" style={{ flex: 1 }}>
            <Box>
              <NavLink
                leftSection={<Image src="/logo.png" width={40} height={40} alt="logo" />}
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
                data={options}
                onChange={handleSearch}
                minLength={3}
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
            leftSection={<Image src="/logo.png" width={40} height={40} alt="logo" />}
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
