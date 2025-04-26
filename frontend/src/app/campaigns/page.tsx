'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  Flex,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  Select,
  Textarea,
  HStack,
  VStack,
  Stack,
  Spinner,
  useToast,
  InputGroup,
  InputLeftElement,
  Tag,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Icon,
} from '@chakra-ui/react';
import { 
  FiPlus, 
  FiSearch, 
  FiChevronDown, 
  FiEdit2, 
  FiTrash2, 
  FiMoreVertical, 
  FiCalendar, 
  FiDollarSign, 
  FiTarget, 
  FiBarChart2, 
  FiFilter
} from 'react-icons/fi';

// Types
interface Campaign {
  id: number;
  name: string;
  description: string;
  start_date: string;
  end_date: string;
  budget: number;
  status: 'active' | 'scheduled' | 'completed' | 'paused';
  channel: string;
  target_segment: string;
  created_at: string;
  metrics: {
    impressions: number;
    clicks: number;
    conversions: number;
    ctr: number;
    conv_rate: number;
    spend: number;
    roi: number;
  };
}

// Mock data generator
const generateMockCampaigns = (): Campaign[] => {
  const statuses = ['active', 'scheduled', 'completed', 'paused'] as const;
  const channels = ['Email', 'Social Media', 'Search', 'Display', 'SMS'];
  const segments = ['High Value', 'New Customers', 'Regulars', 'At Risk'];
  
  return Array.from({ length: 15 }, (_, i) => {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - Math.floor(Math.random() * 30));
    
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + Math.floor(Math.random() * 60) + 30);
    
    const impressions = Math.floor(Math.random() * 50000) + 5000;
    const clicks = Math.floor(impressions * (Math.random() * 0.08 + 0.02));
    const conversions = Math.floor(clicks * (Math.random() * 0.15 + 0.05));
    const spend = Math.floor(Math.random() * 5000) + 1000;
    
    return {
      id: i + 1,
      name: `Campaign ${String.fromCharCode(65 + i % 26)}${Math.floor(i / 26) + 1}`,
      description: `This is a ${channels[i % channels.length]} campaign targeting ${segments[i % segments.length]} customers.`,
      start_date: startDate.toISOString().split('T')[0],
      end_date: endDate.toISOString().split('T')[0],
      budget: Math.floor(Math.random() * 10000) + 5000,
      status: statuses[i % statuses.length],
      channel: channels[i % channels.length],
      target_segment: segments[i % segments.length],
      created_at: new Date(new Date().setDate(new Date().getDate() - Math.floor(Math.random() * 90))).toISOString(),
      metrics: {
        impressions,
        clicks,
        conversions,
        ctr: parseFloat(((clicks / impressions) * 100).toFixed(2)),
        conv_rate: parseFloat(((conversions / clicks) * 100).toFixed(2)),
        spend,
        roi: parseFloat(((conversions * 100 - spend) / spend).toFixed(2)),
      },
    };
  });
};

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [channelFilter, setChannelFilter] = useState('all');
  const [sortField, setSortField] = useState('start_date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  
  const { isOpen: isCreateOpen, onOpen: onCreateOpen, onClose: onCreateClose } = useDisclosure();
  const { isOpen: isEditOpen, onOpen: onEditOpen, onClose: onEditClose } = useDisclosure();
  const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();
  
  const cancelRef = React.useRef<HTMLButtonElement>(null);
  const toast = useToast();

  // Fetch campaigns
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setCampaigns(generateMockCampaigns());
      setLoading(false);
    }, 1000);
  }, []);

  // Filter and sort campaigns
  const filteredCampaigns = campaigns
    .filter(campaign => {
      const matchesSearch = campaign.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           campaign.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'all' || campaign.status === statusFilter;
      const matchesChannel = channelFilter === 'all' || campaign.channel === channelFilter;
      
      return matchesSearch && matchesStatus && matchesChannel;
    })
    .sort((a, b) => {
      let fieldA: any = sortField === 'metrics.roi' ? a.metrics.roi : 
                      sortField === 'metrics.ctr' ? a.metrics.ctr :
                      sortField === 'metrics.spend' ? a.metrics.spend :
                      a[sortField as keyof Campaign];
                      
      let fieldB: any = sortField === 'metrics.roi' ? b.metrics.roi : 
                      sortField === 'metrics.ctr' ? b.metrics.ctr :
                      sortField === 'metrics.spend' ? b.metrics.spend :
                      b[sortField as keyof Campaign];
                      
      if (typeof fieldA === 'string') {
        fieldA = fieldA.toLowerCase();
        fieldB = fieldB.toLowerCase();
      }
      
      return sortDirection === 'asc' 
        ? fieldA > fieldB ? 1 : -1
        : fieldA < fieldB ? 1 : -1;
    });

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleCreateCampaign = () => {
    const newCampaign = {
      id: campaigns.length + 1,
      name: 'New Campaign',
      description: 'Description of the new campaign',
      start_date: new Date().toISOString().split('T')[0],
      end_date: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString().split('T')[0],
      budget: 5000,
      status: 'scheduled' as const,
      channel: 'Email',
      target_segment: 'New Customers',
      created_at: new Date().toISOString(),
      metrics: {
        impressions: 0,
        clicks: 0,
        conversions: 0,
        ctr: 0,
        conv_rate: 0,
        spend: 0,
        roi: 0,
      },
    };
    
    setCampaigns([...campaigns, newCampaign]);
    onCreateClose();
    
    toast({
      title: 'Campaign created.',
      description: "Your new campaign has been created successfully.",
      status: 'success',
      duration: 5000,
      isClosable: true,
    });
  };

  const handleEditCampaign = () => {
    if (!selectedCampaign) return;
    
    const updatedCampaigns = campaigns.map(campaign => 
      campaign.id === selectedCampaign.id ? selectedCampaign : campaign
    );
    
    setCampaigns(updatedCampaigns);
    onEditClose();
    
    toast({
      title: 'Campaign updated.',
      description: "Your campaign has been updated successfully.",
      status: 'success',
      duration: 5000,
      isClosable: true,
    });
  };

  const handleDeleteCampaign = () => {
    if (!selectedCampaign) return;
    
    const updatedCampaigns = campaigns.filter(campaign => campaign.id !== selectedCampaign.id);
    setCampaigns(updatedCampaigns);
    onDeleteClose();
    
    toast({
      title: 'Campaign deleted.',
      description: "Your campaign has been deleted successfully.",
      status: 'info',
      duration: 5000,
      isClosable: true,
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'green';
      case 'scheduled': return 'blue';
      case 'completed': return 'gray';
      case 'paused': return 'orange';
      default: return 'gray';
    }
  };

  if (loading) {
    return (
      <Container maxW="container.xl" py={8}>
        <Flex justify="center" align="center" height="400px">
          <Spinner size="xl" />
        </Flex>
      </Container>
    );
  }

  return (
    <Container maxW="container.xl" py={8}>
      <Flex justify="space-between" align="center" mb={6}>
        <Heading as="h1" size="xl">Campaigns</Heading>
        <Button leftIcon={<FiPlus />} colorScheme="blue" onClick={onCreateOpen}>
          Create Campaign
        </Button>
      </Flex>

      {/* Filters */}
      <Flex mb={6} flexWrap="wrap" gap={4}>
        <InputGroup maxW="300px">
          <InputLeftElement pointerEvents="none">
            <FiSearch color="gray.300" />
          </InputLeftElement>
          <Input
            placeholder="Search campaigns"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </InputGroup>

        <HStack spacing={4}>
          <Select 
            maxW="160px" 
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value)}
            icon={<FiFilter />}
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="scheduled">Scheduled</option>
            <option value="completed">Completed</option>
            <option value="paused">Paused</option>
          </Select>

          <Select 
            maxW="160px" 
            value={channelFilter} 
            onChange={(e) => setChannelFilter(e.target.value)}
            icon={<FiFilter />}
          >
            <option value="all">All Channels</option>
            <option value="Email">Email</option>
            <option value="Social Media">Social Media</option>
            <option value="Search">Search</option>
            <option value="Display">Display</option>
            <option value="SMS">SMS</option>
          </Select>
        </HStack>
      </Flex>

      {/* Campaigns Table */}
      <Box overflowX="auto">
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th 
                cursor="pointer"
                onClick={() => handleSort('name')}
              >
                Campaign Name
                {sortField === 'name' && (
                  <Icon ml={1} as={FiChevronDown} transform={sortDirection === 'asc' ? 'rotate(180deg)' : 'none'} />
                )}
              </Th>
              <Th>Status</Th>
              <Th 
                cursor="pointer"
                onClick={() => handleSort('start_date')}
              >
                Start Date
                {sortField === 'start_date' && (
                  <Icon ml={1} as={FiChevronDown} transform={sortDirection === 'asc' ? 'rotate(180deg)' : 'none'} />
                )}
              </Th>
              <Th 
                cursor="pointer"
                onClick={() => handleSort('budget')}
              >
                Budget
                {sortField === 'budget' && (
                  <Icon ml={1} as={FiChevronDown} transform={sortDirection === 'asc' ? 'rotate(180deg)' : 'none'} />
                )}
              </Th>
              <Th 
                cursor="pointer"
                onClick={() => handleSort('metrics.spend')}
              >
                Spend
                {sortField === 'metrics.spend' && (
                  <Icon ml={1} as={FiChevronDown} transform={sortDirection === 'asc' ? 'rotate(180deg)' : 'none'} />
                )}
              </Th>
              <Th 
                cursor="pointer"
                onClick={() => handleSort('metrics.ctr')}
              >
                CTR
                {sortField === 'metrics.ctr' && (
                  <Icon ml={1} as={FiChevronDown} transform={sortDirection === 'asc' ? 'rotate(180deg)' : 'none'} />
                )}
              </Th>
              <Th 
                cursor="pointer"
                onClick={() => handleSort('metrics.roi')}
              >
                ROI
                {sortField === 'metrics.roi' && (
                  <Icon ml={1} as={FiChevronDown} transform={sortDirection === 'asc' ? 'rotate(180deg)' : 'none'} />
                )}
              </Th>
              <Th>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {filteredCampaigns.map((campaign) => (
              <Tr key={campaign.id}>
                <Td>
                  <VStack align="start" spacing={1}>
                    <Text fontWeight="medium">{campaign.name}</Text>
                    <Text fontSize="sm" color="gray.500">{campaign.channel}</Text>
                  </VStack>
                </Td>
                <Td>
                  <Badge colorScheme={getStatusColor(campaign.status)}>
                    {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
                  </Badge>
                </Td>
                <Td>
                  <VStack align="start" spacing={1}>
                    <Text>{campaign.start_date}</Text>
                    <Text fontSize="sm" color="gray.500">to {campaign.end_date}</Text>
                  </VStack>
                </Td>
                <Td>${campaign.budget.toLocaleString()}</Td>
                <Td>${campaign.metrics.spend.toLocaleString()}</Td>
                <Td>{campaign.metrics.ctr}%</Td>
                <Td>{campaign.metrics.roi}x</Td>
                <Td>
                  <Menu>
                    <MenuButton
                      as={IconButton}
                      aria-label='Actions'
                      icon={<FiMoreVertical />}
                      variant="ghost"
                    />
                    <MenuList>
                      <MenuItem 
                        icon={<FiEdit2 />} 
                        onClick={() => {
                          setSelectedCampaign(campaign);
                          onEditOpen();
                        }}
                      >
                        Edit
                      </MenuItem>
                      <MenuItem 
                        icon={<FiTrash2 />} 
                        color="red.500"
                        onClick={() => {
                          setSelectedCampaign(campaign);
                          onDeleteOpen();
                        }}
                      >
                        Delete
                      </MenuItem>
                    </MenuList>
                  </Menu>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>

      {/* Create Campaign Modal */}
      <Modal isOpen={isCreateOpen} onClose={onCreateClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create New Campaign</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Stack spacing={4}>
              <FormControl isRequired>
                <FormLabel>Campaign Name</FormLabel>
                <Input placeholder="Enter campaign name" />
              </FormControl>
              
              <FormControl>
                <FormLabel>Description</FormLabel>
                <Textarea placeholder="Campaign description" />
              </FormControl>
              
              <HStack>
                <FormControl isRequired>
                  <FormLabel>Start Date</FormLabel>
                  <Input type="date" />
                </FormControl>
                
                <FormControl isRequired>
                  <FormLabel>End Date</FormLabel>
                  <Input type="date" />
                </FormControl>
              </HStack>
              
              <FormControl isRequired>
                <FormLabel>Budget</FormLabel>
                <InputGroup>
                  <InputLeftElement
                    pointerEvents="none"
                    color="gray.300"
                    children="$"
                  />
                  <Input type="number" placeholder="Enter budget amount" />
                </InputGroup>
              </FormControl>
              
              <HStack>
                <FormControl isRequired>
                  <FormLabel>Channel</FormLabel>
                  <Select>
                    <option value="Email">Email</option>
                    <option value="Social Media">Social Media</option>
                    <option value="Search">Search</option>
                    <option value="Display">Display</option>
                    <option value="SMS">SMS</option>
                  </Select>
                </FormControl>
                
                <FormControl isRequired>
                  <FormLabel>Target Segment</FormLabel>
                  <Select>
                    <option value="High Value">High Value</option>
                    <option value="New Customers">New Customers</option>
                    <option value="Regulars">Regulars</option>
                    <option value="At Risk">At Risk</option>
                  </Select>
                </FormControl>
              </HStack>
              
              <FormControl>
                <FormLabel>Status</FormLabel>
                <Select defaultValue="scheduled">
                  <option value="active">Active</option>
                  <option value="scheduled">Scheduled</option>
                  <option value="paused">Paused</option>
                </Select>
              </FormControl>
            </Stack>
          </ModalBody>

          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onCreateClose}>
              Cancel
            </Button>
            <Button colorScheme="blue" onClick={handleCreateCampaign}>Create Campaign</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Edit Campaign Modal */}
      <Modal isOpen={isEditOpen} onClose={onEditClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit Campaign</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Stack spacing={4}>
              <FormControl isRequired>
                <FormLabel>Campaign Name</FormLabel>
                <Input 
                  placeholder="Enter campaign name" 
                  value={selectedCampaign?.name || ''}
                  onChange={(e) => setSelectedCampaign(selectedCampaign ? {
                    ...selectedCampaign,
                    name: e.target.value
                  } : null)}
                />
              </FormControl>
              
              <FormControl>
                <FormLabel>Description</FormLabel>
                <Textarea 
                  placeholder="Campaign description" 
                  value={selectedCampaign?.description || ''}
                  onChange={(e) => setSelectedCampaign(selectedCampaign ? {
                    ...selectedCampaign,
                    description: e.target.value
                  } : null)}
                />
              </FormControl>
              
              <HStack>
                <FormControl isRequired>
                  <FormLabel>Start Date</FormLabel>
                  <Input 
                    type="date" 
                    value={selectedCampaign?.start_date || ''}
                    onChange={(e) => setSelectedCampaign(selectedCampaign ? {
                      ...selectedCampaign,
                      start_date: e.target.value
                    } : null)}
                  />
                </FormControl>
                
                <FormControl isRequired>
                  <FormLabel>End Date</FormLabel>
                  <Input 
                    type="date" 
                    value={selectedCampaign?.end_date || ''}
                    onChange={(e) => setSelectedCampaign(selectedCampaign ? {
                      ...selectedCampaign,
                      end_date: e.target.value
                    } : null)}
                  />
                </FormControl>
              </HStack>
              
              <FormControl isRequired>
                <FormLabel>Budget</FormLabel>
                <InputGroup>
                  <InputLeftElement
                    pointerEvents="none"
                    color="gray.300"
                    children="$"
                  />
                  <Input 
                    type="number" 
                    placeholder="Enter budget amount" 
                    value={selectedCampaign?.budget || 0}
                    onChange={(e) => setSelectedCampaign(selectedCampaign ? {
                      ...selectedCampaign,
                      budget: Number(e.target.value)
                    } : null)}
                  />
                </InputGroup>
              </FormControl>
              
              <HStack>
                <FormControl isRequired>
                  <FormLabel>Channel</FormLabel>
                  <Select 
                    value={selectedCampaign?.channel || ''}
                    onChange={(e) => setSelectedCampaign(selectedCampaign ? {
                      ...selectedCampaign,
                      channel: e.target.value
                    } : null)}
                  >
                    <option value="Email">Email</option>
                    <option value="Social Media">Social Media</option>
                    <option value="Search">Search</option>
                    <option value="Display">Display</option>
                    <option value="SMS">SMS</option>
                  </Select>
                </FormControl>
                
                <FormControl isRequired>
                  <FormLabel>Target Segment</FormLabel>
                  <Select 
                    value={selectedCampaign?.target_segment || ''}
                    onChange={(e) => setSelectedCampaign(selectedCampaign ? {
                      ...selectedCampaign,
                      target_segment: e.target.value
                    } : null)}
                  >
                    <option value="High Value">High Value</option>
                    <option value="New Customers">New Customers</option>
                    <option value="Regulars">Regulars</option>
                    <option value="At Risk">At Risk</option>
                  </Select>
                </FormControl>
              </HStack>
              
              <FormControl>
                <FormLabel>Status</FormLabel>
                <Select 
                  value={selectedCampaign?.status || ''}
                  onChange={(e) => setSelectedCampaign(selectedCampaign ? {
                    ...selectedCampaign,
                    status: e.target.value as any
                  } : null)}
                >
                  <option value="active">Active</option>
                  <option value="scheduled">Scheduled</option>
                  <option value="paused">Paused</option>
                  <option value="completed">Completed</option>
                </Select>
              </FormControl>
            </Stack>
          </ModalBody>

          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onEditClose}>
              Cancel
            </Button>
            <Button colorScheme="blue" onClick={handleEditCampaign}>Save Changes</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Delete Confirmation */}
      <AlertDialog
        isOpen={isDeleteOpen}
        leastDestructiveRef={cancelRef}
        onClose={onDeleteClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete Campaign
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure you want to delete campaign "{selectedCampaign?.name}"? This action cannot be undone.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onDeleteClose}>
                Cancel
              </Button>
              <Button colorScheme="red" onClick={handleDeleteCampaign} ml={3}>
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Container>
  );
} 