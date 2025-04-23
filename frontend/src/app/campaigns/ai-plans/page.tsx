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
} from '@chakra-ui/react';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import { FiCopy, FiDownload } from 'react-icons/fi';
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
  const [planType, setPlanType] = useState('Awareness');
  const [planName, setPlanName] = useState('Summer Sale Campaign');
  const [channels, setChannels] = useState<string[]>(['Email', 'Social Media']);
  const [goal, setGoal] = useState('Increase brand awareness');
  const [budget, setBudget] = useState('$10,000');
  const [duration, setDuration] = useState('30 days');
  const [audience, setAudience] = useState('Tech-savvy millennials');
  const [isLoading, setIsLoading] = useState(false);
  const [plan, setPlan] = useState<PlanResponse>(samplePlan);
  const [savedPlans, setSavedPlans] = useState<(PlanResponse & { name: string; type: string })[]>(
    () => {
      const stored = JSON.parse(localStorage.getItem('savedPlans') || 'null');
      return Array.isArray(stored) && stored.length ? stored : sampleSavedPlans;
    }
  );

  useEffect(() => {
    localStorage.setItem('savedPlans', JSON.stringify(savedPlans));
  }, [savedPlans]);

  const handleSavePlan = () => {
    if (!plan) return;
    const saved = JSON.parse(localStorage.getItem('savedPlans') || '[]');
    saved.push({ name: planName, type: planType, ...plan });
    localStorage.setItem('savedPlans', JSON.stringify(saved));
    setSavedPlans(saved);
    toast({ title: 'Plan saved locally', status: 'success', duration: 2000, isClosable: true });
  };

  const handleDownload = () => {
    if (!plan) return;
    const dataStr = JSON.stringify({ title: plan.title, steps: plan.steps }, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${planName || 'plan'}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleGenerate = async () => {
    if (!planName || !planType || !channels.length || !goal || !budget || !duration || !audience) {
      toast({ title: 'Please fill out all fields', status: 'warning', duration: 3000, isClosable: true });
      return;
    }
    setIsLoading(true);
    try {
      const res = await fetch('/api/campaigns/ai-plans', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planName, channels, goal, budget, duration, audience }),
      });
      if (!res.ok) throw new Error('Failed to generate plan');
      const data: PlanResponse = await res.json();
      setPlan(data);
    } catch (error: any) {
      toast({ title: 'Error', description: error.message || 'Could not generate plan', status: 'error', duration: 4000, isClosable: true });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyPlan = useCallback(() => {
    if (plan) {
      const text = [plan.title, ...plan.steps].join('\n');
      navigator.clipboard.writeText(text).then(() => {
        toast({ title: 'Plan copied to clipboard', status: 'success', duration: 2000, isClosable: true });
      });
    }
  }, [plan, toast]);

  return (
    <DashboardLayout>
      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6} mb={6}>
        {/* Form Card */}
        <CustomCard p={6}>
          <Heading as="h1" size="lg" mb={4}>AI Driven Plans</Heading>
          <Text mb={6}>Generate a data-driven campaign plan powered by AI based on your goals.</Text>
          <VStack spacing={4} align="stretch" maxW="600px">
            <FormControl isRequired>
              <FormLabel>Campaign Type</FormLabel>
              <Select value={planType} onChange={e => setPlanType(e.target.value)}>
                <option>Awareness</option>
                <option>Consideration</option>
                <option>Conversion</option>
              </Select>
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Campaign Name</FormLabel>
              <Input placeholder="e.g. Summer Sale Campaign" value={planName} onChange={e => setPlanName(e.target.value)} />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Channels</FormLabel>
              <CheckboxGroup value={channels} onChange={list => setChannels(list as string[])}>
                <HStack spacing={4}>
                  {['Email', 'Social Media', 'Search', 'Display'].map(c => (
                    <Checkbox key={c} value={c}>{c}</Checkbox>
                  ))}
                </HStack>
              </CheckboxGroup>
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Campaign Goal</FormLabel>
              <Input placeholder="e.g. Increase brand awareness" value={goal} onChange={e => setGoal(e.target.value)} />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Budget</FormLabel>
              <Input placeholder="e.g. $10,000" value={budget} onChange={e => setBudget(e.target.value)} />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Duration</FormLabel>
              <Input placeholder="e.g. 30 days" value={duration} onChange={e => setDuration(e.target.value)} />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Target Audience</FormLabel>
              <Input placeholder="e.g. Tech-savvy millennials" value={audience} onChange={e => setAudience(e.target.value)} />
            </FormControl>
            <Button colorScheme="blue" onClick={handleGenerate} isDisabled={isLoading}>
              {isLoading ? <Spinner size="sm" /> : 'Generate Plan'}
            </Button>
          </VStack>
        </CustomCard>
        {/* Generated Plan Card */}
        {plan && (
          <CustomCard p={6}>
            {/* Campaign Metadata */}
            <Flex mb={4} align="center" justify="space-between">
              <Heading as="h2" size="md">{plan.title}</Heading>
            </Flex>
            <VStack align="start" spacing={2} mb={6} divider={<StackDivider />}>
              <Flex>
                <Text fontWeight="bold" mr={2}>Type:</Text>
                <Badge colorScheme="purple">{planType}</Badge>
              </Flex>
              <Flex>
                <Text fontWeight="bold" mr={2}>Channels:</Text>
                {channels.map(c => (
                  <Badge key={c} colorScheme="blue" mr={1}>{c}</Badge>
                ))}
              </Flex>
              <Flex>
                <Text fontWeight="bold" mr={2}>Budget:</Text>
                <Text>{budget}</Text>
              </Flex>
              <Flex>
                <Text fontWeight="bold" mr={2}>Duration:</Text>
                <Text>{duration}</Text>
              </Flex>
              <Flex>
                <Text fontWeight="bold" mr={2}>Audience:</Text>
                <Text>{audience}</Text>
              </Flex>
            </VStack>
            {/* Steps */}
            <Box mb={6}>
              <Text fontWeight="bold" mb={2}>Plan Steps:</Text>
              <List spacing={3}>
                {plan.steps.map((step, idx) => (
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
            {/* Actions */}
            <HStack spacing={3}>
              <Button leftIcon={<FiCopy />} onClick={handleCopyPlan}>Copy Plan</Button>
              <Button variant="outline" onClick={handleGenerate} isLoading={isLoading}>Regenerate</Button>
              <Button leftIcon={<FiDownload />} onClick={handleDownload}>Download JSON</Button>
              <Button variant="outline" onClick={handleSavePlan}>Save Plan</Button>
            </HStack>
          </CustomCard>
        )}
      </SimpleGrid>
      {/* Past AI Plans Table */}
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
                    <Button size="xs" mr={2} onClick={() => setPlan({ title: p.title, steps: p.steps })}>Load</Button>
                    <Button size="xs" colorScheme="red" onClick={() => setSavedPlans(prev => prev.filter((_, idx) => idx !== i))}>Delete</Button>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
      </CustomCard>
    </DashboardLayout>
  );
} 