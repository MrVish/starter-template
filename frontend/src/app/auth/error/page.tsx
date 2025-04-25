'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { 
  Box, 
  Heading, 
  Text, 
  Button, 
  Container, 
  Alert, 
  AlertIcon, 
  AlertTitle, 
  AlertDescription,
  useColorModeValue,
} from '@chakra-ui/react';
import Link from 'next/link';
import { FiArrowLeft } from 'react-icons/fi';

const errorMessages = {
  CredentialsSignin: 'Invalid email or password. Please try again.',
  OAuthAccountNotLinked: 'Email already exists with a different provider.',
  OAuthSignin: 'Error signing in with OAuth provider.',
  OAuthCallback: 'Error during OAuth callback.',
  EmailSignin: 'Error sending the email verification link.',
  default: 'An error occurred during authentication.'
};

export default function AuthError() {
  const searchParams = useSearchParams();
  const [errorType, setErrorType] = useState<string>('default');
  
  const bg = useColorModeValue('gray.50', 'gray.900');
  const cardBg = useColorModeValue('white', 'gray.800');

  useEffect(() => {
    const error = searchParams.get('error');
    if (error && error in errorMessages) {
      setErrorType(error);
    }
  }, [searchParams]);

  return (
    <Box bg="gray.50" minH="100vh" py={10} px={4}>
      <Container maxW="container.sm">
        <Box
          bg={cardBg}
          borderRadius="xl"
          p={8}
          boxShadow="lg"
          textAlign="center"
        >
          <Alert 
            status="error" 
            variant="solid"
            borderRadius="md"
            mb={6}
          >
            <AlertIcon />
            <AlertTitle mr={2}>Authentication Error</AlertTitle>
          </Alert>
          
          <Heading size="lg" mb={4}>Sign In Failed</Heading>
          
          <Text fontSize="md" mb={6}>
            {errorMessages[errorType as keyof typeof errorMessages]}
          </Text>
          
          <Box mt={8}>
            <Link href="/auth/signin" passHref>
              <Button as="a" leftIcon={<FiArrowLeft />} colorScheme="blue">
                Back to Sign In
              </Button>
            </Link>
          </Box>
        </Box>
      </Container>
    </Box>
  );
} 