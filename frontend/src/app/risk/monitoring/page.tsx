'use client';

import React from 'react';
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
  HStack,
  VStack,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  Badge,
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
  Progress,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useColorModeValue,
} from '@chakra-ui/react';
import {
  FiActivity,
  FiAlertTriangle,
  FiBarChart2,
  FiClock,
  FiDownload,
  FiInfo,
  FiRefreshCw,
  FiSettings,
  FiTrendingDown,
  FiTrendingUp,
  FiChevronDown,
} from 'react-icons/fi';
import DashboardLayout from '../../../components/layout/DashboardLayout';

// Sample monitoring data for models
const MODELS_MONITORING = [
  {
    id: 1,
    name: 'Credit Risk Classifier',
    status: 'Healthy',
    lastChecked: '2023-11-05 (2 hours ago)',
    driftScore: 0.12,
    dataQualityScore: 0.95,
    performanceMetric: 'AUC',
    performanceValue: 0.82,
    performanceTrend: 'stable',
    alerts: 0,
  },
  {
    id: 2,
    name: 'Customer Churn Predictor',
    status: 'Warning',
    lastChecked: '2023-11-05 (5 hours ago)',
    driftScore: 0.38,
    dataQualityScore: 0.82,
    performanceMetric: 'F1',
    performanceValue: 0.76,
    performanceTrend: 'decreasing',
    alerts: 2,
  },
  {
    id: 3,
    name: 'Price Forecaster',
    status: 'Healthy',
    lastChecked: '2023-11-04 (1 day ago)',
    driftScore: 0.08,
    dataQualityScore: 0.91,
    performanceMetric: 'RMSE',
    performanceValue: 0.31,
    performanceTrend: 'improving',
    alerts: 0,
  },
  {
    id: 4,
    name: 'Fraud Detection',
    status: 'Critical',
    lastChecked: '2023-11-05 (3 hours ago)',
    driftScore: 0.72,
    dataQualityScore: 0.64,
    performanceMetric: 'Precision',
    performanceValue: 0.81,
    performanceTrend: 'decreasing',
    alerts: 5,
  },
  {
    id: 5,
    name: 'Market Segmentation',
    status: 'Warning',
    lastChecked: '2023-11-04 (1 day ago)',
    driftScore: 0.22,
    dataQualityScore: 0.88,
    performanceMetric: 'Silhouette',
    performanceValue: 0.68,
    performanceTrend: 'stable',
    alerts: 1,
  },
];

// Sample alerts data
const ALERTS = [
  {
    id: 1,
    model: 'Fraud Detection',
    type: 'Data Drift',
    severity: 'Critical',
    message: 'Significant drift detected in feature "transaction_amount"',
    timestamp: '2023-11-05 14:32',
  },
  {
    id: 2,
    model: 'Fraud Detection',
    type: 'Performance Drop',
    severity: 'High',
    message: 'Precision dropped from 0.92 to 0.81 in the last 24 hours',
    timestamp: '2023-11-05 10:15',
  },
  {
    id: 3,
    model: 'Customer Churn Predictor',
    type: 'Data Quality',
    severity: 'Medium',
    message: 'Increased missing values in feature "last_purchase_date"',
    timestamp: '2023-11-05 09:45',
  },
  {
    id: 4,
    model: 'Fraud Detection',
    type: 'Operational',
    severity: 'Medium',
    message: 'Model response time increased by 250ms',
    timestamp: '2023-11-05 08:20',
  },
  {
    id: 5,
    model: 'Customer Churn Predictor',
    type: 'Data Drift',
    severity: 'Low',
    message: 'Minor drift detected in feature "login_count"',
    timestamp: '2023-11-05 07:12',
  },
  {
    id: 6,
    model: 'Market Segmentation',
    type: 'Data Quality',
    severity: 'Low',
    message: 'Outlier detected in feature "purchase_amount"',
    timestamp: '2023-11-04 22:45',
  },
  {
    id: 7,
    model: 'Fraud Detection',
    type: 'System',
    severity: 'High',
    message: 'Model prediction service restarted due to memory issue',
    timestamp: '2023-11-04 16:33',
  },
];

