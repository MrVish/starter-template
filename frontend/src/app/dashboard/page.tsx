'use client';

import React from 'react';
import {
  Box,
  Flex,
  Heading,
  Text,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  useColorModeValue,
  Card,
  CardBody,
  Stack,
  StackDivider,
  Badge,
  HStack,
  Icon,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Spinner,
  Button,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  ModalFooter,
  FormControl,
  FormLabel,
  Input,
  Select,
  Textarea,
  VStack,
  useToast,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
  Tooltip,
  Progress,
  Switch,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Grid,
  GridItem,
  Checkbox,
  CheckboxGroup,
} from '@chakra-ui/react';
import { FiTrendingUp, FiTrendingDown, FiClock, FiAlertCircle, FiCheckCircle, FiBell, FiPlus, FiDownload, FiUpload, FiMoreVertical, FiRefreshCw, FiFilter, FiMaximize2, FiMinimize2 } from 'react-icons/fi';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { useSession } from 'next-auth/react';

// Enhanced BIEmbed component with more features
const BIEmbed = () => {
  const [isFullscreen, setIsFullscreen] = React.useState(false);
  const [activeView, setActiveView] = React.useState('performance');
  const [isLoading, setIsLoading] = React.useState(false);

  const handleRefresh = () => {
    setIsLoading(true);
    // Simulate refresh
    setTimeout(() => setIsLoading(false), 1500);
  };

  return (
    <Card height={isFullscreen ? "90vh" : "100%"}>
      <CardBody>
        <Flex direction="column" h="100%">
          <Flex justify="space-between" align="center" mb={4}>
            <Heading size="md">Analytics Dashboard</Heading>
            <HStack spacing={2}>
              <IconButton
                aria-label="Refresh data"
                icon={<FiRefreshCw />}
                size="sm"
                onClick={handleRefresh}
                isLoading={isLoading}
              />
              <IconButton
                aria-label="Toggle fullscreen"
                icon={isFullscreen ? <FiMinimize2 /> : <FiMaximize2 />}
                size="sm"
                onClick={() => setIsFullscreen(!isFullscreen)}
              />
              <Menu>
                <MenuButton
                  as={IconButton}
                  aria-label="Filter options"
                  icon={<FiFilter />}
                  size="sm"
                />
                <MenuList>
                  <MenuItem>Last 7 days</MenuItem>
                  <MenuItem>Last 30 days</MenuItem>
                  <MenuItem>Last quarter</MenuItem>
                  <MenuItem>Custom range...</MenuItem>
                </MenuList>
              </Menu>
            </HStack>
          </Flex>

          <Tabs variant="soft-rounded" colorScheme="blue" mb={4}>
            <TabList>
              <Tab>Performance</Tab>
              <Tab>Risk Metrics</Tab>
              <Tab>Trends</Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                {isLoading ? (
                  <Flex justify="center" align="center" h="300px">
                    <Spinner size="xl" color="blue.500" />
                  </Flex>
                ) : (
                  <Grid templateColumns="repeat(2, 1fr)" gap={4}>
                    <GridItem colSpan={2}>
                      <Box bg="gray.50" p={4} borderRadius="lg" height="200px">
                        <Text>Performance Chart</Text>
                      </Box>
                    </GridItem>
                    <GridItem>
                      <Box bg="gray.50" p={4} borderRadius="lg" height="150px">
                        <Text>Metrics Overview</Text>
                      </Box>
                    </GridItem>
                    <GridItem>
                      <Box bg="gray.50" p={4} borderRadius="lg" height="150px">
                        <Text>Key Indicators</Text>
                      </Box>
                    </GridItem>
                  </Grid>
                )}
              </TabPanel>
              <TabPanel>
                <Box bg="gray.50" p={4} borderRadius="lg" height="350px">
                  <Text>Risk Metrics Dashboard</Text>
                </Box>
              </TabPanel>
              <TabPanel>
                <Box bg="gray.50" p={4} borderRadius="lg" height="350px">
                  <Text>Trend Analysis</Text>
                </Box>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Flex>
      </CardBody>
    </Card>
  );
};

