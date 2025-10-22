import { Heading, VStack } from '@chakra-ui/react'
import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react'
import Carousel from './Carousel'

const Picker = () => {
  return (
    <VStack>
        <Heading color={"purple.600"}>Picker</Heading>
        <Tabs variant='soft-rounded' colorScheme='green'>
            <TabList>
                <Tab>Standard</Tab>
                <Tab>Specific</Tab>
            </TabList>
            <TabPanels>
                <TabPanel>
                    <Carousel/>
                </TabPanel>
                <TabPanel>
                    <Carousel/>
                </TabPanel>
            </TabPanels>
        </Tabs>
    </VStack>
  )
}

export default Picker