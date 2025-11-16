import { Flex, HStack, Heading, IconButton, Spacer } from "@chakra-ui/react";
import { Settings, ExternalLink, Menu, User } from "lucide-react";
import type { SpotifyUser } from "../models";
import { useNavigate } from "react-router-dom";

interface HeaderProps {
    user: SpotifyUser | null;
}

const Header: React.FC<HeaderProps> = ({ user }) => {
    const navigate = useNavigate();
    return (
        <Flex padding={4}>
            <HStack>
                <IconButton
                    size="lg"
                    aria-label="settingsButton"
                    onClick={() => {
                        navigate("settings");
                    }}
                >
                    <Settings />
                </IconButton>
                <IconButton
                    size="lg"
                    aria-label="spotifyButton"
                    onClick={() => {
                        navigate("login");
                    }}
                >
                    <ExternalLink />
                </IconButton>
            </HStack>
            <Spacer />
            <Heading color={"purple.600"}>MusicFinder</Heading>
            <Spacer />
            <HStack>
                <IconButton size="lg" aria-label="menuButton">
                    <Menu />
                </IconButton>
                <IconButton
                    size="lg"
                    aria-label="profileButton"
                    onClick={() => {
                        navigate("profile", { state: {user} });
                    }}
                >
                    <User />
                </IconButton>
            </HStack>
        </Flex>
    );
};

export default Header;
