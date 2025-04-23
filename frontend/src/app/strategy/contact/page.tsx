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
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  FormControl,
  FormLabel,
  Switch,
  Divider,
  Progress,
} from '@chakra-ui/react';
import {
  FiMail,
  FiSearch,
  FiFilter,
  FiPlus,
  FiEdit,
  FiTrash2,
  FiCalendar,
  FiBarChart2,
  FiMessageSquare,
  FiSmartphone,
  FiTarget,
  FiGlobe,
  FiInstagram,
  FiFacebook,
  FiTwitter,
  FiMoreVertical,
  FiDownload,
  FiSave,
} from 'react-icons/fi';
import DashboardLayout from '../../../components/layout/DashboardLayout';

// Sample communication channels data
const COMMUNICATION_CHANNELS = [
  {
    id: 1,
    name: 'Email Marketing',
    segment: 'All Segments',
    icon: FiMail,
    priority: 'High',
    frequency: 'Weekly',
    openRate: '28%',
    clickRate: '5.2%',
    conversionRate: '1.8%',
    lastCampaign: '2024-03-15',
    status: 'Active',
  },
  {
    id: 2,
    name: 'Mobile App Notifications',
    segment: 'Digital Natives',
    icon: FiSmartphone,
    priority: 'Medium',
    frequency: 'Bi-weekly',
    openRate: '42%',
    clickRate: '12.5%',
    conversionRate: '3.2%',
    lastCampaign: '2024-03-14',
    status: 'Active',
  },
  {
    id: 3,
    name: 'SMS Alerts',
    segment: 'High-Value Banking',
    icon: FiMessageSquare,
    priority: 'High',
    frequency: 'Monthly',
    openRate: '94%',
    clickRate: '8.1%',
    conversionRate: '2.4%',
    lastCampaign: '2024-03-10',
    status: 'Active',
  },
  {
    id: 4,
    name: 'Social Media',
    segment: 'New Account Holders',
    icon: FiFacebook,
    priority: 'Medium',
    frequency: 'Daily',
    openRate: '18%',
    clickRate: '4.2%',
    conversionRate: '0.9%',
    lastCampaign: '2024-03-16',
    status: 'Active',
  },
  {
    id: 5,
    name: 'Web Banners',
    segment: 'Investment Focus',
    icon: FiGlobe,
    priority: 'Low',
    frequency: 'Continuous',
    openRate: '12%',
    clickRate: '2.8%',
    conversionRate: '0.5%',
    lastCampaign: '2024-03-01',
    status: 'Inactive',
  },
];

// Customer journey touchpoints
const JOURNEY_TOUCHPOINTS = [
  {
    stage: 'Awareness',
    channels: ['Social Media', 'Web Banners'],
    engagement: 75,
  },
  {
    stage: 'Consideration',
    channels: ['Email Marketing', 'Social Media'],
    engagement: 62,
  },
  {
    stage: 'Decision',
    channels: ['Email Marketing', 'Mobile App Notifications'],
    engagement: 48,
  },
  {
    stage: 'Onboarding',
    channels: ['Email Marketing', 'SMS Alerts'],
    engagement: 85,
  },
  {
    stage: 'Retention',
    channels: ['Mobile App Notifications', 'Email Marketing'],
    engagement: 72,
  },
];

