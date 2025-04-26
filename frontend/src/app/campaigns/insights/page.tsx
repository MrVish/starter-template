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
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  Grid,
  GridItem,
  Tooltip,
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
  FiMail,
  FiMessageSquare,
  FiSmartphone,
  FiGlobe,
  FiTarget,
  FiMoreVertical,
  FiCalendar,
  FiExternalLink,
  FiPieChart,
} from 'react-icons/fi';

// Sample campaign data
const CAMPAIGNS = [
  {
    id: 1,
    name: 'Summer Savings Promotion',
    status: 'Active',
    type: 'Email',
    startDate: '2024-03-01',
    endDate: '2024-05-31',
    audience: 'All Segments',
    audienceSize: 120000,
    budget: '$300,000',
    spent: '$150,000',
    metric: {
      reach: 98450,
      engagement: 12.5,
      conversion: 4.2,
      revenue: '$525,000',
      roi: '3.5x',
    },
    trends: {
      reach: 'up',
      engagement: 'up',
      conversion: 'down',
      revenue: 'up',
    },
  },
  {
    id: 2,
    name: 'Investment Portfolio Awareness',
    status: 'Active',
    type: 'Multi-channel',
    startDate: '2024-02-15',
    endDate: '2024-04-15',
    audience: 'High-Value Banking',
    audienceSize: 25000,
    budget: '$450,000',
    spent: '$380,000',
    metric: {
      reach: 22500,
      engagement: 18.7,
      conversion: 7.5,
      revenue: '$1,250,000',
      roi: '3.3x',
    },
    trends: {
      reach: 'up',
      engagement: 'up',
      conversion: 'up',
      revenue: 'up',
    },
  },
  {
    id: 3,
    name: 'Mobile Banking App Promotion',
    status: 'Completed',
    type: 'Digital',
    startDate: '2024-01-01',
    endDate: '2024-02-29',
    audience: 'Digital Natives',
    audienceSize: 75000,
    budget: '$200,000',
    spent: '$200,000',
    metric: {
      reach: 65000,
      engagement: 22.3,
      conversion: 9.8,
      revenue: '$820,000',
      roi: '4.1x',
    },
    trends: {
      reach: 'up',
      engagement: 'up',
      conversion: 'up',
      revenue: 'up',
    },
  },
  {
    id: 4,
    name: 'New Customer Welcome Series',
    status: 'Active',
    type: 'Email',
    startDate: '2024-01-15',
    endDate: 'Ongoing',
    audience: 'New Account Holders',
    audienceSize: 8500,
    budget: '$85,000',
    spent: '$45,000',
    metric: {
      reach: 8200,
      engagement: 42.5,
      conversion: 12.8,
      revenue: '$320,000',
      roi: '7.1x',
    },
    trends: {
      reach: 'up',
      engagement: 'up',
      conversion: 'up',
      revenue: 'up',
    },
  },
];

// Channel performance data
const CHANNEL_PERFORMANCE = [
  { channel: 'Email', volume: 850000, engagement: 18.5, conversion: 4.8, roi: 3.2 },
  { channel: 'Mobile App', volume: 420000, engagement: 32.4, conversion: 8.6, roi: 4.8 },
  { channel: 'Social Media', volume: 1250000, engagement: 8.2, conversion: 1.5, roi: 2.5 },
  { channel: 'SMS', volume: 180000, engagement: 92.5, conversion: 6.2, roi: 3.8 },
  { channel: 'Web', volume: 2800000, engagement: 4.6, conversion: 2.1, roi: 3.1 },
];

