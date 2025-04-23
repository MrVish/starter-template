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
import { FiAlertCircle, FiTrendingUp, FiShield } from 'react-icons/fi';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { useRouter } from 'next/navigation';

export default function RiskPage() {
  const router = useRouter();
  const cardBg = useColorModeValue('white', 'gray.800');
  const cardBorderColor = useColorModeValue('gray.200', 'gray.700');

  const riskModules = [
    {
      title: 'Risk Assessment',
      description: 'Conduct comprehensive risk assessments and evaluations',
      icon: FiAlertCircle,
      href: '/risk/assessment',
    },
    {
      title: 'Risk Monitoring',
      description: 'Monitor and track risk metrics in real-time',
      icon: FiTrendingUp,
      href: '/risk/monitoring',
    },
  ];

  return (
    <DashboardLayout>
      <Box mb={6}>
        <HStack spacing={4} align="center" mb={6}>
          <Icon as={FiShield} boxSize={8} color="blue.500" />
          <Box>
            <Heading as="h1" size="xl" color="secondary.700">
              Risk Management
            </Heading>
            <Text color="gray.600">
              Monitor and manage model risks effectively
            </Text>
          </Box>
        </HStack>

        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
          {riskModules.map((module) => (
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