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
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  FormControl,
  FormLabel,
  FormHelperText,
  Textarea,
  Radio,
  RadioGroup,
  Stack,
  Checkbox,
  CheckboxGroup,
  Divider,
  Stepper,
  Step,
  StepIndicator,
  StepStatus,
  StepIcon,
  StepNumber,
  StepTitle,
  StepDescription,
  StepSeparator,
  useSteps,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  useToast,
} from '@chakra-ui/react';
import {
  FiPlus,
  FiSearch,
  FiFilter,
  FiUsers,
  FiMail,
  FiMessageSquare,
  FiSmartphone,
  FiGlobe,
  FiTarget,
  FiEdit,
  FiCalendar,
  FiDollarSign,
  FiClock,
  FiChevronRight,
  FiSave,
  FiArrowRight,
  FiShare2,
  FiCheck,
  FiPieChart,
  FiBarChart2,
  FiFileText,
  FiImage,
} from 'react-icons/fi';

// Sample segment data
const SEGMENTS = [
  { id: 1, name: 'High-Value Banking', size: 15000 },
  { id: 2, name: 'Digital Natives', size: 45000 },
  { id: 3, name: 'Investment Focus', size: 8000 },
  { id: 4, name: 'New Account Holders', size: 12000 },
];

// Sample templates
const TEMPLATES = [
  { id: 1, name: 'Welcome Series', type: 'Email', description: 'A series of welcome emails for new customers' },
  { id: 2, name: 'Product Promotion', type: 'Multi-channel', description: 'Promote banking products across channels' },
  { id: 3, name: 'Monthly Newsletter', type: 'Email', description: 'Monthly newsletter with updates and offers' },
  { id: 4, name: 'App Engagement', type: 'Mobile', description: 'Increase engagement with mobile app' },
];

const steps = [
  { title: 'Campaign Details', description: 'Basic information' },
  { title: 'Audience Selection', description: 'Define target audience' },
  { title: 'Message Content', description: 'Create your message' },
  { title: 'Schedule & Budget', description: 'Set timing and budget' },
  { title: 'Review & Launch', description: 'Final check and launch' },
];

interface CampaignData {
  name: string;
  description: string;
  objective: string;
  templateId: string;
  channels: string[];
  segmentIds: number[];
  content: {
    subject: string;
    body: string;
    images: any[];
    cta: string;
  };
  schedule: {
    startDate: string;
    endDate: string;
    sendTime: string;
    frequency: string;
  };
  budget: {
    total: number;
    channelAllocation: {
      [key: string]: number;
    };
  };
}

