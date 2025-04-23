'use client';

import { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  FormControl,
  FormLabel,
  FormHelperText,
  Heading,
  Input,
  Select,
  Textarea,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  SimpleGrid,
  Stack,
  HStack,
  VStack,
  Text,
  Divider,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Checkbox,
  Radio,
  RadioGroup,
  Tag,
  TagLabel,
  TagCloseButton,
  InputGroup,
  InputRightElement,
  Switch,
  useToast,
  useColorModeValue,
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { FiPlus, FiTarget, FiCalendar, FiUsers, FiMail, FiMessageSquare, FiSmartphone, FiGlobe } from 'react-icons/fi';
import DashboardLayout from '@/components/layout/DashboardLayout';

// Campaign types
const campaignTypes = [
  { value: 'awareness', label: 'Brand Awareness' },
  { value: 'acquisition', label: 'Customer Acquisition' },
  { value: 'retention', label: 'Customer Retention' },
  { value: 'crossSell', label: 'Cross-Sell / Up-Sell' },
  { value: 'winback', label: 'Win-Back' },
  { value: 'loyalty', label: 'Loyalty Program' },
];

// Customer segments
const customerSegments = [
  { value: 'highNetWorth', label: 'High Net Worth' },
  { value: 'youngProfessionals', label: 'Young Professionals' },
  { value: 'families', label: 'Families' },
  { value: 'students', label: 'Students' },
  { value: 'retirees', label: 'Retirees' },
  { value: 'smallBusiness', label: 'Small Business' },
  { value: 'newCustomers', label: 'New Customers (< 3 months)' },
  { value: 'existingCustomers', label: 'Existing Customers (> 3 months)' },
];

// Channels
const channels = [
  { value: 'email', label: 'Email', icon: FiMail },
  { value: 'sms', label: 'SMS', icon: FiMessageSquare },
  { value: 'push', label: 'Push Notification', icon: FiSmartphone },
  { value: 'social', label: 'Social Media', icon: FiGlobe },
  { value: 'display', label: 'Display Ads', icon: FiTarget },
  { value: 'direct', label: 'Direct Mail', icon: FiMail },
];

// Products
const products = [
  { value: 'checkingAccount', label: 'Checking Account' },
  { value: 'savingsAccount', label: 'Savings Account' },
  { value: 'creditCard', label: 'Credit Card' },
  { value: 'personalLoan', label: 'Personal Loan' },
  { value: 'mortgage', label: 'Mortgage' },
  { value: 'investment', label: 'Investment Products' },
  { value: 'insurance', label: 'Insurance' },
  { value: 'mobileBanking', label: 'Mobile Banking' },
];

export default function BuildCampaignsPage() {
  const [activeTab, setActiveTab] = useState(0);
  const [selectedSegments, setSelectedSegments] = useState([]);
  const [selectedChannels, setSelectedChannels] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState([]);
  const { register, handleSubmit, formState: { errors }, reset, watch } = useForm();
  const toast = useToast();
  
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const hoverBgColor = useColorModeValue('gray.50', 'gray.700');
  
  const handleAddTag = () => {
    if (tagInput && !tags.includes(tagInput)) {
      setTags([...tags, tagInput]);
      setTagInput('');
    }
  };
  
  const handleRemoveTag = (tag) => {
    setTags(tags.filter((t) => t !== tag));
  };
  
  const handleSegmentToggle = (segmentValue) => {
    if (selectedSegments.includes(segmentValue)) {
      setSelectedSegments(selectedSegments.filter(v => v !== segmentValue));
    } else {
      setSelectedSegments([...selectedSegments, segmentValue]);
    }
  };
  
  const handleChannelToggle = (channelValue) => {
    if (selectedChannels.includes(channelValue)) {
      setSelectedChannels(selectedChannels.filter(v => v !== channelValue));
    } else {
      setSelectedChannels([...selectedChannels, channelValue]);
    }
  };
  
  const handleProductToggle = (productValue) => {
    if (selectedProducts.includes(productValue)) {
      setSelectedProducts(selectedProducts.filter(v => v !== productValue));
    } else {
      setSelectedProducts([...selectedProducts, productValue]);
    }
  };
  
  const nextStep = () => {
    setActiveTab(activeTab + 1);
  };
  
  const prevStep = () => {
    setActiveTab(activeTab - 1);
  };
  
  const onSubmit = (data) => {
    // Combining all the form data
    const campaignData = {
      ...data,
      segments: selectedSegments,
      channels: selectedChannels,
      products: selectedProducts,
      tags: tags,
    };
    
    console.log('Campaign Data:', campaignData);
    
    // Display success toast
    toast({
      title: 'Campaign created successfully',
      description: `The campaign "${data.name}" has been created.`,
      status: 'success',
      duration: 5000,
      isClosable: true,
    });
    
    // Reset form
    reset();
    setSelectedSegments([]);
    setSelectedChannels([]);
    setSelectedProducts([]);
    setTags([]);
    setActiveTab(0);
  };
  
  return (
    <DashboardLayout>
      <Box px={6} py={4} maxW="1400px" mx="auto">
        <Heading size="lg" mb={6}>Create New Campaign</Heading>
        
        <form onSubmit={handleSubmit(onSubmit)}>
          <Tabs index={activeTab} onChange={setActiveTab} colorScheme="blue" mb={6}>
            <TabList>
              <Tab>Basic Info</Tab>
              <Tab>Audience</Tab>
              <Tab>Content</Tab>
              <Tab>Budget & Schedule</Tab>
              <Tab>Review</Tab>
            </TabList>
            
            <TabPanels>
              {/* Basic Info */}
              <TabPanel px={0}>
                <Card boxShadow="sm" borderColor={borderColor}>
                  <CardBody>
                    <VStack spacing={6} align="start">
                      <Heading size="md">Campaign Details</Heading>
                      
                      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6} width="full">
                        <FormControl isRequired>
                          <FormLabel>Campaign Name</FormLabel>
                          <Input 
                            placeholder="Enter campaign name" 
                            {...register('name', { required: true })}
                          />
                          <FormHelperText>Give your campaign a clear, descriptive name</FormHelperText>
                        </FormControl>
                        
                        <FormControl isRequired>
                          <FormLabel>Campaign Type</FormLabel>
                          <Select 
                            placeholder="Select campaign type"
                            {...register('type', { required: true })}
                          >
                            {campaignTypes.map(type => (
                              <option key={type.value} value={type.value}>{type.label}</option>
                            ))}
                          </Select>
                        </FormControl>
                      </SimpleGrid>
                      
                      <FormControl>
                        <FormLabel>Description</FormLabel>
                        <Textarea 
                          placeholder="Enter campaign description"
                          rows={4}
                          {...register('description')}
                        />
                      </FormControl>
                      
                      <FormControl>
                        <FormLabel>Tags</FormLabel>
                        <InputGroup>
                          <Input
                            value={tagInput}
                            onChange={(e) => setTagInput(e.target.value)}
                            placeholder="Add tags and press Enter"
                            onKeyPress={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                handleAddTag();
                              }
                            }}
                          />
                          <InputRightElement width="4.5rem">
                            <Button h="1.75rem" size="sm" onClick={handleAddTag}>
                              Add
                            </Button>
                          </InputRightElement>
                        </InputGroup>
                        
                        <Box mt={2}>
                          {tags.map((tag, index) => (
                            <Tag key={index} size="md" colorScheme="blue" m={1}>
                              <TagLabel>{tag}</TagLabel>
                              <TagCloseButton onClick={() => handleRemoveTag(tag)} />
                            </Tag>
                          ))}
                        </Box>
                      </FormControl>
                      
                      <FormControl>
                        <FormLabel>Products</FormLabel>
                        <Text fontSize="sm" mb={2}>Select products featured in this campaign</Text>
                        <SimpleGrid columns={{ base: 1, sm: 2, md: 3 }} spacing={2}>
                          {products.map(product => (
                            <Checkbox
                              key={product.value}
                              isChecked={selectedProducts.includes(product.value)}
                              onChange={() => handleProductToggle(product.value)}
                              colorScheme="blue"
                            >
                              {product.label}
                            </Checkbox>
                          ))}
                        </SimpleGrid>
                      </FormControl>
                    </VStack>
                  </CardBody>
                </Card>
                
                <Box display="flex" justifyContent="flex-end" mt={4}>
                  <Button colorScheme="blue" onClick={nextStep}>
                    Next: Define Audience
                  </Button>
                </Box>
              </TabPanel>
              
              {/* Audience */}
              <TabPanel px={0}>
                <Card boxShadow="sm" borderColor={borderColor}>
                  <CardBody>
                    <VStack spacing={6} align="start">
                      <Heading size="md">Target Audience</Heading>
                      
                      <FormControl isRequired>
                        <FormLabel>Customer Segments</FormLabel>
                        <Text fontSize="sm" mb={2}>Select the customer segments for this campaign</Text>
                        <SimpleGrid columns={{ base: 1, sm: 2 }} spacing={4}>
                          {customerSegments.map(segment => (
                            <HStack 
                              key={segment.value}
                              p={2}
                              borderRadius="md"
                              cursor="pointer"
                              borderWidth="1px"
                              borderColor={selectedSegments.includes(segment.value) ? 'blue.500' : borderColor}
                              bg={selectedSegments.includes(segment.value) ? useColorModeValue('blue.50', 'blue.900') : bgColor}
                              _hover={{ bg: hoverBgColor }}
                              onClick={() => handleSegmentToggle(segment.value)}
                            >
                              <Checkbox 
                                isChecked={selectedSegments.includes(segment.value)}
                                onChange={() => {}}
                                colorScheme="blue"
                              />
                              <Text>{segment.label}</Text>
                            </HStack>
                          ))}
                        </SimpleGrid>
                      </FormControl>
                      
                      <Divider />
                      
                      <FormControl>
                        <FormLabel>Advanced Segmentation</FormLabel>
                        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4} width="full">
                          <FormControl>
                            <FormLabel fontSize="sm">Age Range</FormLabel>
                            <HStack>
                              <NumberInput min={18} max={100} defaultValue={18} maxW="100px">
                                <NumberInputField {...register('ageMin')} />
                                <NumberInputStepper>
                                  <NumberIncrementStepper />
                                  <NumberDecrementStepper />
                                </NumberInputStepper>
                              </NumberInput>
                              <Text>to</Text>
                              <NumberInput min={18} max={100} defaultValue={65} maxW="100px">
                                <NumberInputField {...register('ageMax')} />
                                <NumberInputStepper>
                                  <NumberIncrementStepper />
                                  <NumberDecrementStepper />
                                </NumberInputStepper>
                              </NumberInput>
                            </HStack>
                          </FormControl>
                          
                          <FormControl>
                            <FormLabel fontSize="sm">Income Range</FormLabel>
                            <Select {...register('incomeRange')}>
                              <option value="">Any income level</option>
                              <option value="below50k">Below $50,000</option>
                              <option value="50kTo100k">$50,000 - $100,000</option>
                              <option value="100kTo150k">$100,000 - $150,000</option>
                              <option value="150kTo250k">$150,000 - $250,000</option>
                              <option value="250kPlus">$250,000+</option>
                            </Select>
                          </FormControl>
                          
                          <FormControl>
                            <FormLabel fontSize="sm">Customer Tenure</FormLabel>
                            <Select {...register('customerTenure')}>
                              <option value="">Any tenure</option>
                              <option value="lessThan1Year">Less than 1 year</option>
                              <option value="1To3Years">1-3 years</option>
                              <option value="3To5Years">3-5 years</option>
                              <option value="5YearsPlus">5+ years</option>
                            </Select>
                          </FormControl>
                        </SimpleGrid>
                      </FormControl>
                      
                      <Divider />
                      
                      <FormControl>
                        <FormLabel>Exclusions</FormLabel>
                        <Checkbox colorScheme="red" {...register('excludeRecentContact')}>
                          Exclude customers contacted in the last 7 days
                        </Checkbox>
                      </FormControl>
                    </VStack>
                  </CardBody>
                </Card>
                
                <Box display="flex" justifyContent="space-between" mt={4}>
                  <Button onClick={prevStep}>
                    Previous: Basic Info
                  </Button>
                  <Button colorScheme="blue" onClick={nextStep}>
                    Next: Content
                  </Button>
                </Box>
              </TabPanel>
              
              {/* Content */}
              <TabPanel px={0}>
                <Card boxShadow="sm" borderColor={borderColor}>
                  <CardBody>
                    <VStack spacing={6} align="start">
                      <Heading size="md">Campaign Content</Heading>
                      
                      <FormControl isRequired>
                        <FormLabel>Communication Channels</FormLabel>
                        <Text fontSize="sm" mb={2}>Select the channels for this campaign</Text>
                        <SimpleGrid columns={{ base: 1, sm: 2, md: 3 }} spacing={4}>
                          {channels.map(channel => (
                            <HStack 
                              key={channel.value}
                              p={2}
                              borderRadius="md"
                              cursor="pointer"
                              borderWidth="1px"
                              borderColor={selectedChannels.includes(channel.value) ? 'blue.500' : borderColor}
                              bg={selectedChannels.includes(channel.value) ? useColorModeValue('blue.50', 'blue.900') : bgColor}
                              _hover={{ bg: hoverBgColor }}
                              onClick={() => handleChannelToggle(channel.value)}
                            >
                              <Checkbox 
                                isChecked={selectedChannels.includes(channel.value)}
                                onChange={() => {}}
                                colorScheme="blue"
                              />
                              <channel.icon />
                              <Text ml={2}>{channel.label}</Text>
                            </HStack>
                          ))}
                        </SimpleGrid>
                      </FormControl>
                      
                      <Divider />
                      
                      <FormControl>
                        <FormLabel>Primary Message</FormLabel>
                        <Textarea 
                          placeholder="Enter the primary marketing message"
                          rows={4}
                          {...register('primaryMessage')}
                        />
                        <FormHelperText>This will be the main message across all channels (can be customized per channel)</FormHelperText>
                      </FormControl>
                      
                      <FormControl>
                        <FormLabel>Call to Action</FormLabel>
                        <Input 
                          placeholder="Enter call to action text (e.g., 'Apply Now', 'Learn More')"
                          {...register('callToAction')}
                        />
                      </FormControl>
                      
                      <FormControl>
                        <FormLabel>Landing Page URL</FormLabel>
                        <Input 
                          placeholder="Enter landing page URL"
                          {...register('landingPageUrl')}
                        />
                      </FormControl>
                      
                      <FormControl>
                        <FormLabel>Personalization</FormLabel>
                        <HStack>
                          <Switch colorScheme="blue" {...register('usePersonalization')} />
                          <Text>Use personalized content for each segment</Text>
                        </HStack>
                        <FormHelperText>This will allow you to customize content for each customer segment</FormHelperText>
                      </FormControl>
                    </VStack>
                  </CardBody>
                </Card>
                
                <Box display="flex" justifyContent="space-between" mt={4}>
                  <Button onClick={prevStep}>
                    Previous: Audience
                  </Button>
                  <Button colorScheme="blue" onClick={nextStep}>
                    Next: Budget & Schedule
                  </Button>
                </Box>
              </TabPanel>
              
              {/* Budget & Schedule */}
              <TabPanel px={0}>
                <Card boxShadow="sm" borderColor={borderColor}>
                  <CardBody>
                    <VStack spacing={6} align="start">
                      <Heading size="md">Budget & Schedule</Heading>
                      
                      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6} width="full">
                        <FormControl isRequired>
                          <FormLabel>Budget</FormLabel>
                          <InputGroup>
                            <InputRightElement pointerEvents='none'>
                              <Box color='gray.500'>USD</Box>
                            </InputRightElement>
                            <NumberInput min={0} width="full">
                              <NumberInputField
                                pl={4}
                                placeholder="Enter campaign budget"
                                {...register('budget', { required: true })}
                              />
                            </NumberInput>
                          </InputGroup>
                        </FormControl>
                        
                        <FormControl>
                          <FormLabel>Expected Reach</FormLabel>
                          <NumberInput min={0}>
                            <NumberInputField
                              placeholder="Expected number of customers to reach"
                              {...register('expectedReach')}
                            />
                            <NumberInputStepper>
                              <NumberIncrementStepper />
                              <NumberDecrementStepper />
                            </NumberInputStepper>
                          </NumberInput>
                        </FormControl>
                      </SimpleGrid>
                      
                      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6} width="full">
                        <FormControl isRequired>
                          <FormLabel>Start Date</FormLabel>
                          <Input
                            type="date"
                            {...register('startDate', { required: true })}
                          />
                        </FormControl>
                        
                        <FormControl>
                          <FormLabel>End Date</FormLabel>
                          <Input
                            type="date"
                            {...register('endDate')}
                          />
                          <FormHelperText>Leave blank for ongoing campaigns</FormHelperText>
                        </FormControl>
                      </SimpleGrid>
                      
                      <Divider />
                      
                      <FormControl>
                        <FormLabel>Send Schedule</FormLabel>
                        <RadioGroup defaultValue="immediate">
                          <Stack direction="column" spacing={3}>
                            <Radio value="immediate" colorScheme="blue" {...register('sendSchedule')}>
                              Send immediately once approved
                            </Radio>
                            <Radio value="scheduled" colorScheme="blue" {...register('sendSchedule')}>
                              Schedule for specific date/time
                            </Radio>
                            <Radio value="recurring" colorScheme="blue" {...register('sendSchedule')}>
                              Recurring campaign (multiple sends)
                            </Radio>
                          </Stack>
                        </RadioGroup>
                      </FormControl>
                      
                      <FormControl>
                        <FormLabel>Campaign Priority</FormLabel>
                        <Select {...register('priority')}>
                          <option value="high">High</option>
                          <option value="medium">Medium</option>
                          <option value="low">Low</option>
                        </Select>
                        <FormHelperText>Used to resolve conflicts with other campaigns</FormHelperText>
                      </FormControl>
                    </VStack>
                  </CardBody>
                </Card>
                
                <Box display="flex" justifyContent="space-between" mt={4}>
                  <Button onClick={prevStep}>
                    Previous: Content
                  </Button>
                  <Button colorScheme="blue" onClick={nextStep}>
                    Review Campaign
                  </Button>
                </Box>
              </TabPanel>
              
              {/* Review */}
              <TabPanel px={0}>
                <Card boxShadow="sm" borderColor={borderColor}>
                  <CardHeader>
                    <Heading size="md">Review Campaign</Heading>
                    <Text mt={2} color="gray.500">Please review your campaign details before submission</Text>
                  </CardHeader>
                  <CardBody>
                    <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                      <Box>
                        <Heading size="sm" mb={3}>Basic Information</Heading>
                        <VStack align="start" spacing={2}>
                          <HStack>
                            <Text fontWeight="bold" width="150px">Campaign Name:</Text>
                            <Text>{watch('name')}</Text>
                          </HStack>
                          <HStack>
                            <Text fontWeight="bold" width="150px">Campaign Type:</Text>
                            <Text>{campaignTypes.find(t => t.value === watch('type'))?.label}</Text>
                          </HStack>
                          <HStack alignItems="flex-start">
                            <Text fontWeight="bold" width="150px">Description:</Text>
                            <Text>{watch('description') || 'Not provided'}</Text>
                          </HStack>
                          <HStack alignItems="flex-start">
                            <Text fontWeight="bold" width="150px">Tags:</Text>
                            <Box>
                              {tags.length > 0 ? tags.map((tag, i) => (
                                <Tag key={i} size="sm" colorScheme="blue" m={1}>{tag}</Tag>
                              )) : <Text>No tags</Text>}
                            </Box>
                          </HStack>
                        </VStack>
                        
                        <Heading size="sm" mt={6} mb={3}>Target Audience</Heading>
                        <VStack align="start" spacing={2}>
                          <HStack alignItems="flex-start">
                            <Text fontWeight="bold" width="150px">Segments:</Text>
                            <Box>
                              {selectedSegments.length > 0 ? selectedSegments.map((segment, i) => (
                                <Tag key={i} size="sm" colorScheme="green" m={1}>
                                  {customerSegments.find(s => s.value === segment)?.label}
                                </Tag>
                              )) : <Text>No segments selected</Text>}
                            </Box>
                          </HStack>
                        </VStack>
                      </Box>
                      
                      <Box>
                        <Heading size="sm" mb={3}>Content & Channels</Heading>
                        <VStack align="start" spacing={2}>
                          <HStack alignItems="flex-start">
                            <Text fontWeight="bold" width="150px">Channels:</Text>
                            <Box>
                              {selectedChannels.length > 0 ? selectedChannels.map((channel, i) => (
                                <Tag key={i} size="sm" colorScheme="purple" m={1}>
                                  {channels.find(c => c.value === channel)?.label}
                                </Tag>
                              )) : <Text>No channels selected</Text>}
                            </Box>
                          </HStack>
                          <HStack alignItems="flex-start">
                            <Text fontWeight="bold" width="150px">Products:</Text>
                            <Box>
                              {selectedProducts.length > 0 ? selectedProducts.map((product, i) => (
                                <Tag key={i} size="sm" colorScheme="orange" m={1}>
                                  {products.find(p => p.value === product)?.label}
                                </Tag>
                              )) : <Text>No products selected</Text>}
                            </Box>
                          </HStack>
                        </VStack>
                        
                        <Heading size="sm" mt={6} mb={3}>Budget & Schedule</Heading>
                        <VStack align="start" spacing={2}>
                          <HStack>
                            <Text fontWeight="bold" width="150px">Budget:</Text>
                            <Text>${watch('budget') || '0'}</Text>
                          </HStack>
                          <HStack>
                            <Text fontWeight="bold" width="150px">Start Date:</Text>
                            <Text>{watch('startDate') || 'Not set'}</Text>
                          </HStack>
                          <HStack>
                            <Text fontWeight="bold" width="150px">End Date:</Text>
                            <Text>{watch('endDate') || 'Ongoing'}</Text>
                          </HStack>
                        </VStack>
                      </Box>
                    </SimpleGrid>
                  </CardBody>
                </Card>
                
                <Box display="flex" justifyContent="space-between" mt={4}>
                  <Button onClick={prevStep}>
                    Previous: Budget & Schedule
                  </Button>
                  <Button type="submit" colorScheme="green">
                    Create Campaign
                  </Button>
                </Box>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </form>
      </Box>
    </DashboardLayout>
  );
} 