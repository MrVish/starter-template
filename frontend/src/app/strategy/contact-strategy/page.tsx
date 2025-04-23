"use client";

import React, { useState } from "react";
import {
  Box,
  Heading,
  Text,
  SimpleGrid,
  Card,
  CardBody,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Tab,
  HStack,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Badge,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Select,
  Progress,
  IconButton,
  Tooltip,
  useColorModeValue
} from "@chakra-ui/react";
import { FiMail, FiPhone, FiMessageSquare, FiTwitter, FiInstagram, FiEdit, FiTrash2, FiPlus } from "react-icons/fi";
import DashboardLayout from "@/components/layout/DashboardLayout";

export default function ContactStrategyPage() {
  const [timeframe, setTimeframe] = useState("last30Days");
  const [tabIndex, setTabIndex] = useState(0);
  
  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  
  // Sample channel data
  const channelData = [
    { id: 1, name: "Email", icon: FiMail, engagementRate: 24.5, deliveryRate: 98.2, conversionRate: 3.8, frequency: "High", status: "active" },
    { id: 2, name: "SMS", icon: FiMessageSquare, engagementRate: 42.1, deliveryRate: 99.5, conversionRate: 5.6, frequency: "Medium", status: "active" },
    { id: 3, name: "Phone", icon: FiPhone, engagementRate: 68.0, deliveryRate: 90.0, conversionRate: 12.4, frequency: "Low", status: "inactive" },
    { id: 4, name: "Social Media", icon: FiTwitter, engagementRate: 35.7, deliveryRate: 100.0, conversionRate: 2.1, frequency: "High", status: "active" }
  ];
  
  // Sample journey templates
  const journeyTemplates = [
    { id: 1, name: "New Customer Onboarding", channels: 4, steps: 8, performance: "High", lastModified: "2024-03-15" },
    { id: 2, name: "Re-engagement Campaign", channels: 3, steps: 5, performance: "Medium", lastModified: "2024-03-10" },
    { id: 3, name: "Product Recommendation", channels: 2, steps: 4, performance: "High", lastModified: "2024-03-08" }
  ];
  
  return (
    <DashboardLayout>
      <Box p={5}>
        <HStack justify="space-between" mb={6}>
          <Box>
            <Heading size="lg">Contact Strategy</Heading>
            <Text color="gray.500">Manage communication channels and customer touchpoints</Text>
          </Box>
          <Select 
            value={timeframe} 
            onChange={(e) => setTimeframe(e.target.value)}
            w="200px"
          >
            <option value="last7Days">Last 7 Days</option>
            <option value="last30Days">Last 30 Days</option>
            <option value="last90Days">Last 90 Days</option>
            <option value="lastYear">Last Year</option>
          </Select>
        </HStack>
        
        <Tabs index={tabIndex} onChange={(index) => setTabIndex(index)} colorScheme="blue" mb={6}>
          <TabList>
            <Tab>Channels</Tab>
            <Tab>Customer Journeys</Tab>
            <Tab>Contact Rules</Tab>
            <Tab>Strategy Map</Tab>
          </TabList>
          
          <TabPanels>
            {/* Channels Panel */}
            <TabPanel p={0} pt={4}>
              <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={5} mb={6}>
                {channelData.map((channel) => (
                  <Card key={channel.id} borderColor={borderColor} boxShadow="sm">
                    <CardBody>
                      <HStack mb={3}>
                        <Box
                          p={2}
                          borderRadius="md"
                          bg="blue.50"
                          color="blue.500"
                        >
                          <channel.icon size={20} />
                        </Box>
                        <Heading size="md">{channel.name}</Heading>
                        <Badge ml="auto" colorScheme={channel.status === "active" ? "green" : "gray"}>
                          {channel.status}
                        </Badge>
                      </HStack>
                      
                      <Stat mt={2}>
                        <StatLabel>Engagement Rate</StatLabel>
                        <StatNumber>{channel.engagementRate}%</StatNumber>
                        <StatHelpText>Delivery: {channel.deliveryRate}%</StatHelpText>
                      </Stat>
                      
                      <Text mt={2} fontSize="sm">Conversion: {channel.conversionRate}%</Text>
                      <Text fontSize="sm">Frequency: {channel.frequency}</Text>
                    </CardBody>
                  </Card>
                ))}
              </SimpleGrid>
              
              <Card borderColor={borderColor} boxShadow="sm">
                <CardBody>
                  <Heading size="md" mb={4}>Channel Performance</Heading>
                  <Table size="sm">
                    <Thead>
                      <Tr>
                        <Th>Channel</Th>
                        <Th>Engagement</Th>
                        <Th>Conversion</Th>
                        <Th>Cost Efficiency</Th>
                        <Th>Actions</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {channelData.map((channel) => (
                        <Tr key={channel.id}>
                          <Td>
                            <HStack>
                              <channel.icon />
                              <Text>{channel.name}</Text>
                            </HStack>
                          </Td>
                          <Td>
                            <Progress 
                              value={channel.engagementRate} 
                              max={100} 
                              size="sm" 
                              colorScheme="blue" 
                              width="100px" 
                            />
                          </Td>
                          <Td>{channel.conversionRate}%</Td>
                          <Td>
                            <Badge colorScheme={
                              channel.conversionRate > 10 ? "green" : 
                              channel.conversionRate > 3 ? "blue" : "yellow"
                            }>
                              {channel.conversionRate > 10 ? "High" : 
                              channel.conversionRate > 3 ? "Medium" : "Low"}
                            </Badge>
                          </Td>
                          <Td>
                            <HStack spacing={2}>
                              <Tooltip label="Edit channel">
                                <IconButton
                                  aria-label="Edit channel"
                                  icon={<FiEdit />}
                                  size="sm"
                                  variant="ghost"
                                />
                              </Tooltip>
                              <Tooltip label="Delete channel">
                                <IconButton
                                  aria-label="Delete channel"
                                  icon={<FiTrash2 />}
                                  size="sm"
                                  variant="ghost"
                                  colorScheme="red"
                                />
                              </Tooltip>
                            </HStack>
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </CardBody>
              </Card>
            </TabPanel>
            
            {/* Customer Journeys Panel */}
            <TabPanel p={0} pt={4}>
              <HStack justify="space-between" mb={4}>
                <Heading size="md">Journey Templates</Heading>
                <Tooltip label="Create new journey">
                  <IconButton
                    aria-label="Create new journey"
                    icon={<FiPlus />}
                    colorScheme="blue"
                  />
                </Tooltip>
              </HStack>
              
              <Table variant="simple">
                <Thead>
                  <Tr>
                    <Th>Journey Name</Th>
                    <Th>Channels</Th>
                    <Th>Steps</Th>
                    <Th>Performance</Th>
                    <Th>Last Modified</Th>
                    <Th>Actions</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {journeyTemplates.map((journey) => (
                    <Tr key={journey.id}>
                      <Td fontWeight="medium">{journey.name}</Td>
                      <Td>{journey.channels}</Td>
                      <Td>{journey.steps}</Td>
                      <Td>
                        <Badge colorScheme={
                          journey.performance === "High" ? "green" : 
                          journey.performance === "Medium" ? "blue" : "yellow"
                        }>
                          {journey.performance}
                        </Badge>
                      </Td>
                      <Td>{journey.lastModified}</Td>
                      <Td>
                        <HStack spacing={2}>
                          <Tooltip label="Edit journey">
                            <IconButton
                              aria-label="Edit journey"
                              icon={<FiEdit />}
                              size="sm"
                              variant="ghost"
                            />
                          </Tooltip>
                          <Tooltip label="Delete journey">
                            <IconButton
                              aria-label="Delete journey"
                              icon={<FiTrash2 />}
                              size="sm"
                              variant="ghost"
                              colorScheme="red"
                            />
                          </Tooltip>
                        </HStack>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </TabPanel>
            
            {/* Contact Rules Panel */}
            <TabPanel p={0} pt={4}>
              <Card mb={6} borderColor={borderColor} boxShadow="sm">
                <CardBody>
                  <Heading size="md" mb={4}>Contact Frequency Rules</Heading>
                  <Table size="sm">
                    <Thead>
                      <Tr>
                        <Th>Segment</Th>
                        <Th>Email</Th>
                        <Th>SMS</Th>
                        <Th>Phone</Th>
                        <Th>Social</Th>
                        <Th>Actions</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      <Tr>
                        <Td fontWeight="medium">High Value</Td>
                        <Td>2 / week</Td>
                        <Td>1 / week</Td>
                        <Td>1 / month</Td>
                        <Td>3 / week</Td>
                        <Td>
                          <IconButton
                            aria-label="Edit rule"
                            icon={<FiEdit />}
                            size="sm"
                            variant="ghost"
                          />
                        </Td>
                      </Tr>
                      <Tr>
                        <Td fontWeight="medium">Medium Value</Td>
                        <Td>1 / week</Td>
                        <Td>2 / month</Td>
                        <Td>1 / quarter</Td>
                        <Td>2 / week</Td>
                        <Td>
                          <IconButton
                            aria-label="Edit rule"
                            icon={<FiEdit />}
                            size="sm"
                            variant="ghost"
                          />
                        </Td>
                      </Tr>
                      <Tr>
                        <Td fontWeight="medium">Low Value</Td>
                        <Td>2 / month</Td>
                        <Td>1 / month</Td>
                        <Td>None</Td>
                        <Td>1 / week</Td>
                        <Td>
                          <IconButton
                            aria-label="Edit rule"
                            icon={<FiEdit />}
                            size="sm"
                            variant="ghost"
                          />
                        </Td>
                      </Tr>
                    </Tbody>
                  </Table>
                </CardBody>
              </Card>
            </TabPanel>
            
            {/* Strategy Map Panel */}
            <TabPanel p={0} pt={4}>
              <Card borderColor={borderColor} boxShadow="sm">
                <CardBody>
                  <Heading size="md" mb={4}>Contact Strategy Map</Heading>
                  <Text mb={6}>
                    Visualize your contact strategy across different customer segments and lifecycle stages.
                    This view helps identify gaps and opportunities in your communication plan.
                  </Text>
                  
                  <Box
                    height="400px"
                    border="1px dashed"
                    borderColor={borderColor}
                    borderRadius="md"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <Text color="gray.500">Interactive strategy map visualization would appear here</Text>
                  </Box>
                </CardBody>
              </Card>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </DashboardLayout>
  );
} 