'use client';
// Next.js page using client hooks needs to be a client component

import React, { useState, useCallback, useEffect } from 'react';
import {
  Box,
  Heading,
  Text,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Button,
  VStack,
  Spinner,
  useToast,
  SimpleGrid,
  Flex,
  CheckboxGroup,
  Checkbox,
  HStack,
  IconButton,
  Select,
  Icon,
  Badge,
  StackDivider,
  List,
  ListItem,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  CardHeader,
  CardBody,
  InputGroup,
  InputLeftAddon,
} from '@chakra-ui/react';
import { FiCopy, FiDownload, FiCpu } from 'react-icons/fi';
import { Card as CustomCard } from '../../../components/ui/Card';

interface PlanResponse {
  title: string;
  steps: string[];
}

// Add a sample plan for initial display
const samplePlan: PlanResponse = {
  title: 'AI-Driven Plan for: Increase brand awareness',
  steps: [
    'Define target audience: Tech-savvy millennials',
    'Allocate budget of $10,000 to the campaign',
    'Set campaign duration to 30 days',
    'Craft messaging and creatives aligned with goal: Increase brand awareness',
    'Launch campaign across selected channels',
    'Monitor performance and optimize in real-time',
    'Compile insights and report ROI'
  ]
};

// Sample saved plans fallback
const sampleSavedPlans = [
  { name: 'Summer Sale Campaign', type: 'Awareness', title: samplePlan.title, steps: samplePlan.steps },
  { name: 'Holiday Promo', type: 'Conversion', title: samplePlan.title, steps: samplePlan.steps }
];

