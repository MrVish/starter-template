'use client';

import { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardBody,
  Heading,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Text,
  HStack,
  VStack,
  Badge,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
  useColorModeValue,
  InputGroup,
  Input,
  InputRightElement,
  Select,
  Flex,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Textarea,
  useToast,
} from '@chakra-ui/react';
import { 
  FiMoreVertical, 
  FiEdit2, 
  FiEye, 
  FiTrash2, 
  FiPauseCircle, 
  FiPlayCircle, 
  FiCalendar, 
  FiSearch, 
  FiFilter, 
  FiPlus 
} from 'react-icons/fi';
import DashboardLayout from '@/components/layout/DashboardLayout';

// Sample campaign data
const sampleCampaigns = [
  {
    id: 1,
    name: 'Summer Promotion 2024',
    type: 'Customer Engagement',
    status: 'Active',
    startDate: '2024-06-01',
    endDate: '2024-07-31',
    budget: 25000,
    reach: 45000,
    conversion: 3.2,
    primaryChannel: 'Email',
  },
  {
    id: 2,
    name: 'New Customer Welcome',
    type: 'Customer Acquisition',
    status: 'Active',
    startDate: '2024-01-15',
    endDate: '2024-12-31',
    budget: 15000,
    reach: 12000,
    conversion: 5.7,
    primaryChannel: 'Email',
  },
  {
    id: 3,
    name: 'Spring Sale',
    type: 'Customer Engagement',
    status: 'Completed',
    startDate: '2024-03-01',
    endDate: '2024-04-15',
    budget: 18000,
    reach: 35000,
    conversion: 4.1,
    primaryChannel: 'Social Media',
  },
  {
    id: 4,
    name: 'Credit Card Promotion',
    type: 'Product Launch',
    status: 'Draft',
    startDate: '2024-08-01',
    endDate: '2024-09-30',
    budget: 30000,
    reach: 0,
    conversion: 0,
    primaryChannel: 'Multi-channel',
  },
  {
    id: 5,
    name: 'Loyalty Program Reactivation',
    type: 'Customer Retention',
    status: 'Paused',
    startDate: '2024-02-15',
    endDate: '2024-05-15',
    budget: 12000,
    reach: 8500,
    conversion: 2.8,
    primaryChannel: 'SMS',
  },
  {
    id: 6,
    name: 'Holiday Special',
    type: 'Customer Engagement',
    status: 'Scheduled',
    startDate: '2024-11-15',
    endDate: '2024-12-31',
    budget: 40000,
    reach: 0,
    conversion: 0,
    primaryChannel: 'Multi-channel',
  },
];

