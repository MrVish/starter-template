'use client'

import React, { useState } from 'react'
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    ModalFooter,
    VStack,
    HStack,
    Text,
    Button,
    Icon,
    FormControl,
    FormLabel,
    Select,
    Textarea,
    Box,
    FormErrorMessage,
    Spinner,
    useColorModeValue,
    useToast,
    NumberInput,
    NumberInputField,
    NumberInputStepper,
    NumberIncrementStepper,
    NumberDecrementStepper,
    SimpleGrid,
    Input,
    Badge,
    Alert,
    AlertIcon,
    AlertTitle,
    AlertDescription,
    SlideFade,
    Tooltip,
    Tag,
    TagLabel,
    TagCloseButton,
    Stack,
    Card,
    CardBody,
    Heading,
    Accordion,
    AccordionItem,
    AccordionButton,
    AccordionPanel,
    AccordionIcon,
    Code,
    useClipboard,
    Checkbox,
    Radio,
    RadioGroup,
    RangeSlider,
    RangeSliderTrack,
    RangeSliderFilledTrack,
    RangeSliderThumb,
    Stat,
    StatLabel,
    StatNumber,
    Divider,
} from '@chakra-ui/react'
import {
    FiZap,
    FiPlus,
    FiSave,
    FiUsers,
    FiBarChart2,
    FiBriefcase,
    FiShield,
    FiSmartphone,
    FiFilter,
    FiEdit,
    FiCheck,
    FiX,
    FiCode,
    FiCopy,
    FiRefreshCw,
    FiEye,
    FiTarget,
    FiTrendingUp,
} from 'react-icons/fi'

// Import recharts components
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
    },
    'Digital-First Millennials': {
        category: 'Digital Adoption',
        criteria: 'Digital Channel Usage',
        description: 'Tech-savvy millennials who prefer digital banking channels and mobile-first financial services.',
        estimatedSize: 45000,
        priority: 'High',
        expectedEngagement: 'High',
    },
    'Retirement Planning Focused': {
        category: 'Investment Profile',
        criteria: 'Investment Activity',
        description: 'Clients approaching or in retirement with focus on wealth preservation and income generation.',
        estimatedSize: 28000,
        priority: 'Medium',
        expectedEngagement: 'High',
    },
    'Small Business Banking': {
        category: 'Product Ownership',
        criteria: 'Product Usage',
        description: 'Small business owners and entrepreneurs requiring business banking and lending solutions.',
        estimatedSize: 12000,
        priority: 'Medium',
        expectedEngagement: 'Medium',
    },
    'First-Time Home Buyers': {
        category: 'Lifecycle Stage',
        criteria: 'Age Demographics',
        description: 'Young professionals and families ready to purchase their first home with mortgage and savings needs.',
        estimatedSize: 35000,
        priority: 'High',
        expectedEngagement: 'High',
    },
}

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

// Rule control types for different rule attributes
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

interface CreateSegmentModalProps {
    isOpen: boolean
    onClose: () => void
    onSave?: (segment: any) => void
}

interface AISegmentModalProps {
    isOpen: boolean
    onClose: () => void
    onSave?: (segment: any) => void
}

