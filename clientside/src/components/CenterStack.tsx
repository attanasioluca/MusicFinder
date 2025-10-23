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
} from "@chakra-ui/react";
import type { SpotifyTrack } from "../models";

interface CenterStackProps {
  tracks: SpotifyTrack[] | null;
  loading: boolean;
  error: string | null;
}

const CenterStack: React.FC<CenterStackProps> = ({ tracks, loading, error }) => {
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

  if (!tracks || tracks.length === 0) {
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
    <VStack spacing={6} align="stretch" w="100%" maxW="800px" mx="auto" mt={8}>
      <Heading textAlign="center" size="lg" color="purple.400">
        Your Top Spotify Tracks
      </Heading>
      <Divider borderColor="gray.600" />

      {tracks.map((t, i) => (
        <HStack
          key={t.id}
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
            boxSize="64px"
            borderRadius="md"
            objectFit="cover"
          />

          <Box flex="1">
            <Text fontWeight="semibold" fontSize="lg" noOfLines={1}>
              {t.name}
            </Text>
            <Text color="gray.400" noOfLines={1}>
              {t.artists.map((a) => a.name).join(", ")}
            </Text>
            <Text fontSize="sm" color="gray.500">
              {t.album.name} • {formatDuration(t.duration_ms)}
            </Text>
          </Box>
        </HStack>
      ))}
    </VStack>
  );
};

export default CenterStack;
