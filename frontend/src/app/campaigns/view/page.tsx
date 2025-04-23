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
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  FormControl,
  FormLabel,
  useDisclosure,
  useToast,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Tag,
  TagLabel,
  TagCloseButton,
  Divider,
  Tooltip,
  Radio,
  RadioGroup,
  Stack,
  Switch,
  Checkbox,
  Stat,
} from '@chakra-ui/react';
import {
  FiEdit,
  FiSearch,
  FiFilter,
  FiEye,
  FiPause,
  FiPlay,
  FiTrash2,
  FiBarChart2,
  FiCopy,
  FiMail,
  FiMessageSquare,
  FiSmartphone,
  FiGlobe,
  FiTarget,
  FiShare2,
  FiCalendar,
  FiDownload,
  FiSave,
  FiCheckCircle,
  FiClock,
  FiAlertTriangle,
  FiSettings,
  FiRefreshCw,
  FiUsers,
  FiDollarSign,
  FiMoreVertical,
} from 'react-icons/fi';
import DashboardLayout from '../../../components/layout/DashboardLayout';

// Sample campaigns data
const CAMPAIGNS = [
  {
    id: 1,
    name: 'Summer Savings Promotion',
    status: 'Active',
    type: 'Multi-channel',
    channels: ['Email', 'Mobile', 'Web'],
    startDate: '2024-03-01',
    endDate: '2024-05-31',
    audience: 'All Segments',
    audienceSize: 120000,
    performance: {
      sent: 98450,
      delivered: 97200,
      opened: 42500,
      clicked: 12800,
      converted: 4200,
    },
    budget: {
      total: 300000,
      spent: 150000
    },
    lastEdited: '2024-03-15',
    lastEditor: 'Alex Johnson',
  },
  {
    id: 2,
    name: 'Investment Portfolio Awareness',
    status: 'Active',
    type: 'Email',
    channels: ['Email'],
    startDate: '2024-02-15',
    endDate: '2024-04-15',
    audience: 'High-Value Banking',
    audienceSize: 25000,
    performance: {
      sent: 25000,
      delivered: 24800,
      opened: 16500,
      clicked: 4500,
      converted: 1850,
    },
    budget: {
      total: 120000,
      spent: 95000
    },
    lastEdited: '2024-03-14',
    lastEditor: 'Sarah Williams',
  },
  {
    id: 3,
    name: 'Mobile Banking App Promotion',
    status: 'Completed',
    type: 'Mobile',
    channels: ['Mobile', 'SMS'],
    startDate: '2024-01-01',
    endDate: '2024-02-29',
    audience: 'Digital Natives',
    audienceSize: 75000,
    performance: {
      sent: 75000,
      delivered: 74200,
      opened: 58000,
      clicked: 32000,
      converted: 7500,
    },
    budget: {
      total: 200000,
      spent: 200000
    },
    lastEdited: '2024-02-28',
    lastEditor: 'Michael Chen',
  },
  {
    id: 4,
    name: 'New Customer Welcome Series',
    status: 'Active',
    type: 'Email',
    channels: ['Email'],
    startDate: '2024-01-15',
    endDate: 'Ongoing',
    audience: 'New Account Holders',
    audienceSize: 8500,
    performance: {
      sent: 8500,
      delivered: 8450,
      opened: 6800,
      clicked: 4200,
      converted: 1050,
    },
    budget: {
      total: 75000,
      spent: 45000
    },
    lastEdited: '2024-03-10',
    lastEditor: 'Jessica Brown',
  },
  {
    id: 5,
    name: 'Retirement Planning Webinar',
    status: 'Draft',
    type: 'Multi-channel',
    channels: ['Email', 'Web'],
    startDate: '2024-04-15',
    endDate: '2024-05-15',
    audience: 'Investment Focus',
    audienceSize: 15000,
    performance: {
      sent: 0,
      delivered: 0,
      opened: 0,
      clicked: 0,
      converted: 0,
    },
    budget: {
      total: 150000,
      spent: 0
    },
    lastEdited: '2024-03-05',
    lastEditor: 'Robert Lee',
  },
  {
    id: 6,
    name: 'Credit Card Upgrade Offer',
    status: 'Paused',
    type: 'Email',
    channels: ['Email', 'SMS'],
    startDate: '2024-02-01',
    endDate: '2024-04-30',
    audience: 'Multiple Segments',
    audienceSize: 45000,
    performance: {
      sent: 35000,
      delivered: 34500,
      opened: 18200,
      clicked: 6800,
      converted: 1200,
    },
    budget: {
      total: 180000,
      spent: 75000
    },
    lastEdited: '2024-03-12',
    lastEditor: 'David Wilson',
  },
];

