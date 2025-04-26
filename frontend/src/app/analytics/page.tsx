'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Heading,
  Text,
  SimpleGrid,
  Card,
  CardBody,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  Spinner,
  Flex,
  Alert,
  AlertIcon,
  useToast,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
} from '@chakra-ui/react';
import { BarChart, PieChart, LineChart, AreaChart } from '@/components/ChartRegistry';
import { useRouter, usePathname } from 'next/navigation';

// Sample data - In a real app, this would come from an API
const sampleData = {
  campaignPerformance: [
    { date: '2023-01-01', clicks: 120, impressions: 1400, conversions: 14 },
    { date: '2023-01-02', clicks: 132, impressions: 1650, conversions: 16 },
    { date: '2023-01-03', clicks: 101, impressions: 1200, conversions: 12 },
    { date: '2023-01-04', clicks: 134, impressions: 1800, conversions: 17 },
    { date: '2023-01-05', clicks: 190, impressions: 2100, conversions: 21 },
    { date: '2023-01-06', clicks: 210, impressions: 2400, conversions: 24 },
    { date: '2023-01-07', clicks: 220, impressions: 2500, conversions: 25 },
  ],
  channelBreakdown: [
    { name: 'Email', value: 4200 },
    { name: 'Social Media', value: 3800 },
    { name: 'Search', value: 2900 },
    { name: 'Display', value: 1800 },
    { name: 'Direct', value: 1200 },
  ],
  segmentPerformance: [
    { segment: 'High Value', conversionRate: 8.2, clickRate: 5.7, revenuePerUser: 85.4 },
    { segment: 'Frequent', conversionRate: 6.1, clickRate: 4.2, revenuePerUser: 52.6 },
    { segment: 'New', conversionRate: 3.7, clickRate: 3.5, revenuePerUser: 31.2 },
    { segment: 'At Risk', conversionRate: 2.8, clickRate: 2.1, revenuePerUser: 22.5 },
  ],
  monthlyTrends: [
    { month: 'Jan', revenue: 42000, cost: 18000, profit: 24000 },
    { month: 'Feb', revenue: 38000, cost: 17000, profit: 21000 },
    { month: 'Mar', revenue: 45000, cost: 19000, profit: 26000 },
    { month: 'Apr', revenue: 51000, cost: 21000, profit: 30000 },
    { month: 'May', revenue: 55000, cost: 22000, profit: 33000 },
    { month: 'Jun', revenue: 59000, cost: 24000, profit: 35000 },
  ],
  dailyTraffic: [
    { date: '2023-06-01', visitors: 1200, newUsers: 540 },
    { date: '2023-06-02', visitors: 1300, newUsers: 620 },
    { date: '2023-06-03', visitors: 1150, newUsers: 510 },
    { date: '2023-06-04', visitors: 980, newUsers: 410 },
    { date: '2023-06-05', visitors: 1400, newUsers: 680 },
    { date: '2023-06-06', visitors: 1650, newUsers: 720 },
    { date: '2023-06-07', visitors: 1720, newUsers: 760 },
    { date: '2023-06-08', visitors: 1600, newUsers: 650 },
    { date: '2023-06-09', visitors: 1580, newUsers: 630 },
    { date: '2023-06-10', visitors: 1750, newUsers: 810 },
  ],
};

