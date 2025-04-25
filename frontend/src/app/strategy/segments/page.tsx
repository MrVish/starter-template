'use client';

import React, { useState } from 'react';
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
  Badge,
  HStack,
  VStack,
  useColorModeValue,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  FormControl,
  FormLabel,
  useDisclosure,
  Progress,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Divider,
} from '@chakra-ui/react';
import {
  FiUsers,
  FiSearch,
  FiFilter,
  FiPlus,
  FiEdit,
  FiTrash2,
  FiDownload,
  FiBarChart2,
  FiDollarSign,
  FiShoppingBag,
  FiClock,
  FiMoreVertical,
  FiLayers,
  FiActivity,
} from 'react-icons/fi';
import DashboardLayout from '../../../components/layout/DashboardLayout';

// Sample customer segments data
const CUSTOMER_SEGMENTS = [
  {
    id: 1,
    name: 'Premium Banking Clients',
    description: 'Clients with balances over $250K and active investment accounts',
    size: 23451,
    engagement: 'High',
    growth: '+12.5%',
    avgValue: '$4,850',
    lastUpdated: '2023-02-15',
  },
  {
    id: 2,
    name: 'Digital Banking Power Users',
    description: 'Clients who conduct 90%+ of transactions via mobile/web platforms',
    size: 78932,
    engagement: 'Medium',
    growth: '+8.3%',
    avgValue: '$780',
    lastUpdated: '2023-03-01',
  },
  {
    id: 3,
    name: 'Wealth Management Portfolio',
    description: 'High-net-worth clients with managed investment portfolios > $1M',
    size: 4578,
    engagement: 'Very High',
    growth: '+5.7%',
    avgValue: '$15,750',
    lastUpdated: '2023-02-28',
  },
  {
    id: 4,
    name: 'New Client Onboarding',
    description: 'Clients who opened accounts or started investment relationships in the last 6 months',
    size: 15243,
    engagement: 'Low',
    growth: '+28.9%',
    avgValue: '$625',
    lastUpdated: '2023-03-05',
  },
];

