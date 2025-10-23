import { Flex, Spacer } from "@chakra-ui/react";
import SideStack from "../components/SideStack";
import CenterStack from "../components/CenterStack";
import Header from "../components/Header";
import { useSpotifyData } from "../hooks/spotify/useSpotifyData";

const HomePage = () => {
    const {user, tracks, loading, error } = useSpotifyData();
    return (
        <Flex direction="column" className="App" bg={"gray.900"}>
            <Header user={user}/>
            <Flex>
                <SideStack type="genre" />
                <Spacer />
                <CenterStack tracks={tracks} loading={loading} error={error} />
                <Spacer />
                <SideStack type="stats" />
            </Flex>
        </Flex>
    );
};

export default HomePage;
