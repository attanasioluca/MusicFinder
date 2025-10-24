import React from "react";
import {
    Box,
    Image,
    Text,
    VStack,
    HStack,
    Spinner,
    Heading,
    Flex,
    Divider,
    Badge,
    IconButton,
} from "@chakra-ui/react";
import type { SpotifyTrack } from "../models";
import { ClockPlus, HeartIcon, Star } from "lucide-react";

interface CenterStackProps {
    tracks: (SpotifyTrack & { genres?: string[] })[] | null;
    loading: boolean;
    error: string | null;
}

const CenterStack: React.FC<CenterStackProps> = ({
    tracks,
    loading,
    error,
}) => {
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

    if (!tracks || tracks.length === 0 || tracks[0] == null) {
        return (
            <Flex justify="center" align="center" h="100%">
                <Text color="gray.400" fontSize="lg">
                    No top tracks found.
                </Text>
            </Flex>
        );
    }

    const formatDuration = (ms: number) => {
        const minutes = Math.floor(ms / 60000);
        const seconds = Math.floor((ms % 60000) / 1000)
            .toString()
            .padStart(2, "0");
        return `${minutes}:${seconds}`;
    };
    
    return (
        <VStack
            spacing={6}
            align="stretch"
            w="100%"
            maxW="800px"
            mx="auto"
            mt={8}
        >
            <Heading textAlign="center" size="lg" color="purple.400">
                Your Top Spotify Tracks
            </Heading>
            <Divider borderColor="gray.600" />

            {tracks.map((t, i) => (
                <HStack
                    key={`track-${t.id}-${i}`}
                    spacing={4}
                    p={4}
                    borderWidth="1px"
                    borderColor="gray.700"
                    borderRadius="xl"
                    _hover={{ bg: "gray.800" }}
                >
                    <Text
                        fontWeight="bold"
                        color="gray.500"
                        minW="2rem"
                        textAlign="right"
                    >
                        {i + 1}.
                    </Text>

                    <Image
                        src={t.album.images[1]?.url || t.album.images[0]?.url}
                        alt={t.name}
                        boxSize="78px"
                        borderRadius="md"
                        objectFit="cover"
                    />

                    <Box flex="1">
                        <Text fontWeight="semibold" fontSize="lg" noOfLines={1} color="gray.300">
                            {t.name}
                        </Text>
                        <HStack>
                            <Text color="gray.400" noOfLines={1}>
                                {t.artists.map((a) => a.name).join(", ")+" - "}
                            </Text>
                            {t.genres && t.genres.length > 0 && (
                                t.genres?.map((genre) => (
                                    <Badge colorScheme="purple" fontSize="0.7em" key={`genre-${genre}`}>
                                    {genre}
                                    </Badge>
                                )
                            ))}
                        </HStack>
                        <Text fontSize="sm" color="gray.500">
                            {t.album.name} • {formatDuration(t.duration_ms)}
                        </Text>
                    </Box>
                    <HStack alignItems={"trailing"} spacing={2} alignSelf={"flex-end"}>
                        <IconButton aria-label={"Like"} size={"sm"} color="purple.400">
                            <HeartIcon/>
                        </IconButton>
                        <IconButton aria-label={"Save for later"} size={"sm"} color="purple.400">
                            <ClockPlus/>
                        </IconButton>
                        <IconButton aria-label={"Rate"} size={"sm"} color="purple.400">
                            <Star/>
                        </IconButton>
                    </HStack>
                </HStack>
            ))}
        </VStack>
    );
};

export default CenterStack;
