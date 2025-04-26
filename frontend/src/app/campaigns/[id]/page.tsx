'use client';

import { useEffect, useState } from 'react';
import { Box, Heading, Text, Spinner, VStack, HStack, Badge, Button, Icon } from '@chakra-ui/react';
import { CampaignPerformanceView } from '@/components/analytics';
import { FiArrowLeft } from 'react-icons/fi';
import { useRouter } from 'next/navigation';

// This will be replaced with actual API call
const fetchCampaignDetails = async (id: string) => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return {
    id,
    name: `Campaign ${id}`,
    status: ['active', 'completed', 'scheduled'][Math.floor(Math.random() * 3)],
    startDate: '2023-07-15',
    endDate: '2023-08-15',
    budget: 15000,
    channel: ['Email', 'Social Media', 'Display Ads'][Math.floor(Math.random() * 3)],
    targetAudience: 'High-value customers',
    description: 'Summer promotion campaign targeting high-value customers with special offers and discounts.',
  };
};

export default function CampaignDetailsPage({ params }: { params: { id: string } }) {
  const [campaign, setCampaign] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const loadCampaign = async () => {
      try {
        const data = await fetchCampaignDetails(params.id);
        setCampaign(data);
      } catch (error) {
        console.error('Failed to fetch campaign details:', error);
      } finally {
        setLoading(false);
      }
    };

    loadCampaign();
  }, [params.id]);

  if (loading) {
    return (
      <Box px={8} py={8}>
        <Box textAlign="center" py={10}>
          <Spinner size="xl" />
          <Text mt={4}>Loading campaign details...</Text>
        </Box>
      </Box>
    );
  }

  if (!campaign) {
    return (
      <Box px={8} py={8}>
        <Box textAlign="center" py={10}>
          <Heading>Campaign not found</Heading>
          <Text mt={4}>The campaign you're looking for doesn't exist or has been removed.</Text>
        </Box>
      </Box>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'green';
      case 'completed':
        return 'blue';
      case 'scheduled':
        return 'orange';
      default:
        return 'gray';
    }
  };

  return (
    <Box px={8} py={8}>
      <VStack spacing={8} align="stretch">
        <Button 
          leftIcon={<Icon as={FiArrowLeft} />} 
          variant="ghost" 
          alignSelf="flex-start" 
          mb={4}
          onClick={() => router.push('/analytics/campaigns')}
        >
          Back to Campaign Analytics
        </Button>
        
        <Box>
          <HStack justifyContent="space-between" mb={2}>
            <Heading as="h1" size="xl">{campaign.name}</Heading>
            <Badge colorScheme={getStatusColor(campaign.status)} fontSize="md" px={3} py={1} borderRadius="md">
              {campaign.status.toUpperCase()}
            </Badge>
          </HStack>
          
          <Text fontSize="lg" color="gray.600" mb={4}>{campaign.description}</Text>
          
          <HStack spacing={8} wrap="wrap" mb={4}>
            <Box>
              <Text fontWeight="bold">Start Date</Text>
              <Text>{campaign.startDate}</Text>
            </Box>
            <Box>
              <Text fontWeight="bold">End Date</Text>
              <Text>{campaign.endDate}</Text>
            </Box>
            <Box>
              <Text fontWeight="bold">Budget</Text>
              <Text>${campaign.budget.toLocaleString()}</Text>
            </Box>
            <Box>
              <Text fontWeight="bold">Channel</Text>
              <Text>{campaign.channel}</Text>
            </Box>
            <Box>
              <Text fontWeight="bold">Target Audience</Text>
              <Text>{campaign.targetAudience}</Text>
            </Box>
          </HStack>
        </Box>

        <Box bg="white" p={6} borderRadius="lg" shadow="md">
          <Heading as="h2" size="lg" mb={6}>Campaign Performance</Heading>
          <CampaignPerformanceView campaignId={params.id} />
        </Box>
      </VStack>
    </Box>
  );
} 