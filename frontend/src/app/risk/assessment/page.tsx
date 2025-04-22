'use client';

import React, { useState } from 'react';
import {
  Box,
  Heading,
  Text,
  SimpleGrid,
  Card,
  CardBody,
  CardHeader,
  CardFooter,
  Button,
  Badge,
  Flex,
  Icon,
  Input,
  InputGroup,
  InputLeftElement,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Select,
  HStack,
  Progress,
  Stack,
  useColorModeValue,
  Divider,
  IconButton,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  VStack,
  FormControl,
  FormLabel,
  Textarea,
  Grid,
  useToast,
  CheckboxGroup,
  Checkbox,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
} from '@chakra-ui/react';
import {
  FiAlertCircle,
  FiCheckCircle,
  FiShield,
  FiFileText,
  FiUsers,
  FiLayers,
  FiBarChart2,
  FiPlus,
  FiDownload,
  FiFilter,
  FiMoreVertical,
} from 'react-icons/fi';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import { useDisclosure } from '@chakra-ui/react';

// Define the metrics interface
interface Metric {
  id: string;
  label: string;
}

interface GroupedMetrics {
  [key: string]: Metric[];
}

// Define the grouped metrics
const GROUPED_METRICS: GroupedMetrics = {
  'Performance Metrics': [
    { id: 'accuracy', label: 'Accuracy' },
    { id: 'precision', label: 'Precision' },
    { id: 'recall', label: 'Recall' },
    { id: 'f1', label: 'F1 Score' },
    { id: 'auc', label: 'AUC-ROC' },
  ],
  'Bias Metrics': [
    { id: 'demographic_parity', label: 'Demographic Parity' },
    { id: 'equal_opportunity', label: 'Equal Opportunity' },
    { id: 'disparate_impact', label: 'Disparate Impact' },
  ],
  'Fairness Metrics': [
    { id: 'individual_fairness', label: 'Individual Fairness' },
    { id: 'group_fairness', label: 'Group Fairness' },
    { id: 'counterfactual_fairness', label: 'Counterfactual Fairness' },
  ],
  'Robustness Metrics': [
    { id: 'adversarial_robustness', label: 'Adversarial Robustness' },
    { id: 'distribution_shift', label: 'Distribution Shift' },
    { id: 'noise_robustness', label: 'Noise Robustness' },
  ]
};

// Sample risk assessment data
const RISK_ASSESSMENTS = [
  {
    id: 1,
    name: 'Credit Risk Model - Regulatory Compliance',
    model: 'Credit Risk Classifier',
    status: 'Completed',
    score: 82,
    date: '2023-10-15',
    owner: 'Sarah Johnson',
    type: 'Regulatory',
  },
  {
    id: 2,
    name: 'Fraud Detection - Bias Assessment',
    model: 'Fraud Detection System',
    status: 'In Progress',
    score: 65,
    date: '2023-11-02',
    owner: 'Michael Chen',
    type: 'Fairness',
  },
  {
    id: 3,
    name: 'Customer Churn - Performance Evaluation',
    model: 'Customer Churn Predictor',
    status: 'Pending Review',
    score: 78,
    date: '2023-10-28',
    owner: 'Alex Rodriguez',
    type: 'Performance',
  },
  {
    id: 4,
    name: 'Price Forecaster - Data Quality Review',
    model: 'Price Forecaster',
    status: 'Completed',
    score: 91,
    date: '2023-09-20',
    owner: 'Emily Wilson',
    type: 'Data Quality',
  },
  {
    id: 5,
    name: 'Market Segmentation - Drift Analysis',
    model: 'Market Segmentation',
    status: 'Needs Attention',
    score: 43,
    date: '2023-11-05',
    owner: 'James Peterson',
    type: 'Concept Drift',
  },
];

