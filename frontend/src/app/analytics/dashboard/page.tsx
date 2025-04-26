'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Heading,
  Text,
  SimpleGrid,
  Flex,
  Card,
  CardBody,
  CardHeader,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Icon,
  Spinner,
  Select,
  HStack,
} from '@chakra-ui/react';
import {
  FiTrendingUp,
  FiTrendingDown,
  FiDollarSign,
  FiUsers,
  FiTarget,
  FiBarChart2,
  FiPieChart,
  FiActivity,
  FiMail,
  FiSmartphone,
  FiGlobe,
  FiShare2,
} from 'react-icons/fi';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from 'recharts';

// Mock data
const generateDashboardData = () => {
  // Campaign performance summary
  const campaignPerformance = {
    totalCampaigns: Math.floor(Math.random() * 10) + 15,
    activeCampaigns: Math.floor(Math.random() * 8) + 6,
    avgCTR: (Math.random() * 5 + 1).toFixed(2),
    avgConversionRate: (Math.random() * 10 + 1).toFixed(2),
    totalSpend: Math.floor(Math.random() * 100000) + 50000,
    totalRevenue: Math.floor(Math.random() * 300000) + 150000,
    growth: (Math.random() * 20 - 5).toFixed(1),
  };

  // Channel distribution
  const channelDistribution = [
    { name: 'Email', value: 30 + Math.floor(Math.random() * 10), color: '#0088FE' },
    { name: 'Social Media', value: 20 + Math.floor(Math.random() * 10), color: '#00C49F' },
    { name: 'Search', value: 15 + Math.floor(Math.random() * 10), color: '#FFBB28' },
    { name: 'Display', value: 12 + Math.floor(Math.random() * 8), color: '#FF8042' },
    { name: 'SMS', value: 8 + Math.floor(Math.random() * 6), color: '#8884D8' },
    { name: 'Direct Mail', value: 5 + Math.floor(Math.random() * 5), color: '#E47E7B' },
  ];

  // Performance over time (last 6 months)
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
  const performanceOverTime = months.map(month => {
    return {
      month,
      revenue: Math.floor(Math.random() * 50000) + 25000,
      spend: Math.floor(Math.random() * 15000) + 10000,
      conversions: Math.floor(Math.random() * 1000) + 500,
      ctr: (Math.random() * 5 + 1).toFixed(2),
    };
  });

  // Top performing campaigns
  const topCampaigns = Array.from({ length: 5 }, (_, i) => {
    return {
      id: i + 1,
      name: `Campaign ${String.fromCharCode(65 + i)}`,
      conversions: Math.floor(Math.random() * 1000) + 200,
      spend: Math.floor(Math.random() * 10000) + 2000,
      revenue: Math.floor(Math.random() * 25000) + 5000,
      roi: (Math.random() * 5 + 1).toFixed(2),
    };
  }).sort((a, b) => parseFloat(b.roi) - parseFloat(a.roi));

  // Customer segment performance
  const segmentPerformance = [
    { name: 'High Value', conversions: 1250, revenue: 75000, ctr: 4.2 },
    { name: 'New Customers', conversions: 850, revenue: 42500, ctr: 3.1 },
    { name: 'Regulars', conversions: 950, revenue: 57000, ctr: 3.8 },
    { name: 'At Risk', conversions: 320, revenue: 19200, ctr: 2.5 },
  ];

  return {
    campaignPerformance,
    channelDistribution,
    performanceOverTime,
    topCampaigns,
    segmentPerformance,
  };
};

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#E47E7B'];

