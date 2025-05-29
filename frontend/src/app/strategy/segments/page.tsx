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
  Alert,
  AlertIcon,
} from '@chakra-ui/react';
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
} from 'react-icons/fi';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import useSegments, { Segment, sampleAIChartData } from '../../../hooks/useSegments';

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
} from 'recharts';

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
};

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
  };
};

// Add rule editing component to handle different value types
const RuleValueEditor = ({ rule, category, index, updateValue }) => {
  const controlType = RULE_CONTROL_TYPES[rule.attribute]?.type || 'text';
  const controlConfig = RULE_CONTROL_TYPES[rule.attribute] || {};
  
  const handleValueChange = (newValue) => {
    updateValue(category, index, 'rawValue', newValue);
    
    // Also update the displayed value based on the type
    let displayValue = '';
    
    switch (controlType) {
      case 'range':
        displayValue = `${newValue[0]}-${newValue[1]} ${controlConfig.unit || ''}`;
        break;
      case 'numberRange':
        displayValue = `${controlConfig.unit || ''}${newValue[0].toLocaleString()}-${controlConfig.unit || ''}${newValue[1].toLocaleString()}`;
        break;
      case 'select':
        displayValue = newValue;
        break;
      case 'multiSelect':
        displayValue = Array.isArray(newValue) ? newValue.join(', ') : newValue;
        break;
      case 'dateRange':
        displayValue = `Last ${newValue} days`;
        break;
      default:
        displayValue = newValue.toString();
    }
    
    updateValue(category, index, 'value', displayValue);
  };
  
  // Ensure all range slider values are arrays
  const ensureArrayValue = (val) => {
    if (!Array.isArray(val)) {
      const min = controlConfig.min || 0;
      const max = controlConfig.max || 100;
      return [min, max];
    }
    return val;
  };
  
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
      );
      
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
              const newVal = parseFloat(valueString);
              const currentVal = Array.isArray(rule.rawValue) ? [...rule.rawValue] : [0, 0];
              currentVal[0] = newVal;
              handleValueChange(currentVal);
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
              const newVal = parseFloat(valueString);
              const currentVal = Array.isArray(rule.rawValue) ? [...rule.rawValue] : [0, 0];
              currentVal[1] = newVal;
              handleValueChange(currentVal);
            }}
          >
            <NumberInputField />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
        </HStack>
      );
      
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
      );
      
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
                  const isChecked = e.target.checked;
                  let newValues = Array.isArray(rule.rawValue) ? [...rule.rawValue] : [];
                  if (isChecked) {
                    newValues.push(option);
                  } else {
                    newValues = newValues.filter(val => val !== option);
                  }
                  handleValueChange(newValues);
                }}
              >
                {option}
              </Checkbox>
            ))}
          </Stack>
        </Box>
      );
      
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
      );
      
    default:
      return (
        <Input 
          size="sm" 
          value={rule.rawValue || rule.value} 
          onChange={(e) => handleValueChange(e.target.value)}
          focusBorderColor="blue.400"
        />
      );
  }
};

