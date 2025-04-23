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
  Progress,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Divider,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Grid,
  GridItem,
} from '@chakra-ui/react';
import {
  FiBarChart2,
  FiSearch,
  FiFilter,
  FiDownload,
  FiTrendingUp,
  FiTrendingDown,
  FiDollarSign,
  FiUsers,
  FiShoppingBag,
  FiClock,
  FiMoreVertical,
  FiCalendar,
} from 'react-icons/fi';
import DashboardLayout from '../../../components/layout/DashboardLayout';

// Sample performance data
const PERFORMANCE_METRICS = [
  {
    id: 1,
    metric: 'Customer Acquisition',
    current: 1250,
    previous: 980,
    change: '+27.6%',
    trend: 'up',
    target: 1500,
  },
  {
    id: 2,
    metric: 'Average Revenue per Customer',
    current: '$850',
    previous: '$720',
    change: '+18.1%',
    trend: 'up',
    target: '$1000',
  },
  {
    id: 3,
    metric: 'Customer Retention Rate',
    current: '92%',
    previous: '88%',
    change: '+4.5%',
    trend: 'up',
    target: '95%',
  },
  {
    id: 4,
    metric: 'Marketing ROI',
    current: '3.2x',
    previous: '2.8x',
    change: '+14.3%',
    trend: 'up',
    target: '4.0x',
  },
];

// Sample campaign performance data
const CAMPAIGN_PERFORMANCE = [
  {
    id: 1,
    name: 'Q1 Digital Banking Push',
    channel: 'Digital',
    startDate: '2024-01-01',
    endDate: '2024-03-31',
    budget: '$500,000',
    spend: '$450,000',
    revenue: '$1,800,000',
    roi: '3.6x',
    status: 'Completed',
  },
  {
    id: 2,
    name: 'Investment Products Campaign',
    channel: 'Email',
    startDate: '2024-02-15',
    endDate: '2024-03-15',
    budget: '$250,000',
    spend: '$200,000',
    revenue: '$750,000',
    roi: '3.0x',
    status: 'Completed',
  },
  {
    id: 3,
    name: 'Summer Savings Promotion',
    channel: 'Social',
    startDate: '2024-03-01',
    endDate: '2024-05-31',
    budget: '$300,000',
    spend: '$150,000',
    revenue: '$450,000',
    roi: '2.0x',
    status: 'In Progress',
  },
];

