import { Flex, Spacer } from "@chakra-ui/react";
import SideStack from "../components/SideStack";
import CenterStack from "../components/CenterStack";
import Header from "../components/Header";
import { useSpotify } from "../context/SpotifyContext";

const HomePage = () => {

    const { user, tracks, loading, error, timeRange, tracksType, setTimeRange, setTracksType } = useSpotify();
    return (
        <Flex direction="column" className="App" bg={"gray.900"}>
            <Header user={user} />
            <Flex>
                <SideStack type="genre" data={tracks} loading={loading} error={error}/>
                <Spacer />
                <CenterStack tracks={tracks} loading={loading} error={error} changeTimeRange={setTimeRange} changeTracksType={setTracksType} tracksType={tracksType} timeRange={timeRange}/>
                <Spacer />
                <SideStack type="stats" data={tracks} loading={loading} error={error}/>
            </Flex>
        </Flex>
    );
};

export default HomePage;