export default function AIDrivenPlansPage() {
  const toast = useToast();
  const [campaignType, setCampaignType] = useState('email');
  const [campaignName, setCampaignName] = useState('');
  const [campaignChannels, setCampaignChannels] = useState(['email']);
  const [campaignGoal, setCampaignGoal] = useState('');
  const [campaignBudget, setCampaignBudget] = useState('');
  const [campaignDuration, setCampaignDuration] = useState('');
  const [audience, setAudience] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPlan, setGeneratedPlan] = useState(null);
  const [savedPlans, setSavedPlans] = useState<(PlanResponse & { name: string; type: string })[]>(sampleSavedPlans);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = JSON.parse(localStorage.getItem('savedPlans') || 'null');
      if (Array.isArray(stored) && stored.length) {
        setSavedPlans(stored);
      }
      setIsHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (isHydrated && typeof window !== 'undefined') {
      localStorage.setItem('savedPlans', JSON.stringify(savedPlans));
    }
  }, [savedPlans, isHydrated]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsGenerating(true);

    try {
      // In a real app, this would call an API to generate the plan
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock response with finance/banking specific content
      const mockPlan = {
        name: campaignName || "Financial Freedom Initiative",
        type: campaignType,
        channels: campaignChannels,
        budget: campaignBudget || "$50,000",
        duration: campaignDuration || "3 months",
        audience: audience || "High-net-worth individuals aged 45-65",
        goal: campaignGoal || "Increase investment advisory service adoption",
        steps: [
          "Segment client base by portfolio value and investment activity",
          "Create personalized wealth management content for each segment",
          "Deploy targeted advisor outreach to high-value prospects",
          "Launch educational webinar series on retirement planning",
          "Implement portfolio review follow-up sequence",
          "Track AUM growth and new managed accounts",
          "Analyze client acquisition cost and lifetime value metrics"
        ]
      };
      
      setGeneratedPlan(mockPlan);
      toast({
        title: "Plan generated successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Failed to generate plan",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSavePlan = () => {
    if (!generatedPlan) return;
    setSavedPlans(prev => [...prev, { name: campaignName, type: campaignType, ...generatedPlan }]);
    toast({ title: 'Plan saved locally', status: 'success', duration: 2000, isClosable: true });
  };

  const handleDownload = () => {
    if (!generatedPlan) return;
    const dataStr = JSON.stringify({ title: generatedPlan.title, steps: generatedPlan.steps }, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${campaignName || 'plan'}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleCopyPlan = useCallback(() => {
    if (generatedPlan) {
      const text = [generatedPlan.title, ...generatedPlan.steps].join('\n');
      navigator.clipboard.writeText(text).then(() => {
        toast({ title: 'Plan copied to clipboard', status: 'success', duration: 2000, isClosable: true });
      });
    }
  }, [generatedPlan, toast]);

  return (
      <Box p={6}>
        <HStack spacing={4} align="center" mb={6}>
          <Icon as={FiCpu} boxSize={8} color="blue.500" />
          <Box>
            <Heading as="h1" size="xl" color="secondary.700">
              AI-Driven Financial Marketing Plans
            </Heading>
            <Text color="gray.600">
              Generate comprehensive financial marketing and client acquisition plans with AI
            </Text>
          </Box>
        </HStack>

        <SimpleGrid columns={{ base: 1, xl: 2 }} spacing={6}>
          <CustomCard>
            <Box p={6}>
              <Heading size="md" mb={2}>Campaign Details</Heading>
              <Text mb={4} color="gray.600" fontSize="sm">
                Enter your financial campaign parameters for AI-powered planning
              </Text>
            
              <VStack as="form" onSubmit={handleSubmit} spacing={6} align="start">
                <FormControl isRequired>
                  <FormLabel>Campaign Name</FormLabel>
                  <Input 
                    value={campaignName} 
                    onChange={(e) => setCampaignName(e.target.value)} 
                    placeholder="Wealth Management Advisory Series"
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Campaign Type</FormLabel>
                  <Select value={campaignType} onChange={(e) => setCampaignType(e.target.value)}>
                    <option value="advisory">Wealth Advisory</option>
                    <option value="retirement">Retirement Planning</option>
                    <option value="investment">Investment Products</option>
                    <option value="banking">Digital Banking</option>
                    <option value="mortgage">Mortgage Services</option>
                    <option value="wealth">Wealth Management</option>
                  </Select>
                </FormControl>

                <FormControl>
                  <FormLabel>Marketing Channels</FormLabel>
                  <CheckboxGroup 
                    colorScheme="blue" 
                    value={campaignChannels} 
                    onChange={(values) => setCampaignChannels(values as string[])}
                  >
                    <SimpleGrid columns={{ base: 1, md: 2 }} spacing={3}>
                      <Checkbox value="email">Email</Checkbox>
                      <Checkbox value="advisor">Financial Advisors</Checkbox>
                      <Checkbox value="webinar">Webinars</Checkbox>
                      <Checkbox value="direct">Direct Mail</Checkbox>
                      <Checkbox value="branch">Branch Promotions</Checkbox>
                      <Checkbox value="social">Financial Networks</Checkbox>
                      <Checkbox value="events">Wealth Events</Checkbox>
                    </SimpleGrid>
                  </CheckboxGroup>
                </FormControl>

                <FormControl>
                  <FormLabel>Campaign Goal</FormLabel>
                  <Textarea 
                    value={campaignGoal} 
                    onChange={(e) => setCampaignGoal(e.target.value)} 
                    placeholder="Increase assets under management and acquire high-net-worth clients"
                  />
                </FormControl>

                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6} width="100%">
                  <FormControl>
                    <FormLabel>Budget</FormLabel>
                    <InputGroup>
                      <InputLeftAddon>$</InputLeftAddon>
                      <Input 
                        value={campaignBudget} 
                        onChange={(e) => setCampaignBudget(e.target.value)} 
                        placeholder="75,000"
                      />
                    </InputGroup>
                  </FormControl>

                  <FormControl>
                    <FormLabel>Duration</FormLabel>
                    <InputGroup>
                      <Input 
                        value={campaignDuration} 
                        onChange={(e) => setCampaignDuration(e.target.value)} 
                        placeholder="6 months"
                      />
                    </InputGroup>
                  </FormControl>
                </SimpleGrid>

                <FormControl>
                  <FormLabel>Target Audience</FormLabel>
                  <Textarea 
                    value={audience} 
                    onChange={(e) => setAudience(e.target.value)} 
                    placeholder="High-net-worth individuals, pre-retirees aged 50-65, business owners seeking wealth management"
                  />
                </FormControl>

                <Button 
                  type="submit" 
                  colorScheme="blue" 
                  size="lg" 
                  width="100%" 
                  isLoading={isGenerating}
                  leftIcon={<Icon as={FiCpu} />}
                >
                  Generate Campaign Plan
                </Button>
              </VStack>
            </Box>
          </CustomCard>

          {generatedPlan && (
            <CustomCard>
              <Box p={6}>
                <Flex mb={4} align="center" justify="space-between">
                  <Heading as="h2" size="md">{generatedPlan.title}</Heading>
                </Flex>
                <VStack align="start" spacing={2} mb={6} divider={<StackDivider />}>
                  <Flex>
                    <Text fontWeight="bold" mr={2}>Type:</Text>
                    <Badge colorScheme="purple">{campaignType}</Badge>
                  </Flex>
                  <Flex>
                    <Text fontWeight="bold" mr={2}>Channels:</Text>
                    {campaignChannels.map(c => (
                      <Badge key={c} colorScheme="blue" mr={1}>{c}</Badge>
                    ))}
                  </Flex>
                  <Flex>
                    <Text fontWeight="bold" mr={2}>Budget:</Text>
                    <Text>{campaignBudget}</Text>
                  </Flex>
                  <Flex>
                    <Text fontWeight="bold" mr={2}>Duration:</Text>
                    <Text>{campaignDuration}</Text>
                  </Flex>
                  <Flex>
                    <Text fontWeight="bold" mr={2}>Audience:</Text>
                    <Text>{audience}</Text>
                  </Flex>
                </VStack>
                <Box mb={6}>
                  <Text fontWeight="bold" mb={2}>Plan Steps:</Text>
                  <List spacing={3}>
                    {generatedPlan.steps.map((step, idx) => (
                      <ListItem key={idx}>
                        <HStack align="start">
                          <Badge colorScheme="green" borderRadius="full" boxSize={6} display="flex" alignItems="center" justifyContent="center">
                            {idx + 1}
                          </Badge>
                          <Text>{step}</Text>
                        </HStack>
                      </ListItem>
                    ))}
                  </List>
                </Box>
                <HStack spacing={3}>
                  <Button leftIcon={<FiCopy />} onClick={handleCopyPlan}>Copy Plan</Button>
                  <Button variant="outline" onClick={handleSavePlan}>Save Plan</Button>
                  <Button leftIcon={<FiDownload />} onClick={handleDownload}>Download JSON</Button>
                </HStack>
              </Box>
            </CustomCard>
          )}
        </SimpleGrid>
      
      <CustomCard p={6}>
        <Heading as="h3" size="md" mb={4}>Past AI Plans</Heading>
        <TableContainer>
          <Table variant="striped" size="sm">
            <Thead>
              <Tr>
                <Th>Plan Name</Th>
                <Th>Type</Th>
                <Th>Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {savedPlans.map((p, i) => (
                <Tr key={i}>
                  <Td>{p.name}</Td>
                  <Td>{p.type}</Td>
                  <Td>
                    <Button size="xs" mr={2} onClick={() => setGeneratedPlan({ title: p.title, steps: p.steps })}>Load</Button>
                    <Button size="xs" colorScheme="red" onClick={() => setSavedPlans(prev => prev.filter((_, idx) => idx !== i))}>Delete</Button>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
      </CustomCard>
      </Box>
  );
} 