export default function AnalyticsPage() {
  const toast = useToast();
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    // Simulate API call
    const fetchData = async () => {
      try {
        // In a real app, this would be an API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        setData(sampleData);
      } catch (error) {
        console.error('Error fetching analytics data:', error);
        toast({
          title: 'Error fetching data',
          description: 'Unable to load analytics data. Please try again later.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [toast]);

  // Format date strings for better display
  const formatDateLabels = (data) => {
    return data?.map(item => ({
      ...item,
      date: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    })) || [];
  };

  // Handle tab changes
  const handleTabChange = (index) => {
    setActiveTab(index);
    
    // Navigate to appropriate route based on tab index
    if (index === 1) {
      router.push('/analytics/campaigns');
    } else if (index === 2) {
      router.push('/analytics/segments');
    } else if (index === 3) {
      router.push('/analytics/channels');
    } else {
      router.push('/analytics');
    }
  };

  if (loading) {
    return (
      <Flex justify="center" align="center" h="70vh">
        <Spinner size="xl" thickness="4px" speed="0.65s" color="blue.500" />
      </Flex>
    );
  }

  return (
    <Box>
      <Heading as="h1" size="xl" mb={6}>Marketing Analytics</Heading>
      
      <Tabs 
        variant="enclosed" 
        colorScheme="blue" 
        mb={6} 
        index={activeTab}
        onChange={handleTabChange}
      >
        <TabList>
          <Tab>Dashboard</Tab>
          <Tab>Campaigns</Tab>
          <Tab>Segments</Tab>
          <Tab>Channels</Tab>
        </TabList>
        
        <TabPanels>
          {/* Dashboard Tab */}
          <TabPanel p={0} pt={4}>
            {/* KPI Stats */}
            <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6} mb={6}>
              <Card>
                <CardBody>
                  <Stat>
                    <StatLabel>Total Revenue</StatLabel>
                    <StatNumber>${(290000).toLocaleString()}</StatNumber>
                    <StatHelpText>
                      <StatArrow type="increase" />
                      8.2%
                    </StatHelpText>
                  </Stat>
                </CardBody>
              </Card>
              <Card>
                <CardBody>
                  <Stat>
                    <StatLabel>Conversion Rate</StatLabel>
                    <StatNumber>5.7%</StatNumber>
                    <StatHelpText>
                      <StatArrow type="increase" />
                      2.1%
                    </StatHelpText>
                  </Stat>
                </CardBody>
              </Card>
              <Card>
                <CardBody>
                  <Stat>
                    <StatLabel>Active Campaigns</StatLabel>
                    <StatNumber>12</StatNumber>
                    <StatHelpText>+3 from last month</StatHelpText>
                  </Stat>
                </CardBody>
              </Card>
              <Card>
                <CardBody>
                  <Stat>
                    <StatLabel>Cost Per Acquisition</StatLabel>
                    <StatNumber>$32.40</StatNumber>
                    <StatHelpText>
                      <StatArrow type="decrease" />
                      4.3%
                    </StatHelpText>
                  </Stat>
                </CardBody>
              </Card>
            </SimpleGrid>
            
            {/* Charts Row 1 */}
            <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6} mb={6}>
              <LineChart
                title="Campaign Performance Metrics"
                data={formatDateLabels(data.campaignPerformance)}
                xAxisKey="date"
                xAxisLabel="Date"
                yAxisLabel="Count"
                lines={[
                  { key: 'clicks', name: 'Clicks', color: '#1890ff' },
                  { key: 'conversions', name: 'Conversions', color: '#52c41a' }
                ]}
                height={320}
              />
              <PieChart
                title="Channel Distribution"
                data={data.channelBreakdown}
                nameKey="name"
                valueKey="value"
                donut={true}
                centerLabel="Channels"
                height={320}
              />
            </SimpleGrid>
            
            {/* Charts Row 2 */}
            <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6} mb={6}>
              <BarChart
                title="Segment Performance Comparison"
                data={data.segmentPerformance}
                xAxisKey="segment"
                xAxisLabel="Customer Segment"
                yAxisLabel="Value"
                bars={[
                  { key: 'conversionRate', name: 'Conversion Rate (%)', color: '#1890ff' },
                  { key: 'clickRate', name: 'Click Rate (%)', color: '#faad14' },
                ]}
                showGrid={true}
                height={350}
              />
              <AreaChart
                title="Revenue & Cost Trends"
                data={data.monthlyTrends}
                xAxisKey="month"
                xAxisLabel="Month"
                yAxisLabel="Amount ($)"
                areas={[
                  { key: 'revenue', name: 'Revenue', color: '#52c41a', fillOpacity: 0.6 },
                  { key: 'cost', name: 'Cost', color: '#f5222d', fillOpacity: 0.4 }
                ]}
                stacked={false}
                height={350}
              />
            </SimpleGrid>
            
            {/* Charts Row 3 */}
            <Box mb={6}>
              <AreaChart
                title="Website Traffic"
                data={formatDateLabels(data.dailyTraffic)}
                xAxisKey="date"
                xAxisLabel="Date"
                yAxisLabel="Visitors"
                areas={[
                  { key: 'visitors', name: 'Total Visitors', color: '#722ed1', fillOpacity: 0.6 },
                  { key: 'newUsers', name: 'New Users', color: '#13c2c2', fillOpacity: 0.6 }
                ]}
                stacked={false}
                referenceLine={{ y: 1500, label: 'Target', color: '#ff7300' }}
                height={300}
              />
            </Box>
          </TabPanel>
          
          {/* Campaigns Tab */}
          <TabPanel p={0} pt={4}>
            <Alert status="info" mb={4}>
              <AlertIcon />
              <Text>Campaign performance analytics will be displayed here</Text>
            </Alert>
            <AreaChart
              title="Campaign Performance Over Time"
              data={formatDateLabels(data.campaignPerformance)}
              xAxisKey="date"
              xAxisLabel="Date"
              yAxisLabel="Count"
              areas={[
                { key: 'impressions', name: 'Impressions', color: '#8884d8', fillOpacity: 0.6 },
                { key: 'clicks', name: 'Clicks', color: '#82ca9d', fillOpacity: 0.6 },
                { key: 'conversions', name: 'Conversions', color: '#ffc658', fillOpacity: 0.6 }
              ]}
              stacked={false}
              height={400}
            />
          </TabPanel>
          
          {/* Segments Tab */}
          <TabPanel p={0} pt={4}>
            <Alert status="info" mb={4}>
              <AlertIcon />
              <Text>Customer segment analytics will be displayed here</Text>
            </Alert>
            <BarChart
              title="Segment Performance by Key Metrics"
              data={data.segmentPerformance}
              xAxisKey="segment"
              xAxisLabel="Segment"
              yAxisLabel="Value"
              bars={[
                { key: 'conversionRate', name: 'Conversion Rate (%)', color: '#1890ff' },
                { key: 'clickRate', name: 'Click Rate (%)', color: '#faad14' },
                { key: 'revenuePerUser', name: 'Revenue/User ($)', color: '#52c41a' }
              ]}
              showGrid={true}
              height={400}
            />
          </TabPanel>
          
          {/* Channels Tab */}
          <TabPanel p={0} pt={4}>
            <Alert status="info" mb={4}>
              <AlertIcon />
              <Text>Marketing channel analytics will be displayed here</Text>
            </Alert>
            <PieChart
              title="Channel Performance Distribution"
              data={data.channelBreakdown}
              nameKey="name"
              valueKey="value"
              donut={false}
              height={400}
            />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
} 