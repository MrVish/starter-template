'use client'

import React, { useState, useMemo, useEffect } from 'react'
import {
  Box,
  Heading,
  Text,
  Card,
  CardBody,
  Button,
  Flex,
  Icon,
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
  Spinner,
  Alert,
  AlertIcon,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  Progress,
} from '@chakra-ui/react'
import {
  FiBarChart2,
  FiDownload,
  FiMoreVertical,
  FiPieChart,
  FiUsers,
  FiTrendingUp,
  FiTarget,
  FiMail,
  FiSmartphone,
  FiGlobe,
  FiMapPin,
  FiHome,
} from 'react-icons/fi'
import DashboardLayout from '../../../components/layout/DashboardLayout'
import useInsights from '../../../hooks/useInsights'

export default function StrategyInsights() {
  const [timeRange, setTimeRange] = useState('all')
  const [forceShow, setForceShow] = useState(false)
  const cardBg = useColorModeValue('white', 'gray.800')

  // Fetch insights data with our custom hook - ensure timeRange is valid
  const validTimeRange = useMemo(() => {
    // Validate timeRange to ensure it's one of the expected values
    const validRanges = ['7d', '30d', '90d', '1y', 'all']
    return validRanges.includes(timeRange) ? timeRange : 'all'
  }, [timeRange])

  const { data, loading, error } = useInsights(validTimeRange)

  // Handle timeRange changes with validation
  const handleTimeRangeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newValue = e.target.value
    console.log("Changing timeRange to:", newValue)
    setTimeRange(newValue)

    // Reset forceShow when changing time range
    setForceShow(false)
  }

  // Debug log
  useEffect(() => {
    console.log("====== DEBUG: StrategyInsights component state update ======")
    console.log("- timeRange:", timeRange)
    console.log("- validTimeRange:", validTimeRange)
    console.log("- loading:", loading)
    console.log("- error:", error)
    console.log("- data exists:", !!data)
    if (data) {
      console.log("- data.campaigns:", data.campaigns)
      console.log("- campaigns length:", data.campaigns?.length || 0)
      if (data.campaigns && data.campaigns.length > 0) {
        console.log("- first campaign:", data.campaigns[0])
      }
    }
    console.log("==========================================================")
  }, [data, loading, error, timeRange, validTimeRange])

  // Force show data after 8 seconds even if loading is still true
  useEffect(() => {
    if (loading) {
      const timer = setTimeout(() => {
        console.log("Force showing content after 8 second timeout")
        setForceShow(true)
      }, 8000)
      return () => clearTimeout(timer)
    } else {
      setForceShow(false)
    }
  }, [loading])

  // Check if we have any real data to display
  const hasData = useMemo(() => {
    if (!data) return false
    if (!data.campaigns) return false
    if (!Array.isArray(data.campaigns)) return false
    if (data.campaigns.length === 0) return false

    // We have campaigns, but let's verify they have the minimal required fields
    const hasValidCampaigns = data.campaigns.some(campaign =>
      campaign &&
      typeof campaign === 'object' &&
      campaign.name &&
      campaign.status
    )

    console.log("hasData evaluation result:", hasValidCampaigns,
      "data exists:", !!data,
      "campaigns exists:", !!data?.campaigns,
      "campaigns is array:", Array.isArray(data?.campaigns),
      "campaign length:", data?.campaigns?.length || 0)

    return hasValidCampaigns
  }, [data])

  console.log("Current state:", { loading, error, dataExists: !!data, hasData, forceShow })

  // Show loading spinner when loading and not forced to show
  if (loading && !forceShow) {
    console.log("Rendering loading state")
    return (
      <DashboardLayout>
        <Box mb={6}>
          <HStack spacing={4} align="center" mb={6}>
            <Icon as={FiPieChart} boxSize={8} color="blue.500" />
            <Box>
              <Heading as="h1" size="xl" color="secondary.700">
                Strategy Insights
              </Heading>
              <Text color="gray.600">
                Loading your strategy insights data...
              </Text>
            </Box>
          </HStack>
        </Box>
        <Flex height="50vh" width="100%" justify="center" align="center" direction="column" gap={4}>
          <Spinner size="xl" color="blue.500" thickness="4px" speed="0.65s" />
          <Text fontSize="lg" color="blue.500">Loading insights data...</Text>
          <Text fontSize="sm" color="gray.500" mt={2}>Taking longer than expected? <Button size="sm" variant="link" colorScheme="blue" onClick={() => setForceShow(true)}>Continue anyway</Button></Text>
        </Flex>
      </DashboardLayout>
    )
  }

  // Show error state with a refresh button when not loading but we have an error or no data
  if (!loading && (!hasData || error)) {
    console.log("Rendering error state, reason:",
      !data ? "no data" : !hasData ? "no valid campaigns" : "error: " + error)
    return (
      <DashboardLayout>
        <Box mb={6}>
          <HStack spacing={4} align="center" mb={6}>
            <Icon as={FiPieChart} boxSize={8} color="blue.500" />
            <Box>
              <Heading as="h1" size="xl" color="secondary.700">
                Strategy Insights
              </Heading>
              <Text color="gray.600">
                Analytics and performance tracking
              </Text>
            </Box>
          </HStack>
        </Box>
        <Alert status="warning" variant="solid" borderRadius="md" mb={6}>
          <AlertIcon />
          {error || "No campaign data available for the selected time period."}
        </Alert>
        <VStack spacing={4} align="start">
          <Text>Try one of the following options:</Text>
          <HStack>
            <Select
              maxW="200px"
              value={timeRange}
              onChange={handleTimeRangeChange}
            >
              <option value="all">All Time</option>
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
              <option value="90d">Last 90 Days</option>
              <option value="1y">Last Year</option>
            </Select>
            <Button
              colorScheme="blue"
              leftIcon={<Icon as={FiBarChart2} />}
              onClick={() => window.location.reload()}
            >
              Refresh Page
            </Button>
          </HStack>
        </VStack>
      </DashboardLayout>
    )
  }

  // Ensure we have data to proceed with rendering
  if (!data || !hasData) {
    console.log("No data to render, returning null")
    return null // This shouldn't happen but as a fallback
  }

  // Access data safely - we know it exists at this point
  const { campaigns, keyMetrics, channelPerformance, segmentPerformance } = data
  console.log("Rendering data state with", campaigns.length, "campaigns")

  // Get channel icon based on channel name
  const getChannelIcon = (channelName: string) => {
    const name = channelName.toLowerCase()
    if (name.includes('email')) return FiMail
    if (name.includes('mobile') || name.includes('app')) return FiSmartphone
    if (name.includes('social') || name.includes('web')) return FiGlobe
    if (name.includes('branch') || name.includes('visit')) return FiMapPin
    if (name.includes('mail')) return FiHome
    return FiBarChart2
  }

  // Calculate color of progress bar for segments
  const getSegmentColor = (percentage: number) => {
    if (percentage < 30) return 'red'
    if (percentage < 60) return 'yellow'
    return 'green'
  }

  const getStatusColor = (status: string) => {
    // Convert status to lowercase for consistent comparison
    const statusLower = status.toLowerCase()
    switch (statusLower) {
      case 'active': return 'green'
      case 'in progress': return 'blue'
      case 'planned': return 'orange'
      case 'paused': return 'yellow'
      case 'completed': return 'purple'
      default: return 'gray'
    }
  }

  return (
    <DashboardLayout>
      <Box mb={6}>
        <HStack spacing={4} align="center" mb={6}>
          <Icon as={FiPieChart} boxSize={8} color="blue.500" />
          <Box>
            <Heading as="h1" size="xl" color="secondary.700">
              Strategy Insights
            </Heading>
            <Text color="gray.600">
              Campaign Analytics and Performance
            </Text>
          </Box>
        </HStack>

        {/* Time Range Selector */}
        <Flex justify="flex-end" mb={6}>
          <Select
            maxW="200px"
            value={timeRange}
            onChange={handleTimeRangeChange}
            isDisabled={loading} // Disable during loading
          >
            <option value="all">All Time</option>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last 90 Days</option>
            <option value="1y">Last Year</option>
          </Select>
        </Flex>

        {/* Show loading state - different types based on context */}
        {loading && (
          <Alert status="info" variant="left-accent" mb={6}>
            <AlertIcon />
            <Flex align="center" justify="space-between" width="100%">
              <Box>
                <Text fontWeight="medium">Data is being refreshed</Text>
                <Text fontSize="sm">
                  Please wait while we fetch the latest data.
                </Text>
              </Box>
              <Spinner size="sm" ml={4} />
            </Flex>
          </Alert>
        )}

        {/* Key Metrics */}
        <Card bg={cardBg} mb={8}>
          <CardBody>
            <VStack align="start" spacing={6}>
              <Heading size="md">Key Performance Metrics</Heading>
              <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6} w="full">
                {keyMetrics.map((metric) => (
                  <Stat key={metric.id} p={3} shadow="sm" border="1px" borderColor="gray.200" borderRadius="md">
                    <StatLabel>{metric.metric}</StatLabel>
                    <StatNumber>{metric.value}</StatNumber>
                    <StatHelpText>
                      <HStack spacing={1}>
                        <Text fontSize="xs" color="gray.500">Target: {metric.target}</Text>
                        <StatArrow type={metric.trend === 'up' ? 'increase' : 'decrease'} />
                        <Text>{metric.change}</Text>
                      </HStack>
                    </StatHelpText>
                  </Stat>
                ))}
              </SimpleGrid>
            </VStack>
          </CardBody>
        </Card>

        {/* Campaign Performance */}
        <Card bg={cardBg} mb={8}>
          <CardBody>
            <VStack align="start" spacing={6}>
              <HStack justify="space-between" w="full">
                <Heading size="md">Campaign Performance</Heading>
                <Button leftIcon={<Icon as={FiDownload} />} variant="ghost">
                  Export
                </Button>
              </HStack>
              <Box overflowX="auto" w="full">
                <Table variant="simple">
                  <Thead>
                    <Tr>
                      <Th>Campaign Name</Th>
                      <Th>Status</Th>
                      <Th>Period</Th>
                      <Th>Budget</Th>
                      <Th>Spend</Th>
                      <Th>Results</Th>
                      <Th>Actions</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {campaigns.map((campaign) => (
                      <Tr key={campaign.id}>
                        <Td fontWeight="medium">{campaign.name}</Td>
                        <Td>
                          <Badge colorScheme={getStatusColor(campaign.status)}>
                            {campaign.status}
                          </Badge>
                        </Td>
                        <Td>
                          <VStack align="start" spacing={0}>
                            <Text fontSize="sm">{campaign.start}</Text>
                            <Text fontSize="sm">{campaign.end}</Text>
                          </VStack>
                        </Td>
                        <Td>{campaign.budget}</Td>
                        <Td>{campaign.spend}</Td>
                        <Td>
                          {campaign.results && (
                            <>
                              {campaign.results.attendees && (
                                <Text fontSize="sm">Attendees: {campaign.results.attendees}</Text>
                              )}
                              {campaign.results.leads && (
                                <Text fontSize="sm">Leads: {campaign.results.leads}</Text>
                              )}
                              {campaign.results.conversions && (
                                <Text fontSize="sm">Conversions: {campaign.results.conversions}</Text>
                              )}
                              {campaign.results.revenue && (
                                <Text fontSize="sm">Revenue: {campaign.results.revenue}</Text>
                              )}
                            </>
                          )}
                        </Td>
                        <Td>
                          <Menu>
                            <MenuButton
                              as={IconButton}
                              icon={<Icon as={FiMoreVertical} />}
                              variant="ghost"
                              size="sm"
                            />
                            <MenuList>
                              <MenuItem icon={<Icon as={FiBarChart2} />}>View Details</MenuItem>
                              <MenuItem icon={<Icon as={FiDownload} />}>Export Data</MenuItem>
                            </MenuList>
                          </Menu>
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </Box>
            </VStack>
          </CardBody>
        </Card>

        {/* Channel Performance */}
        <Card bg={cardBg} mb={8}>
          <CardBody>
            <VStack align="start" spacing={6}>
              <HStack justify="space-between" w="full">
                <Heading size="md">Channel Performance</Heading>
                <Button leftIcon={<Icon as={FiDownload} />} variant="ghost">
                  Export
                </Button>
              </HStack>
              <Box overflowX="auto" w="full">
                <Table variant="simple">
                  <Thead>
                    <Tr>
                      <Th>Channel</Th>
                      <Th>Impressions</Th>
                      <Th>Clicks</Th>
                      <Th>Conversions</Th>
                      <Th>Revenue</Th>
                      <Th>Cost</Th>
                      <Th>ROI</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {channelPerformance.map((channel) => (
                      <Tr key={channel.name}>
                        <Td>
                          <HStack>
                            <Icon as={getChannelIcon(channel.name)} color="blue.500" />
                            <Text fontWeight="medium">{channel.name}</Text>
                          </HStack>
                        </Td>
                        <Td>{channel.impressions.toLocaleString()}</Td>
                        <Td>{channel.clicks.toLocaleString()}</Td>
                        <Td>{channel.conversions.toLocaleString()}</Td>
                        <Td>${channel.revenue.toLocaleString()}</Td>
                        <Td>${channel.cost.toLocaleString()}</Td>
                        <Td>
                          <Badge
                            colorScheme={channel.roi > 200 ? 'green' : channel.roi > 100 ? 'blue' : 'yellow'}
                          >
                            {channel.roi}%
                          </Badge>
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </Box>
            </VStack>
          </CardBody>
        </Card>

        {/* Segment Performance */}
        <Card bg={cardBg} mb={8}>
          <CardBody>
            <VStack align="start" spacing={6}>
              <HStack justify="space-between" w="full">
                <Heading size="md">Customer Segment Performance</Heading>
                <Button leftIcon={<Icon as={FiDownload} />} variant="ghost">
                  Export
                </Button>
              </HStack>
              <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6} w="full">
                {segmentPerformance.map((segment) => {
                  const engagementPercent = Math.round((segment.engaged / 100) * 100)
                  const conversionPercent = Math.round((segment.converted / 100) * 100)
                  const reachPercent = Math.round((segment.reached / 100) * 100)

                  return (
                    <Card key={segment.name} variant="outline" p={4}>
                      <CardBody>
                        <HStack justify="space-between" mb={4}>
                          <Heading size="sm">{segment.name}</Heading>
                          <Text fontWeight="bold">${segment.revenue.toLocaleString()}</Text>
                        </HStack>

                        <VStack align="start" spacing={3} w="full">
                          <Box w="full">
                            <HStack justify="space-between">
                              <Text fontSize="sm">Reach ({reachPercent}%)</Text>
                              <Text fontSize="sm" fontWeight="medium">{segment.size.toLocaleString()} customers</Text>
                            </HStack>
                            <Progress value={reachPercent} colorScheme={getSegmentColor(reachPercent)} size="sm" mt={1} />
                          </Box>

                          <Box w="full">
                            <HStack justify="space-between">
                              <Text fontSize="sm">Engagement ({engagementPercent}%)</Text>
                              <Text fontSize="sm" fontWeight="medium">{engagementPercent}% rate</Text>
                            </HStack>
                            <Progress value={engagementPercent} colorScheme={getSegmentColor(engagementPercent)} size="sm" mt={1} />
                          </Box>

                          <Box w="full">
                            <HStack justify="space-between">
                              <Text fontSize="sm">Conversion ({conversionPercent}%)</Text>
                              <Text fontSize="sm" fontWeight="medium">{conversionPercent}% rate</Text>
                            </HStack>
                            <Progress value={conversionPercent} colorScheme={getSegmentColor(conversionPercent)} size="sm" mt={1} />
                          </Box>
                        </VStack>
                      </CardBody>
                    </Card>
                  )
                })}
              </SimpleGrid>
            </VStack>
          </CardBody>
        </Card>
      </Box>
    </DashboardLayout>
  )
} 