export default function CustomerSegments() {
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { 
    isOpen: isAIModalOpen, 
    onOpen: onAIModalOpen, 
    onClose: onAIModalClose 
  } = useDisclosure();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterEngagement, setFilterEngagement] = useState('All');
  const cardBg = useColorModeValue('white', 'gray.800');
  const [showCreateModal, setShowCreateModal] = useState(false);
  
  // Use our custom hook to fetch segment data
  const { segments: apiSegments, loading, error } = useSegments();
  
  // AI segment states
  const [aiPrompt, setAIPrompt] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [aiSegmentResult, setAISegmentResult] = useState<any>(null);
  const [showAIResults, setShowAIResults] = useState(false);

  // Add state for inline display option
  const [showInlineSaved, setShowInlineSaved] = useState(false);
  const [savedSegments, setSavedSegments] = useState<any[]>([]);

  const [showRules, setShowRules] = useState(false);
  const [segmentRules, setSegmentRules] = useState<any>(null);
  const { hasCopied, onCopy } = useClipboard('');

  const [editingRuleCategory, setEditingRuleCategory] = useState<string | null>(null);
  const [editedRules, setEditedRules] = useState<any>(null);
  const [selectedSegment, setSelectedSegment] = useState<Segment | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [aiAnalysisSegment, setAIAnalysisSegment] = useState<Segment | null>(null);
  const [showAIModal, setShowAIModal] = useState(false);
  const [aiModalStep, setAIModalStep] = useState(1);

  // Calculate segmentStats based on API data
  const segmentStats = [
    {
      title: 'Total Segments',
      value: apiSegments.length,
      icon: FiLayers,
      color: 'blue',
    },
    {
      title: 'Total Customers',
      value: apiSegments.reduce((sum, segment) => sum + (segment.size || 0), 0).toLocaleString(),
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
  ];

  // Filter segments based on search and filter options
  const filteredSegments = apiSegments.filter(segment =>
    (filterEngagement === 'All' || segment.engagement === filterEngagement) &&
    (segment.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
     segment.description?.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const getEngagementColor = (engagement: string) => {
    switch (engagement) {
      case 'High': return 'green';
      case 'Medium': return 'orange';
      case 'Low': return 'red';
      default: return 'gray';
    }
  };

  const getGrowthColor = (growth: string) => {
    const value = parseFloat(growth);
    return value > 0 ? 'green' : value < 0 ? 'red' : 'gray';
  };

  // Process AI segment generation (mock for demo)
  const processAISegment = () => {
    if (!aiPrompt.trim()) {
      toast({
        title: "Prompt required",
        description: "Please enter a description for the segment you want to generate.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setIsProcessing(true);

    // Simulate API call with a timeout
    setTimeout(() => {
      // Generate user-friendly rules based on the prompt
      const rules = generateSegmentRules(aiPrompt);
      setSegmentRules(rules);
      
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
      };

      setAISegmentResult(sampleSegmentResult);
      setShowAIResults(true);
      setIsProcessing(false);
    }, 2000);
  };

  // Helper function to get icon for rule category
  const getCategoryIcon = (category) => {
    switch(category) {
      case 'demographics':
        return FiUsers;
      case 'transactionBehavior':
        return FiBarChart2;
      case 'productOwnership':
        return FiBriefcase;
      case 'riskScores':
        return FiShield;
      case 'activityPatterns':
        return FiSmartphone;
      default:
        return FiFilter;
    }
  };

  // Helper function to get category display name
  const getCategoryName = (category) => {
    switch(category) {
      case 'demographics':
        return 'Demographics';
      case 'transactionBehavior':
        return 'Transaction Behavior';
      case 'productOwnership':
        return 'Product Ownership';
      case 'riskScores':
        return 'Risk Scores';
      case 'activityPatterns':
        return 'Activity Patterns';
      default:
        return category;
    }
  };

  const saveAISegment = () => {
    // Add saved segment to local storage
    const newSegment = {
      ...aiSegmentResult,
      id: Date.now(),
    };
    
    // Update the customer segments state if inline display is selected
    if (showInlineSaved) {
      setSavedSegments([...savedSegments, newSegment]);
    }
    
    toast({
      title: "Segment saved",
      description: "AI generated segment has been saved successfully.",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
    
    // Close modal after saving
    onAIModalClose();
    setShowAIResults(false);
    setAIPrompt('');
    setAISegmentResult(null);
  };

  // Helper function to toggle rule editing mode
  const toggleRuleEditing = (category: string | null) => {
    if (category === editingRuleCategory) {
      setEditingRuleCategory(null);
    } else {
      setEditingRuleCategory(category);
      if (category) {
        // Clone the current rules for editing
        setEditedRules({...segmentRules});
      }
    }
  };

  // Helper function to update a rule value
  const updateRuleValue = (category, index, field, value) => {
    const updatedRules = {...editedRules};
    updatedRules[category][index][field] = value;
    
    // If we're updating the attribute, automatically set the valueType and condition
    if (field === 'attribute') {
      const controlType = RULE_CONTROL_TYPES[value];
      if (controlType) {
        updatedRules[category][index].valueType = controlType.conditionType;
        
        // Set default condition based on type
        switch (controlType.conditionType) {
          case 'categorical':
            updatedRules[category][index].condition = 'is';
            break;
          case 'range':
            updatedRules[category][index].condition = 'between';
            break;
          case 'numeric':
          case 'percentage':
            updatedRules[category][index].condition = 'greater than';
            break;
          case 'time':
            updatedRules[category][index].condition = 'within';
            break;
        }
        
        // Set default raw value
        switch (controlType.type) {
          case 'range':
            updatedRules[category][index].rawValue = [controlType.min || 0, controlType.max || 100];
            updatedRules[category][index].value = `${controlType.min || 0}-${controlType.max || 100} ${controlType.unit || ''}`;
            break;
          case 'select':
            updatedRules[category][index].rawValue = controlType.options?.[0] || '';
            updatedRules[category][index].value = controlType.options?.[0] || '';
            break;
          case 'multiSelect':
            // Fix the expression that was always truthy
            updatedRules[category][index].rawValue = controlType.options?.length ? [controlType.options[0]] : [];
            updatedRules[category][index].value = controlType.options?.[0] || '';
            break;
          case 'dateRange':
            updatedRules[category][index].rawValue = 30; // Default to 30 days
            updatedRules[category][index].value = 'Last 30 days';
            break;
          default:
            updatedRules[category][index].rawValue = '';
            updatedRules[category][index].value = '';
        }
      }
    }
    
    setEditedRules(updatedRules);
  };

  // Helper function to save rule changes
  const saveRuleChanges = () => {
    setSegmentRules(editedRules);
    setEditingRuleCategory(null);
    
    toast({
      title: "Rules updated",
      description: "Segment rules have been updated successfully.",
      status: "success",
      duration: 2000,
      isClosable: true,
    });
  };

  // Helper function to cancel rule editing
  const cancelRuleEditing = () => {
    setEditingRuleCategory(null);
    setEditedRules(null);
  };

  return (
    <DashboardLayout>
      <Box mb={6}>
        <HStack spacing={4} align="center" mb={6}>
          <Icon as={FiUsers} boxSize={8} color="blue.500" />
          <Box>
            <Heading as="h1" size="xl" color="secondary.700">
              Customer Segments
            </Heading>
            <Text color="gray.600">
              Define and manage customer segments for targeted financial marketing
            </Text>
          </Box>
        </HStack>

        {loading ? (
          <Flex justify="center" my={12}>
            <Spinner size="xl" thickness="4px" color="blue.500" />
          </Flex>
        ) : error ? (
          <Alert status="error" borderRadius="md" mb={6}>
            <AlertIcon />
            {error}
          </Alert>
        ) : (
          <>
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
                      {filteredSegments.length > 0 ? (
                        filteredSegments.map((segment) => (
                    <Tr key={segment.id}>
                      <Td>
                        <VStack align="start" spacing={1}>
                          <Text fontWeight="medium">{segment.name}</Text>
                          <Text fontSize="sm" color="gray.600" noOfLines={1}>
                            {segment.description}
                          </Text>
                        </VStack>
                      </Td>
                            <Td>{segment.size?.toLocaleString()}</Td>
                      <Td>
                              <Badge colorScheme={getEngagementColor(segment.engagement || 'Medium')}>
                                {segment.engagement || 'Medium'}
                        </Badge>
                      </Td>
                      <Td>
                              <Text color={getGrowthColor(segment.growth || '+0.0%')}>
                                {segment.growth || '+0.0%'}
                        </Text>
                      </Td>
                            <Td>{segment.avgValue || '$0'}</Td>
                            <Td>{segment.lastUpdated || segment.updated_at || 'N/A'}</Td>
                      <Td>
                        <HStack spacing={2}>
                          <IconButton
                            icon={<Icon as={FiEdit} />}
                            aria-label="Edit"
                            size="sm"
                            variant="ghost"
                                  onClick={() => {
                                    setSelectedSegment(segment);
                                    setShowCreateModal(true);
                                  }}
                          />
                          <Menu>
                            <MenuButton
                              as={IconButton}
                              icon={<Icon as={FiMoreVertical} />}
                              variant="ghost"
                              size="sm"
                            />
                            <MenuList>
                                    <MenuItem icon={<Icon as={FiBarChart2} />} onClick={() => {
                                      setAIAnalysisSegment(segment);
                                      setShowAIModal(true);
                                      setAIModalStep(1);
                                    }}>
                                      AI Analysis
                                    </MenuItem>
                              <MenuItem icon={<Icon as={FiDownload} />}>Export Data</MenuItem>
                                    <MenuItem icon={<Icon as={FiTrash2} />} color="red.500" onClick={() => {
                                      setSelectedSegment(segment);
                                      setShowDeleteModal(true);
                                    }}>
                                Delete Segment
                              </MenuItem>
                            </MenuList>
                          </Menu>
                        </HStack>
                      </Td>
                    </Tr>
                        ))
                      ) : (
                        <Tr>
                          <Td colSpan={7} textAlign="center" py={6}>
                            <Icon as={FiUsers} boxSize={8} color="gray.400" mb={2} />
                            <Text color="gray.500">No segments found matching your filters</Text>
                          </Td>
                        </Tr>
                      )}
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
          </>
        )}

      {/* Create Segment Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create Client Segment</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <FormControl isRequired>
                <FormLabel>Segment Name</FormLabel>
                <Input placeholder="Enter segment name" />
              </FormControl>
              <FormControl>
                <FormLabel>Description</FormLabel>
                <Input placeholder="Enter segment description" />
              </FormControl>
              <FormControl>
                <FormLabel>Segment Criteria</FormLabel>
                <Select>
                  <option value="balances">Account Balances</option>
                  <option value="products">Financial Products</option>
                  <option value="activity">Transaction Activity</option>
                  <option value="investmentProfile">Investment Profile</option>
                  <option value="wealthTier">Wealth Tier</option>
                </Select>
              </FormControl>
              <FormControl>
                <FormLabel>Target Size</FormLabel>
                <Input type="number" placeholder="Estimated segment size" />
              </FormControl>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button colorScheme="blue">
              Create Segment
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

        {/* Delete Confirmation Modal */}
        <Modal isOpen={showDeleteModal} onClose={() => setShowDeleteModal(false)}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Delete Segment</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Text>
                Are you sure you want to delete {selectedSegment?.name}? This action cannot be undone.
              </Text>
            </ModalBody>
            <ModalFooter>
              <Button variant="ghost" mr={3} onClick={() => setShowDeleteModal(false)}>
                Cancel
              </Button>
              <Button colorScheme="red">
                Delete
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>

        {/* AI Driver Customer Segment Modal */}
        <Modal isOpen={isAIModalOpen} onClose={onAIModalClose} size="5xl">
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>
              <HStack spacing={2}>
                <Icon as={FiZap} />
                <Text>AI Driver Customer Segment</Text>
              </HStack>
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody py={6}>
              {!showAIResults ? (
                <VStack spacing={4} align="stretch">
                  <Text>
                    Describe the customer segment you want to generate using natural language. Our AI will analyze your data and create a segment based on your description.
                  </Text>
                  <FormControl isRequired>
                    <FormLabel>Segment Description</FormLabel>
                    <Textarea 
                      placeholder="E.g., Find customers who are millennials with high credit card spending on travel and entertainment, who have been customers for at least 2 years."
                      value={aiPrompt}
                      onChange={(e) => setAIPrompt(e.target.value)}
                      size="lg"
                      minH="120px"
                      focusBorderColor="blue.400"
                    />
                  </FormControl>
                  {isProcessing && (
                    <Box textAlign="center" py={4}>
                      <Spinner size="xl" color="blue.500" thickness="4px" />
                      <Text mt={4} fontWeight="medium">
                        Generating AI-driven customer segment...
                      </Text>
                    </Box>
                  )}
                </VStack>
              ) : (
                <VStack spacing={6} align="stretch">
                  {/* Segment Header Section with Improved Editing UI */}
                  <Box p={5} borderWidth="1px" borderRadius="md" bg="white" boxShadow="sm">
                    <VStack align="start" spacing={4}>
                      <Badge colorScheme="blue" fontSize="0.8em" px={2} py={1}>AI Generated Segment</Badge>
                      
                      <FormControl>
                        <FormLabel fontWeight="bold" fontSize="md">Segment Name</FormLabel>
                        <Tooltip label="Click to edit segment name" placement="top">
                          <Box display="inline-block" width="full">
                            <Editable 
                              defaultValue={aiSegmentResult.name} 
                              fontSize="md"
                              fontWeight="bold"
                              width="full"
                              isPreviewFocusable={true}
                            >
                              <EditablePreview 
                                py={2}
                                px={3}
                                _hover={{ 
                                  background: "white", 
                                  boxShadow: "sm",
                                  borderRadius: "md",
                                  cursor: "pointer" 
                                }}
                                width="full"
                              />
                              <EditableInput 
                                py={2}
                                px={3}
                                borderRadius="md"
                                onChange={(e) => setAISegmentResult({...aiSegmentResult, name: e.target.value})} 
                              />
                            </Editable>
                          </Box>
                        </Tooltip>
                      </FormControl>
                      
                      <Box width="full">
                        <FormLabel fontWeight="bold">Description</FormLabel>
                        <Tooltip label="Click to edit description" placement="top">
                          <Box display="inline-block" width="full">
                            <Editable 
                              defaultValue={aiSegmentResult.description} 
                              fontSize="md"
                              width="full"
                              isPreviewFocusable={true}
                            >
                              <EditablePreview 
                                p={2}
                                _hover={{ 
                                  background: "gray.50", 
                                  boxShadow: "sm",
                                  borderRadius: "md",
                                  cursor: "pointer" 
                                }}
                                width="full"
                                color="gray.700"
                              />
                              <EditableInput 
                                p={2}
                                borderRadius="md"
                                onChange={(e) => setAISegmentResult({...aiSegmentResult, description: e.target.value})} 
                              />
                            </Editable>
                          </Box>
                        </Tooltip>
                      </Box>
                    </VStack>
                  </Box>

                  {/* Rules Section - User Friendly Version with Editing */}
                  <Box borderWidth="1px" borderRadius="md" p={5} boxShadow="sm">
                    <HStack justifyContent="space-between" mb={4}>
                      <Heading size="md" display="flex" alignItems="center">
                        <Icon as={FiFilter} mr={2} color="blue.500" />
                        Segment Rules
                      </Heading>
                      <FormControl display="flex" alignItems="center" width="auto">
                        <FormLabel htmlFor="show-rules" mb="0" fontSize="sm" whiteSpace="nowrap" mr={3}>
                          Show Rules
                        </FormLabel>
                        <Switch id="show-rules" colorScheme="blue" 
                          isChecked={showRules}
                          onChange={() => setShowRules(!showRules)}
                        />
                      </FormControl>
                    </HStack>
                    
                    {showRules && segmentRules && (
                      <VStack spacing={4} align="stretch">
                        {/* Expected Results Summary */}
                        <Box 
                          p={4} 
                          borderWidth="1px" 
                          borderRadius="md" 
                          bg="white" 
                          boxShadow="sm"
                        >
                          <HStack spacing={4}>
                            <Icon as={FiUsers} boxSize={6} color="blue.500" />
                            <Box>
                              <Text fontWeight="bold">Expected Results</Text>
                              <Text>
                                This segment will include approximately {segmentRules.expectedResults.count.toLocaleString()} customers,
                                which is about {segmentRules.expectedResults.percentOfTotal} of your total customer base.
                              </Text>
                            </Box>
                          </HStack>
                        </Box>
                        
                        {/* Rules Accordion for better organization */}
                        <Accordion allowMultiple defaultIndex={[0]} borderWidth="0px">
                          {Object.keys(segmentRules).filter(cat => cat !== 'expectedResults').map((category) => (
                            <AccordionItem key={category} mb={3} borderWidth="1px" borderRadius="md" overflow="hidden">
                              <AccordionButton bg={editingRuleCategory === category ? "gray.100" : "white"} py={3}>
                                <HStack flex="1" textAlign="left" spacing={3}>
                                  <Icon as={getCategoryIcon(category)} color="blue.500" />
                                  <Text fontWeight="semibold">{getCategoryName(category)}</Text>
                                  {editingRuleCategory === category && (
                                    <Badge colorScheme="blue" ml={2}>Editing</Badge>
                                  )}
                                </HStack>
                                <HStack>
                                  {editingRuleCategory !== category && (
                                    <Tooltip label="Edit rules" placement="top">
                                      <Box display="inline-block">
                                        <IconButton
                                          aria-label="Edit rules"
                                          icon={<Icon as={FiEdit} />}
                                          size="sm"
                                          variant="ghost"
                                          ml={2}
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            toggleRuleEditing(category);
                                          }}
                                        />
                                      </Box>
                                    </Tooltip>
                                  )}
                                  <AccordionIcon />
                                </HStack>
                              </AccordionButton>
                              <AccordionPanel pb={4}>
                                {editingRuleCategory === category ? (
                                  <VStack spacing={4} align="stretch">
                                    <Table variant="simple" size="sm">
                                      <Thead>
                                        <Tr>
                                          <Th>Attribute</Th>
                                          <Th>Condition</Th>
                                          <Th>Value</Th>
                                        </Tr>
                                      </Thead>
                                      <Tbody>
                                        {editedRules[category].map((rule, idx) => (
                                          <Tr key={idx}>
                                            <Td>
                                              <Select 
                                                size="sm" 
                                                value={rule.attribute} 
                                                onChange={(e) => updateRuleValue(category, idx, 'attribute', e.target.value)}
                                                focusBorderColor="blue.400"
                                              >
                                                {Object.keys(RULE_CONTROL_TYPES)
                                                  .filter(attr => RULE_CONTROL_TYPES[attr].conditionType === rule.valueType)
                                                  .map(attr => (
                                                    <option key={attr} value={attr}>{attr}</option>
                                                  ))
                                                }
                                              </Select>
                                            </Td>
                                            <Td>
                                              <Select 
                                                size="sm" 
                                                value={rule.condition}
                                                onChange={(e) => updateRuleValue(category, idx, 'condition', e.target.value)}
                                                focusBorderColor="blue.400"
                                              >
                                                {rule.valueType === 'categorical' && (
                                                  <>
                                                    <option value="is">is</option>
                                                    <option value="is not">is not</option>
                                                    <option value="includes">includes</option>
                                                    <option value="excludes">excludes</option>
                                                  </>
                                                )}
                                                {rule.valueType === 'range' && (
                                                  <>
                                                    <option value="between">between</option>
                                                    <option value="outside">outside</option>
                                                  </>
                                                )}
                                                {(rule.valueType === 'numeric' || rule.valueType === 'percentage') && (
                                                  <>
                                                    <option value="greater than">greater than</option>
                                                    <option value="less than">less than</option>
                                                    <option value="at least">at least</option>
                                                    <option value="at most">at most</option>
                                                  </>
                                                )}
                                                {rule.valueType === 'time' && (
                                                  <>
                                                    <option value="within">within</option>
                                                    <option value="before">before</option>
                                                    <option value="after">after</option>
                                                  </>
                                                )}
                                              </Select>
                                            </Td>
                                            <Td>
                                              <RuleValueEditor 
                                                rule={rule} 
                                                category={category} 
                                                index={idx} 
                                                updateValue={updateRuleValue} 
                                              />
                                            </Td>
                                          </Tr>
                                        ))}
                                      </Tbody>
                                    </Table>
                                    <HStack justifyContent="flex-end" spacing={2}>
                                      <Button 
                                        size="sm" 
                                        leftIcon={<Icon as={FiX} />} 
                                        onClick={cancelRuleEditing}
                                        variant="outline"
                                      >
                                        Cancel
                                      </Button>
                                      <Button 
                                        size="sm" 
                                        leftIcon={<Icon as={FiCheck} />} 
                                        colorScheme="blue" 
                                        onClick={saveRuleChanges}
                                      >
                                        Save Changes
                                      </Button>
                                    </HStack>
                                  </VStack>
                                ) : (
                                  <Table variant="simple" size="sm">
                                    <Thead>
                                      <Tr>
                                        <Th>Attribute</Th>
                                        <Th>Condition</Th>
                                        <Th>Value</Th>
                                      </Tr>
                                    </Thead>
                                    <Tbody>
                                      {segmentRules[category].map((rule, idx) => (
                                        <Tr key={idx}>
                                          <Td fontWeight="medium">{rule.attribute}</Td>
                                          <Td>{rule.condition}</Td>
                                          <Td>{rule.value}</Td>
                                        </Tr>
                                      ))}
                                    </Tbody>
                                  </Table>
                                )}
                              </AccordionPanel>
                            </AccordionItem>
                          ))}
                        </Accordion>
                      </VStack>
                    )}
                  </Box>

                  {/* Key metrics */}
                  <Heading size="md" display="flex" alignItems="center" mt={2}>
                    <Icon as={FiBarChart2} mr={2} color="blue.500" />
                    Key Metrics
                  </Heading>
                  <SimpleGrid columns={{ base: 2, md: 4 }} spacing={4}>
                    <Card>
                      <CardBody>
                        <Stat>
                          <StatLabel>Customer Count</StatLabel>
                          <StatNumber>{aiSegmentResult.customerCount.toLocaleString()}</StatNumber>
                        </Stat>
                      </CardBody>
                    </Card>
                    <Card>
                      <CardBody>
                        <Stat>
                          <StatLabel>Unique Users</StatLabel>
                          <StatNumber>{aiSegmentResult.uniqueUsers.toLocaleString()}</StatNumber>
                        </Stat>
                      </CardBody>
                    </Card>
                    <Card>
                      <CardBody>
                        <Stat>
                          <StatLabel>Average Spend</StatLabel>
                          <StatNumber>{aiSegmentResult.avgSpend}</StatNumber>
                        </Stat>
                      </CardBody>
                    </Card>
                    <Card>
                      <CardBody>
                        <Stat>
                          <StatLabel>Response Propensity</StatLabel>
                          <StatNumber>{aiSegmentResult.responsePropensity}</StatNumber>
                        </Stat>
                      </CardBody>
                    </Card>
                  </SimpleGrid>

                  {/* Additional metrics */}
                  <Heading size="md" display="flex" alignItems="center" mt={2}>
                    <Icon as={FiTrendingUp} mr={2} color="blue.500" />
                    Additional Metrics
                  </Heading>
                  <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
                    <Card>
                      <CardBody>
                        <HStack>
                          <Icon as={FiSmartphone} boxSize={6} color="blue.500" />
                          <Stat>
                            <StatLabel>Digital Engagement</StatLabel>
                            <StatNumber>{aiSegmentResult.digitalEngagement}</StatNumber>
                          </Stat>
                        </HStack>
                      </CardBody>
                    </Card>
                    <Card>
                      <CardBody>
                        <HStack>
                          <Icon as={FiUsers} boxSize={6} color="green.500" />
                          <Stat>
                            <StatLabel>Retention Rate</StatLabel>
                            <StatNumber>{aiSegmentResult.retentionRate}</StatNumber>
                          </Stat>
                        </HStack>
                      </CardBody>
                    </Card>
                    <Card>
                      <CardBody>
                        <HStack>
                          <Icon as={FiShield} boxSize={6} color="orange.500" />
                          <Stat>
                            <StatLabel>Risk Score</StatLabel>
                            <StatNumber>{aiSegmentResult.riskScore}</StatNumber>
                          </Stat>
                        </HStack>
                      </CardBody>
                    </Card>
                  </SimpleGrid>

                  {/* Graphs section with actual charts */}
                  <Heading size="md" display="flex" alignItems="center" mt={2}>
                    <Icon as={FiBarChart2} mr={2} color="blue.500" />
                    Key Insights
                  </Heading>
                  <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
                    {/* Spending by Category Chart */}
                    <Card>
                      <CardBody>
                        <Heading size="sm" mb={4}>Spending by Category</Heading>
                        <Box h="200px">
                          <ResponsiveContainer width="100%" height="100%">
                            <RechartsBarChart
                              data={aiSegmentResult.chartData.spendingByCategory}
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
                                data={aiSegmentResult.chartData.ageDistribution}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="count"
                                nameKey="age"
                                label={({ age }) => age}
                              >
                                {aiSegmentResult.chartData.ageDistribution.map((entry, index) => (
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
                              data={aiSegmentResult.chartData.activityTrend}
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
              )}
            </ModalBody>
            <ModalFooter bg="gray.50" borderBottomRadius="md">
              <HStack spacing={4} width="100%" flexWrap="wrap" alignItems="center">
                {showAIResults && (
                  <FormControl display="flex" alignItems="center" minW="220px" flexGrow={1}>
                    <FormLabel htmlFor="show-inline" mb="0" fontSize="sm" whiteSpace="nowrap">
                      Show in page after save
                    </FormLabel>
                    <Switch id="show-inline" colorScheme="blue" 
                      isChecked={showInlineSaved}
                      onChange={() => setShowInlineSaved(!showInlineSaved)}
                    />
                  </FormControl>
                )}
                
                <HStack spacing={3} ml="auto">
                  <Button variant="ghost" onClick={onAIModalClose}>
                    Cancel
                  </Button>
                  
                  {!showAIResults ? (
                    <Button 
                      colorScheme="blue" 
                      leftIcon={<Icon as={FiSend} />} 
                      onClick={processAISegment}
                      isLoading={isProcessing}
                      isDisabled={!aiPrompt?.trim() || isProcessing}
                      size="md"
                      minW="160px"
                    >
                      Generate Segment
                    </Button>
                  ) : (
                    <Button 
                      colorScheme="green" 
                      leftIcon={<Icon as={FiSave} />} 
                      onClick={saveAISegment}
                      size="md"
                      minW="140px"
                    >
                      Save Segment
                    </Button>
                  )}
                </HStack>
              </HStack>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Box>
    </DashboardLayout>
  );
} 