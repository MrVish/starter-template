'use client';

import React from 'react';
import { Box, Flex, Spinner, Text, useColorModeValue } from '@chakra-ui/react';

export default function DashboardLoading() {
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const textColor = useColorModeValue('gray.600', 'gray.400');

  return (
    <Flex
      direction="column"
      align="center"
      justify="center"
      minH="100vh"
      bg={bgColor}
    >
      <Spinner
        thickness="4px"
        speed="0.65s"
        emptyColor="gray.200"
        color="blue.500"
        size="xl"
        mb={4}
      />
      <Text fontSize="lg" color={textColor}>
        Loading dashboard...
      </Text>
    </Flex>
  );
} 