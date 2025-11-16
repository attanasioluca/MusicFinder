import { useLocation } from "react-router-dom";
import type { SpotifyUser } from "../models";
import {
  Box,
  VStack,
  HStack,
  Image,
  Text,
  Link,
  Heading,
  Badge,
  Divider,
  Flex,
  Icon,
  Tooltip,
  Button,
} from "@chakra-ui/react";
import { ExternalLink, Mail } from "lucide-react";

const ProfilePage = () => {
  const location = useLocation();
  const user = location.state?.user as SpotifyUser | undefined;

  if (!user) {
    return (
      <Flex justify="center" align="center" minH="80vh">
        <Text color="gray.400">No user data available.</Text>
      </Flex>
    );
  }
  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login"; 
  }

  const profileImg = user.images?.[0]?.url || "https://placehold.co/200x200";
  const followerCount = user.followers?.total ?? 0;
  const profileUrl = user.external_urls?.spotify;
  const email = user.email || "N/A";

  return (
    <Flex justify="center" align="center" minH="85vh" bg="gray.900" color="gray.100" p={6}>
      <Box
        bg="gray.800"
        p={8}
        rounded="2xl"
        shadow="2xl"
        maxW="520px"
        w="full"
        textAlign="center"
      >
        <VStack spacing={6}>
          {/* Profile Picture */}
          <Image
            src={profileImg}
            alt={user.display_name}
            boxSize="160px"
            borderRadius="full"
            objectFit="cover"
            shadow="lg"
          />

          {/* Name + Spotify link */}
          <VStack spacing={1}>
            <Heading size="lg" color="green.400">
              {user.display_name}
            </Heading>
            {profileUrl && (
              <Link
                href={profileUrl}
                color="green.300"
                fontSize="sm"
                isExternal
                display="flex"
                alignItems="center"
                justifyContent="center"
                gap={1}
              >
                <Icon as={ExternalLink} boxSize={4} /> View on Spotify
              </Link>
            )}
          </VStack>

          <Divider borderColor="gray.600" />

          {/* User Info */}
          <VStack spacing={3} align="center" fontSize="sm">
            <HStack>
              <Badge colorScheme="green" fontSize="0.9em">
                {followerCount.toLocaleString()} Followers
              </Badge>
              <Tooltip label="Spotify User ID" hasArrow>
                <Badge colorScheme="gray" fontSize="0.9em">
                  ID: {user.id}
                </Badge>
              </Tooltip>
            </HStack>

            <HStack>
              <Icon as={Mail} color="gray.400" />
              <Text color="gray.300">{email}</Text>
            </HStack>
          </VStack>

          <Divider borderColor="gray.600" />

          {/* Debug / Developer info */}
          <Box textAlign="left" fontSize="xs" color="gray.500">
            <Text>
              <strong>Type:</strong> user
            </Text>
            <Text>
              <strong>Profile URI:</strong> {user.external_urls.spotify}
            </Text>
          </Box>
        <Button onClick={handleLogout} colorScheme="red" mt={4} >
            Log Out
            </Button>
        </VStack>
        
      </Box>
    </Flex>
  );
};

export default ProfilePage;
