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
  Tag,
  TagLabel,
  TagCloseButton,
  HStack,
  VStack,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Grid,
  GridItem,
  Divider,
  Badge,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useColorModeValue,
  Stack,
  IconButton,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  useToast,
  Progress,
  FormControl,
  FormLabel,
  Textarea,
} from '@chakra-ui/react';
import {
  FiDatabase,
  FiSearch,
  FiFilter,
  FiDownload,
  FiUpload,
  FiBarChart2,
  FiPieChart,
  FiList,
  FiGrid,
  FiChevronDown,
  FiInfo,
  FiFileText,
  FiCalendar,
  FiUsers,
  FiTag,
  FiAlertTriangle,
  FiCheckCircle,
  FiMoreVertical,
  FiImage,
  FiCode,
  FiClock,
  FiMusic,
} from 'react-icons/fi';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { useSession } from 'next-auth/react';
import { useDisclosure } from '@chakra-ui/react';

// Sample dataset list
const DATASETS = [
  {
    id: 1,
    name: 'Customer Transactions',
    description: 'Transaction data including purchase history, amounts, and frequencies',
    size: '2.3 GB',
    rows: 1245678,
    columns: 24,
    lastUpdated: '2023-11-01',
    tags: ['financial', 'transactions', 'customers'],
    owner: 'Data Engineering',
    type: 'Database',
    usedBy: ['Credit Risk Classifier', 'Fraud Detection'],
  },
  {
    id: 2,
    name: 'User Demographics',
    description: 'User profile data including age, location, and preferences',
    size: '450 MB',
    rows: 342109,
    columns: 18,
    lastUpdated: '2023-10-25',
    tags: ['demographic', 'users', 'profiles'],
    owner: 'Marketing',
    type: 'CSV',
    usedBy: ['Customer Churn Predictor', 'Market Segmentation'],
  },
  {
    id: 3,
    name: 'Product Inventory',
    description: 'Product catalog with prices, categories, and inventory levels',
    size: '120 MB',
    rows: 52478,
    columns: 15,
    lastUpdated: '2023-11-04',
    tags: ['products', 'inventory', 'prices'],
    owner: 'Supply Chain',
    type: 'Database',
    usedBy: ['Price Forecaster'],
  },
  {
    id: 4,
    name: 'Customer Support Tickets',
    description: 'Support ticket history including issue types, resolution times, and sentiment',
    size: '780 MB',
    rows: 521364,
    columns: 22,
    lastUpdated: '2023-10-28',
    tags: ['support', 'tickets', 'sentiment'],
    owner: 'Customer Success',
    type: 'JSON',
    usedBy: ['Customer Churn Predictor'],
  },
  {
    id: 5,
    name: 'Marketing Campaigns',
    description: 'Campaign data with channels, budgets, and performance metrics',
    size: '350 MB',
    rows: 12459,
    columns: 28,
    lastUpdated: '2023-11-02',
    tags: ['marketing', 'campaigns', 'performance'],
    owner: 'Marketing',
    type: 'CSV',
    usedBy: ['Market Segmentation'],
  },
];

// Sample columns for the first dataset
const SAMPLE_COLUMNS = [
  { name: 'transaction_id', type: 'string', description: 'Unique transaction identifier', nullable: false },
  { name: 'customer_id', type: 'string', description: 'Customer identifier', nullable: false },
  { name: 'transaction_date', type: 'datetime', description: 'Date and time of transaction', nullable: false },
  { name: 'amount', type: 'float', description: 'Transaction amount', nullable: false },
  { name: 'currency', type: 'string', description: 'Currency code', nullable: false },
  { name: 'product_id', type: 'string', description: 'Product identifier', nullable: false },
  { name: 'quantity', type: 'integer', description: 'Number of items purchased', nullable: false },
  { name: 'payment_method', type: 'string', description: 'Method of payment', nullable: true },
  { name: 'store_id', type: 'string', description: 'Store identifier', nullable: true },
  { name: 'channel', type: 'string', description: 'Sales channel (online, in-store)', nullable: true },
  { name: 'promotion_id', type: 'string', description: 'Promotion identifier if applicable', nullable: true },
  { name: 'device_type', type: 'string', description: 'Device used for online transactions', nullable: true },
];

