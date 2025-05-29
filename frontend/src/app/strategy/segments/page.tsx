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
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  FormControl,
  FormLabel,
  useDisclosure,
  Progress,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Divider,
  Textarea,
  Spinner,
  useToast,
  Switch,
  Editable,
  EditableInput,
  EditablePreview,
  Code,
  useClipboard,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Tooltip,
  RangeSlider,
  RangeSliderTrack,
  RangeSliderFilledTrack,
  RangeSliderThumb,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Checkbox,
  Radio,
  RadioGroup,
  Stack,
  FormErrorMessage,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  SlideFade,
  Tag,
  TagLabel,
  TagCloseButton,
} from '@chakra-ui/react'
import {
  FiUsers,
  FiSearch,
  FiFilter,
  FiPlus,
  FiEdit,
  FiTrash2,
  FiDownload,
  FiBarChart2,
  FiDollarSign,
  FiShoppingBag,
  FiClock,
  FiMoreVertical,
  FiLayers,
  FiActivity,
  FiSave,
  FiSend,
  FiTrendingUp,
  FiBriefcase,
  FiShield,
  FiZap,
  FiSmartphone,
  FiCode,
  FiCopy,
  FiChevronDown,
  FiChevronUp,
  FiCheck,
  FiX,
  FiRefreshCw,
  FiEye,
  FiTarget,
} from 'react-icons/fi'
import DashboardLayout from '../../../components/layout/DashboardLayout'
import { CreateSegmentModal, AISegmentModal } from '../../../components/segments/SegmentModals'

// Import from recharts with renamed Tooltip
import {
  ResponsiveContainer,
  BarChart as RechartsBarChart,
  Bar,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
} from 'recharts'

// Enhanced segment categories and criteria
const SEGMENT_CATEGORIES = [
  'Demographics',
  'Transaction Behavior',
  'Product Ownership',
  'Risk Assessment',
  'Engagement Level',
  'Lifecycle Stage',
  'Geographic',
  'Investment Profile',
  'Credit Behavior',
  'Digital Adoption',
]

// Industry criteria options
const INDUSTRY_CRITERIA = [
  'Account Balance Range',
  'Transaction Volume',
  'Product Usage',
  'Age Demographics',
  'Income Level',
  'Credit Score',
  'Investment Activity',
  'Digital Channel Usage',
  'Geographic Location',
  'Relationship Length',
]

// AI suggestions based on segment description
const AI_SEGMENT_SUGGESTIONS = {
  'High Value Premium Banking Clients': {
    category: 'Demographics',
    criteria: 'Account Balance Range',
    description: 'Premium clients with high-value accounts and investment portfolios seeking personalized banking services.',
    estimatedSize: 15000,
    priority: 'High',
    expectedEngagement: 'Very High',
    targetCriteria: {
      accountBalance: { min: 250000, max: 5000000 },
      ageRange: { min: 35, max: 65 },
      productOwnership: ['Investment Account', 'Premium Credit Card'],
      transactionVolume: 'High'
    }
  },
  'Digital-First Millennials': {
    category: 'Digital Adoption',
    criteria: 'Digital Channel Usage',
    description: 'Tech-savvy millennials who prefer digital banking channels and mobile-first financial services.',
    estimatedSize: 45000,
    priority: 'High',
    expectedEngagement: 'High',
    targetCriteria: {
      ageRange: { min: 25, max: 40 },
      digitalUsage: 'High',
      mobileTransactions: '90%+',
      productPreference: 'Digital Products'
    }
  },
  'Retirement Planning Focused': {
    category: 'Investment Profile',
    criteria: 'Investment Activity',
    description: 'Clients approaching or in retirement with focus on wealth preservation and income generation.',
    estimatedSize: 28000,
    priority: 'Medium',
    expectedEngagement: 'High',
    targetCriteria: {
      ageRange: { min: 50, max: 75 },
      investmentFocus: 'Conservative Growth',
      retirementAccounts: 'Active',
      advisoryServices: 'Interested'
    }
  },
  'Small Business Banking': {
    category: 'Product Ownership',
    criteria: 'Product Usage',
    description: 'Small business owners and entrepreneurs requiring business banking and lending solutions.',
    estimatedSize: 12000,
    priority: 'Medium',
    expectedEngagement: 'Medium',
    targetCriteria: {
      businessAccount: 'Active',
      lendingProducts: 'Interested',
      transactionVolume: 'Business Level',
      cashFlowPatterns: 'Business'
    }
  },
  'First-Time Home Buyers': {
    category: 'Lifecycle Stage',
    criteria: 'Age Demographics',
    description: 'Young professionals and families ready to purchase their first home with mortgage and savings needs.',
    estimatedSize: 35000,
    priority: 'High',
    expectedEngagement: 'High',
    targetCriteria: {
      ageRange: { min: 25, max: 40 },
      savingsGoal: 'Home Purchase',
      creditScore: 'Good to Excellent',
      mortgageInterest: 'High'
    }
  },
}

