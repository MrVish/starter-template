'use client'

import React, { useState, useEffect } from 'react'
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
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  FormErrorMessage,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Textarea,
  Spinner,
  useToast,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Tooltip,
  Skeleton,
  Stack,
  ScaleFade,
  SlideFade,
} from '@chakra-ui/react'
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
  FiLinkedin,
  FiYoutube,
  FiPhone,
  FiSpeaker,
  FiZap,
  FiRefreshCw,
  FiCheck,
  FiX,
  FiEye,
  FiClock,
  FiTrendingUp,
} from 'react-icons/fi'
import DashboardLayout from '../../../components/layout/DashboardLayout'

// Available channel icons
const CHANNEL_ICONS = [
  { value: 'FiMail', label: 'Email', icon: FiMail },
  { value: 'FiSmartphone', label: 'Mobile App', icon: FiSmartphone },
  { value: 'FiMessageSquare', label: 'SMS/Messaging', icon: FiMessageSquare },
  { value: 'FiFacebook', label: 'Facebook', icon: FiFacebook },
  { value: 'FiTwitter', label: 'Twitter', icon: FiTwitter },
  { value: 'FiInstagram', label: 'Instagram', icon: FiInstagram },
  { value: 'FiLinkedin', label: 'LinkedIn', icon: FiLinkedin },
  { value: 'FiYoutube', label: 'YouTube', icon: FiYoutube },
  { value: 'FiGlobe', label: 'Website/Web', icon: FiGlobe },
  { value: 'FiPhone', label: 'Phone/Call Center', icon: FiPhone },
  { value: 'FiSpeaker', label: 'In-Store/Physical', icon: FiSpeaker },
]

// Available customer segments
const CUSTOMER_SEGMENTS = [
  'All Segments',
  'Digital Natives',
  'High-Value Banking',
  'New Account Holders',
  'Investment Focus',
  'Small Business',
  'Premium Banking',
  'Student Banking',
  'Senior Banking',
  'Mobile-First Users',
]

// Available frequencies
const FREQUENCIES = [
  'Daily',
  'Weekly',
  'Bi-weekly',
  'Monthly',
  'Quarterly',
  'Continuous',
  'Event-based',
  'Custom',
]

// AI suggestions based on channel type
const AI_SUGGESTIONS = {
  'Email Marketing': {
    segment: 'All Segments',
    priority: 'High',
    frequency: 'Weekly',
    estimatedOpenRate: 28,
    estimatedClickRate: 5.2,
    estimatedConversionRate: 1.8,
    description: 'Comprehensive email campaigns targeting all customer segments with personalized content and promotional offers.'
  },
  'Instagram Marketing': {
    segment: 'Digital Natives',
    priority: 'Medium',
    frequency: 'Daily',
    estimatedOpenRate: 35,
    estimatedClickRate: 8.5,
    estimatedConversionRate: 2.1,
    description: 'Visual storytelling and engagement through Instagram posts, stories, and reels targeting younger demographics.'
  },
  'SMS Alerts': {
    segment: 'High-Value Banking',
    priority: 'High',
    frequency: 'Event-based',
    estimatedOpenRate: 94,
    estimatedClickRate: 8.1,
    estimatedConversionRate: 2.4,
    description: 'Critical account notifications and time-sensitive alerts for premium banking customers.'
  },
  'LinkedIn Marketing': {
    segment: 'Small Business',
    priority: 'Medium',
    frequency: 'Bi-weekly',
    estimatedOpenRate: 22,
    estimatedClickRate: 6.8,
    estimatedConversionRate: 3.2,
    description: 'Professional networking and B2B focused content for business account holders and entrepreneurs.'
  },
  'Mobile App Notifications': {
    segment: 'Digital Natives',
    priority: 'Medium',
    frequency: 'Bi-weekly',
    estimatedOpenRate: 42,
    estimatedClickRate: 12.5,
    estimatedConversionRate: 3.2,
    description: 'Push notifications for app engagement, feature updates, and personalized banking insights.'
  }
}

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
]

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
]

