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
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  FormControl,
  FormLabel,
  Input,
  Switch,
  Select,
  InputGroup,
  InputRightElement,
  Divider,
  Avatar,
  Badge,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  useColorModeValue,
  useToast,
} from '@chakra-ui/react';
import {
  FiSettings,
  FiUsers,
  FiKey,
  FiBell,
  FiDatabase,
  FiSave,
  FiUserPlus,
  FiEdit,
  FiTrash2,
  FiShield,
  FiEye,
  FiEyeOff,
  FiAlertTriangle,
  FiInfo,
  FiLogOut,
  FiDownload,
} from 'react-icons/fi';
import DashboardLayout from '../../components/layout/DashboardLayout';

// Sample user data
const USERS = [
  {
    id: 1,
    name: 'John Doe',
    email: 'john.doe@example.com',
    role: 'Admin',
    status: 'Active',
    lastLogin: '2023-11-05 09:25',
  },
  {
    id: 2,
    name: 'Sarah Johnson',
    email: 'sarah.j@example.com',
    role: 'Data Scientist',
    status: 'Active',
    lastLogin: '2023-11-04 15:42',
  },
  {
    id: 3,
    name: 'Michael Chen',
    email: 'michael.c@example.com',
    role: 'Data Engineer',
    status: 'Active',
    lastLogin: '2023-11-05 11:15',
  },
  {
    id: 4,
    name: 'Emily Wilson',
    email: 'emily.w@example.com',
    role: 'Business Analyst',
    status: 'Inactive',
    lastLogin: '2023-10-28 14:30',
  },
  {
    id: 5,
    name: 'Alex Rodriguez',
    email: 'alex.r@example.com',
    role: 'Compliance Officer',
    status: 'Active',
    lastLogin: '2023-11-03 10:12',
  },
];

// Sample activity logs
const ACTIVITY_LOGS = [
  {
    id: 1,
    user: 'John Doe',
    action: 'Updated risk assessment',
    resource: 'Credit Risk Model',
    timestamp: '2023-11-05 14:32',
    ip: '192.168.1.45',
  },
  {
    id: 2,
    user: 'Sarah Johnson',
    action: 'Created new model',
    resource: 'Churn Prediction v2',
    timestamp: '2023-11-05 10:15',
    ip: '192.168.1.23',
  },
  {
    id: 3,
    user: 'System',
    action: 'Scheduled model retraining',
    resource: 'Fraud Detection',
    timestamp: '2023-11-05 00:00',
    ip: '127.0.0.1',
  },
  {
    id: 4,
    user: 'Michael Chen',
    action: 'Uploaded dataset',
    resource: 'Customer Demographics',
    timestamp: '2023-11-04 16:45',
    ip: '192.168.1.89',
  },
  {
    id: 5,
    user: 'Sarah Johnson',
    action: 'Generated report',
    resource: 'Monthly Model Performance',
    timestamp: '2023-11-04 13:22',
    ip: '192.168.1.23',
  },
  {
    id: 6,
    user: 'John Doe',
    action: 'Added user',
    resource: 'Alex Rodriguez',
    timestamp: '2023-11-03 09:13',
    ip: '192.168.1.45',
  },
];

