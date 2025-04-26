'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Heading,
  Text,
  Card,
  CardHeader,
  CardBody,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  CircularProgress,
  Alert,
  AlertIcon,
  useColorModeValue,
  Select,
  Flex,
  Button,
  Icon,
  Badge,
  Grid,
  GridItem
} from '@chakra-ui/react';
import { 
  LineChart, Line, BarChart, Bar, PieChart, Pie, XAxis, YAxis, 
  CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell
} from 'recharts';
import { FiCalendar, FiDownload } from 'react-icons/fi';

// Types for campaign performance API response
interface CampaignPerformanceData {
  date: string;
  impressions: number;
  clicks: number;
  conversions: number;
  spend: number;
  ctr: number;
  conversion_rate: number;
  cost_per_conversion: number;
}

interface ChannelPerformance {
  channel_id: number;
  channel_name: string;
  channel_type: string;
  impressions: number;
  clicks: number;
  conversions: number;
  spend: number;
  ctr: number;
  conversion_rate: number;
}

interface CampaignData {
  id: number;
  name: string;
  type: string;
  start_date: string;
  end_date: string;
  segment_id: number;
  channel_performance: ChannelPerformance[];
}

// Mock data - would be replaced with API calls
const generatePerformanceData = (campaignId: string) => {
  // Generate some random data for demo purposes
  const days = 30;
  const timelineData = Array.from({ length: days }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (days - i - 1));
    
    return {
      date: date.toISOString().split('T')[0],
      impressions: 1000 + Math.floor(Math.random() * 5000),
      clicks: 50 + Math.floor(Math.random() * 300),
      conversions: 5 + Math.floor(Math.random() * 30),
    };
  });

  const channelData = [
    { name: 'Email', value: 30 + Math.floor(Math.random() * 40) },
    { name: 'Social', value: 20 + Math.floor(Math.random() * 30) },
    { name: 'Display', value: 15 + Math.floor(Math.random() * 25) },
    { name: 'Search', value: 25 + Math.floor(Math.random() * 35) }
  ];

  const demographicData = [
    { name: '18-24', value: 10 + Math.floor(Math.random() * 20) },
    { name: '25-34', value: 30 + Math.floor(Math.random() * 30) },
    { name: '35-44', value: 25 + Math.floor(Math.random() * 25) },
    { name: '45-54', value: 20 + Math.floor(Math.random() * 20) },
    { name: '55+', value: 15 + Math.floor(Math.random() * 15) }
  ];

  return {
    timelineData,
    channelData,
    demographicData,
    summaryMetrics: {
      impressions: timelineData.reduce((sum, day) => sum + day.impressions, 0),
      clicks: timelineData.reduce((sum, day) => sum + day.clicks, 0),
      conversions: timelineData.reduce((sum, day) => sum + day.conversions, 0),
      ctr: (timelineData.reduce((sum, day) => sum + day.clicks, 0) / timelineData.reduce((sum, day) => sum + day.impressions, 0) * 100).toFixed(2),
      conversionRate: (timelineData.reduce((sum, day) => sum + day.conversions, 0) / timelineData.reduce((sum, day) => sum + day.clicks, 0) * 100).toFixed(2),
      roas: (3.5 + Math.random() * 2).toFixed(1)
    }
  };
};

// Colors for charts
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

interface CampaignPerformanceViewProps {
  campaignId: string;
}

