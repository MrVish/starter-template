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
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Tooltip,
  Divider,
  Progress,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  FormControl,
  FormLabel,
  useDisclosure,
  Textarea,
} from '@chakra-ui/react';
import {
  FiTarget,
  FiSearch,
  FiFilter,
  FiPlus,
  FiEdit,
  FiTrash2,
  FiCalendar,
  FiBarChart2,
  FiDollarSign,
  FiUsers,
  FiStar,
  FiCheck,
  FiFlag,
  FiClock,
  FiArrowUp,
  FiArrowDown,
  FiMoreVertical,
  FiDownload,
  FiLink,
  FiSave,
  FiAlertTriangle,
} from 'react-icons/fi';
import DashboardLayout from '../../../components/layout/DashboardLayout';

// Sample marketing strategies data
const MARKETING_STRATEGIES = [
  {
    id: 1,
    name: 'Digital Banking Growth Plan',
    description: 'Strategy to increase digital banking adoption across all segments',
    status: 'Active',
    priority: 'High',
    budget: '$1,200,000',
    timeframe: 'Q1-Q3 2024',
    owner: 'Alex Johnson',
    progress: 45,
    kpis: [
      { name: 'Digital Adoption', target: '30%', current: '22%', trend: 'up' },
      { name: 'Mobile Transactions', target: '65%', current: '48%', trend: 'up' },
      { name: 'Customer Acquisition', target: '15,000', current: '8,700', trend: 'up' },
    ],
    lastUpdated: '2024-03-15',
  },
  {
    id: 2,
    name: 'Investment Portfolio Expansion',
    description: 'Strategy to grow investment portfolio services and customer base',
    status: 'Active',
    priority: 'Medium',
    budget: '$850,000',
    timeframe: 'Q2-Q4 2024',
    owner: 'Sarah Williams',
    progress: 25,
    kpis: [
      { name: 'Portfolio Value', target: '+20%', current: '+8%', trend: 'up' },
      { name: 'Investment Customers', target: '8,000', current: '3,200', trend: 'up' },
      { name: 'Fee Revenue', target: '+15%', current: '+6%', trend: 'up' },
    ],
    lastUpdated: '2024-03-14',
  },
  {
    id: 3,
    name: 'Small Business Banking Initiative',
    description: 'Strategy to increase presence in small business banking market',
    status: 'Planning',
    priority: 'Medium',
    budget: '$950,000',
    timeframe: 'Q3 2024-Q1 2025',
    owner: 'Michael Chen',
    progress: 10,
    kpis: [
      { name: 'SMB Accounts', target: '10,000', current: '1,200', trend: 'up' },
      { name: 'Loan Volume', target: '+25%', current: '+5%', trend: 'up' },
      { name: 'Market Share', target: '18%', current: '12%', trend: 'up' },
    ],
    lastUpdated: '2024-03-10',
  },
  {
    id: 4,
    name: 'Customer Loyalty Program Redesign',
    description: 'Strategy to enhance and improve the customer loyalty program',
    status: 'On Hold',
    priority: 'Low',
    budget: '$500,000',
    timeframe: 'Q4 2024',
    owner: 'Jessica Brown',
    progress: 5,
    kpis: [
      { name: 'Loyalty Enrollment', target: '+40%', current: '0%', trend: 'neutral' },
      { name: 'Program Engagement', target: '60%', current: '32%', trend: 'neutral' },
      { name: 'Customer Retention', target: '+15%', current: '0%', trend: 'neutral' },
    ],
    lastUpdated: '2024-03-08',
  },
];