// Sample customer segments data
const CUSTOMER_SEGMENTS = [
  {
    id: 1,
    name: 'Premium Banking Clients',
    description: 'Clients with balances over $250K and active investment accounts',
    size: 23451,
    engagement: 'High',
    growth: '+12.5%',
    avgValue: '$4,850',
    lastUpdated: '2023-02-15',
    category: 'Demographics',
    priority: 'High',
  },
  {
    id: 2,
    name: 'Digital Banking Power Users',
    description: 'Clients who conduct 90%+ of transactions via mobile/web platforms',
    size: 78932,
    engagement: 'Medium',
    growth: '+8.3%',
    avgValue: '$780',
    lastUpdated: '2023-03-01',
    category: 'Digital Adoption',
    priority: 'High',
  },
  {
    id: 3,
    name: 'Wealth Management Portfolio',
    description: 'High-net-worth clients with managed investment portfolios > $1M',
    size: 4578,
    engagement: 'Very High',
    growth: '+5.7%',
    avgValue: '$15,750',
    lastUpdated: '2023-02-28',
    category: 'Investment Profile',
    priority: 'High',
  },
  {
    id: 4,
    name: 'New Client Onboarding',
    description: 'Clients who opened accounts or started investment relationships in the last 6 months',
    size: 15243,
    engagement: 'Low',
    growth: '+28.9%',
    avgValue: '$625',
    lastUpdated: '2023-03-05',
    category: 'Lifecycle Stage',
    priority: 'Medium',
  },
]

// Sample data for AI-generated segment analytics
const sampleAIChartData = {
  spendingByCategory: [
    { category: 'Travel', amount: 2450 },
    { category: 'Dining', amount: 1890 },
    { category: 'Retail', amount: 3200 },
    { category: 'Investment', amount: 5100 },
    { category: 'Services', amount: 980 },
  ],
  ageDistribution: [
    { age: '18-24', count: 420 },
    { age: '25-34', count: 1250 },
    { age: '35-44', count: 2100 },
    { age: '45-54', count: 1870 },
    { age: '55-64', count: 980 },
    { age: '65+', count: 580 },
  ],
  activityTrend: [
    { month: 'Jan', transactions: 1200 },
    { month: 'Feb', transactions: 1400 },
    { month: 'Mar', transactions: 1100 },
    { month: 'Apr', transactions: 1600 },
    { month: 'May', transactions: 1800 },
    { month: 'Jun', transactions: 2100 },
  ],
}

// First define control types for different rule attributes
const RULE_CONTROL_TYPES = {
  // Demographics
  'Income Bracket': {
    type: 'select',
    options: ['Low', 'Medium', 'High', 'Very High'],
    conditionType: 'categorical'
  },
  'Age Group': {
    type: 'range',
    min: 18,
    max: 80,
    step: 1,
    unit: 'years',
    conditionType: 'range'
  },

  // Transaction Behavior
  'Spending': {
    type: 'numberRange',
    min: 0,
    max: 100000,
    step: 100,
    unit: '$',
    conditionType: 'numeric'
  },
  'Transaction Type': {
    type: 'multiSelect',
    options: ['Debit', 'Credit', 'Transfer', 'Payment', 'Withdrawal', 'Deposit'],
    conditionType: 'categorical'
  },

  // Product Ownership
  'Product Type': {
    type: 'multiSelect',
    options: ['Credit Card', 'Checking Account', 'Savings Account', 'Mortgage', 'Personal Loan', 'Investment Account'],
    conditionType: 'categorical'
  },
  'Account Age': {
    type: 'range',
    min: 0,
    max: 240,
    step: 1,
    unit: 'months',
    conditionType: 'range'
  },

  // Risk Scores
  'Churn Risk': {
    type: 'range',
    min: 0,
    max: 100,
    step: 1,
    unit: '%',
    conditionType: 'range'
  },
  'Propensity Score': {
    type: 'range',
    min: 0,
    max: 100,
    step: 1,
    unit: '%',
    conditionType: 'range'
  },

  // Activity Patterns
  'Channel Usage': {
    type: 'multiSelect',
    options: ['Mobile App', 'Web Banking', 'Branch', 'ATM', 'Call Center', 'Email'],
    conditionType: 'categorical'
  },
  'Recent Activity': {
    type: 'dateRange',
    conditionType: 'time'
  },
}

