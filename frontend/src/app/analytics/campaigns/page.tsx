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
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Badge,
  Select,
  Input,
  InputGroup,
  InputLeftElement,
  Button,
  HStack,
  Icon,
  Spinner,
} from '@chakra-ui/react';
import { 
  FiSearch, 
  FiFilter,
  FiArrowUp,
  FiArrowDown,
  FiCalendar, 
  FiTrendingUp, 
  FiTarget, 
  FiDollarSign,
  FiExternalLink
} from 'react-icons/fi';
import { useRouter } from 'next/navigation';
import { BarChart, PieChart, LineChart, AreaChart } from '@/components/ChartRegistry';

// Define campaign type
interface Campaign {
  id: number;
  name: string;
  type: string;
  status: string;
  startDate: string;
  endDate: string;
  budget: number;
  spent: number;
  impressions: number;
  clicks: number;
  conversions: number;
  ctr: string;
  conversionRate: string;
  cpa: number;
  roi: string;
}

// Mock data for campaigns
const generateCampaigns = (): Campaign[] => {
  const campaignTypes = ['Email', 'Social', 'Display', 'Search', 'Direct Mail'];
  const statusOptions = ['Active', 'Completed', 'Scheduled', 'Paused'];
  
  return Array.from({ length: 10 }, (_, i) => ({
    id: i + 1,
    name: `Campaign ${i + 1} - ${campaignTypes[i % campaignTypes.length]} ${Math.floor(Math.random() * 1000)}`,
    type: campaignTypes[i % campaignTypes.length],
    status: statusOptions[Math.floor(Math.random() * statusOptions.length)],
    startDate: new Date(2023, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString().split('T')[0],
    endDate: new Date(2023, Math.floor(Math.random() * 12) + 1, Math.floor(Math.random() * 28) + 1).toISOString().split('T')[0],
    budget: Math.floor(Math.random() * 10000) + 1000,
    spent: Math.floor(Math.random() * 8000) + 500,
    impressions: Math.floor(Math.random() * 1000000) + 10000,
    clicks: Math.floor(Math.random() * 50000) + 1000,
    conversions: Math.floor(Math.random() * 5000) + 100,
    ctr: (Math.random() * 5 + 0.5).toFixed(2),
    conversionRate: (Math.random() * 7 + 1).toFixed(2),
    cpa: Math.floor(Math.random() * 100) + 10,
    roi: (Math.random() * 4 + 1).toFixed(2),
  }));
};

const typePerformanceData = [
  { type: 'Email', conversions: 1250, cost: 7200, revenue: 28800 },
  { type: 'Social', conversions: 1850, cost: 14320, revenue: 42960 },
  { type: 'Display', conversions: 980, cost: 7230, revenue: 21690 },
  { type: 'Search', conversions: 2100, cost: 11650, revenue: 45435 },
  { type: 'Direct Mail', conversions: 560, cost: 16430, revenue: 32860 }
];

const statusColorMap = {
  'Completed': 'green',
  'Paused': 'orange',
  'Scheduled': 'blue',
  'Active': 'blue'
};

const CampaignAnalyticsPage = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Statuses');
  const [typeFilter, setTypeFilter] = useState('All Types');
  const [sortField, setSortField] = useState('startDate');
  const [sortDirection, setSortDirection] = useState('desc');
  
  const router = useRouter();

  // Mock data loading
  useEffect(() => {
    setTimeout(() => {
      setCampaigns(generateCampaigns());
      setLoading(false);
    }, 1000);
  }, []);

  // Calculate summary metrics
  const calculateSummaryMetrics = () => {
    if (!campaigns.length) return { totalCampaigns: 0, activeCampaigns: 0, totalSpent: 0, totalConversions: 0, averageCTR: '0', averageConvRate: '0' };
    
    return {
      totalCampaigns: campaigns.length,
      activeCampaigns: campaigns.filter(c => c.status !== 'Completed').length,
      totalSpent: campaigns.reduce((sum, c) => sum + c.spent, 0),
      totalConversions: campaigns.reduce((sum, c) => sum + c.conversions, 0),
      averageCTR: (campaigns.reduce((sum, c) => sum + parseFloat(c.ctr), 0) / campaigns.length).toFixed(2),
      averageConvRate: (campaigns.reduce((sum, c) => sum + parseFloat(c.conversionRate), 0) / campaigns.length).toFixed(2)
    };
  };
  
  const summaryMetrics = calculateSummaryMetrics();

  // Handle filtering and sorting
  const filteredCampaigns = campaigns
    .filter(campaign => 
      (searchQuery === '' || 
       campaign.name.toLowerCase().includes(searchQuery.toLowerCase())) &&
      (statusFilter === 'All Statuses' || campaign.status === statusFilter) &&
      (typeFilter === 'All Types' || campaign.type === typeFilter)
    )
    .sort((a, b) => {
      if (sortField === 'name') {
        return sortDirection === 'asc' 
          ? a.name.localeCompare(b.name) 
          : b.name.localeCompare(a.name);
      } else {
        return sortDirection === 'asc' 
          ? (a[sortField] as any) - (b[sortField] as any)
          : (b[sortField] as any) - (a[sortField] as any);
      }
    });

  // Handle sort change
  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  // Navigate to campaign details
  const handleCampaignClick = (campaignId: number) => {
    router.push(`/campaigns/${campaignId}`);
  };
  
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
      <Heading as="h1" size="xl" mb={6}>Campaign Analytics</Heading>
      
      {/* Summary Stats */}
      <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6} mb={8}>
        <Card>
          <CardBody>
            <Stat>
              <StatLabel>Total Campaigns</StatLabel>
              <StatNumber>{summaryMetrics.totalCampaigns}</StatNumber>
              <StatHelpText>
                <Flex align="center">
                  <Icon as={FiCalendar} mr={1} />
                  <Text>Last 30 days</Text>
                </Flex>
              </StatHelpText>
            </Stat>
          </CardBody>
        </Card>
        
        <Card>
          <CardBody>
            <Stat>
              <StatLabel>Active Campaigns</StatLabel>
              <StatNumber>{summaryMetrics.activeCampaigns}</StatNumber>
              <StatHelpText>
                <StatArrow type="increase" />
                {Math.round((summaryMetrics.activeCampaigns / summaryMetrics.totalCampaigns) * 100)}% of total
              </StatHelpText>
            </Stat>
          </CardBody>
        </Card>
        
        <Card>
          <CardBody>
            <Stat>
              <StatLabel>Total Spent</StatLabel>
              <StatNumber>${summaryMetrics.totalSpent.toLocaleString()}</StatNumber>
              <StatHelpText>
                <Flex align="center">
                  <Icon as={FiDollarSign} mr={1} />
                  <Text>Budget utilization</Text>
                </Flex>
              </StatHelpText>
            </Stat>
          </CardBody>
        </Card>
        
        <Card>
          <CardBody>
            <Stat>
              <StatLabel>Average CTR</StatLabel>
              <StatNumber>{summaryMetrics.averageCTR}%</StatNumber>
              <StatHelpText>
                <StatArrow type="increase" />
                2.3% from previous period
              </StatHelpText>
            </Stat>
          </CardBody>
        </Card>
      </SimpleGrid>
      
      {/* Filters */}
      <Flex 
        direction={{ base: "column", md: "row" }} 
        gap={4} 
        mb={6} 
        pb={6} 
        borderBottomWidth="1px" 
        borderColor="gray.200"
      >
        <InputGroup maxW={{ md: "320px" }}>
          <InputLeftElement pointerEvents="none">
            <Icon as={FiSearch} color="gray.400" />
          </InputLeftElement>
          <Input 
            placeholder="Search campaigns" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </InputGroup>
        
        <HStack spacing={4} ml={{ md: "auto" }}>
          <Select 
            placeholder="Status: All" 
            maxW="200px"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="All Statuses">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Completed">Completed</option>
            <option value="Paused">Paused</option>
            <option value="Scheduled">Scheduled</option>
          </Select>
          
          <Select 
            placeholder="Type: All" 
            maxW="200px"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
          >
            <option value="All Types">All Types</option>
            <option value="Email">Email</option>
            <option value="Social">Social</option>
            <option value="Display">Display</option>
            <option value="Search">Search</option>
            <option value="Direct Mail">Direct Mail</option>
          </Select>
        </HStack>
      </Flex>
      
      {/* Campaigns Table */}
      <TableContainer>
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th 
                cursor="pointer" 
                onClick={() => handleSort('name')}
              >
                <Flex align="center">
                  Campaign
                  {sortField === 'name' && (
                    <Icon 
                      as={sortDirection === 'asc' ? FiArrowUp : FiArrowDown} 
                      ml={1} 
                      boxSize={3} 
                    />
                  )}
                </Flex>
              </Th>
              <Th>Type</Th>
              <Th>Status</Th>
              <Th 
                cursor="pointer" 
                onClick={() => handleSort('startDate')}
              >
                <Flex align="center">
                  Start Date
                  {sortField === 'startDate' && (
                    <Icon 
                      as={sortDirection === 'asc' ? FiArrowUp : FiArrowDown} 
                      ml={1} 
                      boxSize={3} 
                    />
                  )}
                </Flex>
              </Th>
              <Th 
                cursor="pointer" 
                onClick={() => handleSort('spent')}
                isNumeric
              >
                <Flex align="center" justify="flex-end">
                  Spent
                  {sortField === 'spent' && (
                    <Icon 
                      as={sortDirection === 'asc' ? FiArrowUp : FiArrowDown} 
                      ml={1} 
                      boxSize={3} 
                    />
                  )}
                </Flex>
              </Th>
              <Th 
                cursor="pointer" 
                onClick={() => handleSort('impressions')}
                isNumeric
              >
                <Flex align="center" justify="flex-end">
                  Impressions
                  {sortField === 'impressions' && (
                    <Icon 
                      as={sortDirection === 'asc' ? FiArrowUp : FiArrowDown} 
                      ml={1} 
                      boxSize={3} 
                    />
                  )}
                </Flex>
              </Th>
              <Th 
                cursor="pointer" 
                onClick={() => handleSort('ctr')}
                isNumeric
              >
                <Flex align="center" justify="flex-end">
                  CTR
                  {sortField === 'ctr' && (
                    <Icon 
                      as={sortDirection === 'asc' ? FiArrowUp : FiArrowDown} 
                      ml={1} 
                      boxSize={3} 
                    />
                  )}
                </Flex>
              </Th>
              <Th 
                cursor="pointer" 
                onClick={() => handleSort('conversionRate')}
                isNumeric
              >
                <Flex align="center" justify="flex-end">
                  Conv. Rate
                  {sortField === 'conversionRate' && (
                    <Icon 
                      as={sortDirection === 'asc' ? FiArrowUp : FiArrowDown} 
                      ml={1} 
                      boxSize={3} 
                    />
                  )}
                </Flex>
              </Th>
              <Th 
                cursor="pointer" 
                onClick={() => handleSort('roi')}
                isNumeric
              >
                <Flex align="center" justify="flex-end">
                  ROI
                  {sortField === 'roi' && (
                    <Icon 
                      as={sortDirection === 'asc' ? FiArrowUp : FiArrowDown} 
                      ml={1} 
                      boxSize={3} 
                    />
                  )}
                </Flex>
              </Th>
              <Th></Th>
            </Tr>
          </Thead>
          <Tbody>
            {filteredCampaigns.map((campaign) => (
              <Tr 
                key={campaign.id} 
                _hover={{ bg: 'gray.50', cursor: 'pointer' }}
                onClick={() => handleCampaignClick(campaign.id)}
              >
                <Td fontWeight="medium">{campaign.name}</Td>
                <Td>{campaign.type}</Td>
                <Td>
                  <Badge colorScheme={statusColorMap[campaign.status]}>
                    {campaign.status}
                  </Badge>
                </Td>
                <Td>{campaign.startDate}</Td>
                <Td isNumeric>${campaign.spent.toLocaleString()}</Td>
                <Td isNumeric>{campaign.impressions.toLocaleString()}</Td>
                <Td isNumeric>{campaign.ctr}%</Td>
                <Td isNumeric>{campaign.conversionRate}%</Td>
                <Td isNumeric>{campaign.roi}x</Td>
                <Td>
                  <Button 
                    size="sm" 
                    rightIcon={<FiExternalLink />} 
                    variant="ghost"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCampaignClick(campaign.id);
                    }}
                  >
                    Details
                  </Button>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
      
      {filteredCampaigns.length === 0 && (
        <Flex justify="center" py={8}>
          <Text>No campaigns match your filters.</Text>
        </Flex>
      )}
      
      {/* Charts */}
      <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6} mb={6}>
        <BarChart
          title="Campaign Performance by Type"
          data={typePerformanceData}
          xAxisKey="type"
          xAxisLabel="Campaign Type"
          yAxisLabel="Count"
          bars={[
            { key: 'conversions', name: 'Conversions', color: '#1890ff' },
            { key: 'cost', name: 'Cost ($)', color: '#f5222d' },
          ]}
          showGrid={true}
          height={350}
        />
        <PieChart
          title="Campaign Distribution by Type"
          data={[
            { name: 'Email', value: 2 },
            { name: 'Social', value: 2 },
            { name: 'Display', value: 2 },
            { name: 'Search', value: 2 },
            { name: 'Direct Mail', value: 2 },
          ]}
          donut={true}
          centerLabel="Types"
          height={350}
        />
      </SimpleGrid>
    </Box>
  );
};

export default CampaignAnalyticsPage; 