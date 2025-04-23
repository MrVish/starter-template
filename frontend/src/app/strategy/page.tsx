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
import { FiTrendingUp, FiUsers, FiMail, FiTarget, FiBarChart2 } from 'react-icons/fi';
import Link from 'next/link';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { useRouter } from 'next/navigation';

export default function StrategyPage() {
  const router = useRouter();
  const cardBg = useColorModeValue('white', 'gray.800');
  const cardBorderColor = useColorModeValue('gray.200', 'gray.700');

  const strategyModules = [
    {
      title: 'Strategy Insights',
      description: 'Analyze and track performance of your marketing strategies',
      icon: FiTrendingUp,
      href: '/strategy/insights',
    },
    {
      title: 'Customer Segments',
      description: 'Define and manage customer segments for targeted marketing',
      icon: FiUsers,
      href: '/strategy/segments',
    },
    {
      title: 'Contact Strategy',
      description: 'Plan and optimize customer communication channels',
      icon: FiMail,
      href: '/strategy/contact',
    },
    {
      title: 'Strategy Planning',
      description: 'Create and manage long-term marketing strategies',
      icon: FiTarget,
      href: '/strategy/planning',
    },
  ];

  return (
    <DashboardLayout>
      <Box mb={6}>
        <HStack spacing={4} align="center" mb={6}>
          <Icon as={FiBarChart2} boxSize={8} color="blue.500" />
          <Box>
            <Heading as="h1" size="xl" color="secondary.700">
              Strategy Management
            </Heading>
            <Text color="gray.600">
              Develop and optimize your marketing strategies
            </Text>
          </Box>
        </HStack>

        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
          {strategyModules.map((module) => (
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