'use client';

import React from 'react';
import {
  Card,
  CardBody,
  Flex,
  Heading,
  HStack,
  IconButton,
  Spinner,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Grid,
  GridItem,
  Box,
  Text,
} from '@chakra-ui/react';
import { FiRefreshCw, FiMaximize2, FiMinimize2, FiFilter } from 'react-icons/fi';

export default function MarketingAnalyticsEmbed() {
  const [isFullscreen, setIsFullscreen] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 1500);
  };

  return (
    <Card height={isFullscreen ? '90vh' : '100%'}>
      <CardBody>
        <Flex direction="column" h="100%">
          <Flex justify="space-between" align="center" mb={4}>
            <Heading size="md">Financial Marketing Analytics</Heading>
            <HStack spacing={2}>
              <IconButton
                aria-label="Refresh data"
                icon={<FiRefreshCw />}
                size="sm"
                onClick={handleRefresh}
                isLoading={isLoading}
              />
              <IconButton
                aria-label="Toggle fullscreen"
                icon={isFullscreen ? <FiMinimize2 /> : <FiMaximize2 />}
                size="sm"
                onClick={() => setIsFullscreen(!isFullscreen)}
              />
              <Menu>
                <MenuButton as={IconButton} aria-label="Filter options" icon={<FiFilter />} size="sm" />
                <MenuList>
                  <MenuItem>Last 7 days</MenuItem>
                  <MenuItem>Last 30 days</MenuItem>
                  <MenuItem>Last quarter</MenuItem>
                  <MenuItem>Custom range...</MenuItem>
                </MenuList>
              </Menu>
            </HStack>
          </Flex>

          <Tabs variant="soft-rounded" colorScheme="blue" mb={4}>
            <TabList>
              <Tab>Financial Product Performance</Tab>
              <Tab>Client Segment Insights</Tab>
              <Tab>Wealth Management Funnel</Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                {isLoading ? (
                  <Flex justify="center" align="center" h="300px">
                    <Spinner size="xl" color="blue.500" />
                  </Flex>
                ) : (
                  <Grid templateColumns="repeat(2, 1fr)" gap={4}>
                    <GridItem colSpan={2}>
                      <Box bg="gray.50" p={4} borderRadius="lg" height="200px">
                        <Text>Financial Product Growth & Adoption</Text>
                      </Box>
                    </GridItem>
                    <GridItem>
                      <Box bg="gray.50" p={4} borderRadius="lg" height="150px">
                        <Text>Channel Engagement by Asset Class</Text>
                      </Box>
                    </GridItem>
                    <GridItem>
                      <Box bg="gray.50" p={4} borderRadius="lg" height="150px">
                        <Text>Client Acquisition Cost Analysis</Text>
                      </Box>
                    </GridItem>
                  </Grid>
                )}
              </TabPanel>
              <TabPanel>
                <Box bg="gray.50" p={4} borderRadius="lg" height="350px">
                  <Text>Wealth Tier Client Segmentation</Text>
                </Box>
              </TabPanel>
              <TabPanel>
                <Box bg="gray.50" p={4} borderRadius="lg" height="350px">
                  <Text>Wealth Management Client Journey</Text>
                </Box>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Flex>
      </CardBody>
    </Card>
  );
} 