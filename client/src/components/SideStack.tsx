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
    Flex,
} from "@chakra-ui/react";
import type { SpotifyArtist, SpotifyTrack } from "../models";

interface SideStackProps {
    type: "genre" | "stats";
    data: (SpotifyTrack & { genres?: string[] })[] | null;
    loading: boolean;
    error: string | null;
}

const SideStack: React.FC<SideStackProps> = ({
    type,
    data,
    loading,
    error,
}) => {
    const artists = Object.values(
        data
            ?.flatMap((t) => t.artists)
            .reduce((acc, artist) => {
                acc[artist.id] = artist;
                return acc;
            }, {} as Record<string, SpotifyArtist>) || {}
    );

    if (loading) {
        return (
            <Flex justify="center" align="center" h="100%">
                <Spinner size="xl" color="green.400" />
            </Flex>
        );
    }

    if (error) {
        return (
            <Flex justify="center" align="center" h="100%">
                <Text color="red.400" fontSize="lg">
                    {error}
                </Text>
            </Flex>
        );
    }
    if (type === "genre") {
        const genres = [...new Set(data?.flatMap((t) => t.genres || []) || [])];
        const subgenres = Array.from(
            new Set(
                genres
                    .map((g) => g)
                    .filter((code): code is string => Boolean(code))
            )
        );

        
        return (
            <Box p={4} bg="gray.800" borderRadius="lg" m={4} w="300px">
                <VStack>
                    <Heading mb={2} size="lg" color="purple.400">
                        Genres
                    </Heading>
                    <Tabs
                        variant="solid-rounded"
                        colorScheme="purple"
                    >
                        <TabList>
                            <Tab>Standard</Tab>
                            <Tab>Subgenres</Tab>
                        </TabList>
                        <TabPanels>
                            <TabPanel>
                                {genres.slice(0,10).map((g) => (
                                    <Box
                                        p={4}
                                        bg="gray.700"
                                        borderRadius="lg"
                                        m={4}
                                        justifyItems={"center"}
                                        key={`genre-${g}`}
                                    >
                                        <Text
                                            color="purple.400"
                                        >
                                            {g[0].toUpperCase() + g.slice(1)}
                                        </Text>
                                    </Box>
                                ))}
                            </TabPanel>
                            <TabPanel>
                                {subgenres.slice(0,10).map((g) => (
                                    <Box
                                        p={4}
                                        bg="gray.700"
                                        borderRadius="lg"
                                        m={4}
                                        justifyItems={"center"}
                                        key={`subgenre-${g}`}
                                    >
                                        <Text   
                                            color="purple.400"
                                        >
                                            {g[0].toUpperCase() + g.slice(1)}
                                        </Text>
                                    </Box>
                                ))}
                            </TabPanel>
                        </TabPanels>
                    </Tabs>
                </VStack>
            </Box>
        );
    }

    if (type === "stats") {
        return (
            <Box p={4} bg="gray.800" borderRadius="lg" m={4} w="300px">
                <VStack>
                    <Heading mb={2} size="lg" color="purple.400">
                        Stats
                    </Heading>
                    <Tabs variant="solid-rounded" colorScheme="purple">
                        <TabList>
                            <Tab>Artists</Tab>
                            <Tab>Songs</Tab>
                        </TabList>
                        <TabPanels>
                            <TabPanel>
                                {artists.slice(0, 10).map((artist) => (
                                    <Box
                                        p={4}
                                        bg="gray.700"
                                        borderRadius="lg"
                                        m={4}
                                        justifyItems={"center"}
                                        key={`artist-${artist.id}`}
                                    >
                                        <Text
                                            
                                            color="purple.400"
                                        >
                                            {artist.name}
                                        </Text>
                                    </Box>
                                ))}
                            </TabPanel>
                            <TabPanel>
                                {data?.slice(0, 10).map((track) => (
                                    <Box
                                        p={4}
                                        bg="gray.700"
                                        borderRadius="lg"
                                        m={4}
                                        justifyItems={"center"}
                                        key={`track-${track.id}`}
                                    >
                                        <Text
                                            
                                            color="purple.400"
                                        >
                                            {track.name}
                                        </Text>
                                    </Box>
                                ))}
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
