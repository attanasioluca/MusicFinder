import { Flex, HStack, Heading, IconButton, Spacer } from '@chakra-ui/react'
import { Settings, ExternalLink, Menu, User } from 'lucide-react'

const Header = () => {
    const navigate = (url: string) => {
        window.location.href = `/${url}`;
    };
  return (
    <Flex padding={4}>
        <HStack>
            <IconButton size="lg" aria-label="settingsButton" onClick={()=>{navigate("settings")}}><Settings/></IconButton>
            <IconButton size="lg" aria-label="spotifyButton" onClick={()=>{navigate("login")}}><ExternalLink/></IconButton>
        </HStack>
        <Spacer/>
        <Heading color={"purple.600"}>MusicFinder</Heading>
        <Spacer/>
        <HStack>
            <IconButton size="lg" aria-label="menuButton"><Menu/></IconButton>
            <IconButton size="lg" aria-label="profileButton" onClick={()=>{navigate("profile")}}><User/></IconButton>
        </HStack>
    </Flex>
  )
}

export default Header