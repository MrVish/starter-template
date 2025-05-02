'use client';

import React, { useEffect, useState } from 'react';
import {
  Box,
  Flex,
  Heading,
  Text,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  useColorModeValue,
  Card,
  CardBody,
  Stack,
  StackDivider,
  Badge,
  HStack,
  Icon,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Spinner,
  Button,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  ModalFooter,
  FormControl,
  FormLabel,
  Input,
  Select,
  Textarea,
  VStack,
  useToast,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
  Tooltip,
  Progress,
  Switch,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Grid,
  GridItem,
  Checkbox,
  CheckboxGroup,
} from '@chakra-ui/react';
import { FiTrendingUp, FiTrendingDown, FiClock, FiAlertCircle, FiCheckCircle, FiBell, FiPlus, FiDownload, FiUpload, FiMoreVertical, FiRefreshCw, FiFilter, FiMaximize2, FiMinimize2 } from 'react-icons/fi';
import { useSession } from 'next-auth/react';
import axios from 'axios';
import dynamic from 'next/dynamic';
import { Skeleton } from '@chakra-ui/react';
import useApi from '@/hooks/useApi';

// Dynamically import the analytics embed to reduce initial bundle size
const MarketingAnalyticsEmbed = dynamic(
  () => import('../../components/MarketingAnalyticsEmbed'),
  { loading: () => <Skeleton height="200px" borderRadius="lg" />}  // show skeleton placeholder
);

// Dashboard stat card
const StatCard = ({ label, value, change, icon, color }) => (
  <Card>
    <CardBody>
      <Flex justify="space-between" align="center">
        <Stat>
          <StatLabel color="secondary.600">{label}</StatLabel>
          <StatNumber fontSize="2xl" fontWeight="bold" color={`${color}.500`}>{value}</StatNumber>
          {change && (
            <StatHelpText>
              <StatArrow type={change > 0 ? 'increase' : 'decrease'} />
              {Math.abs(change)}%
            </StatHelpText>
          )}
        </Stat>
        <Box
          p={2}
          bg={`${color}.50`}
          borderRadius="full"
          color={`${color}.500`}
        >
          <Icon as={icon} boxSize={5} />
        </Box>
      </Flex>
    </CardBody>
  </Card>
);

// New component for notifications
const NotificationsMenu = () => {
  const notifications = [
    { id: 1, title: 'Campaign Completed', message: 'Wealth Management Webinar Series has ended, view results', time: '10 min ago' },
    { id: 2, title: 'Audience Segment Ready', message: 'New customer segment "High-Net-Worth Investors" is ready', time: '1 hour ago' },
    { id: 3, title: 'System Update', message: 'Regulatory compliance update scheduled for tomorrow', time: '2 hours ago' },
  ];

  return (
    <Menu>
      <Tooltip label="Notifications">
        <MenuButton
          as={IconButton}
          icon={<FiBell />}
          variant="ghost"
          aria-label="Notifications"
          position="relative"
        >
          <Box
            position="absolute"
            top="-1px"
            right="-1px"
            px={2}
            py={1}
            fontSize="xs"
            fontWeight="bold"
            lineHeight="none"
            color="white"
            transform="translate(50%,-50%)"
            bg="red.500"
            rounded="full"
          >
            3
          </Box>
        </MenuButton>
      </Tooltip>
      <MenuList>
        {notifications.map((notification) => (
          <MenuItem key={notification.id}>
            <Box>
              <Text fontWeight="medium">{notification.title}</Text>
              <Text fontSize="sm" color="gray.500">{notification.message}</Text>
              <Text fontSize="xs" color="gray.400" mt={1}>{notification.time}</Text>
            </Box>
          </MenuItem>
        ))}
      </MenuList>
    </Menu>
  );
};

