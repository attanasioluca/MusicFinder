import { Button, Flex } from '@chakra-ui/react'
import React from 'react'

const Footer = () => {
  return (
    <Flex gap={4} mt={4} mb={2}>
        <Button colorScheme='purple' size='lg'>Seach by type</Button>
        <Button colorScheme='purple' size='lg'>Search by genre</Button>
        <Button colorScheme='purple' size='lg'>Search by name</Button>
    </Flex>
  )
}

export default Footer