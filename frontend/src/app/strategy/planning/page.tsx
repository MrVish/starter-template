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
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Tooltip,
  Divider,
  Progress,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  FormControl,
  FormLabel,
  useDisclosure,
  Textarea,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormErrorMessage,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  useToast,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  SlideFade,
  Spinner,
  Stack,
  Checkbox,
  CheckboxGroup,
  Tag,
  TagLabel,
  TagCloseButton,
} from '@chakra-ui/react'
import {
  FiTarget,
  FiSearch,
  FiFilter,
  FiPlus,
  FiEdit,
  FiTrash2,
  FiCalendar,
  FiBarChart2,
  FiDollarSign,
  FiUsers,
  FiStar,
  FiCheck,
  FiFlag,
  FiClock,
  FiArrowUp,
  FiArrowDown,
  FiMoreVertical,
  FiDownload,
  FiLink,
  FiSave,
  FiAlertTriangle,
  FiZap,
  FiRefreshCw,
  FiX,
  FiEye,
  FiTrendingUp,
  FiBriefcase,
  FiPieChart,
  FiShield,
  FiSmartphone,
} from 'react-icons/fi'
import DashboardLayout from '../../../components/layout/DashboardLayout'

// Strategy categories and their AI suggestions
const STRATEGY_CATEGORIES = [
  'Digital Transformation',
  'Customer Acquisition',
  'Product Development',
  'Market Expansion',
  'Customer Retention',
  'Operational Excellence',
  'Risk Management',
  'Technology Innovation',
  'Partnership Strategy',
  'Brand Positioning',
]

// Team departments available
const TEAM_DEPARTMENTS = [
  'Marketing',
  'Digital',
  'IT',
  'Investment',
  'Product',
  'UX/UI',
  'Mobile',
  'Customer Experience',
  'Risk Management',
  'Data Analytics',
  'Operations',
  'Compliance',
]

// AI suggestions based on strategy type
const AI_STRATEGY_SUGGESTIONS = {
  'Digital Wealth Management Platform': {
    category: 'Digital Transformation',
    description: 'Comprehensive digital platform for wealth management with AI-driven portfolio insights and automated rebalancing capabilities.',
    priority: 'High',
    estimatedBudget: 850000,
    estimatedDuration: 8,
    team: ['Digital', 'IT', 'UX/UI', 'Investment'],
    kpis: [
      { name: 'Digital Platform Adoption', target: 65, unit: '%' },
      { name: 'Portfolio Management Efficiency', target: 40, unit: '%' },
      { name: 'Client Satisfaction Score', target: 4.7, unit: '/5' }
    ]
  },
  'AI-Powered Investment Advisory': {
    category: 'Technology Innovation',
    description: 'Machine learning-based investment advisory service providing personalized portfolio recommendations and risk assessments.',
    priority: 'High',
    estimatedBudget: 1200000,
    estimatedDuration: 12,
    team: ['Data Analytics', 'Investment', 'IT', 'Compliance'],
    kpis: [
      { name: 'Advisory Client Growth', target: 150, unit: '%' },
      { name: 'Portfolio Performance vs Benchmark', target: 2.5, unit: '%' },
      { name: 'Risk-Adjusted Returns', target: 8.2, unit: '%' }
    ]
  },
  'Mobile Banking Super App': {
    category: 'Digital Transformation',
    description: 'All-in-one mobile banking application with integrated financial services, payments, and lifestyle features.',
    priority: 'High',
    estimatedBudget: 950000,
    estimatedDuration: 10,
    team: ['Mobile', 'UX/UI', 'IT', 'Product'],
    kpis: [
      { name: 'Mobile App Daily Active Users', target: 75, unit: '%' },
      { name: 'Cross-Service Usage', target: 45, unit: '%' },
      { name: 'App Store Rating', target: 4.8, unit: '/5' }
    ]
  },
  'Premium Client Experience Program': {
    category: 'Customer Retention',
    description: 'Exclusive benefits and personalized service program for high-net-worth clients to enhance loyalty and lifetime value.',
    priority: 'Medium',
    estimatedBudget: 650000,
    estimatedDuration: 6,
    team: ['Customer Experience', 'Marketing', 'Operations'],
    kpis: [
      { name: 'Client Retention Rate', target: 18, unit: '%' },
      { name: 'Share of Wallet Growth', target: 25, unit: '%' },
      { name: 'Net Promoter Score', target: 22, unit: 'pts' }
    ]
  },
  'ESG Investment Platform': {
    category: 'Product Development',
    description: 'Sustainable investment platform offering ESG-compliant portfolios with impact measurement and reporting.',
    priority: 'Medium',
    estimatedBudget: 750000,
    estimatedDuration: 9,
    team: ['Investment', 'Product', 'Compliance', 'Marketing'],
    kpis: [
      { name: 'ESG Portfolio AUM Growth', target: 120, unit: '%' },
      { name: 'Sustainable Investment Adoption', target: 35, unit: '%' },
      { name: 'Impact Measurement Accuracy', target: 95, unit: '%' }
    ]
  }
}