// Marketing metrics options
const METRICS_OPTIONS = [
  { id: 'impressions', label: 'Impressions', category: 'Awareness' },
  { id: 'reach', label: 'Reach', category: 'Awareness' },
  { id: 'ctr', label: 'Click-Through Rate', category: 'Engagement' },
  { id: 'conversionRate', label: 'Conversion Rate', category: 'Conversion' },
  { id: 'costPerClick', label: 'Cost Per Click', category: 'Cost' },
  { id: 'costPerConversion', label: 'Cost Per Conversion', category: 'Cost' },
  { id: 'roas', label: 'Return on Ad Spend', category: 'ROI' },
  { id: 'roi', label: 'Return on Investment', category: 'ROI' },
  { id: 'customerAcquisitionCost', label: 'Customer Acquisition Cost', category: 'Cost' },
  { id: 'customerLifetimeValue', label: 'Customer Lifetime Value', category: 'Value' },
];

// Group metrics by category
const GROUPED_METRICS = METRICS_OPTIONS.reduce((acc, metric) => {
  if (!acc[metric.category]) {
    acc[metric.category] = [];
  }
  acc[metric.category].push(metric);
  return acc;
}, {});

// Define a type for user details
interface UserDetails {
  name?: string;
  email?: string;
  role?: string;
  roles?: string[];
  image?: string;
}

