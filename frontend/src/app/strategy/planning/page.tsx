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
    name: 'Digital Wealth Management Transition',
    description: 'Strategy to increase digital portfolio management adoption across high-net-worth clients',
    startDate: '2023-01-15',
    endDate: '2023-12-31',
    status: 'Active',
    progress: 65,
    owner: 'Sarah Johnson',
    team: ['Marketing', 'Digital', 'IT'],
    metrics: [
      { name: 'Portfolio Digital Adoption', target: '+40%', current: '+22%', trend: 'up' },
      { name: 'Client Satisfaction', target: '4.8/5', current: '4.3/5', trend: 'up' },
      { name: 'New AUM Acquired', target: '$500M', current: '$325M', trend: 'up' },
    ]
  },
  {
    id: 2,
    name: 'Retirement Planning Advisory Expansion',
    description: 'Strategy to grow retirement planning advisory services and client base',
    startDate: '2023-02-01',
    endDate: '2023-06-30',
    status: 'Active',
    progress: 40,
    owner: 'Michael Chen',
    team: ['Investment', 'Marketing', 'Product'],
    metrics: [
      { name: 'New Advisory Packages', target: '5', current: '2', trend: 'up' },
      { name: 'Retirement AUM', target: '+$350M', current: '+$140M', trend: 'up' },
      { name: 'Pre-Retirement Clients', target: '12,000', current: '5,400', trend: 'up' },
    ]
  },
  {
    id: 3,
    name: 'Personalized Wealth Dashboard',
    description: 'Launch of personalized wealth management dashboard with AI insights',
    startDate: '2023-03-10',
    endDate: '2023-08-15',
    status: 'Planning',
    progress: 15,
    owner: 'Emily Wong',
    team: ['UX/UI', 'Mobile', 'IT'],
    metrics: [
      { name: 'Portfolio Insight Adoption', target: '60%', current: '0%', trend: 'neutral' },
      { name: 'Financial Planning Actions', target: '+45%', current: '0%', trend: 'neutral' },
      { name: 'Cross-Asset Class Views', target: '+35%', current: '0%', trend: 'neutral' },
    ]
  },
  {
    id: 4,
    name: 'Premier Client Benefits Program',
    description: 'Strategy to enhance benefits and experiences for high-value banking clients',
    startDate: '2023-04-01',
    endDate: '2023-09-30',
    status: 'Draft',
    progress: 5,
    owner: 'David Turner',
    team: ['Marketing', 'Customer Experience'],
    metrics: [
      { name: 'Premier Client Retention', target: '+18%', current: '0%', trend: 'neutral' },
      { name: 'Share of Wallet', target: '+25%', current: '0%', trend: 'neutral' },
      { name: 'Net Promoter Score', target: '+22pts', current: '0pts', trend: 'neutral' },
    ]
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
              Marketing Strategy
            </Heading>
            <Text color="gray.600">
              Create and manage long-term financial marketing strategies
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
                      <HStack align="start" spacing={4} mb={2}>
                        <Text fontSize="sm" fontWeight="medium">Budget:</Text>
                        <Text fontSize="sm">{`$${Math.floor(Math.random() * 500000 + 500000).toLocaleString()}`}</Text>
                      </HStack>
                    </Box>
                    <Box>
                      <Text fontWeight="bold" fontSize="sm" color="gray.500">Timeframe</Text>
                      <HStack align="start" spacing={4} mb={2}>
                        <Text fontSize="sm" fontWeight="medium">Timeframe:</Text>
                        <Text fontSize="sm">{`${strategy.startDate} - ${strategy.endDate}`}</Text>
                      </HStack>
                    </Box>
                    <Box>
                      <Text fontWeight="bold" fontSize="sm" color="gray.500">Priority</Text>
                      <Badge colorScheme={Math.random() > 0.5 ? "red" : Math.random() > 0.5 ? "orange" : "yellow"}>
                        {Math.random() > 0.6 ? "High" : Math.random() > 0.5 ? "Medium" : "Low"}
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
                      {strategy.metrics.map((kpi, index) => (
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
                    <HStack align="start" spacing={4} mb={2}>
                      <Text fontSize="sm" fontWeight="medium">Last Updated:</Text>
                      <Text fontSize="sm">{new Date().toISOString().split('T')[0]}</Text>
                    </HStack>
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
                    <Text>${Math.floor(Math.random() * 500000 + 500000).toLocaleString()}</Text>
                  </Box>
                  <Box>
                    <Text fontWeight="bold" fontSize="sm" color="gray.500">Timeframe</Text>
                    <Text>{`${activeStrategy.startDate} - ${activeStrategy.endDate}`}</Text>
                  </Box>
                  <Box>
                    <Text fontWeight="bold" fontSize="sm" color="gray.500">Priority</Text>
                    <Badge colorScheme={Math.random() > 0.5 ? "red" : Math.random() > 0.5 ? "orange" : "yellow"}>
                      {Math.random() > 0.6 ? "High" : Math.random() > 0.5 ? "Medium" : "Low"}
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
                      {activeStrategy.metrics.map((kpi: any, index: number) => (
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