export default function BuildCampaign() {
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const toast = useToast();
  
  const { activeStep, setActiveStep } = useSteps({
    index: 0,
    count: steps.length,
  });

  // Campaign form state
  const [campaignData, setCampaignData] = useState<CampaignData>({
    name: '',
    description: '',
    objective: 'acquisition',
    templateId: '',
    channels: ['email'],
    segmentIds: [],
    content: {
      subject: '',
      body: '',
      images: [],
      cta: '',
    },
    schedule: {
      startDate: '',
      endDate: '',
      sendTime: '09:00',
      frequency: 'once',
    },
    budget: {
      total: 10000,
      channelAllocation: {
        email: 50,
        mobile: 20,
        social: 20,
        web: 10,
      }
    }
  });

  const updateCampaignData = (field: string, value: any) => {
    setCampaignData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const updateNestedField = (parent: keyof CampaignData, field: string, value: any) => {
    setCampaignData(prev => {
      // Create a deep copy of the campaign data
      const newState = JSON.parse(JSON.stringify(prev)) as CampaignData;
      
      // Update the specific field
      if (parent === 'content') {
        newState.content[field as keyof typeof newState.content] = value;
      } else if (parent === 'schedule') {
        newState.schedule[field as keyof typeof newState.schedule] = value;
      } else if (parent === 'budget') {
        if (field === 'channelAllocation') {
          newState.budget.channelAllocation = value;
        } else {
          newState.budget[field as keyof typeof newState.budget] = value;
        }
      }
      
      return newState;
    });
  };

  const handleNextStep = () => {
    if (activeStep < steps.length - 1) {
      setActiveStep(activeStep + 1);
    }
  };

  const handlePrevStep = () => {
    if (activeStep > 0) {
      setActiveStep(activeStep - 1);
    }
  };

  const handleSaveDraft = () => {
    toast({
      title: 'Campaign saved',
      description: 'Your campaign draft has been saved successfully.',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };

  const handleLaunchCampaign = () => {
    toast({
      title: 'Campaign launched!',
      description: 'Your campaign has been scheduled and is ready to go.',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };

  return (
      <Box mb={6}>
        <HStack spacing={4} align="center" mb={6}>
          <Icon as={FiPlus} boxSize={8} color="blue.500" />
          <Box>
            <Heading as="h1" size="xl" color="secondary.700">
              Build Campaign
            </Heading>
            <Text color="gray.600">
              Create a new marketing campaign with our intuitive builder
            </Text>
          </Box>
        </HStack>

        <Card bg={cardBg} mb={8} borderWidth="1px" borderColor={borderColor}>
          <CardBody>
            <Box mb={6}>
              <Stepper index={activeStep} colorScheme="blue">
                {steps.map((step, index) => (
                  <Step key={index} onClick={() => setActiveStep(index)} cursor="pointer">
                    <StepIndicator>
                      <StepStatus 
                        complete={<StepIcon />} 
                        incomplete={<StepNumber />} 
                        active={<StepNumber />} 
                      />
                    </StepIndicator>
                    <Box flexShrink="0">
                      <StepTitle>{step.title}</StepTitle>
                      <StepDescription>{step.description}</StepDescription>
                    </Box>
                    <StepSeparator />
                  </Step>
                ))}
              </Stepper>
            </Box>

            <Box mt={8}>
              {/* Step 1: Campaign Details */}
              {activeStep === 0 && (
                <VStack spacing={6} align="start">
                  <Heading size="md">Campaign Details</Heading>
                  
                  <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6} width="full">
                    <FormControl isRequired>
                      <FormLabel>Campaign Name</FormLabel>
                      <Input 
                        placeholder="Enter campaign name"
                        value={campaignData.name}
                        onChange={(e) => updateCampaignData('name', e.target.value)}
                      />
                    </FormControl>
                    
                    <FormControl>
                      <FormLabel>Campaign Objective</FormLabel>
                      <Select 
                        value={campaignData.objective}
                        onChange={(e) => updateCampaignData('objective', e.target.value)}
                      >
                        <option value="acquisition">Customer Acquisition</option>
                        <option value="retention">Customer Retention</option>
                        <option value="engagement">Engagement</option>
                        <option value="conversion">Conversion</option>
                        <option value="awareness">Brand Awareness</option>
                      </Select>
                    </FormControl>
                  </SimpleGrid>
                  
                  <FormControl>
                    <FormLabel>Campaign Description</FormLabel>
                    <Textarea 
                      placeholder="Describe your campaign"
                      rows={3}
                      value={campaignData.description}
                      onChange={(e) => updateCampaignData('description', e.target.value)}
                    />
                  </FormControl>
                  
                  <FormControl>
                    <FormLabel>Campaign Template</FormLabel>
                    <Select
                      placeholder="Select a template (optional)"
                      value={campaignData.templateId}
                      onChange={(e) => updateCampaignData('templateId', e.target.value)}
                    >
                      {TEMPLATES.map(template => (
                        <option key={template.id} value={template.id.toString()}>
                          {template.name} - {template.type}
                        </option>
                      ))}
                    </Select>
                    <FormHelperText>Templates can speed up your campaign creation</FormHelperText>
                  </FormControl>
                  
                  <FormControl>
                    <FormLabel>Communication Channels</FormLabel>
                    <CheckboxGroup
                      colorScheme="blue"
                      value={campaignData.channels}
                      onChange={(values) => updateCampaignData('channels', values)}
                    >
                      <HStack spacing={6} wrap="wrap">
                        <Checkbox value="email">
                          <HStack>
                            <Icon as={FiMail} color="blue.500" />
                            <Text>Email</Text>
                          </HStack>
                        </Checkbox>
                        <Checkbox value="mobile">
                          <HStack>
                            <Icon as={FiSmartphone} color="blue.500" />
                            <Text>Mobile App</Text>
                          </HStack>
                        </Checkbox>
                        <Checkbox value="sms">
                          <HStack>
                            <Icon as={FiMessageSquare} color="blue.500" />
                            <Text>SMS</Text>
                          </HStack>
                        </Checkbox>
                        <Checkbox value="web">
                          <HStack>
                            <Icon as={FiGlobe} color="blue.500" />
                            <Text>Web</Text>
                          </HStack>
                        </Checkbox>
                        <Checkbox value="social">
                          <HStack>
                            <Icon as={FiShare2} color="blue.500" />
                            <Text>Social Media</Text>
                          </HStack>
                        </Checkbox>
                      </HStack>
                    </CheckboxGroup>
                  </FormControl>
                </VStack>
              )}

              {/* Step 2: Audience Selection */}
              {activeStep === 1 && (
                <VStack spacing={6} align="start">
                  <Heading size="md">Target Audience</Heading>
                  
                  <FormControl>
                    <FormLabel>Select Customer Segments</FormLabel>
                    <CheckboxGroup
                      colorScheme="blue"
                      value={campaignData.segmentIds.map(String)}
                      onChange={(values) => updateCampaignData('segmentIds', values.map(Number))}
                    >
                      <VStack align="start" spacing={3}>
                        {SEGMENTS.map(segment => (
                          <Checkbox key={segment.id} value={String(segment.id)}>
                            <HStack>
                              <Text>{segment.name}</Text>
                              <Badge colorScheme="blue">{segment.size.toLocaleString()} customers</Badge>
                            </HStack>
                          </Checkbox>
                        ))}
                      </VStack>
                    </CheckboxGroup>
                  </FormControl>
                  
                  <Box p={4} bg={useColorModeValue('blue.50', 'blue.900')} borderRadius="md" width="full">
                    <VStack align="start">
                      <HStack>
                        <Icon as={FiUsers} color="blue.500" />
                        <Text fontWeight="bold">Selected Audience</Text>
                      </HStack>
                      <Divider />
                      <HStack>
                        <Text>Total Audience Size:</Text>
                        <Text fontWeight="bold">
                          {campaignData.segmentIds.length === 0 
                            ? 'No segments selected'
                            : `${SEGMENTS
                                .filter(seg => campaignData.segmentIds.includes(seg.id))
                                .reduce((sum, seg) => sum + seg.size, 0)
                                .toLocaleString()} customers`
                          }
                        </Text>
                      </HStack>
                    </VStack>
                  </Box>
                </VStack>
              )}

              {/* Step 3: Message Content */}
              {activeStep === 2 && (
                <VStack spacing={6} align="start">
                  <Heading size="md">Message Content</Heading>
                  
                  <Tabs variant="soft-rounded" colorScheme="blue" width="full">
                    <TabList>
                      {campaignData.channels.map(channel => (
                        <Tab key={channel}>
                          <HStack>
                            <Icon 
                              as={
                                channel === 'email' ? FiMail :
                                channel === 'mobile' ? FiSmartphone :
                                channel === 'sms' ? FiMessageSquare :
                                channel === 'web' ? FiGlobe :
                                FiShare2
                              } 
                            />
                            <Text>{channel.charAt(0).toUpperCase() + channel.slice(1)}</Text>
                          </HStack>
                        </Tab>
                      ))}
                    </TabList>
                    
                    <TabPanels>
                      {campaignData.channels.map(channel => (
                        <TabPanel key={channel}>
                          {channel === 'email' && (
                            <VStack spacing={4} align="start" width="full">
                              <FormControl isRequired>
                                <FormLabel>Subject Line</FormLabel>
                                <Input 
                                  placeholder="Enter email subject"
                                  value={campaignData.content.subject}
                                  onChange={(e) => updateNestedField('content', 'subject', e.target.value)}
                                />
                              </FormControl>
                              
                              <FormControl isRequired>
                                <FormLabel>Email Body</FormLabel>
                                <Textarea 
                                  placeholder="Compose your email content..."
                                  rows={10}
                                  value={campaignData.content.body}
                                  onChange={(e) => updateNestedField('content', 'body', e.target.value)}
                                />
                              </FormControl>
                              
                              <FormControl>
                                <FormLabel>Call to Action</FormLabel>
                                <Input 
                                  placeholder="e.g. Sign Up Now"
                                  value={campaignData.content.cta}
                                  onChange={(e) => updateNestedField('content', 'cta', e.target.value)}
                                />
                              </FormControl>
                            </VStack>
                          )}
                          
                          {channel === 'sms' && (
                            <VStack spacing={4} align="start" width="full">
                              <FormControl isRequired>
                                <FormLabel>SMS Content</FormLabel>
                                <Textarea 
                                  placeholder="Type your SMS message (160 character limit)"
                                  rows={4}
                                  maxLength={160}
                                  value={campaignData.content.body}
                                  onChange={(e) => updateNestedField('content', 'body', e.target.value)}
                                />
                                <FormHelperText>
                                  Characters: {campaignData.content.body.length}/160
                                </FormHelperText>
                              </FormControl>
                            </VStack>
                          )}
                          
                          {(channel === 'mobile' || channel === 'web' || channel === 'social') && (
                            <Text>Content builder for {channel} coming soon...</Text>
                          )}
                        </TabPanel>
                      ))}
                    </TabPanels>
                  </Tabs>
                </VStack>
              )}

              {/* Step 4: Schedule & Budget */}
              {activeStep === 3 && (
                <VStack spacing={6} align="start">
                  <Heading size="md">Schedule & Budget</Heading>
                  
                  <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6} width="full">
                    <FormControl isRequired>
                      <FormLabel>Start Date</FormLabel>
                      <Input 
                        type="date"
                        value={campaignData.schedule.startDate}
                        onChange={(e) => updateNestedField('schedule', 'startDate', e.target.value)}
                      />
                    </FormControl>
                    
                    <FormControl>
                      <FormLabel>End Date</FormLabel>
                      <Input 
                        type="date"
                        value={campaignData.schedule.endDate}
                        onChange={(e) => updateNestedField('schedule', 'endDate', e.target.value)}
                      />
                      <FormHelperText>Leave blank for one-time campaigns</FormHelperText>
                    </FormControl>
                  </SimpleGrid>
                  
                  <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6} width="full">
                    <FormControl>
                      <FormLabel>Send Time</FormLabel>
                      <Input 
                        type="time"
                        value={campaignData.schedule.sendTime}
                        onChange={(e) => updateNestedField('schedule', 'sendTime', e.target.value)}
                      />
                    </FormControl>
                    
                    <FormControl>
                      <FormLabel>Frequency</FormLabel>
                      <Select 
                        value={campaignData.schedule.frequency}
                        onChange={(e) => updateNestedField('schedule', 'frequency', e.target.value)}
                      >
                        <option value="once">One time</option>
                        <option value="daily">Daily</option>
                        <option value="weekly">Weekly</option>
                        <option value="monthly">Monthly</option>
                      </Select>
                    </FormControl>
                  </SimpleGrid>
                  
                  <Divider my={2} />
                  
                  <FormControl>
                    <FormLabel>Total Budget</FormLabel>
                    <HStack spacing={4} width="full">
                      <NumberInput 
                        value={campaignData.budget.total} 
                        onChange={(valueString) => updateNestedField('budget', 'total', Number(valueString))}
                        min={100}
                        step={500}
                        width="200px"
                      >
                        <NumberInputField />
                        <NumberInputStepper>
                          <NumberIncrementStepper />
                          <NumberDecrementStepper />
                        </NumberInputStepper>
                      </NumberInput>
                      <Text fontWeight="medium">${campaignData.budget.total.toLocaleString()}</Text>
                    </HStack>
                  </FormControl>
                  
                  {campaignData.channels.length > 1 && (
                    <FormControl>
                      <FormLabel>Budget Allocation</FormLabel>
                      <VStack spacing={4} width="full">
                        {campaignData.channels.map(channel => (
                          <HStack key={channel} width="full">
                            <Text width="120px">{channel.charAt(0).toUpperCase() + channel.slice(1)}</Text>
                            <Slider 
                              flex="1"
                              colorScheme="blue" 
                              value={campaignData.budget.channelAllocation[channel] || 0}
                              onChange={(v) => {
                                const updatedAllocation = {...campaignData.budget.channelAllocation};
                                updatedAllocation[channel] = v;
                                updateNestedField('budget', 'channelAllocation', updatedAllocation);
                              }}
                            >
                              <SliderTrack>
                                <SliderFilledTrack />
                              </SliderTrack>
                              <SliderThumb />
                            </Slider>
                            <Text width="80px">{campaignData.budget.channelAllocation[channel] || 0}%</Text>
                            <Text width="100px">
                              ${Math.round(campaignData.budget.total * (campaignData.budget.channelAllocation[channel] || 0) / 100).toLocaleString()}
                            </Text>
                          </HStack>
                        ))}
                      </VStack>
                    </FormControl>
                  )}
                </VStack>
              )}

              {/* Step 5: Review & Launch */}
              {activeStep === 4 && (
                <VStack spacing={6} align="start">
                  <Heading size="md">Review Your Campaign</Heading>
                  
                  <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                    <Card bg={useColorModeValue('gray.50', 'gray.700')}>
                      <CardBody>
                        <VStack align="start" spacing={3}>
                          <Heading size="sm">Campaign Details</Heading>
                          <HStack>
                            <Text fontWeight="medium">Name:</Text>
                            <Text>{campaignData.name || '(Not specified)'}</Text>
                          </HStack>
                          <HStack>
                            <Text fontWeight="medium">Objective:</Text>
                            <Text>{campaignData.objective}</Text>
                          </HStack>
                          <HStack>
                            <Text fontWeight="medium">Channels:</Text>
                            <HStack>
                              {campaignData.channels.map(channel => (
                                <Badge key={channel} colorScheme="blue">{channel}</Badge>
                              ))}
                            </HStack>
                          </HStack>
                        </VStack>
                      </CardBody>
                    </Card>
                    
                    <Card bg={useColorModeValue('gray.50', 'gray.700')}>
                      <CardBody>
                        <VStack align="start" spacing={3}>
                          <Heading size="sm">Audience</Heading>
                          <HStack>
                            <Text fontWeight="medium">Segments:</Text>
                            <HStack>
                              {campaignData.segmentIds.length === 0 ? (
                                <Badge colorScheme="red">No segments selected</Badge>
                              ) : (
                                SEGMENTS
                                  .filter(seg => campaignData.segmentIds.includes(seg.id))
                                  .map(seg => (
                                    <Badge key={seg.id} colorScheme="green">{seg.name}</Badge>
                                  ))
                              )}
                            </HStack>
                          </HStack>
                          <HStack>
                            <Text fontWeight="medium">Audience Size:</Text>
                            <Text>
                              {campaignData.segmentIds.length === 0 
                                ? 'No segments selected'
                                : `${SEGMENTS
                                    .filter(seg => campaignData.segmentIds.includes(seg.id))
                                    .reduce((sum, seg) => sum + seg.size, 0)
                                    .toLocaleString()} customers`
                              }
                            </Text>
                          </HStack>
                        </VStack>
                      </CardBody>
                    </Card>
                    
                    <Card bg={useColorModeValue('gray.50', 'gray.700')}>
                      <CardBody>
                        <VStack align="start" spacing={3}>
                          <Heading size="sm">Schedule</Heading>
                          <HStack>
                            <Text fontWeight="medium">Start Date:</Text>
                            <Text>{campaignData.schedule.startDate || 'Not specified'}</Text>
                          </HStack>
                          <HStack>
                            <Text fontWeight="medium">End Date:</Text>
                            <Text>{campaignData.schedule.endDate || 'One-time campaign'}</Text>
                          </HStack>
                          <HStack>
                            <Text fontWeight="medium">Send Time:</Text>
                            <Text>{campaignData.schedule.sendTime}</Text>
                          </HStack>
                          <HStack>
                            <Text fontWeight="medium">Frequency:</Text>
                            <Text>{campaignData.schedule.frequency}</Text>
                          </HStack>
                        </VStack>
                      </CardBody>
                    </Card>
                    
                    <Card bg={useColorModeValue('gray.50', 'gray.700')}>
                      <CardBody>
                        <VStack align="start" spacing={3}>
                          <Heading size="sm">Budget</Heading>
                          <HStack>
                            <Text fontWeight="medium">Total Budget:</Text>
                            <Text>${campaignData.budget.total.toLocaleString()}</Text>
                          </HStack>
                          {campaignData.channels.length > 1 && (
                            <VStack align="start" spacing={1} width="full">
                              <Text fontWeight="medium">Channel Allocation:</Text>
                              {campaignData.channels.map(channel => (
                                <HStack key={channel} width="full" justify="space-between">
                                  <Text>{channel}</Text>
                                  <Text>${Math.round(campaignData.budget.total * (campaignData.budget.channelAllocation[channel] || 0) / 100).toLocaleString()}</Text>
                                </HStack>
                              ))}
                            </VStack>
                          )}
                        </VStack>
                      </CardBody>
                    </Card>
                  </SimpleGrid>
                  
                  <Box
                    bg="green.50"
                    p={4}
                    borderRadius="md"
                    borderLeftWidth="4px"
                    borderLeftColor="green.500"
                    width="full"
                  >
                    <HStack>
                      <Icon as={FiCheck} color="green.500" />
                      <Text fontWeight="medium">Your campaign is ready to launch!</Text>
                    </HStack>
                  </Box>
                  
                  <HStack spacing={4}>
                    <Button colorScheme="blue" leftIcon={<Icon as={FiSave} />} onClick={handleSaveDraft}>
                      Save as Draft
                    </Button>
                    <Button colorScheme="green" leftIcon={<Icon as={FiCheck} />} onClick={handleLaunchCampaign}>
                      Launch Campaign
                    </Button>
                  </HStack>
                </VStack>
              )}
              
              {/* Navigation buttons */}
              <Flex justify="space-between" mt={10}>
                <Button
                  onClick={handlePrevStep}
                  isDisabled={activeStep === 0}
                  variant="outline"
                >
                  Previous
                </Button>
                {activeStep < steps.length - 1 ? (
                  <Button
                    rightIcon={<Icon as={FiArrowRight} />}
                    onClick={handleNextStep}
                    colorScheme="blue"
                  >
                    Next
                  </Button>
                ) : null}
              </Flex>
            </Box>
          </CardBody>
        </Card>
      </Box>
  );
}