// Dashboard stat card
const StatCard = ({ label, value, change, icon, color }) => (
  <Card>
    <CardBody>
      <Flex justify="space-between" align="center">
        <Stat>
          <StatLabel color="secondary.600">{label}</StatLabel>
          <StatNumber fontSize="2xl" fontWeight="bold" color={`${color}.500`}>{value}</StatNumber>
          {change && (
            <StatHelpText>
              <StatArrow type={change > 0 ? 'increase' : 'decrease'} />
              {Math.abs(change)}%
            </StatHelpText>
          )}
        </Stat>
        <Box
          p={2}
          bg={`${color}.50`}
          borderRadius="full"
          color={`${color}.500`}
        >
          <Icon as={icon} boxSize={5} />
        </Box>
      </Flex>
    </CardBody>
  </Card>
);

// New component for notifications
const NotificationsMenu = () => {
  const notifications = [
    { id: 1, title: 'Model Training Complete', message: 'Credit Risk Model v2.1 is ready for review', time: '10 min ago' },
    { id: 2, title: 'New Assessment Required', message: 'Fraud Detection Model needs quarterly assessment', time: '1 hour ago' },
    { id: 3, title: 'System Update', message: 'Platform maintenance scheduled for tomorrow', time: '2 hours ago' },
  ];

  return (
    <Menu>
      <Tooltip label="Notifications">
        <MenuButton
          as={IconButton}
          icon={<FiBell />}
          variant="ghost"
          aria-label="Notifications"
          position="relative"
        >
          <Box
            position="absolute"
            top="-1px"
            right="-1px"
            px={2}
            py={1}
            fontSize="xs"
            fontWeight="bold"
            lineHeight="none"
            color="white"
            transform="translate(50%,-50%)"
            bg="red.500"
            rounded="full"
          >
            3
          </Box>
        </MenuButton>
      </Tooltip>
      <MenuList>
        {notifications.map((notification) => (
          <MenuItem key={notification.id}>
            <Box>
              <Text fontWeight="medium">{notification.title}</Text>
              <Text fontSize="sm" color="gray.500">{notification.message}</Text>
              <Text fontSize="xs" color="gray.400" mt={1}>{notification.time}</Text>
            </Box>
          </MenuItem>
        ))}
      </MenuList>
    </Menu>
  );
};

// Metrics options for assessment
const METRICS_OPTIONS = [
  { id: 'accuracy', label: 'Accuracy', category: 'Performance' },
  { id: 'precision', label: 'Precision', category: 'Performance' },
  { id: 'recall', label: 'Recall', category: 'Performance' },
  { id: 'f1', label: 'F1 Score', category: 'Performance' },
  { id: 'auc', label: 'AUC-ROC', category: 'Performance' },
  { id: 'mae', label: 'Mean Absolute Error', category: 'Regression' },
  { id: 'mse', label: 'Mean Squared Error', category: 'Regression' },
  { id: 'rmse', label: 'Root Mean Squared Error', category: 'Regression' },
  { id: 'mape', label: 'Mean Absolute Percentage Error', category: 'Regression' },
  { id: 'r2', label: 'R-squared', category: 'Regression' },
  { id: 'silhouette', label: 'Silhouette Score', category: 'Clustering' },
  { id: 'calinski', label: 'Calinski-Harabasz Score', category: 'Clustering' },
  { id: 'davies', label: 'Davies-Bouldin Score', category: 'Clustering' },
  { id: 'bias_gender', label: 'Gender Bias Score', category: 'Fairness' },
  { id: 'bias_age', label: 'Age Bias Score', category: 'Fairness' },
  { id: 'bias_ethnicity', label: 'Ethnicity Bias Score', category: 'Fairness' },
  { id: 'drift_feature', label: 'Feature Drift Score', category: 'Drift' },
  { id: 'drift_target', label: 'Target Drift Score', category: 'Drift' },
  { id: 'drift_prediction', label: 'Prediction Drift Score', category: 'Drift' },
  { id: 'latency', label: 'Inference Latency', category: 'Performance' },
  { id: 'memory', label: 'Memory Usage', category: 'Performance' },
  { id: 'cpu', label: 'CPU Usage', category: 'Performance' },
];