export default function ViewEditCampaigns() {
  const cardBg = useColorModeValue('white', 'gray.800');
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: isAlertOpen, onOpen: onAlertOpen, onClose: onAlertClose } = useDisclosure();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterType, setFilterType] = useState('All');
  const [sortBy, setSortBy] = useState('startDate');
  const [sortOrder, setSortOrder] = useState('desc');
  const [selectedCampaign, setSelectedCampaign] = useState<any>(null);
  const [editMode, setEditMode] = useState(false);
  const [campaignToDelete, setCampaignToDelete] = useState<any>(null);
  
  const cancelRef = React.useRef<HTMLButtonElement>(null);

  // Filter and sort campaigns
  const filteredCampaigns = CAMPAIGNS.filter(campaign => 
    (filterStatus === 'All' || campaign.status === filterStatus) &&
    (filterType === 'All' || campaign.type === filterType) &&
    (campaign.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
     campaign.audience.toLowerCase().includes(searchQuery.toLowerCase()))
  ).sort((a, b) => {
    const aValue = a[sortBy as keyof typeof a];
    const bValue = b[sortBy as keyof typeof b];
    
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortOrder === 'asc' 
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }
    
    // For numerical values
    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
    }
    
    return 0;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'green';
      case 'Paused': return 'orange';
      case 'Draft': return 'gray';
      case 'Completed': return 'blue';
      default: return 'gray';
    }
  };

  const getChannelIcon = (channel: string) => {
    switch (channel) {
      case 'Email': return FiMail;
      case 'SMS': return FiMessageSquare;
      case 'Mobile': return FiSmartphone;
      case 'Web': return FiGlobe;
      case 'Social': return FiShare2;
      default: return FiTarget;
    }
  };

  const handleViewCampaign = (campaign: any) => {
    setSelectedCampaign(campaign);
    setEditMode(false);
    onOpen();
  };

  const handleEditCampaign = (campaign: any) => {
    setSelectedCampaign(campaign);
    setEditMode(true);
    onOpen();
  };

  const handleDeleteCampaign = (campaign: any) => {
    setCampaignToDelete(campaign);
    onAlertOpen();
  };

  const confirmDelete = () => {
    toast({
      title: 'Campaign deleted',
      description: `"${campaignToDelete.name}" has been deleted successfully.`,
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
    onAlertClose();
  };

  const handleChangeCampaignStatus = (campaign: any, newStatus: string) => {
    toast({
      title: `Campaign ${newStatus.toLowerCase()}`,
      description: `"${campaign.name}" has been ${newStatus.toLowerCase()}.`,
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };

  const handleSaveChanges = () => {
    toast({
      title: 'Changes saved',
      description: 'Your changes to the campaign have been saved.',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
    onClose();
  };

  const handleDuplicateCampaign = (campaign: any) => {
    toast({
      title: 'Campaign duplicated',
      description: `A copy of "${campaign.name}" has been created.`,
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };

  return (
    <DashboardLayout>
      <Box mb={6}>
        <HStack spacing={4} align="center" mb={6}>
          <Icon as={FiEdit} boxSize={8} color="blue.500" />
          <Box>
            <Heading as="h1" size="xl" color="secondary.700">
              Manage Campaigns
            </Heading>
            <Text color="gray.600">
              View and modify your existing marketing campaigns
            </Text>
          </Box>
        </HStack>

        {/* Metrics Overview */}
        <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6} mb={8}>
          <Card bg={cardBg}>
            <CardBody>
              <VStack align="start">
                <Text color="gray.500">Total Campaigns</Text>
                <HStack justify="space-between" width="full">
                  <Heading size="xl">{CAMPAIGNS.length}</Heading>
                  <Icon as={FiTarget} color="blue.500" boxSize={6} />
                </HStack>
                <HStack>
                  <Badge colorScheme="green">{CAMPAIGNS.filter(c => c.status === 'Active').length} Active</Badge>
                  <Badge colorScheme="gray">{CAMPAIGNS.filter(c => c.status === 'Draft').length} Draft</Badge>
                </HStack>
              </VStack>
            </CardBody>
          </Card>
          
          <Card bg={cardBg}>
            <CardBody>
              <VStack align="start">
                <Text color="gray.500">Total Audience Reach</Text>
                <HStack justify="space-between" width="full">
                  <Heading size="xl">{CAMPAIGNS.reduce((sum, c) => sum + c.audienceSize, 0).toLocaleString()}</Heading>
                  <Icon as={FiUsers} color="blue.500" boxSize={6} />
                </HStack>
                <Text fontSize="sm" color="gray.500">Across all campaigns</Text>
              </VStack>
            </CardBody>
          </Card>
          
          <Card bg={cardBg}>
            <CardBody>
              <VStack align="start">
                <Text color="gray.500">Total Budget</Text>
                <HStack justify="space-between" width="full">
                  <Heading size="xl">${CAMPAIGNS.reduce((sum, c) => sum + c.budget.total, 0).toLocaleString()}</Heading>
                  <Icon as={FiDollarSign} color="blue.500" boxSize={6} />
                </HStack>
                <Text fontSize="sm" color="green.500">
                  ${CAMPAIGNS.reduce((sum, c) => sum + c.budget.spent, 0).toLocaleString()} spent
                </Text>
              </VStack>
            </CardBody>
          </Card>
          
          <Card bg={cardBg}>
            <CardBody>
              <VStack align="start">
                <Text color="gray.500">Avg. Conversion Rate</Text>
                <HStack justify="space-between" width="full">
                  <Heading size="xl">
                    {(CAMPAIGNS
                      .filter(c => c.performance.sent > 0)
                      .reduce((sum, c) => sum + (c.performance.converted / c.performance.sent) * 100, 0) / 
                      CAMPAIGNS.filter(c => c.performance.sent > 0).length).toFixed(1)}%
                  </Heading>
                  <Icon as={FiBarChart2} color="blue.500" boxSize={6} />
                </HStack>
                <Text fontSize="sm" color="blue.500">+2.5% from last month</Text>
              </VStack>
            </CardBody>
          </Card>
        </SimpleGrid>

        {/* Filters and Search */}
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
            maxW="150px"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="All">All Status</option>
            <option value="Active">Active</option>
            <option value="Paused">Paused</option>
            <option value="Draft">Draft</option>
            <option value="Completed">Completed</option>
          </Select>
          
          <Select
            maxW="150px"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
          >
            <option value="All">All Types</option>
            <option value="Email">Email</option>
            <option value="Mobile">Mobile</option>
            <option value="Multi-channel">Multi-channel</option>
          </Select>
          
          <Select
            maxW="180px"
            value={`${sortBy}:${sortOrder}`}
            onChange={(e) => {
              const [field, order] = e.target.value.split(':');
              setSortBy(field);
              setSortOrder(order);
            }}
          >
            <option value="startDate:desc">Newest First</option>
            <option value="startDate:asc">Oldest First</option>
            <option value="name:asc">Name (A-Z)</option>
            <option value="name:desc">Name (Z-A)</option>
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
                    <Th>Status</Th>
                    <Th>Type</Th>
                    <Th>Dates</Th>
                    <Th>Audience</Th>
                    <Th>Performance</Th>
                    <Th>Budget</Th>
                    <Th>Last Updated</Th>
                    <Th>Actions</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {filteredCampaigns.map((campaign) => (
                    <Tr key={campaign.id}>
                      <Td>
                        <VStack align="start" spacing={1}>
                          <Text fontWeight="medium">{campaign.name}</Text>
                          <HStack spacing={1}>
                            {campaign.channels.map((channel) => (
                              <Icon 
                                key={channel} 
                                as={getChannelIcon(channel)} 
                                color="blue.500"
                                boxSize={4}
                              />
                            ))}
                          </HStack>
                        </VStack>
                      </Td>
                      <Td>
                        <Badge colorScheme={getStatusColor(campaign.status)}>
                          {campaign.status}
                        </Badge>
                      </Td>
                      <Td>{campaign.type}</Td>
                      <Td>
                        <VStack align="start" spacing={0}>
                          <Text>{campaign.startDate}</Text>
                          <Text fontSize="xs" color="gray.500">
                            {campaign.endDate === 'Ongoing' ? 'Ongoing' : campaign.endDate}
                          </Text>
                        </VStack>
                      </Td>
                      <Td>
                        <VStack align="start" spacing={0}>
                          <Text>{campaign.audience}</Text>
                          <Text fontSize="xs" color="gray.500">
                            {campaign.audienceSize.toLocaleString()} contacts
                          </Text>
                        </VStack>
                      </Td>
                      <Td>
                        {campaign.performance.sent > 0 ? (
                          <VStack align="start" spacing={0}>
                            <Text>
                              {((campaign.performance.converted / campaign.performance.sent) * 100).toFixed(1)}% Conversion
                            </Text>
                            <Progress 
                              value={(campaign.performance.converted / campaign.performance.sent) * 100} 
                              size="sm" 
                              colorScheme="blue" 
                              width="100px" 
                              borderRadius="full"
                              mt={1}
                            />
                          </VStack>
                        ) : (
                          <Text color="gray.500">Not started</Text>
                        )}
                      </Td>
                      <Td>
                        <VStack align="start" spacing={0}>
                          <Text>
                            ${campaign.budget.spent.toLocaleString()} / ${campaign.budget.total.toLocaleString()}
                          </Text>
                          <Progress 
                            value={(campaign.budget.spent / campaign.budget.total) * 100} 
                            size="sm" 
                            colorScheme="green" 
                            width="100px" 
                            borderRadius="full"
                            mt={1}
                          />
                        </VStack>
                      </Td>
                      <Td>
                        <VStack align="start" spacing={0}>
                          <Text>{campaign.lastEdited}</Text>
                          <Text fontSize="xs" color="gray.500">
                            by {campaign.lastEditor}
                          </Text>
                        </VStack>
                      </Td>
                      <Td>
                        <HStack spacing={1}>
                          <Tooltip label="View Campaign">
                            <IconButton
                              icon={<Icon as={FiEye} />}
                              aria-label="View"
                              size="sm"
                              variant="ghost"
                              onClick={() => handleViewCampaign(campaign)}
                            />
                          </Tooltip>
                          <Tooltip label="Edit Campaign">
                            <IconButton
                              icon={<Icon as={FiEdit} />}
                              aria-label="Edit"
                              size="sm"
                              variant="ghost"
                              onClick={() => handleEditCampaign(campaign)}
                            />
                          </Tooltip>
                          <Menu>
                            <MenuButton
                              as={IconButton}
                              icon={<Icon as={FiMoreVertical} />}
                              variant="ghost"
                              size="sm"
                            />
                            <MenuList>
                              {campaign.status === 'Active' && (
                                <MenuItem 
                                  icon={<Icon as={FiPause} />}
                                  onClick={() => handleChangeCampaignStatus(campaign, 'Paused')}
                                >
                                  Pause Campaign
                                </MenuItem>
                              )}
                              {campaign.status === 'Paused' && (
                                <MenuItem 
                                  icon={<Icon as={FiPlay} />}
                                  onClick={() => handleChangeCampaignStatus(campaign, 'Activated')}
                                >
                                  Resume Campaign
                                </MenuItem>
                              )}
                              <MenuItem 
                                icon={<Icon as={FiBarChart2} />}
                                onClick={() => window.location.href = '/campaigns/insights'}
                              >
                                View Analytics
                              </MenuItem>
                              <MenuItem 
                                icon={<Icon as={FiCopy} />}
                                onClick={() => handleDuplicateCampaign(campaign)}
                              >
                                Duplicate
                              </MenuItem>
                              <MenuItem 
                                icon={<Icon as={FiDownload} />}
                              >
                                Export Data
                              </MenuItem>
                              <MenuItem 
                                icon={<Icon as={FiTrash2} />}
                                color="red.500"
                                onClick={() => handleDeleteCampaign(campaign)}
                              >
                                Delete Campaign
                              </MenuItem>
                            </MenuList>
                          </Menu>
                        </HStack>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </Box>
          </CardBody>
        </Card>
      </Box>

      {/* Campaign Details Drawer */}
      {selectedCampaign && (
        <Drawer
          isOpen={isOpen}
          placement="right"
          onClose={onClose}
          size="lg"
        >
          <DrawerOverlay />
          <DrawerContent>
            <DrawerCloseButton />
            <DrawerHeader borderBottomWidth="1px">
              <Flex justify="space-between" align="center">
                <Box>
                  {editMode ? 'Edit Campaign' : 'Campaign Details'}
                  <Badge ml={2} colorScheme={getStatusColor(selectedCampaign.status)}>
                    {selectedCampaign.status}
                  </Badge>
                </Box>
                {!editMode && (
                  <Button 
                    size="sm" 
                    leftIcon={<Icon as={FiEdit} />} 
                    onClick={() => setEditMode(true)}
                  >
                    Edit
                  </Button>
                )}
              </Flex>
            </DrawerHeader>

            <DrawerBody>
              <Tabs colorScheme="blue" isFitted variant="enclosed">
                <TabList mb="1em">
                  <Tab>Overview</Tab>
                  <Tab>Content</Tab>
                  <Tab>Audience</Tab>
                  <Tab>Performance</Tab>
                </TabList>
                <TabPanels>
                  {/* Overview Tab */}
                  <TabPanel>
                    <VStack spacing={6} align="start">
                      <FormControl>
                        <FormLabel>Campaign Name</FormLabel>
                        {editMode ? (
                          <Input 
                            defaultValue={selectedCampaign.name}
                          />
                        ) : (
                          <Text>{selectedCampaign.name}</Text>
                        )}
                      </FormControl>
                      
                      <SimpleGrid columns={2} spacing={6} width="full">
                        <FormControl>
                          <FormLabel>Campaign Type</FormLabel>
                          {editMode ? (
                            <Select defaultValue={selectedCampaign.type}>
                              <option value="Email">Email</option>
                              <option value="Mobile">Mobile</option>
                              <option value="Multi-channel">Multi-channel</option>
                            </Select>
                          ) : (
                            <Text>{selectedCampaign.type}</Text>
                          )}
                        </FormControl>
                        
                        <FormControl>
                          <FormLabel>Status</FormLabel>
                          {editMode ? (
                            <Select defaultValue={selectedCampaign.status}>
                              <option value="Active">Active</option>
                              <option value="Paused">Paused</option>
                              <option value="Draft">Draft</option>
                              <option value="Completed">Completed</option>
                            </Select>
                          ) : (
                            <Badge colorScheme={getStatusColor(selectedCampaign.status)}>
                              {selectedCampaign.status}
                            </Badge>
                          )}
                        </FormControl>
                      </SimpleGrid>
                      
                      <FormControl>
                        <FormLabel>Channels</FormLabel>
                        {editMode ? (
                          <SimpleGrid columns={2} spacing={4}>
                            <Checkbox defaultChecked={selectedCampaign.channels.includes('Email')}>
                              <HStack>
                                <Icon as={FiMail} color="blue.500" />
                                <Text>Email</Text>
                              </HStack>
                            </Checkbox>
                            <Checkbox defaultChecked={selectedCampaign.channels.includes('SMS')}>
                              <HStack>
                                <Icon as={FiMessageSquare} color="blue.500" />
                                <Text>SMS</Text>
                              </HStack>
                            </Checkbox>
                            <Checkbox defaultChecked={selectedCampaign.channels.includes('Mobile')}>
                              <HStack>
                                <Icon as={FiSmartphone} color="blue.500" />
                                <Text>Mobile App</Text>
                              </HStack>
                            </Checkbox>
                            <Checkbox defaultChecked={selectedCampaign.channels.includes('Web')}>
                              <HStack>
                                <Icon as={FiGlobe} color="blue.500" />
                                <Text>Web</Text>
                              </HStack>
                            </Checkbox>
                          </SimpleGrid>
                        ) : (
                          <HStack spacing={2}>
                            {selectedCampaign.channels.map((channel: string) => (
                              <Tag key={channel} size="md" colorScheme="blue" borderRadius="full">
                                <HStack spacing={1}>
                                  <Icon as={getChannelIcon(channel)} />
                                  <TagLabel>{channel}</TagLabel>
                                </HStack>
                              </Tag>
                            ))}
                          </HStack>
                        )}
                      </FormControl>
                      
                      <SimpleGrid columns={2} spacing={6} width="full">
                        <FormControl>
                          <FormLabel>Start Date</FormLabel>
                          {editMode ? (
                            <Input type="date" defaultValue={selectedCampaign.startDate} />
                          ) : (
                            <Text>{selectedCampaign.startDate}</Text>
                          )}
                        </FormControl>
                        
                        <FormControl>
                          <FormLabel>End Date</FormLabel>
                          {editMode ? (
                            <Input type="date" defaultValue={selectedCampaign.endDate === 'Ongoing' ? '' : selectedCampaign.endDate} />
                          ) : (
                            <Text>{selectedCampaign.endDate}</Text>
                          )}
                        </FormControl>
                      </SimpleGrid>
                      
                      <FormControl>
                        <FormLabel>Budget</FormLabel>
                        {editMode ? (
                          <InputGroup>
                            <InputLeftElement pointerEvents="none">$</InputLeftElement>
                            <Input type="number" defaultValue={selectedCampaign.budget.total} />
                          </InputGroup>
                        ) : (
                          <HStack>
                            <Text fontWeight="medium">${selectedCampaign.budget.spent.toLocaleString()} spent</Text>
                            <Text>of ${selectedCampaign.budget.total.toLocaleString()}</Text>
                            <Text color="green.500">
                              ({Math.round((selectedCampaign.budget.spent / selectedCampaign.budget.total) * 100)}%)
                            </Text>
                          </HStack>
                        )}
                      </FormControl>
                      
                      {!editMode && (
                        <Box width="full">
                          <Text fontWeight="medium" mb={2}>Campaign Timeline</Text>
                          <Card bg={useColorModeValue('gray.50', 'gray.700')}>
                            <CardBody>
                              <VStack align="start" spacing={4}>
                                <HStack>
                                  <Icon as={FiCalendar} color="blue.500" />
                                  <Text>Campaign Duration: {selectedCampaign.startDate} - {selectedCampaign.endDate}</Text>
                                </HStack>
                                <HStack>
                                  <Icon as={FiClock} color="blue.500" />
                                  <Text>Last Updated: {selectedCampaign.lastEdited} by {selectedCampaign.lastEditor}</Text>
                                </HStack>
                              </VStack>
                            </CardBody>
                          </Card>
                        </Box>
                      )}
                    </VStack>
                  </TabPanel>
                  
                  {/* Content Tab */}
                  <TabPanel>
                    <VStack spacing={6} align="start">
                      <Text>Campaign content would be displayed here for each channel.</Text>
                    </VStack>
                  </TabPanel>
                  
                  {/* Audience Tab */}
                  <TabPanel>
                    <VStack spacing={6} align="start">
                      <FormControl>
                        <FormLabel>Target Audience</FormLabel>
                        {editMode ? (
                          <Select defaultValue={selectedCampaign.audience}>
                            <option value="All Segments">All Segments</option>
                            <option value="High-Value Banking">High-Value Banking</option>
                            <option value="Digital Natives">Digital Natives</option>
                            <option value="Investment Focus">Investment Focus</option>
                            <option value="New Account Holders">New Account Holders</option>
                            <option value="Multiple Segments">Multiple Segments</option>
                          </Select>
                        ) : (
                          <HStack>
                            <Text>{selectedCampaign.audience}</Text>
                            <Badge colorScheme="blue">
                              {selectedCampaign.audienceSize.toLocaleString()} customers
                            </Badge>
                          </HStack>
                        )}
                      </FormControl>
                      
                      {!editMode && (
                        <Box width="full">
                          <Text fontWeight="medium" mb={2}>Audience Demographics</Text>
                          <Text>Demographics visualization would be displayed here.</Text>
                        </Box>
                      )}
                    </VStack>
                  </TabPanel>
                  
                  {/* Performance Tab */}
                  <TabPanel>
                    <VStack spacing={6} align="start">
                      <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={4} width="full">
                        <Stat>
                          <Text color="gray.500">Sent</Text>
                          <Text fontSize="2xl" fontWeight="bold">
                            {selectedCampaign.performance.sent.toLocaleString()}
                          </Text>
                        </Stat>
                        <Stat>
                          <Text color="gray.500">Delivered</Text>
                          <Text fontSize="2xl" fontWeight="bold">
                            {selectedCampaign.performance.delivered.toLocaleString()}
                          </Text>
                          <Text fontSize="sm" color="blue.500">
                            {Math.round((selectedCampaign.performance.delivered / selectedCampaign.performance.sent) * 100)}% delivery rate
                          </Text>
                        </Stat>
                        <Stat>
                          <Text color="gray.500">Opened</Text>
                          <Text fontSize="2xl" fontWeight="bold">
                            {selectedCampaign.performance.opened.toLocaleString()}
                          </Text>
                          <Text fontSize="sm" color="blue.500">
                            {Math.round((selectedCampaign.performance.opened / selectedCampaign.performance.delivered) * 100)}% open rate
                          </Text>
                        </Stat>
                        <Stat>
                          <Text color="gray.500">Clicked</Text>
                          <Text fontSize="2xl" fontWeight="bold">
                            {selectedCampaign.performance.clicked.toLocaleString()}
                          </Text>
                          <Text fontSize="sm" color="blue.500">
                            {Math.round((selectedCampaign.performance.clicked / selectedCampaign.performance.opened) * 100)}% click rate
                          </Text>
                        </Stat>
                      </SimpleGrid>
                      
                      <VStack align="start" width="full" spacing={2}>
                        <Text fontWeight="medium">Conversion Funnel</Text>
                        <Box width="full" padding={4} bg={useColorModeValue('gray.50', 'gray.700')} borderRadius="md">
                          <Text>Conversion funnel visualization would be displayed here.</Text>
                        </Box>
                      </VStack>
                      
                      <HStack width="full" justify="space-between">
                        <Text fontWeight="bold">Conversion Rate</Text>
                        <Text fontWeight="bold" color="green.500">
                          {((selectedCampaign.performance.converted / selectedCampaign.performance.sent) * 100).toFixed(1)}%
                        </Text>
                      </HStack>
                      <Progress
                        value={(selectedCampaign.performance.converted / selectedCampaign.performance.sent) * 100}
                        colorScheme="green"
                        size="md"
                        width="full"
                        borderRadius="full"
                      />
                      
                      <Button 
                        leftIcon={<Icon as={FiBarChart2} />} 
                        colorScheme="blue"
                        variant="outline"
                        width="full"
                        onClick={() => window.location.href = '/campaigns/insights'}
                      >
                        View Detailed Analytics
                      </Button>
                    </VStack>
                  </TabPanel>
                </TabPanels>
              </Tabs>
            </DrawerBody>

            <DrawerFooter borderTopWidth="1px">
              <Button variant="outline" mr={3} onClick={onClose}>
                {editMode ? 'Cancel' : 'Close'}
              </Button>
              {editMode && (
                <Button colorScheme="blue" onClick={handleSaveChanges}>
                  Save Changes
                </Button>
              )}
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        isOpen={isAlertOpen}
        leastDestructiveRef={cancelRef}
        onClose={onAlertClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete Campaign
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure you want to delete "{campaignToDelete?.name}"? This action cannot be undone.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onAlertClose}>
                Cancel
              </Button>
              <Button colorScheme="red" onClick={confirmDelete} ml={3}>
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </DashboardLayout>
  );
} 