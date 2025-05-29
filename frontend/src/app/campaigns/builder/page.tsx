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
  FormControl,
  FormLabel,
  FormHelperText,
  FormErrorMessage,
  Textarea,
  Radio,
  RadioGroup,
  Stack,
  Checkbox,
  CheckboxGroup,
  Divider,
  Stepper,
  Step,
  StepIndicator,
  StepStatus,
  StepIcon,
  StepNumber,
  StepTitle,
  StepDescription,
  StepSeparator,
  useSteps,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  SlideFade,
  Tooltip,
  Switch,
  Spinner,
  Progress,
  Tag,
  TagLabel,
  TagCloseButton,
} from '@chakra-ui/react'
import {
  FiPlus,
  FiSearch,
  FiFilter,
  FiUsers,
  FiMail,
  FiMessageSquare,
  FiSmartphone,
  FiGlobe,
  FiTarget,
  FiEdit,
  FiCalendar,
  FiDollarSign,
  FiClock,
  FiChevronRight,
  FiSave,
  FiArrowRight,
  FiShare2,
  FiCheck,
  FiPieChart,
  FiBarChart2,
  FiFileText,
  FiImage,
  FiZap,
  FiTrendingUp,
  FiBriefcase,
  FiAward,
  FiRefreshCw,
  FiEye,
} from 'react-icons/fi'
import { CreateSegmentModal, AISegmentModal } from '../../../components/segments/SegmentModals'

// Enhanced segment data with AI insights
const SEGMENTS = [
  {
    id: 1,
    name: 'High-Value Banking',
    size: 15000,
    engagement: 'High',
    avgValue: '$4,850',
    aiRecommended: true,
    description: 'Premium clients with high account balances and investment portfolios'
  },
  {
    id: 2,
    name: 'Digital Natives',
    size: 45000,
    engagement: 'Very High',
    avgValue: '$1,200',
    aiRecommended: true,
    description: 'Tech-savvy customers who prefer digital banking channels'
  },
  {
    id: 3,
    name: 'Investment Focus',
    size: 8000,
    engagement: 'High',
    avgValue: '$12,500',
    aiRecommended: false,
    description: 'Clients actively engaged in investment products and wealth management'
  },
  {
    id: 4,
    name: 'New Account Holders',
    size: 12000,
    engagement: 'Medium',
    avgValue: '$750',
    aiRecommended: true,
    description: 'Recently onboarded customers with growth potential'
  },
]

// Enhanced templates with AI suggestions
const TEMPLATES = [
  {
    id: 1,
    name: 'AI-Optimized Welcome Series',
    type: 'Email',
    description: 'A smart welcome series for new customers with personalized content',
    aiGenerated: true,
    estimatedEngagement: '85%',
    category: 'Onboarding'
  },
  {
    id: 2,
    name: 'Product Promotion',
    type: 'Multi-channel',
    description: 'Promote banking products across channels',
    aiGenerated: false,
    estimatedEngagement: '65%',
    category: 'Promotion'
  },
  {
    id: 3,
    name: 'Intelligent Newsletter',
    type: 'Email',
    description: 'AI-curated monthly newsletter with personalized content',
    aiGenerated: true,
    estimatedEngagement: '72%',
    category: 'Engagement'
  },
  {
    id: 4,
    name: 'Smart App Engagement',
    type: 'Mobile',
    description: 'AI-driven mobile app engagement with behavioral triggers',
    aiGenerated: true,
    estimatedEngagement: '78%',
    category: 'Digital'
  },
]

// AI Campaign Suggestions based on objectives
const AI_CAMPAIGN_SUGGESTIONS = {
  'acquisition': {
    name: 'Smart Customer Acquisition Campaign',
    description: 'AI-optimized campaign targeting high-potential prospects with personalized messaging and optimal channel mix.',
    channels: ['email', 'social', 'web'],
    segments: [2, 4],
    budget: 15000,
    estimatedROI: '285%',
    content: {
      subject: 'Discover Banking Made Simple - Exclusive Offer Inside',
      body: 'Join thousands of satisfied customers who have simplified their banking with our award-winning digital platform.',
      cta: 'Get Started Today'
    }
  },
  'retention': {
    name: 'Intelligent Customer Retention Campaign',
    description: 'Data-driven retention campaign using predictive analytics to identify at-risk customers and re-engage them.',
    channels: ['email', 'mobile', 'sms'],
    segments: [1, 3],
    budget: 12000,
    estimatedROI: '320%',
    content: {
      subject: 'We Value Your Partnership - Exclusive Benefits Await',
      body: 'As a valued customer, we want to ensure you\'re getting the most from your banking relationship.',
      cta: 'Explore Benefits'
    }
  },
  'engagement': {
    name: 'AI-Powered Engagement Campaign',
    description: 'Smart engagement campaign that adapts content based on customer behavior and preferences.',
    channels: ['email', 'mobile', 'web'],
    segments: [1, 2],
    budget: 8000,
    estimatedROI: '195%',
    content: {
      subject: 'Your Monthly Financial Insights Are Ready',
      body: 'Get personalized insights about your financial health and discover new opportunities.',
      cta: 'View Insights'
    }
  }
}

const steps = [
  { title: 'Campaign Strategy', description: 'AI-powered planning' },
  { title: 'Smart Audience', description: 'Intelligent targeting' },
  { title: 'Content Creation', description: 'AI-assisted messaging' },
  { title: 'Optimization', description: 'Budget & scheduling' },
  { title: 'Launch & Monitor', description: 'Deploy and track' },
]

interface CampaignData {
  name: string
  description: string
  objective: string
  templateId: string
  channels: string[]
  segmentIds: number[]
  content: {
    subject: string
    body: string
    images: any[]
    cta: string
  }
  schedule: {
    startDate: string
    endDate: string
    sendTime: string
    frequency: string
  }
  budget: {
    total: number
    channelAllocation: {
      [key: string]: number
    }
  }
  aiOptimized: boolean
  estimatedMetrics: {
    reach: number
    engagement: string
    roi: string
  }
}

