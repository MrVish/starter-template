'use client';
// Add use client directive to ensure Icon components work

import React from 'react';
import { SimpleGrid, Box, Heading, Text, Button, VStack, Image, Icon } from '@chakra-ui/react';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import Link from 'next/link';
import { FiDatabase, FiCloud, FiTool, FiFileText, FiServer } from 'react-icons/fi';

const sources = [
  { image: 'https://cdn.svgporn.com/logos/mysql.svg', label: 'SQL Database', href: '#' },
  { icon: FiCloud, label: 'AWS S3', href: '#' },
  { image: 'https://cdn.svgporn.com/logos/google-cloud.svg', label: 'GCP Storage', href: '#' },
  { image: 'https://cdn.svgporn.com/logos/microsoft-azure.svg', label: 'Azure Blob', href: '#' },
  { image: 'https://cdn.svgporn.com/logos/salesforce.svg', label: 'Salesforce', href: '#' },
  { image: 'https://cdn.svgporn.com/logos/snowflake.svg', label: 'Snowflake', href: '#' },
  { image: 'https://cdn.svgporn.com/logos/json.svg', label: 'JSON File', href: '#' },
  { icon: FiFileText, label: 'CSV File', href: '#' },
];

export default function ConnectDataPage() {
  return (
    <DashboardLayout>
      <Box p={6}>
        <Heading as="h1" size="lg" mb={4}>Connect Data Sources</Heading>
        <Text mb={6}>Choose from a variety of data sources to connect and integrate.</Text>
        <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6}>
          {sources.map((src) => (
            <Box key={src.label} p={4} borderWidth="1px" borderRadius="md" bg="white">
              <VStack spacing={3} align="center">
                {src.image ? (
                  <Image src={src.image} alt={src.label} boxSize={12} objectFit="contain" />
                ) : (
                  <Icon as={src.icon} boxSize={12} color="brand.500" />
                )}
                <Text fontWeight="semibold" textAlign="center">{src.label}</Text>
                <Button size="sm" colorScheme="brand">Connect</Button>
              </VStack>
            </Box>
          ))}
        </SimpleGrid>
      </Box>
    </DashboardLayout>
  );
} 