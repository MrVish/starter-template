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
} from 'react-icons/fi';
import DashboardLayout from '../../../components/layout/DashboardLayout';

// Sample customer segments data
const CUSTOMER_SEGMENTS = [
  {
    id: 1,
    name: 'High-Value Banking',
    description: 'Customers with high account balances and frequent transactions',
    size: 15000,
    criteria: 'Balance > $100,000 OR Monthly Transactions > 50',
    engagement: 'High',
    lastUpdated: '2024-03-15',
    growth: '+12%',
    avgValue: '$250,000',
  },
  {
    id: 2,
    name: 'Digital Natives',
    description: 'Tech-savvy customers who primarily use digital banking',
    size: 45000,
    criteria: 'Digital Transactions > 80% AND Age < 35',
    engagement: 'Medium',
    lastUpdated: '2024-03-14',
    growth: '+28%',
    avgValue: '$35,000',
  },
  {
    id: 3,
    name: 'Investment Focus',
    description: 'Customers with significant investment portfolio',
    size: 8000,
    criteria: 'Investment Portfolio > $50,000',
    engagement: 'High',
    lastUpdated: '2024-03-15',
    growth: '+8%',
    avgValue: '$175,000',
  },
  {
    id: 4,
    name: 'New Account Holders',
    description: 'Customers who opened accounts in the last 6 months',
    size: 12000,
    criteria: 'Account Age < 180 days',
    engagement: 'Low',
    lastUpdated: '2024-03-15',
    growth: '+45%',
    avgValue: '$15,000',
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
      icon: FiUsers,
      color: 'blue',
    },
    {
      title: 'Total Customers',
      value: CUSTOMER_SEGMENTS.reduce((sum, segment) => sum + segment.size, 0).toLocaleString(),
      icon: FiBarChart2,
      color: 'green',
    },
    {
      title: 'Avg. Customer Value',
      value: '$118,750',
      icon: FiDollarSign,
      color: 'purple',
    },
    {
      title: 'Active Campaigns',
      value: '8',
      icon: FiShoppingBag,
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
              Customer Segments
            </Heading>
            <Text color="gray.600">
              Define and manage customer segments for targeted marketing
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
          <ModalHeader>Create Customer Segment</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <FormControl isRequired>
                <FormLabel>Segment Name</FormLabel>
                <Input placeholder="Enter segment name" />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Description</FormLabel>
                <Input placeholder="Enter segment description" />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Segment Criteria</FormLabel>
                <Select placeholder="Select primary criteria">
                  <option value="balance">Account Balance</option>
                  <option value="transactions">Transaction Volume</option>
                  <option value="age">Customer Age</option>
                  <option value="products">Number of Products</option>
                  <option value="digital">Digital Usage</option>
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