export default function BuildCampaign() {
  const cardBg = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.700')
  const modalBg = useColorModeValue('white', 'gray.800')
  const gradientBg = useColorModeValue(
    'linear(to-br, blue.50, purple.50, pink.50)',
    'linear(to-br, blue.900, purple.900, pink.900)'
  )
  const toast = useToast()

  const { activeStep, setActiveStep } = useSteps({
    index: 0,
    count: steps.length,
  })

  const { isOpen: isAIModalOpen, onOpen: onAIModalOpen, onClose: onAIModalClose } = useDisclosure()

  // Enhanced campaign form state
  const [campaignData, setCampaignData] = useState<CampaignData>({
    name: '',
    description: '',
    objective: 'acquisition',
    templateId: '',
    channels: ['email'],
    segmentIds: [],
    content: {
      subject: '',
      body: '',
      images: [],
      cta: '',
    },
    schedule: {
      startDate: '',
      endDate: '',
      sendTime: '09:00',
      frequency: 'once',
    },
    budget: {
      total: 10000,
      channelAllocation: {
        email: 50,
        mobile: 20,
        social: 20,
        web: 10,
      }
    },
    aiOptimized: false,
    estimatedMetrics: {
      reach: 0,
      engagement: '0%',
      roi: '0%'
    }
  })

  // AI states
  const [isLoadingAI, setIsLoadingAI] = useState(false)
  const [aiSuggested, setAiSuggested] = useState(false)
  const [humanEdited, setHumanEdited] = useState(false)
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})
  const [showAIInsights, setShowAIInsights] = useState(false)

  // Customer Segment Modal states
  const [showCreateSegmentModal, setShowCreateSegmentModal] = useState(false)
  const [showAISegmentModal, setShowAISegmentModal] = useState(false)

  const updateCampaignData = (field: string, value: any) => {
    setCampaignData(prev => ({
      ...prev,
      [field]: value
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

  const updateNestedField = (parent: keyof CampaignData, field: string, value: any) => {
    setCampaignData(prev => {
      const newState = JSON.parse(JSON.stringify(prev)) as CampaignData

      if (parent === 'content') {
        (newState.content as any)[field] = value
      } else if (parent === 'schedule') {
        (newState.schedule as any)[field] = value
      } else if (parent === 'budget') {
        if (field === 'channelAllocation') {
          newState.budget.channelAllocation = value
        } else {
          (newState.budget as any)[field] = value
        }
      } else if (parent === 'estimatedMetrics') {
        (newState.estimatedMetrics as any)[field] = value
      }

      return newState
    })

    // Mark as human edited if AI suggestions were applied
    if (aiSuggested && !isLoadingAI) {
      setHumanEdited(true)
    }
  }

  // AI suggestion functionality
  const applyAISuggestions = async () => {
    if (!campaignData.objective) return

    setIsLoadingAI(true)

    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 2000))

    const suggestion = AI_CAMPAIGN_SUGGESTIONS[campaignData.objective as keyof typeof AI_CAMPAIGN_SUGGESTIONS]

    if (suggestion) {
      setCampaignData(prev => ({
        ...prev,
        name: suggestion.name,
        description: suggestion.description,
        channels: suggestion.channels,
        segmentIds: suggestion.segments,
        content: {
          ...suggestion.content,
          images: [] // Ensure images property is always present
        },
        budget: {
          ...prev.budget,
          total: suggestion.budget
        },
        aiOptimized: true,
        estimatedMetrics: {
          reach: suggestion.segments.reduce((sum, segId) => {
            const segment = SEGMENTS.find(s => s.id === segId)
            return sum + (segment?.size || 0)
          }, 0),
          engagement: '75%',
          roi: suggestion.estimatedROI
        }
      }))

      setIsLoadingAI(false)
      setAiSuggested(true)
      setHumanEdited(false)

      toast({
        title: "🤖 AI Campaign Optimized!",
        description: `Smart recommendations applied for ${campaignData.objective} campaign with ${suggestion.estimatedROI} estimated ROI.`,
        status: "success",
        duration: 4000,
        isClosable: true,
      })
    }
  }

  const validateStep = (step: number) => {
    const errors: Record<string, string> = {}

    switch (step) {
      case 0:
        if (!campaignData.name.trim()) {
          errors.name = 'Campaign name is required'
        }
        if (!campaignData.objective) {
          errors.objective = 'Campaign objective is required'
        }
        break
      case 1:
        if (campaignData.segmentIds.length === 0) {
          errors.segments = 'At least one segment must be selected'
        }
        break
      case 2:
        if (campaignData.channels.length === 0) {
          errors.channels = 'At least one channel must be selected'
        }
        if (!campaignData.content.subject.trim() && campaignData.channels.includes('email')) {
          errors.subject = 'Email subject is required'
        }
        break
      case 3:
        if (!campaignData.schedule.startDate) {
          errors.startDate = 'Start date is required'
        }
        if (campaignData.budget.total < 1000) {
          errors.budget = 'Budget must be at least $1,000'
        }
        break
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleNextStep = () => {
    if (validateStep(activeStep)) {
      if (activeStep < steps.length - 1) {
        setActiveStep(activeStep + 1)
      }
    }
  }

  const handlePrevStep = () => {
    if (activeStep > 0) {
      setActiveStep(activeStep - 1)
    }
  }

  const handleSaveDraft = () => {
    toast({
      title: 'Campaign Draft Saved',
      description: 'Your AI-optimized campaign has been saved successfully.',
      status: 'success',
      duration: 3000,
      isClosable: true,
    })
  }

  const handleLaunchCampaign = () => {
    if (validateStep(activeStep)) {
      toast({
        title: '🚀 Campaign Launched!',
        description: `Your ${campaignData.aiOptimized ? 'AI-optimized' : ''} campaign is now live and ready to engage your audience.`,
        status: 'success',
        duration: 4000,
        isClosable: true,
      })
    }
  }

  // Calculate total audience size
  const totalAudienceSize = campaignData.segmentIds.reduce((sum, segId) => {
    const segment = SEGMENTS.find(s => s.id === segId)
    return sum + (segment?.size || 0)
  }, 0)

  return (
    <Box mb={6}>
      <HStack spacing={4} align="center" mb={6}>
        <Icon as={FiZap} boxSize={8} color="blue.500" />
        <Box>
          <Heading as="h1" size="xl" color="secondary.700">
            AI-Powered Campaign Builder
          </Heading>
          <Text color="gray.600">
            Create intelligent marketing campaigns with AI-driven insights and optimization
          </Text>
        </Box>
      </HStack>

      <Card bg={cardBg} mb={8} borderWidth="1px" borderColor={borderColor} borderRadius="xl" boxShadow="lg">
        <CardBody p={6}>
          {/* AI Suggestion Alert */}
          {aiSuggested && (
            <Box mb={6}>
              <SlideFade in={aiSuggested}>
                <Alert
                  status={humanEdited ? "warning" : "success"}
                  borderRadius="lg"
                  variant="left-accent"
                >
                  <AlertIcon />
                  <Box>
                    <AlertTitle fontSize="sm">
                      {humanEdited ? "🎯 AI + Human Optimized!" : "🤖 AI Campaign Optimized!"}
                    </AlertTitle>
                    <AlertDescription fontSize="xs">
                      {humanEdited
                        ? "Great! You've personalized the AI recommendations for better results."
                        : `Smart campaign strategy applied with ${campaignData.estimatedMetrics.roi} estimated ROI.`
                      }
                    </AlertDescription>
                  </Box>
                </Alert>
              </SlideFade>
            </Box>
          )}

          <Box mb={6}>
            <Stepper index={activeStep} colorScheme="blue" size="lg">
              {steps.map((step, index) => (
                <Step key={index} onClick={() => setActiveStep(index)} cursor="pointer">
                  <StepIndicator>
                    <StepStatus
                      complete={<StepIcon />}
                      incomplete={<StepNumber />}
                      active={<StepNumber />}
                    />
                  </StepIndicator>
                  <Box flexShrink="0">
                    <StepTitle>{step.title}</StepTitle>
                    <StepDescription>{step.description}</StepDescription>
                  </Box>
                  <StepSeparator />
                </Step>
              ))}
            </Stepper>
          </Box>

          <Box mt={8}>
            {/* Step 1: Enhanced Campaign Strategy */}
            {activeStep === 0 && (
              <VStack spacing={6} align="start">
                <HStack justify="space-between" w="full">
                  <Heading size="md">Campaign Strategy & Objectives</Heading>
                  <Tooltip label="Get AI-powered campaign suggestions" hasArrow>
                    <Button
                      leftIcon={<Icon as={FiZap} />}
                      colorScheme="purple"
                      variant="outline"
                      size="sm"
                      onClick={applyAISuggestions}
                      isLoading={isLoadingAI}
                      loadingText="AI Optimizing..."
                      isDisabled={!campaignData.objective || isLoadingAI}
                    >
                      AI Optimize
                    </Button>
                  </Tooltip>
                </HStack>

                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6} width="full">
                  <FormControl isRequired isInvalid={!!formErrors.name}>
                    <FormLabel fontSize="sm" fontWeight="semibold">Campaign Name</FormLabel>
                    <Input
                      placeholder="Enter a descriptive campaign name..."
                      value={campaignData.name}
                      onChange={(e) => updateCampaignData('name', e.target.value)}
                      bg={useColorModeValue('gray.50', 'gray.700')}
                      borderRadius="md"
                      _focus={{ borderColor: 'blue.500' }}
                    />
                    {formErrors.name && (
                      <FormErrorMessage>{formErrors.name}</FormErrorMessage>
                    )}
                  </FormControl>

                  <FormControl isRequired isInvalid={!!formErrors.objective}>
                    <FormLabel fontSize="sm" fontWeight="semibold">Campaign Objective</FormLabel>
                    <Select
                      value={campaignData.objective}
                      onChange={(e) => updateCampaignData('objective', e.target.value)}
                      bg={useColorModeValue('gray.50', 'gray.700')}
                      borderRadius="md"
                      _focus={{ borderColor: 'blue.500' }}
                    >
                      <option value="acquisition">🎯 Customer Acquisition</option>
                      <option value="retention">🔄 Customer Retention</option>
                      <option value="engagement">💬 Engagement & Loyalty</option>
                      <option value="conversion">💰 Product Conversion</option>
                      <option value="awareness">📢 Brand Awareness</option>
                    </Select>
                    {formErrors.objective && (
                      <FormErrorMessage>{formErrors.objective}</FormErrorMessage>
                    )}
                  </FormControl>
                </SimpleGrid>

                <FormControl>
                  <FormLabel fontSize="sm" fontWeight="semibold">Campaign Description</FormLabel>
                  <Textarea
                    placeholder="Describe your campaign goals and target outcomes..."
                    rows={3}
                    value={campaignData.description}
                    onChange={(e) => updateCampaignData('description', e.target.value)}
                    bg={useColorModeValue('gray.50', 'gray.700')}
                    borderRadius="md"
                    _focus={{ borderColor: 'blue.500' }}
                    resize="vertical"
                  />
                </FormControl>

                <FormControl>
                  <FormLabel fontSize="sm" fontWeight="semibold">Campaign Template</FormLabel>
                  <Select
                    placeholder="Choose a template or start from scratch"
                    value={campaignData.templateId}
                    onChange={(e) => updateCampaignData('templateId', e.target.value)}
                    bg={useColorModeValue('gray.50', 'gray.700')}
                    borderRadius="md"
                    _focus={{ borderColor: 'blue.500' }}
                  >
                    {TEMPLATES.map(template => (
                      <option key={template.id} value={template.id.toString()}>
                        {template.aiGenerated ? '🤖 ' : '📄 '}
                        {template.name} - {template.type} ({template.estimatedEngagement} engagement)
                      </option>
                    ))}
                  </Select>
                  <FormHelperText>AI-generated templates include smart optimization features</FormHelperText>
                </FormControl>

                {/* Estimated Metrics Preview */}
                {campaignData.aiOptimized && (
                  <Box
                    p={4}
                    bg={useColorModeValue('green.50', 'green.900')}
                    borderRadius="md"
                    border="1px solid"
                    borderColor={useColorModeValue('green.200', 'green.700')}
                    w="full"
                  >
                    <HStack justify="space-between" mb={2}>
                      <HStack>
                        <Icon as={FiTrendingUp} color="green.500" />
                        <Text fontWeight="bold" fontSize="sm">AI Performance Estimates</Text>
                      </HStack>
                      <Badge colorScheme="green" fontSize="xs">AI Optimized</Badge>
                    </HStack>
                    <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
                      <Box>
                        <Text fontSize="xs" color="gray.600">Estimated Reach</Text>
                        <Text fontWeight="bold">{campaignData.estimatedMetrics.reach.toLocaleString()} customers</Text>
                      </Box>
                      <Box>
                        <Text fontSize="xs" color="gray.600">Predicted Engagement</Text>
                        <Text fontWeight="bold">{campaignData.estimatedMetrics.engagement}</Text>
                      </Box>
                      <Box>
                        <Text fontSize="xs" color="gray.600">Expected ROI</Text>
                        <Text fontWeight="bold" color="green.600">{campaignData.estimatedMetrics.roi}</Text>
                      </Box>
                    </SimpleGrid>
                  </Box>
                )}
              </VStack>
            )}

            {/* Step 2: Enhanced Audience Selection */}
            {activeStep === 1 && (
              <VStack spacing={6} align="start">
                <HStack justify="space-between" w="full">
                  <Heading size="md">Intelligent Audience Targeting</Heading>
                  <Menu>
                    <MenuButton
                      as={Button}
                      rightIcon={<Icon as={FiChevronRight} transform="rotate(90deg)" />}
                      colorScheme="blue"
                      variant="outline"
                      size="sm"
                      leftIcon={<Icon as={FiUsers} />}
                    >
                      Manage Segments
                    </MenuButton>
                    <MenuList>
                      <MenuItem
                        icon={<Icon as={FiZap} />}
                        onClick={() => {
                          setShowAISegmentModal(true)
                        }}
                      >
                        AI Driver Customer Segment
                      </MenuItem>
                      <MenuItem
                        icon={<Icon as={FiPlus} />}
                        onClick={() => {
                          setShowCreateSegmentModal(true)
                        }}
                      >
                        Create Segment
                      </MenuItem>
                    </MenuList>
                  </Menu>
                </HStack>

                <FormControl isInvalid={!!formErrors.segments}>
                  <FormLabel fontSize="sm" fontWeight="semibold">Customer Segments</FormLabel>
                  <Text fontSize="sm" color="gray.600" mb={4}>
                    Select target segments based on AI recommendations and performance data
                  </Text>
                  <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={4}>
                    {SEGMENTS.map(segment => (
                      <Card
                        key={segment.id}
                        variant={campaignData.segmentIds.includes(segment.id) ? "filled" : "outline"}
                        cursor="pointer"
                        onClick={() => {
                          const newSegmentIds = campaignData.segmentIds.includes(segment.id)
                            ? campaignData.segmentIds.filter(id => id !== segment.id)
                            : [...campaignData.segmentIds, segment.id]
                          updateCampaignData('segmentIds', newSegmentIds)
                        }}
                        _hover={{ transform: 'translateY(-2px)', boxShadow: 'md' }}
                        transition="all 0.2s"
                        bg={campaignData.segmentIds.includes(segment.id)
                          ? useColorModeValue('blue.50', 'blue.900')
                          : cardBg
                        }
                        borderColor={campaignData.segmentIds.includes(segment.id) ? 'blue.500' : borderColor}
                      >
                        <CardBody p={4}>
                          <VStack align="start" spacing={3}>
                            <HStack justify="space-between" w="full">
                              <HStack>
                                <Checkbox
                                  isChecked={campaignData.segmentIds.includes(segment.id)}
                                  onChange={() => { }}
                                  colorScheme="blue"
                                />
                                <Text fontWeight="bold" fontSize="sm">{segment.name}</Text>
                              </HStack>
                              <HStack spacing={1}>
                                {segment.aiRecommended && (
                                  <Badge colorScheme="purple" fontSize="xs">AI Recommended</Badge>
                                )}
                                <Badge colorScheme="green" fontSize="xs">{segment.engagement}</Badge>
                              </HStack>
                            </HStack>
                            <Text fontSize="xs" color="gray.600" noOfLines={2}>
                              {segment.description}
                            </Text>
                            <HStack justify="space-between" w="full">
                              <Text fontSize="xs">
                                <Text as="span" fontWeight="bold">{segment.size.toLocaleString()}</Text> customers
                              </Text>
                              <Text fontSize="xs">
                                Avg. Value: <Text as="span" fontWeight="bold">{segment.avgValue}</Text>
                              </Text>
                            </HStack>
                          </VStack>
                        </CardBody>
                      </Card>
                    ))}
                  </SimpleGrid>
                  {formErrors.segments && (
                    <FormErrorMessage mt={2}>{formErrors.segments}</FormErrorMessage>
                  )}
                </FormControl>

                <Box
                  p={4}
                  bg={useColorModeValue('blue.50', 'blue.900')}
                  borderRadius="md"
                  width="full"
                  border="1px solid"
                  borderColor={useColorModeValue('blue.200', 'blue.700')}
                >
                  <VStack align="start" spacing={2}>
                    <HStack>
                      <Icon as={FiUsers} color="blue.500" />
                      <Text fontWeight="bold" fontSize="sm">Selected Audience Overview</Text>
                    </HStack>
                    <Divider />
                    <HStack justify="space-between" w="full">
                      <Text fontSize="sm">Total Audience Size:</Text>
                      <Text fontWeight="bold" fontSize="sm">
                        {totalAudienceSize === 0
                          ? 'No segments selected'
                          : `${totalAudienceSize.toLocaleString()} customers`
                        }
                      </Text>
                    </HStack>
                    {campaignData.segmentIds.length > 0 && (
                      <HStack justify="space-between" w="full">
                        <Text fontSize="sm">Estimated Reach:</Text>
                        <Text fontWeight="bold" fontSize="sm" color="green.600">
                          {Math.round(totalAudienceSize * 0.75).toLocaleString()} customers
                        </Text>
                      </HStack>
                    )}
                  </VStack>
                </Box>
              </VStack>
            )}

            {/* Step 3: Enhanced Message Content */}
            {activeStep === 2 && (
              <VStack spacing={6} align="start">
                <Heading size="md">AI-Assisted Content Creation</Heading>

                <FormControl isInvalid={!!formErrors.channels}>
                  <FormLabel fontSize="sm" fontWeight="semibold">Communication Channels</FormLabel>
                  <CheckboxGroup
                    colorScheme="blue"
                    value={campaignData.channels}
                    onChange={(values) => updateCampaignData('channels', values)}
                  >
                    <SimpleGrid columns={{ base: 2, md: 3, lg: 5 }} spacing={3}>
                      <Card
                        variant="outline"
                        cursor="pointer"
                        _hover={{ borderColor: 'blue.500' }}
                        bg={campaignData.channels.includes('email') ? useColorModeValue('blue.50', 'blue.900') : 'transparent'}
                      >
                        <CardBody p={3} textAlign="center">
                          <Checkbox value="email">
                            <VStack spacing={1}>
                              <Icon as={FiMail} color="blue.500" boxSize={5} />
                              <Text fontSize="sm">Email</Text>
                            </VStack>
                          </Checkbox>
                        </CardBody>
                      </Card>
                      <Card
                        variant="outline"
                        cursor="pointer"
                        _hover={{ borderColor: 'blue.500' }}
                        bg={campaignData.channels.includes('mobile') ? useColorModeValue('blue.50', 'blue.900') : 'transparent'}
                      >
                        <CardBody p={3} textAlign="center">
                          <Checkbox value="mobile">
                            <VStack spacing={1}>
                              <Icon as={FiSmartphone} color="blue.500" boxSize={5} />
                              <Text fontSize="sm">Mobile</Text>
                            </VStack>
                          </Checkbox>
                        </CardBody>
                      </Card>
                      <Card
                        variant="outline"
                        cursor="pointer"
                        _hover={{ borderColor: 'blue.500' }}
                        bg={campaignData.channels.includes('sms') ? useColorModeValue('blue.50', 'blue.900') : 'transparent'}
                      >
                        <CardBody p={3} textAlign="center">
                          <Checkbox value="sms">
                            <VStack spacing={1}>
                              <Icon as={FiMessageSquare} color="blue.500" boxSize={5} />
                              <Text fontSize="sm">SMS</Text>
                            </VStack>
                          </Checkbox>
                        </CardBody>
                      </Card>
                      <Card
                        variant="outline"
                        cursor="pointer"
                        _hover={{ borderColor: 'blue.500' }}
                        bg={campaignData.channels.includes('web') ? useColorModeValue('blue.50', 'blue.900') : 'transparent'}
                      >
                        <CardBody p={3} textAlign="center">
                          <Checkbox value="web">
                            <VStack spacing={1}>
                              <Icon as={FiGlobe} color="blue.500" boxSize={5} />
                              <Text fontSize="sm">Web</Text>
                            </VStack>
                          </Checkbox>
                        </CardBody>
                      </Card>
                      <Card
                        variant="outline"
                        cursor="pointer"
                        _hover={{ borderColor: 'blue.500' }}
                        bg={campaignData.channels.includes('social') ? useColorModeValue('blue.50', 'blue.900') : 'transparent'}
                      >
                        <CardBody p={3} textAlign="center">
                          <Checkbox value="social">
                            <VStack spacing={1}>
                              <Icon as={FiShare2} color="blue.500" boxSize={5} />
                              <Text fontSize="sm">Social</Text>
                            </VStack>
                          </Checkbox>
                        </CardBody>
                      </Card>
                    </SimpleGrid>
                  </CheckboxGroup>
                  {formErrors.channels && (
                    <FormErrorMessage mt={2}>{formErrors.channels}</FormErrorMessage>
                  )}
                </FormControl>

                <Tabs variant="soft-rounded" colorScheme="blue" width="full">
                  <TabList>
                    {campaignData.channels.map(channel => (
                      <Tab key={channel}>
                        <HStack>
                          <Icon
                            as={
                              channel === 'email' ? FiMail :
                                channel === 'mobile' ? FiSmartphone :
                                  channel === 'sms' ? FiMessageSquare :
                                    channel === 'web' ? FiGlobe :
                                      FiShare2
                            }
                          />
                          <Text>{channel.charAt(0).toUpperCase() + channel.slice(1)}</Text>
                        </HStack>
                      </Tab>
                    ))}
                  </TabList>

                  <TabPanels>
                    {campaignData.channels.map(channel => (
                      <TabPanel key={channel} px={0}>
                        {channel === 'email' && (
                          <VStack spacing={4} align="start" width="full">
                            <FormControl isRequired isInvalid={!!formErrors.subject}>
                              <FormLabel fontSize="sm" fontWeight="semibold">Subject Line</FormLabel>
                              <Input
                                placeholder="Enter compelling email subject..."
                                value={campaignData.content.subject}
                                onChange={(e) => updateNestedField('content', 'subject', e.target.value)}
                                bg={useColorModeValue('gray.50', 'gray.700')}
                                borderRadius="md"
                                _focus={{ borderColor: 'blue.500' }}
                              />
                              {formErrors.subject && (
                                <FormErrorMessage>{formErrors.subject}</FormErrorMessage>
                              )}
                              {aiSuggested && (
                                <FormHelperText color="green.600">
                                  ✨ AI-optimized for higher open rates
                                </FormHelperText>
                              )}
                            </FormControl>

                            <FormControl isRequired>
                              <FormLabel fontSize="sm" fontWeight="semibold">Email Content</FormLabel>
                              <Textarea
                                placeholder="Compose your email content..."
                                rows={8}
                                value={campaignData.content.body}
                                onChange={(e) => updateNestedField('content', 'body', e.target.value)}
                                bg={useColorModeValue('gray.50', 'gray.700')}
                                borderRadius="md"
                                _focus={{ borderColor: 'blue.500' }}
                                resize="vertical"
                              />
                              {aiSuggested && (
                                <FormHelperText color="green.600">
                                  ✨ AI-crafted content optimized for your audience
                                </FormHelperText>
                              )}
                            </FormControl>

                            <FormControl>
                              <FormLabel fontSize="sm" fontWeight="semibold">Call to Action</FormLabel>
                              <Input
                                placeholder="e.g. Get Started, Learn More, Apply Now"
                                value={campaignData.content.cta}
                                onChange={(e) => updateNestedField('content', 'cta', e.target.value)}
                                bg={useColorModeValue('gray.50', 'gray.700')}
                                borderRadius="md"
                                _focus={{ borderColor: 'blue.500' }}
                              />
                            </FormControl>
                          </VStack>
                        )}

                        {channel === 'sms' && (
                          <VStack spacing={4} align="start" width="full">
                            <FormControl isRequired>
                              <FormLabel fontSize="sm" fontWeight="semibold">SMS Content</FormLabel>
                              <Textarea
                                placeholder="Type your SMS message (160 character limit)"
                                rows={4}
                                maxLength={160}
                                value={campaignData.content.body}
                                onChange={(e) => updateNestedField('content', 'body', e.target.value)}
                                bg={useColorModeValue('gray.50', 'gray.700')}
                                borderRadius="md"
                                _focus={{ borderColor: 'blue.500' }}
                              />
                              <HStack justify="space-between">
                                <FormHelperText>
                                  Characters: {campaignData.content.body.length}/160
                                </FormHelperText>
                                <Progress
                                  value={(campaignData.content.body.length / 160) * 100}
                                  size="sm"
                                  w="100px"
                                  colorScheme={campaignData.content.body.length > 160 ? "red" : "blue"}
                                />
                              </HStack>
                            </FormControl>
                          </VStack>
                        )}

                        {(channel === 'mobile' || channel === 'web' || channel === 'social') && (
                          <Box p={6} bg={useColorModeValue('gray.50', 'gray.700')} borderRadius="md" textAlign="center">
                            <VStack spacing={3}>
                              <Icon as={FiBriefcase} boxSize={8} color="gray.400" />
                              <Text color="gray.500">
                                Advanced content builder for {channel} coming soon...
                              </Text>
                              <Text fontSize="sm" color="gray.400">
                                Enhanced AI-powered content creation tools will be available here
                              </Text>
                            </VStack>
                          </Box>
                        )}
                      </TabPanel>
                    ))}
                  </TabPanels>
                </Tabs>
              </VStack>
            )}

            {/* Step 4: Enhanced Schedule & Budget */}
            {activeStep === 3 && (
              <VStack spacing={6} align="start">
                <Heading size="md">Campaign Optimization & Scheduling</Heading>

                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6} width="full">
                  <FormControl isRequired isInvalid={!!formErrors.startDate}>
                    <FormLabel fontSize="sm" fontWeight="semibold">Launch Date</FormLabel>
                    <Input
                      type="date"
                      value={campaignData.schedule.startDate}
                      onChange={(e) => updateNestedField('schedule', 'startDate', e.target.value)}
                      bg={useColorModeValue('gray.50', 'gray.700')}
                      borderRadius="md"
                      _focus={{ borderColor: 'blue.500' }}
                    />
                    {formErrors.startDate && (
                      <FormErrorMessage>{formErrors.startDate}</FormErrorMessage>
                    )}
                  </FormControl>

                  <FormControl>
                    <FormLabel fontSize="sm" fontWeight="semibold">End Date (Optional)</FormLabel>
                    <Input
                      type="date"
                      value={campaignData.schedule.endDate}
                      onChange={(e) => updateNestedField('schedule', 'endDate', e.target.value)}
                      bg={useColorModeValue('gray.50', 'gray.700')}
                      borderRadius="md"
                      _focus={{ borderColor: 'blue.500' }}
                    />
                    <FormHelperText>Leave blank for one-time campaigns</FormHelperText>
                  </FormControl>
                </SimpleGrid>

                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6} width="full">
                  <FormControl>
                    <FormLabel fontSize="sm" fontWeight="semibold">Optimal Send Time</FormLabel>
                    <Select
                      value={campaignData.schedule.sendTime}
                      onChange={(e) => updateNestedField('schedule', 'sendTime', e.target.value)}
                      bg={useColorModeValue('gray.50', 'gray.700')}
                      borderRadius="md"
                      _focus={{ borderColor: 'blue.500' }}
                    >
                      <option value="09:00">🌅 9:00 AM (Morning Peak)</option>
                      <option value="12:00">☀️ 12:00 PM (Lunch Break)</option>
                      <option value="15:00">🌤️ 3:00 PM (Afternoon)</option>
                      <option value="18:00">🌆 6:00 PM (Evening)</option>
                      <option value="20:00">🌙 8:00 PM (Night)</option>
                    </Select>
                    {aiSuggested && (
                      <FormHelperText color="green.600">
                        ✨ AI recommends this time for maximum engagement
                      </FormHelperText>
                    )}
                  </FormControl>

                  <FormControl>
                    <FormLabel fontSize="sm" fontWeight="semibold">Campaign Frequency</FormLabel>
                    <Select
                      value={campaignData.schedule.frequency}
                      onChange={(e) => updateNestedField('schedule', 'frequency', e.target.value)}
                      bg={useColorModeValue('gray.50', 'gray.700')}
                      borderRadius="md"
                      _focus={{ borderColor: 'blue.500' }}
                    >
                      <option value="once">📅 One Time</option>
                      <option value="daily">🔄 Daily</option>
                      <option value="weekly">📊 Weekly</option>
                      <option value="monthly">📈 Monthly</option>
                    </Select>
                  </FormControl>
                </SimpleGrid>

                <Divider my={4} />

                <FormControl isInvalid={!!formErrors.budget}>
                  <FormLabel fontSize="sm" fontWeight="semibold">Campaign Budget</FormLabel>
                  <HStack spacing={4} width="full">
                    <NumberInput
                      value={campaignData.budget.total}
                      onChange={(valueString) => updateNestedField('budget', 'total', Number(valueString))}
                      min={1000}
                      step={1000}
                      width="200px"
                    >
                      <NumberInputField
                        bg={useColorModeValue('gray.50', 'gray.700')}
                        borderRadius="md"
                        _focus={{ borderColor: 'blue.500' }}
                      />
                      <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                      </NumberInputStepper>
                    </NumberInput>
                    <VStack align="start" spacing={1}>
                      <Text fontWeight="medium" fontSize="lg">${campaignData.budget.total.toLocaleString()}</Text>
                      <Text fontSize="xs" color="gray.500">
                        ~${Math.round(campaignData.budget.total / Math.max(totalAudienceSize, 1) * 1000) / 1000} per customer
                      </Text>
                    </VStack>
                  </HStack>
                  {formErrors.budget && (
                    <FormErrorMessage>{formErrors.budget}</FormErrorMessage>
                  )}
                </FormControl>

                {campaignData.channels.length > 1 && (
                  <FormControl>
                    <FormLabel fontSize="sm" fontWeight="semibold">Smart Budget Allocation</FormLabel>
                    <VStack spacing={4} width="full">
                      {campaignData.channels.map(channel => (
                        <HStack key={channel} width="full" spacing={4}>
                          <HStack width="120px">
                            <Icon
                              as={
                                channel === 'email' ? FiMail :
                                  channel === 'mobile' ? FiSmartphone :
                                    channel === 'sms' ? FiMessageSquare :
                                      channel === 'web' ? FiGlobe :
                                        FiShare2
                              }
                              color="blue.500"
                            />
                            <Text fontSize="sm" fontWeight="medium">
                              {channel.charAt(0).toUpperCase() + channel.slice(1)}
                            </Text>
                          </HStack>
                          <Slider
                            flex="1"
                            colorScheme="blue"
                            value={campaignData.budget.channelAllocation[channel] || 0}
                            onChange={(v) => {
                              const updatedAllocation = { ...campaignData.budget.channelAllocation }
                              updatedAllocation[channel] = v
                              updateNestedField('budget', 'channelAllocation', updatedAllocation)
                            }}
                          >
                            <SliderTrack>
                              <SliderFilledTrack />
                            </SliderTrack>
                            <SliderThumb />
                          </Slider>
                          <Text width="60px" fontSize="sm" fontWeight="medium">
                            {campaignData.budget.channelAllocation[channel] || 0}%
                          </Text>
                          <Text width="100px" fontSize="sm" color="green.600" fontWeight="bold">
                            ${Math.round(campaignData.budget.total * (campaignData.budget.channelAllocation[channel] || 0) / 100).toLocaleString()}
                          </Text>
                        </HStack>
                      ))}
                    </VStack>
                    {aiSuggested && (
                      <FormHelperText color="green.600">
                        ✨ Budget allocation optimized based on channel performance data
                      </FormHelperText>
                    )}
                  </FormControl>
                )}

                {/* Budget Insights */}
                <Box
                  p={4}
                  bg={useColorModeValue('purple.50', 'purple.900')}
                  borderRadius="md"
                  border="1px solid"
                  borderColor={useColorModeValue('purple.200', 'purple.700')}
                  w="full"
                >
                  <VStack align="start" spacing={3}>
                    <HStack>
                      <Icon as={FiAward} color="purple.500" />
                      <Text fontWeight="bold" fontSize="sm">Budget Performance Insights</Text>
                    </HStack>
                    <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4} w="full">
                      <Box>
                        <Text fontSize="xs" color="gray.600">Cost Per Acquisition</Text>
                        <Text fontWeight="bold" color="purple.600">
                          ${Math.round(campaignData.budget.total / Math.max(totalAudienceSize * 0.15, 1))}
                        </Text>
                      </Box>
                      <Box>
                        <Text fontSize="xs" color="gray.600">Estimated Conversions</Text>
                        <Text fontWeight="bold" color="purple.600">
                          {Math.round(totalAudienceSize * 0.15).toLocaleString()}
                        </Text>
                      </Box>
                      <Box>
                        <Text fontSize="xs" color="gray.600">ROI Projection</Text>
                        <Text fontWeight="bold" color="green.600">
                          {campaignData.estimatedMetrics.roi || '185%'}
                        </Text>
                      </Box>
                    </SimpleGrid>
                  </VStack>
                </Box>
              </VStack>
            )}

            {/* Step 5: Enhanced Review & Launch */}
            {activeStep === 4 && (
              <VStack spacing={6} align="start">
                <Heading size="md">Campaign Review & Launch</Heading>

                <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6} w="full">
                  <Card bg={useColorModeValue('gray.50', 'gray.700')} borderRadius="lg">
                    <CardBody p={5}>
                      <VStack align="start" spacing={4}>
                        <HStack>
                          <Icon as={FiFileText} color="blue.500" />
                          <Heading size="sm">Campaign Details</Heading>
                        </HStack>
                        <Divider />
                        <VStack align="start" spacing={2} w="full">
                          <HStack justify="space-between" w="full">
                            <Text fontWeight="medium" fontSize="sm">Name:</Text>
                            <Text fontSize="sm" textAlign="right">{campaignData.name || '(Not specified)'}</Text>
                          </HStack>
                          <HStack justify="space-between" w="full">
                            <Text fontWeight="medium" fontSize="sm">Objective:</Text>
                            <Badge colorScheme="blue" fontSize="xs">
                              {campaignData.objective}
                            </Badge>
                          </HStack>
                          <HStack justify="space-between" w="full" align="start">
                            <Text fontWeight="medium" fontSize="sm">Channels:</Text>
                            <VStack align="end" spacing={1}>
                              {campaignData.channels.map(channel => (
                                <Badge key={channel} colorScheme="purple" fontSize="xs">
                                  {channel}
                                </Badge>
                              ))}
                            </VStack>
                          </HStack>
                          <HStack justify="space-between" w="full">
                            <Text fontWeight="medium" fontSize="sm">AI Optimized:</Text>
                            <Badge colorScheme={campaignData.aiOptimized ? "green" : "gray"} fontSize="xs">
                              {campaignData.aiOptimized ? "Yes" : "No"}
                            </Badge>
                          </HStack>
                        </VStack>
                      </VStack>
                    </CardBody>
                  </Card>

                  <Card bg={useColorModeValue('gray.50', 'gray.700')} borderRadius="lg">
                    <CardBody p={5}>
                      <VStack align="start" spacing={4}>
                        <HStack>
                          <Icon as={FiUsers} color="green.500" />
                          <Heading size="sm">Target Audience</Heading>
                        </HStack>
                        <Divider />
                        <VStack align="start" spacing={2} w="full">
                          <HStack justify="space-between" w="full">
                            <Text fontWeight="medium" fontSize="sm">Segments:</Text>
                            <Text fontSize="sm">{campaignData.segmentIds.length}</Text>
                          </HStack>
                          <VStack align="start" spacing={1} w="full">
                            {campaignData.segmentIds.length === 0 ? (
                              <Badge colorScheme="red" fontSize="xs">No segments selected</Badge>
                            ) : (
                              SEGMENTS
                                .filter(seg => campaignData.segmentIds.includes(seg.id))
                                .map(seg => (
                                  <HStack key={seg.id} justify="space-between" w="full">
                                    <Badge colorScheme="green" fontSize="xs">{seg.name}</Badge>
                                    <Text fontSize="xs">{seg.size.toLocaleString()}</Text>
                                  </HStack>
                                ))
                            )}
                          </VStack>
                          <HStack justify="space-between" w="full">
                            <Text fontWeight="medium" fontSize="sm">Total Reach:</Text>
                            <Text fontSize="sm" fontWeight="bold" color="green.600">
                              {totalAudienceSize.toLocaleString()}
                            </Text>
                          </HStack>
                        </VStack>
                      </VStack>
                    </CardBody>
                  </Card>

                  <Card bg={useColorModeValue('gray.50', 'gray.700')} borderRadius="lg">
                    <CardBody p={5}>
                      <VStack align="start" spacing={4}>
                        <HStack>
                          <Icon as={FiCalendar} color="orange.500" />
                          <Heading size="sm">Schedule & Timing</Heading>
                        </HStack>
                        <Divider />
                        <VStack align="start" spacing={2} w="full">
                          <HStack justify="space-between" w="full">
                            <Text fontWeight="medium" fontSize="sm">Launch Date:</Text>
                            <Text fontSize="sm">{campaignData.schedule.startDate || 'Not set'}</Text>
                          </HStack>
                          <HStack justify="space-between" w="full">
                            <Text fontWeight="medium" fontSize="sm">End Date:</Text>
                            <Text fontSize="sm">{campaignData.schedule.endDate || 'One-time'}</Text>
                          </HStack>
                          <HStack justify="space-between" w="full">
                            <Text fontWeight="medium" fontSize="sm">Send Time:</Text>
                            <Text fontSize="sm">{campaignData.schedule.sendTime}</Text>
                          </HStack>
                          <HStack justify="space-between" w="full">
                            <Text fontWeight="medium" fontSize="sm">Frequency:</Text>
                            <Badge colorScheme="orange" fontSize="xs">
                              {campaignData.schedule.frequency}
                            </Badge>
                          </HStack>
                        </VStack>
                      </VStack>
                    </CardBody>
                  </Card>

                  <Card bg={useColorModeValue('gray.50', 'gray.700')} borderRadius="lg">
                    <CardBody p={5}>
                      <VStack align="start" spacing={4}>
                        <HStack>
                          <Icon as={FiDollarSign} color="purple.500" />
                          <Heading size="sm">Budget & Projections</Heading>
                        </HStack>
                        <Divider />
                        <VStack align="start" spacing={2} w="full">
                          <HStack justify="space-between" w="full">
                            <Text fontWeight="medium" fontSize="sm">Total Budget:</Text>
                            <Text fontSize="sm" fontWeight="bold" color="purple.600">
                              ${campaignData.budget.total.toLocaleString()}
                            </Text>
                          </HStack>
                          <HStack justify="space-between" w="full">
                            <Text fontWeight="medium" fontSize="sm">Cost per Customer:</Text>
                            <Text fontSize="sm">
                              ${Math.round(campaignData.budget.total / Math.max(totalAudienceSize, 1) * 100) / 100}
                            </Text>
                          </HStack>
                          <HStack justify="space-between" w="full">
                            <Text fontWeight="medium" fontSize="sm">Expected ROI:</Text>
                            <Text fontSize="sm" fontWeight="bold" color="green.600">
                              {campaignData.estimatedMetrics.roi}
                            </Text>
                          </HStack>
                          {campaignData.channels.length > 1 && (
                            <VStack align="start" spacing={1} w="full">
                              <Text fontWeight="medium" fontSize="sm">Channel Budget:</Text>
                              {campaignData.channels.map(channel => (
                                <HStack key={channel} justify="space-between" w="full">
                                  <Text fontSize="xs">{channel}:</Text>
                                  <Text fontSize="xs" fontWeight="medium">
                                    ${Math.round(campaignData.budget.total * (campaignData.budget.channelAllocation[channel] || 0) / 100).toLocaleString()}
                                  </Text>
                                </HStack>
                              ))}
                            </VStack>
                          )}
                        </VStack>
                      </VStack>
                    </CardBody>
                  </Card>
                </SimpleGrid>

                {/* Campaign Performance Prediction */}
                {campaignData.aiOptimized && (
                  <Box
                    bg={useColorModeValue('green.50', 'green.900')}
                    p={6}
                    borderRadius="lg"
                    borderLeftWidth="4px"
                    borderLeftColor="green.500"
                    width="full"
                  >
                    <VStack align="start" spacing={4}>
                      <HStack>
                        <Icon as={FiTrendingUp} color="green.500" boxSize={6} />
                        <VStack align="start" spacing={0}>
                          <Text fontWeight="bold" fontSize="lg" color="green.700">
                            🎯 AI Performance Prediction
                          </Text>
                          <Text fontSize="sm" color="green.600">
                            Based on similar campaigns and audience analysis
                          </Text>
                        </VStack>
                      </HStack>
                      <SimpleGrid columns={{ base: 1, md: 4 }} spacing={4} w="full">
                        <Box p={3} bg="white" borderRadius="md" textAlign="center">
                          <Text fontSize="xs" color="gray.600">Expected Reach</Text>
                          <Text fontSize="lg" fontWeight="bold" color="blue.600">
                            {Math.round(totalAudienceSize * 0.85).toLocaleString()}
                          </Text>
                        </Box>
                        <Box p={3} bg="white" borderRadius="md" textAlign="center">
                          <Text fontSize="xs" color="gray.600">Open Rate</Text>
                          <Text fontSize="lg" fontWeight="bold" color="green.600">
                            {campaignData.estimatedMetrics.engagement}
                          </Text>
                        </Box>
                        <Box p={3} bg="white" borderRadius="md" textAlign="center">
                          <Text fontSize="xs" color="gray.600">Conversion Rate</Text>
                          <Text fontSize="lg" fontWeight="bold" color="orange.600">15.2%</Text>
                        </Box>
                        <Box p={3} bg="white" borderRadius="md" textAlign="center">
                          <Text fontSize="xs" color="gray.600">ROI</Text>
                          <Text fontSize="lg" fontWeight="bold" color="purple.600">
                            {campaignData.estimatedMetrics.roi}
                          </Text>
                        </Box>
                      </SimpleGrid>
                    </VStack>
                  </Box>
                )}

                {!campaignData.aiOptimized && (
                  <Box
                    bg={useColorModeValue('yellow.50', 'yellow.900')}
                    p={4}
                    borderRadius="md"
                    borderLeftWidth="4px"
                    borderLeftColor="yellow.500"
                    width="full"
                  >
                    <HStack>
                      <Icon as={FiZap} color="yellow.500" />
                      <VStack align="start" spacing={1}>
                        <Text fontWeight="medium" fontSize="sm">
                          💡 Optimize with AI for Better Results
                        </Text>
                        <Text fontSize="xs" color="gray.600">
                          Go back to Step 1 and click "AI Optimize" to improve campaign performance
                        </Text>
                      </VStack>
                    </HStack>
                  </Box>
                )}

                <HStack spacing={4} w="full" justify="center">
                  <Button
                    colorScheme="blue"
                    leftIcon={<Icon as={FiSave} />}
                    onClick={handleSaveDraft}
                    size="lg"
                    minW="160px"
                  >
                    Save Draft
                  </Button>
                  <Button
                    colorScheme="green"
                    leftIcon={<Icon as={FiCheck} />}
                    onClick={handleLaunchCampaign}
                    size="lg"
                    minW="160px"
                    bgGradient="linear(to-r, green.400, teal.500)"
                    _hover={{
                      bgGradient: "linear(to-r, green.500, teal.600)",
                    }}
                  >
                    🚀 Launch Campaign
                  </Button>
                </HStack>
              </VStack>
            )}

            {/* Enhanced Navigation */}
            <Flex justify="space-between" mt={10} pt={6} borderTop="1px solid" borderTopColor={borderColor}>
              <Button
                onClick={handlePrevStep}
                isDisabled={activeStep === 0}
                variant="outline"
                leftIcon={<Icon as={FiArrowRight} transform="rotate(180deg)" />}
                size="lg"
              >
                Previous
              </Button>
              {activeStep < steps.length - 1 ? (
                <Button
                  rightIcon={<Icon as={FiArrowRight} />}
                  onClick={handleNextStep}
                  colorScheme="blue"
                  size="lg"
                  bgGradient="linear(to-r, blue.400, purple.500)"
                  _hover={{
                    bgGradient: "linear(to-r, blue.500, purple.600)",
                  }}
                >
                  Continue
                </Button>
              ) : null}
            </Flex>
          </Box>
        </CardBody>
      </Card>

      {/* Reusable Customer Segment Modals */}
      <CreateSegmentModal
        isOpen={showCreateSegmentModal}
        onClose={() => setShowCreateSegmentModal(false)}
        onSave={(segment) => {
          toast({
            title: "✅ Custom Segment Created!",
            description: `"${segment.name}" has been created and is ready for campaign targeting.`,
            status: "success",
            duration: 4000,
            isClosable: true,
          })
        }}
      />

      <AISegmentModal
        isOpen={showAISegmentModal}
        onClose={() => setShowAISegmentModal(false)}
        onSave={(segment) => {
          toast({
            title: "🤖 AI Segment Generated!",
            description: `"${segment.name}" has been generated and added to your campaign options.`,
            status: "success",
            duration: 4000,
            isClosable: true,
          })
        }}
      />
    </Box>
  )
}