// Settings page component
export default function Settings() {
  const cardBg = useColorModeValue('white', 'gray.800');
  const toast = useToast();
  
  const handleSaveSettings = () => {
    toast({
      title: 'Settings saved',
      description: 'Your settings have been updated successfully',
      status: 'success',
      duration: 5000,
      isClosable: true,
    });
  };
  
  return (
    <DashboardLayout>
      <Heading as="h1" size="xl" mb={6}>
        Settings
      </Heading>
      
      <Card mb={8} bg={cardBg} boxShadow="sm">
        <CardBody>
          <Tabs colorScheme="blue" variant="enclosed">
            <TabList>
              <Tab><Icon as={FiSettings} mr={2} /> General</Tab>
              <Tab><Icon as={FiUsers} mr={2} /> Users</Tab>
              <Tab><Icon as={FiKey} mr={2} /> API Keys</Tab>
              <Tab><Icon as={FiBell} mr={2} /> Notifications</Tab>
              <Tab><Icon as={FiDatabase} mr={2} /> Audit Logs</Tab>
            </TabList>
            
            <TabPanels>
              {/* General Settings */}
              <TabPanel>
                <VStack spacing={6} align="stretch">
                  <Box>
                    <Heading size="md" mb={4}>Account Settings</Heading>
                    <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                      <Card variant="outline">
                        <CardBody>
                          <VStack spacing={4} align="stretch">
                            <Flex gap={4} align="center">
                              <Avatar 
                                size="xl" 
                                name="John Doe" 
                                src="https://i.pravatar.cc/300" 
                                bg="blue.500"
                              />
                              <VStack align="start" spacing={1}>
                                <Heading size="md">John Doe</Heading>
                                <Text color="gray.500">john.doe@example.com</Text>
                                <Badge colorScheme="green">Admin</Badge>
                              </VStack>
                            </Flex>
                            <Button leftIcon={<FiEdit />} size="sm" alignSelf="flex-start">
                              Change Avatar
                            </Button>
                            <Divider />
                            <FormControl>
                              <FormLabel>Name</FormLabel>
                              <Input defaultValue="John Doe" />
                            </FormControl>
                            <FormControl>
                              <FormLabel>Email Address</FormLabel>
                              <Input defaultValue="john.doe@example.com" />
                            </FormControl>
                            <FormControl>
                              <FormLabel>Job Title</FormLabel>
                              <Input defaultValue="IT Director" />
                            </FormControl>
                          </VStack>
                        </CardBody>
                      </Card>
                      
                      <Card variant="outline">
                        <CardBody>
                          <VStack spacing={4} align="stretch">
                            <Heading size="sm">Password</Heading>
                            <FormControl>
                              <FormLabel>Current Password</FormLabel>
                              <InputGroup>
                                <Input type="password" />
                                <InputRightElement>
                                  <Icon as={FiEyeOff} color="gray.500" />
                                </InputRightElement>
                              </InputGroup>
                            </FormControl>
                            <FormControl>
                              <FormLabel>New Password</FormLabel>
                              <InputGroup>
                                <Input type="password" />
                                <InputRightElement>
                                  <Icon as={FiEyeOff} color="gray.500" />
                                </InputRightElement>
                              </InputGroup>
                            </FormControl>
                            <FormControl>
                              <FormLabel>Confirm New Password</FormLabel>
                              <InputGroup>
                                <Input type="password" />
                                <InputRightElement>
                                  <Icon as={FiEyeOff} color="gray.500" />
                                </InputRightElement>
                              </InputGroup>
                            </FormControl>
                            <Button leftIcon={<FiKey />} colorScheme="blue" size="sm" alignSelf="flex-start">
                              Update Password
                            </Button>
                            <Divider />
                            <Heading size="sm">Session Management</Heading>
                            <Box>
                              <Button leftIcon={<FiLogOut />} colorScheme="red" variant="outline" size="sm">
                                Sign Out All Devices
                              </Button>
                            </Box>
                          </VStack>
                        </CardBody>
                      </Card>
                    </SimpleGrid>
                  </Box>
                  
                  <Box>
                    <Heading size="md" mb={4}>System Settings</Heading>
                    <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                      <Card variant="outline">
                        <CardBody>
                          <VStack spacing={4} align="stretch">
                            <Heading size="sm">Interface Preferences</Heading>
                            <FormControl display="flex" alignItems="center">
                              <FormLabel mb="0">Enable Dark Mode</FormLabel>
                              <Switch colorScheme="blue" />
                            </FormControl>
                            <FormControl display="flex" alignItems="center">
                              <FormLabel mb="0">Compact View</FormLabel>
                              <Switch colorScheme="blue" />
                            </FormControl>
                            <FormControl display="flex" alignItems="center">
                              <FormLabel mb="0">Show Welcome Guide</FormLabel>
                              <Switch colorScheme="blue" defaultChecked />
                            </FormControl>
                            <Divider />
                            <Heading size="sm">Regional Settings</Heading>
                            <FormControl>
                              <FormLabel>Time Zone</FormLabel>
                              <Select defaultValue="UTC-5">
                                <option value="UTC-8">Pacific Time (UTC-8)</option>
                                <option value="UTC-7">Mountain Time (UTC-7)</option>
                                <option value="UTC-6">Central Time (UTC-6)</option>
                                <option value="UTC-5">Eastern Time (UTC-5)</option>
                                <option value="UTC+0">UTC</option>
                              </Select>
                            </FormControl>
                            <FormControl>
                              <FormLabel>Date Format</FormLabel>
                              <Select defaultValue="MM/DD/YYYY">
                                <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                                <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                                <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                              </Select>
                            </FormControl>
                          </VStack>
                        </CardBody>
                      </Card>
                      
                      <Card variant="outline">
                        <CardBody>
                          <VStack spacing={4} align="stretch">
                            <Heading size="sm">Data Management</Heading>
                            <FormControl display="flex" alignItems="center">
                              <FormLabel mb="0">Auto-refresh Dashboard</FormLabel>
                              <Switch colorScheme="blue" defaultChecked />
                            </FormControl>
                            <FormControl>
                              <FormLabel>Refresh Interval</FormLabel>
                              <Select defaultValue="5">
                                <option value="1">1 minute</option>
                                <option value="5">5 minutes</option>
                                <option value="15">15 minutes</option>
                                <option value="30">30 minutes</option>
                                <option value="60">1 hour</option>
                              </Select>
                            </FormControl>
                            <Divider />
                            <Heading size="sm">Security Settings</Heading>
                            <FormControl display="flex" alignItems="center">
                              <FormLabel mb="0">Two-Factor Authentication</FormLabel>
                              <Switch colorScheme="blue" />
                            </FormControl>
                            <FormControl display="flex" alignItems="center">
                              <FormLabel mb="0">Session Timeout</FormLabel>
                              <Select defaultValue="30" size="sm" w="120px">
                                <option value="15">15 minutes</option>
                                <option value="30">30 minutes</option>
                                <option value="60">1 hour</option>
                                <option value="120">2 hours</option>
                              </Select>
                            </FormControl>
                          </VStack>
                        </CardBody>
                      </Card>
                    </SimpleGrid>
                    
                    <Flex justify="flex-end" mt={6}>
                      <Button colorScheme="blue" leftIcon={<FiSave />} onClick={handleSaveSettings}>
                        Save Settings
                      </Button>
                    </Flex>
                  </Box>
                </VStack>
              </TabPanel>
              
              {/* Users */}
              <TabPanel>
                <Flex justify="space-between" align="center" mb={6}>
                  <Heading size="md">User Management</Heading>
                  <Button leftIcon={<FiUserPlus />} colorScheme="blue" size="sm">
                    Add User
                  </Button>
                </Flex>
                
                <Box overflowX="auto">
                  <Table variant="simple">
                    <Thead>
                      <Tr>
                        <Th>Name</Th>
                        <Th>Email</Th>
                        <Th>Role</Th>
                        <Th>Status</Th>
                        <Th>Last Login</Th>
                        <Th>Actions</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {USERS.map((user) => (
                        <Tr key={user.id}>
                          <Td>
                            <HStack>
                              <Avatar size="sm" name={user.name} />
                              <Text>{user.name}</Text>
                            </HStack>
                          </Td>
                          <Td>{user.email}</Td>
                          <Td>
                            <Badge 
                              colorScheme={
                                user.role === 'Admin' ? 'green' :
                                user.role === 'Data Scientist' ? 'purple' :
                                user.role === 'Data Engineer' ? 'blue' :
                                user.role === 'Compliance Officer' ? 'red' : 'gray'
                              }
                            >
                              {user.role}
                            </Badge>
                          </Td>
                          <Td>
                            <Badge 
                              colorScheme={user.status === 'Active' ? 'green' : 'red'}
                              variant="subtle"
                            >
                              {user.status}
                            </Badge>
                          </Td>
                          <Td>{user.lastLogin}</Td>
                          <Td>
                            <HStack spacing={2}>
                              <Button size="sm" variant="ghost" colorScheme="blue" leftIcon={<FiEdit />}>
                                Edit
                              </Button>
                              <Button size="sm" variant="ghost" colorScheme="red" leftIcon={<FiTrash2 />}>
                                Delete
                              </Button>
                            </HStack>
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </Box>
              </TabPanel>
              
              {/* API Keys */}
              <TabPanel>
                <Flex justify="space-between" align="center" mb={6}>
                  <Heading size="md">API Keys</Heading>
                  <Button leftIcon={<FiKey />} colorScheme="blue" size="sm">
                    Generate New Key
                  </Button>
                </Flex>
                
                <Card bg="blue.50" mb={6}>
                  <CardBody>
                    <Flex>
                      <Icon as={FiInfo} color="blue.500" boxSize={6} mr={3} mt={1} />
                      <Box>
                        <Text fontWeight="medium" color="blue.700">API Keys for Integration</Text>
                        <Text color="blue.600">
                          Use these keys to authenticate API requests from external systems. 
                          Keep your keys secure — do not share them in public repositories or client-side code.
                        </Text>
                      </Box>
                    </Flex>
                  </CardBody>
                </Card>
                
                <Box overflowX="auto">
                  <Table variant="simple">
                    <Thead>
                      <Tr>
                        <Th>Description</Th>
                        <Th>Key</Th>
                        <Th>Created</Th>
                        <Th>Last Used</Th>
                        <Th>Status</Th>
                        <Th>Actions</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      <Tr>
                        <Td>Production API Key</Td>
                        <Td>
                          <HStack>
                            <Text fontFamily="mono">sk_live_****************************************</Text>
                            <Icon as={FiEye} color="gray.500" cursor="pointer" />
                          </HStack>
                        </Td>
                        <Td>2023-10-15</Td>
                        <Td>2023-11-05</Td>
                        <Td>
                          <Badge colorScheme="green">Active</Badge>
                        </Td>
                        <Td>
                          <HStack spacing={2}>
                            <Button size="sm" variant="ghost" colorScheme="blue" leftIcon={<FiEdit />}>
                              Rename
                            </Button>
                            <Button size="sm" variant="ghost" colorScheme="red" leftIcon={<FiTrash2 />}>
                              Revoke
                            </Button>
                          </HStack>
                        </Td>
                      </Tr>
                      <Tr>
                        <Td>Development API Key</Td>
                        <Td>
                          <HStack>
                            <Text fontFamily="mono">sk_test_****************************************</Text>
                            <Icon as={FiEye} color="gray.500" cursor="pointer" />
                          </HStack>
                        </Td>
                        <Td>2023-10-10</Td>
                        <Td>2023-11-04</Td>
                        <Td>
                          <Badge colorScheme="green">Active</Badge>
                        </Td>
                        <Td>
                          <HStack spacing={2}>
                            <Button size="sm" variant="ghost" colorScheme="blue" leftIcon={<FiEdit />}>
                              Rename
                            </Button>
                            <Button size="sm" variant="ghost" colorScheme="red" leftIcon={<FiTrash2 />}>
                              Revoke
                            </Button>
                          </HStack>
                        </Td>
                      </Tr>
                      <Tr>
                        <Td>Integration Testing</Td>
                        <Td>
                          <HStack>
                            <Text fontFamily="mono">sk_test_****************************************</Text>
                            <Icon as={FiEye} color="gray.500" cursor="pointer" />
                          </HStack>
                        </Td>
                        <Td>2023-09-22</Td>
                        <Td>2023-10-15</Td>
                        <Td>
                          <Badge colorScheme="red">Revoked</Badge>
                        </Td>
                        <Td>
                          <HStack spacing={2}>
                            <Button size="sm" variant="ghost" colorScheme="blue" leftIcon={<FiShield />}>
                              Restore
                            </Button>
                            <Button size="sm" variant="ghost" colorScheme="red" leftIcon={<FiTrash2 />}>
                              Delete
                            </Button>
                          </HStack>
                        </Td>
                      </Tr>
                    </Tbody>
                  </Table>
                </Box>
              </TabPanel>
              
              {/* Notifications */}
              <TabPanel>
                <VStack spacing={6} align="stretch">
                  <Flex justify="space-between" align="center">
                    <Heading size="md">Notification Settings</Heading>
                    <Button leftIcon={<FiSave />} colorScheme="blue" size="sm" onClick={handleSaveSettings}>
                      Save Settings
                    </Button>
                  </Flex>
                  
                  <Card variant="outline">
                    <CardBody>
                      <Heading size="sm" mb={4}>Email Notifications</Heading>
                      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                        <FormControl display="flex" alignItems="center">
                          <FormLabel mb="0">Model Drift Alerts</FormLabel>
                          <Switch colorScheme="blue" defaultChecked />
                        </FormControl>
                        <FormControl display="flex" alignItems="center">
                          <FormLabel mb="0">Risk Assessment Results</FormLabel>
                          <Switch colorScheme="blue" defaultChecked />
                        </FormControl>
                        <FormControl display="flex" alignItems="center">
                          <FormLabel mb="0">System Updates</FormLabel>
                          <Switch colorScheme="blue" defaultChecked />
                        </FormControl>
                        <FormControl display="flex" alignItems="center">
                          <FormLabel mb="0">User Account Changes</FormLabel>
                          <Switch colorScheme="blue" defaultChecked />
                        </FormControl>
                        <FormControl display="flex" alignItems="center">
                          <FormLabel mb="0">Weekly Reports</FormLabel>
                          <Switch colorScheme="blue" />
                        </FormControl>
                        <FormControl display="flex" alignItems="center">
                          <FormLabel mb="0">Performance Metrics</FormLabel>
                          <Switch colorScheme="blue" />
                        </FormControl>
                      </SimpleGrid>
                    </CardBody>
                  </Card>
                  
                  <Card variant="outline">
                    <CardBody>
                      <Heading size="sm" mb={4}>In-App Notifications</Heading>
                      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                        <FormControl display="flex" alignItems="center">
                          <FormLabel mb="0">Model Training Completion</FormLabel>
                          <Switch colorScheme="blue" defaultChecked />
                        </FormControl>
                        <FormControl display="flex" alignItems="center">
                          <FormLabel mb="0">New Risk Alerts</FormLabel>
                          <Switch colorScheme="blue" defaultChecked />
                        </FormControl>
                        <FormControl display="flex" alignItems="center">
                          <FormLabel mb="0">Task Assignments</FormLabel>
                          <Switch colorScheme="blue" defaultChecked />
                        </FormControl>
                        <FormControl display="flex" alignItems="center">
                          <FormLabel mb="0">Comments & Mentions</FormLabel>
                          <Switch colorScheme="blue" defaultChecked />
                        </FormControl>
                        <FormControl display="flex" alignItems="center">
                          <FormLabel mb="0">New Feature Announcements</FormLabel>
                          <Switch colorScheme="blue" />
                        </FormControl>
                        <FormControl display="flex" alignItems="center">
                          <FormLabel mb="0">Usage Statistics</FormLabel>
                          <Switch colorScheme="blue" />
                        </FormControl>
                      </SimpleGrid>
                    </CardBody>
                  </Card>
                  
                  <Card variant="outline">
                    <CardBody>
                      <Heading size="sm" mb={4}>Integrations</Heading>
                      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
                        <Card variant="outline">
                          <CardBody>
                            <VStack>
                              <Icon as={FiBell} boxSize={8} color="blue.500" />
                              <Heading size="sm">Slack</Heading>
                              <Badge colorScheme="green">Connected</Badge>
                              <Button size="sm" variant="outline">Configure</Button>
                            </VStack>
                          </CardBody>
                        </Card>
                        
                        <Card variant="outline">
                          <CardBody>
                            <VStack>
                              <Icon as={FiBell} boxSize={8} color="purple.500" />
                              <Heading size="sm">Microsoft Teams</Heading>
                              <Badge colorScheme="red">Not Connected</Badge>
                              <Button size="sm" variant="outline">Connect</Button>
                            </VStack>
                          </CardBody>
                        </Card>
                        
                        <Card variant="outline">
                          <CardBody>
                            <VStack>
                              <Icon as={FiBell} boxSize={8} color="orange.500" />
                              <Heading size="sm">SMS</Heading>
                              <Badge colorScheme="green">Connected</Badge>
                              <Button size="sm" variant="outline">Configure</Button>
                            </VStack>
                          </CardBody>
                        </Card>
                      </SimpleGrid>
                    </CardBody>
                  </Card>
                </VStack>
              </TabPanel>
              
              {/* Audit Logs */}
              <TabPanel>
                <Flex justify="space-between" align="center" mb={6}>
                  <Heading size="md">Audit Log</Heading>
                  <Button leftIcon={<FiDownload />} colorScheme="blue" size="sm">
                    Export Logs
                  </Button>
                </Flex>
                
                <Card bg="yellow.50" mb={6}>
                  <CardBody>
                    <Flex>
                      <Icon as={FiAlertTriangle} color="yellow.500" boxSize={6} mr={3} mt={1} />
                      <Box>
                        <Text fontWeight="medium" color="yellow.700">Audit Log Retention Policy</Text>
                        <Text color="yellow.600">
                          Audit logs are retained for 90 days. For compliance purposes, consider 
                          exporting logs regularly if longer retention is required.
                        </Text>
                      </Box>
                    </Flex>
                  </CardBody>
                </Card>
                
                <Box overflowX="auto">
                  <Table variant="simple">
                    <Thead>
                      <Tr>
                        <Th>Timestamp</Th>
                        <Th>User</Th>
                        <Th>Action</Th>
                        <Th>Resource</Th>
                        <Th>IP Address</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {ACTIVITY_LOGS.map((log) => (
                        <Tr key={log.id}>
                          <Td>{log.timestamp}</Td>
                          <Td>{log.user}</Td>
                          <Td>{log.action}</Td>
                          <Td>{log.resource}</Td>
                          <Td><Text fontFamily="mono">{log.ip}</Text></Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </Box>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </CardBody>
      </Card>
    </DashboardLayout>
  );
} 