export default function StrategyInsights() {
  const [timeRange, setTimeRange] = useState('30d');
  const cardBg = useColorModeValue('white', 'gray.800');

  const getTrendColor = (trend: string) => {
    return trend === 'up' ? 'green' : 'red';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': return 'green';
      case 'In Progress': return 'blue';
      case 'Planned': return 'orange';
      default: return 'gray';
    }
  };

  return (
    <DashboardLayout>
      <Box mb={6}>
        <HStack spacing={4} align="center" mb={6}>
          <Icon as={FiBarChart2} boxSize={8} color="blue.500" />
          <Box>
            <Heading as="h1" size="xl" color="secondary.700">
              Strategy Insights
            </Heading>
            <Text color="gray.600">
              Analyze marketing performance and strategy effectiveness
            </Text>
          </Box>
        </HStack>

        {/* Time Range Selector */}
        <Flex justify="flex-end" mb={6}>
          <Select
            maxW="200px"
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
          >
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last 90 Days</option>
            <option value="1y">Last Year</option>
          </Select>
        </Flex>

        {/* Performance Metrics */}
        <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6} mb={8}>
          {PERFORMANCE_METRICS.map((metric) => (
            <Card key={metric.id} bg={cardBg}>
              <CardBody>
                <VStack align="start" spacing={4}>
                  <Text color="gray.500">{metric.metric}</Text>
                  <HStack justify="space-between" w="full">
                    <Text fontSize="2xl" fontWeight="bold">
                      {metric.current}
                    </Text>
                    <Badge
                      colorScheme={getTrendColor(metric.trend)}
                      display="flex"
                      alignItems="center"
                      gap={1}
                    >
                      <Icon as={metric.trend === 'up' ? FiTrendingUp : FiTrendingDown} />
                      {metric.change}
                    </Badge>
                  </HStack>
                  <Box w="full">
                    <Text fontSize="sm" color="gray.500" mb={1}>
                      Progress to Target
                    </Text>
                    <Progress
                      value={70}
                      colorScheme={getTrendColor(metric.trend)}
                      size="sm"
                      borderRadius="full"
                    />
                  </Box>
                </VStack>
              </CardBody>
            </Card>
          ))}
        </SimpleGrid>

        {/* Campaign Performance */}
        <Card bg={cardBg} mb={8}>
          <CardBody>
            <VStack align="start" spacing={6}>
              <HStack justify="space-between" w="full">
                <Heading size="md">Campaign Performance</Heading>
                <Button leftIcon={<Icon as={FiDownload} />} variant="ghost">
                  Export
                </Button>
              </HStack>
              <Box overflowX="auto" w="full">
                <Table variant="simple">
                  <Thead>
                    <Tr>
                      <Th>Campaign Name</Th>
                      <Th>Channel</Th>
                      <Th>Period</Th>
                      <Th>Budget</Th>
                      <Th>Spend</Th>
                      <Th>Revenue</Th>
                      <Th>ROI</Th>
                      <Th>Status</Th>
                      <Th>Actions</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {CAMPAIGN_PERFORMANCE.map((campaign) => (
                      <Tr key={campaign.id}>
                        <Td fontWeight="medium">{campaign.name}</Td>
                        <Td>{campaign.channel}</Td>
                        <Td>
                          <VStack align="start" spacing={0}>
                            <Text fontSize="sm">{campaign.startDate}</Text>
                            <Text fontSize="sm">{campaign.endDate}</Text>
                          </VStack>
                        </Td>
                        <Td>{campaign.budget}</Td>
                        <Td>{campaign.spend}</Td>
                        <Td>{campaign.revenue}</Td>
                        <Td>
                          <Badge colorScheme={parseFloat(campaign.roi) >= 3 ? 'green' : 'orange'}>
                            {campaign.roi}
                          </Badge>
                        </Td>
                        <Td>
                          <Badge colorScheme={getStatusColor(campaign.status)}>
                            {campaign.status}
                          </Badge>
                        </Td>
                        <Td>
                          <Menu>
                            <MenuButton
                              as={IconButton}
                              icon={<Icon as={FiMoreVertical} />}
                              variant="ghost"
                              size="sm"
                            />
                            <MenuList>
                              <MenuItem icon={<Icon as={FiBarChart2} />}>View Details</MenuItem>
                              <MenuItem icon={<Icon as={FiDownload} />}>Export Data</MenuItem>
                            </MenuList>
                          </Menu>
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </Box>
            </VStack>
          </CardBody>
        </Card>

        {/* Channel Performance */}
        <Grid templateColumns={{ base: '1fr', lg: '2fr 1fr' }} gap={6}>
          <GridItem>
            <Card bg={cardBg}>
              <CardBody>
                <VStack align="start" spacing={6}>
                  <Heading size="md">Channel Performance</Heading>
                  <Box w="full" h="300px" bg="gray.50" borderRadius="md">
                    {/* Placeholder for chart */}
                    <Flex h="full" align="center" justify="center">
                      <Text color="gray.500">Channel Performance Chart</Text>
                    </Flex>
                  </Box>
                </VStack>
              </CardBody>
            </Card>
          </GridItem>
          <GridItem>
            <Card bg={cardBg}>
              <CardBody>
                <VStack align="start" spacing={6}>
                  <Heading size="md">Top Performing Segments</Heading>
                  <VStack align="start" spacing={4} w="full">
                    {['High-Value Banking', 'Digital Natives', 'Investment Focus'].map((segment) => (
                      <Box key={segment} w="full">
                        <HStack justify="space-between" mb={1}>
                          <Text fontWeight="medium">{segment}</Text>
                          <Text color="green.500">+15%</Text>
                        </HStack>
                        <Progress value={75} colorScheme="green" size="sm" borderRadius="full" />
                      </Box>
                    ))}
                  </VStack>
                </VStack>
              </CardBody>
            </Card>
          </GridItem>
        </Grid>
      </Box>
    </DashboardLayout>
  );
} 