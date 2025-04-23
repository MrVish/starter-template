'use client';

import React, { useState, useMemo } from 'react';
import {
  Box,
  Heading,
  Text,
  SimpleGrid,
  Card,
  CardBody,
  Button,
  Flex,
  Icon,
  Input,
  InputGroup,
  InputLeftElement,
  Select,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Tag,
  Badge,
  HStack,
  VStack,
  useColorModeValue,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
} from '@chakra-ui/react';
import {
  FiDatabase,
  FiSearch,
  FiFilter,
  FiDownload,
  FiUpload,
  FiUsers,
  FiMail,
  FiDollarSign,
  FiPieChart,
  FiMoreVertical,
  FiShoppingCart,
  FiEye,
  FiCalendar,
  FiExternalLink,
  FiSend,
  FiTrendingUp,
  FiShare2,
  FiZap,
} from 'react-icons/fi';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Link from 'next/link';

// Sample data sources
const DATA_SOURCES = [
  {
    id: 1,
    name: 'Customer Demographics',
    type: 'Customer Data',
    records: '150,000',
    lastUpdated: '2024-03-15',
    status: 'Active',
  },
  {
    id: 2,
    name: 'Campaign Performance',
    type: 'Campaign Data',
    records: '50,000',
    lastUpdated: '2024-03-14',
    status: 'Active',
  },
  {
    id: 3,
    name: 'Email Engagement',
    type: 'Interaction Data',
    records: '250,000',
    lastUpdated: '2024-03-15',
    status: 'Active',
  },
  {
    id: 4,
    name: 'Transaction History',
    type: 'Financial Data',
    records: '1,000,000',
    lastUpdated: '2024-03-15',
    status: 'Active',
  },
];

export default function DataExplorerPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('All');
  const cardBg = useColorModeValue('white', 'gray.800');

  const dataCategories = [
    {
      title: 'Customer Data',
      icon: FiUsers,
      count: '150K',
      description: 'Demographics and profiles',
    },
    {
      title: 'Campaign Data',
      icon: FiPieChart,
      count: '50K',
      description: 'Campaign performance metrics',
    },
    {
      title: 'Interaction Data',
      icon: FiMail,
      count: '250K',
      description: 'Email and engagement metrics',
    },
    {
      title: 'Financial Data',
      icon: FiDollarSign,
      count: '1M',
      description: 'Transaction and revenue data',
    },
  ];

  const filteredData = DATA_SOURCES.filter(item => 
    (filterType === 'All' || item.type === filterType) &&
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <DashboardLayout>
      <Box p={6}>
        <Heading as="h1" size="lg" mb={4}>Data Explorer</Heading>
        <Text mb={6}>Overview of data connections and lineage capabilities.</Text>
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
          <Box p={4} borderRadius="md" borderWidth="1px" bg="white">
            <VStack align="start" spacing={4}>
              <Icon as={FiDatabase} boxSize={6} color="brand.500" />
              <Heading size="md">Connect Data</Heading>
              <Text fontSize="sm">Connect to various data sources such as SQL databases, cloud storage, and more.</Text>
              <Link href="/data/connect" passHref>
                <Button as="a" colorScheme="brand">Go to Connect Data</Button>
              </Link>
            </VStack>
          </Box>
          <Box p={4} borderRadius="md" borderWidth="1px" bg="white">
            <VStack align="start" spacing={4}>
              <Icon as={FiShare2} boxSize={6} color="brand.500" />
              <Heading size="md">Data Lineage</Heading>
              <Text fontSize="sm">Visualize the flow of data through your pipelines and transformations.</Text>
              <Link href="/data/lineage" passHref>
                <Button as="a" colorScheme="brand">Go to Data Lineage</Button>
              </Link>
            </VStack>
          </Box>
        </SimpleGrid>
      </Box>
    </DashboardLayout>
  );
} 