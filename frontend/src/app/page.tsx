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
import { FiArrowRight, FiFileText, FiCheckCircle, FiGlobe, FiHeadphones, FiLayers, FiTrendingUp, FiTarget, FiPieChart, FiUsers } from 'react-icons/fi';

export default function Home() {
  const { data: session } = useSession();
  
  const bgColor = 'background.50';
  const cardBg = useColorModeValue('white', 'gray.800');
  const primaryColor = 'primary.500';
  const secondaryColor = 'brand.500';
  const textColor = 'secondary.500';
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
    <Box bg="gray.50">
      {/* Navbar */}
      <Box 
        position="sticky"
        top={0}
        zIndex={100}
        bg="rgba(46, 54, 67, 0.85)"
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
                <chakra.span color="brand.500" fontSize="2xl">EXL</chakra.span>Marketing
              </Heading>
            </Flex>
            
            <HStack 
              spacing={8} 
              display={{ base: 'none', md: 'flex' }}
            >
              <Link href="#features">
                <Text color="whiteAlpha.900" fontWeight="medium" _hover={{ color: "primary.300" }}>Features</Text>
              </Link>
              <Link href="#documentation">
                <Text color="whiteAlpha.900" fontWeight="medium" _hover={{ color: "primary.300" }}>Documentation</Text>
              </Link>
              <Link href="#about">
                <Text color="whiteAlpha.900" fontWeight="medium" _hover={{ color: "primary.300" }}>About</Text>
              </Link>
            </HStack>
            
            <HStack spacing={4}>
              {session ? (
                <Button 
                  onClick={() => window.location.href = '/dashboard'}
                  size="sm" 
                  colorScheme="primary"
                  borderRadius="lg"
                >
                  Dashboard
                </Button>
              ) : (
                <>
                  <Button 
                    onClick={() => window.location.href = '/auth/signin?callbackUrl=/dashboard'}
                    variant="ghost" 
                    color="whiteAlpha.900" 
                    _hover={{ bg: 'whiteAlpha.200' }}
                    size="sm"
                    display={{ base: 'none', sm: 'inline-flex' }}
                  >
                    Sign In
                  </Button>
                  <Button 
                    onClick={() => window.location.href = '/auth/signin?callbackUrl=/dashboard'}
                    colorScheme="brand" 
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
        py={{ base: 12, md: 20 }} 
        position="relative"
        overflow="hidden"
        _before={{
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          bgGradient: "linear(to-br, primary.600, brand.500)",
          zIndex: -2,
        }}
      >
        {/* Container for content */}
        <Container maxW="container.xl" position="relative" zIndex="1">
          <Flex 
            direction={{ base: 'column', lg: 'row' }} 
            align="center" 
            gap={{ base: 8, lg: 6 }}
          >
            <Box 
              flex={1} 
              pr={{ base: 0, lg: 8 }}
              p={{ base: 6, md: 8 }}
              bg="rgba(49, 130, 206, 0.08)"
              backdropFilter="blur(8px)"
              borderRadius="xl"
              borderWidth="1px"
              borderColor="rgba(255, 255, 255, 0.1)"
              boxShadow="0 10px 30px rgba(0, 0, 0, 0.15)"
              transform="translateY(0)"
              transition="all 0.3s ease"
              position="relative"
              overflow="hidden"
              _hover={{
                transform: "translateY(-5px)",
                boxShadow: "0 15px 35px rgba(0, 0, 0, 0.2)",
              }}
            >
              <Box
                position="absolute"
                top="0"
                left="0"
                right="0"
                bottom="0"
                bgGradient="linear(to-br, blue.600, purple.700)"
                opacity="0.9"
                zIndex="-1"
              />
              <Text 
                color="blue.100" 
                mb={2} 
                fontWeight="semibold"
                fontSize="md"
                letterSpacing="wide"
                textTransform="uppercase"
              >
                Revolutionize Your Marketing Strategy
              </Text>
              <Heading 
                as="h1" 
                fontSize={{ base: "2xl", md: "3xl", lg: "4xl" }}
                lineHeight="1.2"
                mb={4} 
                color="white"
                fontWeight="bold"
                letterSpacing="tight"
              >
                Data-Driven Marketing Analytics Platform
              </Heading>
              <Text 
                fontSize={{ base: "md", md: "lg" }}
                mb={6} 
                color="whiteAlpha.900"
                lineHeight="tall"
              >
                Transform your marketing efforts with advanced analytics. Gain deep insights into campaign performance, customer behavior, and ROI optimization with our comprehensive analytics suite.
              </Text>
              
              <HStack spacing={4} flexWrap={{ base: "wrap", md: "nowrap" }}>
                {session ? (
                  <>
                    <Button 
                      onClick={() => window.location.href = '/dashboard'}
                      size="md" 
                      rightIcon={<FiArrowRight />} 
                      bg="white" 
                      color="blue.600" 
                      px={6} 
                      fontWeight="semibold"
                      _hover={{ 
                        bg: "whiteAlpha.900", 
                        transform: 'translateY(-2px)', 
                        boxShadow: 'md' 
                      }}
                      transition="all 0.2s ease"
                      boxShadow="sm"
                      borderRadius="md"
                    >
                      Go to Dashboard
                    </Button>
                    <Button 
                      onClick={() => signOut()} 
                      bg="rgba(229, 62, 62, 0.15)" 
                      color="red.200" 
                      _hover={{ 
                        bg: 'rgba(229, 62, 62, 0.25)',
                        transform: 'translateY(-2px)'
                      }} 
                      variant="solid" 
                      size="md"
                      px={6}
                    >
                      Sign Out
                    </Button>
                  </>
                ) : (
                  <>
                    <Button 
                      onClick={() => window.location.href = '/auth/signin?callbackUrl=/dashboard'}
                      size="md" 
                      rightIcon={<FiArrowRight />} 
                      bg="white" 
                      color="blue.600" 
                      px={6}
                      fontWeight="semibold"
                      _hover={{ 
                        bg: "whiteAlpha.900", 
                        transform: 'translateY(-2px)', 
                        boxShadow: 'md' 
                      }}
                      transition="all 0.2s ease"
                      boxShadow="sm"
                      borderRadius="md"
                    >
                      Get Started Free
                    </Button>
                    <Button 
                      onClick={() => window.location.href = '#features'}
                      variant="outline" 
                      size="md" 
                      px={6}
                      color="white" 
                      borderColor="whiteAlpha.400"
                      _hover={{ 
                        borderColor: 'whiteAlpha.600',
                        transform: 'translateY(-2px)'
                      }}
                      transition="all 0.2s ease"
                      borderRadius="md"
                    >
                      Learn More
                    </Button>
                  </>
                )}
              </HStack>
            </Box>

            <Box 
              flex={1} 
              display={{ base: 'none', lg: 'block' }}
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
                borderRadius="xl"
                position="relative"
                overflow="hidden"
                bgGradient="linear(to-br, blue.500, purple.600)"
                boxShadow="0 20px 40px rgba(0, 0, 0, 0.3)"
                borderWidth="1px"
                borderColor="rgba(255, 255, 255, 0.15)"
              >
                {/* Dashboard mockup */}
                <Box
                  position="absolute"
                  top="50%"
                  left="50%"
                  transform="translate(-50%, -50%)"
                  width="92%"
                  height="85%"
                  bg="rgba(255, 255, 255, 0.97)"
                  backdropFilter="blur(10px)"
                  borderRadius="lg"
                  p={4}
                  boxShadow="0 8px 32px rgba(0, 0, 0, 0.1)"
                  borderWidth="1px"
                  borderColor="rgba(255, 255, 255, 0.2)"
                >
                  <Flex direction="column" height="100%">
                    <HStack mb={3}>
                      <Box width="10px" height="10px" borderRadius="full" bg="red.400" />
                      <Box width="10px" height="10px" borderRadius="full" bg="yellow.400" />
                      <Box width="10px" height="10px" borderRadius="full" bg="green.400" />
                      <Heading size="xs" ml={2} color="gray.700">Marketing Analytics Dashboard</Heading>
                    </HStack>
                    
                    <Flex flex={1} wrap="wrap" gap={3}>
                      <Box flex="1" minW="120px" bg="blue.50" borderRadius="md" p={3} boxShadow="sm">
                        <Text color="blue.700" fontSize="xs" fontWeight="bold" mb={2}>Campaign Performance</Text>
                        <Box height="80px" bgGradient="linear(to-r, blue.100, blue.50)" borderRadius="md" />
                      </Box>
                      <Box flex="1" minW="120px" bg="purple.50" borderRadius="md" p={3} boxShadow="sm">
                        <Text color="purple.700" fontSize="xs" fontWeight="bold" mb={2}>Audience Insights</Text>
                        <Box height="80px" bgGradient="linear(to-r, purple.100, purple.50)" borderRadius="md" />
                      </Box>
                    </Flex>
                    
                    <Box mt={3} bg="gray.50" borderRadius="md" p={3} boxShadow="sm">
                      <Text color="gray.700" fontSize="xs" fontWeight="bold" mb={2}>Conversion Metrics</Text>
                      <Flex gap={2} mb={2}>
                        <Box height="20px" width="25%" bg="green.100" borderRadius="sm" />
                        <Box height="20px" width="35%" bg="blue.100" borderRadius="sm" />
                        <Box height="20px" width="15%" bg="purple.100" borderRadius="sm" />
                        <Box height="20px" width="25%" bg="orange.100" borderRadius="sm" />
                      </Flex>
                      <Stack spacing={2}>
                        <Box height="10px" width="100%" bg="gray.100" borderRadius="full" />
                        <Box height="10px" width="85%" bg="gray.100" borderRadius="full" />
                        <Box height="10px" width="65%" bg="gray.100" borderRadius="full" />
                      </Stack>
                    </Box>
                  </Flex>
                </Box>
              </Box>
            </Box>
          </Flex>
        </Container>
      </Box>

      {/* Features Section */}
      <Box py={20} id="features">
        <Container maxW="container.xl">
          <VStack spacing={4} mb={12} textAlign="center">
            <Heading as="h2" size="xl" mb={2}>
              Powerful Marketing Analytics Features
            </Heading>
            <Text color={textColor} fontSize="lg" maxW="container.md">
              Our comprehensive suite of tools helps marketers make data-driven decisions and optimize campaign performance
            </Text>
          </VStack>
          
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={10}>
            <FeatureCard 
              icon={FiPieChart} 
              title="Campaign Analytics" 
              description="Track and analyze campaign performance across all channels with detailed metrics and visualizations."
            />
            <FeatureCard 
              icon={FiUsers} 
              title="Audience Segmentation" 
              description="Identify and target specific audience segments based on behavior, demographics, and engagement."
            />
            <FeatureCard 
              icon={FiTarget} 
              title="Conversion Optimization" 
              description="Optimize your marketing funnel with insights on user journeys, bottlenecks, and conversion opportunities."
            />
            <FeatureCard 
              icon={FiTrendingUp} 
              title="ROI Analysis" 
              description="Measure and analyze the return on investment for all marketing activities and campaigns."
            />
            <FeatureCard 
              icon={FiGlobe} 
              title="Multichannel Tracking" 
              description="Monitor performance across digital, social, email, and traditional marketing channels in one place."
            />
            <FeatureCard 
              icon={FiLayers} 
              title="Custom Reporting" 
              description="Create personalized dashboards and reports tailored to your specific marketing objectives."
            />
          </SimpleGrid>
        </Container>
      </Box>

      {/* Documentation Section */}
      <Box py={20} id="documentation" bg={useColorModeValue('gray.50', 'gray.900')}>
        <Container maxW="container.xl">
          <VStack spacing={4} mb={12} textAlign="center">
            <Heading as="h2" size="xl" mb={2}>
              Comprehensive Documentation
            </Heading>
            <Text color={textColor} fontSize="lg" maxW="container.md">
              Everything you need to get the most out of MarketAnalytics
            </Text>
          </VStack>
          
          <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={8}>
            <Box
              p={6}
              bg={useColorModeValue('white', 'gray.800')}
              borderRadius="lg"
              boxShadow="md"
              transition="all 0.3s"
              _hover={{
                transform: 'translateY(-5px)',
                boxShadow: 'lg',
              }}
            >
              <Icon as={FiFileText} boxSize={10} color="blue.500" mb={4} />
              <Heading size="md" mb={3}>Getting Started Guides</Heading>
              <Text color="gray.600" mb={4}>Learn the basics and get up and running quickly with step-by-step tutorials.</Text>
              <Button size="sm" rightIcon={<FiArrowRight />} variant="link" colorScheme="blue">
                View Guides
              </Button>
            </Box>
            
            <Box
              p={6}
              bg={useColorModeValue('white', 'gray.800')}
              borderRadius="lg"
              boxShadow="md"
              transition="all 0.3s"
              _hover={{
                transform: 'translateY(-5px)',
                boxShadow: 'lg',
              }}
            >
              <Icon as={FiFileText} boxSize={10} color="purple.500" mb={4} />
              <Heading size="md" mb={3}>API Documentation</Heading>
              <Text color="gray.600" mb={4}>Integrate with our API to build custom solutions and connect with your marketing stack.</Text>
              <Button size="sm" rightIcon={<FiArrowRight />} variant="link" colorScheme="purple">
                Explore API
              </Button>
            </Box>
            
            <Box
              p={6}
              bg={useColorModeValue('white', 'gray.800')}
              borderRadius="lg"
              boxShadow="md"
              transition="all 0.3s"
              _hover={{
                transform: 'translateY(-5px)',
                boxShadow: 'lg',
              }}
            >
              <Icon as={FiHeadphones} boxSize={10} color="green.500" mb={4} />
              <Heading size="md" mb={3}>Knowledge Base</Heading>
              <Text color="gray.600" mb={4}>Find answers to common questions with our extensive knowledge base articles.</Text>
              <Button size="sm" rightIcon={<FiArrowRight />} variant="link" colorScheme="green">
                Browse Articles
              </Button>
            </Box>
            
            <Box
              p={6}
              bg={useColorModeValue('white', 'gray.800')}
              borderRadius="lg"
              boxShadow="md"
              transition="all 0.3s"
              _hover={{
                transform: 'translateY(-5px)',
                boxShadow: 'lg',
              }}
            >
              <Icon as={FiLayers} boxSize={10} color="orange.500" mb={4} />
              <Heading size="md" mb={3}>Video Tutorials</Heading>
              <Text color="gray.600" mb={4}>Watch step-by-step video guides for visual learners and advanced feature walkthroughs.</Text>
              <Button size="sm" rightIcon={<FiArrowRight />} variant="link" colorScheme="orange">
                Watch Videos
              </Button>
            </Box>
          </SimpleGrid>
        </Container>
      </Box>

      {/* About Section */}
      <Box py={20} id="about" bg="gray.50">
        <Container maxW="container.xl">
          <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={16} alignItems="center">
            <Box>
              <VStack align="flex-start" spacing={6}>
                <Heading as="h2" size="xl">
                  About MarketAnalytics
                </Heading>
                <Text color={textColor} fontSize="lg">
                  We're a team of marketers and data scientists dedicated to revolutionizing how businesses understand and optimize their marketing performance.
                </Text>
                <Text color={textColor}>
                  Founded in 2018, MarketAnalytics has helped over 10,000 businesses worldwide transform their marketing strategies with data-driven insights. Our platform combines powerful analytics with user-friendly dashboards to make marketing data accessible and actionable.
                </Text>
                <Text color={textColor}>
                  Our mission is to empower marketers of all sizes with enterprise-grade analytics that drive measurable results and maximize ROI across all marketing channels.
                </Text>
                <HStack spacing={4}>
                  <Button leftIcon={<FiUsers />} colorScheme="blue" variant="outline">
                    Our Team
                  </Button>
                  <Button leftIcon={<FiGlobe />} colorScheme="blue" variant="outline">
                    Our Values
                  </Button>
                </HStack>
              </VStack>
            </Box>
            
            <Box 
              borderRadius="xl" 
              overflow="hidden" 
              boxShadow="xl"
              position="relative"
              height="400px"
              bgGradient="linear(to-br, blue.400, purple.500)"
            >
              <Box 
                position="absolute"
                top="50%"
                left="50%"
                transform="translate(-50%, -50%)"
                textAlign="center"
                p={8}
                color="white"
                width="100%"
              >
                <Heading color="white" mb={4}>Our Stats</Heading>
                <SimpleGrid columns={2} spacing={8}>
                  <VStack>
                    <Heading size="2xl" color="white">10K+</Heading>
                    <Text color="whiteAlpha.800">Customers</Text>
                  </VStack>
                  <VStack>
                    <Heading size="2xl" color="white">50+</Heading>
                    <Text color="whiteAlpha.800">Countries</Text>
                  </VStack>
                  <VStack>
                    <Heading size="2xl" color="white">98%</Heading>
                    <Text color="whiteAlpha.800">Satisfaction</Text>
                  </VStack>
                  <VStack>
                    <Heading size="2xl" color="white">24/7</Heading>
                    <Text color="whiteAlpha.800">Support</Text>
                  </VStack>
                </SimpleGrid>
              </Box>
            </Box>
          </SimpleGrid>
        </Container>
      </Box>

      {/* Trusted By Section */}
      <Box py={16} bg="gray.50">
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

      {/* CTA Section */}
      <Box py={{ base: 16, md: 24 }} bg={useColorModeValue('gray.50', 'gray.800')}>
        <Container maxW="container.xl">
          <Flex 
            direction={{ base: 'column', md: 'row' }} 
            align="center" 
            justify="space-between" 
            bg={useColorModeValue('rgba(49, 130, 206, 0.08)', 'rgba(49, 130, 206, 0.15)')}
            p={{ base: 8, md: 10 }}
            borderRadius="xl" 
            boxShadow="lg"
            overflow="hidden"
            position="relative"
          >
            <Box
              position="absolute"
              top={0}
              left={0}
              right={0}
              bottom={0}
              bgGradient="linear(to-br, blue.600, purple.700)"
              opacity="0.9"
              zIndex={0}
            />
            <VStack 
              align={{ base: "center", md: "flex-start" }} 
              spacing={4} 
              maxW="600px" 
              mb={{ base: 6, md: 0 }}
              zIndex={1}
            >
              <Heading 
                as="h2" 
                fontSize={{ base: "xl", md: "2xl" }} 
                color="white"
                fontWeight="bold"
                lineHeight="shorter"
              >
                Ready to transform your marketing strategy?
              </Heading>
              <Text 
                fontSize={{ base: "md", md: "lg" }} 
                color="whiteAlpha.900"
                textAlign={{ base: "center", md: "left" }}
              >
                Start optimizing your campaigns with data-driven insights. No credit card required.
              </Text>
            </VStack>
            
            {session ? (
              <Button 
                onClick={() => window.location.href = '/dashboard'}
                size="md" 
                rightIcon={<FiArrowRight />} 
                colorScheme="blue" 
                px={8}
                py={6}
                zIndex={1}
                fontWeight="semibold"
                bg="white"
                color="blue.600"
                _hover={{ 
                  transform: 'translateY(-2px)', 
                  boxShadow: 'md',
                  bg: 'whiteAlpha.900'
                }}
                transition="all 0.2s ease"
                boxShadow="sm"
                borderRadius="md"
              >
                Open Dashboard
              </Button>
            ) : (
              <Button 
                onClick={() => window.location.href = '/auth/signin?callbackUrl=/dashboard'}
                size="md" 
                rightIcon={<FiArrowRight />} 
                px={8}
                py={6}
                zIndex={1}
                fontWeight="semibold"
                bg="white"
                color="blue.600"
                _hover={{ 
                  transform: 'translateY(-2px)', 
                  boxShadow: 'md',
                  bg: 'whiteAlpha.900'
                }}
                transition="all 0.2s ease"
                boxShadow="sm"
                borderRadius="md"
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