// Sample marketing strategies data
const MARKETING_STRATEGIES = [
  {
    id: 1,
    name: 'Digital Wealth Management Transition',
    description: 'Strategy to increase digital portfolio management adoption across high-net-worth clients',
    startDate: '2023-01-15',
    endDate: '2023-12-31',
    status: 'Active',
    progress: 65,
    owner: 'Sarah Johnson',
    team: ['Marketing', 'Digital', 'IT'],
    budget: 850000,
    priority: 'High',
    category: 'Digital Transformation',
    metrics: [
      { name: 'Portfolio Digital Adoption', target: '+40%', current: '+22%', trend: 'up' },
      { name: 'Client Satisfaction', target: '4.8/5', current: '4.3/5', trend: 'up' },
      { name: 'New AUM Acquired', target: '$500M', current: '$325M', trend: 'up' },
    ]
  },
  {
    id: 2,
    name: 'Retirement Planning Advisory Expansion',
    description: 'Strategy to grow retirement planning advisory services and client base',
    startDate: '2023-02-01',
    endDate: '2023-06-30',
    status: 'Active',
    progress: 40,
    owner: 'Michael Chen',
    team: ['Investment', 'Marketing', 'Product'],
    budget: 650000,
    priority: 'Medium',
    category: 'Customer Acquisition',
    metrics: [
      { name: 'New Advisory Packages', target: '5', current: '2', trend: 'up' },
      { name: 'Retirement AUM', target: '+$350M', current: '+$140M', trend: 'up' },
      { name: 'Pre-Retirement Clients', target: '12,000', current: '5,400', trend: 'up' },
    ]
  },
  {
    id: 3,
    name: 'Personalized Wealth Dashboard',
    description: 'Launch of personalized wealth management dashboard with AI insights',
    startDate: '2023-03-10',
    endDate: '2023-08-15',
    status: 'Planning',
    progress: 15,
    owner: 'Emily Wong',
    team: ['UX/UI', 'Mobile', 'IT'],
    budget: 750000,
    priority: 'High',
    category: 'Technology Innovation',
    metrics: [
      { name: 'Portfolio Insight Adoption', target: '60%', current: '0%', trend: 'neutral' },
      { name: 'Financial Planning Actions', target: '+45%', current: '0%', trend: 'neutral' },
      { name: 'Cross-Asset Class Views', target: '+35%', current: '0%', trend: 'neutral' },
    ]
  },
  {
    id: 4,
    name: 'Premier Client Benefits Program',
    description: 'Strategy to enhance benefits and experiences for high-value banking clients',
    startDate: '2023-04-01',
    endDate: '2023-09-30',
    status: 'Draft',
    progress: 5,
    owner: 'David Turner',
    team: ['Marketing', 'Customer Experience'],
    budget: 450000,
    priority: 'Medium',
    category: 'Customer Retention',
    metrics: [
      { name: 'Premier Client Retention', target: '+18%', current: '0%', trend: 'neutral' },
      { name: 'Share of Wallet', target: '+25%', current: '0%', trend: 'neutral' },
      { name: 'Net Promoter Score', target: '+22pts', current: '0pts', trend: 'neutral' },
    ]
  },
]

