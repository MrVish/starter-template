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
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Tag,
} from '@chakra-ui/react';
import {
  FiUpload,
  FiDownload,
  FiBarChart2,
  FiMoreVertical,
  FiSearch,
  FiGrid,
  FiList,
  FiFileText,
  FiDatabase,
  FiImage,
  FiCode,
  FiClock,
  FiMusic,
  FiCalendar,
  FiUsers,
} from 'react-icons/fi';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { useDisclosure } from '@chakra-ui/react';

// Define the Model interface
interface Model {
  id: number;
  name: string;
  description: string;
  type: string;
  status: string;
  accuracy: number;
  lastUpdated: string;
  hasWarnings: boolean;
  version: string;
  tags: string[];
  owner: string;
}

// Sample model data
const MODELS: Model[] = [
  {
    id: 1,
    name: 'Credit Risk Classifier',
    description: 'Machine learning model for predicting credit risk based on customer data',
    type: 'classification',
    status: 'Active',
    accuracy: 92.5,
    lastUpdated: '2025-04-20',
    hasWarnings: false,
    version: '1.2.0',
    tags: ['credit', 'risk', 'classification'],
    owner: 'Data Science Team',
  },
  {
    id: 2,
    name: 'Customer Churn Predictor',
    description: 'Predicts customer churn based on behavior patterns and demographics',
    type: 'classification',
    status: 'Active',
    accuracy: 88.7,
    lastUpdated: '2025-04-18',
    hasWarnings: false,
    version: '2.1.0',
    tags: ['churn', 'customer', 'prediction'],
    owner: 'Data Science Team',
  },
  {
    id: 3,
    name: 'Price Optimization',
    description: 'Dynamic pricing model for maximizing revenue and market share',
    type: 'regression',
    status: 'Training',
    accuracy: 85.2,
    lastUpdated: '2025-04-15',
    hasWarnings: true,
    version: '1.0.0',
    tags: ['pricing', 'optimization', 'regression'],
    owner: 'Data Science Team',
  },
  {
    id: 4,
    name: 'Fraud Detection',
    description: 'Real-time fraud detection using anomaly detection techniques',
    type: 'anomaly',
    status: 'Active',
    accuracy: 95.8,
    lastUpdated: '2025-04-10',
    hasWarnings: false,
    version: '3.0.0',
    tags: ['fraud', 'anomaly', 'security'],
    owner: 'Data Science Team',
  },
  {
    id: 5,
    name: 'Customer Segmentation',
    description: 'Clustering model for customer segmentation and targeting',
    type: 'clustering',
    status: 'Active',
    accuracy: 89.3,
    lastUpdated: '2025-04-05',
    hasWarnings: false,
    version: '2.0.0',
    tags: ['segmentation', 'clustering', 'marketing'],
    owner: 'Data Science Team',
  },
  {
    id: 6,
    name: 'Demand Forecasting',
    description: 'Time series forecasting for product demand prediction',
    type: 'regression',
    status: 'Training',
    accuracy: 82.1,
    lastUpdated: '2025-04-01',
    hasWarnings: true,
    version: '1.5.0',
    tags: ['forecasting', 'time-series', 'demand'],
    owner: 'Data Science Team',
  },
];

