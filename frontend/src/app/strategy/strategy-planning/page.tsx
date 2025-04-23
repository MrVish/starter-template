"use client";

import React, { useState } from "react";
import {
  Box,
  Heading,
  Text,
  SimpleGrid,
  Card,
  CardBody,
  Button,
  VStack,
  HStack,
  Badge,
  Progress,
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
  Flex,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Tooltip,
  useColorModeValue
} from "@chakra-ui/react";
import {
  FiCalendar,
  FiTarget,
  FiTrendingUp,
  FiDollarSign,
  FiUsers,
  FiMoreVertical,
  FiEdit,
  FiTrash2,
  FiPlus,
  FiDownload,
  FiShare2
} from "react-icons/fi";
import DashboardLayout from "@/components/layout/DashboardLayout";

export default function StrategyPlanningPage() {
  const [activeTab, setActiveTab] = useState(0);
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const bgColor = useColorModeValue("white", "gray.800");
  
  // Sample strategic initiatives
  const strategicInitiatives = [
    {
      id: 1,
      name: "Digital Banking Engagement",
      status: "In Progress",
      completion: 65,
      budget: "$250,000",
      startDate: "Jan 2024",
      endDate: "Dec 2024",
      owner: "Sarah Johnson",
      priority: "High"
    },
    {
      id: 2,
      name: "Small Business Growth Campaign",
      status: "Planning",
      completion: 25,
      budget: "$180,000",
      startDate: "Apr 2024",
      endDate: "Oct 2024",
      owner: "Michael Chen",
      priority: "Medium"
    },
    {
      id: 3,
      name: "Mortgage Product Awareness",
      status: "Approved",
      completion: 10,
      budget: "$320,000",
      startDate: "May 2024",
      endDate: "Feb 2025",
      owner: "Jessica Williams",
      priority: "High"
    }
  ];
  
  // Sample KPIs
  const kpis = [
    { name: "Customer Acquisition", current: 2500, target: 3000, unit: "customers", trend: "up" },
    { name: "Cross-Sell Ratio", current: 2.8, target: 3.5, unit: "products", trend: "up" },
    { name: "Digital Adoption", current: 68, target: 80, unit: "%", trend: "up" },
    { name: "Marketing ROI", current: 285, target: 350, unit: "%", trend: "steady" }
  ];
  
  // Sample quarterly objectives
  const quarterlyObjectives = [
    { quarter: "Q1 2024", objective: "Launch mobile app redesign", status: "Completed" },
    { quarter: "Q2 2024", objective: "Implement personalized recommendations", status: "In Progress" },
    { quarter: "Q3 2024", objective: "Expand small business offerings", status: "Planning" },
    { quarter: "Q4 2024", objective: "Enhance digital onboarding experience", status: "Planning" }
  ];
  
  return (
    <DashboardLayout>
      <Box p={5}>
        <HStack justify="space-between" mb={6}>
          <Box>
            <Heading size="lg">Strategy Planning</Heading>
            <Text color="gray.500">Plan and manage your marketing initiatives</Text>
          </Box>
          <HStack>
            <Button leftIcon={<FiDownload />} variant="outline">Export</Button>
            <Button leftIcon={<FiPlus />} colorScheme="blue">New Initiative</Button>
          </HStack>
        </HStack>
        
        <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={5} mb={6}>
          {kpis.map((kpi, index) => (
            <Card key={index} borderColor={borderColor} boxShadow="sm">
              <CardBody>
                <HStack mb={2} justify="space-between">
                  <Text fontSize="sm" color="gray.500">{kpi.name}</Text>
                  {kpi.trend === "up" ? (
                    <FiTrendingUp color="green" />
                  ) : kpi.trend === "down" ? (
                    <FiTrendingUp color="red" style={{ transform: "rotate(180deg)" }} />
                  ) : (
                    <FiTrendingUp color="gray" style={{ transform: "rotate(90deg)" }} />
                  )}
                </HStack>
                <Heading size="lg">{kpi.current} <Text as="span" fontSize="md" color="gray.500">{kpi.unit}</Text></Heading>
                <HStack mt={2}>
                  <Text fontSize="sm">Target: {kpi.target} {kpi.unit}</Text>
                  <Progress 
                    value={(kpi.current / kpi.target) * 100} 
                    size="xs" 
                    colorScheme="blue" 
                    w="60px" 
                    ml={2} 
                    borderRadius="full"
                  />
                </HStack>
              </CardBody>
            </Card>
          ))}
        </SimpleGrid>
        
        <Tabs 
          index={activeTab} 
          onChange={(index) => setActiveTab(index)} 
          colorScheme="blue" 
          mb={6}
        >
          <TabList>
            <Tab>Strategic Initiatives</Tab>
            <Tab>Timeline</Tab>
            <Tab>Budget Allocation</Tab>
            <Tab>Resource Planning</Tab>
          </TabList>
          
          <TabPanels>
            {/* Strategic Initiatives Panel */}
            <TabPanel p={0} pt={4}>
              <Card borderColor={borderColor} boxShadow="sm">
                <CardBody>
                  <Table variant="simple">
                    <Thead>
                      <Tr>
                        <Th>Initiative</Th>
                        <Th>Status</Th>
                        <Th>Priority</Th>
                        <Th>Progress</Th>
                        <Th>Budget</Th>
                        <Th>Timeline</Th>
                        <Th>Actions</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {strategicInitiatives.map((initiative) => (
                        <Tr key={initiative.id}>
                          <Td fontWeight="medium">{initiative.name}</Td>
                          <Td>
                            <Badge
                              colorScheme={
                                initiative.status === "Completed" ? "green" :
                                initiative.status === "In Progress" ? "blue" :
                                initiative.status === "Planning" ? "yellow" :
                                initiative.status === "Approved" ? "purple" :
                                "gray"
                              }
                            >
                              {initiative.status}
                            </Badge>
                          </Td>
                          <Td>
                            <Badge
                              colorScheme={
                                initiative.priority === "High" ? "red" :
                                initiative.priority === "Medium" ? "yellow" :
                                "green"
                              }
                              variant="subtle"
                            >
                              {initiative.priority}
                            </Badge>
                          </Td>
                          <Td>
                            <HStack spacing={2}>
                              <Progress 
                                value={initiative.completion} 
                                size="sm" 
                                colorScheme="blue" 
                                width="100px" 
                                borderRadius="full"
                              />
                              <Text fontSize="xs">{initiative.completion}%</Text>
                            </HStack>
                          </Td>
                          <Td>{initiative.budget}</Td>
                          <Td>
                            <Text fontSize="sm">{initiative.startDate} - {initiative.endDate}</Text>
                          </Td>
                          <Td>
                            <Menu>
                              <MenuButton
                                as={IconButton}
                                aria-label="Options"
                                icon={<FiMoreVertical />}
                                variant="ghost"
                                size="sm"
                              />
                              <MenuList>
                                <MenuItem icon={<FiEdit />}>Edit</MenuItem>
                                <MenuItem icon={<FiShare2 />}>Share</MenuItem>
                                <MenuItem icon={<FiTrash2 />} color="red.400">Delete</MenuItem>
                              </MenuList>
                            </Menu>
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </CardBody>
              </Card>
            </TabPanel>
            
            {/* Timeline Panel */}
            <TabPanel p={0} pt={4}>
              <Card borderColor={borderColor} boxShadow="sm" mb={6}>
                <CardBody>
                  <Heading size="md" mb={4}>Quarterly Roadmap</Heading>
                  <Table variant="simple">
                    <Thead>
                      <Tr>
                        <Th>Quarter</Th>
                        <Th>Key Objective</Th>
                        <Th>Status</Th>
                        <Th>Actions</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {quarterlyObjectives.map((item, index) => (
                        <Tr key={index}>
                          <Td fontWeight="medium">{item.quarter}</Td>
                          <Td>{item.objective}</Td>
                          <Td>
                            <Badge
                              colorScheme={
                                item.status === "Completed" ? "green" :
                                item.status === "In Progress" ? "blue" :
                                "yellow"
                              }
                            >
                              {item.status}
                            </Badge>
                          </Td>
                          <Td>
                            <IconButton
                              aria-label="Edit objective"
                              icon={<FiEdit />}
                              size="sm"
                              variant="ghost"
                            />
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </CardBody>
              </Card>
              
              <Box
                height="300px"
                border="1px dashed"
                borderColor={borderColor}
                borderRadius="md"
                display="flex"
                alignItems="center"
                justifyContent="center"
                mb={6}
              >
                <Text color="gray.500">Interactive timeline chart would appear here</Text>
              </Box>
            </TabPanel>
            
            {/* Budget Allocation Panel */}
            <TabPanel p={0} pt={4}>
              <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
                <Card borderColor={borderColor} boxShadow="sm">
                  <CardBody>
                    <Heading size="md" mb={4}>Budget Allocation by Channel</Heading>
                    <Box
                      height="250px"
                      border="1px dashed"
                      borderColor={borderColor}
                      borderRadius="md"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      mb={4}
                    >
                      <Text color="gray.500">Budget allocation chart would appear here</Text>
                    </Box>
                    <Table size="sm">
                      <Thead>
                        <Tr>
                          <Th>Channel</Th>
                          <Th isNumeric>Allocation</Th>
                          <Th isNumeric>Spent</Th>
                          <Th isNumeric>Remaining</Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        <Tr>
                          <Td>Digital Ads</Td>
                          <Td isNumeric>$320,000</Td>
                          <Td isNumeric>$180,000</Td>
                          <Td isNumeric>$140,000</Td>
                        </Tr>
                        <Tr>
                          <Td>Email Marketing</Td>
                          <Td isNumeric>$150,000</Td>
                          <Td isNumeric>$85,000</Td>
                          <Td isNumeric>$65,000</Td>
                        </Tr>
                        <Tr>
                          <Td>Content</Td>
                          <Td isNumeric>$200,000</Td>
                          <Td isNumeric>$95,000</Td>
                          <Td isNumeric>$105,000</Td>
                        </Tr>
                        <Tr>
                          <Td>Social Media</Td>
                          <Td isNumeric>$180,000</Td>
                          <Td isNumeric>$120,000</Td>
                          <Td isNumeric>$60,000</Td>
                        </Tr>
                      </Tbody>
                    </Table>
                  </CardBody>
                </Card>
                
                <Card borderColor={borderColor} boxShadow="sm">
                  <CardBody>
                    <Heading size="md" mb={4}>Budget Performance</Heading>
                    <Box
                      height="250px"
                      border="1px dashed"
                      borderColor={borderColor}
                      borderRadius="md"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      mb={4}
                    >
                      <Text color="gray.500">Budget performance chart would appear here</Text>
                    </Box>
                    <SimpleGrid columns={2} spacing={4}>
                      <Card bg="blue.50" borderColor={borderColor}>
                        <CardBody>
                          <Text fontSize="sm" color="gray.500">Total Budget</Text>
                          <Heading size="md">$1,250,000</Heading>
                        </CardBody>
                      </Card>
                      <Card bg="green.50" borderColor={borderColor}>
                        <CardBody>
                          <Text fontSize="sm" color="gray.500">Marketing ROI</Text>
                          <Heading size="md">285%</Heading>
                        </CardBody>
                      </Card>
                    </SimpleGrid>
                  </CardBody>
                </Card>
              </SimpleGrid>
            </TabPanel>
            
            {/* Resource Planning Panel */}
            <TabPanel p={0} pt={4}>
              <Card borderColor={borderColor} boxShadow="sm" mb={6}>
                <CardBody>
                  <Heading size="md" mb={4}>Team Allocation</Heading>
                  <Table variant="simple">
                    <Thead>
                      <Tr>
                        <Th>Team</Th>
                        <Th>Members</Th>
                        <Th>Active Initiatives</Th>
                        <Th>Utilization</Th>
                        <Th>Actions</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      <Tr>
                        <Td fontWeight="medium">Digital Marketing</Td>
                        <Td>8</Td>
                        <Td>3</Td>
                        <Td>
                          <HStack spacing={2}>
                            <Progress 
                              value={85} 
                              size="sm" 
                              colorScheme={85 > 90 ? "red" : "blue"} 
                              width="100px" 
                            />
                            <Text fontSize="xs">85%</Text>
                          </HStack>
                        </Td>
                        <Td>
                          <IconButton
                            aria-label="View team details"
                            icon={<FiUsers />}
                            size="sm"
                            variant="ghost"
                          />
                        </Td>
                      </Tr>
                      <Tr>
                        <Td fontWeight="medium">Content</Td>
                        <Td>5</Td>
                        <Td>2</Td>
                        <Td>
                          <HStack spacing={2}>
                            <Progress 
                              value={70} 
                              size="sm" 
                              colorScheme={70 > 90 ? "red" : "blue"} 
                              width="100px" 
                            />
                            <Text fontSize="xs">70%</Text>
                          </HStack>
                        </Td>
                        <Td>
                          <IconButton
                            aria-label="View team details"
                            icon={<FiUsers />}
                            size="sm"
                            variant="ghost"
                          />
                        </Td>
                      </Tr>
                      <Tr>
                        <Td fontWeight="medium">Analytics</Td>
                        <Td>4</Td>
                        <Td>4</Td>
                        <Td>
                          <HStack spacing={2}>
                            <Progress 
                              value={95} 
                              size="sm" 
                              colorScheme={95 > 90 ? "red" : "blue"} 
                              width="100px" 
                            />
                            <Text fontSize="xs">95%</Text>
                          </HStack>
                        </Td>
                        <Td>
                          <IconButton
                            aria-label="View team details"
                            icon={<FiUsers />}
                            size="sm"
                            variant="ghost"
                          />
                        </Td>
                      </Tr>
                    </Tbody>
                  </Table>
                </CardBody>
              </Card>

              <Card borderColor={borderColor} boxShadow="sm">
                <CardBody>
                  <Heading size="md" mb={4}>Resource Allocation by Initiative</Heading>
                  <Box
                    height="300px"
                    border="1px dashed"
                    borderColor={borderColor}
                    borderRadius="md"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <Text color="gray.500">Resource allocation chart would appear here</Text>
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