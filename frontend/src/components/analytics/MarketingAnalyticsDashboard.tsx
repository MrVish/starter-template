import React, { useState, useEffect } from 'react';
import {
  Box,
  SimpleGrid,
  Text,
  Heading,
  Card,
  CardHeader,
  CardBody,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  CircularProgress,
  Alert,
  AlertIcon,
  useColorModeValue,
  Flex,
  Icon
} from '@chakra-ui/react';
import { 
  LineChart, Line, BarChart, Bar, PieChart, Pie, XAxis, YAxis, 
  CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell
} from 'recharts';
import { FiUsers, FiTarget, FiBarChart2, FiSend } from 'react-icons/fi';

// Mock data structure that matches our backend response format
interface DashboardData {
  active_campaigns: number;
  total_customers: number;
  monthly_metrics: {
    impressions: number;
    clicks: number;
    conversions: number;
    spend: number;
    ctr: number;
    conversion_rate: number;
  };
  channel_distribution: {
    name: string;
    value: number;
  }[];
  segment_distribution: {
    segment_id: number;
    segment_name: string;
    customer_count: number;
  }[];
}

// Sample data to use until the API is connected
const sampleData: DashboardData = {
  active_campaigns: 12,
  total_customers: 5423,
  monthly_metrics: {
    impressions: 125000,
    clicks: 12500,
    conversions: 1250,
    spend: 5000,
    ctr: 0.1,
    conversion_rate: 0.1
  },
  channel_distribution: [
    { name: 'Email', value: 45000 },
    { name: 'SMS', value: 15000 },
    { name: 'Social Media', value: 35000 },
    { name: 'Web', value: 30000 }
  ],
  segment_distribution: [
    { segment_id: 1, segment_name: 'High Value', customer_count: 1250 },
    { segment_id: 2, segment_name: 'At Risk', customer_count: 850 },
    { segment_id: 3, segment_name: 'New Customers', customer_count: 1200 },
    { segment_id: 4, segment_name: 'Regular', customer_count: 2123 }
  ]
};

// Color scheme for charts
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

export default function MarketingAnalyticsDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const cardBg = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.800', 'white');
  
  useEffect(() => {
    // Fetch data from API
    const fetchData = async () => {
      try {
        setLoading(true);
        // Replace with actual API call when backend is ready
        // const response = await fetch('/api/v1/analytics/dashboard-summary');
        // const result = await response.json();
        // if (result.success) {
        //   setData(result.data);
        // } else {
        //   setError(result.message || 'Failed to fetch dashboard data');
        // }
        
        // Using sample data for now
        setTimeout(() => {
          setData(sampleData);
          setLoading(false);
        }, 1000);
      } catch (err) {
        setError('Failed to fetch analytics data');
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
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
  
  if (!data) {
    return (
      <Alert status="info">
        <AlertIcon />
        No analytics data available
      </Alert>
    );
  }
  
  // Prepare data for performance metrics chart
  const performanceData = [
    {
      name: 'CTR',
      value: data.monthly_metrics.ctr * 100,
      fill: COLORS[0]
    },
    {
      name: 'Conv Rate',
      value: data.monthly_metrics.conversion_rate * 100,
      fill: COLORS[1]
    }
  ];

  return (
    <Box>
      <Heading size="lg" mb={6}>Marketing Analytics Dashboard</Heading>
      
      {/* Summary Stats */}
      <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6} mb={6}>
        <Card bg={cardBg}>
          <CardBody>
            <Stat>
              <Flex align="center">
                <Icon as={FiUsers} boxSize={6} color="blue.500" mr={2} />
                <Box>
                  <StatLabel>Total Customers</StatLabel>
                  <StatNumber>{data.total_customers.toLocaleString()}</StatNumber>
                </Box>
              </Flex>
            </Stat>
          </CardBody>
        </Card>
        
        <Card bg={cardBg}>
          <CardBody>
            <Stat>
              <Flex align="center">
                <Icon as={FiSend} boxSize={6} color="green.500" mr={2} />
                <Box>
                  <StatLabel>Active Campaigns</StatLabel>
                  <StatNumber>{data.active_campaigns}</StatNumber>
                </Box>
              </Flex>
            </Stat>
          </CardBody>
        </Card>
        
        <Card bg={cardBg}>
          <CardBody>
            <Stat>
              <Flex align="center">
                <Icon as={FiBarChart2} boxSize={6} color="purple.500" mr={2} />
                <Box>
                  <StatLabel>Monthly Spend</StatLabel>
                  <StatNumber>${data.monthly_metrics.spend.toLocaleString()}</StatNumber>
                </Box>
              </Flex>
            </Stat>
          </CardBody>
        </Card>
        
        <Card bg={cardBg}>
          <CardBody>
            <Stat>
              <Flex align="center">
                <Icon as={FiTarget} boxSize={6} color="red.500" mr={2} />
                <Box>
                  <StatLabel>Conversions</StatLabel>
                  <StatNumber>{data.monthly_metrics.conversions.toLocaleString()}</StatNumber>
                  <StatHelpText>
                    <StatArrow type="increase" />
                    {(data.monthly_metrics.conversion_rate * 100).toFixed(1)}%
                  </StatHelpText>
                </Box>
              </Flex>
            </Stat>
          </CardBody>
        </Card>
      </SimpleGrid>
      
      {/* Charts Row */}
      <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6} mb={6}>
        <Card bg={cardBg}>
          <CardHeader>
            <Heading size="md">Channel Distribution</Heading>
          </CardHeader>
          <CardBody>
            <Box height="300px">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data.channel_distribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {data.channel_distribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [value.toLocaleString(), 'Impressions']} />
                </PieChart>
              </ResponsiveContainer>
            </Box>
          </CardBody>
        </Card>
        
        <Card bg={cardBg}>
          <CardHeader>
            <Heading size="md">Customer Segments</Heading>
          </CardHeader>
          <CardBody>
            <Box height="300px">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.segment_distribution}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="segment_name" />
                  <YAxis />
                  <Tooltip formatter={(value) => [value.toLocaleString(), 'Customers']} />
                  <Bar dataKey="customer_count" fill="#8884d8">
                    {data.segment_distribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </CardBody>
        </Card>
      </SimpleGrid>
      
      {/* Performance Metrics */}
      <Card bg={cardBg}>
        <CardHeader>
          <Heading size="md">Performance Metrics</Heading>
        </CardHeader>
        <CardBody>
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
            <Box>
              <Stat>
                <StatLabel>Impressions</StatLabel>
                <StatNumber>{data.monthly_metrics.impressions.toLocaleString()}</StatNumber>
              </Stat>
              <Stat mt={4}>
                <StatLabel>Clicks</StatLabel>
                <StatNumber>{data.monthly_metrics.clicks.toLocaleString()}</StatNumber>
              </Stat>
            </Box>
            
            <Box height="200px">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis label={{ value: 'Percentage (%)', angle: -90, position: 'insideLeft' }} />
                  <Tooltip formatter={(value) => [`${value.toFixed(2)}%`, 'Rate']} />
                  <Bar dataKey="value" fill="#8884d8">
                    {performanceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </SimpleGrid>
        </CardBody>
      </Card>
    </Box>
  );
} 