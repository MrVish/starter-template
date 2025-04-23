'use client';

import React from 'react';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import {
  Box,
  SimpleGrid,
  Heading,
  Text,
  VStack,
  Icon,
} from '@chakra-ui/react';
import {
  FiDatabase,
  FiShare2,
  FiBarChart2,
  FiZap,
  FiClock,
  FiBookOpen,
  FiCode,
  FiMonitor,
} from 'react-icons/fi';

const capabilities = [
  {
    icon: FiDatabase,
    label: 'Multi-Source Connection',
    description: 'Connect to SQL, NoSQL, Cloud Storage & more.',
  },
  {
    icon: FiShare2,
    label: 'Data Lineage',
    description: 'Trace data flow across pipelines and systems.',
  },
  {
    icon: FiBarChart2,
    label: 'Data Profiling',
    description: 'Analyze data quality and distributions.',
  },
  {
    icon: FiZap,
    label: 'Transformations',
    description: 'Apply transformations and enrich your data.',
  },
  {
    icon: FiClock,
    label: 'Scheduling',
    description: 'Automate data ingestion and processing tasks.',
  },
  {
    icon: FiBookOpen,
    label: 'Data Catalog',
    description: 'Manage metadata, schemas, and documentation.',
  },
  {
    icon: FiCode,
    label: 'API Access',
    description: 'Query and access data through REST APIs.',
  },
  {
    icon: FiMonitor,
    label: 'Real-time Monitoring',
    description: 'Monitor pipeline performance and health.',
  },
];

export default function DataCapabilitiesPage() {
  return (
    <DashboardLayout>
      <Box p={6}>
        <Heading as="h1" size="lg" mb={4}>
          Data Explorer Capabilities
        </Heading>
        <Text mb={6} color="gray.600">
          Explore the powerful features available to streamline your data integration,
          transformation, and analysis.
        </Text>
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
          {capabilities.map((cap) => (
            <Box
              key={cap.label}
              p={4}
              borderWidth="1px"
              borderRadius="md"
              bg="white"
              _hover={{ boxShadow: 'md' }}
            >
              <VStack align="start" spacing={3}>
                <Icon as={cap.icon} boxSize={6} color="brand.500" />
                <Heading size="md">{cap.label}</Heading>
                <Text fontSize="sm" color="gray.600">
                  {cap.description}
                </Text>
              </VStack>
            </Box>
          ))}
        </SimpleGrid>
      </Box>
    </DashboardLayout>
  );
} 