export default function StrategyPlanning() {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const {
    isOpen: isCreateOpen,
    onOpen: onCreateOpen,
    onClose: onCreateClose
  } = useDisclosure()

  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState('All')
  const [activeStrategy, setActiveStrategy] = useState<any>(null)
  const [strategies, setStrategies] = useState(MARKETING_STRATEGIES)

  // Form state for new strategy
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'Digital Transformation',
    priority: 'Medium',
    status: 'Draft',
    owner: '',
    estimatedBudget: 500000,
    estimatedDuration: 6,
    startDate: '',
    endDate: '',
    team: [] as string[],
    kpis: [
      { name: '', target: 0, unit: '%' },
      { name: '', target: 0, unit: '%' },
      { name: '', target: 0, unit: '%' }
    ]
  })

  const [formErrors, setFormErrors] = useState<Record<string, string>>({})
  const [isLoadingAI, setIsLoadingAI] = useState(false)
  const [aiSuggested, setAiSuggested] = useState(false)
  const [humanEdited, setHumanEdited] = useState(false)

  const cardBg = useColorModeValue('white', 'gray.800')
  const modalBg = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.700')
  const gradientBg = useColorModeValue(
    'linear(to-br, blue.50, purple.50, pink.50)',
    'linear(to-br, blue.900, purple.900, pink.900)'
  )
  const toast = useToast()

  const filteredStrategies = strategies.filter(strategy =>
    (filterStatus === 'All' || strategy.status === filterStatus) &&
    strategy.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleOpenDrawer = (strategy: any) => {
    setActiveStrategy(strategy)
    onOpen()
  }

  // Form handling functions
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
    const suggestion = AI_STRATEGY_SUGGESTIONS[formData.name as keyof typeof AI_STRATEGY_SUGGESTIONS] || {
      category: 'Digital Transformation',
      description: `AI-optimized strategy for ${formData.name} focusing on market growth and operational efficiency.`,
      priority: 'Medium',
      estimatedBudget: 600000,
      estimatedDuration: 8,
      team: ['Marketing', 'IT', 'Product'],
      kpis: [
        { name: 'Market Share Growth', target: 15, unit: '%' },
        { name: 'Customer Acquisition', target: 25, unit: '%' },
        { name: 'ROI Performance', target: 12, unit: '%' }
      ]
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
      description: "Intelligent strategy recommendations have been populated. Feel free to adjust as needed.",
      status: "success",
      duration: 3000,
      isClosable: true,
    })
  }

  const validateForm = () => {
    const errors: Record<string, string> = {}

    if (!formData.name.trim()) {
      errors.name = 'Strategy name is required'
    }

    if (formData.name.trim() && strategies.some(strategy =>
      strategy.name.toLowerCase() === formData.name.toLowerCase()
    )) {
      errors.name = 'Strategy name already exists'
    }

    if (!formData.description.trim()) {
      errors.description = 'Strategy description is required'
    }

    if (!formData.owner.trim()) {
      errors.owner = 'Strategy owner is required'
    }

    if (!formData.startDate) {
      errors.startDate = 'Start date is required'
    }

    if (!formData.endDate) {
      errors.endDate = 'End date is required'
    }

    if (formData.startDate && formData.endDate && new Date(formData.startDate) >= new Date(formData.endDate)) {
      errors.endDate = 'End date must be after start date'
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = () => {
    if (!validateForm()) return

    const newStrategy = {
      id: Math.max(...strategies.map(s => s.id)) + 1,
      name: formData.name.trim(),
      description: formData.description.trim(),
      startDate: formData.startDate,
      endDate: formData.endDate,
      status: formData.status,
      progress: 0,
      owner: formData.owner.trim(),
      team: formData.team,
      budget: formData.estimatedBudget,
      priority: formData.priority,
      category: formData.category,
      metrics: formData.kpis.filter(kpi => kpi.name.trim()).map(kpi => ({
        name: kpi.name,
        target: `${kpi.target}${kpi.unit}`,
        current: '0%',
        trend: 'neutral'
      }))
    }

    setStrategies([...strategies, newStrategy])
    onCreateClose()
    resetForm()

    toast({
      title: "Strategy Created",
      description: `${formData.name} has been successfully created.`,
      status: "success",
      duration: 3000,
      isClosable: true,
    })
  }

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      category: 'Digital Transformation',
      priority: 'Medium',
      status: 'Draft',
      owner: '',
      estimatedBudget: 500000,
      estimatedDuration: 6,
      startDate: '',
      endDate: '',
      team: [],
      kpis: [
        { name: '', target: 0, unit: '%' },
        { name: '', target: 0, unit: '%' },
        { name: '', target: 0, unit: '%' }
      ]
    })
    setFormErrors({})
    setAiSuggested(false)
    setHumanEdited(false)
  }

  const addTeamMember = (dept: string) => {
    if (!formData.team.includes(dept)) {
      handleInputChange('team', [...formData.team, dept])
    }
  }

  const removeTeamMember = (dept: string) => {
    handleInputChange('team', formData.team.filter(t => t !== dept))
  }

  const updateKPI = (index: number, field: string, value: any) => {
    const newKPIs = [...formData.kpis]
    newKPIs[index] = { ...newKPIs[index], [field]: value }
    handleInputChange('kpis', newKPIs)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'green'
      case 'Planning': return 'blue'
      case 'On Hold': return 'orange'
      case 'Completed': return 'gray'
      default: return 'gray'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'red'
      case 'Medium': return 'orange'
      case 'Low': return 'green'
      default: return 'gray'
    }
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return FiArrowUp
      case 'down': return FiArrowDown
      default: return FiTarget
    }
  }

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up': return 'green'
      case 'down': return 'red'
      default: return 'gray'
    }
  }

  return (
    <DashboardLayout>
      <Box mb={6}>
        <HStack spacing={4} align="center" mb={6}>
          <Icon as={FiTarget} boxSize={8} color="blue.500" />
          <Box>
            <Heading as="h1" size="xl" color="secondary.700">
              Marketing Strategy
            </Heading>
            <Text color="gray.600">
              Create and manage long-term financial marketing strategies
            </Text>
          </Box>
        </HStack>

        {/* Summary Cards */}
        <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6} mb={8}>
          <Card bg={cardBg}>
            <CardBody>
              <Stat>
                <StatLabel color="gray.500">Active Strategies</StatLabel>
                <StatNumber>
                  {MARKETING_STRATEGIES.filter(s => s.status === 'Active').length}
                </StatNumber>
                <StatHelpText>
                  Total: {MARKETING_STRATEGIES.length}
                </StatHelpText>
              </Stat>
            </CardBody>
          </Card>
          <Card bg={cardBg}>
            <CardBody>
              <Stat>
                <StatLabel color="gray.500">Total Budget</StatLabel>
                <StatNumber>$3.5M</StatNumber>
                <StatHelpText>
                  <HStack>
                    <Icon as={FiDollarSign} color="green.500" />
                    <Text color="green.500">68% Allocated</Text>
                  </HStack>
                </StatHelpText>
              </Stat>
            </CardBody>
          </Card>
          <Card bg={cardBg}>
            <CardBody>
              <Stat>
                <StatLabel color="gray.500">Avg. Progress</StatLabel>
                <StatNumber>28%</StatNumber>
                <StatHelpText>
                  <HStack>
                    <Icon as={FiArrowUp} color="green.500" />
                    <Text color="green.500">+12% from last month</Text>
                  </HStack>
                </StatHelpText>
              </Stat>
            </CardBody>
          </Card>
          <Card bg={cardBg}>
            <CardBody>
              <Stat>
                <StatLabel color="gray.500">KPI Performance</StatLabel>
                <StatNumber>72%</StatNumber>
                <StatHelpText>
                  <HStack>
                    <Icon as={FiArrowUp} color="green.500" />
                    <Text color="green.500">On Track</Text>
                  </HStack>
                </StatHelpText>
              </Stat>
            </CardBody>
          </Card>
        </SimpleGrid>

        {/* Search and Filter */}
        <Flex gap={4} mb={6} wrap="wrap">
          <InputGroup maxW="320px">
            <InputLeftElement pointerEvents="none">
              <Icon as={FiSearch} color="gray.400" />
            </InputLeftElement>
            <Input
              placeholder="Search strategies..."
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
            <option value="Planning">Planning</option>
            <option value="On Hold">On Hold</option>
            <option value="Completed">Completed</option>
          </Select>
          <Button leftIcon={<Icon as={FiPlus} />} colorScheme="blue" onClick={onCreateOpen}>
            Create Strategy
          </Button>
        </Flex>

        {/* Strategy Cards */}
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
          {filteredStrategies.map((strategy) => (
            <Card
              key={strategy.id}
              bg={cardBg}
              borderWidth="1px"
              borderColor={borderColor}
              _hover={{
                transform: 'translateY(-2px)',
                boxShadow: 'lg',
              }}
              transition="all 0.2s"
            >
              <CardBody>
                <VStack align="start" spacing={4}>
                  <HStack width="full" justify="space-between">
                    <Badge colorScheme={getStatusColor(strategy.status)}>
                      {strategy.status}
                    </Badge>
                    <HStack>
                      <IconButton
                        icon={<Icon as={FiEdit} />}
                        aria-label="Edit"
                        size="sm"
                        variant="ghost"
                        onClick={() => handleOpenDrawer(strategy)}
                      />
                      <Menu>
                        <MenuButton
                          as={IconButton}
                          icon={<Icon as={FiMoreVertical} />}
                          variant="ghost"
                          size="sm"
                        />
                        <MenuList>
                          <MenuItem icon={<Icon as={FiBarChart2} />}>View Analytics</MenuItem>
                          <MenuItem icon={<Icon as={FiLink} />}>Related Campaigns</MenuItem>
                          <MenuItem icon={<Icon as={FiDownload} />}>Export Strategy</MenuItem>
                          <MenuItem icon={<Icon as={FiTrash2} />} color="red.500">
                            Delete Strategy
                          </MenuItem>
                        </MenuList>
                      </Menu>
                    </HStack>
                  </HStack>

                  <Heading size="md">{strategy.name}</Heading>
                  <Text color="gray.600">{strategy.description}</Text>

                  <HStack justify="space-between" width="full">
                    <Box>
                      <Text fontWeight="bold" fontSize="sm" color="gray.500">Budget</Text>
                      <HStack align="start" spacing={4} mb={2}>
                        <Text fontSize="sm" fontWeight="medium">Budget:</Text>
                        <Text fontSize="sm">${strategy.budget.toLocaleString()}</Text>
                      </HStack>
                    </Box>
                    <Box>
                      <Text fontWeight="bold" fontSize="sm" color="gray.500">Timeframe</Text>
                      <HStack align="start" spacing={4} mb={2}>
                        <Text fontSize="sm" fontWeight="medium">Timeframe:</Text>
                        <Text fontSize="sm">{`${strategy.startDate} - ${strategy.endDate}`}</Text>
                      </HStack>
                    </Box>
                    <Box>
                      <Text fontWeight="bold" fontSize="sm" color="gray.500">Priority</Text>
                      <Badge colorScheme={getPriorityColor(strategy.priority)}>
                        {strategy.priority}
                      </Badge>
                    </Box>
                  </HStack>

                  <Box width="full">
                    <HStack justify="space-between" mb={1}>
                      <Text fontWeight="bold" fontSize="sm">Progress</Text>
                      <Text fontWeight="bold" fontSize="sm">{strategy.progress}%</Text>
                    </HStack>
                    <Progress value={strategy.progress} colorScheme="blue" size="sm" borderRadius="full" />
                  </Box>

                  <Divider />

                  <Box width="full">
                    <Text fontWeight="bold" fontSize="sm" mb={2}>Key Performance Indicators</Text>
                    <VStack align="start" spacing={2}>
                      {strategy.metrics.map((kpi, index) => (
                        <HStack key={index} justify="space-between" width="full">
                          <Text fontSize="sm">{kpi.name}</Text>
                          <HStack>
                            <Text fontSize="sm">{kpi.current}</Text>
                            <Text fontSize="sm" color="gray.500">/ {kpi.target}</Text>
                            <Icon as={getTrendIcon(kpi.trend)} color={getTrendColor(kpi.trend)} />
                          </HStack>
                        </HStack>
                      ))}
                    </VStack>
                  </Box>

                  <HStack justify="space-between" width="full" fontSize="sm" color="gray.500">
                    <Text>Owner: {strategy.owner}</Text>
                    <HStack align="start" spacing={4} mb={2}>
                      <Text fontSize="sm" fontWeight="medium">Last Updated:</Text>
                      <Text fontSize="sm">{new Date().toISOString().split('T')[0]}</Text>
                    </HStack>
                  </HStack>

                  <Button
                    variant="outline"
                    colorScheme="blue"
                    size="sm"
                    width="full"
                    onClick={() => handleOpenDrawer(strategy)}
                  >
                    View Details
                  </Button>
                </VStack>
              </CardBody>
            </Card>
          ))}
        </SimpleGrid>
      </Box>

      {/* Strategy Details Drawer */}
      {activeStrategy && (
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
              <Badge colorScheme={getStatusColor(activeStrategy.status)} mb={2}>
                {activeStrategy.status}
              </Badge>
              <Heading size="md">{activeStrategy.name}</Heading>
            </DrawerHeader>

            <DrawerBody>
              <VStack spacing={6} align="start">
                <Box width="full">
                  <Text fontWeight="bold" mb={2}>Description</Text>
                  <Text color="gray.600">{activeStrategy.description}</Text>
                </Box>

                <SimpleGrid columns={2} width="full" spacing={4}>
                  <Box>
                    <Text fontWeight="bold" fontSize="sm" color="gray.500">Owner</Text>
                    <Text>{activeStrategy.owner}</Text>
                  </Box>
                  <Box>
                    <Text fontWeight="bold" fontSize="sm" color="gray.500">Budget</Text>
                    <Text>${activeStrategy.budget.toLocaleString()}</Text>
                  </Box>
                  <Box>
                    <Text fontWeight="bold" fontSize="sm" color="gray.500">Priority</Text>
                    <Badge colorScheme={getPriorityColor(activeStrategy.priority)}>
                      {activeStrategy.priority}
                    </Badge>
                  </Box>
                  <Box>
                    <Text fontWeight="bold" fontSize="sm" color="gray.500">Category</Text>
                    <Text>{activeStrategy.category}</Text>
                  </Box>
                  <Box>
                    <Text fontWeight="bold" fontSize="sm" color="gray.500">Timeline</Text>
                    <Text>{`${activeStrategy.startDate} - ${activeStrategy.endDate}`}</Text>
                  </Box>
                </SimpleGrid>

                <Box width="full">
                  <Text fontWeight="bold" fontSize="sm" mb={2}>Key Performance Indicators</Text>
                  <VStack align="start" spacing={2}>
                    {activeStrategy.metrics.map((kpi, index) => (
                      <HStack key={index} justify="space-between" width="full">
                        <Text fontSize="sm">{kpi.name}</Text>
                        <HStack>
                          <Text fontSize="sm">{kpi.current}</Text>
                          <Text fontSize="sm" color="gray.500">/ {kpi.target}</Text>
                          <Icon as={getTrendIcon(kpi.trend)} color={getTrendColor(kpi.trend)} />
                        </HStack>
                      </HStack>
                    ))}
                  </VStack>
                </Box>

                <HStack justify="space-between" width="full" fontSize="sm" color="gray.500">
                  <Text>Team: {activeStrategy.team.join(', ')}</Text>
                  <HStack align="start" spacing={4} mb={2}>
                    <Text fontSize="sm" fontWeight="medium">Last Updated:</Text>
                    <Text fontSize="sm">{new Date(activeStrategy.startDate).toLocaleDateString()}</Text>
                  </HStack>
                </HStack>

                <Button
                  variant="outline"
                  colorScheme="blue"
                  size="sm"
                  width="full"
                  onClick={() => handleOpenDrawer(activeStrategy)}
                >
                  View Details
                </Button>
              </VStack>
            </DrawerBody>
          </DrawerContent>
        </Drawer>
      )}

      {/* Create Strategy Modal */}
      <Modal isOpen={isCreateOpen} onClose={() => { onCreateClose(); resetForm() }} size="xl">
        <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(10px)" />
        <ModalContent
          maxW="800px"
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
                    Create New Strategy
                  </Heading>
                </HStack>
                <Text color="gray.600" fontSize="sm">
                  Design a comprehensive marketing strategy with AI-powered insights
                </Text>
              </VStack>
              <ModalCloseButton position="relative" top="auto" right="auto" />
            </HStack>
          </Box>

          <ModalBody p={0} maxH="70vh" overflowY="auto">
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
                            : "Smart strategy defaults have been applied. Feel free to customize further."
                          }
                        </AlertDescription>
                      </Box>
                    </Alert>
                  </SlideFade>
                </Box>
              )}

              {/* Strategy Name with AI Trigger */}
              <Box p={6} pb={4}>
                <FormControl isRequired isInvalid={!!formErrors.name}>
                  <FormLabel fontSize="sm" fontWeight="semibold" mb={3}>
                    Strategy Name
                  </FormLabel>
                  <HStack spacing={3}>
                    <Input
                      placeholder="e.g. Digital Wealth Management Platform, AI-Powered Investment Advisory"
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
                      label="Get AI suggestions based on strategy name"
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

              {/* Basic Information */}
              <Box p={6} py={4}>
                <Text fontSize="md" fontWeight="semibold" mb={4} color="gray.700">
                  Basic Information
                </Text>
                <VStack spacing={4} align="stretch">
                  <FormControl isRequired isInvalid={!!formErrors.description}>
                    <FormLabel fontSize="sm" fontWeight="medium" mb={2}>
                      Strategy Description
                    </FormLabel>
                    <Textarea
                      placeholder="Describe the strategy objectives, target audience, and expected outcomes..."
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
                    {formErrors.description && (
                      <FormErrorMessage mt={1} fontSize="xs">
                        {formErrors.description}
                      </FormErrorMessage>
                    )}
                  </FormControl>

                  <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
                    <FormControl>
                      <FormLabel fontSize="sm" fontWeight="medium" mb={2}>
                        Category
                      </FormLabel>
                      <Select
                        value={formData.category}
                        onChange={(e) => handleInputChange('category', e.target.value)}
                        bg={useColorModeValue('gray.50', 'gray.700')}
                        borderRadius="md"
                        border="1px solid"
                        borderColor={useColorModeValue('gray.200', 'gray.600')}
                        _focus={{
                          borderColor: 'blue.500',
                          boxShadow: '0 0 0 1px rgba(66, 153, 225, 0.6)',
                        }}
                      >
                        {STRATEGY_CATEGORIES.map((category) => (
                          <option key={category} value={category}>
                            {category}
                          </option>
                        ))}
                      </Select>
                    </FormControl>

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
                        <option value="Draft">Draft</option>
                        <option value="Planning">Planning</option>
                        <option value="Active">Active</option>
                      </Select>
                    </FormControl>
                  </SimpleGrid>

                  <FormControl isRequired isInvalid={!!formErrors.owner}>
                    <FormLabel fontSize="sm" fontWeight="medium" mb={2}>
                      Strategy Owner
                    </FormLabel>
                    <Input
                      placeholder="e.g. Sarah Johnson, Head of Digital Marketing"
                      value={formData.owner}
                      onChange={(e) => handleInputChange('owner', e.target.value)}
                      bg={useColorModeValue('gray.50', 'gray.700')}
                      borderRadius="md"
                      border="1px solid"
                      borderColor={useColorModeValue('gray.200', 'gray.600')}
                      _focus={{
                        borderColor: 'blue.500',
                        boxShadow: '0 0 0 1px rgba(66, 153, 225, 0.6)',
                      }}
                    />
                    {formErrors.owner && (
                      <FormErrorMessage mt={1} fontSize="xs">
                        {formErrors.owner}
                      </FormErrorMessage>
                    )}
                  </FormControl>
                </VStack>
              </Box>

              {/* Timeline & Budget */}
              <Box p={6} py={4}>
                <Text fontSize="md" fontWeight="semibold" mb={4} color="gray.700">
                  Timeline & Budget
                </Text>
                <VStack spacing={4} align="stretch">
                  <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                    <FormControl isRequired isInvalid={!!formErrors.startDate}>
                      <FormLabel fontSize="sm" fontWeight="medium" mb={2}>
                        Start Date
                      </FormLabel>
                      <Input
                        type="date"
                        value={formData.startDate}
                        onChange={(e) => handleInputChange('startDate', e.target.value)}
                        bg={useColorModeValue('gray.50', 'gray.700')}
                        borderRadius="md"
                        border="1px solid"
                        borderColor={useColorModeValue('gray.200', 'gray.600')}
                        _focus={{
                          borderColor: 'blue.500',
                          boxShadow: '0 0 0 1px rgba(66, 153, 225, 0.6)',
                        }}
                      />
                      {formErrors.startDate && (
                        <FormErrorMessage mt={1} fontSize="xs">
                          {formErrors.startDate}
                        </FormErrorMessage>
                      )}
                    </FormControl>

                    <FormControl isRequired isInvalid={!!formErrors.endDate}>
                      <FormLabel fontSize="sm" fontWeight="medium" mb={2}>
                        End Date
                      </FormLabel>
                      <Input
                        type="date"
                        value={formData.endDate}
                        onChange={(e) => handleInputChange('endDate', e.target.value)}
                        bg={useColorModeValue('gray.50', 'gray.700')}
                        borderRadius="md"
                        border="1px solid"
                        borderColor={useColorModeValue('gray.200', 'gray.600')}
                        _focus={{
                          borderColor: 'blue.500',
                          boxShadow: '0 0 0 1px rgba(66, 153, 225, 0.6)',
                        }}
                      />
                      {formErrors.endDate && (
                        <FormErrorMessage mt={1} fontSize="xs">
                          {formErrors.endDate}
                        </FormErrorMessage>
                      )}
                    </FormControl>
                  </SimpleGrid>

                  <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                    <FormControl>
                      <FormLabel fontSize="sm" fontWeight="medium" mb={2}>
                        Estimated Budget ($)
                      </FormLabel>
                      <NumberInput
                        value={formData.estimatedBudget}
                        onChange={(valueString, valueNumber) =>
                          handleInputChange('estimatedBudget', valueNumber)
                        }
                        min={0}
                        step={10000}
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
                        Duration (Months)
                      </FormLabel>
                      <NumberInput
                        value={formData.estimatedDuration}
                        onChange={(valueString, valueNumber) =>
                          handleInputChange('estimatedDuration', valueNumber)
                        }
                        min={1}
                        max={24}
                        step={1}
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
                </VStack>
              </Box>

              {/* Team Assignment */}
              <Box p={6} py={4}>
                <Text fontSize="md" fontWeight="semibold" mb={4} color="gray.700">
                  Team Assignment
                </Text>
                <VStack spacing={3} align="stretch">
                  <FormControl>
                    <FormLabel fontSize="sm" fontWeight="medium" mb={2}>
                      Select Team Departments
                    </FormLabel>
                    <SimpleGrid columns={{ base: 2, md: 3 }} spacing={2}>
                      {TEAM_DEPARTMENTS.map((dept) => (
                        <Button
                          key={dept}
                          size="sm"
                          variant={formData.team.includes(dept) ? "solid" : "outline"}
                          colorScheme={formData.team.includes(dept) ? "blue" : "gray"}
                          onClick={() =>
                            formData.team.includes(dept)
                              ? removeTeamMember(dept)
                              : addTeamMember(dept)
                          }
                          borderRadius="md"
                        >
                          {dept}
                        </Button>
                      ))}
                    </SimpleGrid>
                  </FormControl>

                  {formData.team.length > 0 && (
                    <Box>
                      <Text fontSize="sm" fontWeight="medium" mb={2}>Selected Teams:</Text>
                      <Stack direction="row" wrap="wrap" spacing={2}>
                        {formData.team.map((dept) => (
                          <Tag key={dept} size="md" colorScheme="blue" borderRadius="md">
                            <TagLabel>{dept}</TagLabel>
                            <TagCloseButton onClick={() => removeTeamMember(dept)} />
                          </Tag>
                        ))}
                      </Stack>
                    </Box>
                  )}
                </VStack>
              </Box>

              {/* KPIs & Metrics */}
              <Box p={6} py={4}>
                <HStack justify="space-between" align="center" mb={4}>
                  <Text fontSize="md" fontWeight="semibold" color="gray.700">
                    Key Performance Indicators
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

                <VStack spacing={4} align="stretch">
                  {formData.kpis.map((kpi, index) => (
                    <Card key={index} variant="outline" borderRadius="md">
                      <CardBody>
                        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={3}>
                          <FormControl>
                            <FormLabel fontSize="xs" fontWeight="medium">
                              KPI Name
                            </FormLabel>
                            <Input
                              placeholder="e.g. Customer Acquisition Rate"
                              value={kpi.name}
                              onChange={(e) => updateKPI(index, 'name', e.target.value)}
                              size="sm"
                              bg={useColorModeValue('gray.50', 'gray.600')}
                              borderRadius="md"
                            />
                          </FormControl>

                          <FormControl>
                            <FormLabel fontSize="xs" fontWeight="medium">
                              Target Value
                            </FormLabel>
                            <NumberInput
                              value={kpi.target}
                              onChange={(valueString, valueNumber) =>
                                updateKPI(index, 'target', valueNumber)
                              }
                              size="sm"
                            >
                              <NumberInputField
                                bg={useColorModeValue('gray.50', 'gray.600')}
                                borderRadius="md"
                              />
                              <NumberInputStepper>
                                <NumberIncrementStepper />
                                <NumberDecrementStepper />
                              </NumberInputStepper>
                            </NumberInput>
                          </FormControl>

                          <FormControl>
                            <FormLabel fontSize="xs" fontWeight="medium">
                              Unit
                            </FormLabel>
                            <Select
                              value={kpi.unit}
                              onChange={(e) => updateKPI(index, 'unit', e.target.value)}
                              size="sm"
                              bg={useColorModeValue('gray.50', 'gray.600')}
                              borderRadius="md"
                            >
                              <option value="%">%</option>
                              <option value="/5">/5</option>
                              <option value="pts">pts</option>
                              <option value="$">$</option>
                              <option value="units">units</option>
                            </Select>
                          </FormControl>
                        </SimpleGrid>
                      </CardBody>
                    </Card>
                  ))}
                </VStack>
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
                onClick={() => { onCreateClose(); resetForm() }}
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
                minW="160px"
              >
                Create Strategy
              </Button>
            </HStack>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </DashboardLayout>
  )
}