export default function StrategyPlanning() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [activeStrategy, setActiveStrategy] = useState<any>(null);
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  const filteredStrategies = MARKETING_STRATEGIES.filter(strategy =>
    (filterStatus === 'All' || strategy.status === filterStatus) &&
    strategy.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleOpenDrawer = (strategy: any) => {
    setActiveStrategy(strategy);
    onOpen();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'green';
      case 'Planning': return 'blue';
      case 'On Hold': return 'orange';
      case 'Completed': return 'gray';
      default: return 'gray';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'red';
      case 'Medium': return 'orange';
      case 'Low': return 'green';
      default: return 'gray';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return FiArrowUp;
      case 'down': return FiArrowDown;
      default: return FiTarget;
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up': return 'green';
      case 'down': return 'red';
      default: return 'gray';
    }
  };

  return (
    <DashboardLayout>
      <Box mb={6}>
        <HStack spacing={4} align="center" mb={6}>
          <Icon as={FiTarget} boxSize={8} color="blue.500" />
          <Box>
            <Heading as="h1" size="xl" color="secondary.700">
              Strategy Planning
            </Heading>
            <Text color="gray.600">
              Create and manage long-term marketing strategies
            </Text>
          </Box>
        </HStack>

        {/* Summary Cards */}
        <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6} mb={8}>
          <Card bg={cardBg}>
            <CardBody>
              <Stat>
                <StatLabel color="gray.500">Active Strategies</StatLabel>
                <StatNumber>
                  {MARKETING_STRATEGIES.filter(s => s.status === 'Active').length}
                </StatNumber>
                <StatHelpText>
                  Total: {MARKETING_STRATEGIES.length}
                </StatHelpText>
              </Stat>
            </CardBody>
          </Card>
          <Card bg={cardBg}>
            <CardBody>
              <Stat>
                <StatLabel color="gray.500">Total Budget</StatLabel>
                <StatNumber>$3.5M</StatNumber>
                <StatHelpText>
                  <HStack>
                    <Icon as={FiDollarSign} color="green.500" />
                    <Text color="green.500">68% Allocated</Text>
                  </HStack>
                </StatHelpText>
              </Stat>
            </CardBody>
          </Card>
          <Card bg={cardBg}>
            <CardBody>
              <Stat>
                <StatLabel color="gray.500">Avg. Progress</StatLabel>
                <StatNumber>28%</StatNumber>
                <StatHelpText>
                  <HStack>
                    <Icon as={FiArrowUp} color="green.500" />
                    <Text color="green.500">+12% from last month</Text>
                  </HStack>
                </StatHelpText>
              </Stat>
            </CardBody>
          </Card>
          <Card bg={cardBg}>
            <CardBody>
              <Stat>
                <StatLabel color="gray.500">KPI Performance</StatLabel>
                <StatNumber>72%</StatNumber>
                <StatHelpText>
                  <HStack>
                    <Icon as={FiArrowUp} color="green.500" />
                    <Text color="green.500">On Track</Text>
                  </HStack>
                </StatHelpText>
              </Stat>
            </CardBody>
          </Card>
        </SimpleGrid>

        {/* Search and Filter */}
        <Flex gap={4} mb={6} wrap="wrap">
          <InputGroup maxW="320px">
            <InputLeftElement pointerEvents="none">
              <Icon as={FiSearch} color="gray.400" />
            </InputLeftElement>
            <Input
              placeholder="Search strategies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </InputGroup>
          <Select
            maxW="200px"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="All">All Status</option>
            <option value="Active">Active</option>
            <option value="Planning">Planning</option>
            <option value="On Hold">On Hold</option>
            <option value="Completed">Completed</option>
          </Select>
          <Button leftIcon={<Icon as={FiPlus} />} colorScheme="blue">
            Create Strategy
          </Button>
        </Flex>

        {/* Strategy Cards */}
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
          {filteredStrategies.map((strategy) => (
            <Card 
              key={strategy.id} 
              bg={cardBg}
              borderWidth="1px"
              borderColor={borderColor}
              _hover={{
                transform: 'translateY(-2px)',
                boxShadow: 'lg',
              }}
              transition="all 0.2s"
            >
              <CardBody>
                <VStack align="start" spacing={4}>
                  <HStack width="full" justify="space-between">
                    <Badge colorScheme={getStatusColor(strategy.status)}>
                      {strategy.status}
                    </Badge>
                    <HStack>
                      <IconButton
                        icon={<Icon as={FiEdit} />}
                        aria-label="Edit"
                        size="sm"
                        variant="ghost"
                        onClick={() => handleOpenDrawer(strategy)}
                      />
                      <Menu>
                        <MenuButton
                          as={IconButton}
                          icon={<Icon as={FiMoreVertical} />}
                          variant="ghost"
                          size="sm"
                        />
                        <MenuList>
                          <MenuItem icon={<Icon as={FiBarChart2} />}>View Analytics</MenuItem>
                          <MenuItem icon={<Icon as={FiLink} />}>Related Campaigns</MenuItem>
                          <MenuItem icon={<Icon as={FiDownload} />}>Export Strategy</MenuItem>
                          <MenuItem icon={<Icon as={FiTrash2} />} color="red.500">
                            Delete Strategy
                          </MenuItem>
                        </MenuList>
                      </Menu>
                    </HStack>
                  </HStack>

                  <Heading size="md">{strategy.name}</Heading>
                  <Text color="gray.600">{strategy.description}</Text>

                  <HStack justify="space-between" width="full">
                    <Box>
                      <Text fontWeight="bold" fontSize="sm" color="gray.500">Budget</Text>
                      <Text>{strategy.budget}</Text>
                    </Box>
                    <Box>
                      <Text fontWeight="bold" fontSize="sm" color="gray.500">Timeframe</Text>
                      <Text>{strategy.timeframe}</Text>
                    </Box>
                    <Box>
                      <Text fontWeight="bold" fontSize="sm" color="gray.500">Priority</Text>
                      <Badge colorScheme={getPriorityColor(strategy.priority)}>
                        {strategy.priority}
                      </Badge>
                    </Box>
                  </HStack>

                  <Box width="full">
                    <HStack justify="space-between" mb={1}>
                      <Text fontWeight="bold" fontSize="sm">Progress</Text>
                      <Text fontWeight="bold" fontSize="sm">{strategy.progress}%</Text>
                    </HStack>
                    <Progress value={strategy.progress} colorScheme="blue" size="sm" borderRadius="full" />
                  </Box>

                  <Divider />

                  <Box width="full">
                    <Text fontWeight="bold" fontSize="sm" mb={2}>Key Performance Indicators</Text>
                    <VStack align="start" spacing={2}>
                      {strategy.kpis.map((kpi, index) => (
                        <HStack key={index} justify="space-between" width="full">
                          <Text fontSize="sm">{kpi.name}</Text>
                          <HStack>
                            <Text fontSize="sm">{kpi.current}</Text>
                            <Text fontSize="sm" color="gray.500">/ {kpi.target}</Text>
                            <Icon as={getTrendIcon(kpi.trend)} color={getTrendColor(kpi.trend)} />
                          </HStack>
                        </HStack>
                      ))}
                    </VStack>
                  </Box>

                  <HStack justify="space-between" width="full" fontSize="sm" color="gray.500">
                    <Text>Owner: {strategy.owner}</Text>
                    <Text>Updated: {strategy.lastUpdated}</Text>
                  </HStack>

                  <Button 
                    variant="outline" 
                    colorScheme="blue" 
                    size="sm" 
                    width="full"
                    onClick={() => handleOpenDrawer(strategy)}
                  >
                    View Details
                  </Button>
                </VStack>
              </CardBody>
            </Card>
          ))}
        </SimpleGrid>
      </Box>

      {/* Strategy Details Drawer */}
      {activeStrategy && (
        <Drawer
          isOpen={isOpen}
          placement="right"
          onClose={onClose}
          size="lg"
        >
          <DrawerOverlay />
          <DrawerContent>
            <DrawerCloseButton />
            <DrawerHeader borderBottomWidth="1px">
              <Badge colorScheme={getStatusColor(activeStrategy.status)} mb={2}>
                {activeStrategy.status}
              </Badge>
              <Heading size="md">{activeStrategy.name}</Heading>
            </DrawerHeader>

            <DrawerBody>
              <VStack spacing={6} align="start">
                <Box width="full">
                  <Text fontWeight="bold" mb={2}>Description</Text>
                  <Text color="gray.600">{activeStrategy.description}</Text>
                </Box>

                <SimpleGrid columns={2} width="full" spacing={4}>
                  <Box>
                    <Text fontWeight="bold" fontSize="sm" color="gray.500">Owner</Text>
                    <Text>{activeStrategy.owner}</Text>
                  </Box>
                  <Box>
                    <Text fontWeight="bold" fontSize="sm" color="gray.500">Budget</Text>
                    <Text>{activeStrategy.budget}</Text>
                  </Box>
                  <Box>
                    <Text fontWeight="bold" fontSize="sm" color="gray.500">Timeframe</Text>
                    <Text>{activeStrategy.timeframe}</Text>
                  </Box>
                  <Box>
                    <Text fontWeight="bold" fontSize="sm" color="gray.500">Priority</Text>
                    <Badge colorScheme={getPriorityColor(activeStrategy.priority)}>
                      {activeStrategy.priority}
                    </Badge>
                  </Box>
                </SimpleGrid>

                <Box width="full">
                  <HStack justify="space-between" mb={1}>
                    <Text fontWeight="bold">Progress</Text>
                    <Text fontWeight="bold">{activeStrategy.progress}%</Text>
                  </HStack>
                  <Progress value={activeStrategy.progress} colorScheme="blue" size="md" borderRadius="full" />
                </Box>

                <Box width="full">
                  <Text fontWeight="bold" mb={4}>KPI Performance</Text>
                  <Table variant="simple" size="sm">
                    <Thead>
                      <Tr>
                        <Th>KPI</Th>
                        <Th>Current</Th>
                        <Th>Target</Th>
                        <Th>Status</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {activeStrategy.kpis.map((kpi: any, index: number) => (
                        <Tr key={index}>
                          <Td>{kpi.name}</Td>
                          <Td>{kpi.current}</Td>
                          <Td>{kpi.target}</Td>
                          <Td>
                            <HStack>
                              <Icon as={getTrendIcon(kpi.trend)} color={getTrendColor(kpi.trend)} />
                              <Text color={getTrendColor(kpi.trend)}>
                                {kpi.trend === 'up' ? 'On Track' : kpi.trend === 'down' ? 'At Risk' : 'Neutral'}
                              </Text>
                            </HStack>
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </Box>

                <Divider />

                <Box width="full">
                  <Text fontWeight="bold" mb={2}>Strategy Notes</Text>
                  <Textarea placeholder="Add strategy notes here..." rows={5} />
                </Box>

                <HStack width="full" justify="space-between">
                  <Button variant="outline" colorScheme="red" leftIcon={<Icon as={FiAlertTriangle} />}>
                    Flag Issues
                  </Button>
                  <HStack>
                    <Button variant="outline" onClick={onClose}>
                      Cancel
                    </Button>
                    <Button colorScheme="blue" leftIcon={<Icon as={FiSave} />}>
                      Save Changes
                    </Button>
                  </HStack>
                </HStack>
              </VStack>
            </DrawerBody>
          </DrawerContent>
        </Drawer>
      )}
    </DashboardLayout>
  );
} 