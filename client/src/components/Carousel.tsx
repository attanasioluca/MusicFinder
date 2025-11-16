import { Spinner, VStack } from '@chakra-ui/react'
import React from 'react'

interface CarouselProps {
    data?: [];
  }
  
  const Carousel: React.FC<CarouselProps> = ({ data }) => {
    return (
      <VStack spacing={4} align="center" maxW="200px" overflowX="auto" p={4} bg="gray.800" borderRadius="md">
        {/* Carousel content */}
        <Spinner color="lightgreen"/>
        <Spinner color="lightgreen"/>
        <Spinner color="lightgreen"/>
        <Spinner color="lightgreen"/>
        <Spinner color="lightgreen"/>
      </VStack>
    )
  }

export default Carousel