export default function CampaignInsights() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [activeTab, setActiveTab] = useState(0);
  const [timeRange, setTimeRange] = useState('90d');
  const cardBg = useColorModeValue('white', 'gray.800');

  const filteredCampaigns = CAMPAIGNS.filter(campaign =>
    (filterStatus === 'All' || campaign.status === filterStatus) &&
    campaign.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'green';
      case 'Completed': return 'blue';
      case 'Scheduled': return 'orange';
      case 'Draft': return 'gray';
      default: return 'gray';
    }
  };

  const getTrendIcon = (trend: string) => {
    return trend === 'up' ? 'increase' : 'decrease';
  };

  const getTrendColor = (trend: string) => {
    return trend === 'up' ? 'green.500' : 'red.500';
  };

  const formatNumber = (num: number) => {
    return num >= 1000000
      ? `${(num / 1000000).toFixed(1)}M`
      : num >= 1000
      ? `${(num / 1000).toFixed(1)}K`
      : num.toString();
  };

  const getCampaignTypeIcon = (type: string) => {
    switch (type) {
      case 'Email': return FiMail;
      case 'SMS': return FiMessageSquare;
      case 'Mobile': return FiSmartphone;
      case 'Digital': return FiGlobe;
      case 'Multi-channel': return FiTarget;
      default: return FiBarChart2;
    }
  };

  // Calculate overall metrics
  const overallMetrics = {
    activeCount: CAMPAIGNS.filter(c => c.status === 'Active').length,
    totalRevenue: CAMPAIGNS.reduce((sum, campaign) => {
      const revenue = campaign.metric.revenue.replace('$', '').replace(',', '');
      return sum + parseFloat(revenue);
    }, 0),
    avgRoi: CAMPAIGNS.reduce((sum, campaign) => {
      const roi = parseFloat(campaign.metric.roi.replace('x', ''));
      return sum + roi;
    }, 0) / CAMPAIGNS.length,
    avgConversion: CAMPAIGNS.reduce((sum, campaign) => sum + campaign.metric.conversion, 0) / CAMPAIGNS.length,
  };

  return (
    <Box mb={6}>
      <HStack spacing={4} align="center" mb={6}>
        <Icon as={FiBarChart2} boxSize={8} color="blue.500" />
        <Box>
          <Heading size="lg">Campaign Insights</Heading>
          <Text color="gray.500">Track and analyze your marketing campaign performance</Text>
        </Box>
      </HStack>

      <Flex justify="space-between" mb={6} flexWrap="wrap" gap={4}>
        <HStack>
          <Text fontWeight="bold">Performance Period:</Text>
          <Select
            maxW="200px"
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
          >
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last 90 Days</option>
            <option value="6m">Last 6 Months</option>
            <option value="1y">Last Year</option>
          </Select>
        </HStack>
        <Button leftIcon={<Icon as={FiDownload} />} colorScheme="blue" variant="outline">
          Export Report
        </Button>
      </Flex>

      {/* Key Metrics */}
      <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6} mb={8}>
        <Card bg={cardBg}>
          <CardBody>
            <Stat>
              <StatLabel color="gray.500">Active Campaigns</StatLabel>
              <StatNumber>{overallMetrics.activeCount}</StatNumber>
              <StatHelpText>
                <StatArrow type="increase" />
                23.36%
              </StatHelpText>
            </Stat>
          </CardBody>
        </Card>
        <Card bg={cardBg}>
          <CardBody>
            <Stat>
              <StatLabel color="gray.500">Total Revenue</StatLabel>
              <StatNumber>${formatNumber(overallMetrics.totalRevenue)}</StatNumber>
              <StatHelpText>
                <StatArrow type="increase" />
                32.8%
              </StatHelpText>
            </Stat>
          </CardBody>
        </Card>
        <Card bg={cardBg}>
          <CardBody>
            <Stat>
              <StatLabel color="gray.500">Average ROI</StatLabel>
              <StatNumber>{overallMetrics.avgRoi.toFixed(1)}x</StatNumber>
              <StatHelpText>
                <StatArrow type="increase" />
                12.5%
              </StatHelpText>
            </Stat>
          </CardBody>
        </Card>
        <Card bg={cardBg}>
          <CardBody>
            <Stat>
              <StatLabel color="gray.500">Average Conversion</StatLabel>
              <StatNumber>{overallMetrics.avgConversion.toFixed(1)}%</StatNumber>
              <StatHelpText>
                <StatArrow type="increase" />
                8.2%
              </StatHelpText>
            </Stat>
          </CardBody>
        </Card>
      </SimpleGrid>

      <Tabs colorScheme="blue" index={activeTab} onChange={(index) => setActiveTab(index)} mb={6}>
        <TabList>
          <Tab>Campaigns Overview</Tab>
          <Tab>Channel Performance</Tab>
          <Tab>Audience Insights</Tab>
        </TabList>

        <TabPanels>
          {/* Campaigns Overview Tab */}
          <TabPanel px={0}>
            {/* Search and Filter */}
            <Flex gap={4} mb={6} wrap="wrap">
              <InputGroup maxW="320px">
                <InputLeftElement pointerEvents="none">
                  <Icon as={FiSearch} color="gray.400" />
                </InputLeftElement>
                <Input
                  placeholder="Search campaigns..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </InputGroup>
              <Select
                maxW="200px"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="All">All Status</option>
                <option value="Active">Active</option>
                <option value="Completed">Completed</option>
                <option value="Scheduled">Scheduled</option>
                <option value="Draft">Draft</option>
              </Select>
            </Flex>

            {/* Campaigns Table */}
            <Card bg={cardBg}>
              <CardBody>
                <Box overflowX="auto">
                  <Table variant="simple">
                    <Thead>
                      <Tr>
                        <Th>Campaign</Th>
                        <Th>Type</Th>
                        <Th>Audience</Th>
                        <Th>Period</Th>
                        <Th>Budget</Th>
                        <Th>Reach</Th>
                        <Th>Engagement</Th>
                        <Th>Conversion</Th>
                        <Th>Revenue</Th>
                        <Th>ROI</Th>
                        <Th>Status</Th>
                        <Th>Actions</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {filteredCampaigns.map((campaign) => (
                        <Tr key={campaign.id}>
                          <Td fontWeight="medium">{campaign.name}</Td>
                          <Td>
                            <HStack>
                              <Icon as={getCampaignTypeIcon(campaign.type)} color="blue.500" />
                              <Text>{campaign.type}</Text>
                            </HStack>
                          </Td>
                          <Td>
                            <VStack align="start" spacing={0}>
                              <Text>{campaign.audience}</Text>
                              <Text fontSize="xs" color="gray.500">
                                {formatNumber(campaign.audienceSize)} contacts
                              </Text>
                            </VStack>
                          </Td>
                          <Td>
                            <VStack align="start" spacing={0}>
                              <Text>{campaign.startDate}</Text>
                              <Text fontSize="xs" color="gray.500">
                                {campaign.endDate}
                              </Text>
                            </VStack>
                          </Td>
                          <Td>
                            <VStack align="start" spacing={0}>
                              <Text>{campaign.budget}</Text>
                              <Text fontSize="xs" color="gray.500">
                                {campaign.spent} spent
                              </Text>
                            </VStack>
                          </Td>
                          <Td>
                            <HStack>
                              <Text>{formatNumber(campaign.metric.reach)}</Text>
                              <Stat display="inline" ml={0} lineHeight="1">
                                <StatArrow type={getTrendIcon(campaign.trends.reach)} color={getTrendColor(campaign.trends.reach)} />
                              </Stat>
                            </HStack>
                          </Td>
                          <Td>
                            <HStack>
                              <Text>{campaign.metric.engagement}%</Text>
                              <Stat display="inline" ml={0} lineHeight="1">
                                <StatArrow type={getTrendIcon(campaign.trends.engagement)} color={getTrendColor(campaign.trends.engagement)} />
                              </Stat>
                            </HStack>
                          </Td>
                          <Td>
                            <HStack>
                              <Text>{campaign.metric.conversion}%</Text>
                              <Stat display="inline" ml={0} lineHeight="1">
                                <StatArrow type={getTrendIcon(campaign.trends.conversion)} color={getTrendColor(campaign.trends.conversion)} />
                              </Stat>
                            </HStack>
                          </Td>
                          <Td>
                            <HStack>
                              <Text>{campaign.metric.revenue}</Text>
                              <Stat display="inline" ml={0} lineHeight="1">
                                <StatArrow type={getTrendIcon(campaign.trends.revenue)} color={getTrendColor(campaign.trends.revenue)} />
                              </Stat>
                            </HStack>
                          </Td>
                          <Td fontWeight="bold" color="green.500">
                            {campaign.metric.roi}
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
                                <MenuItem icon={<Icon as={FiBarChart2} />}>Detailed Analytics</MenuItem>
                                <MenuItem icon={<Icon as={FiExternalLink} />}>View Campaign</MenuItem>
                                <MenuItem icon={<Icon as={FiCalendar} />}>Schedule Report</MenuItem>
                                <MenuItem icon={<Icon as={FiDownload} />}>Export Data</MenuItem>
                              </MenuList>
                            </Menu>
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </Box>
              </CardBody>
            </Card>
          </TabPanel>

          {/* Channel Performance Tab */}
          <TabPanel px={0}>
            <Grid templateColumns={{ base: '1fr', lg: '2fr 1fr' }} gap={6}>
              <GridItem>
                <Card bg={cardBg} mb={6}>
                  <CardBody>
                    <VStack align="start" spacing={6}>
                      <Heading size="md">Channel Performance Comparison</Heading>
                      <Box w="full" h="300px" bg="gray.50" borderRadius="md" p={4}>
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
                <Card bg={cardBg} mb={6}>
                  <CardBody>
                    <VStack align="start" spacing={6}>
                      <Heading size="md">Channel ROI</Heading>
                      <Box w="full" h="300px" bg="gray.50" borderRadius="md" p={4}>
                        {/* Placeholder for chart */}
                        <Flex h="full" align="center" justify="center">
                          <Text color="gray.500">ROI Chart</Text>
                        </Flex>
                      </Box>
                    </VStack>
                  </CardBody>
                </Card>
              </GridItem>
            </Grid>

            <Card bg={cardBg}>
              <CardBody>
                <Heading size="md" mb={4}>Channel Metrics</Heading>
                <Box overflowX="auto">
                  <Table variant="simple">
                    <Thead>
                      <Tr>
                        <Th>Channel</Th>
                        <Th>Volume</Th>
                        <Th>Engagement Rate</Th>
                        <Th>Conversion Rate</Th>
                        <Th>ROI</Th>
                        <Th>Performance</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {CHANNEL_PERFORMANCE.map((channel) => (
                        <Tr key={channel.channel}>
                          <Td fontWeight="medium">
                            <HStack>
                              <Icon 
                                as={
                                  channel.channel === 'Email' ? FiMail :
                                  channel.channel === 'Mobile App' ? FiSmartphone :
                                  channel.channel === 'Social Media' ? FiTarget :
                                  channel.channel === 'SMS' ? FiMessageSquare :
                                  FiGlobe
                                } 
                                color="blue.500" 
                              />
                              <Text>{channel.channel}</Text>
                            </HStack>
                          </Td>
                          <Td>{formatNumber(channel.volume)}</Td>
                          <Td>{channel.engagement.toFixed(1)}%</Td>
                          <Td>{channel.conversion.toFixed(1)}%</Td>
                          <Td fontWeight="bold" color="green.500">{channel.roi.toFixed(1)}x</Td>
                          <Td>
                            <Progress 
                              value={channel.roi / 5 * 100} 
                              colorScheme={channel.roi > 4 ? "green" : channel.roi > 3 ? "blue" : "orange"} 
                              size="sm" 
                              borderRadius="full" 
                              w="100px"
                            />
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </Box>
              </CardBody>
            </Card>
          </TabPanel>

          {/* Audience Insights Tab */}
          <TabPanel px={0}>
            <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6} mb={6}>
              <Card bg={cardBg}>
                <CardBody>
                  <VStack align="start" spacing={6}>
                    <Heading size="md">Segment Performance</Heading>
                    <Box w="full" h="300px" bg="gray.50" borderRadius="md" p={4}>
                      {/* Placeholder for chart */}
                      <Flex h="full" align="center" justify="center">
                        <Text color="gray.500">Segment Performance Chart</Text>
                      </Flex>
                    </Box>
                  </VStack>
                </CardBody>
              </Card>
              <Card bg={cardBg}>
                <CardBody>
                  <VStack align="start" spacing={6}>
                    <Heading size="md">Audience Engagement by Channel</Heading>
                    <Box w="full" h="300px" bg="gray.50" borderRadius="md" p={4}>
                      {/* Placeholder for chart */}
                      <Flex h="full" align="center" justify="center">
                        <Text color="gray.500">Audience Engagement Chart</Text>
                      </Flex>
                    </Box>
                  </VStack>
                </CardBody>
              </Card>
            </SimpleGrid>

            <Card bg={cardBg}>
              <CardBody>
                <Heading size="md" mb={4}>Audience Insights</Heading>
                <Text color="gray.600" mb={8}>
                  Analysis of audience engagement patterns and conversion rates across different segments and campaigns.
                </Text>
                
                <Box w="full" h="400px" bg="gray.50" borderRadius="md" p={4}>
                  {/* Placeholder for advanced audience insights visualization */}
                  <Flex h="full" align="center" justify="center">
                    <Text color="gray.500">Audience Insights Visualization</Text>
                  </Flex>
                </Box>
              </CardBody>
            </Card>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
} 