'use client';

import React from 'react';
import { 
  Box, 
  Container, 
  Heading, 
  VStack, 
  HStack, 
  Text, 
  Flex,
  Divider,
  SimpleGrid,
  Center
} from '@chakra-ui/react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Button from '../../components/ui/Button';
import { 
  FiPlus, 
  FiDownload, 
  FiTrash2, 
  FiSave, 
  FiMail, 
  FiHeart, 
  FiArrowRight 
} from 'react-icons/fi';

export default function ComponentsPage() {
  return (
    <DashboardLayout>
      <Container maxW="7xl" py={8}>
        <VStack spacing={8} align="stretch">
          <Box>
            <Heading size="xl" mb={2}>Button Component</Heading>
            <Text color="gray.600">
              A showcase of our custom Button component with glass morphism effects and animations.
            </Text>
          </Box>

          <Divider />

          {/* Standard Variants */}
          <Box>
            <Heading size="lg" mb={4}>Standard Variants</Heading>
            <SimpleGrid columns={{ base: 2, md: 4 }} spacing={4}>
              <Button variant="primary">Primary</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="accent">Accent</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="glass">Glass</Button>
              <Button variant="glass-colored">Glass Colored</Button>
              <Button isDisabled>Disabled</Button>
            </SimpleGrid>
          </Box>

          {/* Sizes */}
          <Box>
            <Heading size="lg" mb={4}>Sizes</Heading>
            <HStack spacing={4} mb={4}>
              <Button size="xs">Extra Small</Button>
              <Button size="sm">Small</Button>
              <Button size="md">Medium</Button>
              <Button size="lg">Large</Button>
            </HStack>
          </Box>

          {/* With Icons */}
          <Box>
            <Heading size="lg" mb={4}>With Icons</Heading>
            <SimpleGrid columns={{ base: 2, md: 4 }} spacing={4}>
              <Button leftIcon={<FiPlus />}>Add New</Button>
              <Button rightIcon={<FiArrowRight />}>Next Step</Button>
              <Button leftIcon={<FiDownload />} variant="outline">Download</Button>
              <Button leftIcon={<FiTrash2 />} variant="ghost" colorScheme="red">Delete</Button>
              <Button leftIcon={<FiSave />} rightIcon={<FiArrowRight />}>Save and Continue</Button>
              <Button leftIcon={<FiMail />} variant="secondary">Send Email</Button>
              <Button leftIcon={<FiHeart />} variant="accent">Favorite</Button>
            </SimpleGrid>
          </Box>

          {/* Glass Morphism */}
          <Box>
            <Heading size="lg" mb={4}>Glass Morphism Effects</Heading>
            <Box 
              p={10} 
              borderRadius="xl" 
              position="relative" 
              overflow="hidden"
              bg="linear-gradient(135deg, #4286f4 0%, #373B44 100%)"
            >
              <Center>
                <HStack spacing={4} wrap="wrap" justify="center">
                  <Button isGlass>Default Glass</Button>
                  <Button isGlass glassColor="rgba(249, 157, 51, 0.15)" leftIcon={<FiPlus />}>
                    Primary Glass
                  </Button>
                  <Button isGlass glassColor="rgba(83, 109, 138, 0.15)" variant="secondary">
                    Secondary Glass
                  </Button>
                  <Button isGlass glassBlur={15} glassColor="rgba(26, 152, 179, 0.2)">
                    More Blur
                  </Button>
                </HStack>
              </Center>
            </Box>
          </Box>

          {/* Animations */}
          <Box>
            <Heading size="lg" mb={4}>Animations</Heading>
            <SimpleGrid columns={{ base: 2, md: 4 }} spacing={4}>
              <Button animation="pulse" variant="primary">Pulse</Button>
              <Button animation="bounce" variant="secondary">Bounce</Button>
              <Button animation="scale" variant="accent">Scale</Button>
              <Button animation="pulse" isGlass glassColor="rgba(249, 157, 51, 0.15)">Glass Pulse</Button>
            </SimpleGrid>
          </Box>

          {/* Custom Examples */}
          <Box>
            <Heading size="lg" mb={4}>Custom Examples</Heading>
            <Box 
              p={8} 
              borderRadius="xl" 
              position="relative" 
              overflow="hidden"
              bg="linear-gradient(135deg, #654ea3 0%, #eaafc8 100%)"
            >
              <Flex justify="center" wrap="wrap" gap={4}>
                <Button 
                  isGlass 
                  glassColor="rgba(255, 255, 255, 0.25)" 
                  glassBlur={10}
                  size="lg"
                  leftIcon={<FiHeart />}
                  animation="pulse"
                >
                  Follow Us
                </Button>
                
                <Button 
                  isGlass 
                  glassColor="rgba(0, 0, 0, 0.15)" 
                  glassBlur={8}
                  size="lg"
                  rightIcon={<FiArrowRight />}
                  animation="scale"
                >
                  Get Started
                </Button>
              </Flex>
            </Box>
          </Box>
        </VStack>
      </Container>
    </DashboardLayout>
  );
} 