export default function ContactStrategy() {
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState('All')
  const [activeTab, setActiveTab] = useState(0)
  const [channels, setChannels] = useState(COMMUNICATION_CHANNELS)
  const { isOpen, onOpen, onClose } = useDisclosure()

  // Modal states
  const {
    isOpen: isEditOpen,
    onOpen: onEditOpen,
    onClose: onEditClose
  } = useDisclosure()
  const {
    isOpen: isPerformanceOpen,
    onOpen: onPerformanceOpen,
    onClose: onPerformanceClose
  } = useDisclosure()
  const {
    isOpen: isScheduleOpen,
    onOpen: onScheduleOpen,
    onClose: onScheduleClose
  } = useDisclosure()

  // Form state for new channel
  const [formData, setFormData] = useState({
    name: '',
    segment: 'All Segments',
    icon: 'FiMail',
    priority: 'Medium',
    frequency: 'Weekly',
    status: 'Active',
    description: '',
    estimatedOpenRate: 15,
    estimatedClickRate: 3,
    estimatedConversionRate: 1,
  })

  const [formErrors, setFormErrors] = useState<Record<string, string>>({})
  const [selectedChannel, setSelectedChannel] = useState<any>(null)
  const [isLoadingAI, setIsLoadingAI] = useState(false)
  const [aiSuggested, setAiSuggested] = useState(false)
  const [humanEdited, setHumanEdited] = useState(false)

  const cardBg = useColorModeValue('white', 'gray.800')
  const modalBg = useColorModeValue('white', 'gray.800')
  const gradientBg = useColorModeValue(
    'linear(to-br, blue.50, purple.50, pink.50)',
    'linear(to-br, blue.900, purple.900, pink.900)'
  )
  const toast = useToast()

  const filteredChannels = channels.filter(channel =>
    (filterStatus === 'All' || channel.status === filterStatus) &&
    channel.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'red'
      case 'Medium': return 'orange'
      case 'Low': return 'green'
      default: return 'gray'
    }
  }

  const getStatusColor = (status: string) => {
    return status === 'Active' ? 'green' : 'gray'
  }

  const getIconComponent = (iconName: string) => {
    const iconMapping: Record<string, any> = {
      FiMail,
      FiSmartphone,
      FiMessageSquare,
      FiFacebook,
      FiTwitter,
      FiInstagram,
      FiLinkedin,
      FiYoutube,
      FiGlobe,
      FiPhone,
      FiSpeaker,
    }
    return iconMapping[iconName] || FiMail
  }

  const getIconName = (IconComponent: any): string => {
    // Convert icon component to string name
    const iconName = IconComponent?.name || 'FiMail'
    const mapping: Record<string, string> = {
      'FiMail': 'FiMail',
      'FiSmartphone': 'FiSmartphone',
      'FiMessageSquare': 'FiMessageSquare',
      'FiFacebook': 'FiFacebook',
      'FiTwitter': 'FiTwitter',
      'FiInstagram': 'FiInstagram',
      'FiLinkedin': 'FiLinkedin',
      'FiYoutube': 'FiYoutube',
      'FiGlobe': 'FiGlobe',
      'FiPhone': 'FiPhone',
      'FiSpeaker': 'FiSpeaker',
    }
    return mapping[iconName] || 'FiMail'
  }

  const validateForm = () => {
    const errors: Record<string, string> = {}

    if (!formData.name.trim()) {
      errors.name = 'Channel name is required'
    }

    if (formData.name.trim() && channels.some(channel =>
      channel.name.toLowerCase() === formData.name.toLowerCase()
    )) {
      errors.name = 'Channel name already exists'
    }

    if (!formData.segment) {
      errors.segment = 'Target segment is required'
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: typeof value === 'number' && !isNaN(value) ? value :
        typeof value === 'string' ? value :
          prev[field as keyof typeof prev]
    }))

    // Mark as human edited if AI suggestions were applied
    if (aiSuggested && !isLoadingAI) {
      setHumanEdited(true)
    }

    // Clear error when user starts typing
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  // AI suggestion functionality
  const applyAISuggestions = async () => {
    if (!formData.name.trim()) return

    setIsLoadingAI(true)

    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 1500))

    // Find matching suggestion or use intelligent defaults
    const suggestion = AI_SUGGESTIONS[formData.name as keyof typeof AI_SUGGESTIONS] || {
      segment: 'All Segments',
      priority: 'Medium',
      frequency: 'Weekly',
      estimatedOpenRate: 20,
      estimatedClickRate: 4,
      estimatedConversionRate: 1.5,
      description: `AI-optimized strategy for ${formData.name} focusing on customer engagement and conversion.`
    }

    setFormData(prev => ({
      ...prev,
      ...suggestion
    }))

    setIsLoadingAI(false)
    setAiSuggested(true)
    setHumanEdited(false)

    toast({
      title: "AI Suggestions Applied",
      description: "Intelligent recommendations have been populated. Feel free to adjust as needed.",
      status: "success",
      duration: 3000,
      isClosable: true,
    })
  }

  // Action button handlers
  const handleEdit = (channel: any) => {
    setSelectedChannel(channel)
    setFormData({
      name: channel.name,
      segment: channel.segment,
      icon: getIconName(channel.icon),
      priority: channel.priority,
      frequency: channel.frequency,
      status: channel.status,
      description: `Edit configuration for ${channel.name}`,
      estimatedOpenRate: parseFloat(channel.openRate.replace('%', '')),
      estimatedClickRate: parseFloat(channel.clickRate.replace('%', '')),
      estimatedConversionRate: parseFloat(channel.conversionRate.replace('%', '')),
    })
    onEditOpen()
  }

  const handleViewPerformance = (channel: any) => {
    setSelectedChannel(channel)
    onPerformanceOpen()
  }

  const handleSchedule = (channel: any) => {
    setSelectedChannel(channel)
    onScheduleOpen()
  }

  const handleDisableChannel = (channel: any) => {
    const updatedChannels = channels.map(c =>
      c.id === channel.id
        ? { ...c, status: c.status === 'Active' ? 'Inactive' : 'Active' }
        : c
    )
    setChannels(updatedChannels)

    toast({
      title: `Channel ${channel.status === 'Active' ? 'Disabled' : 'Enabled'}`,
      description: `${channel.name} has been ${channel.status === 'Active' ? 'disabled' : 'enabled'}.`,
      status: channel.status === 'Active' ? 'warning' : 'success',
      duration: 2000,
      isClosable: true,
    })
  }

  const resetForm = () => {
    setFormData({
      name: '',
      segment: 'All Segments',
      icon: 'FiMail',
      priority: 'Medium',
      frequency: 'Weekly',
      status: 'Active',
      description: '',
      estimatedOpenRate: 15,
      estimatedClickRate: 3,
      estimatedConversionRate: 1,
    })
    setFormErrors({})
    setAiSuggested(false)
    setHumanEdited(false)
    setSelectedChannel(null)
  }

  // Update handleSubmit to work for both add and edit
  const handleSubmit = () => {
    if (!validateForm()) return

    if (selectedChannel) {
      // Edit existing channel
      const updatedChannels = channels.map(c =>
        c.id === selectedChannel.id
          ? {
            ...c,
            name: formData.name.trim(),
            segment: formData.segment,
            icon: getIconComponent(formData.icon),
            priority: formData.priority,
            frequency: formData.frequency,
            openRate: `${formData.estimatedOpenRate}%`,
            clickRate: `${formData.estimatedClickRate}%`,
            conversionRate: `${formData.estimatedConversionRate}%`,
            status: formData.status,
          }
          : c
      )
      setChannels(updatedChannels)
      onEditClose()

      toast({
        title: "Channel Updated",
        description: `${formData.name} has been successfully updated.`,
        status: "success",
        duration: 2000,
        isClosable: true,
      })
    } else {
      // Add new channel
      const newChannel = {
        id: Math.max(...channels.map(c => c.id)) + 1,
        name: formData.name.trim(),
        segment: formData.segment,
        icon: getIconComponent(formData.icon),
        priority: formData.priority,
        frequency: formData.frequency,
        openRate: `${formData.estimatedOpenRate}%`,
        clickRate: `${formData.estimatedClickRate}%`,
        conversionRate: `${formData.estimatedConversionRate}%`,
        lastCampaign: 'Not started',
        status: formData.status,
      }

      setChannels([...channels, newChannel])
      onClose()

      toast({
        title: "Channel Added",
        description: `${formData.name} has been successfully added to your communication strategy.`,
        status: "success",
        duration: 3000,
        isClosable: true,
      })
    }

    resetForm()
  }

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
                <Button leftIcon={<Icon as={FiPlus} />} colorScheme="blue" onClick={onOpen}>
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
                                <Tooltip label="Edit Channel">
                                  <IconButton
                                    icon={<Icon as={FiEdit} />}
                                    aria-label="Edit"
                                    size="sm"
                                    variant="ghost"
                                    colorScheme="blue"
                                    onClick={() => handleEdit(channel)}
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
                                    <MenuItem
                                      icon={<Icon as={FiBarChart2} />}
                                      onClick={() => handleViewPerformance(channel)}
                                    >
                                      View Performance
                                    </MenuItem>
                                    <MenuItem
                                      icon={<Icon as={FiCalendar} />}
                                      onClick={() => handleSchedule(channel)}
                                    >
                                      Schedule
                                    </MenuItem>
                                    <MenuItem
                                      icon={<Icon as={channel.status === 'Active' ? FiX : FiCheck} />}
                                      color={channel.status === 'Active' ? 'red.500' : 'green.500'}
                                      onClick={() => handleDisableChannel(channel)}
                                    >
                                      {channel.status === 'Active' ? 'Disable Channel' : 'Enable Channel'}
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

      {/* Enhanced Add Channel Modal */}
      <Modal isOpen={isOpen} onClose={() => { onClose(); resetForm() }} size="xl">
        <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(10px)" />
        <ModalContent
          maxW="700px"
          bg={modalBg}
          borderRadius="xl"
          boxShadow="2xl"
          border="1px solid"
          borderColor={useColorModeValue('gray.200', 'gray.600')}
          mx={4}
        >
          <Box bgGradient={gradientBg} borderTopRadius="xl" p={6}>
            <HStack justify="space-between" align="center">
              <VStack align="start" spacing={1}>
                <HStack>
                  <Icon as={FiZap} color="blue.500" boxSize={6} />
                  <Heading size="lg" color="gray.800">
                    Add New Communication Channel
                  </Heading>
                </HStack>
                <Text color="gray.600" fontSize="sm">
                  Create a new channel with AI-powered suggestions
                </Text>
              </VStack>
              <ModalCloseButton position="relative" top="auto" right="auto" />
            </HStack>
          </Box>

          <ModalBody p={0}>
            <VStack spacing={0} align="stretch">
              {/* AI Suggestion Alert */}
              {aiSuggested && (
                <Box p={6} pb={0}>
                  <SlideFade in={aiSuggested}>
                    <Alert
                      status={humanEdited ? "warning" : "success"}
                      borderRadius="lg"
                      variant="left-accent"
                    >
                      <AlertIcon />
                      <Box>
                        <AlertTitle fontSize="sm">
                          {humanEdited ? "AI + Human Optimized!" : "AI Suggestions Applied!"}
                        </AlertTitle>
                        <AlertDescription fontSize="xs">
                          {humanEdited
                            ? "Great! You've personalized the AI recommendations."
                            : "Smart defaults have been applied. Feel free to customize further."
                          }
                        </AlertDescription>
                      </Box>
                    </Alert>
                  </SlideFade>
                </Box>
              )}

              {/* Channel Name with AI Trigger */}
              <Box p={6} pb={4}>
                <FormControl isRequired isInvalid={!!formErrors.name}>
                  <FormLabel fontSize="sm" fontWeight="semibold" mb={3}>
                    Channel Name
                  </FormLabel>
                  <HStack spacing={3}>
                    <Input
                      placeholder="e.g. Instagram Marketing, SMS Alerts"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      borderRadius="md"
                      bg={useColorModeValue('gray.50', 'gray.700')}
                      border="1px solid"
                      borderColor={useColorModeValue('gray.200', 'gray.600')}
                      _focus={{
                        borderColor: 'blue.500',
                        boxShadow: '0 0 0 1px rgba(66, 153, 225, 0.6)',
                      }}
                      flex={1}
                    />
                    <Tooltip
                      label="Get AI suggestions based on channel name"
                      placement="top"
                      hasArrow
                    >
                      <Button
                        leftIcon={<Icon as={FiZap} />}
                        colorScheme="purple"
                        variant="outline"
                        size="md"
                        onClick={applyAISuggestions}
                        isLoading={isLoadingAI}
                        loadingText="AI Working..."
                        isDisabled={!formData.name.trim() || isLoadingAI}
                        minW="120px"
                        borderRadius="md"
                      >
                        AI Suggest
                      </Button>
                    </Tooltip>
                  </HStack>
                  {formErrors.name && (
                    <FormErrorMessage mt={2} fontSize="xs">
                      {formErrors.name}
                    </FormErrorMessage>
                  )}
                </FormControl>
              </Box>

              {/* Basic Configuration */}
              <Box p={6} py={4}>
                <Text fontSize="md" fontWeight="semibold" mb={4} color="gray.700">
                  Basic Configuration
                </Text>
                <VStack spacing={4} align="stretch">
                  <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                    <FormControl isRequired isInvalid={!!formErrors.segment}>
                      <FormLabel fontSize="sm" fontWeight="medium" mb={2}>
                        Target Segment
                      </FormLabel>
                      <Select
                        value={formData.segment}
                        onChange={(e) => handleInputChange('segment', e.target.value)}
                        bg={useColorModeValue('gray.50', 'gray.700')}
                        borderRadius="md"
                        border="1px solid"
                        borderColor={useColorModeValue('gray.200', 'gray.600')}
                        _focus={{
                          borderColor: 'blue.500',
                          boxShadow: '0 0 0 1px rgba(66, 153, 225, 0.6)',
                        }}
                      >
                        {CUSTOMER_SEGMENTS.map((segment) => (
                          <option key={segment} value={segment}>
                            {segment}
                          </option>
                        ))}
                      </Select>
                      {formErrors.segment && (
                        <FormErrorMessage mt={1} fontSize="xs">
                          {formErrors.segment}
                        </FormErrorMessage>
                      )}
                    </FormControl>

                    <FormControl>
                      <FormLabel fontSize="sm" fontWeight="medium" mb={2}>
                        Channel Icon
                      </FormLabel>
                      <Select
                        value={formData.icon}
                        onChange={(e) => handleInputChange('icon', e.target.value)}
                        bg={useColorModeValue('gray.50', 'gray.700')}
                        borderRadius="md"
                        border="1px solid"
                        borderColor={useColorModeValue('gray.200', 'gray.600')}
                        _focus={{
                          borderColor: 'blue.500',
                          boxShadow: '0 0 0 1px rgba(66, 153, 225, 0.6)',
                        }}
                      >
                        {CHANNEL_ICONS.map((icon) => (
                          <option key={icon.value} value={icon.value}>
                            {icon.label}
                          </option>
                        ))}
                      </Select>
                    </FormControl>
                  </SimpleGrid>

                  <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
                    <FormControl>
                      <FormLabel fontSize="sm" fontWeight="medium" mb={2}>
                        Priority Level
                      </FormLabel>
                      <Select
                        value={formData.priority}
                        onChange={(e) => handleInputChange('priority', e.target.value)}
                        bg={useColorModeValue('gray.50', 'gray.700')}
                        borderRadius="md"
                        border="1px solid"
                        borderColor={useColorModeValue('gray.200', 'gray.600')}
                        _focus={{
                          borderColor: 'blue.500',
                          boxShadow: '0 0 0 1px rgba(66, 153, 225, 0.6)',
                        }}
                      >
                        <option value="High">High Priority</option>
                        <option value="Medium">Medium Priority</option>
                        <option value="Low">Low Priority</option>
                      </Select>
                    </FormControl>

                    <FormControl>
                      <FormLabel fontSize="sm" fontWeight="medium" mb={2}>
                        Frequency
                      </FormLabel>
                      <Select
                        value={formData.frequency}
                        onChange={(e) => handleInputChange('frequency', e.target.value)}
                        bg={useColorModeValue('gray.50', 'gray.700')}
                        borderRadius="md"
                        border="1px solid"
                        borderColor={useColorModeValue('gray.200', 'gray.600')}
                        _focus={{
                          borderColor: 'blue.500',
                          boxShadow: '0 0 0 1px rgba(66, 153, 225, 0.6)',
                        }}
                      >
                        {FREQUENCIES.map((freq) => (
                          <option key={freq} value={freq}>
                            {freq}
                          </option>
                        ))}
                      </Select>
                    </FormControl>

                    <FormControl>
                      <FormLabel fontSize="sm" fontWeight="medium" mb={2}>
                        Initial Status
                      </FormLabel>
                      <Select
                        value={formData.status}
                        onChange={(e) => handleInputChange('status', e.target.value)}
                        bg={useColorModeValue('gray.50', 'gray.700')}
                        borderRadius="md"
                        border="1px solid"
                        borderColor={useColorModeValue('gray.200', 'gray.600')}
                        _focus={{
                          borderColor: 'blue.500',
                          boxShadow: '0 0 0 1px rgba(66, 153, 225, 0.6)',
                        }}
                      >
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                      </Select>
                    </FormControl>
                  </SimpleGrid>
                </VStack>
              </Box>

              {/* Divider */}
              <Box px={6}>
                <Divider borderColor={useColorModeValue('gray.200', 'gray.600')} />
              </Box>

              {/* Performance Estimates */}
              <Box p={6} py={4}>
                <HStack justify="space-between" align="center" mb={4}>
                  <Text fontSize="md" fontWeight="semibold" color="gray.700">
                    Performance Estimates
                  </Text>
                  {aiSuggested && (
                    <Badge
                      colorScheme={humanEdited ? "purple" : "green"}
                      variant="subtle"
                      fontSize="xs"
                      px={2}
                      py={1}
                      borderRadius="md"
                    >
                      {humanEdited ? "AI + Human" : "AI Optimized"}
                    </Badge>
                  )}
                </HStack>

                <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
                  <FormControl>
                    <FormLabel fontSize="sm" fontWeight="medium" mb={2}>
                      Expected Open Rate (%)
                    </FormLabel>
                    <NumberInput
                      value={formData.estimatedOpenRate}
                      onChange={(valueString, valueNumber) =>
                        handleInputChange('estimatedOpenRate', valueNumber)
                      }
                      min={0}
                      max={100}
                      step={0.1}
                    >
                      <NumberInputField
                        bg={useColorModeValue('gray.50', 'gray.700')}
                        borderRadius="md"
                        border="1px solid"
                        borderColor={useColorModeValue('gray.200', 'gray.600')}
                        _focus={{
                          borderColor: 'blue.500',
                          boxShadow: '0 0 0 1px rgba(66, 153, 225, 0.6)',
                        }}
                      />
                      <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                      </NumberInputStepper>
                    </NumberInput>
                  </FormControl>

                  <FormControl>
                    <FormLabel fontSize="sm" fontWeight="medium" mb={2}>
                      Expected Click Rate (%)
                    </FormLabel>
                    <NumberInput
                      value={formData.estimatedClickRate}
                      onChange={(valueString, valueNumber) =>
                        handleInputChange('estimatedClickRate', valueNumber)
                      }
                      min={0}
                      max={100}
                      step={0.1}
                    >
                      <NumberInputField
                        bg={useColorModeValue('gray.50', 'gray.700')}
                        borderRadius="md"
                        border="1px solid"
                        borderColor={useColorModeValue('gray.200', 'gray.600')}
                        _focus={{
                          borderColor: 'blue.500',
                          boxShadow: '0 0 0 1px rgba(66, 153, 225, 0.6)',
                        }}
                      />
                      <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                      </NumberInputStepper>
                    </NumberInput>
                  </FormControl>

                  <FormControl>
                    <FormLabel fontSize="sm" fontWeight="medium" mb={2}>
                      Expected Conversion Rate (%)
                    </FormLabel>
                    <NumberInput
                      value={formData.estimatedConversionRate}
                      onChange={(valueString, valueNumber) =>
                        handleInputChange('estimatedConversionRate', valueNumber)
                      }
                      min={0}
                      max={100}
                      step={0.1}
                    >
                      <NumberInputField
                        bg={useColorModeValue('gray.50', 'gray.700')}
                        borderRadius="md"
                        border="1px solid"
                        borderColor={useColorModeValue('gray.200', 'gray.600')}
                        _focus={{
                          borderColor: 'blue.500',
                          boxShadow: '0 0 0 1px rgba(66, 153, 225, 0.6)',
                        }}
                      />
                      <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                      </NumberInputStepper>
                    </NumberInput>
                  </FormControl>
                </SimpleGrid>
              </Box>

              {/* Description */}
              <Box p={6} pt={4}>
                <FormControl>
                  <FormLabel fontSize="sm" fontWeight="medium" mb={2}>
                    Description (Optional)
                  </FormLabel>
                  <Textarea
                    placeholder="Describe the purpose and strategy for this communication channel..."
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    rows={3}
                    bg={useColorModeValue('gray.50', 'gray.700')}
                    borderRadius="md"
                    border="1px solid"
                    borderColor={useColorModeValue('gray.200', 'gray.600')}
                    _focus={{
                      borderColor: 'blue.500',
                      boxShadow: '0 0 0 1px rgba(66, 153, 225, 0.6)',
                    }}
                    resize="vertical"
                  />
                </FormControl>
              </Box>
            </VStack>
          </ModalBody>

          <ModalFooter
            bg={useColorModeValue('gray.50', 'gray.700')}
            borderBottomRadius="xl"
            borderTop="1px solid"
            borderTopColor={useColorModeValue('gray.200', 'gray.600')}
            px={6}
            py={4}
          >
            <HStack spacing={3} w="full" justify="flex-end">
              <Button
                variant="ghost"
                onClick={() => { onClose(); resetForm() }}
                size="md"
                borderRadius="md"
              >
                Cancel
              </Button>
              <Button
                colorScheme="blue"
                onClick={handleSubmit}
                leftIcon={<Icon as={FiPlus} />}
                bgGradient="linear(to-r, blue.400, purple.500)"
                _hover={{
                  bgGradient: "linear(to-r, blue.500, purple.600)",
                }}
                size="md"
                borderRadius="md"
                minW="140px"
              >
                Add Channel
              </Button>
            </HStack>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Edit Channel Modal */}
      <Modal isOpen={isEditOpen} onClose={() => { onEditClose(); resetForm() }} size="xl">
        <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(10px)" />
        <ModalContent
          maxW="700px"
          bg={modalBg}
          borderRadius="xl"
          boxShadow="2xl"
          border="1px solid"
          borderColor={useColorModeValue('gray.200', 'gray.600')}
          mx={4}
        >
          <Box bgGradient="linear(to-r, orange.50, red.50)" borderTopRadius="xl" p={6}>
            <HStack justify="space-between" align="center">
              <VStack align="start" spacing={1}>
                <HStack>
                  <Icon as={FiEdit} color="orange.500" boxSize={6} />
                  <Heading size="lg" color="gray.800">
                    Edit Channel: {selectedChannel?.name}
                  </Heading>
                </HStack>
                <Text color="gray.600" fontSize="sm">
                  Modify channel configuration and settings
                </Text>
              </VStack>
              <ModalCloseButton position="relative" top="auto" right="auto" />
            </HStack>
          </Box>

          <ModalBody p={0}>
            <VStack spacing={0} align="stretch">
              {/* Channel Name */}
              <Box p={6} pb={4}>
                <FormControl isRequired isInvalid={!!formErrors.name}>
                  <FormLabel fontSize="sm" fontWeight="semibold" mb={3}>
                    Channel Name
                  </FormLabel>
                  <Input
                    placeholder="Channel Name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    borderRadius="md"
                    bg={useColorModeValue('gray.50', 'gray.700')}
                    border="1px solid"
                    borderColor={useColorModeValue('gray.200', 'gray.600')}
                    _focus={{
                      borderColor: 'orange.500',
                      boxShadow: '0 0 0 1px rgba(251, 146, 60, 0.6)',
                    }}
                  />
                  {formErrors.name && (
                    <FormErrorMessage mt={2} fontSize="xs">
                      {formErrors.name}
                    </FormErrorMessage>
                  )}
                </FormControl>
              </Box>

              {/* Basic Configuration */}
              <Box p={6} py={4}>
                <Text fontSize="md" fontWeight="semibold" mb={4} color="gray.700">
                  Configuration
                </Text>
                <VStack spacing={4} align="stretch">
                  <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                    <FormControl isRequired isInvalid={!!formErrors.segment}>
                      <FormLabel fontSize="sm" fontWeight="medium" mb={2}>
                        Target Segment
                      </FormLabel>
                      <Select
                        value={formData.segment}
                        onChange={(e) => handleInputChange('segment', e.target.value)}
                        bg={useColorModeValue('gray.50', 'gray.700')}
                        borderRadius="md"
                        border="1px solid"
                        borderColor={useColorModeValue('gray.200', 'gray.600')}
                        _focus={{
                          borderColor: 'orange.500',
                          boxShadow: '0 0 0 1px rgba(251, 146, 60, 0.6)',
                        }}
                      >
                        {CUSTOMER_SEGMENTS.map((segment) => (
                          <option key={segment} value={segment}>
                            {segment}
                          </option>
                        ))}
                      </Select>
                      {formErrors.segment && (
                        <FormErrorMessage mt={1} fontSize="xs">
                          {formErrors.segment}
                        </FormErrorMessage>
                      )}
                    </FormControl>

                    <FormControl>
                      <FormLabel fontSize="sm" fontWeight="medium" mb={2}>
                        Channel Icon
                      </FormLabel>
                      <Select
                        value={formData.icon}
                        onChange={(e) => handleInputChange('icon', e.target.value)}
                        bg={useColorModeValue('gray.50', 'gray.700')}
                        borderRadius="md"
                        border="1px solid"
                        borderColor={useColorModeValue('gray.200', 'gray.600')}
                        _focus={{
                          borderColor: 'orange.500',
                          boxShadow: '0 0 0 1px rgba(251, 146, 60, 0.6)',
                        }}
                      >
                        {CHANNEL_ICONS.map((icon) => (
                          <option key={icon.value} value={icon.value}>
                            {icon.label}
                          </option>
                        ))}
                      </Select>
                    </FormControl>
                  </SimpleGrid>

                  <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
                    <FormControl>
                      <FormLabel fontSize="sm" fontWeight="medium" mb={2}>
                        Priority Level
                      </FormLabel>
                      <Select
                        value={formData.priority}
                        onChange={(e) => handleInputChange('priority', e.target.value)}
                        bg={useColorModeValue('gray.50', 'gray.700')}
                        borderRadius="md"
                        border="1px solid"
                        borderColor={useColorModeValue('gray.200', 'gray.600')}
                        _focus={{
                          borderColor: 'orange.500',
                          boxShadow: '0 0 0 1px rgba(251, 146, 60, 0.6)',
                        }}
                      >
                        <option value="High">High Priority</option>
                        <option value="Medium">Medium Priority</option>
                        <option value="Low">Low Priority</option>
                      </Select>
                    </FormControl>

                    <FormControl>
                      <FormLabel fontSize="sm" fontWeight="medium" mb={2}>
                        Frequency
                      </FormLabel>
                      <Select
                        value={formData.frequency}
                        onChange={(e) => handleInputChange('frequency', e.target.value)}
                        bg={useColorModeValue('gray.50', 'gray.700')}
                        borderRadius="md"
                        border="1px solid"
                        borderColor={useColorModeValue('gray.200', 'gray.600')}
                        _focus={{
                          borderColor: 'orange.500',
                          boxShadow: '0 0 0 1px rgba(251, 146, 60, 0.6)',
                        }}
                      >
                        {FREQUENCIES.map((freq) => (
                          <option key={freq} value={freq}>
                            {freq}
                          </option>
                        ))}
                      </Select>
                    </FormControl>

                    <FormControl>
                      <FormLabel fontSize="sm" fontWeight="medium" mb={2}>
                        Status
                      </FormLabel>
                      <Select
                        value={formData.status}
                        onChange={(e) => handleInputChange('status', e.target.value)}
                        bg={useColorModeValue('gray.50', 'gray.700')}
                        borderRadius="md"
                        border="1px solid"
                        borderColor={useColorModeValue('gray.200', 'gray.600')}
                        _focus={{
                          borderColor: 'orange.500',
                          boxShadow: '0 0 0 1px rgba(251, 146, 60, 0.6)',
                        }}
                      >
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                      </Select>
                    </FormControl>
                  </SimpleGrid>
                </VStack>
              </Box>

              {/* Divider */}
              <Box px={6}>
                <Divider borderColor={useColorModeValue('gray.200', 'gray.600')} />
              </Box>

              {/* Performance Estimates */}
              <Box p={6} py={4}>
                <Text fontSize="md" fontWeight="semibold" mb={4} color="gray.700">
                  Performance Estimates
                </Text>
                <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
                  <FormControl>
                    <FormLabel fontSize="sm" fontWeight="medium" mb={2}>
                      Expected Open Rate (%)
                    </FormLabel>
                    <NumberInput
                      value={formData.estimatedOpenRate}
                      onChange={(valueString, valueNumber) =>
                        handleInputChange('estimatedOpenRate', valueNumber)
                      }
                      min={0}
                      max={100}
                      step={0.1}
                    >
                      <NumberInputField
                        bg={useColorModeValue('gray.50', 'gray.700')}
                        borderRadius="md"
                        border="1px solid"
                        borderColor={useColorModeValue('gray.200', 'gray.600')}
                        _focus={{
                          borderColor: 'orange.500',
                          boxShadow: '0 0 0 1px rgba(251, 146, 60, 0.6)',
                        }}
                      />
                      <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                      </NumberInputStepper>
                    </NumberInput>
                  </FormControl>

                  <FormControl>
                    <FormLabel fontSize="sm" fontWeight="medium" mb={2}>
                      Expected Click Rate (%)
                    </FormLabel>
                    <NumberInput
                      value={formData.estimatedClickRate}
                      onChange={(valueString, valueNumber) =>
                        handleInputChange('estimatedClickRate', valueNumber)
                      }
                      min={0}
                      max={100}
                      step={0.1}
                    >
                      <NumberInputField
                        bg={useColorModeValue('gray.50', 'gray.700')}
                        borderRadius="md"
                        border="1px solid"
                        borderColor={useColorModeValue('gray.200', 'gray.600')}
                        _focus={{
                          borderColor: 'orange.500',
                          boxShadow: '0 0 0 1px rgba(251, 146, 60, 0.6)',
                        }}
                      />
                      <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                      </NumberInputStepper>
                    </NumberInput>
                  </FormControl>

                  <FormControl>
                    <FormLabel fontSize="sm" fontWeight="medium" mb={2}>
                      Expected Conversion Rate (%)
                    </FormLabel>
                    <NumberInput
                      value={formData.estimatedConversionRate}
                      onChange={(valueString, valueNumber) =>
                        handleInputChange('estimatedConversionRate', valueNumber)
                      }
                      min={0}
                      max={100}
                      step={0.1}
                    >
                      <NumberInputField
                        bg={useColorModeValue('gray.50', 'gray.700')}
                        borderRadius="md"
                        border="1px solid"
                        borderColor={useColorModeValue('gray.200', 'gray.600')}
                        _focus={{
                          borderColor: 'orange.500',
                          boxShadow: '0 0 0 1px rgba(251, 146, 60, 0.6)',
                        }}
                      />
                      <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                      </NumberInputStepper>
                    </NumberInput>
                  </FormControl>
                </SimpleGrid>
              </Box>

              {/* Description */}
              <Box p={6} pt={4}>
                <FormControl>
                  <FormLabel fontSize="sm" fontWeight="medium" mb={2}>
                    Description (Optional)
                  </FormLabel>
                  <Textarea
                    placeholder="Describe the purpose and strategy for this communication channel..."
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    rows={3}
                    bg={useColorModeValue('gray.50', 'gray.700')}
                    borderRadius="md"
                    border="1px solid"
                    borderColor={useColorModeValue('gray.200', 'gray.600')}
                    _focus={{
                      borderColor: 'orange.500',
                      boxShadow: '0 0 0 1px rgba(251, 146, 60, 0.6)',
                    }}
                    resize="vertical"
                  />
                </FormControl>
              </Box>
            </VStack>
          </ModalBody>

          <ModalFooter
            bg={useColorModeValue('gray.50', 'gray.700')}
            borderBottomRadius="xl"
            borderTop="1px solid"
            borderTopColor={useColorModeValue('gray.200', 'gray.600')}
            px={6}
            py={4}
          >
            <HStack spacing={3} w="full" justify="flex-end">
              <Button
                variant="ghost"
                onClick={() => { onEditClose(); resetForm() }}
                size="md"
                borderRadius="md"
              >
                Cancel
              </Button>
              <Button
                colorScheme="orange"
                onClick={handleSubmit}
                leftIcon={<Icon as={FiSave} />}
                size="md"
                borderRadius="md"
                minW="140px"
              >
                Update Channel
              </Button>
            </HStack>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Performance Modal */}
      <Modal isOpen={isPerformanceOpen} onClose={onPerformanceClose} size="xl">
        <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(10px)" />
        <ModalContent
          maxW="800px"
          bg={modalBg}
          borderRadius="xl"
          boxShadow="2xl"
        >
          <Box bgGradient="linear(to-r, green.50, blue.50)" borderTopRadius="xl" p={6}>
            <HStack justify="space-between" align="center">
              <VStack align="start" spacing={1}>
                <HStack>
                  <Icon as={FiTrendingUp} color="green.500" boxSize={6} />
                  <Heading size="lg" color="gray.800">
                    Performance Analytics: {selectedChannel?.name}
                  </Heading>
                </HStack>
                <Text color="gray.600" fontSize="sm">
                  Detailed performance metrics and insights
                </Text>
              </VStack>
              <ModalCloseButton position="relative" top="auto" right="auto" />
            </HStack>
          </Box>

          <ModalBody p={6}>
            {selectedChannel && (
              <VStack spacing={6} align="stretch">
                {/* Performance Metrics */}
                <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
                  <Card borderRadius="lg" bg="gradient-to-r from-blue-50 to-indigo-50">
                    <CardBody textAlign="center">
                      <Icon as={FiEye} boxSize={8} color="blue.500" mb={2} />
                      <Text fontSize="2xl" fontWeight="bold" color="blue.600">
                        {selectedChannel.openRate}
                      </Text>
                      <Text color="gray.600" fontSize="sm">Open Rate</Text>
                    </CardBody>
                  </Card>

                  <Card borderRadius="lg" bg="gradient-to-r from-green-50 to-emerald-50">
                    <CardBody textAlign="center">
                      <Icon as={FiTarget} boxSize={8} color="green.500" mb={2} />
                      <Text fontSize="2xl" fontWeight="bold" color="green.600">
                        {selectedChannel.clickRate}
                      </Text>
                      <Text color="gray.600" fontSize="sm">Click Rate</Text>
                    </CardBody>
                  </Card>

                  <Card borderRadius="lg" bg="gradient-to-r from-purple-50 to-pink-50">
                    <CardBody textAlign="center">
                      <Icon as={FiTrendingUp} boxSize={8} color="purple.500" mb={2} />
                      <Text fontSize="2xl" fontWeight="bold" color="purple.600">
                        {selectedChannel.conversionRate}
                      </Text>
                      <Text color="gray.600" fontSize="sm">Conversion Rate</Text>
                    </CardBody>
                  </Card>
                </SimpleGrid>

                {/* Additional Details */}
                <Card borderRadius="lg">
                  <CardBody>
                    <Heading size="md" mb={4}>Channel Details</Heading>
                    <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                      <VStack align="start" spacing={2}>
                        <Text><strong>Target Segment:</strong> {selectedChannel.segment}</Text>
                        <Text><strong>Priority:</strong>
                          <Badge ml={2} colorScheme={getPriorityColor(selectedChannel.priority)}>
                            {selectedChannel.priority}
                          </Badge>
                        </Text>
                        <Text><strong>Frequency:</strong> {selectedChannel.frequency}</Text>
                      </VStack>
                      <VStack align="start" spacing={2}>
                        <Text><strong>Status:</strong>
                          <Badge ml={2} colorScheme={getStatusColor(selectedChannel.status)}>
                            {selectedChannel.status}
                          </Badge>
                        </Text>
                        <Text><strong>Last Campaign:</strong> {selectedChannel.lastCampaign}</Text>
                      </VStack>
                    </SimpleGrid>
                  </CardBody>
                </Card>

                {/* Mock Chart Placeholder */}
                <Card borderRadius="lg">
                  <CardBody>
                    <Heading size="md" mb={4}>Performance Trends</Heading>
                    <Box
                      h="200px"
                      bg="gray.50"
                      borderRadius="md"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      border="2px dashed"
                      borderColor="gray.200"
                    >
                      <VStack>
                        <Icon as={FiBarChart2} boxSize={12} color="gray.400" />
                        <Text color="gray.500">Performance Chart View</Text>
                        <Text fontSize="sm" color="gray.400">
                          Historical data visualization would appear here
                        </Text>
                      </VStack>
                    </Box>
                  </CardBody>
                </Card>
              </VStack>
            )}
          </ModalBody>

          <ModalFooter>
            <Button onClick={onPerformanceClose}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Schedule Modal */}
      <Modal isOpen={isScheduleOpen} onClose={onScheduleClose} size="lg">
        <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(10px)" />
        <ModalContent
          maxW="600px"
          bg={modalBg}
          borderRadius="xl"
          boxShadow="2xl"
        >
          <Box bgGradient="linear(to-r, yellow.50, orange.50)" borderTopRadius="xl" p={6}>
            <HStack justify="space-between" align="center">
              <VStack align="start" spacing={1}>
                <HStack>
                  <Icon as={FiClock} color="orange.500" boxSize={6} />
                  <Heading size="lg" color="gray.800">
                    Schedule Campaign: {selectedChannel?.name}
                  </Heading>
                </HStack>
                <Text color="gray.600" fontSize="sm">
                  Plan and schedule your communication campaigns
                </Text>
              </VStack>
              <ModalCloseButton position="relative" top="auto" right="auto" />
            </HStack>
          </Box>

          <ModalBody p={6}>
            {selectedChannel && (
              <VStack spacing={6} align="stretch">
                {/* Current Schedule Info */}
                <Card borderRadius="lg" bg="blue.50">
                  <CardBody>
                    <HStack spacing={4}>
                      <Icon as={FiCalendar} color="blue.500" boxSize={8} />
                      <VStack align="start" spacing={1}>
                        <Text fontWeight="semibold">Current Schedule</Text>
                        <Text fontSize="sm" color="gray.600">
                          Frequency: {selectedChannel.frequency}
                        </Text>
                        <Text fontSize="sm" color="gray.600">
                          Last Campaign: {selectedChannel.lastCampaign}
                        </Text>
                      </VStack>
                    </HStack>
                  </CardBody>
                </Card>

                {/* Schedule Configuration */}
                <Card borderRadius="lg">
                  <CardBody>
                    <Heading size="md" mb={4}>Campaign Scheduling</Heading>
                    <VStack spacing={4} align="stretch">
                      <FormControl>
                        <FormLabel>Campaign Type</FormLabel>
                        <Select defaultValue="regular">
                          <option value="regular">Regular Campaign</option>
                          <option value="promotional">Promotional Campaign</option>
                          <option value="announcement">Announcement</option>
                          <option value="reminder">Reminder</option>
                        </Select>
                      </FormControl>

                      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                        <FormControl>
                          <FormLabel>Start Date</FormLabel>
                          <Input type="date" />
                        </FormControl>
                        <FormControl>
                          <FormLabel>Start Time</FormLabel>
                          <Input type="time" defaultValue="09:00" />
                        </FormControl>
                      </SimpleGrid>

                      <FormControl>
                        <FormLabel>Campaign Message</FormLabel>
                        <Textarea
                          placeholder="Enter your campaign message here..."
                          rows={4}
                        />
                      </FormControl>

                      <FormControl>
                        <FormLabel>Recurring Schedule</FormLabel>
                        <Select defaultValue={selectedChannel.frequency.toLowerCase()}>
                          <option value="once">One-time</option>
                          <option value="daily">Daily</option>
                          <option value="weekly">Weekly</option>
                          <option value="bi-weekly">Bi-weekly</option>
                          <option value="monthly">Monthly</option>
                        </Select>
                      </FormControl>
                    </VStack>
                  </CardBody>
                </Card>

                {/* Preview */}
                <Card borderRadius="lg" bg="green.50">
                  <CardBody>
                    <HStack spacing={4}>
                      <Icon as={FiCheck} color="green.500" boxSize={8} />
                      <VStack align="start" spacing={1}>
                        <Text fontWeight="semibold" color="green.700">
                          Campaign Preview
                        </Text>
                        <Text fontSize="sm" color="gray.600">
                          Your campaign will be sent to the {selectedChannel.segment} segment
                        </Text>
                        <Text fontSize="sm" color="gray.600">
                          Expected reach: ~2,500 customers
                        </Text>
                      </VStack>
                    </HStack>
                  </CardBody>
                </Card>
              </VStack>
            )}
          </ModalBody>

          <ModalFooter>
            <HStack spacing={3}>
              <Button variant="ghost" onClick={onScheduleClose}>
                Cancel
              </Button>
              <Button
                colorScheme="orange"
                leftIcon={<Icon as={FiCalendar} />}
                onClick={() => {
                  toast({
                    title: "Campaign Scheduled",
                    description: `Campaign for ${selectedChannel?.name} has been scheduled successfully.`,
                    status: "success",
                    duration: 3000,
                    isClosable: true,
                  })
                  onScheduleClose()
                }}
              >
                Schedule Campaign
              </Button>
            </HStack>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </DashboardLayout>
  )
} 