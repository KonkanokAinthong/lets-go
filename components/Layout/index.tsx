/* eslint-disable react/no-unescaped-entities */

'use client';

import { useDisclosure } from '@mantine/hooks';
import { AppShell, Box, Burger, Group, NavLink, Title } from '@mantine/core';
import { IconNavigationCheck } from '@tabler/icons-react';

// import classes from './MobileNavbar.module.css';

export function Layout({ children }: { children: React.ReactNode }) {
  const [opened, { toggle }] = useDisclosure();

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