// Update the structure of the segment rules
const generateSegmentRules = (description) => {
  // This would actually come from the AI in a real implementation
  // Return user-friendly rules structure instead of SQL
  return {
    demographics: [
      {
        attribute: 'Income Bracket',
        condition: 'is',
        value: 'High or Very High',
        valueType: 'categorical',
        rawValue: ['High', 'Very High']
      },
      {
        attribute: 'Age Group',
        condition: 'between',
        value: '25-40 years',
        valueType: 'range',
        rawValue: [25, 40]
      },
    ],
    transactionBehavior: [
      {
        attribute: 'Spending',
        condition: 'greater than',
        value: '$1,000 in last 3 months',
        valueType: 'numeric',
        rawValue: 1000
      },
      {
        attribute: 'Transaction Type',
        condition: 'includes',
        value: 'Debit transactions',
        valueType: 'categorical',
        rawValue: ['Debit']
      },
    ],
    productOwnership: [
      {
        attribute: 'Product Type',
        condition: 'includes',
        value: 'Credit Card',
        valueType: 'categorical',
        rawValue: ['Credit Card']
      },
      {
        attribute: 'Account Age',
        condition: 'at least',
        value: '6 months',
        valueType: 'numeric',
        rawValue: 6
      },
    ],
    riskScores: [
      {
        attribute: 'Churn Risk',
        condition: 'less than',
        value: '30%',
        valueType: 'percentage',
        rawValue: 30
      },
      {
        attribute: 'Propensity Score',
        condition: 'greater than',
        value: '70%',
        valueType: 'percentage',
        rawValue: 70
      },
    ],
    activityPatterns: [
      {
        attribute: 'Channel Usage',
        condition: 'active on',
        value: 'Mobile App, Web Banking',
        valueType: 'categorical',
        rawValue: ['Mobile App', 'Web Banking']
      },
      {
        attribute: 'Recent Activity',
        condition: 'within',
        value: 'Last month',
        valueType: 'time',
        rawValue: 30 // days
      },
    ],
    expectedResults: {
      count: Math.floor(Math.random() * 15000) + 5000,
      percentOfTotal: ((Math.random() * 15) + 5).toFixed(1) + '%'
    }
  }
}