// Group metrics by category
const GROUPED_METRICS = METRICS_OPTIONS.reduce((acc, metric) => {
  if (!acc[metric.category]) {
    acc[metric.category] = [];
  }
  acc[metric.category].push(metric);
  return acc;
}, {});

export default function Dashboard() {
  const { data: session } = useSession();
  const cardBg = useColorModeValue('white', 'secondary.800');
  const toast = useToast();
  
  // Modal controls
  const {
    isOpen: isNewModelOpen,
    onOpen: onNewModelOpen,
    onClose: onNewModelClose
  } = useDisclosure();
  
  const {
    isOpen: isNewAssessmentOpen,
    onOpen: onNewAssessmentOpen,
    onClose: onNewAssessmentClose
  } = useDisclosure();

  const {
    isOpen: isUploadDatasetOpen,
    onOpen: onUploadDatasetOpen,
    onClose: onUploadDatasetClose
  } = useDisclosure();

  const {
    isOpen: isExportOpen,
    onOpen: onExportOpen,
    onClose: onExportClose
  } = useDisclosure();

  // Upload state
  const [uploadProgress, setUploadProgress] = React.useState(0);
  const [isUploading, setIsUploading] = React.useState(false);

  // Form states
  const [modelFormData, setModelFormData] = React.useState({
    name: '',
    type: '',
    description: '',
    dataset: '',
    hyperparameters: '',
    targetMetric: '',
    targetThreshold: '',
    version: '1.0.0'
  });

  const [assessmentFormData, setAssessmentFormData] = React.useState({
    name: '',
    model: '',
    type: '',
    notes: '',
    metrics: [],
    threshold: '',
    frequency: 'monthly',
    owner: ''
  });

  // Handle model form changes
  const handleModelFormChange = (e) => {
    const { name, value } = e.target;
    setModelFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle assessment form changes
  const handleAssessmentFormChange = (e) => {
    const { name, value } = e.target;
    setAssessmentFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle metrics selection
  const handleMetricsChange = (selectedMetrics) => {
    setAssessmentFormData(prev => ({
      ...prev,
      metrics: selectedMetrics
    }));
  };

  // Handle form submissions
  const handleNewModel = (e) => {
    e.preventDefault();
    // Add model creation logic here
    toast({
      title: 'Model Created',
      description: `${modelFormData.name} has been created successfully.`,
      status: 'success',
      duration: 5000,
      isClosable: true,
    });
    setModelFormData({
      name: '',
      type: '',
      description: '',
      dataset: '',
      hyperparameters: '',
      targetMetric: '',
      targetThreshold: '',
      version: '1.0.0'
    });
    onNewModelClose();
  };

  const handleNewAssessment = (e) => {
    e.preventDefault();
    // Add assessment creation logic here
    toast({
      title: 'Assessment Created',
      description: `New risk assessment for ${assessmentFormData.model} has been created.`,
      status: 'success',
      duration: 5000,
      isClosable: true,
    });
    setAssessmentFormData({
      name: '',
      model: '',
      type: '',
      notes: '',
      metrics: [],
      threshold: '',
      frequency: 'monthly',
      owner: ''
    });
    onNewAssessmentClose();
  };

  // Handle dataset upload
  const handleDatasetUpload = (e) => {
    e.preventDefault();
    setIsUploading(true);
    
    // Simulate upload progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setUploadProgress(progress);
      
      if (progress >= 100) {
        clearInterval(interval);
        setIsUploading(false);
        onUploadDatasetClose();
        toast({
          title: 'Dataset Uploaded',
          description: 'Your dataset has been successfully uploaded and processed.',
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
        setUploadProgress(0);
      }
    }, 500);
  };

  // Handle export
  const handleExport = (format) => {
    toast({
      title: 'Export Started',
      description: `Exporting data in ${format.toUpperCase()} format...`,
      status: 'info',
      duration: 3000,
      isClosable: true,
    });
    onExportClose();

    // Simulate export
    setTimeout(() => {
      toast({
        title: 'Export Complete',
        description: `Data has been exported in ${format.toUpperCase()} format.`,
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    }, 2000);
  };
  
  return (
    <DashboardLayout>
      <Box mb={6}>
        <Flex justify="space-between" align="center" mb={6}>
          <Heading as="h1" size="xl" color="secondary.700">
            Dashboard
          </Heading>
          <HStack spacing={4}>
            <NotificationsMenu />
            <Button
              leftIcon={<FiPlus />}
              colorScheme="blue"
              onClick={onNewModelOpen}
              size="md"
              px={6}
              fontWeight="medium"
              _hover={{ transform: 'translateY(-1px)', boxShadow: 'lg' }}
            >
              New Model
            </Button>
            <Button
              leftIcon={<FiPlus />}
              colorScheme="green"
              onClick={onNewAssessmentOpen}
              size="md"
              px={6}
              fontWeight="medium"
              _hover={{ transform: 'translateY(-1px)', boxShadow: 'lg' }}
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
                  icon={<FiUpload />} 
                  onClick={onUploadDatasetOpen}
                  _hover={{ bg: 'gray.100' }}
                >
                  Upload Dataset
                </MenuItem>
                <MenuItem 
                  icon={<FiDownload />} 
                  onClick={onExportOpen}
                  _hover={{ bg: 'gray.100' }}
                >
                  Export Data
                </MenuItem>
              </MenuList>
            </Menu>
          </HStack>
        </Flex>
      </Box>

      {/* New Model Modal */}
      <Modal isOpen={isNewModelOpen} onClose={onNewModelClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <form onSubmit={handleNewModel}>
            <ModalHeader>Create New Model</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <VStack spacing={4}>
                <FormControl isRequired>
                  <FormLabel>Model Name</FormLabel>
                  <Input
                    name="name"
                    value={modelFormData.name}
                    onChange={handleModelFormChange}
                    placeholder="e.g., Credit Risk Classifier v2"
                  />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>Model Type</FormLabel>
                  <Select
                    name="type"
                    value={modelFormData.type}
                    onChange={handleModelFormChange}
                    placeholder="Select model type"
                  >
                    <option value="classification">Classification</option>
                    <option value="regression">Regression</option>
                    <option value="clustering">Clustering</option>
                    <option value="nlp">Natural Language Processing</option>
                    <option value="timeseries">Time Series</option>
                  </Select>
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>Description</FormLabel>
                  <Textarea
                    name="description"
                    value={modelFormData.description}
                    onChange={handleModelFormChange}
                    placeholder="Enter model description and purpose"
                  />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>Dataset</FormLabel>
                  <Select
                    name="dataset"
                    value={modelFormData.dataset}
                    onChange={handleModelFormChange}
                    placeholder="Select dataset"
                  >
                    <option value="customer_transactions">Customer Transactions</option>
                    <option value="user_demographics">User Demographics</option>
                    <option value="financial_data">Financial Data</option>
                    <option value="market_data">Market Data</option>
                  </Select>
                </FormControl>
                <FormControl>
                  <FormLabel>Hyperparameters</FormLabel>
                  <Textarea
                    name="hyperparameters"
                    value={modelFormData.hyperparameters}
                    onChange={handleModelFormChange}
                    placeholder="Enter model hyperparameters in JSON format"
                  />
                </FormControl>
                <Grid templateColumns="repeat(2, 1fr)" gap={4} width="100%">
                  <FormControl isRequired>
                    <FormLabel>Target Metric</FormLabel>
                    <Select
                      name="targetMetric"
                      value={modelFormData.targetMetric}
                      onChange={handleModelFormChange}
                      placeholder="Select metric"
                    >
                      <option value="auc">AUC-ROC</option>
                      <option value="f1">F1 Score</option>
                      <option value="precision">Precision</option>
                      <option value="recall">Recall</option>
                      <option value="rmse">RMSE</option>
                      <option value="mae">MAE</option>
                      <option value="silhouette">Silhouette Score</option>
                    </Select>
                  </FormControl>
                  <FormControl isRequired>
                    <FormLabel>Target Threshold</FormLabel>
                    <Input
                      name="targetThreshold"
                      value={modelFormData.targetThreshold}
                      onChange={handleModelFormChange}
                      placeholder="e.g., 0.85"
                      type="number"
                      step="0.01"
                      min="0"
                      max="1"
                    />
                  </FormControl>
                </Grid>
                <FormControl>
                  <FormLabel>Version</FormLabel>
                  <Input
                    name="version"
                    value={modelFormData.version}
                    onChange={handleModelFormChange}
                    placeholder="e.g., 1.0.0"
                  />
                </FormControl>
              </VStack>
            </ModalBody>
            <ModalFooter>
              <Button variant="ghost" mr={3} onClick={onNewModelClose}>
                Cancel
              </Button>
              <Button colorScheme="blue" type="submit">
                Create Model
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>

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

      {/* Dataset Upload Modal */}
      <Modal isOpen={isUploadDatasetOpen} onClose={onUploadDatasetClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <form onSubmit={handleDatasetUpload}>
            <ModalHeader>Upload Dataset</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <VStack spacing={4}>
                <FormControl isRequired>
                  <FormLabel>Dataset Name</FormLabel>
                  <Input placeholder="e.g., Customer Transactions 2025" />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>Dataset Type</FormLabel>
                  <Select placeholder="Select dataset type">
                    <option value="tabular">Tabular Data (CSV, Excel)</option>
                    <option value="text">Text Data</option>
                    <option value="image">Image Data</option>
                    <option value="time_series">Time Series Data</option>
                    <option value="structured">Structured Data (JSON)</option>
                    <option value="graph">Graph Data</option>
                  </Select>
                </FormControl>
                <FormControl>
                  <FormLabel>Description</FormLabel>
                  <Textarea placeholder="Enter dataset description, schema, and any relevant notes" />
                </FormControl>
                <FormControl>
                  <FormLabel>Tags</FormLabel>
                  <Input placeholder="Enter comma-separated tags (e.g., finance, customer, transactions)" />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>File</FormLabel>
                  <Input type="file" accept=".csv,.xlsx,.json,.txt,.parquet,.arrow" />
                </FormControl>
                <FormControl>
                  <FormLabel mb="0">
                    <HStack spacing={2}>
                      <Text>Auto-process after upload</Text>
                      <Switch defaultChecked />
                    </HStack>
                  </FormLabel>
                  <Text fontSize="sm" color="gray.500" mt={1}>
                    Automatically validate, clean, and prepare the dataset for model training
                  </Text>
                </FormControl>
                <FormControl>
                  <FormLabel mb="0">
                    <HStack spacing={2}>
                      <Text>Schedule periodic refresh</Text>
                      <Switch />
                    </HStack>
                  </FormLabel>
                </FormControl>
                {isUploading && (
                  <Box w="100%">
                    <Progress
                      value={uploadProgress}
                      size="sm"
                      colorScheme="blue"
                      hasStripe
                      isAnimated
                    />
                    <Text mt={2} fontSize="sm" color="gray.600">
                      Uploading... {uploadProgress}%
                    </Text>
                  </Box>
                )}
              </VStack>
            </ModalBody>
            <ModalFooter>
              <Button variant="ghost" mr={3} onClick={onUploadDatasetClose}>
                Cancel
              </Button>
              <Button
                colorScheme="blue"
                type="submit"
                isLoading={isUploading}
                loadingText="Uploading..."
              >
                Upload Dataset
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>

      {/* Export Modal */}
      <Modal isOpen={isExportOpen} onClose={onExportClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Export Data</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <Button
                w="100%"
                leftIcon={<FiDownload />}
                onClick={() => handleExport('csv')}
              >
                Export as CSV
              </Button>
              <Button
                w="100%"
                leftIcon={<FiDownload />}
                onClick={() => handleExport('excel')}
              >
                Export as Excel
              </Button>
              <Button
                w="100%"
                leftIcon={<FiDownload />}
                onClick={() => handleExport('json')}
              >
                Export as JSON
              </Button>
              <Button
                w="100%"
                leftIcon={<FiDownload />}
                onClick={() => handleExport('pdf')}
              >
                Export as PDF Report
              </Button>
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>

      {/* Stats Section */}
      <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={5} mb={8}>
        <StatCard
          label="Active Projects"
          value="12"
          change={8}
          icon={FiTrendingUp}
          color="primary"
        />
        <StatCard
          label="Risk Assessments"
          value="8"
          change={-3}
          icon={FiAlertCircle}
          color="accent"
        />
        <StatCard
          label="Models in Production"
          value="5"
          change={2}
          icon={FiCheckCircle}
          color="green"
        />
        <StatCard
          label="Pending Reviews"
          value="7"
          change={0}
          icon={FiClock}
          color="orange"
        />
      </SimpleGrid>
      
      {/* Main Content */}
      <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6} mb={8}>
        {/* Recent Activity */}
        <Card variant="activity" height="100%">
          <CardBody>
            <Heading size="md" mb={6}>Recent Activity</Heading>
            <Stack divider={<StackDivider />} spacing={6}>
              {[
                { 
                  name: 'Credit Risk Model Updated', 
                  type: 'model', 
                  date: '2 hours ago',
                  status: 'success'
                },
                { 
                  name: 'New Risk Assessment', 
                  type: 'assessment', 
                  date: '5 hours ago',
                  status: 'warning'
                },
                { 
                  name: 'Marketing Campaign Analysis', 
                  type: 'analytics', 
                  date: '1 day ago',
                  status: 'info'
                },
                { 
                  name: 'Customer Churn Predictor', 
                  type: 'model', 
                  date: '2 days ago',
                  status: 'success'
                },
              ].map((activity, idx) => (
                <HStack key={idx} spacing={4} align="center">
                  <Badge
                    px={3}
                    py={1}
                    borderRadius="full"
                    colorScheme={
                      activity.status === 'success' ? 'green' : 
                      activity.status === 'warning' ? 'orange' : 'blue'
                    }
                  >
                    {activity.type}
                  </Badge>
                  <Box flex="1">
                    <Text fontWeight="medium" mb={1}>{activity.name}</Text>
                    <Text fontSize="sm" color="gray.500">{activity.date}</Text>
                  </Box>
                </HStack>
              ))}
            </Stack>
          </CardBody>
        </Card>
        
        {/* BI Embed */}
        <Card height="100%">
          <CardBody>
            <BIEmbed />
          </CardBody>
        </Card>
      </SimpleGrid>
      
      {/* Models Table */}
      <Card mb={8}>
        <CardBody>
          <Heading size="md" mb={4}>Model Overview</Heading>
          <TableContainer>
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>Model Name</Th>
                  <Th>Type</Th>
                  <Th>Status</Th>
                  <Th>Performance</Th>
                  <Th>Last Updated</Th>
                </Tr>
              </Thead>
              <Tbody>
                <Tr>
                  <Td>Credit Risk Classifier</Td>
                  <Td>Classification</Td>
                  <Td><Badge colorScheme="green">Production</Badge></Td>
                  <Td>AUC: 0.82</Td>
                  <Td>2023-11-02</Td>
                </Tr>
                <Tr>
                  <Td>Customer Churn Predictor</Td>
                  <Td>Classification</Td>
                  <Td><Badge colorScheme="green">Production</Badge></Td>
                  <Td>F1: 0.76</Td>
                  <Td>2023-10-28</Td>
                </Tr>
                <Tr>
                  <Td>Price Forecaster</Td>
                  <Td>Regression</Td>
                  <Td><Badge colorScheme="yellow">Validation</Badge></Td>
                  <Td>RMSE: 0.31</Td>
                  <Td>2023-11-01</Td>
                </Tr>
                <Tr>
                  <Td>Fraud Detection</Td>
                  <Td>Classification</Td>
                  <Td><Badge colorScheme="green">Production</Badge></Td>
                  <Td>Precision: 0.91</Td>
                  <Td>2023-10-15</Td>
                </Tr>
                <Tr>
                  <Td>Market Segmentation</Td>
                  <Td>Clustering</Td>
                  <Td><Badge colorScheme="red">Development</Badge></Td>
                  <Td>Silhouette: 0.68</Td>
                  <Td>2023-11-03</Td>
                </Tr>
              </Tbody>
            </Table>
          </TableContainer>
        </CardBody>
      </Card>
    </DashboardLayout>
  );
} 