export default function Dashboard() {
  const { data: session } = useSession();
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [stats, setStats] = useState<any>(null);
  const [recentCampaigns, setRecentCampaigns] = useState<any[]>([]);
  const [segments, setSegments] = useState<any[]>([]);
  const [channelPerformance, setChannelPerformance] = useState<any[]>([]);
  const [conversionFunnel, setConversionFunnel] = useState<any>(null);
  const toast = useToast();
  
  // Initialize our API hooks with memoization
  const api = useApi();
  
  // Modal states
  const { 
    isOpen: isNewCampaignOpen, 
    onOpen: onNewCampaignOpen, 
    onClose: onNewCampaignClose 
  } = useDisclosure();
  
  const { 
    isOpen: isNewSegmentOpen, 
    onOpen: onNewSegmentOpen, 
    onClose: onNewSegmentClose 
  } = useDisclosure();
  
  const { 
    isOpen: isUploadOpen, 
    onOpen: onUploadOpen, 
    onClose: onUploadClose 
  } = useDisclosure();
  
  // Form states
  const [campaignForm, setCampaignForm] = React.useState({
    name: '',
    type: 'email',
    budget: '',
    startDate: '',
    endDate: '',
    goal: ''
  });
  
  const [segmentForm, setSegmentForm] = React.useState({
    name: '',
    criteria: '',
    description: ''
  });
  
  const [selectedMetrics, setSelectedMetrics] = React.useState(['impressions', 'ctr', 'conversionRate', 'roi']);

  const handleCampaignFormChange = (e) => {
    const { name, value } = e.target;
    setCampaignForm({
      ...campaignForm,
      [name]: value
    });
  };

  const handleSegmentFormChange = (e) => {
    const { name, value } = e.target;
    setSegmentForm({
      ...segmentForm,
      [name]: value
    });
  };

  const handleMetricsChange = (selectedMetrics) => {
    setSelectedMetrics(selectedMetrics);
  };

  const handleNewCampaign = async (e) => {
    e.preventDefault();
    
    // Add validation
    if (!campaignForm.name || !campaignForm.type || !campaignForm.budget || !campaignForm.startDate || !campaignForm.endDate) {
      toast({
        title: 'Missing information',
        description: 'Please fill in all required fields',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    
    try {
      setLoading(true);
      
      // Use our API hook to create a new campaign
      const response = await api.post('/api/v1/dashboard/campaign', campaignForm);
      
      if (response.data?.success) {
        toast({
          title: 'Campaign created',
          description: `Successfully created campaign: ${campaignForm.name}`,
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
        
        // Reset form and fetch updated campaign list
        setCampaignForm({
          name: '',
          type: 'email',
          budget: '',
          startDate: '',
          endDate: '',
          goal: ''
        });
        
        fetchRecentCampaigns();
        onNewCampaignClose();
      } else {
        throw new Error(response.error || 'Failed to create campaign');
      }
    } catch (error) {
      console.error('Error creating campaign:', error);
      toast({
        title: 'Error creating campaign',
        description: error.message || 'An unexpected error occurred',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleNewSegment = async (e) => {
    e.preventDefault();
    
    // Add validation
    if (!segmentForm.name || !segmentForm.criteria) {
      toast({
        title: 'Missing information',
        description: 'Please fill in all required fields',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    
    try {
      setLoading(true);
      
      // Use our API hook to create a new segment
      const response = await api.post('/api/v1/dashboard/segment', segmentForm);
      
      if (response.data?.success) {
        toast({
          title: 'Audience segment created',
          description: `Successfully created segment: ${segmentForm.name}`,
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
        
        // Reset form and fetch updated segments
        setSegmentForm({
          name: '',
          criteria: '',
          description: ''
        });
        
        fetchSegments();
        onNewSegmentClose();
      } else {
        throw new Error(response.error || 'Failed to create segment');
      }
    } catch (error) {
      console.error('Error creating segment:', error);
      toast({
        title: 'Error creating segment',
        description: error.message || 'An unexpected error occurred',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDatasetUpload = (e) => {
    e.preventDefault();
    
    // Simulate file upload
    toast({
      title: 'File upload started',
      description: "We've started processing your data file",
      status: 'info',
      duration: 2000,
      isClosable: true,
    });
    
    // Simulate processing
    setTimeout(() => {
      toast({
        title: 'Data import complete',
        description: "Your marketing data has been successfully imported",
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      
      onUploadClose();
    }, 2000);
  };

  const handleExport = (format) => {
    toast({
      title: `Exporting data as ${format.toUpperCase()}`,
      description: "Your report will be ready for download shortly",
      status: 'info',
      duration: 3000,
      isClosable: true,
    });
  };

  // Add better error handling for debugging
  useEffect(() => {
    if (api.error) {
      console.error('API Error in dashboard:', {
        error: api.error,
        status: api.status,
        data: api.data
      });
    }
  }, [api.error, api.status, api.data]);

  // Fetch dashboard data
  const fetchDashboardData = async () => {
    setLoading(true);
    
    try {
      const response = await api.get('/api/v1/dashboard/');
      
      if (response.data?.success) {
        setDashboardData(response.data.data);
        console.log('Dashboard data:', response.data.data);
      } else if (response.error) {
        console.error('Error fetching dashboard data:', response.error, response.status);
        toast({
          title: 'Error fetching dashboard data',
          description: `${response.error} (${response.status})`,
          status: 'warning',
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error('Error in fetchDashboardData:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch stats
  const fetchStats = async () => {
    try {
      const response = await api.get('/api/v1/dashboard/stats');
      
      if (response.data?.success) {
        setStats(response.data.data);
        console.log('Stats data:', response.data.data);
      } else if (response.error) {
        console.error('Error fetching stats:', response.error);
      }
    } catch (error) {
      console.error('Error in fetchStats:', error);
    }
  };

  // Fetch recent campaigns
  const fetchRecentCampaigns = async () => {
    try {
      const response = await api.get('/api/v1/dashboard/campaigns/recent?limit=6');
      
      if (response.data?.success) {
        setRecentCampaigns(response.data.data);
        console.log('Recent campaigns:', response.data.data);
      } else if (response.error) {
        console.error('Error fetching recent campaigns:', response.error);
      }
    } catch (error) {
      console.error('Error in fetchRecentCampaigns:', error);
    }
  };

  // Fetch segments
  const fetchSegments = async () => {
    try {
      const response = await api.get('/api/v1/dashboard/segments');
      
      if (response.data?.success) {
        setSegments(response.data.data);
        console.log('Segments:', response.data.data);
      } else if (response.error) {
        console.error('Error fetching segments:', response.error);
      }
    } catch (error) {
      console.error('Error in fetchSegments:', error);
    }
  };

  // Fetch channel performance
  const fetchChannelPerformance = async () => {
    try {
      const response = await api.get('/api/v1/dashboard/channels');
      
      if (response.data?.success) {
        setChannelPerformance(response.data.data);
        console.log('Channel performance:', response.data.data);
      } else if (response.error) {
        console.error('Error fetching channel performance:', response.error);
      }
    } catch (error) {
      console.error('Error in fetchChannelPerformance:', error);
    }
  };

  // Fetch conversion funnel
  const fetchConversionFunnel = async () => {
    try {
      const response = await api.get('/api/v1/dashboard/funnel');
      
      if (response.data?.success) {
        setConversionFunnel(response.data.data);
        console.log('Conversion funnel:', response.data.data);
      } else if (response.error) {
        console.error('Error fetching conversion funnel:', response.error);
      }
    } catch (error) {
      console.error('Error in fetchConversionFunnel:', error);
    }
  };

  // Use state to track whether initial data fetch has occurred
  const [initialFetchDone, setInitialFetchDone] = useState(false);

  // Fetch all dashboard data when session is available - only once
  useEffect(() => {
    // Only fetch if we have a session and haven't already fetched
    if (session?.accessToken && !initialFetchDone) {
      const fetchAllData = async () => {
        try {
          await Promise.all([
            fetchDashboardData(),
            fetchStats(),
            fetchRecentCampaigns(),
            fetchSegments(),
            fetchChannelPerformance(),
            fetchConversionFunnel()
          ]);
          setInitialFetchDone(true);
        } catch (error) {
          console.error('Error fetching initial data:', error);
        }
      };
      
      fetchAllData();
    }
  }, [session, initialFetchDone]); // Don't include api or fetch functions

  // Fetch user profile with roles when session is available (only once)
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (session?.accessToken) {
        try {
          console.log('Fetching user profile...');
          const response = await api.get('/api/v1/users/profile');
          
          if (response.data) {
            console.log('User profile from API:', response.data);
            // Update the session user with role information from the backend
            if (session.user) {
              const roles = response.data.roles || ['user'];
              setUserDetails({
                ...session.user,
                role: roles.includes('admin') ? 'admin' : 'user',
                roles: roles
              });
              
              console.log('User details updated with roles:', roles);
            }
          }
        } catch (error) {
          console.error('Failed to fetch user profile:', error);
          
          // For development - set user as admin even if profile fetch fails
          // Remove this in production
          if (session?.user) {
            setUserDetails({
              ...session.user,
              role: 'admin',
              roles: ['admin']
            });
          }
          
          toast({
            title: 'Error fetching profile',
            description: 'Using default profile instead',
            status: 'warning',
            duration: 3000,
            isClosable: true,
          });
        }
      }
    };

    fetchUserProfile();
  }, [session, toast]); // Don't include api in dependencies

  if (!session) {
    return (
      <Flex 
        h="100vh" 
        bg="gray.50"
        align="center" 
        justify="center" 
        direction="column"
        p={5}
      >
        <Heading mb={6}>Sign in to access the dashboard</Heading>
        <Button 
          colorScheme="blue" 
          onClick={() => window.location.href = '/auth/signin'}
        >
          Sign In
        </Button>
      </Flex>
    );
  }

  return (
    <Box>
      <Flex
        direction={{ base: 'column', lg: 'row' }}
        justify="space-between"
        align={{ base: 'flex-start', lg: 'center' }}
        mb={6}
      >
        <Box mb={{ base: 4, lg: 0 }}>
          <Heading size="lg" mb={1}>
            Marketing Analytics Dashboard
          </Heading>
          <Text color="gray.600">
            Welcome, {session?.user?.name || 'User'}! Here's an overview of your campaigns.
          </Text>
        </Box>
        
        <HStack spacing={3}>
          <Button
            leftIcon={<FiPlus />}
            colorScheme="blue"
            onClick={onNewCampaignOpen}
          >
            New Campaign
          </Button>
          <Button
            leftIcon={<FiPlus />}
            variant="outline"
            onClick={onNewSegmentOpen}
          >
            New Segment
          </Button>
          <Button
            leftIcon={<FiUpload />}
            variant="ghost"
            onClick={onUploadOpen}
          >
            Import Data
          </Button>
          <Menu>
            <MenuButton
              as={Button}
              rightIcon={<FiDownload />}
              variant="ghost"
            >
              Export
            </MenuButton>
            <MenuList>
              <MenuItem onClick={() => handleExport('csv')}>CSV</MenuItem>
              <MenuItem onClick={() => handleExport('excel')}>Excel</MenuItem>
              <MenuItem onClick={() => handleExport('pdf')}>PDF Report</MenuItem>
            </MenuList>
          </Menu>
          <NotificationsMenu />
        </HStack>
      </Flex>
      
      <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={5} mb={8}>
        {loading ? (
          <>
            <Skeleton height="120px" borderRadius="lg" />
            <Skeleton height="120px" borderRadius="lg" />
            <Skeleton height="120px" borderRadius="lg" />
            <Skeleton height="120px" borderRadius="lg" />
          </>
        ) : (
          <>
            <StatCard 
              label="Total Impressions" 
              value={stats?.total_impressions?.value || "845K"} 
              change={stats?.total_impressions?.change || 12.5} 
              icon={FiTrendingUp} 
              color="blue" 
            />
            <StatCard 
              label="Client Acquisition Rate" 
              value={stats?.client_acquisition_rate?.value || "2.8%"} 
              change={stats?.client_acquisition_rate?.change || 0.8} 
              icon={FiTrendingUp} 
              color="green" 
            />
            <StatCard 
              label="Asset Growth" 
              value={stats?.asset_growth?.value || "4.7%"} 
              change={stats?.asset_growth?.change || -0.5} 
              icon={FiTrendingDown} 
              color="orange" 
            />
            <StatCard 
              label="ROI" 
              value={stats?.roi?.value || "328%"} 
              change={stats?.roi?.change || 22} 
              icon={FiTrendingUp} 
              color="purple" 
            />
          </>
        )}
      </SimpleGrid>
      
      <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={8} mb={8}>
        <Box>
          <MarketingAnalyticsEmbed />
        </Box>
        
        <Card>
          <CardBody>
            <Flex direction="column" h="100%">
              <Flex justify="space-between" align="center" mb={4}>
                <Heading size="md">Recent Campaigns</Heading>
                <Menu>
                  <MenuButton
                    as={IconButton}
                    size="sm"
                    variant="ghost"
                    icon={<FiMoreVertical />}
                    aria-label="Campaign options"
                  />
                  <MenuList>
                    <MenuItem>View all campaigns</MenuItem>
                    <MenuItem>Filter campaigns</MenuItem>
                    <MenuItem>Sort by performance</MenuItem>
                  </MenuList>
                </Menu>
              </Flex>
              
              {loading ? (
                <Skeleton height="350px" borderRadius="lg" />
              ) : (
                <TableContainer overflowY="auto" maxH="350px">
                  <Table variant="simple" size="sm">
                    <Thead>
                      <Tr>
                        <Th>Campaign</Th>
                        <Th>Status</Th>
                        <Th isNumeric>Budget</Th>
                        <Th isNumeric>ROI</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {recentCampaigns.length > 0 ? (
                        recentCampaigns.map((campaign) => (
                          <Tr key={campaign.id}>
                            <Td>{campaign.name}</Td>
                            <Td>
                              <Badge 
                                colorScheme={
                                  campaign.status === 'active' ? 'green' : 
                                  campaign.status === 'paused' ? 'orange' : 
                                  campaign.status === 'scheduled' ? 'purple' : 
                                  'red'
                                }
                              >
                                {campaign.status}
                              </Badge>
                            </Td>
                            <Td isNumeric>${typeof campaign.budget === 'number' ? campaign.budget.toLocaleString() : '0'}</Td>
                            <Td isNumeric>{campaign.roi}</Td>
                          </Tr>
                        ))
                      ) : (
                        <Tr>
                          <Td colSpan={4} textAlign="center">No campaigns found</Td>
                        </Tr>
                      )}
                    </Tbody>
                  </Table>
                </TableContainer>
              )}
            </Flex>
          </CardBody>
        </Card>
      </SimpleGrid>
      
      <SimpleGrid columns={{ base: 1, lg: 3 }} spacing={8}>
        <Card>
          <CardBody>
            <Flex direction="column" h="100%">
              <Flex justify="space-between" align="center" mb={4}>
                <Heading size="md">Audience Segments</Heading>
                <IconButton
                  icon={<FiPlus />}
                  aria-label="Add segment"
                  size="sm"
                  onClick={onNewSegmentOpen}
                />
              </Flex>
              
              {loading ? (
                <Skeleton height="300px" borderRadius="lg" />
              ) : (
                <Stack divider={<StackDivider />} spacing={4}>
                  {segments.length > 0 ? (
                    segments.map((segment) => (
                      <Box key={segment.id}>
                        <Flex justify="space-between" align="flex-start">
                          <Box>
                            <Heading size="sm">{segment.name}</Heading>
                            <Text fontSize="sm" color="gray.500">{segment.description}</Text>
                          </Box>
                          <Badge colorScheme={segment.color_scheme}>{segment.customer_count.toLocaleString()}</Badge>
                        </Flex>
                        <Progress value={segment.progress_value} colorScheme={segment.color_scheme} size="sm" mt={2} />
                      </Box>
                    ))
                  ) : (
                    <Text textAlign="center" color="gray.500">No segments found</Text>
                  )}
                </Stack>
              )}
            </Flex>
          </CardBody>
        </Card>
        
        <Card>
          <CardBody>
            <Flex direction="column" h="100%">
              <Heading size="md" mb={4}>Channel Performance</Heading>
              
              {loading ? (
                <Skeleton height="300px" borderRadius="lg" />
              ) : (
                <Stack divider={<StackDivider />} spacing={4}>
                  {channelPerformance.length > 0 ? (
                    channelPerformance.map((channel) => (
                      <Box key={channel.id}>
                        <Flex justify="space-between" align="center">
                          <Text fontWeight="medium">{channel.name}</Text>
                          <Text fontWeight="bold">{channel.percentage}%</Text>
                        </Flex>
                        <Progress value={channel.percentage} colorScheme={channel.color_scheme} size="sm" mt={2} />
                      </Box>
                    ))
                  ) : (
                    <Text textAlign="center" color="gray.500">No channel data found</Text>
                  )}
                </Stack>
              )}
            </Flex>
          </CardBody>
        </Card>
        
        <Card>
          <CardBody>
            <Flex direction="column" h="100%">
              <Heading size="md" mb={4}>Conversion Funnel</Heading>
              
              {loading ? (
                <Skeleton height="300px" borderRadius="lg" />
              ) : (
                conversionFunnel && conversionFunnel.stages ? (
                  <Stack spacing={6} mt={4}>
                    {conversionFunnel.stages.map((stage, index) => (
                      <Box key={index}>
                        <Flex justify="space-between" mb={1}>
                          <Text fontWeight="medium">{stage.name}</Text>
                          <Text>{stage.formatted_value}</Text>
                        </Flex>
                        <Progress value={stage.progress} size="lg" colorScheme={stage.color_scheme} />
                      </Box>
                    ))}
                  </Stack>
                ) : (
                  <Text textAlign="center" color="gray.500">No funnel data found</Text>
                )
              )}
            </Flex>
          </CardBody>
        </Card>
      </SimpleGrid>
      
      {/* New Campaign Modal */}
      <Modal isOpen={isNewCampaignOpen} onClose={onNewCampaignClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create New Banking Campaign</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4} as="form" onSubmit={handleNewCampaign}>
              <FormControl id="campaignName" isRequired>
                <FormLabel>Campaign Name</FormLabel>
                <Input
                  name="name"
                  value={campaignForm.name}
                  onChange={handleCampaignFormChange}
                  placeholder="Wealth Management Series 2023"
                />
              </FormControl>
              
              <FormControl id="campaignType" isRequired>
                <FormLabel>Campaign Type</FormLabel>
                <Select name="type" value={campaignForm.type} onChange={handleCampaignFormChange}>
                  <option value="email">Client Email Outreach</option>
                  <option value="social">Financial Social Media</option>
                  <option value="webinar">Financial Webinar</option>
                  <option value="content">Financial Education</option>
                  <option value="advisor">Advisor Outreach</option>
                </Select>
              </FormControl>
              
              <FormControl isRequired>
                <FormLabel>Budget ($)</FormLabel>
                <Input 
                  name="budget"
                  value={campaignForm.budget}
                  onChange={handleCampaignFormChange}
                  placeholder="5000"
                  type="number"
                />
              </FormControl>
              
              <SimpleGrid columns={2} spacing={4} width="100%">
                <FormControl isRequired>
                  <FormLabel>Start Date</FormLabel>
                  <Input 
                    name="startDate"
                    value={campaignForm.startDate}
                    onChange={handleCampaignFormChange}
                    type="date"
                  />
                </FormControl>
                
                <FormControl isRequired>
                  <FormLabel>End Date</FormLabel>
                  <Input 
                    name="endDate"
                    value={campaignForm.endDate}
                    onChange={handleCampaignFormChange}
                    type="date"
                  />
                </FormControl>
              </SimpleGrid>
              
              <FormControl>
                <FormLabel>Campaign Goals</FormLabel>
                <Textarea 
                  name="goal"
                  value={campaignForm.goal}
                  onChange={handleCampaignFormChange}
                  placeholder="Describe the main objectives of this campaign..."
                />
              </FormControl>
              
              <FormControl>
                <FormLabel>Target Metrics</FormLabel>
                <CheckboxGroup colorScheme="blue" defaultValue={['impressions', 'ctr', 'conversionRate', 'roi']}>
                  <SimpleGrid columns={{ base: 1, md: 2 }} spacing={2}>
                    {METRICS_OPTIONS.map((metric: { id: string, label: string, category: string }) => (
                      <Checkbox key={metric.id} value={metric.id}>
                        {metric.label}
                      </Checkbox>
                    ))}
                  </SimpleGrid>
                </CheckboxGroup>
              </FormControl>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onNewCampaignClose}>
              Cancel
            </Button>
            <Button colorScheme="blue" onClick={handleNewCampaign}>
              Create Campaign
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      
      {/* New Segment Modal */}
      <Modal isOpen={isNewSegmentOpen} onClose={onNewSegmentClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create Audience Segment</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4} as="form" onSubmit={handleNewSegment}>
              <FormControl isRequired>
                <FormLabel>Segment Name</FormLabel>
                <Input 
                  name="name"
                  value={segmentForm.name}
                  onChange={handleSegmentFormChange}
                  placeholder="High-Value Customers"
                />
              </FormControl>
              
              <FormControl isRequired>
                <FormLabel>Segment Criteria</FormLabel>
                <Select 
                  name="criteria"
                  value={segmentForm.criteria}
                  onChange={handleSegmentFormChange}
                >
                  <option value="">Select criteria...</option>
                  <option value="purchase_frequency">Purchase Frequency</option>
                  <option value="recency">Purchase Recency</option>
                  <option value="value">Customer Value</option>
                  <option value="engagement">Engagement Level</option>
                  <option value="cart_abandonment">Cart Abandonment</option>
                  <option value="custom">Custom Rule</option>
                </Select>
              </FormControl>
              
              <FormControl>
                <FormLabel>Description</FormLabel>
                <Textarea 
                  name="description"
                  value={segmentForm.description}
                  onChange={handleSegmentFormChange}
                  placeholder="Describe this audience segment..."
                />
              </FormControl>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onNewSegmentClose}>
              Cancel
            </Button>
            <Button colorScheme="blue" onClick={handleNewSegment}>
              Create Segment
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      
      {/* Data Upload Modal */}
      <Modal isOpen={isUploadOpen} onClose={onUploadClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Import Marketing Data</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <FormControl>
                <FormLabel>Data Source</FormLabel>
                <Select defaultValue="file">
                  <option value="file">File Upload</option>
                  <option value="google">Google Analytics</option>
                  <option value="facebook">Facebook Ads</option>
                  <option value="mailchimp">Mailchimp</option>
                  <option value="api">Custom API</option>
                </Select>
              </FormControl>
              
              <FormControl>
                <FormLabel>Select File</FormLabel>
                <Input type="file" pt={1} />
                <Text fontSize="sm" color="gray.500" mt={1}>
                  Supported formats: CSV, Excel, JSON
                </Text>
              </FormControl>
              
              <FormControl>
                <FormLabel>Data Type</FormLabel>
                <Select defaultValue="campaign">
                  <option value="campaign">Campaign Data</option>
                  <option value="customer">Customer Data</option>
                  <option value="product">Product Performance</option>
                  <option value="transaction">Transaction History</option>
                </Select>
              </FormControl>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onUploadClose}>
              Cancel
            </Button>
            <Button colorScheme="blue" onClick={handleDatasetUpload}>
              Upload Data
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
} 