// Add rule editing component to handle different value types
const RuleValueEditor = ({ rule, category, index, updateValue }) => {
  const controlType = RULE_CONTROL_TYPES[rule.attribute]?.type || 'text'
  const controlConfig = RULE_CONTROL_TYPES[rule.attribute] || {}

  const handleValueChange = (newValue) => {
    updateValue(category, index, 'rawValue', newValue)

    // Also update the displayed value based on the type
    let displayValue = ''

    switch (controlType) {
      case 'range':
        displayValue = `${newValue[0]}-${newValue[1]} ${controlConfig.unit || ''}`
        break
      case 'numberRange':
        displayValue = `${controlConfig.unit || ''}${newValue[0].toLocaleString()}-${controlConfig.unit || ''}${newValue[1].toLocaleString()}`
        break
      case 'select':
        displayValue = newValue
        break
      case 'multiSelect':
        displayValue = Array.isArray(newValue) ? newValue.join(', ') : newValue
        break
      case 'dateRange':
        displayValue = `Last ${newValue} days`
        break
      default:
        displayValue = newValue.toString()
    }

    updateValue(category, index, 'value', displayValue)
  }

  // Ensure all range slider values are arrays
  const ensureArrayValue = (val) => {
    if (!Array.isArray(val)) {
      const min = controlConfig.min || 0
      const max = controlConfig.max || 100
      return [min, max]
    }
    return val
  }

  switch (controlType) {
    case 'range':
      return (
        <Box w="100%">
          <HStack mb={2} justifyContent="space-between">
            <Text fontSize="xs">{ensureArrayValue(rule.rawValue)[0]}</Text>
            <Text fontSize="xs">{ensureArrayValue(rule.rawValue)[1]}</Text>
          </HStack>
          <RangeSlider
            min={controlConfig.min || 0}
            max={controlConfig.max || 100}
            step={controlConfig.step || 1}
            defaultValue={ensureArrayValue(rule.rawValue)}
            onChange={(val) => handleValueChange(val)}
            focusThumbOnChange={false}
          >
            <RangeSliderTrack>
              <RangeSliderFilledTrack bg="blue.500" />
            </RangeSliderTrack>
            <RangeSliderThumb index={0} />
            <RangeSliderThumb index={1} />
          </RangeSlider>
        </Box>
      )

    case 'numberRange':
      return (
        <HStack spacing={2}>
          <NumberInput
            size="sm"
            min={controlConfig.min || 0}
            max={controlConfig.max || 1000000}
            step={controlConfig.step || 100}
            defaultValue={Array.isArray(rule.rawValue) ? rule.rawValue[0] : controlConfig.min || 0}
            onChange={(valueString) => {
              const newVal = parseFloat(valueString)
              const currentVal = Array.isArray(rule.rawValue) ? [...rule.rawValue] : [0, 0]
              currentVal[0] = newVal
              handleValueChange(currentVal)
            }}
          >
            <NumberInputField />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
          <Text>to</Text>
          <NumberInput
            size="sm"
            min={controlConfig.min || 0}
            max={controlConfig.max || 1000000}
            step={controlConfig.step || 100}
            defaultValue={Array.isArray(rule.rawValue) ? rule.rawValue[1] : controlConfig.max || 1000}
            onChange={(valueString) => {
              const newVal = parseFloat(valueString)
              const currentVal = Array.isArray(rule.rawValue) ? [...rule.rawValue] : [0, 0]
              currentVal[1] = newVal
              handleValueChange(currentVal)
            }}
          >
            <NumberInputField />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
        </HStack>
      )

    case 'select':
      return (
        <Select
          size="sm"
          value={rule.rawValue}
          onChange={(e) => handleValueChange(e.target.value)}
          focusBorderColor="blue.400"
        >
          {controlConfig.options?.map((option) => (
            <option key={option} value={option}>{option}</option>
          ))}
        </Select>
      )

    case 'multiSelect':
      return (
        <Box>
          <Stack spacing={1}>
            {controlConfig.options?.map((option) => (
              <Checkbox
                key={option}
                size="sm"
                isChecked={Array.isArray(rule.rawValue) ? rule.rawValue.includes(option) : false}
                onChange={(e) => {
                  const isChecked = e.target.checked
                  let newValues = Array.isArray(rule.rawValue) ? [...rule.rawValue] : []
                  if (isChecked) {
                    newValues.push(option)
                  } else {
                    newValues = newValues.filter(val => val !== option)
                  }
                  handleValueChange(newValues)
                }}
              >
                {option}
              </Checkbox>
            ))}
          </Stack>
        </Box>
      )

    case 'dateRange':
      return (
        <RadioGroup
          onChange={(value) => handleValueChange(parseInt(value))}
          value={rule.rawValue?.toString() || "30"}
        >
          <Stack spacing={1} direction="column">
            <Radio value="7">Last 7 days</Radio>
            <Radio value="30">Last 30 days</Radio>
            <Radio value="90">Last 90 days</Radio>
            <Radio value="180">Last 6 months</Radio>
            <Radio value="365">Last year</Radio>
          </Stack>
        </RadioGroup>
      )

    default:
      return (
        <Input
          size="sm"
          value={rule.rawValue || rule.value}
          onChange={(e) => handleValueChange(e.target.value)}
          focusBorderColor="blue.400"
        />
      )
  }
}