// Component for model monitoring card
const ModelMonitoringCard = ({ model }) => {
  const getStatusColor = (status) => {
    switch(status) {
      case 'Healthy': return 'green';
      case 'Warning': return 'orange';
      case 'Critical': return 'red';
      default: return 'gray';
    }
  };
  
  const getTrendIcon = (trend) => {
    switch(trend) {
      case 'improving': return <Icon as={FiTrendingUp} color="green.500" />;
      case 'decreasing': return <Icon as={FiTrendingDown} color="red.500" />;
      default: return <Icon as={FiActivity} color="blue.500" />;
    }
  };
  
  return (
    <Card boxShadow="sm">
      <CardBody>
        <Flex justify="space-between" mb={3}>
          <Heading size="md">{model.name}</Heading>
          <Badge colorScheme={getStatusColor(model.status)}>
            {model.status}
          </Badge>
        </Flex>
        
        <Text fontSize="sm" color="gray.500" mb={4}>
          Last checked: {model.lastChecked}
        </Text>
        
        <SimpleGrid columns={2} spacing={4} mb={4}>
          <Box>
            <Text fontSize="sm" fontWeight="medium">Drift Score</Text>
            <HStack>
              <Progress 
                value={(1 - model.driftScore) * 100} 
                size="xs" 
                width="60px"
                colorScheme={model.driftScore < 0.2 ? "green" : model.driftScore < 0.5 ? "orange" : "red"}
                borderRadius="full"
              />
              <Text>{model.driftScore.toFixed(2)}</Text>
            </HStack>
          </Box>
          
          <Box>
            <Text fontSize="sm" fontWeight="medium">Data Quality</Text>
            <HStack>
              <Progress 
                value={model.dataQualityScore * 100} 
                size="xs" 
                width="60px"
                colorScheme={model.dataQualityScore > 0.9 ? "green" : model.dataQualityScore > 0.7 ? "orange" : "red"}
                borderRadius="full"
              />
              <Text>{model.dataQualityScore.toFixed(2)}</Text>
            </HStack>
          </Box>
        </SimpleGrid>
        
        <HStack justify="space-between">
          <VStack align="start" spacing={0}>
            <Text fontSize="sm" fontWeight="medium">{model.performanceMetric}</Text>
            <HStack>
              <Text>{model.performanceValue.toFixed(2)}</Text>
              {getTrendIcon(model.performanceTrend)}
            </HStack>
          </VStack>
          
          {model.alerts > 0 && (
            <Badge colorScheme="red" borderRadius="full" px={2}>
              {model.alerts} {model.alerts === 1 ? 'Alert' : 'Alerts'}
            </Badge>
          )}
        </HStack>
      </CardBody>
    </Card>
  );
};