export default function ContactStrategy() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [activeTab, setActiveTab] = useState(0);
  const cardBg = useColorModeValue('white', 'gray.800');

  const filteredChannels = COMMUNICATION_CHANNELS.filter(channel =>
    (filterStatus === 'All' || channel.status === filterStatus) &&
    channel.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'red';
      case 'Medium': return 'orange';
      case 'Low': return 'green';
      default: return 'gray';
    }
  };

  const getStatusColor = (status: string) => {
    return status === 'Active' ? 'green' : 'gray';
  };

  return (
    <DashboardLayout>
      <Box mb={6}>
        <HStack spacing={4} align="center" mb={6}>
          <Icon as={FiMail} boxSize={8} color="blue.500" />
          <Box>
            <Heading as="h1" size="xl" color="secondary.700">
              Contact Strategy
            </Heading>
            <Text color="gray.600">
              Plan and optimize your customer communication channels
            </Text>
          </Box>
        </HStack>

        <Tabs colorScheme="blue" index={activeTab} onChange={(index) => setActiveTab(index)} mb={6}>
          <TabList>
            <Tab>Channel Management</Tab>
            <Tab>Customer Journey</Tab>
            <Tab>Communication Calendar</Tab>
          </TabList>

          <TabPanels>
            {/* Channel Management Tab */}
            <TabPanel px={0}>
              {/* Search and Filter */}
              <Flex gap={4} mb={6} wrap="wrap">
                <InputGroup maxW="320px">
                  <InputLeftElement pointerEvents="none">
                    <Icon as={FiSearch} color="gray.400" />
                  </InputLeftElement>
                  <Input
                    placeholder="Search channels..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </InputGroup>
                <Select
                  maxW="200px"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <option value="All">All Status</option>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </Select>
                <Button leftIcon={<Icon as={FiPlus} />} colorScheme="blue">
                  Add Channel
                </Button>
              </Flex>

              {/* Channels Table */}
              <Card bg={cardBg}>
                <CardBody>
                  <Box overflowX="auto">
                    <Table variant="simple">
                      <Thead>
                        <Tr>
                          <Th>Channel</Th>
                          <Th>Target Segment</Th>
                          <Th>Priority</Th>
                          <Th>Frequency</Th>
                          <Th>Open Rate</Th>
                          <Th>Click Rate</Th>
                          <Th>Conversion</Th>
                          <Th>Last Campaign</Th>
                          <Th>Status</Th>
                          <Th>Actions</Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {filteredChannels.map((channel) => (
                          <Tr key={channel.id}>
                            <Td>
                              <HStack>
                                <Icon as={channel.icon} color="blue.500" />
                                <Text fontWeight="medium">{channel.name}</Text>
                              </HStack>
                            </Td>
                            <Td>{channel.segment}</Td>
                            <Td>
                              <Badge colorScheme={getPriorityColor(channel.priority)}>
                                {channel.priority}
                              </Badge>
                            </Td>
                            <Td>{channel.frequency}</Td>
                            <Td>{channel.openRate}</Td>
                            <Td>{channel.clickRate}</Td>
                            <Td>{channel.conversionRate}</Td>
                            <Td>{channel.lastCampaign}</Td>
                            <Td>
                              <Badge colorScheme={getStatusColor(channel.status)}>
                                {channel.status}
                              </Badge>
                            </Td>
                            <Td>
                              <HStack spacing={2}>
                                <IconButton
                                  icon={<Icon as={FiEdit} />}
                                  aria-label="Edit"
                                  size="sm"
                                  variant="ghost"
                                />
                                <Menu>
                                  <MenuButton
                                    as={IconButton}
                                    icon={<Icon as={FiMoreVertical} />}
                                    variant="ghost"
                                    size="sm"
                                  />
                                  <MenuList>
                                    <MenuItem icon={<Icon as={FiBarChart2} />}>View Performance</MenuItem>
                                    <MenuItem icon={<Icon as={FiCalendar} />}>Schedule</MenuItem>
                                    <MenuItem icon={<Icon as={FiTrash2} />} color="red.500">
                                      Disable Channel
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
            </TabPanel>

            {/* Customer Journey Tab */}
            <TabPanel px={0}>
              <HStack justify="space-between" mb={6}>
                <Heading size="md">Customer Journey Touchpoints</Heading>
                <Button leftIcon={<Icon as={FiDownload} />} variant="ghost">
                  Export
                </Button>
              </HStack>

              <Card bg={cardBg} mb={6}>
                <CardBody>
                  <VStack spacing={8} align="stretch">
                    {JOURNEY_TOUCHPOINTS.map((touchpoint, index) => (
                      <Box key={touchpoint.stage}>
                        <HStack justify="space-between" mb={2}>
                          <Text fontWeight="bold">{touchpoint.stage}</Text>
                          <Text>{touchpoint.engagement}% Engagement</Text>
                        </HStack>
                        <Progress 
                          value={touchpoint.engagement} 
                          colorScheme={touchpoint.engagement > 70 ? 'green' : touchpoint.engagement > 50 ? 'blue' : 'orange'} 
                          size="sm" 
                          borderRadius="full" 
                          mb={3}
                        />
                        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
                          {touchpoint.channels.map((channel) => (
                            <Card 
                              key={channel} 
                              bgGradient="linear(to-r, blue.50, purple.50)" 
                              borderRadius="md"
                              borderWidth="1px"
                              borderColor="blue.100"
                            >
                              <CardBody>
                                <VStack spacing={2}>
                                  <Text fontWeight="medium">{channel}</Text>
                                  <HStack>
                                    <Icon 
                                      as={
                                        channel === 'Email Marketing' ? FiMail :
                                        channel === 'Mobile App Notifications' ? FiSmartphone :
                                        channel === 'SMS Alerts' ? FiMessageSquare :
                                        channel === 'Social Media' ? FiFacebook :
                                        FiGlobe
                                      } 
                                      color="blue.500" 
                                    />
                                    <Text fontSize="sm" color="gray.600">Primary Channel</Text>
                                  </HStack>
                                </VStack>
                              </CardBody>
                            </Card>
                          ))}
                          <Card 
                            borderRadius="md" 
                            borderStyle="dashed" 
                            borderWidth="1px" 
                            borderColor="gray.300"
                          >
                            <CardBody>
                              <Flex h="full" align="center" justify="center">
                                <Button variant="ghost" leftIcon={<Icon as={FiPlus} />} color="gray.500">
                                  Add Channel
                                </Button>
                              </Flex>
                            </CardBody>
                          </Card>
                        </SimpleGrid>
                        {index < JOURNEY_TOUCHPOINTS.length - 1 && (
                          <Flex justify="center" my={4}>
                            <Icon as={FiTarget} boxSize={8} color="blue.300" />
                          </Flex>
                        )}
                      </Box>
                    ))}
                  </VStack>
                </CardBody>
              </Card>
            </TabPanel>

            {/* Communication Calendar Tab */}
            <TabPanel px={0}>
              <HStack justify="space-between" mb={6}>
                <Heading size="md">Communication Calendar</Heading>
                <HStack>
                  <Button leftIcon={<Icon as={FiSave} />} colorScheme="blue">
                    Save Changes
                  </Button>
                </HStack>
              </HStack>

              <Card bg={cardBg}>
                <CardBody>
                  <Box h="400px" display="flex" alignItems="center" justifyContent="center">
                    <Text color="gray.500">Communication Calendar View</Text>
                  </Box>
                </CardBody>
              </Card>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </DashboardLayout>
  );
} 