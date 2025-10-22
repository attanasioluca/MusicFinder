import { Heading, VStack } from '@chakra-ui/react'
import SongsView from './SongsView'
import Footer from './Footer'

const CenterStack = () => {
  return (
    <VStack p={4} bg="gray.800" borderRadius="lg" m={4} minW="950px">
        <Heading mb={2} size="lg" color={"purple.600"}>Recommendations</Heading>
        <SongsView/>
        <Footer/>
    </VStack>
  )
}

export default CenterStack