export default function RiskMonitoring() {
  const cardBg = useColorModeValue('white', 'gray.800');
  
  const getAlertSeverityColor = (severity) => {
    switch(severity) {
      case 'Critical': return 'red';
      case 'High': return 'orange';
      case 'Medium': return 'yellow';
      case 'Low': return 'blue';
      default: return 'gray';
    }
  };
  
  return (
    <DashboardLayout>
      <Heading as="h1" size="xl" mb={6}>
        Risk Monitoring
      </Heading>
      
      {/* Summary Stats */}
      <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={5} mb={8}>
        <Card bg={cardBg} boxShadow="sm">
          <CardBody>
            <Stat>
              <StatLabel>Total Models Monitored</StatLabel>
              <StatNumber>12</StatNumber>
              <StatHelpText>
                <StatArrow type="increase" />
                2 since last month
              </StatHelpText>
            </Stat>
          </CardBody>
        </Card>
        
        <Card bg={cardBg} boxShadow="sm">
          <CardBody>
            <Stat>
              <StatLabel>Active Alerts</StatLabel>
              <Flex align="center">
                <StatNumber>8</StatNumber>
                <Badge ml={2} colorScheme="red" fontSize="xs">+3</Badge>
              </Flex>
              <StatHelpText>
                <Icon as={FiAlertTriangle} mr={1} />
                2 Critical, 3 High, 3 Medium
              </StatHelpText>
            </Stat>
          </CardBody>
        </Card>
        
        <Card bg={cardBg} boxShadow="sm">
          <CardBody>
            <Stat>
              <StatLabel>Overall Model Health</StatLabel>
              <HStack align="center">
                <Progress 
                  value={78} 
                  size="xs" 
                  width="80px"
                  colorScheme="green"
                  borderRadius="full"
                />
                <StatNumber>78%</StatNumber>
              </HStack>
              <StatHelpText>
                <StatArrow type="decrease" />
                5% since yesterday
              </StatHelpText>
            </Stat>
          </CardBody>
        </Card>
        
        <Card bg={cardBg} boxShadow="sm">
          <CardBody>
            <Stat>
              <StatLabel>Avg. Data Drift Score</StatLabel>
              <StatNumber>0.24</StatNumber>
              <StatHelpText>
                <StatArrow type="increase" />
                0.08 since last week
              </StatHelpText>
            </Stat>
          </CardBody>
        </Card>
      </SimpleGrid>
      
      {/* Main Content */}
      <Card mb={8} bg={cardBg} boxShadow="sm">
        <CardBody>
          <Tabs colorScheme="blue" variant="enclosed">
            <TabList>
              <Tab>Model Monitoring</Tab>
              <Tab>Alerts</Tab>
              <Tab>Schedule</Tab>
            </TabList>
            
            <TabPanels>
              <TabPanel px={0}>
                <Flex mb={4} justify="space-between" align="center">
                  <Text>Monitoring overview for 5 out of 12 models</Text>
                  <HStack>
                    <Button size="sm" leftIcon={<FiRefreshCw />} colorScheme="blue">
                      Refresh All
                    </Button>
                    <Button size="sm" leftIcon={<FiSettings />} variant="outline">
                      Settings
                    </Button>
                  </HStack>
                </Flex>
                
                <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={5}>
                  {MODELS_MONITORING.map((model) => (
                    <ModelMonitoringCard key={model.id} model={model} />
                  ))}
                </SimpleGrid>
              </TabPanel>
              
              <TabPanel px={0}>
                <Flex mb={4} justify="space-between" align="center">
                  <Text>Showing all alerts from the last 7 days</Text>
                  <Menu>
                    <MenuButton as={Button} size="sm" rightIcon={<FiChevronDown />}>
                      Actions
                    </MenuButton>
                    <MenuList>
                      <MenuItem icon={<FiRefreshCw />}>Refresh Alerts</MenuItem>
                      <MenuItem icon={<FiDownload />}>Export Alerts</MenuItem>
                      <MenuItem icon={<FiSettings />}>Alert Settings</MenuItem>
                    </MenuList>
                  </Menu>
                </Flex>
                
                <Box overflowX="auto">
                  <Table variant="simple">
                    <Thead>
                      <Tr>
                        <Th>Model</Th>
                        <Th>Type</Th>
                        <Th>Severity</Th>
                        <Th>Message</Th>
                        <Th>Timestamp</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {ALERTS.map((alert) => (
                        <Tr key={alert.id}>
                          <Td fontWeight="medium">{alert.model}</Td>
                          <Td>{alert.type}</Td>
                          <Td>
                            <Badge colorScheme={getAlertSeverityColor(alert.severity)}>
                              {alert.severity}
                            </Badge>
                          </Td>
                          <Td maxW="sm" noOfLines={1}>{alert.message}</Td>
                          <Td>{alert.timestamp}</Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </Box>
              </TabPanel>
              
              <TabPanel>
                <VStack align="start" spacing={6}>
                  <Box width="100%">
                    <Heading size="md" mb={4}>Monitoring Schedule</Heading>
                    <Table variant="simple">
                      <Thead>
                        <Tr>
                          <Th>Model</Th>
                          <Th>Frequency</Th>
                          <Th>Next Check</Th>
                          <Th>Notifications</Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        <Tr>
                          <Td>Credit Risk Classifier</Td>
                          <Td>Every 6 hours</Td>
                          <Td>In 4 hours</Td>
                          <Td>Email, Slack</Td>
                        </Tr>
                        <Tr>
                          <Td>Customer Churn Predictor</Td>
                          <Td>Every 12 hours</Td>
                          <Td>In 7 hours</Td>
                          <Td>Email</Td>
                        </Tr>
                        <Tr>
                          <Td>Fraud Detection</Td>
                          <Td>Every 3 hours</Td>
                          <Td>In 30 minutes</Td>
                          <Td>Email, Slack, SMS</Td>
                        </Tr>
                        <Tr>
                          <Td>Price Forecaster</Td>
                          <Td>Daily</Td>
                          <Td>Tomorrow, 9:00 AM</Td>
                          <Td>Email</Td>
                        </Tr>
                        <Tr>
                          <Td>Market Segmentation</Td>
                          <Td>Daily</Td>
                          <Td>In 10 hours</Td>
                          <Td>Email</Td>
                        </Tr>
                      </Tbody>
                    </Table>
                  </Box>
                  
                  <Box width="100%">
                    <Heading size="md" mb={4}>Threshold Configuration</Heading>
                    <Text mb={4}>
                      Customize the monitoring thresholds for different types of alerts.
                      When a threshold is crossed, the system will generate an alert based on the severity level.
                    </Text>
                    
                    <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                      <Card variant="outline">
                        <CardBody>
                          <VStack align="start" spacing={4}>
                            <Flex w="100%" justify="space-between" align="center">
                              <Heading size="sm">Data Drift Thresholds</Heading>
                              <Icon as={FiInfo} color="blue.500" />
                            </Flex>
                            <Box width="100%">
                              <HStack justify="space-between" mb={1}>
                                <Text fontSize="sm">Critical</Text>
                                <Badge colorScheme="red">≥ 0.50</Badge>
                              </HStack>
                              <HStack justify="space-between" mb={1}>
                                <Text fontSize="sm">Warning</Text>
                                <Badge colorScheme="orange">≥ 0.20</Badge>
                              </HStack>
                              <HStack justify="space-between">
                                <Text fontSize="sm">Normal</Text>
                                <Badge colorScheme="green">{'<'} 0.20</Badge>
                              </HStack>
                            </Box>
                            <Button size="sm" colorScheme="blue" alignSelf="flex-end">
                              Customize
                            </Button>
                          </VStack>
                        </CardBody>
                      </Card>
                      
                      <Card variant="outline">
                        <CardBody>
                          <VStack align="start" spacing={4}>
                            <Flex w="100%" justify="space-between" align="center">
                              <Heading size="sm">Performance Degradation</Heading>
                              <Icon as={FiInfo} color="blue.500" />
                            </Flex>
                            <Box width="100%">
                              <HStack justify="space-between" mb={1}>
                                <Text fontSize="sm">Critical</Text>
                                <Badge colorScheme="red">≥ 15%</Badge>
                              </HStack>
                              <HStack justify="space-between" mb={1}>
                                <Text fontSize="sm">Warning</Text>
                                <Badge colorScheme="orange">≥ 5%</Badge>
                              </HStack>
                              <HStack justify="space-between">
                                <Text fontSize="sm">Normal</Text>
                                <Badge colorScheme="green">{'<'} 5%</Badge>
                              </HStack>
                            </Box>
                            <Button size="sm" colorScheme="blue" alignSelf="flex-end">
                              Customize
                            </Button>
                          </VStack>
                        </CardBody>
                      </Card>
                    </SimpleGrid>
                  </Box>
                </VStack>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </CardBody>
      </Card>
    </DashboardLayout>
  );
} 