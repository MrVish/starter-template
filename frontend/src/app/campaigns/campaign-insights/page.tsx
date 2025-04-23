'use client';

import { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import {
  Box,
  Heading,
  Text,
  Flex,
  Button,
  Card,
  CardBody,
  SimpleGrid,
  HStack,
  VStack,
  Icon,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  Select,
  useColorModeValue,
  Tooltip,
} from '@chakra-ui/react';
import { 
  FiBarChart2, 
  FiDollarSign, 
  FiUsers, 
  FiMail,
  FiMessageSquare,
  FiSmartphone,
  FiTrendingUp,
  FiTrendingDown,
  FiTarget,
  FiFilter,
  FiCalendar,
  FiClock,
  FiPercent,
  FiActivity,
  FiExternalLink,
  FiInfo,
  FiGlobe,
} from 'react-icons/fi';

// Sample data
const CAMPAIGN_PERFORMANCE = {
  summary: {
    totalCampaigns: 24,
    activeCampaigns: 12,
    totalSpend: 1250000,
    revenueGenerated: 3750000,
    roiPercentage: 200,
    totalLeads: 15000,
    totalConversions: 3600,
    conversionRate: 24,
    customerAcquisitionCost: 347.22,
    avgEngagementRate: 18.5,
  },
  channels: [
    { name: 'Email', budget: 350000, conversions: 1200, cpa: 291.67, roi: 220, color: 'blue.500' },
    { name: 'Social Media', budget: 280000, conversions: 950, cpa: 294.74, roi: 185, color: 'purple.500' },
    { name: 'Display', budget: 220000, conversions: 520, cpa: 423.08, roi: 140, color: 'green.500' },
    { name: 'Search', budget: 300000, conversions: 980, cpa: 306.12, roi: 195, color: 'orange.500' },
    { name: 'Direct Mail', budget: 180000, conversions: 340, cpa: 529.41, roi: 120, color: 'red.500' },
    { name: 'Mobile', budget: 120000, conversions: 410, cpa: 292.68, roi: 210, color: 'teal.500' },
  ],
  topCampaigns: [
    { 
      id: 1, 
      name: 'Spring Savings Promotion', 
      channel: 'Multi-channel', 
      budget: 180000, 
      spend: 175000, 
      revenue: 840000, 
      roi: 380,
      status: 'Active', 
      startDate: '2024-03-01', 
      endDate: '2024-04-30',
    },
    { 
      id: 2, 
      name: 'Mobile Banking App Download', 
      channel: 'Mobile/Social', 
      budget: 120000, 
      spend: 118000, 
      revenue: 540000, 
      roi: 357.6,
      status: 'Active', 
      startDate: '2024-02-15', 
      endDate: '2024-05-15',
    },
    { 
      id: 3, 
      name: 'Premium Card Offer', 
      channel: 'Email/Direct', 
      budget: 150000, 
      spend: 142000, 
      revenue: 620000, 
      roi: 336.6,
      status: 'Active', 
      startDate: '2024-03-15', 
      endDate: '2024-05-31',
    },
    { 
      id: 4, 
      name: 'Student Banking Program', 
      channel: 'Social/Display', 
      budget: 95000, 
      spend: 92000, 
      revenue: 380000, 
      roi: 313,
      status: 'Active', 
      startDate: '2024-01-10', 
      endDate: '2024-04-30',
    },
    { 
      id: 5, 
      name: 'Wealth Management Seminar', 
      channel: 'Email/Search', 
      budget: 85000, 
      spend: 82000, 
      revenue: 320000, 
      roi: 290.2,
      status: 'Completed', 
      startDate: '2024-02-01', 
      endDate: '2024-03-31',
    }
  ],
  trends: {
    months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    spend: [180000, 210000, 245000, 270000, 290000, 310000],
    revenue: [510000, 620000, 720000, 830000, 895000, 980000],
    conversions: [410, 480, 570, 630, 690, 770],
    cpa: [439, 437.5, 429.8, 428.6, 420.3, 402.6]
  }
};

const CHANNEL_ICONS = {
  'Email': FiMail,
  'Social Media': FiUsers,
  'Display': FiBarChart2,
  'Search': FiTarget,
  'Direct Mail': FiMessageSquare,
  'Mobile': FiSmartphone,
};

// Sample campaign performance data
const campaignPerformance = {
  revenueGenerated: 1250000,
  revenueChange: 12.5,
  totalReach: 520000,
  reachChange: 8.2,
  conversionRate: 3.8,
  conversionChange: 0.5,
  roiPercentage: 280,
  roiChange: 15,
  
  // Channel performance
  channelPerformance: [
    { channel: 'Email', reach: 250000, opens: 125000, openRate: 50, clicks: 37500, clickRate: 30, conversions: 7500, conversionRate: 3 },
    { channel: 'SMS', reach: 120000, opens: 108000, openRate: 90, clicks: 32400, clickRate: 30, conversions: 6480, conversionRate: 5.4 },
    { channel: 'Push', reach: 80000, opens: 64000, openRate: 80, clicks: 12800, clickRate: 20, conversions: 1920, conversionRate: 2.4 },
    { channel: 'Social', reach: 70000, opens: 70000, openRate: 100, clicks: 10500, clickRate: 15, conversions: 1575, conversionRate: 2.25 },
  ],
  
  // Top performing campaigns
  topCampaigns: [
    { name: 'Summer Promotion 2024', reach: 45000, conversions: 1440, conversionRate: 3.2, revenue: 180000, roi: 320 },
    { name: 'New Customer Welcome', reach: 12000, conversions: 684, conversionRate: 5.7, revenue: 150000, roi: 400 },
    { name: 'Credit Card Promotion', reach: 35000, conversions: 1750, conversionRate: 5.0, revenue: 262500, roi: 350 },
    { name: 'Mobile App Promo', reach: 28000, conversions: 1120, conversionRate: 4.0, revenue: 140000, roi: 280 },
    { name: 'Investment Advisory', reach: 15000, conversions: 750, conversionRate: 5.0, revenue: 225000, roi: 450 },
  ],
  
  // Customer segment performance
  segmentPerformance: [
    { segment: 'High Net Worth', reach: 20000, conversions: 1200, conversionRate: 6.0, revenue: 360000, roi: 450 },
    { segment: 'Young Professionals', reach: 100000, conversions: 4000, conversionRate: 4.0, revenue: 320000, roi: 320 },
    { segment: 'Retirees', reach: 35000, conversions: 1050, conversionRate: 3.0, revenue: 157500, roi: 210 },
    { segment: 'Students', reach: 80000, conversions: 2400, conversionRate: 3.0, revenue: 120000, roi: 240 },
    { segment: 'Small Business', reach: 15000, conversions: 900, conversionRate: 6.0, revenue: 225000, roi: 375 },
  ],
};

// Time period options
const timeOptions = [
  { value: 'last7days', label: 'Last 7 Days' },
  { value: 'last30days', label: 'Last 30 Days' },
  { value: 'last90days', label: 'Last 90 Days' },
  { value: 'lastYear', label: 'Last Year' },
  { value: 'ytd', label: 'Year to Date' },
];

export default function CampaignInsightsPage() {
  const [timePeriod, setTimePeriod] = useState('last30days');
  const [timeframe, setTimeframe] = useState('Last 6 Months');
  const [channelFilter, setChannelFilter] = useState('All Channels');
  const [activeTab, setActiveTab] = useState(0);
  
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const headerBgColor = useColorModeValue('gray.50', 'gray.700');
  const cardBg = useColorModeValue('white', 'gray.800');
  const statCardBg = useColorModeValue('blue.50', 'blue.900');
  const textColor = useColorModeValue('gray.700', 'gray.200');
  
  const sortedChannels = [...CAMPAIGN_PERFORMANCE.channels].sort((a, b) => b.roi - a.roi);
  
  const getPerformanceColor = (change) => {
    if (change > 0) return 'green';
    if (change < 0) return 'red';
    return 'gray';
  };
  
  return (
    <DashboardLayout>
      <Box px={6} py={4} maxW="1400px" mx="auto">
        <HStack justify="space-between" mb={6}>
          <Heading size="lg">Campaign Insights</Heading>
          <Select 
            value={timePeriod} 
            onChange={(e) => setTimePeriod(e.target.value)} 
            width="200px"
          >
            {timeOptions.map(option => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </Select>
        </HStack>
        
        <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={4} mb={6}>
          <Card boxShadow="sm" borderColor={borderColor}>
            <CardBody>
              <Stat>
                <HStack mb={2}>
                  <Box
                    p={2}
                    borderRadius="md"
                    bg={useColorModeValue('blue.50', 'blue.900')}
                    color={useColorModeValue('blue.500', 'blue.200')}
                  >
                    <FiDollarSign size={20} />
                  </Box>
                  <StatLabel fontSize="sm">Revenue Generated</StatLabel>
                </HStack>
                <StatNumber>${(campaignPerformance.revenueGenerated).toLocaleString()}</StatNumber>
                <StatHelpText>
                  <StatArrow type={campaignPerformance.revenueChange > 0 ? 'increase' : 'decrease'} />
                  {campaignPerformance.revenueChange}% vs previous period
                </StatHelpText>
              </Stat>
            </CardBody>
          </Card>
          
          <Card boxShadow="sm" borderColor={borderColor}>
            <CardBody>
              <Stat>
                <HStack mb={2}>
                  <Box
                    p={2}
                    borderRadius="md"
                    bg={useColorModeValue('green.50', 'green.900')}
                    color={useColorModeValue('green.500', 'green.200')}
                  >
                    <FiUsers size={20} />
                  </Box>
                  <StatLabel fontSize="sm">Total Reach</StatLabel>
                </HStack>
                <StatNumber>{(campaignPerformance.totalReach).toLocaleString()}</StatNumber>
                <StatHelpText>
                  <StatArrow type={campaignPerformance.reachChange > 0 ? 'increase' : 'decrease'} />
                  {campaignPerformance.reachChange}% vs previous period
                </StatHelpText>
              </Stat>
            </CardBody>
          </Card>
          
          <Card boxShadow="sm" borderColor={borderColor}>
            <CardBody>
              <Stat>
                <HStack mb={2}>
                  <Box
                    p={2}
                    borderRadius="md"
                    bg={useColorModeValue('purple.50', 'purple.900')}
                    color={useColorModeValue('purple.500', 'purple.200')}
                  >
                    <FiActivity size={20} />
                  </Box>
                  <StatLabel fontSize="sm">Conversion Rate</StatLabel>
                </HStack>
                <StatNumber>{campaignPerformance.conversionRate}%</StatNumber>
                <StatHelpText>
                  <StatArrow type={campaignPerformance.conversionChange > 0 ? 'increase' : 'decrease'} />
                  {campaignPerformance.conversionChange}% vs previous period
                </StatHelpText>
              </Stat>
            </CardBody>
          </Card>
          
          <Card boxShadow="sm" borderColor={borderColor}>
            <CardBody>
              <Stat>
                <HStack mb={2}>
                  <Box
                    p={2}
                    borderRadius="md"
                    bg={useColorModeValue('orange.50', 'orange.900')}
                    color={useColorModeValue('orange.500', 'orange.200')}
                  >
                    <FiTrendingUp size={20} />
                  </Box>
                  <StatLabel fontSize="sm">ROI</StatLabel>
                </HStack>
                <StatNumber>{campaignPerformance.roiPercentage}%</StatNumber>
                <StatHelpText>
                  <StatArrow type={campaignPerformance.roiChange > 0 ? 'increase' : 'decrease'} />
                  {campaignPerformance.roiChange}% vs previous period
                </StatHelpText>
              </Stat>
            </CardBody>
          </Card>
        </SimpleGrid>
        
        <Tabs colorScheme="blue" mb={6}>
          <TabList>
            <Tab>Channel Performance</Tab>
            <Tab>Top Performing Campaigns</Tab>
            <Tab>Customer Segment Performance</Tab>
          </TabList>
          
          <TabPanels>
            <TabPanel px={0}>
              <Card boxShadow="sm" borderColor={borderColor}>
                <CardBody>
                  <Heading size="md" mb={4}>Channel Performance</Heading>
                  <Box overflowX="auto">
                    <Table variant="simple">
                      <Thead bg={headerBgColor}>
                        <Tr>
                          <Th>Channel</Th>
                          <Th isNumeric>Reach</Th>
                          <Th isNumeric>Opens</Th>
                          <Th isNumeric>Open Rate</Th>
                          <Th isNumeric>Clicks</Th>
                          <Th isNumeric>Click Rate</Th>
                          <Th isNumeric>Conversions</Th>
                          <Th isNumeric>Conv. Rate</Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {campaignPerformance.channelPerformance.map((channel, index) => (
                          <Tr key={index}>
                            <Td>
                              <HStack>
                                <Box
                                  p={1}
                                  borderRadius="md"
                                  color={useColorModeValue('blue.500', 'blue.200')}
                                >
                                  {channel.channel === 'Email' && <FiMail />}
                                  {channel.channel === 'SMS' && <FiMessageSquare />}
                                  {channel.channel === 'Push' && <FiSmartphone />}
                                  {channel.channel === 'Social' && <FiGlobe />}
                                </Box>
                                <Text>{channel.channel}</Text>
                              </HStack>
                            </Td>
                            <Td isNumeric>{channel.reach.toLocaleString()}</Td>
                            <Td isNumeric>{channel.opens.toLocaleString()}</Td>
                            <Td isNumeric>{channel.openRate}%</Td>
                            <Td isNumeric>{channel.clicks.toLocaleString()}</Td>
                            <Td isNumeric>{channel.clickRate}%</Td>
                            <Td isNumeric>{channel.conversions.toLocaleString()}</Td>
                            <Td isNumeric>
                              <Badge colorScheme={getPerformanceColor(channel.conversionRate - 3)}>
                                {channel.conversionRate}%
                              </Badge>
                            </Td>
                          </Tr>
                        ))}
                      </Tbody>
                    </Table>
                  </Box>
                </CardBody>
              </Card>
            </TabPanel>
            
            <TabPanel px={0}>
              <Card boxShadow="sm" borderColor={borderColor}>
                <CardBody>
                  <Heading size="md" mb={4}>Top Performing Campaigns</Heading>
                  <Box overflowX="auto">
                    <Table variant="simple">
                      <Thead bg={headerBgColor}>
                        <Tr>
                          <Th>Campaign Name</Th>
                          <Th isNumeric>Reach</Th>
                          <Th isNumeric>Conversions</Th>
                          <Th isNumeric>Conv. Rate</Th>
                          <Th isNumeric>Revenue</Th>
                          <Th isNumeric>ROI</Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {campaignPerformance.topCampaigns.map((campaign, index) => (
                          <Tr key={index}>
                            <Td fontWeight="medium">{campaign.name}</Td>
                            <Td isNumeric>{campaign.reach.toLocaleString()}</Td>
                            <Td isNumeric>{campaign.conversions.toLocaleString()}</Td>
                            <Td isNumeric>
                              <Badge colorScheme={getPerformanceColor(campaign.conversionRate - 3)}>
                                {campaign.conversionRate}%
                              </Badge>
                            </Td>
                            <Td isNumeric>${campaign.revenue.toLocaleString()}</Td>
                            <Td isNumeric>
                              <Badge colorScheme={getPerformanceColor(campaign.roi - 300)}>
                                {campaign.roi}%
                              </Badge>
                            </Td>
                          </Tr>
                        ))}
                      </Tbody>
                    </Table>
                  </Box>
                </CardBody>
              </Card>
            </TabPanel>
            
            <TabPanel px={0}>
              <Card boxShadow="sm" borderColor={borderColor}>
                <CardBody>
                  <Heading size="md" mb={4}>Customer Segment Performance</Heading>
                  <Box overflowX="auto">
                    <Table variant="simple">
                      <Thead bg={headerBgColor}>
                        <Tr>
                          <Th>Segment</Th>
                          <Th isNumeric>Reach</Th>
                          <Th isNumeric>Conversions</Th>
                          <Th isNumeric>Conv. Rate</Th>
                          <Th isNumeric>Revenue</Th>
                          <Th isNumeric>ROI</Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {campaignPerformance.segmentPerformance.map((segment, index) => (
                          <Tr key={index}>
                            <Td fontWeight="medium">{segment.segment}</Td>
                            <Td isNumeric>{segment.reach.toLocaleString()}</Td>
                            <Td isNumeric>{segment.conversions.toLocaleString()}</Td>
                            <Td isNumeric>
                              <Badge colorScheme={getPerformanceColor(segment.conversionRate - 3)}>
                                {segment.conversionRate}%
                              </Badge>
                            </Td>
                            <Td isNumeric>${segment.revenue.toLocaleString()}</Td>
                            <Td isNumeric>
                              <Badge colorScheme={getPerformanceColor(segment.roi - 300)}>
                                {segment.roi}%
                              </Badge>
                            </Td>
                          </Tr>
                        ))}
                      </Tbody>
                    </Table>
                  </Box>
                </CardBody>
              </Card>
            </TabPanel>
          </TabPanels>
        </Tabs>
        
        <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={4}>
          <Card boxShadow="sm" borderColor={borderColor}>
            <CardBody>
              <Heading size="md" mb={4}>Campaign Recommendations</Heading>
              <VStack align="stretch" spacing={4}>
                <HStack p={4} bg={useColorModeValue('green.50', 'green.900')} borderRadius="md">
                  <Box
                    p={2}
                    borderRadius="md"
                    bg={useColorModeValue('green.100', 'green.800')}
                    color={useColorModeValue('green.500', 'green.200')}
                  >
                    <FiMail size={20} />
                  </Box>
                  <VStack align="start" spacing={0}>
                    <Text fontWeight="bold">Increase email campaign frequency for high-value segments</Text>
                    <Text fontSize="sm">Email shows the highest ROI among all channels for "High Net Worth" segments</Text>
                  </VStack>
                </HStack>
                
                <HStack p={4} bg={useColorModeValue('blue.50', 'blue.900')} borderRadius="md">
                  <Box
                    p={2}
                    borderRadius="md"
                    bg={useColorModeValue('blue.100', 'blue.800')}
                    color={useColorModeValue('blue.500', 'blue.200')}
                  >
                    <FiSmartphone size={20} />
                  </Box>
                  <VStack align="start" spacing={0}>
                    <Text fontWeight="bold">Optimize SMS content for better engagement</Text>
                    <Text fontSize="sm">SMS has high open rates but click-through rates could be improved</Text>
                  </VStack>
                </HStack>
                
                <HStack p={4} bg={useColorModeValue('purple.50', 'purple.900')} borderRadius="md">
                  <Box
                    p={2}
                    borderRadius="md"
                    bg={useColorModeValue('purple.100', 'purple.800')}
                    color={useColorModeValue('purple.500', 'purple.200')}
                  >
                    <FiUsers size={20} />
                  </Box>
                  <VStack align="start" spacing={0}>
                    <Text fontWeight="bold">Target "Young Professionals" segment for credit products</Text>
                    <Text fontSize="sm">This segment shows strong conversion rates for credit-related offers</Text>
                  </VStack>
                </HStack>
              </VStack>
            </CardBody>
          </Card>
          
          <Card boxShadow="sm" borderColor={borderColor}>
            <CardBody>
              <Heading size="md" mb={4}>Opportunity Analysis</Heading>
              <VStack align="stretch" spacing={4}>
                <Flex justify="space-between" p={4} bg={useColorModeValue('orange.50', 'orange.900')} borderRadius="md">
                  <HStack>
                    <Box
                      p={2}
                      borderRadius="md"
                      bg={useColorModeValue('orange.100', 'orange.800')}
                      color={useColorModeValue('orange.500', 'orange.200')}
                    >
                      <FiTrendingUp size={20} />
                    </Box>
                    <Text fontWeight="bold">Cross-sell opportunity</Text>
                  </HStack>
                  <Text fontWeight="bold">$420,000</Text>
                </Flex>
                
                <Flex justify="space-between" p={4} bg={useColorModeValue('teal.50', 'teal.900')} borderRadius="md">
                  <HStack>
                    <Box
                      p={2}
                      borderRadius="md"
                      bg={useColorModeValue('teal.100', 'teal.800')}
                      color={useColorModeValue('teal.500', 'teal.200')}
                    >
                      <FiUsers size={20} />
                    </Box>
                    <Text fontWeight="bold">Customer retention opportunity</Text>
                  </HStack>
                  <Text fontWeight="bold">$285,000</Text>
                </Flex>
                
                <Flex justify="space-between" p={4} bg={useColorModeValue('cyan.50', 'cyan.900')} borderRadius="md">
                  <HStack>
                    <Box
                      p={2}
                      borderRadius="md"
                      bg={useColorModeValue('cyan.100', 'cyan.800')}
                      color={useColorModeValue('cyan.500', 'cyan.200')}
                    >
                      <FiDollarSign size={20} />
                    </Box>
                    <Text fontWeight="bold">Untapped segment opportunity</Text>
                  </HStack>
                  <Text fontWeight="bold">$380,000</Text>
                </Flex>
                
                <Button colorScheme="blue" size="sm" alignSelf="flex-end">View Detailed Analysis</Button>
              </VStack>
            </CardBody>
          </Card>
        </SimpleGrid>
      </Box>
    </DashboardLayout>
  );
} 