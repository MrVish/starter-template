'use client';

import React, { useEffect } from 'react';
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

export default function Dashboard() {
  const { data: session } = useSession();
  const [userDetails, setUserDetails] = React.useState(null);
  const toast = useToast();
  
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

  const handleNewCampaign = (e) => {
    e.preventDefault();
    
    // Add validation here if needed
    
    // Simulate API request
    setTimeout(() => {
      toast({
        title: 'Campaign created.',
        description: `Successfully created campaign: ${campaignForm.name}`,
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      
      setCampaignForm({
        name: '',
        type: 'email',
        budget: '',
        startDate: '',
        endDate: '',
        goal: ''
      });
      
      onNewCampaignClose();
    }, 800);
  };

  const handleNewSegment = (e) => {
    e.preventDefault();
    
    // Add validation here if needed
    
    // Simulate API request
    setTimeout(() => {
      toast({
        title: 'Audience segment created.',
        description: `Successfully created segment: ${segmentForm.name}`,
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      
      setSegmentForm({
        name: '',
        criteria: '',
        description: ''
      });
      
      onNewSegmentClose();
    }, 800);
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

  // Fetch user profile with roles when session is available
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (session?.accessToken) {
        try {
          const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/v1/users/profile`, {
            headers: {
              Authorization: `Bearer ${session.accessToken}`
            }
          });
          
          if (response.data) {
            console.log('User profile from API:', response.data);
            // Update the session user with role information from the backend
            if (session.user && response.data.roles) {
              // This doesn't actually modify the session, but we could pass this to child components
              setUserDetails({
                ...session.user,
                role: response.data.roles.includes('admin') ? 'admin' : 'user',
                roles: response.data.roles
              });
            }
          }
        } catch (error) {
          console.error('Failed to fetch user profile:', error);
          toast({
            title: 'Error fetching profile',
            description: 'Could not retrieve your user details',
            status: 'error',
            duration: 3000,
            isClosable: true,
          });
        }
      }
    };

    fetchUserProfile();
  }, [session, toast]);

  // Force admin role - REMOVE IN PRODUCTION
  useEffect(() => {
    if (session?.user && !userDetails) {
      setUserDetails({
        ...session.user,
        role: 'admin',
        roles: ['admin']
      });
    }
  }, [session, userDetails]);

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
        <StatCard 
          label="Total Impressions" 
          value="845K" 
          change={12.5} 
          icon={FiTrendingUp} 
          color="blue" 
        />
        <StatCard 
          label="Client Acquisition Rate" 
          value="2.8%" 
          change={0.8} 
          icon={FiTrendingUp} 
          color="green" 
        />
        <StatCard 
          label="Asset Growth" 
          value="4.7%" 
          change={-0.5} 
          icon={FiTrendingDown} 
          color="orange" 
        />
        <StatCard 
          label="ROI" 
          value="328%" 
          change={22} 
          icon={FiTrendingUp} 
          color="purple" 
        />
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
                    <Tr>
                      <Td>Retirement Planning Webinar</Td>
                      <Td><Badge colorScheme="green">Active</Badge></Td>
                      <Td isNumeric>$12,500</Td>
                      <Td isNumeric>428%</Td>
                    </Tr>
                    <Tr>
                      <Td>Digital Banking Enrollment</Td>
                      <Td><Badge colorScheme="green">Active</Badge></Td>
                      <Td isNumeric>$8,000</Td>
                      <Td isNumeric>185%</Td>
                    </Tr>
                    <Tr>
                      <Td>Investment Advisory Services</Td>
                      <Td><Badge colorScheme="orange">Paused</Badge></Td>
                      <Td isNumeric>$3,200</Td>
                      <Td isNumeric>210%</Td>
                    </Tr>
                    <Tr>
                      <Td>Tax Season Preparation</Td>
                      <Td><Badge colorScheme="purple">Scheduled</Badge></Td>
                      <Td isNumeric>$15,000</Td>
                      <Td isNumeric>--</Td>
                    </Tr>
                    <Tr>
                      <Td>Mortgage Refinancing</Td>
                      <Td><Badge colorScheme="green">Active</Badge></Td>
                      <Td isNumeric>$5,750</Td>
                      <Td isNumeric>156%</Td>
                    </Tr>
                    <Tr>
                      <Td>Premium Client Acquisition</Td>
                      <Td><Badge colorScheme="red">Ended</Badge></Td>
                      <Td isNumeric>$9,200</Td>
                      <Td isNumeric>278%</Td>
                    </Tr>
                  </Tbody>
                </Table>
              </TableContainer>
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
              
              <Stack divider={<StackDivider />} spacing={4}>
                <Box>
                  <Flex justify="space-between" align="flex-start">
                    <Box>
                      <Heading size="sm">New Banking Clients</Heading>
                      <Text fontSize="sm" color="gray.500">Accounts opened in last 30 days</Text>
                    </Box>
                    <Badge colorScheme="green">16,482</Badge>
                  </Flex>
                  <Progress value={65} colorScheme="green" size="sm" mt={2} />
                </Box>
                
                <Box>
                  <Flex justify="space-between" align="flex-start">
                    <Box>
                      <Heading size="sm">Premier Clients</Heading>
                      <Text fontSize="sm" color="gray.500">Assets over $500K</Text>
                    </Box>
                    <Badge colorScheme="purple">32,951</Badge>
                  </Flex>
                  <Progress value={85} colorScheme="purple" size="sm" mt={2} />
                </Box>
                
                <Box>
                  <Flex justify="space-between" align="flex-start">
                    <Box>
                      <Heading size="sm">Cart Abandoners</Heading>
                      <Text fontSize="sm" color="gray.500">Last 7 days</Text>
                    </Box>
                    <Badge colorScheme="orange">8,741</Badge>
                  </Flex>
                  <Progress value={40} colorScheme="orange" size="sm" mt={2} />
                </Box>
                
                <Box>
                  <Flex justify="space-between" align="flex-start">
                    <Box>
                      <Heading size="sm">High-Value Prospects</Heading>
                      <Text fontSize="sm" color="gray.500">Viewed premium products</Text>
                    </Box>
                    <Badge colorScheme="blue">12,385</Badge>
                  </Flex>
                  <Progress value={55} colorScheme="blue" size="sm" mt={2} />
                </Box>
              </Stack>
            </Flex>
          </CardBody>
        </Card>
        
        <Card>
          <CardBody>
            <Flex direction="column" h="100%">
              <Heading size="md" mb={4}>Channel Performance</Heading>
              
              <Stack divider={<StackDivider />} spacing={4}>
                <Box>
                  <Flex justify="space-between" align="center">
                    <Text fontWeight="medium">Social Media</Text>
                    <Text fontWeight="bold">42%</Text>
                  </Flex>
                  <Progress value={42} colorScheme="facebook" size="sm" mt={2} />
                </Box>
                
                <Box>
                  <Flex justify="space-between" align="center">
                    <Text fontWeight="medium">Wealth Advisory Outreach</Text>
                    <Text fontWeight="bold">28%</Text>
                  </Flex>
                  <Progress value={28} colorScheme="green" size="sm" mt={2} />
                </Box>
                
                <Box>
                  <Flex justify="space-between" align="center">
                    <Text fontWeight="medium">Paid Search</Text>
                    <Text fontWeight="bold">15%</Text>
                  </Flex>
                  <Progress value={15} colorScheme="yellow" size="sm" mt={2} />
                </Box>
                
                <Box>
                  <Flex justify="space-between" align="center">
                    <Text fontWeight="medium">Organic Search</Text>
                    <Text fontWeight="bold">10%</Text>
                  </Flex>
                  <Progress value={10} colorScheme="purple" size="sm" mt={2} />
                </Box>
                
                <Box>
                  <Flex justify="space-between" align="center">
                    <Text fontWeight="medium">Direct Traffic</Text>
                    <Text fontWeight="bold">5%</Text>
                  </Flex>
                  <Progress value={5} colorScheme="blue" size="sm" mt={2} />
                </Box>
              </Stack>
            </Flex>
          </CardBody>
        </Card>
        
        <Card>
          <CardBody>
            <Flex direction="column" h="100%">
              <Heading size="md" mb={4}>Conversion Funnel</Heading>
              
              <Stack spacing={6} mt={4}>
                <Box>
                  <Flex justify="space-between" mb={1}>
                    <Text fontWeight="medium">Impressions</Text>
                    <Text>1,250,000</Text>
                  </Flex>
                  <Progress value={100} size="lg" colorScheme="blue" />
                </Box>
                
                <Box>
                  <Flex justify="space-between" mb={1}>
                    <Text fontWeight="medium">Clicks</Text>
                    <Text>125,000 (10%)</Text>
                  </Flex>
                  <Progress value={40} size="lg" colorScheme="green" />
                </Box>
                
                <Box>
                  <Flex justify="space-between" mb={1}>
                    <Text fontWeight="medium">Add to Cart</Text>
                    <Text>18,750 (15%)</Text>
                  </Flex>
                  <Progress value={15} size="lg" colorScheme="yellow" />
                </Box>
                
                <Box>
                  <Flex justify="space-between" mb={1}>
                    <Text fontWeight="medium">Checkout Started</Text>
                    <Text>9,375 (50%)</Text>
                  </Flex>
                  <Progress value={7.5} size="lg" colorScheme="orange" />
                </Box>
                
                <Box>
                  <Flex justify="space-between" mb={1}>
                    <Text fontWeight="medium">Purchases</Text>
                    <Text>6,250 (66.7%)</Text>
                  </Flex>
                  <Progress value={5} size="lg" colorScheme="red" />
                </Box>
              </Stack>
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