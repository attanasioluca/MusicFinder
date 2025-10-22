// src/components/SideStack.tsx
import React from "react";
import {
  Box,
  Heading,
  VStack,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Text,
  Spinner,
} from "@chakra-ui/react";
import { useGenres } from "../hooks/useGenres";
import { useSubGenres } from "../hooks/useSubGenres";
import { useArtists } from "../hooks/useArtists";
import { useSongs } from "../hooks/useSongs";

interface SideStackProps {
  type: "genre" | "stats";
}

const SideStack: React.FC<SideStackProps> = ({ type }) => {
  if (type === "genre") {
    const { genres, loading } = useGenres();

    const subgenreCodes = Array.from(
      new Set(
        genres
          .map((g) => g.sub_genres)
          .filter((code): code is string => Boolean(code))
      )
    ).slice(0, 5);

    const { names: subGenreNames, loading: subLoading } = useSubGenres(
      genres,
      subgenreCodes
    );

    return (
      <Box p={4} bg="gray.800" borderRadius="lg" m={4} minW="250px">
        <VStack>
          <Heading mb={2} size="lg" color="purple.600">
            Genres
          </Heading>
          {loading ? (
            <Spinner />
          ) : (
            <Tabs variant="soft-rounded" colorScheme="green">
              <TabList>
                <Tab>Standard</Tab>
                <Tab>Subgenres</Tab>
              </TabList>
              <TabPanels>
                <TabPanel>
                  {genres.slice(0, 5).map((g, i) => (
                    <Text key={`${g.genre_code}-${i}`} color="green.200">
                      {g.genre_name}
                    </Text>
                  ))}
                </TabPanel>
                <TabPanel>
                  {subLoading ? (
                    <Spinner />
                  ) : subGenreNames.length > 0 ? (
                    subGenreNames.map((name, i) => (
                      <Text key={`${name}-${i}`} color="purple.200">
                        {name}
                      </Text>
                    ))
                  ) : (
                    <Text color="gray.400">No subgenres found</Text>
                  )}
                </TabPanel>
              </TabPanels>
            </Tabs>
          )}
        </VStack>
      </Box>
    );
  }

  if (type === "stats") {
    const { artists, loading: artistsLoading } = useArtists();
    const { songs, loading: songsLoading } = useSongs();

    return (
      <Box p={4} bg="gray.800" borderRadius="lg" m={4} minW="250px">
        <VStack>
          <Heading mb={2} size="lg" color="purple.600">
            Stats
          </Heading>
          <Tabs variant="soft-rounded" colorScheme="green">
            <TabList>
              <Tab>Artists</Tab>
              <Tab>Songs</Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                {artistsLoading ? (
                  <Spinner />
                ) : (
                  artists.slice(0, 5).map((a, i) => (
                    <Text key={`${a.artist_code}-${i}`} color="green.200">
                      {a.artist_name}
                    </Text>
                  ))
                )}
              </TabPanel>
              <TabPanel>
                {songsLoading ? (
                  <Spinner />
                ) : (
                  songs.slice(0, 5).map((s, i) => (
                    <Text key={`${s.id}-${i}`} color="green.200">
                      {s.title}
                    </Text>
                  ))
                )}
              </TabPanel>
            </TabPanels>
          </Tabs>
        </VStack>
      </Box>
    );
  }

  return null;
};

export default SideStack;