export default function DashboardPage() {
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('6months');

  // Mock fetch data
  useEffect(() => {
    setTimeout(() => {
      setDashboardData(generateDashboardData());
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) {
    return (
      <Box px={8} py={8}>
        <Flex justify="center" align="center" height="400px">
          <Spinner size="xl" />
        </Flex>
      </Box>
    );
  }

  return (
    <Box px={8} py={8}>
      <Flex justifyContent="space-between" alignItems="center" mb={6}>
        <Heading as="h1" size="xl">Marketing Analytics Dashboard</Heading>
        <Select width="200px" value={timeRange} onChange={(e) => setTimeRange(e.target.value)}>
          <option value="30days">Last 30 Days</option>
          <option value="3months">Last 3 Months</option>
          <option value="6months">Last 6 Months</option>
          <option value="12months">Last 12 Months</option>
        </Select>
      </Flex>

      {/* Main KPIs */}
      <SimpleGrid columns={{ base: 2, md: 4 }} spacing={6} mb={8}>
        <Card>
          <CardBody>
            <Stat>
              <StatLabel>Total Revenue</StatLabel>
              <StatNumber>${dashboardData.campaignPerformance.totalRevenue.toLocaleString()}</StatNumber>
              <StatHelpText>
                <Flex align="center">
                  <StatArrow 
                    type={parseFloat(dashboardData.campaignPerformance.growth) > 0 ? "increase" : "decrease"} 
                  />
                  {Math.abs(parseFloat(dashboardData.campaignPerformance.growth))}% vs previous
                </Flex>
              </StatHelpText>
            </Stat>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <Stat>
              <StatLabel>Marketing ROI</StatLabel>
              <StatNumber>
                {(dashboardData.campaignPerformance.totalRevenue / dashboardData.campaignPerformance.totalSpend).toFixed(2)}x
              </StatNumber>
              <StatHelpText>
                <Flex align="center">
                  <Icon as={FiDollarSign} mr={1} />
                  <Text>Return on investment</Text>
                </Flex>
              </StatHelpText>
            </Stat>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <Stat>
              <StatLabel>Average CTR</StatLabel>
              <StatNumber>{dashboardData.campaignPerformance.avgCTR}%</StatNumber>
              <StatHelpText>
                <Flex align="center">
                  <Icon as={FiTarget} mr={1} />
                  <Text>Click-through rate</Text>
                </Flex>
              </StatHelpText>
            </Stat>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <Stat>
              <StatLabel>Conversion Rate</StatLabel>
              <StatNumber>{dashboardData.campaignPerformance.avgConversionRate}%</StatNumber>
              <StatHelpText>
                <Flex align="center">
                  <Icon as={FiBarChart2} mr={1} />
                  <Text>Avg. across campaigns</Text>
                </Flex>
              </StatHelpText>
            </Stat>
          </CardBody>
        </Card>
      </SimpleGrid>

      {/* Performance Over Time Chart */}
      <Card mb={8}>
        <CardHeader>
          <Heading size="md">Performance Over Time</Heading>
        </CardHeader>
        <CardBody>
          <Box height="400px">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={dashboardData.performanceOverTime}
                margin={{ top: 10, right: 30, left: 30, bottom: 30 }}
              >
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#8884d8" stopOpacity={0.1} />
                  </linearGradient>
                  <linearGradient id="colorSpend" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#82ca9d" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" />
                <YAxis yAxisId="left" orientation="left" tickFormatter={(value) => `$${value/1000}k`} />
                <YAxis yAxisId="right" orientation="right" tickFormatter={(value) => `${value}`} />
                <RechartsTooltip formatter={(value, name) => {
                  if (name === 'revenue' || name === 'spend') return [`$${value.toLocaleString()}`, name.charAt(0).toUpperCase() + name.slice(1)];
                  return [value, name.charAt(0).toUpperCase() + name.slice(1)];
                }} />
                <Legend />
                <Area 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#8884d8" 
                  fillOpacity={1} 
                  fill="url(#colorRevenue)" 
                  yAxisId="left"
                  name="Revenue"
                />
                <Area 
                  type="monotone" 
                  dataKey="spend" 
                  stroke="#82ca9d" 
                  fillOpacity={1} 
                  fill="url(#colorSpend)" 
                  yAxisId="left"
                  name="Spend"
                />
                <Line 
                  type="monotone" 
                  dataKey="conversions" 
                  stroke="#ff7300" 
                  yAxisId="right"
                  name="Conversions"
                />
              </AreaChart>
            </ResponsiveContainer>
          </Box>
        </CardBody>
      </Card>

      {/* Channel & Campaign Metrics */}
      <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6} mb={8}>
        {/* Channel Distribution */}
        <Card h="100%">
          <CardHeader>
            <Heading size="md">Channel Distribution</Heading>
          </CardHeader>
          <CardBody>
            <Flex height="300px" justifyContent="center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={dashboardData.channelDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={120}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {dashboardData.channelDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color || COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <RechartsTooltip formatter={(value) => [`${value}%`, 'Contribution']} />
                </PieChart>
              </ResponsiveContainer>
            </Flex>
          </CardBody>
        </Card>

        {/* Top Campaigns */}
        <Card h="100%">
          <CardHeader>
            <Heading size="md">Top Performing Campaigns</Heading>
          </CardHeader>
          <CardBody>
            <Box height="300px">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={dashboardData.topCampaigns}
                  layout="vertical"
                  margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" tickFormatter={(value) => `${value}x`} />
                  <YAxis type="category" dataKey="name" />
                  <RechartsTooltip
                    formatter={(value, name, props) => {
                      if (name === 'roi') return [`${value}x`, 'ROI'];
                      return [value, name];
                    }}
                  />
                  <Bar dataKey="roi" fill="#8884d8" name="ROI">
                    {dashboardData.topCampaigns.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </CardBody>
        </Card>
      </SimpleGrid>

      {/* Segment Performance */}
      <Card mb={8}>
        <CardHeader>
          <Heading size="md">Customer Segment Performance</Heading>
        </CardHeader>
        <CardBody>
          <Tabs>
            <TabList>
              <Tab>Revenue</Tab>
              <Tab>Conversions</Tab>
              <Tab>CTR</Tab>
            </TabList>

            <TabPanels>
              <TabPanel p={0} pt={4}>
                <Box height="350px">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={dashboardData.segmentPerformance}
                      margin={{ top: 20, right: 30, left: 30, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis tickFormatter={(value) => `$${value/1000}k`} />
                      <RechartsTooltip formatter={(value) => [`$${value.toLocaleString()}`, 'Revenue']} />
                      <Bar dataKey="revenue" fill="#8884d8">
                        {dashboardData.segmentPerformance.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </Box>
              </TabPanel>
              <TabPanel p={0} pt={4}>
                <Box height="350px">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={dashboardData.segmentPerformance}
                      margin={{ top: 20, right: 30, left: 30, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <RechartsTooltip formatter={(value) => [value.toLocaleString(), 'Conversions']} />
                      <Bar dataKey="conversions" fill="#82ca9d">
                        {dashboardData.segmentPerformance.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </Box>
              </TabPanel>
              <TabPanel p={0} pt={4}>
                <Box height="350px">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={dashboardData.segmentPerformance}
                      margin={{ top: 20, right: 30, left: 30, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis tickFormatter={(value) => `${value}%`} />
                      <RechartsTooltip formatter={(value) => [`${value}%`, 'CTR']} />
                      <Bar dataKey="ctr" fill="#ffc658">
                        {dashboardData.segmentPerformance.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </Box>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </CardBody>
      </Card>

      {/* Campaign Status Summary */}
      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
        <Card>
          <CardBody>
            <Stat>
              <StatLabel>Total Campaigns</StatLabel>
              <Flex align="center">
                <StatNumber>{dashboardData.campaignPerformance.totalCampaigns}</StatNumber>
                <Icon as={FiActivity} ml={2} color="gray.500" />
              </Flex>
              <StatHelpText>All marketing campaigns</StatHelpText>
            </Stat>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <Stat>
              <StatLabel>Active Campaigns</StatLabel>
              <Flex align="center">
                <StatNumber>{dashboardData.campaignPerformance.activeCampaigns}</StatNumber>
                <Icon as={FiActivity} ml={2} color="green.500" />
              </Flex>
              <StatHelpText>Currently running</StatHelpText>
            </Stat>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <Stat>
              <StatLabel>Campaign Health</StatLabel>
              <HStack spacing={1} mt={2}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <Box 
                    key={i} 
                    w="100%" 
                    h="8px" 
                    borderRadius="full" 
                    bg={i < 4 ? "green.400" : "gray.200"} 
                  />
                ))}
              </HStack>
              <StatHelpText mt={2}>Overall performance: 4/5</StatHelpText>
            </Stat>
          </CardBody>
        </Card>
      </SimpleGrid>
    </Box>
  );
} 