export default function Models() {
  const { isOpen: isNewModelOpen, onOpen: onNewModelOpen, onClose: onNewModelClose } = useDisclosure();
  const [viewMode, setViewMode] = useState('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [selectedModel, setSelectedModel] = useState<Model | null>(null);
  const [modelFormData, setModelFormData] = useState({
    name: '',
    type: '',
    description: '',
    dataset: '',
    hyperparameters: '',
    targetMetric: '',
    targetThreshold: '',
    version: '',
  });
  
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const toast = useToast();
  
  // Filter models based on search query and filters
  const filteredModels = MODELS.filter(model => {
    const matchesSearch = model.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      model.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === 'All' || model.type === filterType;
    const matchesStatus = filterStatus === 'All' || model.status === filterStatus;
    return matchesSearch && matchesType && matchesStatus;
  });
  
  const getStatusColor = (status) => {
    switch(status) {
      case 'Production': return 'green';
      case 'Validation': return 'yellow';
      case 'Development': return 'red';
      default: return 'gray';
    }
  };
  
  // Handle form input changes
  const handleModelFormChange = (e) => {
    const { name, value } = e.target;
    setModelFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle form submission
  const handleNewModel = (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (!modelFormData.name || !modelFormData.type || !modelFormData.description || !modelFormData.dataset) {
      toast({
        title: 'Missing required fields',
        description: 'Please fill in all required fields',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    // Here you would typically make an API call to create the model
    console.log('Creating new model:', modelFormData);
    
    // Show success message
    toast({
      title: 'Model created',
      description: 'Your new model has been created successfully',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });

    // Reset form and close modal
    setModelFormData({
      name: '',
      type: '',
      description: '',
      dataset: '',
      hyperparameters: '',
      targetMetric: '',
      targetThreshold: '',
      version: ''
    });
    onNewModelClose();
  };

  return (
    <DashboardLayout>
      <Box mb={6}>
        <Flex justify="space-between" align="center" mb={6}>
          <Heading as="h1" size="xl" color="secondary.700">
            Models
          </Heading>
          <HStack spacing={4}>
            <Button
              leftIcon={<FiUpload />}
              colorScheme="blue"
              size="md"
              px={6}
              fontWeight="medium"
              _hover={{ transform: 'translateY(-1px)', boxShadow: 'lg' }}
              onClick={onNewModelOpen}
            >
              New Model
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
                  Export Models
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

        {/* Main Content */}
        <Card bg={cardBg} boxShadow="sm" mb={8}>
          <CardBody>
            {/* Search and Filter */}
            <Flex mb={6} justify="space-between" align="center" wrap="wrap" gap={4}>
              <HStack spacing={4} flex={{ base: '1', md: 'initial' }}>
                <InputGroup maxW="xs">
                  <InputLeftElement pointerEvents="none">
                    <Icon as={FiSearch} color="gray.400" />
                  </InputLeftElement>
                  <Input 
                    placeholder="Search models..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </InputGroup>
                
                <Select
                  maxW="200px"
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                >
                  <option value="All">All Types</option>
                  <option value="classification">Classification</option>
                  <option value="regression">Regression</option>
                  <option value="clustering">Clustering</option>
                  <option value="anomaly">Anomaly Detection</option>
                </Select>
                
                <Select
                  maxW="200px"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <option value="All">All Status</option>
                  <option value="Active">Active</option>
                  <option value="Training">Training</option>
                  <option value="Deployed">Deployed</option>
                  <option value="Archived">Archived</option>
                </Select>
              </HStack>
              
              <HStack spacing={4}>
                <HStack spacing={1} p={1} border="1px" borderColor={borderColor} borderRadius="md">
                  <Button
                    size="sm"
                    variant={viewMode === 'grid' ? 'solid' : 'ghost'}
                    colorScheme={viewMode === 'grid' ? 'blue' : 'gray'}
                    onClick={() => setViewMode('grid')}
                    leftIcon={<FiGrid />}
                  >
                    Grid
                  </Button>
                  <Button
                    size="sm"
                    variant={viewMode === 'list' ? 'solid' : 'ghost'}
                    colorScheme={viewMode === 'list' ? 'blue' : 'gray'}
                    onClick={() => setViewMode('list')}
                    leftIcon={<FiList />}
                  >
                    List
                  </Button>
                </HStack>
              </HStack>
            </Flex>
            
            {/* Models Display */}
            {viewMode === 'grid' ? (
              <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
                {filteredModels.map((model) => (
                  <Card variant="model" key={model.id} cursor="pointer" onClick={() => setSelectedModel(model)}>
                    <CardBody>
                      <VStack align="start" spacing={2}>
                        <Heading size="md" noOfLines={1}>{model.name}</Heading>
                        <Text fontSize="sm" color="gray.600" noOfLines={2}>{model.description}</Text>
                        
                        <Divider my={2} />
                        
                        <SimpleGrid columns={2} spacing={3} width="100%">
                          <Box>
                            <Text fontSize="xs" color="gray.500">Type</Text>
                            <Text fontWeight="medium">{model.type}</Text>
                          </Box>
                          <Box>
                            <Text fontSize="xs" color="gray.500">Status</Text>
                            <Badge colorScheme={model.status === 'Active' ? 'green' : model.status === 'Training' ? 'yellow' : 'gray'}>
                              {model.status}
                            </Badge>
                          </Box>
                          <Box>
                            <Text fontSize="xs" color="gray.500">Accuracy</Text>
                            <Text fontWeight="medium">{model.accuracy}%</Text>
                          </Box>
                          <Box>
                            <Text fontSize="xs" color="gray.500">Last Updated</Text>
                            <Text fontWeight="medium">{model.lastUpdated}</Text>
                          </Box>
                        </SimpleGrid>
                        
                        <Divider my={2} />
                        
                        <HStack wrap="wrap">
                          {model.tags.map(tag => (
                            <Tag key={tag} size="sm" colorScheme="blue" variant="subtle">
                              {tag}
                            </Tag>
                          ))}
                        </HStack>
                        
                        <HStack justify="space-between" width="100%" mt={2}>
                          <Text fontSize="xs" color="gray.500">
                            <Icon as={FiCalendar} mr={1} />
                            {model.lastUpdated}
                          </Text>
                          <Text fontSize="xs" color="gray.500">
                            <Icon as={FiUsers} mr={1} />
                            {model.owner}
                          </Text>
                        </HStack>
                      </VStack>
                    </CardBody>
                  </Card>
                ))}
              </SimpleGrid>
            ) : (
              <Table variant="simple">
                <Thead>
                  <Tr>
                    <Th>Name</Th>
                    <Th>Type</Th>
                    <Th>Status</Th>
                    <Th>Accuracy</Th>
                    <Th>Last Updated</Th>
                    <Th>Owner</Th>
                    <Th>Tags</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {filteredModels.map((model) => (
                    <Tr 
                      key={model.id} 
                      cursor="pointer" 
                      _hover={{ bg: "gray.50" }}
                      onClick={() => setSelectedModel(model)}
                    >
                      <Td fontWeight="medium">{model.name}</Td>
                      <Td>{model.type}</Td>
                      <Td>
                        <Badge colorScheme={model.status === 'Active' ? 'green' : model.status === 'Training' ? 'yellow' : 'gray'}>
                          {model.status}
                        </Badge>
                      </Td>
                      <Td>{model.accuracy}%</Td>
                      <Td>{model.lastUpdated}</Td>
                      <Td>{model.owner}</Td>
                      <Td>
                        <HStack wrap="wrap">
                          {model.tags.slice(0, 2).map(tag => (
                            <Tag key={tag} size="sm" colorScheme="blue" variant="subtle">
                              {tag}
                            </Tag>
                          ))}
                          {model.tags.length > 2 && (
                            <Badge colorScheme="blue">+{model.tags.length - 2}</Badge>
                          )}
                        </HStack>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            )}
          </CardBody>
        </Card>
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
    </DashboardLayout>
  );
} 