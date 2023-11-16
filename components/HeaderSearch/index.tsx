/* eslint-disable react/no-unescaped-entities */

'use client';

import { Autocomplete, Group, Burger, rem, NavLink, Title } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconNavigationCheck, IconSearch } from '@tabler/icons-react';

import classes from './HeaderSearch.module.css';

// const links = [
//   { link: '/about', label: 'Features' },
//   { link: '/pricing', label: 'Pricing' },
//   { link: '/learn', label: 'Learn' },
//   { link: '/community', label: 'Community' },
// ];

export function HeaderSearch() {
  const [opened, { toggle }] = useDisclosure(false);

  //   const items = links.map((link) => (
  //     <a
  //       key={link.label}
  //       href={link.link}
  //       className={classes.link}
  //       onClick={(event) => event.preventDefault()}
  //     >
  //       {link.label}
  //     </a>
  //   ));

  return (
    <header className={classes.header}>
      <div className={classes.inner}>
        <Group>
          <Burger opened={opened} onClick={toggle} size="sm" hiddenFrom="sm" />
          <Group>
            <NavLink
              leftSection={<IconNavigationCheck color="#ff6a1a" />}
              label={
                <Title order={3} c="#ff6a1a">
                  Let's go
                </Title>
              }
              href="/"
            />
          </Group>
        </Group>

        <Group>
          {/* <Group ml={50} gap={5} className={classes.links} visibleFrom="sm">
            {items}
          </Group> */}
          <Autocomplete
            className={classes.search}
            placeholder="Search"
            leftSection={<IconSearch style={{ width: rem(16), height: rem(16) }} stroke={1.5} />}
            // visibleFrom="xs"
          />
        </Group>
      </div>
    </header>
  );
}