export default function CustomerSegments() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterEngagement, setFilterEngagement] = useState('All');
  const cardBg = useColorModeValue('white', 'gray.800');

  const segmentStats = [
    {
      title: 'Total Segments',
      value: CUSTOMER_SEGMENTS.length,
      icon: FiLayers,
      color: 'blue',
    },
    {
      title: 'Total Customers',
      value: CUSTOMER_SEGMENTS.reduce((sum, segment) => sum + segment.size, 0).toLocaleString(),
      icon: FiUsers,
      color: 'green',
    },
    {
      title: 'Avg. Client Value',
      value: '$975',
      icon: FiDollarSign,
      color: 'purple',
    },
    {
      title: 'Active Client Programs',
      value: '8',
      icon: FiActivity,
      color: 'orange',
    },
  ];

  const filteredSegments = CUSTOMER_SEGMENTS.filter(segment =>
    (filterEngagement === 'All' || segment.engagement === filterEngagement) &&
    segment.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getEngagementColor = (engagement: string) => {
    switch (engagement) {
      case 'High': return 'green';
      case 'Medium': return 'orange';
      case 'Low': return 'red';
      default: return 'gray';
    }
  };

  const getGrowthColor = (growth: string) => {
    const value = parseFloat(growth);
    return value > 0 ? 'green' : value < 0 ? 'red' : 'gray';
  };

  return (
    <DashboardLayout>
      <Box mb={6}>
        <HStack spacing={4} align="center" mb={6}>
          <Icon as={FiUsers} boxSize={8} color="blue.500" />
          <Box>
            <Heading as="h1" size="xl" color="secondary.700">
              Client Segments
            </Heading>
            <Text color="gray.600">
              Define and manage client segments for targeted financial marketing
            </Text>
          </Box>
        </HStack>

        {/* Segment Statistics */}
        <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6} mb={8}>
          {segmentStats.map((stat) => (
            <Card key={stat.title} bg={cardBg}>
              <CardBody>
                <Stat>
                  <Flex justify="space-between">
                    <Box>
                      <StatLabel color="gray.500">{stat.title}</StatLabel>
                      <StatNumber fontSize="2xl">{stat.value}</StatNumber>
                    </Box>
                    <Box p={2} bg={`${stat.color}.50`} borderRadius="full" color={`${stat.color}.500`}>
                      <Icon as={stat.icon} boxSize={6} />
                    </Box>
                  </Flex>
                </Stat>
              </CardBody>
            </Card>
          ))}
        </SimpleGrid>

        {/* Search and Filter */}
        <Flex gap={4} mb={6} wrap="wrap">
          <InputGroup maxW="320px">
            <InputLeftElement pointerEvents="none">
              <Icon as={FiSearch} color="gray.400" />
            </InputLeftElement>
            <Input
              placeholder="Search segments..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </InputGroup>
          <Select
            maxW="200px"
            value={filterEngagement}
            onChange={(e) => setFilterEngagement(e.target.value)}
          >
            <option value="All">All Engagement</option>
            <option value="High">High Engagement</option>
            <option value="Medium">Medium Engagement</option>
            <option value="Low">Low Engagement</option>
          </Select>
          <Button leftIcon={<Icon as={FiPlus} />} colorScheme="blue" onClick={onOpen}>
            Create Segment
          </Button>
        </Flex>

        {/* Segments Table */}
        <Card bg={cardBg}>
          <CardBody>
            <Box overflowX="auto">
              <Table variant="simple">
                <Thead>
                  <Tr>
                    <Th>Segment Name</Th>
                    <Th>Size</Th>
                    <Th>Engagement</Th>
                    <Th>Growth</Th>
                    <Th>Avg. Value</Th>
                    <Th>Last Updated</Th>
                    <Th>Actions</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {filteredSegments.map((segment) => (
                    <Tr key={segment.id}>
                      <Td>
                        <VStack align="start" spacing={1}>
                          <Text fontWeight="medium">{segment.name}</Text>
                          <Text fontSize="sm" color="gray.600" noOfLines={1}>
                            {segment.description}
                          </Text>
                        </VStack>
                      </Td>
                      <Td>{segment.size.toLocaleString()}</Td>
                      <Td>
                        <Badge colorScheme={getEngagementColor(segment.engagement)}>
                          {segment.engagement}
                        </Badge>
                      </Td>
                      <Td>
                        <Text color={getGrowthColor(segment.growth)}>
                          {segment.growth}
                        </Text>
                      </Td>
                      <Td>{segment.avgValue}</Td>
                      <Td>{segment.lastUpdated}</Td>
                      <Td>
                        <HStack spacing={2}>
                          <IconButton
                            icon={<Icon as={FiEdit} />}
                            aria-label="Edit"
                            size="sm"
                            variant="ghost"
                          />
                          <Menu>
                            <MenuButton
                              as={IconButton}
                              icon={<Icon as={FiMoreVertical} />}
                              variant="ghost"
                              size="sm"
                            />
                            <MenuList>
                              <MenuItem icon={<Icon as={FiBarChart2} />}>View Analytics</MenuItem>
                              <MenuItem icon={<Icon as={FiDownload} />}>Export Data</MenuItem>
                              <MenuItem icon={<Icon as={FiTrash2} />} color="red.500">
                                Delete Segment
                              </MenuItem>
                            </MenuList>
                          </Menu>
                        </HStack>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </Box>
          </CardBody>
        </Card>
      </Box>

      {/* Create Segment Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create Client Segment</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <FormControl isRequired>
                <FormLabel>Segment Name</FormLabel>
                <Input placeholder="Enter segment name" />
              </FormControl>
              <FormControl>
                <FormLabel>Description</FormLabel>
                <Input placeholder="Enter segment description" />
              </FormControl>
              <FormControl>
                <FormLabel>Segment Criteria</FormLabel>
                <Select>
                  <option value="balances">Account Balances</option>
                  <option value="products">Financial Products</option>
                  <option value="activity">Transaction Activity</option>
                  <option value="investmentProfile">Investment Profile</option>
                  <option value="wealthTier">Wealth Tier</option>
                </Select>
              </FormControl>
              <FormControl>
                <FormLabel>Target Size</FormLabel>
                <Input type="number" placeholder="Estimated segment size" />
              </FormControl>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button colorScheme="blue">
              Create Segment
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </DashboardLayout>
  );
} 