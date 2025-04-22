'use client';

import React from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  Button,
  VStack,
  HStack,
  SimpleGrid,
  Flex,
  Icon,
  useColorModeValue,
  Image,
  Divider,
  chakra,
  Stack,
} from '@chakra-ui/react';
import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import { FiArrowRight, FiFileText, FiCheckCircle, FiGlobe, FiHeadphones, FiLayers, FiTrendingUp } from 'react-icons/fi';

export default function Home() {
  const { data: session } = useSession();
  
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const cardBg = useColorModeValue('white', 'gray.800');
  const primaryColor = useColorModeValue('blue.500', 'blue.300');
  const secondaryColor = useColorModeValue('teal.500', 'teal.300');
  const textColor = useColorModeValue('gray.700', 'gray.100');
  const heroTextColor = "white";

  const FeatureCard = ({ icon, title, description }) => (
    <Box 
      p={6} 
      bg={useColorModeValue('rgba(255, 255, 255, 0.8)', 'rgba(26, 32, 44, 0.8)')} 
      borderRadius="lg" 
      boxShadow="lg" 
      height="100%"
      backdropFilter="blur(10px)"
      borderWidth="1px"
      borderColor={useColorModeValue('gray.200', 'gray.700')}
      transition="all 0.3s"
      _hover={{
        transform: 'translateY(-5px)',
        boxShadow: 'xl',
      }}
    >
      <Icon as={icon} boxSize={12} color={primaryColor} mb={4} />
      <Heading size="md" mb={3}>{title}</Heading>
      <Text color={useColorModeValue('gray.600', 'gray.300')}>{description}</Text>
    </Box>
  );

  return (
    <Box bg={bgColor}>
      {/* Navbar */}
      <Box 
        position="sticky"
        top={0}
        zIndex={100}
        bg="rgba(26, 32, 44, 0.85)"
        backdropFilter="blur(10px)"
        boxShadow="md"
      >
        <Container maxW="container.xl">
          <Flex 
            justify="space-between" 
            align="center" 
            py={4} 
          >
            <Flex align="center">
              <Heading 
                as="h1" 
                size="md" 
                color="white" 
                fontWeight="bold"
                cursor="pointer"
                onClick={() => window.location.href = '/'}
              >
                Insight<chakra.span color="blue.400">AI</chakra.span>
              </Heading>
            </Flex>
            
            <HStack 
              spacing={8} 
              display={{ base: 'none', md: 'flex' }}
            >
              <Text color="whiteAlpha.900" fontWeight="medium" cursor="pointer">Features</Text>
              <Text color="whiteAlpha.900" fontWeight="medium" cursor="pointer">Pricing</Text>
              <Text color="whiteAlpha.900" fontWeight="medium" cursor="pointer">Documentation</Text>
              <Text color="whiteAlpha.900" fontWeight="medium" cursor="pointer">About</Text>
            </HStack>
            
            <HStack spacing={4}>
              {session ? (
                <Button 
                  onClick={() => window.location.href = '/dashboard'}
                  size="sm" 
                  colorScheme="blue"
                  borderRadius="lg"
                >
                  Dashboard
                </Button>
              ) : (
                <>
                  <Button 
                    onClick={() => window.location.href = '/auth/signin'}
                    variant="ghost" 
                    color="whiteAlpha.900" 
                    _hover={{ bg: 'whiteAlpha.200' }}
                    size="sm"
                    display={{ base: 'none', sm: 'inline-flex' }}
                  >
                    Sign In
                  </Button>
                  <Button 
                    onClick={() => window.location.href = '/auth/signin'}
                    colorScheme="blue" 
                    size="sm"
                    borderRadius="lg"
                  >
                    Get Started
                  </Button>
                </>
              )}
            </HStack>
          </Flex>
        </Container>
      </Box>

      {/* Hero Section */}
      <Box 
        py={{ base: 16, md: 24 }} 
        position="relative"
        overflow="hidden"
        _before={{
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          bgGradient: "linear(to-br, blue.700, purple.800)",
          zIndex: -2,
        }}
      >
        {/* Container for content */}
        <Container maxW="container.xl" position="relative" zIndex="1">
          <Flex 
            direction={{ base: 'column', lg: 'row' }} 
            align="center" 
            gap={{ base: 12, lg: 6 }}
          >
            <Box 
              flex={1} 
              pr={{ base: 0, lg: 8 }}
              p={{ base: 6, md: 8 }}
              bg="rgba(49, 130, 206, 0.4)"
              backdropFilter="blur(20px)"
              borderRadius="2xl"
              borderWidth="1px"
              borderColor="rgba(255, 255, 255, 0.15)"
              boxShadow="0 20px 50px rgba(0, 0, 0, 0.2)"
              transform="translateY(0)"
              transition="all 0.3s ease"
              position="relative"
              overflow="hidden"
              _hover={{
                transform: "translateY(-5px)",
                boxShadow: "0 25px 50px rgba(0, 0, 0, 0.3)",
              }}
            >
              <Box
                position="absolute"
                top="0"
                left="0"
                right="0"
                bottom="0"
                bgGradient="linear(to-br, blue.700, purple.800)"
                opacity="0.95"
                zIndex="-1"
              />
              <Text 
                color="blue.200" 
                mb={3} 
                fontWeight="semibold"
                fontSize="lg"
                letterSpacing="wider"
              >
                Introducing our Insights
              </Text>
              <Heading 
                as="h1" 
                fontSize={{ base: "3xl", md: "4xl", lg: "5xl" }}
                lineHeight="1.2"
                mb={6} 
                color="white"
                fontWeight="bold"
                letterSpacing="tight"
              >
                Modular Framework for Enterprise Applications
              </Heading>
              <Text 
                fontSize={{ base: "lg", md: "xl" }}
                mb={8} 
                color="whiteAlpha.900"
                maxW="container.md"
                lineHeight="tall"
              >
                Customize your business journey effortlessly with our dashboard backed by a suite of powerful tools at your fingertips.
              </Text>
              
              <HStack spacing={5} flexWrap={{ base: "wrap", md: "nowrap" }}>
                {session ? (
                  <>
                    <Button 
                      onClick={() => window.location.href = '/dashboard'}
                      size="lg" 
                      rightIcon={<FiArrowRight />} 
                      bg="white" 
                      color="blue.600" 
                      px={8} 
                      py={7}
                      fontSize="md"
                      fontWeight="semibold"
                      _hover={{ 
                        bg: "whiteAlpha.900", 
                        transform: 'translateY(-3px)', 
                        boxShadow: 'xl' 
                      }}
                      transition="all 0.3s ease"
                      boxShadow="lg"
                      borderRadius="xl"
                    >
                      Go to Dashboard
                    </Button>
                    <Button 
                      onClick={() => signOut()} 
                      bg="rgba(229, 62, 62, 0.15)" 
                      color="red.200" 
                      _hover={{ 
                        bg: 'rgba(229, 62, 62, 0.25)',
                        transform: 'translateY(-3px)'
                      }} 
                      variant="solid" 
                      size="lg"
                      px={8}
                      py={7}
                      fontSize="md"
                      fontWeight="semibold"
                      transition="all 0.3s ease"
                      borderWidth="1px"
                      borderColor="rgba(229, 62, 62, 0.3)"
                      borderRadius="xl"
                    >
                      Sign Out
                    </Button>
                  </>
                ) : (
                  <>
                    <Button 
                      onClick={() => window.location.href = '/auth/signin'}
                      size="lg" 
                      rightIcon={<FiArrowRight />} 
                      bg="white"
                      color="blue.600"
                      px={8}
                      py={7}
                      fontSize="md"
                      fontWeight="semibold"
                      _hover={{ 
                        bg: "whiteAlpha.900", 
                        transform: 'translateY(-3px)', 
                        boxShadow: 'xl' 
                      }}
                      transition="all 0.3s ease"
                      boxShadow="lg"
                      borderRadius="xl"
                    >
                      Get Started
                    </Button>
                    <Button 
                      size="lg" 
                      variant="outline"
                      px={8}
                      py={7}
                      fontSize="md"
                      fontWeight="semibold"
                      color="whiteAlpha.900"
                      borderColor="whiteAlpha.300"
                      _hover={{ 
                        bg: 'whiteAlpha.100',
                        borderColor: 'whiteAlpha.500',
                        transform: 'translateY(-3px)'
                      }}
                      transition="all 0.3s ease"
                      borderRadius="xl"
                    >
                      How it works
                    </Button>
                  </>
                )}
              </HStack>
            </Box>

            <Box flex={1}>
              <Box 
                position="relative" 
                height={{ base: "380px", md: "450px" }}
                width="100%"
                sx={{
                  transformStyle: "preserve-3d",
                  transform: "perspective(1000px) rotateY(-5deg) rotateX(5deg)"
                }}
                transition="all 0.5s ease"
                _hover={{
                  transform: "perspective(1000px) rotateY(-2deg) rotateX(2deg) translateZ(20px)"
                }}
              >
                <Box
                  height="100%"
                  width="100%"
                  borderRadius="2xl"
                  position="relative"
                  overflow="hidden"
                  bgGradient="linear(to-br, blue.500, purple.600)"
                  boxShadow="0 25px 50px -12px rgba(0, 0, 0, 0.5)"
                  borderWidth="1px"
                  borderColor="rgba(255, 255, 255, 0.15)"
                >
                  {/* Glass card mockup */}
                  <Box
                    position="absolute"
                    top="50%"
                    left="50%"
                    transform="translate(-50%, -50%)"
                    width="92%"
                    height="85%"
                    bg="rgba(255, 255, 255, 0.92)"
                    backdropFilter="blur(10px)"
                    borderRadius="xl"
                    p={6}
                    boxShadow="0 8px 32px rgba(0, 0, 0, 0.1)"
                    borderWidth="1px"
                    borderColor="rgba(255, 255, 255, 0.2)"
                  >
                    <Flex direction="column" height="100%">
                      <HStack mb={4}>
                        <Box width="12px" height="12px" borderRadius="full" bg="red.400" />
                        <Box width="12px" height="12px" borderRadius="full" bg="yellow.400" />
                        <Box width="12px" height="12px" borderRadius="full" bg="green.400" />
                        <Heading size="sm" ml={2} color="gray.700">Dashboard Overview</Heading>
                      </HStack>
                      
                      <Flex flex={1} wrap="wrap" gap={4}>
                        <Box flex="1" minW="120px" bg="blue.50" borderRadius="md" p={3} boxShadow="sm">
                          <Text color="blue.700" fontSize="sm" fontWeight="bold" mb={2}>Analytics</Text>
                          <Box height="80px" bgGradient="linear(to-r, blue.100, blue.50)" borderRadius="md" />
                        </Box>
                        <Box flex="1" minW="120px" bg="purple.50" borderRadius="md" p={3} boxShadow="sm">
                          <Text color="purple.700" fontSize="sm" fontWeight="bold" mb={2}>Reports</Text>
                          <Box height="80px" bgGradient="linear(to-r, purple.100, purple.50)" borderRadius="md" />
                        </Box>
                        <Box flex="2" bg="gray.50" borderRadius="md" p={3} mt={4} boxShadow="sm">
                          <Text color="gray.700" fontSize="sm" fontWeight="bold" mb={2}>Recent Activity</Text>
                          <Stack spacing={2}>
                            <Box height="12px" width="100%" bg="gray.100" borderRadius="full" />
                            <Box height="12px" width="85%" bg="gray.100" borderRadius="full" />
                            <Box height="12px" width="65%" bg="gray.100" borderRadius="full" />
                          </Stack>
                        </Box>
                      </Flex>
                    </Flex>
                  </Box>
                </Box>
              </Box>
            </Box>
          </Flex>
        </Container>
      </Box>

      {/* Trusted By Section */}
      <Box py={16} bg={useColorModeValue('white', 'gray.800')}>
        <Container maxW="container.xl">
          <VStack spacing={8}>
            <Text 
              textAlign="center" 
              fontSize={{ base: "md", md: "lg" }} 
              color={useColorModeValue('gray.600', 'gray.400')} 
              fontWeight="medium"
              letterSpacing="wide"
            >
              TRUSTED BY THOUSANDS OF BUSINESSES
            </Text>
            <Flex 
              justify="space-between" 
              align="center" 
              wrap="wrap" 
              gap={6} 
              width="full"
            >
              {['Company A', 'Company B', 'Company C', 'Company D', 'Company E', 'Company F'].map((company, i) => (
                <Box 
                  key={i} 
                  opacity={0.7} 
                  p={4} 
                  flex={{ base: "1 0 40%", md: "1 0 auto" }}
                  textAlign="center"
                  transition="all 0.3s ease"
                  _hover={{ opacity: 1, transform: "scale(1.05)" }}
                >
                  <Text fontWeight="bold" fontSize={{ base: "md", md: "lg" }} color={useColorModeValue('gray.500', 'gray.400')}>
                    {company}
                  </Text>
                </Box>
              ))}
            </Flex>
          </VStack>
        </Container>
      </Box>

      {/* Features Section */}
      <Box 
        py={{ base: 20, md: 28 }} 
        bgGradient={useColorModeValue(
          'linear(to-b, white, gray.50)',
          'linear(to-b, gray.900, gray.800)'
        )}
      >
        <Container maxW="container.xl">
          <VStack spacing={16}>
            <VStack textAlign="center" spacing={5} maxW="800px">
              <Heading 
                as="h2" 
                fontSize={{ base: "3xl", md: "4xl" }} 
                color={textColor}
                fontWeight="bold"
                letterSpacing="tight"
              >
                Comprehensive Modular Platform
              </Heading>
              <Text 
                fontSize={{ base: "lg", md: "xl" }} 
                color={useColorModeValue('gray.600', 'gray.400')}
                lineHeight="tall"
              >
                Customize your business journey effortlessly with our dashboard, backed by a suite of powerful tools at your fingertips.
              </Text>
            </VStack>

            <SimpleGrid 
              columns={{ base: 1, md: 3 }} 
              spacing={{ base: 8, md: 12 }} 
              width="100%"
            >
              <FeatureCard 
                icon={FiLayers} 
                title="Easy Integration" 
                description="Integrate with existing systems effortlessly and build modular applications with minimal friction."
              />
              <FeatureCard 
                icon={FiCheckCircle} 
                title="Flexible Components" 
                description="Pre-built components that adapt to your specific business needs and workflows."
              />
              <FeatureCard 
                icon={FiTrendingUp} 
                title="Enterprise Ready" 
                description="Battle-tested architecture used by organizations across 50+ countries worldwide."
              />
            </SimpleGrid>

            {session ? (
              <Button 
                onClick={() => window.location.href = '/dashboard'}
                size="lg" 
                rightIcon={<FiArrowRight />} 
                colorScheme="blue"
                bg={primaryColor}
                px={8}
                py={7}
                fontSize="md"
                fontWeight="semibold"
                _hover={{ 
                  transform: 'translateY(-3px)', 
                  boxShadow: 'lg',
                  bg: 'blue.400'
                }}
                transition="all 0.3s ease"
                boxShadow="md"
                borderRadius="xl"
              >
                Go to Dashboard
              </Button>
            ) : (
              <Button 
                onClick={() => window.location.href = '/auth/signin'}
                size="lg" 
                rightIcon={<FiArrowRight />} 
                colorScheme="blue"
                bg={primaryColor}
                px={8}
                py={7}
                fontSize="md"
                fontWeight="semibold"
                _hover={{ 
                  transform: 'translateY(-3px)', 
                  boxShadow: 'lg',
                  bg: 'blue.400'
                }}
                transition="all 0.3s ease"
                boxShadow="md"
                borderRadius="xl"
              >
                Get Started
              </Button>
            )}
          </VStack>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box py={{ base: 20, md: 28 }} bg={useColorModeValue('gray.50', 'gray.800')}>
        <Container maxW="container.xl">
          <Flex 
            direction={{ base: 'column', md: 'row' }} 
            align="center" 
            justify="space-between" 
            bg={useColorModeValue('rgba(49, 130, 206, 0.4)', 'rgba(49, 130, 206, 0.4)')}
            p={{ base: 8, md: 12 }}
            borderRadius="2xl" 
            boxShadow="xl"
            overflow="hidden"
            position="relative"
          >
            <Box
              position="absolute"
              top={0}
              left={0}
              right={0}
              bottom={0}
              bgGradient="linear(to-br, blue.700, purple.800)"
              opacity="0.95"
              zIndex={0}
            />
            <VStack 
              align={{ base: "center", md: "flex-start" }} 
              spacing={5} 
              maxW="600px" 
              mb={{ base: 8, md: 0 }}
              zIndex={1}
            >
              <Heading 
                as="h2" 
                fontSize={{ base: "2xl", md: "3xl" }} 
                color="white"
                fontWeight="bold"
                lineHeight="shorter"
              >
                Ready to accelerate your development?
              </Heading>
              <Text 
                fontSize={{ base: "md", md: "lg" }} 
                color="whiteAlpha.900"
                textAlign={{ base: "center", md: "left" }}
              >
                Start building modern applications with our comprehensive framework. No credit card needed.
              </Text>
            </VStack>
            
            {session ? (
              <Button 
                onClick={() => window.location.href = '/dashboard'}
                size="lg" 
                rightIcon={<FiArrowRight />} 
                colorScheme="blue" 
                height="64px" 
                px={10}
                zIndex={1}
                fontSize="md"
                fontWeight="semibold"
                _hover={{ 
                  transform: 'translateY(-3px)', 
                  boxShadow: 'lg',
                  bg: 'blue.400'
                }}
                transition="all 0.3s ease"
                boxShadow="md"
                borderRadius="xl"
              >
                Open Dashboard
              </Button>
            ) : (
              <Button 
                onClick={() => window.location.href = '/auth/signin'}
                size="lg" 
                rightIcon={<FiArrowRight />} 
                colorScheme="blue" 
                height="64px" 
                px={10}
                zIndex={1}
                fontSize="md"
                fontWeight="semibold"
                _hover={{ 
                  transform: 'translateY(-3px)', 
                  boxShadow: 'lg',
                  bg: 'blue.400'
                }}
                transition="all 0.3s ease"
                boxShadow="md"
                borderRadius="xl"
              >
                Start for Free
              </Button>
            )}
          </Flex>
        </Container>
      </Box>
    </Box>
  );
} 