// Sample dataset preview rows
const SAMPLE_DATA = [
  {
    transaction_id: 'TX10045923',
    customer_id: 'CUST78945',
    transaction_date: '2023-10-15 14:32:45',
    amount: 124.99,
    currency: 'USD',
    product_id: 'PROD4532',
    quantity: 1,
    payment_method: 'credit_card',
    store_id: null,
    channel: 'online',
    promotion_id: 'PROMO25',
    device_type: 'mobile',
  },
  {
    transaction_id: 'TX10045924',
    customer_id: 'CUST12385',
    transaction_date: '2023-10-15 14:35:12',
    amount: 89.50,
    currency: 'USD',
    product_id: 'PROD2341',
    quantity: 2,
    payment_method: 'paypal',
    store_id: null,
    channel: 'online',
    promotion_id: null,
    device_type: 'desktop',
  },
  {
    transaction_id: 'TX10045925',
    customer_id: 'CUST54321',
    transaction_date: '2023-10-15 15:02:33',
    amount: 210.75,
    currency: 'USD',
    product_id: 'PROD6789',
    quantity: 3,
    payment_method: 'credit_card',
    store_id: 'STORE123',
    channel: 'in-store',
    promotion_id: null,
    device_type: null,
  },
  {
    transaction_id: 'TX10045926',
    customer_id: 'CUST78945',
    transaction_date: '2023-10-15 15:10:05',
    amount: 55.25,
    currency: 'USD',
    product_id: 'PROD7890',
    quantity: 1,
    payment_method: 'store_credit',
    store_id: 'STORE456',
    channel: 'in-store',
    promotion_id: 'PROMO10',
    device_type: null,
  },
];

