/* eslint-disable react/no-unescaped-entities */

'use client';

import { useDisclosure } from '@mantine/hooks';
import {
  AppShell,
  Autocomplete,
  AutocompleteProps,
  Avatar,
  Box,
  Burger,
  Group,
  Image,
  Loader,
  NavLink,
  Text,
  Title,
  rem,
} from '@mantine/core';
import { IconSearch } from '@tabler/icons-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export function Layout({ children }: { children: React.ReactNode }) {
  const navigate = useRouter();
  const [opened, { toggle }] = useDisclosure();
  const [options, setOptions] = useState<
    { value: string; label: string; visitedPlaces: string[] }[]
  >([]);
  const [loading, setLoading] = useState(false);
  console.log('options', options);

  const handleSearch = async (query: string) => {
    if (query.trim().length >= 3) {
      try {
        setLoading(true);
        const response = await fetch(`/api/search?search=${encodeURIComponent(query)}`);
        const data = await response.json();

        if (response.ok) {
          const formattedData = data.map((result: any) => ({
            ...result,
            value: result.id.toString(),
            label: result.label,
          }));
          if (formattedData.length > 0) {
            setOptions(formattedData);
          } else {
            setOptions([{ value: 'no-results', label: 'No results found' }]);
          }
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

  const getNationalityPrefix = (option: string) => {
    const selectedOption = options.find((item) => item.value === option);
    if (selectedOption && selectedOption?.nationality) {
      const { nationality } = selectedOption;
      if (nationality.includes('Korean')) {
        return 'kr';
      }
      if (nationality.includes('Chinese')) {
        return 'cn';
      }
      if (nationality.includes('Thai')) {
        return 'th';
      }
    }
    return ''; // Default to an empty prefix if nationality is not found
  };

  const handleItemSubmit = (option: string) => {
    // Get the nationality prefix based on the selected option's label
    const nationalityPrefix = getNationalityPrefix(option);

    // Navigate to the selected item's page with the nationality prefix
    navigate.push(`${nationalityPrefix}/celebrities/${option}`);
  };

  const renderAutocompleteOption: AutocompleteProps['renderOption'] = ({ option }) => {
    if (!option) {
      return <Text size="sm">No results found</Text>;
    }

    return (
      <Group gap="sm">
        <Avatar src={option.avatarPath} size={36} radius="xl" />
        <div>
          <Text size="sm">{option.label}</Text>
        </div>
      </Group>
    );
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
                leftSection={<Image src="/logo.png" width={40} height={40} alt="logo" />}
                label={
                  <Title order={3} c="#ff6a1a">
                    {' '}
                    Let's go{' '}
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
                renderOption={renderAutocompleteOption}
                onOptionSubmit={handleItemSubmit}
              />
            </Group>
          </Group>
        </Group>
      </AppShell.Header>
      <AppShell.Navbar py="md" px={4}>
        <Group>
          <Autocomplete
            style={{ width: '100%' }}
            placeholder="Type to search"
            data={options}
            onChange={handleSearch}
            minLength={3}
            rightSection={loading ? <Loader size={16} /> : null}
            leftSection={<IconSearch style={{ width: rem(16), height: rem(16) }} stroke={1.5} />}
            renderOption={renderAutocompleteOption}
            onOptionSubmit={handleItemSubmit}
          />
        </Group>
      </AppShell.Navbar>
      <AppShell.Main>{children}</AppShell.Main>
    </AppShell>
  );
}