export default function CampaignPerformanceView({ campaignId }: CampaignPerformanceViewProps) {
  const [timeRange, setTimeRange] = useState('30d');
  const [performanceData, setPerformanceData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const cardBg = useColorModeValue('white', 'gray.800');
  
  useEffect(() => {
    // This would be replaced with an actual API call
    const data = generatePerformanceData(campaignId);
    setPerformanceData(data);
    setLoading(false);
  }, [campaignId, timeRange]);

  const handleTimeframeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setTimeRange(e.target.value);
  };

  const handleExportData = () => {
    // Implementation for exporting data to CSV
    alert('Export functionality would go here');
  };
  
  if (loading) {
    return (
      <Flex justify="center" align="center" height="500px">
        <CircularProgress isIndeterminate color="blue.500" />
      </Flex>
    );
  }
  
  if (error) {
    return (
      <Alert status="error">
        <AlertIcon />
        {error}
      </Alert>
    );
  }
  
  if (!performanceData) {
    return (
      <Alert status="info">
        <AlertIcon />
        No performance data available
      </Alert>
    );
  }

  const { timelineData, channelData, demographicData, summaryMetrics } = performanceData;

  return (
    <Box>
      <Flex justify="space-between" align="center" mb={6}>
        <Box>
          <Heading size="lg">Campaign Performance</Heading>
          <Flex mt={2} gap={2}>
            <Badge colorScheme="blue">Campaign ID: {campaignId}</Badge>
            <Text fontSize="sm" color="gray.500">
              <Icon as={FiCalendar} mr={1} />
              {timeRange}
            </Text>
          </Flex>
        </Box>
        
        <Flex gap={4}>
          <Select 
            size="sm" 
            width="150px" 
            value={timeRange} 
            onChange={handleTimeframeChange}
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="all">All time</option>
          </Select>
          
          <Button 
            size="sm" 
            leftIcon={<FiDownload />} 
            onClick={handleExportData}
          >
            Export
          </Button>
        </Flex>
      </Flex>
      
      {/* Summary Metrics */}
      <SimpleGrid columns={{ base: 2, md: 3, lg: 6 }} spacing={4} mb={8}>
        <Stat bg={cardBg} p={4} borderRadius="lg" shadow="sm">
          <StatLabel>Impressions</StatLabel>
          <StatNumber>{summaryMetrics.impressions.toLocaleString()}</StatNumber>
        </Stat>
        <Stat bg={cardBg} p={4} borderRadius="lg" shadow="sm">
          <StatLabel>Clicks</StatLabel>
          <StatNumber>{summaryMetrics.clicks.toLocaleString()}</StatNumber>
        </Stat>
        <Stat bg={cardBg} p={4} borderRadius="lg" shadow="sm">
          <StatLabel>Conversions</StatLabel>
          <StatNumber>{summaryMetrics.conversions.toLocaleString()}</StatNumber>
        </Stat>
        <Stat bg={cardBg} p={4} borderRadius="lg" shadow="sm">
          <StatLabel>CTR</StatLabel>
          <StatNumber>{summaryMetrics.ctr}%</StatNumber>
          <StatHelpText>
            <StatArrow type={parseFloat(summaryMetrics.ctr) > 2.0 ? 'increase' : 'decrease'} />
            vs. benchmark
          </StatHelpText>
        </Stat>
        <Stat bg={cardBg} p={4} borderRadius="lg" shadow="sm">
          <StatLabel>Conversion Rate</StatLabel>
          <StatNumber>{summaryMetrics.conversionRate}%</StatNumber>
          <StatHelpText>
            <StatArrow type={parseFloat(summaryMetrics.conversionRate) > 8.0 ? 'increase' : 'decrease'} />
            vs. benchmark
          </StatHelpText>
        </Stat>
        <Stat bg={cardBg} p={4} borderRadius="lg" shadow="sm">
          <StatLabel>ROAS</StatLabel>
          <StatNumber>{summaryMetrics.roas}x</StatNumber>
          <StatHelpText>
            <StatArrow type={parseFloat(summaryMetrics.roas) > 3.0 ? 'increase' : 'decrease'} />
            vs. benchmark
          </StatHelpText>
        </Stat>
      </SimpleGrid>
      
      {/* Performance over time */}
      <Box bg={cardBg} p={6} borderRadius="lg" shadow="md" mb={8}>
        <Heading size="md" mb={4}>Performance Over Time</Heading>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart
            data={timelineData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis yAxisId="left" />
            <YAxis yAxisId="right" orientation="right" />
            <Tooltip />
            <Legend />
            <Line yAxisId="left" type="monotone" dataKey="impressions" stroke="#8884d8" name="Impressions" />
            <Line yAxisId="right" type="monotone" dataKey="clicks" stroke="#82ca9d" name="Clicks" />
            <Line yAxisId="right" type="monotone" dataKey="conversions" stroke="#ff7300" name="Conversions" />
          </LineChart>
        </ResponsiveContainer>
      </Box>

      {/* Channel & Audience Distribution */}
      <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap={8}>
        <GridItem bg={cardBg} p={6} borderRadius="lg" shadow="md">
          <Heading size="md" mb={4}>Channel Performance</Heading>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={channelData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {channelData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </GridItem>
        
        <GridItem bg={cardBg} p={6} borderRadius="lg" shadow="md">
          <Heading size="md" mb={4}>Audience Demographics</Heading>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={demographicData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#8884d8" name="Response Rate">
                {demographicData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </GridItem>
      </Grid>
    </Box>
  );
} 