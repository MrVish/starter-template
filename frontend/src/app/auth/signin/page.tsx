'use client';

import React, { useEffect, useState } from 'react';
import { getProviders, signIn } from 'next-auth/react';
import { 
  Box, 
  Heading, 
  Button, 
  VStack, 
  HStack,
  Text,
  Spinner, 
  useColorModeValue,
  Container,
  Flex,
  Divider,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputLeftElement,
  Icon,
  useToast
} from '@chakra-ui/react';
import Link from 'next/link';
import { FiUser, FiLock, FiMail, FiArrowLeft } from 'react-icons/fi';
import { FaGoogle, FaMicrosoft } from 'react-icons/fa';
import Image from 'next/image';

export default function SignInPage() {
  const [providers, setProviders] = useState<Record<string, any> | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [debugResponse, setDebugResponse] = useState('');
  const toast = useToast();
  
  const bg = useColorModeValue('gray.50', 'gray.900');
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const primaryColor = useColorModeValue('blue.500', 'blue.300');
  
  // Text colors
  const primaryBgTextColor = 'white';
  const labelColor = useColorModeValue('gray.700', 'gray.300');
  const placeholderColor = useColorModeValue('gray.400', 'gray.500');

  useEffect(() => {
    getProviders().then((prov) => setProviders(prov));
  }, []);

  const handleCredentialsSignIn = (e) => {
    e.preventDefault();
    signIn('credentials', { 
      email, 
      password, 
      callbackUrl: '/dashboard'  // Redirect to dashboard on success
    });
  };

  const handleOAuthSignIn = (providerId) => {
    signIn(providerId, { callbackUrl: '/dashboard' });
  };
  
  // Debug function to test API connection directly
  const testDirectApiConnection = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/v1/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      
      const data = await response.json();
      setDebugResponse(JSON.stringify(data, null, 2));
      
      toast({
        title: response.ok ? 'API Connection Success' : 'API Connection Failed',
        description: response.ok ? 'Direct API call successful' : `Error: ${data.error || response.statusText}`,
        status: response.ok ? 'success' : 'error',
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      setDebugResponse(JSON.stringify(error, null, 2));
      toast({
        title: 'API Connection Failed',
        description: `Error: ${error.message}`,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  if (!providers) {
    return (
      <Box bg="gray.50" minH="100vh" display="flex" alignItems="center" justifyContent="center">
        <Spinner size="xl" color={primaryColor} />
      </Box>
    );
  }

  return (
    <Box bg="gray.50" minH="100vh">
      <Container maxW="container.xl" py={10} position="relative" zIndex={1}>
        <Button 
          onClick={() => window.location.href = '/'}
          leftIcon={<FiArrowLeft />} 
          variant="ghost" 
          mb={8} 
          color="white"
          _hover={{ bg: 'rgba(255, 255, 255, 0.1)' }}
          borderRadius="xl"
          fontWeight="medium"
        >
          Back to Home
        </Button>

        <Flex 
          direction={{ base: 'column', md: 'row' }} 
          borderRadius="2xl" 
          overflow="hidden" 
          boxShadow="md"
          bg="whiteAlpha.100"
          borderWidth="1px"
          borderColor="background.200"
          position="relative"
          transform="translateY(0)"
          transition="all 0.3s ease"
          _hover={{
            transform: "translateY(-5px)",
            boxShadow: "0 30px 60px rgba(0, 0, 0, 0.4)",
          }}
        >
          {/* Left side - Image/Branding */}
          <Box 
            w={{ base: '100%', md: '40%' }} 
            bg="secondary.500"
            color="white"
            p={10}
            display="flex"
            flexDirection="column"
            justifyContent="center"
            position="relative"
            overflow="hidden"
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

            <Heading 
              fontSize={{ base: "2xl", md: "3xl" }}
              mb={6} 
              color={primaryBgTextColor} 
              lineHeight="shorter"
              fontWeight="bold"
              letterSpacing="tight"
            >
              Welcome Back
            </Heading>
            <Text 
              fontSize={{ base: "md", md: "lg" }} 
              mb={8} 
              color={primaryBgTextColor}
              lineHeight="tall"
            >
              Sign in to access your dashboard and continue your work.
            </Text>
            <Box 
              position="relative" 
              height="300px" 
              display={{ base: 'none', md: 'block' }}
            >
              <Box
                position="absolute"
                top="0"
                left="0"
                right="0"
                bottom="0"
              >
              </Box>
            </Box>
          </Box>

          {/* Right side - Sign In Form */}
          <Box 
            w={{ base: '100%', md: '60%' }} 
            p={{ base: 8, md: 12 }}
            bg="gray.50"
            boxShadow="sm"
            borderRadius="lg"
          >
            <VStack spacing={8} align="flex-start" width="100%">
              <Heading 
                size="lg" 
                color="gray.800"
                fontWeight="bold"
                letterSpacing="tight"
              >
                Sign In
              </Heading>
              
              {/* Credentials Provider */}
              {providers.credentials && (
                <Box as="form" width="100%" onSubmit={handleCredentialsSignIn}>
                  <VStack spacing={5} align="flex-start" width="100%">
                    <FormControl>
                      <FormLabel color={labelColor} fontWeight="medium">Email</FormLabel>
                      <InputGroup size="lg">
                        <InputLeftElement pointerEvents="none">
                          <Icon as={FiMail} color="gray.400" />
                        </InputLeftElement>
                        <Input 
                          type="email" 
                          placeholder="you@example.com" 
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          borderColor={borderColor}
                          _focus={{ borderColor: primaryColor, boxShadow: `0 0 0 1px ${primaryColor}` }}
                          _placeholder={{ color: placeholderColor }}
                          borderRadius="lg"
                          fontSize="md"
                        />
                      </InputGroup>
                    </FormControl>
                    <FormControl>
                      <FormLabel color={labelColor} fontWeight="medium">Password</FormLabel>
                      <InputGroup size="lg">
                        <InputLeftElement pointerEvents="none">
                          <Icon as={FiLock} color="gray.400" />
                        </InputLeftElement>
                        <Input 
                          type="password" 
                          placeholder="Your password" 
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          borderColor={borderColor}
                          _focus={{ borderColor: primaryColor, boxShadow: `0 0 0 1px ${primaryColor}` }}
                          _placeholder={{ color: placeholderColor }}
                          borderRadius="lg"
                          fontSize="md"
                        />
                      </InputGroup>
                    </FormControl>
                    <Button 
                      colorScheme="primary" 
                      type="submit" 
                      width="100%"
                      size="lg"
                      mt={2}
                      py={7}
                      boxShadow="md"
                      _hover={{ transform: 'translateY(-3px)', boxShadow: 'lg' }}
                      transition="all 0.3s ease"
                      borderRadius="xl"
                      fontSize="md"
                      fontWeight="semibold"
                    >
                      Sign in with Credentials
                    </Button>
                  </VStack>
                </Box>
              )}

              {/* OAuth Providers */}
              {(providers.google || providers['azure-ad']) && (
                <>
                  <Divider my={6} borderColor={borderColor} />
                  <VStack spacing={4} width="100%">
                    {providers.google && (
                      <Button
                        leftIcon={<Icon as={FaGoogle} />}
                        onClick={() => handleOAuthSignIn('google')}
                        width="100%"
                        variant="outline"
                        size="lg"
                        borderColor="primary.500"
                        _hover={{ bg: 'background.200' }}
                        borderRadius="lg"
                      >
                        Sign in with Google
                      </Button>
                    )}
                    {providers['azure-ad'] && (
                      <Button
                        leftIcon={<Icon as={FaMicrosoft} />}
                        onClick={() => handleOAuthSignIn('azure-ad')}
                        width="100%"
                        variant="outline"
                        size="lg"
                        borderColor="primary.500"
                        _hover={{ bg: 'background.200' }}
                        borderRadius="lg"
                      >
                        Sign in with Microsoft
                      </Button>
                    )}
                  </VStack>
                </>
              )}

              {/* Debug button */}
              <Button 
                colorScheme="red" 
                onClick={testDirectApiConnection} 
                width="100%"
                size="md"
                mt={4}
                variant="outline"
              >
                Test Direct API Connection
              </Button>

              {/* Debug response display */}
              {debugResponse && (
                <Box 
                  mt={4} 
                  p={3} 
                  bg="gray.100" 
                  borderRadius="md" 
                  fontSize="sm" 
                  fontFamily="monospace"
                  overflowX="auto"
                  whiteSpace="pre"
                >
                  {debugResponse}
                </Box>
              )}

              <Text fontSize="sm" color="gray.500" mt={4}>
                Don't have an account? Contact your administrator.
              </Text>
            </VStack>
          </Box>
        </Flex>
      </Container>
    </Box>
  );
} 