export default function DataExplorer() {
  const { data: session } = useSession();
  const [viewMode, setViewMode] = useState('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const [selectedDataset, setSelectedDataset] = useState(DATASETS[0]);
  const { isOpen: isUploadOpen, onOpen: onUploadOpen, onClose: onUploadClose } = useDisclosure();
  const [uploadFormData, setUploadFormData] = useState({
    name: '',
    description: '',
    type: '',
    source: '',
    format: '',
    tags: []
  });
  
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const toast = useToast();
  
  // Filter datasets based on search query and selected tags
  const filteredDatasets = DATASETS.filter(dataset => {
    const matchesSearch = dataset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        dataset.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesTags = selectedTags.length === 0 || 
                       selectedTags.every(tag => dataset.tags.includes(tag));
    
    return matchesSearch && matchesTags;
  });
  
  // Add a tag to the filter
  const addTag = (tag) => {
    if (!selectedTags.includes(tag)) {
      setSelectedTags([...selectedTags, tag]);
    }
  };
  
  // Remove a tag from the filter
  const removeTag = (tag) => {
    setSelectedTags(selectedTags.filter(t => t !== tag));
  };
  
  // All available tags
  const allTags = Array.from(new Set(DATASETS.flatMap(dataset => dataset.tags)));
  
  // Handle form input changes
  const handleUploadFormChange = (e) => {
    const { name, value } = e.target;
    setUploadFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle form submission
  const handleUploadDataset = (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (!uploadFormData.name || !uploadFormData.type || !uploadFormData.format) {
      toast({
        title: 'Missing required fields',
        description: 'Please fill in all required fields',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    // Here you would typically make an API call to upload the dataset
    console.log('Uploading dataset:', uploadFormData);
    
    // Show success message
    toast({
      title: 'Dataset uploaded',
      description: 'Your dataset has been uploaded successfully',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });

    // Reset form and close modal
    setUploadFormData({
      name: '',
      description: '',
      type: '',
      source: '',
      format: '',
      tags: []
    });
    onUploadClose();
  };

  const getTypeIcon = (type) => {
    switch(type) {
      case 'structured': return FiDatabase;
      case 'unstructured': return FiFileText;
      case 'time_series': return FiClock;
      case 'image': return FiImage;
      case 'text': return FiCode;
      case 'audio': return FiMusic;
      default: return FiFileText;
    }
  };

  return (
    <DashboardLayout>
      <Box mb={6}>
        <Flex justify="space-between" align="center" mb={6}>
          <Heading as="h1" size="xl" color="secondary.700">
            Data Explorer
          </Heading>
          <HStack spacing={4}>
            <Button
              leftIcon={<FiUpload />}
              colorScheme="blue"
              size="md"
              px={6}
              fontWeight="medium"
              _hover={{ transform: 'translateY(-1px)', boxShadow: 'lg' }}
              onClick={onUploadOpen}
            >
              Upload Dataset
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
                  Export Datasets
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

      {/* Upload Dataset Modal */}
      <Modal isOpen={isUploadOpen} onClose={onUploadClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <form onSubmit={handleUploadDataset}>
            <ModalHeader>Upload New Dataset</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <VStack spacing={4}>
                <FormControl isRequired>
                  <FormLabel>Dataset Name</FormLabel>
                  <Input
                    name="name"
                    value={uploadFormData.name}
                    onChange={handleUploadFormChange}
                    placeholder="e.g., Customer Transactions Q1 2025"
                  />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>Dataset Type</FormLabel>
                  <Select
                    name="type"
                    value={uploadFormData.type}
                    onChange={handleUploadFormChange}
                    placeholder="Select dataset type"
                  >
                    <option value="structured">Structured Data</option>
                    <option value="unstructured">Unstructured Data</option>
                    <option value="time_series">Time Series</option>
                    <option value="image">Image Data</option>
                    <option value="text">Text Data</option>
                    <option value="audio">Audio Data</option>
                  </Select>
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>File Format</FormLabel>
                  <Select
                    name="format"
                    value={uploadFormData.format}
                    onChange={handleUploadFormChange}
                    placeholder="Select file format"
                  >
                    <option value="csv">CSV</option>
                    <option value="json">JSON</option>
                    <option value="parquet">Parquet</option>
                    <option value="excel">Excel</option>
                    <option value="sql">SQL</option>
                    <option value="hdf5">HDF5</option>
                  </Select>
                </FormControl>
                <FormControl>
                  <FormLabel>Data Source</FormLabel>
                  <Input
                    name="source"
                    value={uploadFormData.source}
                    onChange={handleUploadFormChange}
                    placeholder="e.g., Internal Database, External API, etc."
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Description</FormLabel>
                  <Textarea
                    name="description"
                    value={uploadFormData.description}
                    onChange={handleUploadFormChange}
                    placeholder="Enter dataset description and purpose"
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Tags</FormLabel>
                  <Input
                    name="tags"
                    value={uploadFormData.tags.join(', ')}
                    onChange={(e) => {
                      const tags = e.target.value.split(',').map(tag => tag.trim());
                      setUploadFormData(prev => ({ ...prev, tags }));
                    }}
                    placeholder="Enter tags separated by commas"
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Upload File</FormLabel>
                  <Input
                    type="file"
                    accept=".csv,.json,.parquet,.xlsx,.sql,.h5"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        // Handle file upload here
                        console.log('Selected file:', file);
                      }
                    }}
                  />
                </FormControl>
              </VStack>
            </ModalBody>
            <ModalFooter>
              <Button variant="ghost" mr={3} onClick={onUploadClose}>
                Cancel
              </Button>
              <Button colorScheme="blue" type="submit">
                Upload Dataset
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>

      {/* Top Stats */}
      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={5} mb={8}>
        <Card bg={cardBg} boxShadow="sm">
          <CardBody>
            <Flex justify="space-between" align="center">
              <Box>
                <Text color="gray.500">Total Datasets</Text>
                <Heading size="md">{DATASETS.length}</Heading>
              </Box>
              <Box p={2} bg="blue.50" borderRadius="full" color="blue.500">
                <Icon as={FiDatabase} boxSize={5} />
              </Box>
            </Flex>
          </CardBody>
        </Card>
        
        <Card bg={cardBg} boxShadow="sm">
          <CardBody>
            <Flex justify="space-between" align="center">
              <Box>
                <Text color="gray.500">Total Records</Text>
                <Heading size="md">{DATASETS.reduce((sum, dataset) => sum + dataset.rows, 0).toLocaleString()}</Heading>
              </Box>
              <Box p={2} bg="purple.50" borderRadius="full" color="purple.500">
                <Icon as={FiFileText} boxSize={5} />
              </Box>
            </Flex>
          </CardBody>
        </Card>
        
        <Card bg={cardBg} boxShadow="sm">
          <CardBody>
            <Flex justify="space-between" align="center">
              <Box>
                <Text color="gray.500">Used in Models</Text>
                <Heading size="md">5</Heading>
              </Box>
              <Box p={2} bg="green.50" borderRadius="full" color="green.500">
                <Icon as={FiBarChart2} boxSize={5} />
              </Box>
            </Flex>
          </CardBody>
        </Card>
      </SimpleGrid>
      
      {/* Main Content */}
      <Card mb={8} bg={cardBg} boxShadow="sm">
        <CardBody>
          <Tabs colorScheme="blue" variant="enclosed">
            <TabList>
              <Tab>Dataset Catalog</Tab>
              <Tab>Data Preview</Tab>
              <Tab>Data Quality</Tab>
            </TabList>
            
            <TabPanels>
              <TabPanel px={0}>
                {/* Search and Filter */}
                <Flex mb={6} justify="space-between" align="center" wrap="wrap" gap={4}>
                  <HStack spacing={4} flex={{ base: '1', md: 'initial' }}>
                    <InputGroup maxW="xs">
                      <InputLeftElement pointerEvents="none">
                        <Icon as={FiSearch} color="gray.400" />
                      </InputLeftElement>
                      <Input 
                        placeholder="Search datasets..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </InputGroup>
                    
                    <Menu>
                      <MenuButton
                        as={Button}
                        variant="outline"
                        size="md"
                        height="40px"
                        px={4}
                        minW="145px"
                      >
                        <Flex align="center" gap={2}>
                          <Icon as={FiTag} boxSize={5} />
                          <Text fontSize="md" fontWeight="medium" whiteSpace="nowrap">
                            Filter by Tag
                          </Text>
                          <Icon as={FiChevronDown} boxSize={5} />
                        </Flex>
                      </MenuButton>
                      <MenuList>
                        {allTags.map(tag => (
                          <MenuItem 
                            key={tag} 
                            onClick={() => addTag(tag)}
                            isDisabled={selectedTags.includes(tag)}
                          >
                            {tag}
                          </MenuItem>
                        ))}
                      </MenuList>
                    </Menu>
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
                
                {/* Selected Tags */}
                {selectedTags.length > 0 && (
                  <Box mb={4}>
                    <HStack spacing={2} flexWrap="wrap">
                      {selectedTags.map(tag => (
                        <Tag key={tag} size="md" borderRadius="full" variant="subtle" colorScheme="blue" m={1}>
                          <TagLabel>{tag}</TagLabel>
                          <TagCloseButton onClick={() => removeTag(tag)} />
                        </Tag>
                      ))}
                      <Button size="xs" variant="link" onClick={() => setSelectedTags([])}>
                        Clear All
                      </Button>
                    </HStack>
                  </Box>
                )}
                
                {/* Datasets Display */}
                {viewMode === 'grid' ? (
                  <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
                    {filteredDatasets.map((dataset) => (
                      <Card variant="dataset" key={dataset.id} cursor="pointer" onClick={() => setSelectedDataset(dataset)}>
                        <CardBody>
                          <VStack align="start" spacing={2}>
                            <Heading size="md" noOfLines={1}>{dataset.name}</Heading>
                            <Text fontSize="sm" color="gray.600" noOfLines={2}>{dataset.description}</Text>
                            
                            <Divider my={2} />
                            
                            <SimpleGrid columns={2} spacing={3} width="100%">
                              <Box>
                                <Text fontSize="xs" color="gray.500">Rows</Text>
                                <Text fontWeight="medium">{dataset.rows.toLocaleString()}</Text>
                              </Box>
                              <Box>
                                <Text fontSize="xs" color="gray.500">Columns</Text>
                                <Text fontWeight="medium">{dataset.columns}</Text>
                              </Box>
                              <Box>
                                <Text fontSize="xs" color="gray.500">Size</Text>
                                <Text fontWeight="medium">{dataset.size}</Text>
                              </Box>
                              <Box>
                                <Text fontSize="xs" color="gray.500">Type</Text>
                                <Text fontWeight="medium">{dataset.type}</Text>
                              </Box>
                            </SimpleGrid>
                            
                            <Divider my={2} />
                            
                            <HStack wrap="wrap">
                              {dataset.tags.map(tag => (
                                <Tag key={tag} size="sm" colorScheme="blue" variant="subtle">
                                  {tag}
                                </Tag>
                              ))}
                            </HStack>
                            
                            <HStack justify="space-between" width="100%" mt={2}>
                              <Text fontSize="xs" color="gray.500">
                                <Icon as={FiCalendar} mr={1} />
                                {dataset.lastUpdated}
                              </Text>
                              <Text fontSize="xs" color="gray.500">
                                <Icon as={FiUsers} mr={1} />
                                {dataset.owner}
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
                        <Th>Size</Th>
                        <Th>Rows</Th>
                        <Th>Columns</Th>
                        <Th>Last Updated</Th>
                        <Th>Owner</Th>
                        <Th>Tags</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {filteredDatasets.map((dataset) => (
                        <Tr 
                          key={dataset.id} 
                          cursor="pointer" 
                          _hover={{ bg: "gray.50" }}
                          onClick={() => setSelectedDataset(dataset)}
                        >
                          <Td fontWeight="medium">{dataset.name}</Td>
                          <Td>{dataset.type}</Td>
                          <Td>{dataset.size}</Td>
                          <Td>{dataset.rows.toLocaleString()}</Td>
                          <Td>{dataset.columns}</Td>
                          <Td>{dataset.lastUpdated}</Td>
                          <Td>{dataset.owner}</Td>
                          <Td>
                            <HStack wrap="wrap">
                              {dataset.tags.slice(0, 2).map(tag => (
                                <Tag key={tag} size="sm" colorScheme="blue" variant="subtle">
                                  {tag}
                                </Tag>
                              ))}
                              {dataset.tags.length > 2 && (
                                <Badge colorScheme="blue">+{dataset.tags.length - 2}</Badge>
                              )}
                            </HStack>
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                )}
              </TabPanel>
              
              <TabPanel px={0}>
                <VStack spacing={6} align="stretch">
                  <Flex justify="space-between" align="center">
                    <Heading size="md">{selectedDataset.name}</Heading>
                    <Button leftIcon={<FiDownload />} size="sm">
                      Export
                    </Button>
                  </Flex>
                  
                  <Text>{selectedDataset.description}</Text>
                  
                  <Box overflowX="auto">
                    <Heading size="sm" mb={3}>Data Schema</Heading>
                    <Table variant="simple" size="sm">
                      <Thead>
                        <Tr>
                          <Th>Column Name</Th>
                          <Th>Type</Th>
                          <Th>Description</Th>
                          <Th>Nullable</Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {SAMPLE_COLUMNS.map((column) => (
                          <Tr key={column.name}>
                            <Td fontFamily="mono">{column.name}</Td>
                            <Td>
                              <Badge colorScheme={
                                column.type === 'string' ? 'green' :
                                column.type === 'integer' || column.type === 'float' ? 'blue' :
                                column.type === 'datetime' ? 'purple' : 'gray'
                              }>
                                {column.type}
                              </Badge>
                            </Td>
                            <Td>{column.description}</Td>
                            <Td>{column.nullable ? 'Yes' : 'No'}</Td>
                          </Tr>
                        ))}
                      </Tbody>
                    </Table>
                  </Box>
                  
                  <Box overflowX="auto">
                    <Heading size="sm" mb={3}>Data Preview</Heading>
                    <Table variant="simple" size="sm">
                      <Thead>
                        <Tr>
                          {Object.keys(SAMPLE_DATA[0]).map((key) => (
                            <Th key={key}>{key}</Th>
                          ))}
                        </Tr>
                      </Thead>
                      <Tbody>
                        {SAMPLE_DATA.map((row, idx) => (
                          <Tr key={idx}>
                            {Object.values(row).map((value, i) => (
                              <Td key={i}>{value !== null ? value.toString() : 'NULL'}</Td>
                            ))}
                          </Tr>
                        ))}
                      </Tbody>
                    </Table>
                  </Box>
                  
                  <HStack>
                    <Text color="gray.500" fontSize="sm">Showing 4 of {selectedDataset.rows.toLocaleString()} rows</Text>
                  </HStack>
                </VStack>
              </TabPanel>
              
              <TabPanel>
                <VStack spacing={6} align="stretch">
                  <Flex justify="space-between" align="center">
                    <Heading size="md">Data Quality Analysis: {selectedDataset.name}</Heading>
                    <Menu>
                      <MenuButton as={Button} rightIcon={<FiChevronDown />} size="sm">
                        Actions
                      </MenuButton>
                      <MenuList>
                        <MenuItem icon={<FiBarChart2 />}>Run Quality Check</MenuItem>
                        <MenuItem icon={<FiDownload />}>Export Report</MenuItem>
                      </MenuList>
                    </Menu>
                  </Flex>
                  
                  <SimpleGrid columns={{ base: 1, md: 3 }} spacing={5}>
                    <Card variant="outline">
                      <CardBody>
                        <VStack>
                          <Heading size="md" color="green.500">96.8%</Heading>
                          <Text fontWeight="medium">Completeness</Text>
                          <Text fontSize="sm" color="gray.500" textAlign="center">
                            Percentage of non-null values across all fields
                          </Text>
                        </VStack>
                      </CardBody>
                    </Card>
                    
                    <Card variant="outline">
                      <CardBody>
                        <VStack>
                          <Heading size="md" color="orange.500">88.2%</Heading>
                          <Text fontWeight="medium">Consistency</Text>
                          <Text fontSize="sm" color="gray.500" textAlign="center">
                            Compliance with data format and business rules
                          </Text>
                        </VStack>
                      </CardBody>
                    </Card>
                    
                    <Card variant="outline">
                      <CardBody>
                        <VStack>
                          <Heading size="md" color="blue.500">99.1%</Heading>
                          <Text fontWeight="medium">Validity</Text>
                          <Text fontSize="sm" color="gray.500" textAlign="center">
                            Data adheres to defined formats and value ranges
                          </Text>
                        </VStack>
                      </CardBody>
                    </Card>
                  </SimpleGrid>
                  
                  <Grid templateColumns={{ base: "repeat(1, 1fr)", md: "repeat(3, 1fr)" }} gap={6}>
                    <GridItem colSpan={{ base: 1, md: 2 }}>
                      <Card variant="outline" h="100%">
                        <CardBody>
                          <Heading size="sm" mb={4}>Column Quality Metrics</Heading>
                          <Table variant="simple" size="sm">
                            <Thead>
                              <Tr>
                                <Th>Column</Th>
                                <Th>Completeness</Th>
                                <Th>Uniqueness</Th>
                                <Th>Issues</Th>
                              </Tr>
                            </Thead>
                            <Tbody>
                              <Tr>
                                <Td>transaction_id</Td>
                                <Td>100%</Td>
                                <Td>100%</Td>
                                <Td>None</Td>
                              </Tr>
                              <Tr>
                                <Td>customer_id</Td>
                                <Td>100%</Td>
                                <Td>82.5%</Td>
                                <Td>None</Td>
                              </Tr>
                              <Tr>
                                <Td>transaction_date</Td>
                                <Td>100%</Td>
                                <Td>98.7%</Td>
                                <Td>None</Td>
                              </Tr>
                              <Tr>
                                <Td>payment_method</Td>
                                <Td>94.2%</Td>
                                <Td>N/A</Td>
                                <Td>Missing values</Td>
                              </Tr>
                              <Tr>
                                <Td>store_id</Td>
                                <Td>76.4%</Td>
                                <Td>N/A</Td>
                                <Td>Missing values</Td>
                              </Tr>
                              <Tr>
                                <Td>device_type</Td>
                                <Td>81.3%</Td>
                                <Td>N/A</Td>
                                <Td>Missing values</Td>
                              </Tr>
                            </Tbody>
                          </Table>
                        </CardBody>
                      </Card>
                    </GridItem>
                    
                    <GridItem colSpan={1}>
                      <Card variant="outline" h="100%">
                        <CardBody>
                          <Heading size="sm" mb={4}>Detected Issues</Heading>
                          <VStack align="start" spacing={4}>
                            <Box p={3} bg="orange.50" borderRadius="md" width="100%">
                              <Flex>
                                <Icon as={FiAlertTriangle} color="orange.500" mt={1} mr={2} />
                                <Box>
                                  <Text fontWeight="medium" color="orange.700">Missing Store IDs</Text>
                                  <Text fontSize="sm">23.6% of records have missing store_id values</Text>
                                </Box>
                              </Flex>
                            </Box>
                            
                            <Box p={3} bg="yellow.50" borderRadius="md" width="100%">
                              <Flex>
                                <Icon as={FiInfo} color="yellow.500" mt={1} mr={2} />
                                <Box>
                                  <Text fontWeight="medium" color="yellow.700">Duplicate Transactions</Text>
                                  <Text fontSize="sm">2 potential duplicate transaction entries detected</Text>
                                </Box>
                              </Flex>
                            </Box>
                            
                            <Box p={3} bg="green.50" borderRadius="md" width="100%">
                              <Flex>
                                <Icon as={FiCheckCircle} color="green.500" mt={1} mr={2} />
                                <Box>
                                  <Text fontWeight="medium" color="green.700">Valid Amount Range</Text>
                                  <Text fontSize="sm">All transaction amounts are within expected range</Text>
                                </Box>
                              </Flex>
                            </Box>
                          </VStack>
                        </CardBody>
                      </Card>
                    </GridItem>
                  </Grid>
                </VStack>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </CardBody>
      </Card>
    </DashboardLayout>
  );
} 