// Risk assessment form component
const NewAssessmentForm = () => {
  const toast = useToast();
  
  const handleSubmit = (e) => {
    e.preventDefault();
    toast({
      title: 'Assessment initiated',
      description: 'Your risk assessment has been created and is now in progress',
      status: 'success',
      duration: 5000,
      isClosable: true,
    });
  };
  
  return (
    <Box as="form" onSubmit={handleSubmit}>
      <Stack spacing={4}>
        <FormControl isRequired>
          <FormLabel>Assessment Name</FormLabel>
          <Input placeholder="E.g. Quarterly Compliance Review" />
        </FormControl>
        
        <FormControl isRequired>
          <FormLabel>Model Selection</FormLabel>
          <Select placeholder="Select model">
            <option>Credit Risk Classifier</option>
            <option>Customer Churn Predictor</option>
            <option>Fraud Detection System</option>
            <option>Price Forecaster</option>
            <option>Market Segmentation</option>
          </Select>
        </FormControl>
        
        <FormControl isRequired>
          <FormLabel>Assessment Type</FormLabel>
          <Select placeholder="Select type">
            <option>Regulatory</option>
            <option>Fairness</option>
            <option>Performance</option>
            <option>Data Quality</option>
            <option>Concept Drift</option>
            <option>Security</option>
          </Select>
        </FormControl>
        
        <FormControl>
          <FormLabel>Assessment Description</FormLabel>
          <Textarea placeholder="Describe the purpose and scope of this assessment" />
        </FormControl>
        
        <FormControl>
          <FormLabel>Assigned To</FormLabel>
          <Select placeholder="Assign to team member">
            <option>Sarah Johnson</option>
            <option>Michael Chen</option>
            <option>Alex Rodriguez</option>
            <option>Emily Wilson</option>
            <option>James Peterson</option>
          </Select>
        </FormControl>
        
        <Button type="submit" colorScheme="blue" mt={4}>
          Start Assessment
        </Button>
      </Stack>
    </Box>
  );
};

// Risk score indicator
const RiskScoreIndicator = ({ score }) => {
  let color = "green";
  if (score < 50) color = "red";
  else if (score < 75) color = "orange";
  
  return (
    <Box>
      <Flex justify="space-between" mb={1}>
        <Text fontSize="sm">Risk Score</Text>
        <HStack>
          <Badge colorScheme={color} fontSize="sm">
            {score}/100
          </Badge>
        </HStack>
      </Flex>
      <Progress 
        value={score} 
        size="sm" 
        colorScheme={color === "green" ? "green" : color === "orange" ? "orange" : "red"} 
        borderRadius="full"
      />
      <Text fontSize="xs" mt={1} color="gray.500">
        {score >= 75 ? 'Low Risk' : score >= 50 ? 'Medium Risk' : 'High Risk'}
      </Text>
    </Box>
  );
};

