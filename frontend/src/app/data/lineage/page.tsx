'use client';

import React from 'react';
import { Box, Heading, Text, VStack } from '@chakra-ui/react';
import DashboardLayout from '../../../components/layout/DashboardLayout';

export default function DataLineagePage() {
  return (
    <DashboardLayout>
      <Box p={6}>
        <Heading as="h1" size="lg" mb={4}>Data Lineage</Heading>
        <Text mb={6}>Visualize the flow of data from sources through your transformations to final destinations.</Text>
        <Box
          height="400px"
          bg="gray.50"
          border="2px dashed"
          borderColor="gray.200"
          borderRadius="md"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Text color="gray.500">[Data lineage graph will be displayed here]</Text>
        </Box>
      </Box>
    </DashboardLayout>
  );
} 