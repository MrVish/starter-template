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
  FiPieChart,
} from 'react-icons/fi';
import DashboardLayout from '../../../components/layout/DashboardLayout';

// Sample key metrics data
const KEY_METRICS = [
  {
    id: 1,
    metric: 'New Client Acquisition',
    value: '1,250',
    target: '2,000',
    period: 'Monthly',
    change: '+12.5%',
    trend: 'up',
  },
  {
    id: 2,
    metric: 'Average Assets Under Management',
    value: '$385K',
    target: '$300',
    period: 'Monthly',
    change: '+8.3%',
    trend: 'up',
  },
  {
    id: 3,
    metric: 'Client Retention Rate',
    value: '92.4%',
    target: '95%',
    period: 'Annual',
    change: '+2.1%',
    trend: 'up',
  },
  {
    id: 4,
    metric: 'Financial Advisory ROI',
    value: '387%',
    target: '450%',
    period: 'Quarterly',
    change: '+15.2%',
    trend: 'up',
  },
];

// Sample campaign performance data
const CAMPAIGN_PERFORMANCE = [
  {
    id: 1,
    name: 'Retirement Planning Webinars',
    status: 'Active',
    start: '2023-06-01',
    end: '2023-08-31',
    budget: '$85,000',
    spend: '$45,000',
    results: {
      attendees: '2,850',
      leads: '620',
      conversions: '420',
      revenue: '$128,500',
    },
  },
  {
    id: 2,
    name: 'Wealth Management Advisor Program',
    status: 'Active',
    start: '2023-05-15',
    end: '2023-09-30',
    budget: '$120,000',
    spend: '$62,500',
    results: {
      consultations: '380',
      referrals: '85',
      conversions: '280',
      revenue: '$325,000',
    },
  },
  {
    id: 3,
    name: 'Investment Portfolio Diversification',
    status: 'Active',
    start: '2023-07-01',
    end: '2023-10-31',
    budget: '$65,000',
    spend: '$35,000',
    results: {
      educational_sessions: '45',
      portfolio_reviews: '320',
      conversions: '180',
      revenue: '$185,000',
    },
  },
  {
    id: 4,
    name: 'High-Yield Savings Campaign',
    status: 'Planned',
    start: '2023-09-01',
    end: '2023-12-31',
    budget: '$70,000',
    spend: '$0',
    results: {
      account_inquiries: '0',
      new_accounts: '0',
      conversions: '0',
      revenue: '$0',
    },
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
          <Icon as={FiPieChart} boxSize={8} color="blue.500" />
          <Box>
            <Heading as="h1" size="xl" color="secondary.700">
              Strategy Insights
            </Heading>
            <Text color="gray.600">
              Analyze and track performance of your financial marketing strategies
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
          {KEY_METRICS.map((metric) => (
            <Card key={metric.id} bg={cardBg}>
              <CardBody>
                <VStack align="start" spacing={4}>
                  <Text color="gray.500">{metric.metric}</Text>
                  <HStack justify="space-between" w="full">
                    <Text fontSize="2xl" fontWeight="bold">
                      {metric.value}
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
                      <Th>Status</Th>
                      <Th>Period</Th>
                      <Th>Budget</Th>
                      <Th>Spend</Th>
                      <Th>Results</Th>
                      <Th>Actions</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {CAMPAIGN_PERFORMANCE.map((campaign) => (
                      <Tr key={campaign.id}>
                        <Td fontWeight="medium">{campaign.name}</Td>
                        <Td>
                          <Badge colorScheme={getStatusColor(campaign.status)}>
                            {campaign.status}
                          </Badge>
                        </Td>
                        <Td>
                          <VStack align="start" spacing={0}>
                            <Text fontSize="sm">{campaign.start}</Text>
                            <Text fontSize="sm">{campaign.end}</Text>
                          </VStack>
                        </Td>
                        <Td>{campaign.budget}</Td>
                        <Td>{campaign.spend}</Td>
                        <Td>
                                  {campaign.results.attendees && (
                                    <Text fontSize="sm">Attendees: {campaign.results.attendees}</Text>
                                  )}
                                  {campaign.results.leads && (
                                    <Text fontSize="sm">Leads: {campaign.results.leads}</Text>
                                  )}
                                  {campaign.results.conversions && (
                                    <Text fontSize="sm">Conversions: {campaign.results.conversions}</Text>
                                  )}
                                  {campaign.results.revenue && (
                                    <Text fontSize="sm">Revenue: {campaign.results.revenue}</Text>
                                  )}
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