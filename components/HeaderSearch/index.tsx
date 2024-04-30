/* eslint-disable react/no-unescaped-entities */

'use client';

import { Autocomplete, Group, Burger, rem, NavLink, Title } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconNavigationCheck, IconSearch } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useQuery } from 'react-query';
import classes from './HeaderSearch.module.css';

async function fetchCelebrities(searchTerm) {
  const response = await fetch(`/api/celebrities?search=${searchTerm}`);
  const data = await response.json();
  return data;
}

export function HeaderSearch() {
  const [opened, { toggle }] = useDisclosure(false);
  const [searchValue, setSearchValue] = useState('');
  const router = useRouter();

  const { data: celebrities, isLoading } = useQuery(
    ['celebrities', searchValue],
    () => fetchCelebrities(searchValue),
    {
      enabled: searchValue.length > 0,
    }
  );

  const handleSearch = (value: string) => {
    setSearchValue(value);
  };

  const handleSubmit = () => {
    const selectedCelebrity = celebrities?.find(
      (celebrity) => celebrity.name.toLowerCase() === searchValue.toLowerCase()
    );
    if (selectedCelebrity) {
      router.push(`/celebrity/${encodeURIComponent(selectedCelebrity.name)}`);
    }
  };

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
          <Autocomplete
            className={classes.search}
            placeholder="Search celebrities"
            leftSection={<IconSearch style={{ width: rem(16), height: rem(16) }} stroke={1.5} />}
            data={celebrities?.map((celebrity) => celebrity.name) || []}
            value={searchValue}
            onChange={handleSearch}
            onSubmit={handleSubmit}
            loading={isLoading}
          />
        </Group>
      </div>
    </header>
  );
}
