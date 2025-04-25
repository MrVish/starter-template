'use client';

import React from 'react';
import { Box, Flex, Spinner } from '@chakra-ui/react';

export default function DashboardLoading() {
  return (
    <Box bg="gray.50" minH="100vh">
      <Flex align="center" justify="center" minH="100vh">
        <Spinner size="xl" color="primary.500" />
      </Flex>
    </Box>
  );
} 