import { Flex, Spacer } from "@chakra-ui/react";
import SideStack from "../components/SideStack";
import CenterStack from "../components/CenterStack";
import Header from "../components/Header";

const HomePage = () => {
    return (
        <Flex direction="column" className="App" bg={"gray.900"}>
            <Header />
            <Flex>
                <SideStack type="genre" />
                <Spacer />
                <CenterStack />
                <Spacer />
                <SideStack type="stats" />
            </Flex>
        </Flex>
    );
};

export default HomePage;