export default function RiskAssessment() {
  const { isOpen: isNewAssessmentOpen, onOpen: onNewAssessmentOpen, onClose: onNewAssessmentClose } = useDisclosure();
  const [filterStatus, setFilterStatus] = useState('All');
  const [assessmentFormData, setAssessmentFormData] = useState({
    name: '',
    model: '',
    type: '',
    metrics: [],
    threshold: '',
    frequency: '',
    notes: '',
    owner: ''
  });
  const cardBg = useColorModeValue('white', 'gray.800');
  const toast = useToast();
  
  // Handle form input changes
  const handleAssessmentFormChange = (e) => {
    const { name, value } = e.target;
    setAssessmentFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle metrics selection changes
  const handleMetricsChange = (values) => {
    setAssessmentFormData(prev => ({
      ...prev,
      metrics: values
    }));
  };

  // Handle form submission
  const handleNewAssessment = (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (!assessmentFormData.name || !assessmentFormData.model || !assessmentFormData.type) {
      toast({
        title: 'Missing required fields',
        description: 'Please fill in all required fields',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    // Here you would typically make an API call to create the assessment
    console.log('Creating new assessment:', assessmentFormData);
    
    // Show success message
    toast({
      title: 'Assessment created',
      description: 'Your new assessment has been created successfully',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });

    // Reset form and close modal
    setAssessmentFormData({
      name: '',
      model: '',
      type: '',
      metrics: [],
      threshold: '',
      frequency: '',
      notes: '',
      owner: ''
    });
    onNewAssessmentClose();
  };

  // Filter assessments based on status
  const filteredAssessments = filterStatus === 'All' 
    ? RISK_ASSESSMENTS 
    : RISK_ASSESSMENTS.filter(item => item.status === filterStatus);
  
  const getStatusColor = (status) => {
    switch(status) {
      case 'Completed': return 'green';
      case 'In Progress': return 'blue';
      case 'Pending Review': return 'purple';
      case 'Needs Attention': return 'red';
      default: return 'gray';
    }
  };
  
  return (
    <DashboardLayout>
      <Box mb={6}>
        <Flex justify="space-between" align="center" mb={6}>
          <Heading as="h1" size="xl" color="secondary.700">
            Risk Assessment
          </Heading>
          <HStack spacing={4}>
            <Button
              leftIcon={<FiPlus />}
              colorScheme="green"
              size="md"
              px={6}
              fontWeight="medium"
              _hover={{ transform: 'translateY(-1px)', boxShadow: 'lg' }}
              onClick={onNewAssessmentOpen}
            >
              New Assessment
            </Button>
            <Menu>
              <MenuButton
                as={IconButton}
                icon={<FiMoreVertical />}
                variant="ghost"
                aria-label="More actions"
                size="md"
                _hover={{ bg: 'gray.100' }}
              />
              <MenuList>
                <MenuItem 
                  icon={<FiDownload />}
                  _hover={{ bg: 'gray.100' }}
                >
                  Export Assessments
                </MenuItem>
                <MenuItem 
                  icon={<FiBarChart2 />}
                  _hover={{ bg: 'gray.100' }}
                >
                  Analytics
                </MenuItem>
              </MenuList>
            </Menu>
          </HStack>
        </Flex>
      </Box>
      
      {/* Overview Stats */}
      <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={5} mb={8}>
        <Card bg={cardBg} boxShadow="sm">
          <CardBody>
            <Flex align="center" justify="space-between">
              <Box>
                <Text color="gray.500">Total Assessments</Text>
                <Heading size="lg">24</Heading>
              </Box>
              <Box p={2} bg="blue.50" borderRadius="full" color="blue.500">
                <Icon as={FiFileText} boxSize={6} />
              </Box>
            </Flex>
          </CardBody>
        </Card>
        
        <Card bg={cardBg} boxShadow="sm">
          <CardBody>
            <Flex align="center" justify="space-between">
              <Box>
                <Text color="gray.500">Completed</Text>
                <Heading size="lg">18</Heading>
              </Box>
              <Box p={2} bg="green.50" borderRadius="full" color="green.500">
                <Icon as={FiCheckCircle} boxSize={6} />
              </Box>
            </Flex>
          </CardBody>
        </Card>
        
        <Card bg={cardBg} boxShadow="sm">
          <CardBody>
            <Flex align="center" justify="space-between">
              <Box>
                <Text color="gray.500">In Progress</Text>
                <Heading size="lg">4</Heading>
              </Box>
              <Box p={2} bg="purple.50" borderRadius="full" color="purple.500">
                <Icon as={FiLayers} boxSize={6} />
              </Box>
            </Flex>
          </CardBody>
        </Card>
        
        <Card bg={cardBg} boxShadow="sm">
          <CardBody>
            <Flex align="center" justify="space-between">
              <Box>
                <Text color="gray.500">Needs Attention</Text>
                <Heading size="lg">2</Heading>
              </Box>
              <Box p={2} bg="red.50" borderRadius="full" color="red.500">
                <Icon as={FiAlertCircle} boxSize={6} />
              </Box>
            </Flex>
          </CardBody>
        </Card>
      </SimpleGrid>
      
      {/* Main Content */}
      <Card bg={cardBg} boxShadow="sm" mb={8}>
        <CardBody>
          <Tabs colorScheme="blue" variant="enclosed">
            <TabList>
              <Tab _selected={{ color: 'blue.500', borderColor: 'blue.500' }}>Assessments</Tab>
              <Tab _selected={{ color: 'blue.500', borderColor: 'blue.500' }}>New Assessment</Tab>
            </TabList>
            
            <TabPanels>
              <TabPanel px={0}>
                <Flex mb={4} justify="space-between" align="center">
                  <Select
                    maxW="200px"
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    _focus={{ borderColor: 'blue.500', boxShadow: '0 0 0 1px blue.500' }}
                  >
                    <option value="All">All Status</option>
                    <option value="Completed">Completed</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Pending Review">Pending Review</option>
                    <option value="Needs Attention">Needs Attention</option>
                  </Select>
                  
                  <HStack>
                    <Button
                      leftIcon={<FiFilter />}
                      variant="ghost"
                      size="sm"
                      _hover={{ bg: 'gray.100' }}
                    >
                      Filter
                    </Button>
                    <Button
                      leftIcon={<FiDownload />}
                      variant="ghost"
                      size="sm"
                      _hover={{ bg: 'gray.100' }}
                    >
                      Export
                    </Button>
                  </HStack>
                </Flex>
                
                {/* Table */}
                <Box overflowX="auto">
                  <Table variant="simple">
                    <Thead>
                      <Tr>
                        <Th>Assessment</Th>
                        <Th>Model</Th>
                        <Th>Type</Th>
                        <Th>Status</Th>
                        <Th>Risk Score</Th>
                        <Th>Date</Th>
                        <Th>Owner</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {filteredAssessments.map((assessment) => (
                        <Tr key={assessment.id}>
                          <Td fontWeight="medium">{assessment.name}</Td>
                          <Td>{assessment.model}</Td>
                          <Td>
                            <Badge variant="subtle">{assessment.type}</Badge>
                          </Td>
                          <Td>
                            <Badge colorScheme={getStatusColor(assessment.status)}>
                              {assessment.status}
                            </Badge>
                          </Td>
                          <Td>
                            <HStack>
                              <Progress 
                                value={assessment.score} 
                                size="xs" 
                                width="60px"
                                colorScheme={assessment.score >= 75 ? "green" : assessment.score >= 50 ? "orange" : "red"}
                                borderRadius="full"
                              />
                              <Text>{assessment.score}</Text>
                            </HStack>
                          </Td>
                          <Td>{assessment.date}</Td>
                          <Td>{assessment.owner}</Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </Box>
              </TabPanel>
              
              <TabPanel>
                <NewAssessmentForm />
              </TabPanel>
            </TabPanels>
          </Tabs>
        </CardBody>
      </Card>
      
      {/* Risk Assessment Guidelines */}
      <Card bg={cardBg} boxShadow="sm">
        <CardBody>
          <Heading size="md" mb={4}>Risk Assessment Guidelines</Heading>
          <Text mb={4}>
            Risk assessments evaluate model performance, fairness, security, and compliance with regulations.
            Follow these best practices to ensure comprehensive and effective assessments.
          </Text>
          
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={5}>
            <Card variant="outline">
              <CardBody>
                <Flex direction="column" align="center" textAlign="center">
                  <Icon as={FiShield} boxSize={10} color="blue.500" mb={3} />
                  <Heading size="sm" mb={2}>Regulatory Compliance</Heading>
                  <Text fontSize="sm">
                    Ensure models adhere to relevant legal requirements and industry standards.
                  </Text>
                </Flex>
              </CardBody>
            </Card>
            
            <Card variant="outline">
              <CardBody>
                <Flex direction="column" align="center" textAlign="center">
                  <Icon as={FiUsers} boxSize={10} color="green.500" mb={3} />
                  <Heading size="sm" mb={2}>Fairness & Bias</Heading>
                  <Text fontSize="sm">
                    Check models for biases affecting underrepresented groups or protected attributes.
                  </Text>
                </Flex>
              </CardBody>
            </Card>
            
            <Card variant="outline">
              <CardBody>
                <Flex direction="column" align="center" textAlign="center">
                  <Icon as={FiLayers} boxSize={10} color="purple.500" mb={3} />
                  <Heading size="sm" mb={2}>Model Explainability</Heading>
                  <Text fontSize="sm">
                    Ensure model predictions can be explained to stakeholders and end-users.
                  </Text>
                </Flex>
              </CardBody>
            </Card>
          </SimpleGrid>
        </CardBody>
      </Card>

      {/* New Assessment Modal */}
      <Modal isOpen={isNewAssessmentOpen} onClose={onNewAssessmentClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <form onSubmit={handleNewAssessment}>
            <ModalHeader>Create New Assessment</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <VStack spacing={4}>
                <FormControl isRequired>
                  <FormLabel>Assessment Name</FormLabel>
                  <Input
                    name="name"
                    value={assessmentFormData.name}
                    onChange={handleAssessmentFormChange}
                    placeholder="e.g., Q2 2025 Risk Assessment"
                  />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>Model</FormLabel>
                  <Select
                    name="model"
                    value={assessmentFormData.model}
                    onChange={handleAssessmentFormChange}
                    placeholder="Select model"
                  >
                    <option value="credit_risk">Credit Risk Classifier</option>
                    <option value="churn">Customer Churn Predictor</option>
                    <option value="fraud">Fraud Detection</option>
                    <option value="price">Price Forecaster</option>
                    <option value="segment">Market Segmentation</option>
                  </Select>
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>Assessment Type</FormLabel>
                  <Select
                    name="type"
                    value={assessmentFormData.type}
                    onChange={handleAssessmentFormChange}
                    placeholder="Select assessment type"
                  >
                    <option value="performance">Performance Evaluation</option>
                    <option value="bias">Bias Assessment</option>
                    <option value="drift">Model Drift Analysis</option>
                    <option value="fairness">Fairness Assessment</option>
                    <option value="robustness">Robustness Testing</option>
                    <option value="compliance">Compliance Review</option>
                  </Select>
                </FormControl>
                <FormControl>
                  <FormLabel>Metrics to Monitor</FormLabel>
                  <Box maxH="200px" overflowY="auto" p={2} borderWidth={1} borderRadius="md">
                    <CheckboxGroup
                      colorScheme="green"
                      value={assessmentFormData.metrics}
                      onChange={handleMetricsChange}
                    >
                      <VStack align="stretch" spacing={4}>
                        {Object.entries(GROUPED_METRICS).map(([category, metrics]) => (
                          <Box key={category}>
                            <Text fontWeight="medium" mb={2} color="gray.600">
                              {category}
                            </Text>
                            <SimpleGrid columns={2} spacing={2}>
                              {metrics.map((metric) => (
                                <Checkbox key={metric.id} value={metric.id}>
                                  {metric.label}
                                </Checkbox>
                              ))}
                            </SimpleGrid>
                          </Box>
                        ))}
                      </VStack>
                    </CheckboxGroup>
                  </Box>
                </FormControl>
                <Grid templateColumns="repeat(2, 1fr)" gap={4} width="100%">
                  <FormControl>
                    <FormLabel>Alert Threshold</FormLabel>
                    <Input
                      name="threshold"
                      value={assessmentFormData.threshold}
                      onChange={handleAssessmentFormChange}
                      placeholder="e.g., 0.1"
                      type="number"
                      step="0.01"
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel>Assessment Frequency</FormLabel>
                    <Select
                      name="frequency"
                      value={assessmentFormData.frequency}
                      onChange={handleAssessmentFormChange}
                    >
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                      <option value="monthly">Monthly</option>
                      <option value="quarterly">Quarterly</option>
                    </Select>
                  </FormControl>
                </Grid>
                <FormControl>
                  <FormLabel>Notes</FormLabel>
                  <Textarea
                    name="notes"
                    value={assessmentFormData.notes}
                    onChange={handleAssessmentFormChange}
                    placeholder="Enter assessment notes and requirements"
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Assessment Owner</FormLabel>
                  <Input
                    name="owner"
                    value={assessmentFormData.owner}
                    onChange={handleAssessmentFormChange}
                    placeholder="Enter the name of the responsible person"
                  />
                </FormControl>
              </VStack>
            </ModalBody>
            <ModalFooter>
              <Button variant="ghost" mr={3} onClick={onNewAssessmentClose}>
                Cancel
              </Button>
              <Button colorScheme="green" type="submit">
                Create Assessment
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </DashboardLayout>
  );
} 