export default function ViewEditCampaignsPage() {
  const toast = useToast();
  const [campaigns, setCampaigns] = useState(sampleCampaigns);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  
  const bgColor = useColorModeValue('white', 'gray.800');
  const headerBgColor = useColorModeValue('gray.50', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  
  // Filter campaigns based on search and filter status
  const filteredCampaigns = campaigns.filter(campaign => {
    const matchesSearch = campaign.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === 'All' || campaign.status === filterStatus;
    return matchesSearch && matchesFilter;
  });
  
  const handleEditCampaign = (campaign) => {
    setSelectedCampaign(campaign);
    onOpen();
  };
  
  const handleSaveCampaign = () => {
    // In a real app, you would update the campaign in the database
    setCampaigns(campaigns.map(c => c.id === selectedCampaign.id ? selectedCampaign : c));
    toast({
      title: 'Campaign updated',
      description: 'The campaign has been updated successfully.',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
    onClose();
  };
  
  const handleStatusChange = (id, newStatus) => {
    setCampaigns(campaigns.map(campaign => 
      campaign.id === id ? {...campaign, status: newStatus} : campaign
    ));
    
    toast({
      title: 'Status updated',
      description: `Campaign status changed to ${newStatus}.`,
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };
  
  const getStatusColor = (status) => {
    switch(status) {
      case 'Active': return 'green';
      case 'Paused': return 'yellow';
      case 'Completed': return 'blue';
      case 'Draft': return 'gray';
      case 'Scheduled': return 'purple';
      default: return 'gray';
    }
  };
  
  return (
    <DashboardLayout>
      <Box px={6} py={4} maxW="1400px" mx="auto">
        <HStack justify="space-between" mb={6}>
          <Heading size="lg">Campaign Management</Heading>
          <Button 
            leftIcon={<FiPlus />} 
            colorScheme="blue"
            onClick={() => window.location.href = '/campaigns/build-campaigns'}
          >
            New Campaign
          </Button>
        </HStack>
        
        <Card boxShadow="sm" mb={6} borderColor={borderColor}>
          <CardBody>
            <Flex direction={{ base: 'column', md: 'row' }} gap={4} mb={4}>
              <InputGroup size="md" maxW={{ md: '320px' }}>
                <Input
                  placeholder="Search campaigns..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <InputRightElement>
                  <FiSearch />
                </InputRightElement>
              </InputGroup>
              
              <Select 
                maxW={{ md: '200px' }} 
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="All">All Statuses</option>
                <option value="Active">Active</option>
                <option value="Paused">Paused</option>
                <option value="Completed">Completed</option>
                <option value="Draft">Draft</option>
                <option value="Scheduled">Scheduled</option>
              </Select>
            </Flex>
            
            <Box overflowX="auto">
              <Table variant="simple">
                <Thead bg={headerBgColor}>
                  <Tr>
                    <Th>Campaign Name</Th>
                    <Th>Type</Th>
                    <Th>Status</Th>
                    <Th>Duration</Th>
                    <Th isNumeric>Budget</Th>
                    <Th isNumeric>Reach</Th>
                    <Th isNumeric>Conv. Rate</Th>
                    <Th>Channel</Th>
                    <Th>Actions</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {filteredCampaigns.map((campaign) => (
                    <Tr key={campaign.id}>
                      <Td fontWeight="medium">{campaign.name}</Td>
                      <Td>{campaign.type}</Td>
                      <Td>
                        <Badge colorScheme={getStatusColor(campaign.status)}>
                          {campaign.status}
                        </Badge>
                      </Td>
                      <Td>
                        <Text fontSize="sm">
                          {new Date(campaign.startDate).toLocaleDateString()} - 
                          <br />
                          {new Date(campaign.endDate).toLocaleDateString()}
                        </Text>
                      </Td>
                      <Td isNumeric>${campaign.budget.toLocaleString()}</Td>
                      <Td isNumeric>{campaign.reach.toLocaleString()}</Td>
                      <Td isNumeric>{campaign.conversion}%</Td>
                      <Td>{campaign.primaryChannel}</Td>
                      <Td>
                        <Menu>
                          <MenuButton
                            as={IconButton}
                            icon={<FiMoreVertical />}
                            variant="ghost"
                            size="sm"
                          />
                          <MenuList>
                            <MenuItem icon={<FiEye />} onClick={() => window.location.href = `/campaigns/view-edit-campaigns/${campaign.id}`}>
                              View Details
                            </MenuItem>
                            <MenuItem icon={<FiEdit2 />} onClick={() => handleEditCampaign(campaign)}>
                              Edit Campaign
                            </MenuItem>
                            {campaign.status === 'Active' && (
                              <MenuItem icon={<FiPauseCircle />} onClick={() => handleStatusChange(campaign.id, 'Paused')}>
                                Pause Campaign
                              </MenuItem>
                            )}
                            {campaign.status === 'Paused' && (
                              <MenuItem icon={<FiPlayCircle />} onClick={() => handleStatusChange(campaign.id, 'Active')}>
                                Resume Campaign
                              </MenuItem>
                            )}
                            {(campaign.status === 'Draft' || campaign.status === 'Scheduled') && (
                              <MenuItem icon={<FiPlayCircle />} onClick={() => handleStatusChange(campaign.id, 'Active')}>
                                Activate Campaign
                              </MenuItem>
                            )}
                            <MenuItem icon={<FiTrash2 />} color="red.500">
                              Delete Campaign
                            </MenuItem>
                          </MenuList>
                        </Menu>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
              
              {filteredCampaigns.length === 0 && (
                <Box textAlign="center" py={10}>
                  <Text fontSize="lg" color="gray.500">No campaigns found</Text>
                </Box>
              )}
            </Box>
          </CardBody>
        </Card>
        
        <Card boxShadow="sm" borderColor={borderColor}>
          <CardBody>
            <Heading size="md" mb={4}>Campaign Performance Summary</Heading>
            <HStack spacing={8} wrap="wrap">
              <VStack align="flex-start">
                <Text color="gray.500" fontSize="sm">Total Active Campaigns</Text>
                <Text fontSize="2xl" fontWeight="bold">{campaigns.filter(c => c.status === 'Active').length}</Text>
              </VStack>
              
              <VStack align="flex-start">
                <Text color="gray.500" fontSize="sm">Total Budget Allocated</Text>
                <Text fontSize="2xl" fontWeight="bold">
                  ${campaigns.reduce((acc, curr) => acc + curr.budget, 0).toLocaleString()}
                </Text>
              </VStack>
              
              <VStack align="flex-start">
                <Text color="gray.500" fontSize="sm">Average Conversion Rate</Text>
                <Text fontSize="2xl" fontWeight="bold">
                  {(campaigns.filter(c => c.conversion > 0).reduce((acc, curr) => acc + curr.conversion, 0) / 
                    campaigns.filter(c => c.conversion > 0).length).toFixed(2)}%
                </Text>
              </VStack>
              
              <VStack align="flex-start">
                <Text color="gray.500" fontSize="sm">Total Customer Reach</Text>
                <Text fontSize="2xl" fontWeight="bold">
                  {campaigns.reduce((acc, curr) => acc + curr.reach, 0).toLocaleString()}
                </Text>
              </VStack>
            </HStack>
          </CardBody>
        </Card>
      </Box>
      
      {/* Edit Campaign Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit Campaign</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {selectedCampaign && (
              <VStack spacing={4} align="stretch">
                <FormControl>
                  <FormLabel>Campaign Name</FormLabel>
                  <Input 
                    value={selectedCampaign.name} 
                    onChange={(e) => setSelectedCampaign({...selectedCampaign, name: e.target.value})}
                  />
                </FormControl>
                
                <FormControl>
                  <FormLabel>Campaign Type</FormLabel>
                  <Select 
                    value={selectedCampaign.type}
                    onChange={(e) => setSelectedCampaign({...selectedCampaign, type: e.target.value})}
                  >
                    <option value="Customer Acquisition">Customer Acquisition</option>
                    <option value="Customer Retention">Customer Retention</option>
                    <option value="Customer Engagement">Customer Engagement</option>
                    <option value="Brand Awareness">Brand Awareness</option>
                    <option value="Product Launch">Product Launch</option>
                  </Select>
                </FormControl>
                
                <FormControl>
                  <FormLabel>Status</FormLabel>
                  <Select 
                    value={selectedCampaign.status}
                    onChange={(e) => setSelectedCampaign({...selectedCampaign, status: e.target.value})}
                  >
                    <option value="Active">Active</option>
                    <option value="Paused">Paused</option>
                    <option value="Completed">Completed</option>
                    <option value="Draft">Draft</option>
                    <option value="Scheduled">Scheduled</option>
                  </Select>
                </FormControl>
                
                <HStack>
                  <FormControl>
                    <FormLabel>Start Date</FormLabel>
                    <Input 
                      type="date" 
                      value={selectedCampaign.startDate}
                      onChange={(e) => setSelectedCampaign({...selectedCampaign, startDate: e.target.value})}
                    />
                  </FormControl>
                  
                  <FormControl>
                    <FormLabel>End Date</FormLabel>
                    <Input 
                      type="date" 
                      value={selectedCampaign.endDate}
                      onChange={(e) => setSelectedCampaign({...selectedCampaign, endDate: e.target.value})}
                    />
                  </FormControl>
                </HStack>
                
                <FormControl>
                  <FormLabel>Budget</FormLabel>
                  <InputGroup>
                    <Input 
                      type="number" 
                      value={selectedCampaign.budget}
                      onChange={(e) => setSelectedCampaign({...selectedCampaign, budget: Number(e.target.value)})}
                    />
                  </InputGroup>
                </FormControl>
                
                <FormControl>
                  <FormLabel>Primary Channel</FormLabel>
                  <Select 
                    value={selectedCampaign.primaryChannel}
                    onChange={(e) => setSelectedCampaign({...selectedCampaign, primaryChannel: e.target.value})}
                  >
                    <option value="Email">Email</option>
                    <option value="Social Media">Social Media</option>
                    <option value="SMS">SMS</option>
                    <option value="Push Notification">Push Notification</option>
                    <option value="Web">Web</option>
                    <option value="Multi-channel">Multi-channel</option>
                  </Select>
                </FormControl>
              </VStack>
            )}
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button colorScheme="blue" onClick={handleSaveCampaign}>
              Save Changes
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </DashboardLayout>
  );
} 