export const CreateSegmentModal: React.FC<CreateSegmentModalProps> = ({ isOpen, onClose, onSave }) => {
    const toast = useToast()
    const modalBg = useColorModeValue('white', 'gray.800')
    const gradientBg = useColorModeValue(
        'linear(to-br, blue.50, purple.50, pink.50)',
        'linear(to-br, blue.900, purple.900, pink.900)'
    )

    // Enhanced form state for segment creation
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        category: 'Demographics',
        criteria: 'Account Balance Range',
        priority: 'Medium',
        expectedEngagement: 'Medium',
        estimatedSize: 10000,
        ageRangeMin: 25,
        ageRangeMax: 65,
        balanceMin: 1000,
        balanceMax: 100000,
        digitalUsage: 'Medium',
        riskTolerance: 'Medium',
        productTypes: [] as string[],
    })

    const [formErrors, setFormErrors] = useState<Record<string, string>>({})
    const [isLoadingAI, setIsLoadingAI] = useState(false)
    const [aiSuggested, setAiSuggested] = useState(false)
    const [humanEdited, setHumanEdited] = useState(false)

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
            id: Math.max(1) + 1,
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

        if (onSave) {
            onSave(newSegment)
        }

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
            ageRangeMin: 25,
            ageRangeMax: 65,
            balanceMin: 1000,
            balanceMax: 100000,
            digitalUsage: 'Medium',
            riskTolerance: 'Medium',
            productTypes: [],
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

    return (
        <Modal isOpen={isOpen} onClose={() => { onClose(); resetForm() }} size="xl">
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
                                <Icon as={FiPlus} color="blue.500" boxSize={6} />
                                <Heading size="lg" color="gray.800">
                                    Create Customer Segment
                                </Heading>
                            </HStack>
                            <Text color="gray.600" fontSize="sm">
                                Define targeted customer segments with AI-powered insights
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
                                                    : "Smart segment defaults have been applied. Feel free to customize further."
                                                }
                                            </AlertDescription>
                                        </Box>
                                    </Alert>
                                </SlideFade>
                            </Box>
                        )}

                        {/* Segment Name with AI Trigger */}
                        <Box p={6} pb={4}>
                            <FormControl isRequired isInvalid={!!formErrors.name}>
                                <FormLabel fontSize="sm" fontWeight="semibold" mb={3}>
                                    Segment Name
                                </FormLabel>
                                <HStack spacing={3}>
                                    <Input
                                        placeholder="e.g. High Value Premium Banking Clients, Digital-First Millennials"
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
                                        label="Get AI suggestions based on segment name"
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
                                        Description
                                    </FormLabel>
                                    <Textarea
                                        placeholder="Describe the target customer characteristics and behavior patterns..."
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
                                            {SEGMENT_CATEGORIES.map((category) => (
                                                <option key={category} value={category}>
                                                    {category}
                                                </option>
                                            ))}
                                        </Select>
                                    </FormControl>

                                    <FormControl>
                                        <FormLabel fontSize="sm" fontWeight="medium" mb={2}>
                                            Primary Criteria
                                        </FormLabel>
                                        <Select
                                            value={formData.criteria}
                                            onChange={(e) => handleInputChange('criteria', e.target.value)}
                                            bg={useColorModeValue('gray.50', 'gray.700')}
                                            borderRadius="md"
                                            border="1px solid"
                                            borderColor={useColorModeValue('gray.200', 'gray.600')}
                                            _focus={{
                                                borderColor: 'blue.500',
                                                boxShadow: '0 0 0 1px rgba(66, 153, 225, 0.6)',
                                            }}
                                        >
                                            {INDUSTRY_CRITERIA.map((criteria) => (
                                                <option key={criteria} value={criteria}>
                                                    {criteria}
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
                                </SimpleGrid>
                            </VStack>
                        </Box>

                        {/* Target Criteria */}
                        <Box p={6} py={4}>
                            <HStack justify="space-between" align="center" mb={4}>
                                <Text fontSize="md" fontWeight="semibold" color="gray.700">
                                    Target Criteria
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
                                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                                    <FormControl>
                                        <FormLabel fontSize="sm" fontWeight="medium" mb={2}>
                                            Expected Engagement
                                        </FormLabel>
                                        <Select
                                            value={formData.expectedEngagement}
                                            onChange={(e) => handleInputChange('expectedEngagement', e.target.value)}
                                            bg={useColorModeValue('gray.50', 'gray.700')}
                                            borderRadius="md"
                                            border="1px solid"
                                            borderColor={useColorModeValue('gray.200', 'gray.600')}
                                            _focus={{
                                                borderColor: 'blue.500',
                                                boxShadow: '0 0 0 1px rgba(66, 153, 225, 0.6)',
                                            }}
                                        >
                                            <option value="Very High">Very High</option>
                                            <option value="High">High</option>
                                            <option value="Medium">Medium</option>
                                            <option value="Low">Low</option>
                                        </Select>
                                    </FormControl>

                                    <FormControl isInvalid={!!formErrors.estimatedSize}>
                                        <FormLabel fontSize="sm" fontWeight="medium" mb={2}>
                                            Estimated Size
                                        </FormLabel>
                                        <NumberInput
                                            value={formData.estimatedSize}
                                            onChange={(valueString, valueNumber) =>
                                                handleInputChange('estimatedSize', valueNumber)
                                            }
                                            min={100}
                                            step={1000}
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
                                        {formErrors.estimatedSize && (
                                            <FormErrorMessage mt={1} fontSize="xs">
                                                {formErrors.estimatedSize}
                                            </FormErrorMessage>
                                        )}
                                    </FormControl>
                                </SimpleGrid>

                                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                                    <FormControl>
                                        <FormLabel fontSize="sm" fontWeight="medium" mb={2}>
                                            Age Range
                                        </FormLabel>
                                        <HStack>
                                            <NumberInput
                                                value={formData.ageRangeMin}
                                                onChange={(valueString, valueNumber) =>
                                                    handleInputChange('ageRangeMin', valueNumber)
                                                }
                                                min={18}
                                                max={80}
                                                size="sm"
                                            >
                                                <NumberInputField />
                                            </NumberInput>
                                            <Text>to</Text>
                                            <NumberInput
                                                value={formData.ageRangeMax}
                                                onChange={(valueString, valueNumber) =>
                                                    handleInputChange('ageRangeMax', valueNumber)
                                                }
                                                min={18}
                                                max={80}
                                                size="sm"
                                            >
                                                <NumberInputField />
                                            </NumberInput>
                                        </HStack>
                                    </FormControl>

                                    <FormControl>
                                        <FormLabel fontSize="sm" fontWeight="medium" mb={2}>
                                            Digital Usage Level
                                        </FormLabel>
                                        <Select
                                            value={formData.digitalUsage}
                                            onChange={(e) => handleInputChange('digitalUsage', e.target.value)}
                                            bg={useColorModeValue('gray.50', 'gray.700')}
                                            borderRadius="md"
                                            size="sm"
                                        >
                                            <option value="Very High">Very High (90%+)</option>
                                            <option value="High">High (70-89%)</option>
                                            <option value="Medium">Medium (50-69%)</option>
                                            <option value="Low">Low (Under 50%)</option>
                                        </Select>
                                    </FormControl>
                                </SimpleGrid>
                            </VStack>
                        </Box>

                        {/* Product Types */}
                        <Box p={6} py={4}>
                            <Text fontSize="md" fontWeight="semibold" mb={4} color="gray.700">
                                Product Preferences
                            </Text>
                            <VStack spacing={3} align="stretch">
                                <FormControl>
                                    <FormLabel fontSize="sm" fontWeight="medium" mb={2}>
                                        Target Product Types
                                    </FormLabel>
                                    <SimpleGrid columns={{ base: 2, md: 3 }} spacing={2}>
                                        {['Checking Account', 'Savings Account', 'Credit Card', 'Investment Account', 'Mortgage', 'Personal Loan'].map((product) => (
                                            <Button
                                                key={product}
                                                size="sm"
                                                variant={formData.productTypes.includes(product) ? "solid" : "outline"}
                                                colorScheme={formData.productTypes.includes(product) ? "blue" : "gray"}
                                                onClick={() =>
                                                    formData.productTypes.includes(product)
                                                        ? removeProductType(product)
                                                        : addProductType(product)
                                                }
                                                borderRadius="md"
                                            >
                                                {product}
                                            </Button>
                                        ))}
                                    </SimpleGrid>
                                </FormControl>

                                {formData.productTypes.length > 0 && (
                                    <Box>
                                        <Text fontSize="sm" fontWeight="medium" mb={2}>Selected Products:</Text>
                                        <Stack direction="row" wrap="wrap" spacing={2}>
                                            {formData.productTypes.map((product) => (
                                                <Tag key={product} size="md" colorScheme="blue" borderRadius="md">
                                                    <TagLabel>{product}</TagLabel>
                                                    <TagCloseButton onClick={() => removeProductType(product)} />
                                                </Tag>
                                            ))}
                                        </Stack>
                                    </Box>
                                )}
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
                            minW="160px"
                        >
                            Create Segment
                        </Button>
                    </HStack>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}

export const AISegmentModal: React.FC<AISegmentModalProps> = ({ isOpen, onClose, onSave }) => {
    const toast = useToast()
    const modalBg = useColorModeValue('white', 'gray.800')
    const gradientBg = useColorModeValue(
        'linear(to-br, blue.50, purple.50, pink.50)',
        'linear(to-br, blue.900, purple.900, pink.900)'
    )

    // Enhanced AI segment states
    const [aiPrompt, setAIPrompt] = useState('')
    const [isProcessing, setIsProcessing] = useState(false)
    const [showAIResults, setShowAIResults] = useState(false)
    const [aiSegmentResult, setAISegmentResult] = useState<any>(null)
    const [segmentRules, setSegmentRules] = useState<any>(null)
    const [showRules, setShowRules] = useState(false)
    const [editingRuleCategory, setEditingRuleCategory] = useState<string | null>(null)
    const [editedRules, setEditedRules] = useState<any>(null)

    const { hasCopied, onCopy } = useClipboard(JSON.stringify(segmentRules, null, 2))

    // Process AI segment generation with full analytics
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

        // Simulate API call with realistic processing time
        setTimeout(() => {
            // Generate comprehensive AI results
            const rules = generateSegmentRules(aiPrompt)
            setSegmentRules(rules)

            // Create detailed segment result with analytics
            const customerCount = Math.floor(Math.random() * 20000) + 5000
            const sampleSegmentResult = {
                name: `AI Generated: ${aiPrompt.slice(0, 30)}${aiPrompt.length > 30 ? '...' : ''}`,
                description: aiPrompt,
                customerCount,
                uniqueUsers: Math.floor(customerCount * 0.95),
                avgSpend: `$${Math.floor(Math.random() * 2000) + 800}`,
                responsePropensity: `${Math.floor(Math.random() * 30) + 60}%`,
                digitalEngagement: `${Math.floor(Math.random() * 25) + 65}%`,
                retentionRate: `${Math.floor(Math.random() * 15) + 85}%`,
                riskScore: ['Low', 'Medium', 'High'][Math.floor(Math.random() * 3)],
                lifetimeValue: `$${Math.floor(Math.random() * 5000) + 2000}`,
                acquisitionCost: `$${Math.floor(Math.random() * 200) + 50}`,
                conversionRate: `${(Math.random() * 10 + 5).toFixed(1)}%`,
                chartData: {
                    ...sampleAIChartData,
                    // Generate dynamic data based on prompt keywords
                    spendingByCategory: sampleAIChartData.spendingByCategory.map(item => ({
                        ...item,
                        amount: Math.floor(Math.random() * 3000) + 1000
                    })),
                    ageDistribution: sampleAIChartData.ageDistribution.map(item => ({
                        ...item,
                        count: Math.floor(Math.random() * 2000) + 500
                    })),
                    activityTrend: sampleAIChartData.activityTrend.map(item => ({
                        ...item,
                        transactions: Math.floor(Math.random() * 1000) + 1000
                    }))
                },
            }

            setAISegmentResult(sampleSegmentResult)
            setShowAIResults(true)
            setIsProcessing(false)
            setShowRules(true)

            toast({
                title: "🤖 AI Segment Generated!",
                description: "Your intelligent customer segment has been created with detailed analytics and targeting rules.",
                status: "success",
                duration: 4000,
                isClosable: true,
            })
        }, 2500) // Shorter processing time
    }

    // Rule editing functions
    const toggleRuleEditing = (category: string | null) => {
        if (category === editingRuleCategory) {
            setEditingRuleCategory(null)
        } else {
            setEditingRuleCategory(category)
            if (category && segmentRules) {
                setEditedRules({ ...segmentRules })
            }
        }
    }

    const updateRuleValue = (category, index, field, value) => {
        if (!editedRules) return

        const updatedRules = { ...editedRules }
        updatedRules[category][index][field] = value

        // Auto-update related fields when attribute changes
        if (field === 'attribute') {
            const controlType = RULE_CONTROL_TYPES[value]
            if (controlType) {
                updatedRules[category][index].valueType = controlType.conditionType

                // Set appropriate default condition
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

                // Set default values based on control type
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
                        updatedRules[category][index].rawValue = controlType.options?.length ? [controlType.options[0]] : []
                        updatedRules[category][index].value = controlType.options?.[0] || ''
                        break
                    case 'dateRange':
                        updatedRules[category][index].rawValue = 30
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

    const saveRuleChanges = () => {
        if (editedRules) {
            setSegmentRules(editedRules)
            setEditingRuleCategory(null)

            toast({
                title: "Rules updated",
                description: "Segment targeting rules have been updated successfully.",
                status: "success",
                duration: 2000,
                isClosable: true,
            })
        }
    }

    const cancelRuleEditing = () => {
        setEditingRuleCategory(null)
        setEditedRules(null)
    }

    const saveAISegment = () => {
        if (!aiSegmentResult) return

        const newSegment = {
            id: Date.now(),
            name: aiSegmentResult.name,
            description: aiSegmentResult.description,
            size: aiSegmentResult.customerCount,
            engagement: 'High',
            growth: '+15.2%',
            avgValue: aiSegmentResult.avgSpend,
            lastUpdated: new Date().toISOString().split('T')[0],
            category: 'AI Generated',
            priority: 'High',
            aiGenerated: true,
            rules: segmentRules,
            analytics: aiSegmentResult
        }

        if (onSave) {
            onSave(newSegment)
        }

        toast({
            title: "🎯 AI Segment Saved!",
            description: "Your intelligent customer segment has been saved with all analytics and targeting rules.",
            status: "success",
            duration: 4000,
            isClosable: true,
        })

        handleClose()
    }

    const handleClose = () => {
        onClose()
        setShowAIResults(false)
        setAIPrompt('')
        setAISegmentResult(null)
        setSegmentRules(null)
        setShowRules(false)
        setEditingRuleCategory(null)
        setEditedRules(null)
    }

    return (
        <Modal isOpen={isOpen} onClose={handleClose} size="6xl" scrollBehavior="inside">
            <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(10px)" />
            <ModalContent
                bg={modalBg}
                borderRadius="xl"
                boxShadow="2xl"
                border="1px solid"
                borderColor={useColorModeValue('gray.200', 'gray.600')}
                maxH="90vh"
            >
                <Box bgGradient={gradientBg} borderTopRadius="xl" p={6}>
                    <HStack justify="space-between" align="center">
                        <VStack align="start" spacing={1}>
                            <HStack>
                                <Icon as={FiZap} color="purple.500" boxSize={6} />
                                <Heading size="lg" color="gray.800">
                                    AI-Powered Segment Generator
                                </Heading>
                            </HStack>
                            <Text color="gray.600" fontSize="sm">
                                Create intelligent customer segments with AI-driven insights and analytics
                            </Text>
                        </VStack>
                        <ModalCloseButton position="relative" top="auto" right="auto" />
                    </HStack>
                </Box>

                <ModalBody p={6}>
                    {!showAIResults ? (
                        <VStack spacing={6} align="stretch">
                            {/* AI Input Section */}
                            <Box>
                                <Text fontSize="md" fontWeight="semibold" mb={2} color="gray.700">
                                    Describe Your Target Segment
                                </Text>
                                <Text fontSize="sm" color="gray.600" mb={4}>
                                    Use natural language to describe the customer segment you want to create. Our AI will analyze your requirements and generate detailed targeting criteria with analytics.
                                </Text>

                                <FormControl isRequired>
                                    <FormLabel fontSize="sm" fontWeight="medium" mb={2}>
                                        Segment Description
                                    </FormLabel>
                                    <Textarea
                                        placeholder="Examples:
• High-value customers with investment portfolios over $500K who use mobile banking frequently
• Young professionals aged 25-35 with high credit card spending on travel and dining
• Small business owners with commercial accounts and lending relationships
• Retired customers with conservative investment profiles and regular income needs"
                                        value={aiPrompt}
                                        onChange={(e) => setAIPrompt(e.target.value)}
                                        minH="120px"
                                        bg={useColorModeValue('gray.50', 'gray.700')}
                                        borderRadius="md"
                                        border="1px solid"
                                        borderColor={useColorModeValue('gray.200', 'gray.600')}
                                        _focus={{
                                            borderColor: 'purple.500',
                                            boxShadow: '0 0 0 1px rgba(128, 90, 213, 0.6)',
                                        }}
                                        fontSize="sm"
                                        resize="vertical"
                                    />
                                </FormControl>
                            </Box>

                            {/* Quick Templates */}
                            <Box>
                                <Text fontSize="sm" fontWeight="medium" mb={3} color="gray.700">
                                    Quick Templates
                                </Text>
                                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={3}>
                                    {Object.entries(AI_SEGMENT_SUGGESTIONS).map(([template, data]) => (
                                        <Card
                                            key={template}
                                            variant="outline"
                                            cursor="pointer"
                                            _hover={{
                                                borderColor: 'purple.300',
                                                boxShadow: 'md',
                                                transform: 'translateY(-1px)'
                                            }}
                                            transition="all 0.2s"
                                            onClick={() => setAIPrompt(data.description)}
                                        >
                                            <CardBody p={4}>
                                                <VStack align="start" spacing={2}>
                                                    <Text fontSize="sm" fontWeight="semibold">
                                                        {template}
                                                    </Text>
                                                    <Text fontSize="xs" color="gray.600" noOfLines={2}>
                                                        {data.description}
                                                    </Text>
                                                    <HStack spacing={2}>
                                                        <Badge colorScheme="purple" fontSize="xs">
                                                            {data.estimatedSize.toLocaleString()} customers
                                                        </Badge>
                                                        <Badge colorScheme="green" fontSize="xs">
                                                            {data.expectedEngagement} engagement
                                                        </Badge>
                                                    </HStack>
                                                </VStack>
                                            </CardBody>
                                        </Card>
                                    ))}
                                </SimpleGrid>
                            </Box>

                            {isProcessing && (
                                <Box textAlign="center" py={8}>
                                    <VStack spacing={4}>
                                        <Spinner size="xl" color="purple.500" thickness="4px" />
                                        <VStack spacing={2}>
                                            <Text fontWeight="medium" color="gray.700" fontSize="lg">
                                                🤖 AI is analyzing your requirements...
                                            </Text>
                                            <Text fontSize="sm" color="gray.500">
                                                Creating intelligent segment criteria and analytics
                                            </Text>
                                        </VStack>
                                    </VStack>
                                </Box>
                            )}
                        </VStack>
                    ) : (
                        <VStack spacing={6} align="stretch">
                            {/* Success Header */}
                            <Alert
                                status="success"
                                borderRadius="lg"
                                variant="left-accent"
                                bg={useColorModeValue('green.50', 'green.900')}
                            >
                                <AlertIcon />
                                <Box>
                                    <AlertTitle fontSize="sm">
                                        ✅ AI Segment Generated Successfully!
                                    </AlertTitle>
                                    <AlertDescription fontSize="xs">
                                        Based on: "{aiPrompt.slice(0, 80)}..."
                                    </AlertDescription>
                                </Box>
                            </Alert>

                            {/* Key Metrics Grid */}
                            <Box>
                                <Heading size="md" mb={4} color="gray.700">
                                    📊 Segment Analytics
                                </Heading>
                                <SimpleGrid columns={{ base: 2, md: 4 }} spacing={4}>
                                    <Card bg={useColorModeValue('blue.50', 'blue.900')}>
                                        <CardBody p={4} textAlign="center">
                                            <Stat>
                                                <StatLabel fontSize="xs">Customer Count</StatLabel>
                                                <StatNumber fontSize="lg" color="blue.600">
                                                    {aiSegmentResult?.customerCount.toLocaleString()}
                                                </StatNumber>
                                            </Stat>
                                        </CardBody>
                                    </Card>
                                    <Card bg={useColorModeValue('green.50', 'green.900')}>
                                        <CardBody p={4} textAlign="center">
                                            <Stat>
                                                <StatLabel fontSize="xs">Avg. Spend</StatLabel>
                                                <StatNumber fontSize="lg" color="green.600">
                                                    {aiSegmentResult?.avgSpend}
                                                </StatNumber>
                                            </Stat>
                                        </CardBody>
                                    </Card>
                                    <Card bg={useColorModeValue('purple.50', 'purple.900')}>
                                        <CardBody p={4} textAlign="center">
                                            <Stat>
                                                <StatLabel fontSize="xs">Response Rate</StatLabel>
                                                <StatNumber fontSize="lg" color="purple.600">
                                                    {aiSegmentResult?.responsePropensity}
                                                </StatNumber>
                                            </Stat>
                                        </CardBody>
                                    </Card>
                                    <Card bg={useColorModeValue('orange.50', 'orange.900')}>
                                        <CardBody p={4} textAlign="center">
                                            <Stat>
                                                <StatLabel fontSize="xs">Engagement</StatLabel>
                                                <StatNumber fontSize="lg" color="orange.600">
                                                    {aiSegmentResult?.digitalEngagement}
                                                </StatNumber>
                                            </Stat>
                                        </CardBody>
                                    </Card>
                                </SimpleGrid>
                            </Box>

                            {/* Charts Section - Smaller and More Focused */}
                            <Box>
                                <Heading size="md" mb={4} color="gray.700">
                                    📈 Key Insights
                                </Heading>
                                <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={4}>
                                    {/* Spending by Category Chart */}
                                    <Card>
                                        <CardBody p={4}>
                                            <Heading size="sm" mb={3}>Spending Categories</Heading>
                                            <Box h="200px">
                                                <ResponsiveContainer width="100%" height="100%">
                                                    <RechartsBarChart
                                                        data={aiSegmentResult?.chartData.spendingByCategory}
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
                                        <CardBody p={4}>
                                            <Heading size="sm" mb={3}>Age Distribution</Heading>
                                            <Box h="200px">
                                                <ResponsiveContainer width="100%" height="100%">
                                                    <RechartsPieChart>
                                                        <Pie
                                                            data={aiSegmentResult?.chartData.ageDistribution}
                                                            cx="50%"
                                                            cy="50%"
                                                            labelLine={false}
                                                            outerRadius={70}
                                                            fill="#8884d8"
                                                            dataKey="count"
                                                            nameKey="age"
                                                            label={({ age }) => age}
                                                        >
                                                            {aiSegmentResult?.chartData.ageDistribution.map((entry, index) => (
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
                                </SimpleGrid>
                            </Box>

                            {/* Targeting Rules Section - Enhanced with Card and Toggle */}
                            {segmentRules && (
                                <Card>
                                    <CardBody p={6}>
                                        <VStack spacing={4} align="stretch">
                                            <HStack justify="space-between" align="center">
                                                <HStack>
                                                    <Heading size="md" color="gray.700">
                                                        🎯 AI-Generated Targeting Rules
                                                    </Heading>
                                                    <Badge colorScheme="purple" fontSize="xs">
                                                        {Object.entries(segmentRules).filter(([key]) => key !== 'expectedResults')
                                                            .reduce((total, [_, rules]) => total + (Array.isArray(rules) ? rules.length : 0), 0)} total rules
                                                    </Badge>
                                                </HStack>
                                                <HStack spacing={2}>
                                                    <Button
                                                        size="sm"
                                                        leftIcon={<Icon as={showRules ? FiEye : FiTarget} />}
                                                        onClick={() => setShowRules(!showRules)}
                                                        variant="outline"
                                                        colorScheme="blue"
                                                    >
                                                        {showRules ? 'Hide Rules' : 'Show Rules'}
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        leftIcon={<Icon as={FiCode} />}
                                                        onClick={() => onCopy()}
                                                        variant="outline"
                                                    >
                                                        {hasCopied ? 'Copied!' : 'Copy'}
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        leftIcon={<Icon as={FiRefreshCw} />}
                                                        onClick={() => {
                                                            const newRules = generateSegmentRules(aiPrompt)
                                                            setSegmentRules(newRules)
                                                            toast({
                                                                title: "Rules regenerated",
                                                                status: "info",
                                                                duration: 2000,
                                                                isClosable: true,
                                                            })
                                                        }}
                                                        colorScheme="purple"
                                                        variant="outline"
                                                    >
                                                        Regenerate
                                                    </Button>
                                                </HStack>
                                            </HStack>

                                            {showRules && (
                                                <Box>
                                                    <Accordion allowMultiple defaultIndex={[0, 1, 2, 3, 4]}>
                                                        {Object.entries(segmentRules).filter(([key]) => key !== 'expectedResults').map(([category, rules]) => (
                                                            <AccordionItem key={category}>
                                                                <AccordionButton>
                                                                    <HStack flex="1" textAlign="left">
                                                                        <Icon as={getCategoryIcon(category)} color="blue.500" />
                                                                        <Text fontWeight="medium">{getCategoryName(category)}</Text>
                                                                        <Badge colorScheme="purple" fontSize="xs">
                                                                            {Array.isArray(rules) ? rules.length : 0} rules
                                                                        </Badge>
                                                                        {editingRuleCategory === category && (
                                                                            <Badge colorScheme="orange" fontSize="xs">Editing</Badge>
                                                                        )}
                                                                    </HStack>
                                                                    <HStack spacing={2}>
                                                                        <Button
                                                                            size="xs"
                                                                            leftIcon={<Icon as={FiEdit} />}
                                                                            onClick={(e) => {
                                                                                e.stopPropagation()
                                                                                toggleRuleEditing(category)
                                                                            }}
                                                                            variant="ghost"
                                                                            colorScheme={editingRuleCategory === category ? "orange" : "gray"}
                                                                        >
                                                                            {editingRuleCategory === category ? 'Cancel' : 'Edit'}
                                                                        </Button>
                                                                        <AccordionIcon />
                                                                    </HStack>
                                                                </AccordionButton>
                                                                <AccordionPanel pb={4}>
                                                                    <VStack spacing={3} align="stretch">
                                                                        {Array.isArray(rules) && rules.map((rule, index) => (
                                                                            <Card key={index} variant="outline" bg={useColorModeValue('gray.50', 'gray.700')}>
                                                                                <CardBody p={4}>
                                                                                    {editingRuleCategory === category ? (
                                                                                        <VStack spacing={3} align="stretch">
                                                                                            <HStack spacing={3}>
                                                                                                <FormControl flex="1">
                                                                                                    <FormLabel fontSize="xs">Attribute</FormLabel>
                                                                                                    <Select
                                                                                                        size="sm"
                                                                                                        value={editedRules?.[category]?.[index]?.attribute || rule.attribute}
                                                                                                        onChange={(e) => updateRuleValue(category, index, 'attribute', e.target.value)}
                                                                                                    >
                                                                                                        {Object.keys(RULE_CONTROL_TYPES).map((attr) => (
                                                                                                            <option key={attr} value={attr}>{attr}</option>
                                                                                                        ))}
                                                                                                    </Select>
                                                                                                </FormControl>
                                                                                                <FormControl flex="1">
                                                                                                    <FormLabel fontSize="xs">Condition</FormLabel>
                                                                                                    <Select
                                                                                                        size="sm"
                                                                                                        value={editedRules?.[category]?.[index]?.condition || rule.condition}
                                                                                                        onChange={(e) => updateRuleValue(category, index, 'condition', e.target.value)}
                                                                                                    >
                                                                                                        <option value="is">is</option>
                                                                                                        <option value="is not">is not</option>
                                                                                                        <option value="greater than">greater than</option>
                                                                                                        <option value="less than">less than</option>
                                                                                                        <option value="between">between</option>
                                                                                                        <option value="includes">includes</option>
                                                                                                        <option value="excludes">excludes</option>
                                                                                                        <option value="within">within</option>
                                                                                                    </Select>
                                                                                                </FormControl>
                                                                                                <Button
                                                                                                    size="sm"
                                                                                                    colorScheme="red"
                                                                                                    variant="ghost"
                                                                                                    onClick={() => {
                                                                                                        const updatedRules = { ...editedRules }
                                                                                                        updatedRules[category].splice(index, 1)
                                                                                                        setEditedRules(updatedRules)
                                                                                                    }}
                                                                                                >
                                                                                                    <Icon as={FiX} />
                                                                                                </Button>
                                                                                            </HStack>
                                                                                            <FormControl>
                                                                                                <FormLabel fontSize="xs">Value</FormLabel>
                                                                                                <RuleValueEditor
                                                                                                    rule={editedRules?.[category]?.[index] || rule}
                                                                                                    category={category}
                                                                                                    index={index}
                                                                                                    updateValue={updateRuleValue}
                                                                                                />
                                                                                            </FormControl>
                                                                                        </VStack>
                                                                                    ) : (
                                                                                        <HStack justify="space-between">
                                                                                            <VStack align="start" spacing={1}>
                                                                                                <Text fontSize="sm" fontWeight="semibold">
                                                                                                    {rule.attribute} {rule.condition} {rule.value}
                                                                                                </Text>
                                                                                                <Badge colorScheme="gray" fontSize="xs">
                                                                                                    Type: {rule.valueType}
                                                                                                </Badge>
                                                                                            </VStack>
                                                                                            <Icon as={FiTarget} color="blue.400" />
                                                                                        </HStack>
                                                                                    )}
                                                                                </CardBody>
                                                                            </Card>
                                                                        ))}

                                                                        {/* Add New Rule Button */}
                                                                        {editingRuleCategory === category && (
                                                                            <Button
                                                                                size="sm"
                                                                                leftIcon={<Icon as={FiPlus} />}
                                                                                onClick={() => {
                                                                                    const updatedRules = { ...editedRules }
                                                                                    const newRule = {
                                                                                        attribute: Object.keys(RULE_CONTROL_TYPES)[0],
                                                                                        condition: 'is',
                                                                                        value: '',
                                                                                        valueType: 'categorical',
                                                                                        rawValue: ''
                                                                                    }
                                                                                    updatedRules[category].push(newRule)
                                                                                    setEditedRules(updatedRules)
                                                                                }}
                                                                                variant="outline"
                                                                                colorScheme="green"
                                                                                w="full"
                                                                            >
                                                                                Add New Rule
                                                                            </Button>
                                                                        )}

                                                                        {editingRuleCategory === category && (
                                                                            <HStack spacing={2} justify="flex-end" pt={2}>
                                                                                <Button size="sm" onClick={cancelRuleEditing} variant="ghost">
                                                                                    Cancel
                                                                                </Button>
                                                                                <Button size="sm" onClick={saveRuleChanges} colorScheme="blue">
                                                                                    Save Changes
                                                                                </Button>
                                                                            </HStack>
                                                                        )}
                                                                    </VStack>
                                                                </AccordionPanel>
                                                            </AccordionItem>
                                                        ))}
                                                    </Accordion>
                                                </Box>
                                            )}

                                            {/* Expected Results */}
                                            {segmentRules.expectedResults && (
                                                <Box p={4} bg={useColorModeValue('blue.50', 'blue.900')} borderRadius="md">
                                                    <HStack justify="space-between">
                                                        <VStack align="start" spacing={1}>
                                                            <Text fontSize="sm" fontWeight="bold" color="blue.700">
                                                                Expected Results
                                                            </Text>
                                                            <Text fontSize="xs" color="blue.600">
                                                                Estimated: {segmentRules.expectedResults.count.toLocaleString()} customers ({segmentRules.expectedResults.percentOfTotal})
                                                            </Text>
                                                        </VStack>
                                                        <Icon as={FiTrendingUp} color="blue.500" boxSize={5} />
                                                    </HStack>
                                                </Box>
                                            )}
                                        </VStack>
                                    </CardBody>
                                </Card>
                            )}
                        </VStack>
                    )}
                </ModalBody>

                <ModalFooter
                    bg={useColorModeValue('gray.50', 'gray.700')}
                    borderBottomRadius="xl"
                    borderTop="1px solid"
                    borderTopColor={useColorModeValue('gray.200', 'gray.600')}
                    px={6}
                    py={4}
                >
                    <HStack spacing={3} width="100%" justify="flex-end">
                        <Button
                            variant="ghost"
                            onClick={handleClose}
                        >
                            Cancel
                        </Button>

                        {!showAIResults ? (
                            <Button
                                colorScheme="purple"
                                leftIcon={<Icon as={FiZap} />}
                                onClick={processAISegment}
                                isLoading={isProcessing}
                                loadingText="AI Generating..."
                                isDisabled={!aiPrompt.trim() || isProcessing}
                                size="md"
                                minW="180px"
                                bgGradient="linear(to-r, purple.400, pink.500)"
                                _hover={{
                                    bgGradient: "linear(to-r, purple.500, pink.600)",
                                }}
                            >
                                Generate AI Segment
                            </Button>
                        ) : (
                            <Button
                                colorScheme="green"
                                leftIcon={<Icon as={FiSave} />}
                                onClick={saveAISegment}
                                size="md"
                                minW="160px"
                                bgGradient="linear(to-r, green.400, teal.500)"
                                _hover={{
                                    bgGradient: "linear(to-r, green.500, teal.600)",
                                }}
                            >
                                Save Segment
                            </Button>
                        )}
                    </HStack>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}

// Generate segment rules from AI prompt
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

// Helper functions for rule display and editing
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

// Rule editing component to handle different value types
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