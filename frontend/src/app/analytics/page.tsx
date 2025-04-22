'use client';

import React from 'react';
import {
  Box,
  Heading,
  Text,
  SimpleGrid,
  Card,
  CardBody,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  Flex,
  Icon,
  Tab,
  Tabs,
  TabList,
  TabPanel,
  TabPanels,
  useColorModeValue,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Badge,
} from '@chakra-ui/react';
import { 
  FiBarChart2, 
  FiPieChart, 
  FiTrendingUp, 
  FiTrendingDown
} from 'react-icons/fi';
import DashboardLayout from '../../components/layout/DashboardLayout';

export default function Analytics() {
  const cardBg = useColorModeValue('white', 'gray.800');
  
  return (
    <DashboardLayout>
      <Heading as="h1" size="xl" mb={6}>
        Analytics
      </Heading>
      
      {/* Summary Stats */}
      <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={5} mb={8}>
        <Card bg={cardBg} boxShadow="sm">
          <CardBody>
            <Stat>
              <StatLabel>Model Performance</StatLabel>
              <Flex align="center">
                <StatNumber>87.5%</StatNumber>
                <StatHelpText ml={2} mb={0}>
                  <StatArrow type="increase" />
                  4.3%
                </StatHelpText>
              </Flex>
              <Text fontSize="sm" color="gray.500">Average accuracy across models</Text>
            </Stat>
          </CardBody>
        </Card>
        
        <Card bg={cardBg} boxShadow="sm">
          <CardBody>
            <Stat>
              <StatLabel>Risk Score</StatLabel>
              <Flex align="center">
                <StatNumber>42</StatNumber>
                <StatHelpText ml={2} mb={0}>
                  <StatArrow type="decrease" />
                  8.1%
                </StatHelpText>
              </Flex>
              <Text fontSize="sm" color="gray.500">Lower is better</Text>
            </Stat>
          </CardBody>
        </Card>
        
        <Card bg={cardBg} boxShadow="sm">
          <CardBody>
            <Stat>
              <StatLabel>Drift Detection</StatLabel>
              <Flex align="center">
                <StatNumber>3</StatNumber>
                <Icon as={FiBarChart2} ml={2} color="orange.500" />
              </Flex>
              <Text fontSize="sm" color="gray.500">Models with drift detected</Text>
            </Stat>
          </CardBody>
        </Card>
        
        <Card bg={cardBg} boxShadow="sm">
          <CardBody>
            <Stat>
              <StatLabel>Feature Importance</StatLabel>
              <Flex align="center">
                <StatNumber>12</StatNumber>
                <Icon as={FiPieChart} ml={2} color="blue.500" />
              </Flex>
              <Text fontSize="sm" color="gray.500">Key features identified</Text>
            </Stat>
          </CardBody>
        </Card>
      </SimpleGrid>
      
      {/* Analytical Tabs */}
      <Card mb={8} bg={cardBg} boxShadow="sm">
        <CardBody>
          <Tabs colorScheme="blue" variant="enclosed">
            <TabList>
              <Tab>Performance Metrics</Tab>
              <Tab>Model Drift</Tab>
              <Tab>Feature Analysis</Tab>
            </TabList>
            
            <TabPanels>
              <TabPanel>
                <Heading size="md" mb={4}>Performance Metrics</Heading>
                <TableContainer>
                  <Table variant="simple">
                    <Thead>
                      <Tr>
                        <Th>Model</Th>
                        <Th>Accuracy</Th>
                        <Th>Precision</Th>
                        <Th>Recall</Th>
                        <Th>F1 Score</Th>
                        <Th>Trend</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      <Tr>
                        <Td>Credit Risk Model</Td>
                        <Td>92.3%</Td>
                        <Td>88.7%</Td>
                        <Td>90.1%</Td>
                        <Td>89.4%</Td>
                        <Td><Icon as={FiTrendingUp} color="green.500" /></Td>
                      </Tr>
                      <Tr>
                        <Td>Churn Prediction</Td>
                        <Td>85.6%</Td>
                        <Td>82.3%</Td>
                        <Td>84.0%</Td>
                        <Td>83.1%</Td>
                        <Td><Icon as={FiTrendingDown} color="red.500" /></Td>
                      </Tr>
                      <Tr>
                        <Td>Fraud Detection</Td>
                        <Td>97.8%</Td>
                        <Td>96.4%</Td>
                        <Td>95.9%</Td>
                        <Td>96.1%</Td>
                        <Td><Icon as={FiTrendingUp} color="green.500" /></Td>
                      </Tr>
                      <Tr>
                        <Td>Customer Segmentation</Td>
                        <Td>88.2%</Td>
                        <Td>86.5%</Td>
                        <Td>87.0%</Td>
                        <Td>86.7%</Td>
                        <Td><Icon as={FiTrendingUp} color="green.500" /></Td>
                      </Tr>
                    </Tbody>
                  </Table>
                </TableContainer>
              </TabPanel>
              
              <TabPanel>
                <Heading size="md" mb={4}>Model Drift Analysis</Heading>
                <Text mb={4}>
                  Model drift measures how model performance degrades over time as data patterns change.
                  Below are the recent drift detection results for monitored models.
                </Text>
                
                <TableContainer>
                  <Table variant="simple">
                    <Thead>
                      <Tr>
                        <Th>Model</Th>
                        <Th>Drift Score</Th>
                        <Th>Status</Th>
                        <Th>Last Checked</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      <Tr>
                        <Td>Credit Risk Model</Td>
                        <Td>0.12</Td>
                        <Td><Badge colorScheme="green">Stable</Badge></Td>
                        <Td>2023-11-05</Td>
                      </Tr>
                      <Tr>
                        <Td>Churn Prediction</Td>
                        <Td>0.38</Td>
                        <Td><Badge colorScheme="orange">Moderate Drift</Badge></Td>
                        <Td>2023-11-03</Td>
                      </Tr>
                      <Tr>
                        <Td>Fraud Detection</Td>
                        <Td>0.05</Td>
                        <Td><Badge colorScheme="green">Stable</Badge></Td>
                        <Td>2023-11-06</Td>
                      </Tr>
                      <Tr>
                        <Td>Customer Segmentation</Td>
                        <Td>0.56</Td>
                        <Td><Badge colorScheme="red">Significant Drift</Badge></Td>
                        <Td>2023-11-02</Td>
                      </Tr>
                    </Tbody>
                  </Table>
                </TableContainer>
              </TabPanel>
              
              <TabPanel>
                <Heading size="md" mb={4}>Feature Importance Analysis</Heading>
                <Text mb={4}>
                  The table below shows the most important features across different models
                  and their relative contribution to prediction outcomes.
                </Text>
                
                <TableContainer>
                  <Table variant="simple">
                    <Thead>
                      <Tr>
                        <Th>Feature</Th>
                        <Th>Importance Score</Th>
                        <Th>Used In Models</Th>
                        <Th>Category</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      <Tr>
                        <Td>customer_tenure</Td>
                        <Td>0.86</Td>
                        <Td>4</Td>
                        <Td>Demographic</Td>
                      </Tr>
                      <Tr>
                        <Td>payment_history</Td>
                        <Td>0.82</Td>
                        <Td>3</Td>
                        <Td>Financial</Td>
                      </Tr>
                      <Tr>
                        <Td>transaction_frequency</Td>
                        <Td>0.79</Td>
                        <Td>2</Td>
                        <Td>Behavioral</Td>
                      </Tr>
                      <Tr>
                        <Td>credit_utilization</Td>
                        <Td>0.75</Td>
                        <Td>3</Td>
                        <Td>Financial</Td>
                      </Tr>
                      <Tr>
                        <Td>age</Td>
                        <Td>0.68</Td>
                        <Td>5</Td>
                        <Td>Demographic</Td>
                      </Tr>
                    </Tbody>
                  </Table>
                </TableContainer>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </CardBody>
      </Card>
    </DashboardLayout>
  );
} 