export default function CustomerSegments() {
  const toast = useToast()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const {
    isOpen: isAIModalOpen,
    onOpen: onAIModalOpen,
    onClose: onAIModalClose
  } = useDisclosure()
  const [searchQuery, setSearchQuery] = useState('')
  const [filterEngagement, setFilterEngagement] = useState('All')
  const [segments, setSegments] = useState(CUSTOMER_SEGMENTS)

  // Enhanced form state for segment creation
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'Demographics',
    criteria: 'Account Balance Range',
    priority: 'Medium',
    expectedEngagement: 'Medium',
    estimatedSize: 10000,
    targetValue: 1000,
    ageRangeMin: 25,
    ageRangeMax: 65,
    balanceMin: 1000,
    balanceMax: 100000,
    digitalUsage: 'Medium',
    riskTolerance: 'Medium',
    productTypes: [] as string[],
    geographicRegions: [] as string[],
  })

  const [formErrors, setFormErrors] = useState<Record<string, string>>({})

  // AI segment states
  const [aiPrompt, setAIPrompt] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [aiSegmentResult, setAISegmentResult] = useState<any>(null)
  const [showAIResults, setShowAIResults] = useState(false)
  const [isLoadingAI, setIsLoadingAI] = useState(false)
  const [aiSuggested, setAiSuggested] = useState(false)
  const [humanEdited, setHumanEdited] = useState(false)

  // Add state for inline display option
  const [showInlineSaved, setShowInlineSaved] = useState(false)
  const [savedSegments, setSavedSegments] = useState<any[]>([])

  const [showRules, setShowRules] = useState(false)
  const [segmentRules, setSegmentRules] = useState<any>(null)
  const { hasCopied, onCopy } = useClipboard('')

  const [editingRuleCategory, setEditingRuleCategory] = useState<string | null>(null)
  const [editedRules, setEditedRules] = useState<any>(null)

  const cardBg = useColorModeValue('white', 'gray.800')
  const modalBg = useColorModeValue('white', 'gray.800')
  const gradientBg = useColorModeValue(
    'linear(to-br, blue.50, purple.50, pink.50)',
    'linear(to-br, blue.900, purple.900, pink.900)'
  )

  const segmentStats = [
    {
      title: 'Total Segments',
      value: segments.length,
      icon: FiLayers,
      color: 'blue',
    },
    {
      title: 'Total Customers',
      value: segments.reduce((sum, segment) => sum + segment.size, 0).toLocaleString(),
      icon: FiUsers,
      color: 'green',
    },
    {
      title: 'Avg. Client Value',
      value: '$975',
      icon: FiDollarSign,
      color: 'purple',
    },
    {
      title: 'Active Client Programs',
      value: '8',
      icon: FiActivity,
      color: 'orange',
    },
  ]

  const filteredSegments = segments.filter(segment =>
    (filterEngagement === 'All' || segment.engagement === filterEngagement) &&
    segment.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const getEngagementColor = (engagement: string) => {
    switch (engagement) {
      case 'High': return 'green'
      case 'Medium': return 'orange'
      case 'Low': return 'red'
      default: return 'gray'
    }
  }

  const getGrowthColor = (growth: string) => {
    const value = parseFloat(growth)
    return value > 0 ? 'green' : value < 0 ? 'red' : 'gray'
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
    const suggestion = AI_SEGMENT_SUGGESTIONS[formData.name as keyof typeof AI_SEGMENT_SUGGESTIONS] || {
      category: 'Demographics',
      criteria: 'Account Balance Range',
      description: `AI-optimized customer segment for ${formData.name} focusing on targeted engagement and value creation.`,
      priority: 'Medium',
      expectedEngagement: 'Medium',
      estimatedSize: Math.floor(Math.random() * 30000) + 10000,
      targetCriteria: {
        ageRange: { min: 25, max: 65 },
        balanceRange: { min: 5000, max: 100000 },
        engagement: 'Active',
        digitalAdoption: 'Medium'
      }
    }

    setFormData(prev => ({
      ...prev,
      category: suggestion.category,
      criteria: suggestion.criteria,
      description: suggestion.description,
      priority: suggestion.priority,
      expectedEngagement: suggestion.expectedEngagement,
      estimatedSize: suggestion.estimatedSize,
    }))

    setIsLoadingAI(false)
    setAiSuggested(true)
    setHumanEdited(false)

    toast({
      title: "AI Suggestions Applied",
      description: "Intelligent segment recommendations have been populated. Feel free to adjust as needed.",
      status: "success",
      duration: 3000,
      isClosable: true,
    })
  }

  const validateForm = () => {
    const errors: Record<string, string> = {}

    if (!formData.name.trim()) {
      errors.name = 'Segment name is required'
    }

    if (formData.name.trim() && segments.some(segment =>
      segment.name.toLowerCase() === formData.name.toLowerCase()
    )) {
      errors.name = 'Segment name already exists'
    }

    if (!formData.description.trim()) {
      errors.description = 'Segment description is required'
    }

    if (formData.estimatedSize < 100) {
      errors.estimatedSize = 'Estimated size must be at least 100'
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = () => {
    if (!validateForm()) return

    const newSegment = {
      id: Math.max(...segments.map(s => s.id)) + 1,
      name: formData.name.trim(),
      description: formData.description.trim(),
      size: formData.estimatedSize,
      engagement: formData.expectedEngagement,
      growth: '+0%',
      avgValue: `$${Math.floor(Math.random() * 2000) + 500}`,
      lastUpdated: new Date().toISOString().split('T')[0],
      category: formData.category,
      priority: formData.priority,
    }

    setSegments([...segments, newSegment])
    onClose()
    resetForm()

    toast({
      title: "Segment Created",
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
      category: 'Demographics',
      criteria: 'Account Balance Range',
      priority: 'Medium',
      expectedEngagement: 'Medium',
      estimatedSize: 10000,
      targetValue: 1000,
      ageRangeMin: 25,
      ageRangeMax: 65,
      balanceMin: 1000,
      balanceMax: 100000,
      digitalUsage: 'Medium',
      riskTolerance: 'Medium',
      productTypes: [],
      geographicRegions: [],
    })
    setFormErrors({})
    setAiSuggested(false)
    setHumanEdited(false)
  }

  const addProductType = (product: string) => {
    if (!formData.productTypes.includes(product)) {
      handleInputChange('productTypes', [...formData.productTypes, product])
    }
  }

  const removeProductType = (product: string) => {
    handleInputChange('productTypes', formData.productTypes.filter(p => p !== product))
  }

  // Process AI segment generation (mock for demo)
  const processAISegment = () => {
    if (!aiPrompt.trim()) {
      toast({
        title: "Prompt required",
        description: "Please enter a description for the segment you want to generate.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      })
      return
    }

    setIsProcessing(true)

    // Simulate API call with a timeout
    setTimeout(() => {
      // Generate user-friendly rules based on the prompt
      const rules = generateSegmentRules(aiPrompt)
      setSegmentRules(rules)

      // Sample AI response based on the prompt
      const sampleSegmentResult = {
        name: `AI Generated: ${aiPrompt.slice(0, 30)}${aiPrompt.length > 30 ? '...' : ''}`,
        description: aiPrompt,
        customerCount: 12458,
        uniqueUsers: 11893,
        avgSpend: '$1,245',
        responsePropensity: '68%',
        digitalEngagement: '76%',
        retentionRate: '92%',
        riskScore: 'Low',
        chartData: sampleAIChartData,
      }

      setAISegmentResult(sampleSegmentResult)
      setShowAIResults(true)
      setIsProcessing(false)
    }, 2000)
  }

  // Helper function to get icon for rule category
  const getCategoryIcon = (category) => {
    switch (category) {
      case 'demographics':
        return FiUsers
      case 'transactionBehavior':
        return FiBarChart2
      case 'productOwnership':
        return FiBriefcase
      case 'riskScores':
        return FiShield
      case 'activityPatterns':
        return FiSmartphone
      default:
        return FiFilter
    }
  }

  // Helper function to get category display name
  const getCategoryName = (category) => {
    switch (category) {
      case 'demographics':
        return 'Demographics'
      case 'transactionBehavior':
        return 'Transaction Behavior'
      case 'productOwnership':
        return 'Product Ownership'
      case 'riskScores':
        return 'Risk Scores'
      case 'activityPatterns':
        return 'Activity Patterns'
      default:
        return category
    }
  }

  const saveAISegment = () => {
    // Add saved segment to local storage
    const newSegment = {
      ...aiSegmentResult,
      id: Date.now(),
    }

    // Update the customer segments state if inline display is selected
    if (showInlineSaved) {
      setSavedSegments([...savedSegments, newSegment])
    }

    toast({
      title: "Segment saved",
      description: "AI generated segment has been saved successfully.",
      status: "success",
      duration: 3000,
      isClosable: true,
    })

    // Close modal after saving
    onAIModalClose()
    setShowAIResults(false)
    setAIPrompt('')
    setAISegmentResult(null)
  }

  // Helper function to toggle rule editing mode
  const toggleRuleEditing = (category: string | null) => {
    if (category === editingRuleCategory) {
      setEditingRuleCategory(null)
    } else {
      setEditingRuleCategory(category)
      if (category) {
        // Clone the current rules for editing
        setEditedRules({ ...segmentRules })
      }
    }
  }

  // Helper function to update a rule value
  const updateRuleValue = (category, index, field, value) => {
    const updatedRules = { ...editedRules }
    updatedRules[category][index][field] = value

    // If we're updating the attribute, automatically set the valueType and condition
    if (field === 'attribute') {
      const controlType = RULE_CONTROL_TYPES[value]
      if (controlType) {
        updatedRules[category][index].valueType = controlType.conditionType

        // Set default condition based on type
        switch (controlType.conditionType) {
          case 'categorical':
            updatedRules[category][index].condition = 'is'
            break
          case 'range':
            updatedRules[category][index].condition = 'between'
            break
          case 'numeric':
          case 'percentage':
            updatedRules[category][index].condition = 'greater than'
            break
          case 'time':
            updatedRules[category][index].condition = 'within'
            break
        }

        // Set default raw value
        switch (controlType.type) {
          case 'range':
            updatedRules[category][index].rawValue = [controlType.min || 0, controlType.max || 100]
            updatedRules[category][index].value = `${controlType.min || 0}-${controlType.max || 100} ${controlType.unit || ''}`
            break
          case 'select':
            updatedRules[category][index].rawValue = controlType.options?.[0] || ''
            updatedRules[category][index].value = controlType.options?.[0] || ''
            break
          case 'multiSelect':
            // Fix the expression that was always truthy
            updatedRules[category][index].rawValue = controlType.options?.length ? [controlType.options[0]] : []
            updatedRules[category][index].value = controlType.options?.[0] || ''
            break
          case 'dateRange':
            updatedRules[category][index].rawValue = 30 // Default to 30 days
            updatedRules[category][index].value = 'Last 30 days'
            break
          default:
            updatedRules[category][index].rawValue = ''
            updatedRules[category][index].value = ''
        }
      }
    }

    setEditedRules(updatedRules)
  }

  // Helper function to save rule changes
  const saveRuleChanges = () => {
    setSegmentRules(editedRules)
    setEditingRuleCategory(null)

    toast({
      title: "Rules updated",
      description: "Segment rules have been updated successfully.",
      status: "success",
      duration: 2000,
      isClosable: true,
    })
  }

  // Helper function to cancel rule editing
  const cancelRuleEditing = () => {
    setEditingRuleCategory(null)
    setEditedRules(null)
  }

  return (
    <DashboardLayout>
      <Box mb={6}>
        <HStack spacing={4} align="center" mb={6}>
          <Icon as={FiUsers} boxSize={8} color="blue.500" />
          <Box>
            <Heading as="h1" size="xl" color="secondary.700">
              Client Segments
            </Heading>
            <Text color="gray.600">
              Define and manage client segments for targeted financial marketing
            </Text>
          </Box>
        </HStack>

        {/* Segment Statistics */}
        <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6} mb={8}>
          {segmentStats.map((stat) => (
            <Card key={stat.title} bg={cardBg}>
              <CardBody>
                <Stat>
                  <Flex justify="space-between">
                    <Box>
                      <StatLabel color="gray.500">{stat.title}</StatLabel>
                      <StatNumber fontSize="2xl">{stat.value}</StatNumber>
                    </Box>
                    <Box p={2} bg={`${stat.color}.50`} borderRadius="full" color={`${stat.color}.500`}>
                      <Icon as={stat.icon} boxSize={6} />
                    </Box>
                  </Flex>
                </Stat>
              </CardBody>
            </Card>
          ))}
        </SimpleGrid>

        {/* Search and Filter */}
        <Flex gap={4} mb={6} wrap="wrap">
          <InputGroup maxW="320px">
            <InputLeftElement pointerEvents="none">
              <Icon as={FiSearch} color="gray.400" />
            </InputLeftElement>
            <Input
              placeholder="Search segments..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </InputGroup>
          <Select
            maxW="200px"
            value={filterEngagement}
            onChange={(e) => setFilterEngagement(e.target.value)}
          >
            <option value="All">All Engagement</option>
            <option value="High">High Engagement</option>
            <option value="Medium">Medium Engagement</option>
            <option value="Low">Low Engagement</option>
          </Select>
          <Button leftIcon={<Icon as={FiPlus} />} colorScheme="blue" onClick={onOpen}>
            Create Segment
          </Button>
          <Button leftIcon={<Icon as={FiZap} />} colorScheme="purple" onClick={onAIModalOpen}>
            AI Driver Customer Segment
          </Button>
        </Flex>

        {/* Segments Table */}
        <Card bg={cardBg}>
          <CardBody>
            <Box overflowX="auto">
              <Table variant="simple">
                <Thead>
                  <Tr>
                    <Th>Segment Name</Th>
                    <Th>Size</Th>
                    <Th>Engagement</Th>
                    <Th>Growth</Th>
                    <Th>Avg. Value</Th>
                    <Th>Last Updated</Th>
                    <Th>Actions</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {filteredSegments.map((segment) => (
                    <Tr key={segment.id}>
                      <Td>
                        <VStack align="start" spacing={1}>
                          <Text fontWeight="medium">{segment.name}</Text>
                          <Text fontSize="sm" color="gray.600" noOfLines={1}>
                            {segment.description}
                          </Text>
                        </VStack>
                      </Td>
                      <Td>{segment.size.toLocaleString()}</Td>
                      <Td>
                        <Badge colorScheme={getEngagementColor(segment.engagement)}>
                          {segment.engagement}
                        </Badge>
                      </Td>
                      <Td>
                        <Text color={getGrowthColor(segment.growth)}>
                          {segment.growth}
                        </Text>
                      </Td>
                      <Td>{segment.avgValue}</Td>
                      <Td>{segment.lastUpdated}</Td>
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
                              <MenuItem icon={<Icon as={FiBarChart2} />}>View Analytics</MenuItem>
                              <MenuItem icon={<Icon as={FiDownload} />}>Export Data</MenuItem>
                              <MenuItem icon={<Icon as={FiTrash2} />} color="red.500">
                                Delete Segment
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

        {/* Display saved AI segment inline if the option is enabled */}
        {showInlineSaved && savedSegments.length > 0 && (
          <Box mt={6}>
            <Heading size="md" mb={4}>AI Generated Segments</Heading>
            {savedSegments.map((segment) => (
              <Card key={segment.id} mb={6}>
                <CardBody>
                  <VStack spacing={6} align="stretch">
                    <Box p={4} borderWidth="1px" borderRadius="md" bg="white">
                      <Heading size="md" mb={2} color="blue.700">
                        {segment.name}
                      </Heading>
                      <Text color="gray.600" mt={1}>{segment.description}</Text>
                    </Box>

                    {/* Key metrics */}
                    <SimpleGrid columns={{ base: 2, md: 4 }} spacing={4}>
                      <Card>
                        <CardBody>
                          <Stat>
                            <StatLabel>Customer Count</StatLabel>
                            <StatNumber>{segment.customerCount.toLocaleString()}</StatNumber>
                          </Stat>
                        </CardBody>
                      </Card>
                      <Card>
                        <CardBody>
                          <Stat>
                            <StatLabel>Unique Users</StatLabel>
                            <StatNumber>{segment.uniqueUsers.toLocaleString()}</StatNumber>
                          </Stat>
                        </CardBody>
                      </Card>
                      <Card>
                        <CardBody>
                          <Stat>
                            <StatLabel>Average Spend</StatLabel>
                            <StatNumber>{segment.avgSpend}</StatNumber>
                          </Stat>
                        </CardBody>
                      </Card>
                      <Card>
                        <CardBody>
                          <Stat>
                            <StatLabel>Response Propensity</StatLabel>
                            <StatNumber>{segment.responsePropensity}</StatNumber>
                          </Stat>
                        </CardBody>
                      </Card>
                    </SimpleGrid>

                    {/* Charts section */}
                    <Heading size="md" mt={2}>Key Insights</Heading>
                    <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
                      {/* Spending by Category Chart */}
                      <Card>
                        <CardBody>
                          <Heading size="sm" mb={4}>Spending by Category</Heading>
                          <Box h="200px">
                            <ResponsiveContainer width="100%" height="100%">
                              <RechartsBarChart
                                data={segment.chartData.spendingByCategory}
                                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                              >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="category" />
                                <YAxis />
                                <RechartsTooltip />
                                <Bar dataKey="amount" fill="#8884d8" />
                              </RechartsBarChart>
                            </ResponsiveContainer>
                          </Box>
                        </CardBody>
                      </Card>

                      {/* Age Distribution Chart */}
                      <Card>
                        <CardBody>
                          <Heading size="sm" mb={4}>Age Distribution</Heading>
                          <Box h="200px">
                            <ResponsiveContainer width="100%" height="100%">
                              <RechartsPieChart>
                                <Pie
                                  data={segment.chartData.ageDistribution}
                                  cx="50%"
                                  cy="50%"
                                  labelLine={false}
                                  outerRadius={80}
                                  fill="#8884d8"
                                  dataKey="count"
                                  nameKey="age"
                                  label={({ age }) => age}
                                >
                                  {segment.chartData.ageDistribution.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={[
                                      '#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#a442f5', '#f542f2'
                                    ][index % 6]} />
                                  ))}
                                </Pie>
                                <RechartsTooltip />
                              </RechartsPieChart>
                            </ResponsiveContainer>
                          </Box>
                        </CardBody>
                      </Card>

                      {/* Activity Trend Chart */}
                      <Card>
                        <CardBody>
                          <Heading size="sm" mb={4}>Activity Trend</Heading>
                          <Box h="200px">
                            <ResponsiveContainer width="100%" height="100%">
                              <RechartsLineChart
                                data={segment.chartData.activityTrend}
                                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                              >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="month" />
                                <YAxis />
                                <RechartsTooltip />
                                <Legend />
                                <Line type="monotone" dataKey="transactions" stroke="#8884d8" activeDot={{ r: 8 }} />
                              </RechartsLineChart>
                            </ResponsiveContainer>
                          </Box>
                        </CardBody>
                      </Card>
                    </SimpleGrid>
                  </VStack>
                </CardBody>
              </Card>
            ))}
          </Box>
        )}
      </Box>

      {/* Reusable Customer Segment Modals */}
      <CreateSegmentModal
        isOpen={isOpen}
        onClose={() => { onClose() }}
        onSave={(segment) => {
          // Add the new segment to the existing segments
          setSegments([...segments, segment])
        }}
      />

      <AISegmentModal
        isOpen={isAIModalOpen}
        onClose={() => { onAIModalClose() }}
        onSave={(segment) => {
          // Add the AI generated segment to the existing segments
          setSegments([...segments, segment])
        }}
      />
    </DashboardLayout>
  )
} 