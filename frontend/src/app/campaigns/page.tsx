'use client';

import React from 'react';
import {
  Box,
  Heading,
  Text,
  SimpleGrid,
  Card,
  CardBody,
  VStack,
  HStack,
  Icon,
  Button,
  useColorModeValue,
} from '@chakra-ui/react';
import { FiBarChart2, FiPlus, FiEdit, FiZap, FiSend } from 'react-icons/fi';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { useRouter } from 'next/navigation';

export default function CampaignsPage() {
  const router = useRouter();
  const cardBg = useColorModeValue('white', 'gray.800');
  const cardBorderColor = useColorModeValue('gray.200', 'gray.700');

  const campaignModules = [
    {
      title: 'Campaign Insights',
      description: 'Track and analyze your campaign performance metrics',
      icon: FiBarChart2,
      href: '/campaigns/insights',
    },
    {
      title: 'Build Campaigns',
      description: 'Create new marketing campaigns with our intuitive builder',
      icon: FiPlus,
      href: '/campaigns/build',
    },
    {
      title: 'View/Edit Campaigns',
      description: 'Manage and modify your existing marketing campaigns',
      icon: FiEdit,
      href: '/campaigns/view',
    },
    {
      title: 'AI Driven Plans',
      description: 'Get AI-powered recommendations for campaign optimization',
      icon: FiZap,
      href: '/campaigns/ai-plans',
    },
  ];

  return (
    <DashboardLayout>
      <Box mb={6}>
        <HStack spacing={4} align="center" mb={6}>
          <Icon as={FiSend} boxSize={8} color="blue.500" />
          <Box>
            <Heading as="h1" size="xl" color="secondary.700">
              Campaigns
            </Heading>
            <Text color="gray.600">
              Create and manage your marketing campaigns
            </Text>
          </Box>
        </HStack>

        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
          {campaignModules.map((module) => (
            <Card
              key={module.title}
              bg={cardBg}
              borderWidth="1px"
              borderColor={cardBorderColor}
              _hover={{
                transform: 'translateY(-2px)',
                boxShadow: 'lg',
              }}
              transition="all 0.2s"
              cursor="pointer"
              onClick={() => router.push(module.href)}
            >
              <CardBody>
                <VStack align="start" spacing={4}>
                  <HStack>
                    <Icon as={module.icon} boxSize={6} color="blue.500" />
                    <Heading size="md">{module.title}</Heading>
                  </HStack>
                  <Text color="gray.600">{module.description}</Text>
                  <Button
                    colorScheme="blue"
                    variant="ghost"
                    rightIcon={<Icon as={module.icon} />}
                  >
                    Open Module
                  </Button>
                </VStack>
              </CardBody>
            </Card>
          ))}
        </SimpleGrid>
      </Box>
    </DashboardLayout>
  );
} 