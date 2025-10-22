import { Flex, HStack, Heading, IconButton, Spacer } from '@chakra-ui/react'
import { Settings, ExternalLink, Menu, User } from 'lucide-react'

const Header = () => {
  return (
    <Flex padding={4}>
        <HStack>
            <IconButton size="lg" aria-label="settingsButton"><Settings/></IconButton>
            <IconButton size="lg" aria-label="spotifyButton"><ExternalLink/></IconButton>
        </HStack>
        <Spacer/>
        <Heading color={"purple.600"}>MusicFinder</Heading>
        <Spacer/>
        <HStack>
            <IconButton size="lg" aria-label="menuButton"><Menu/></IconButton>
            <IconButton size="lg" aria-label="profileButton"><User/></IconButton>
        </HStack>
    </Flex>
  )
}

export default Header