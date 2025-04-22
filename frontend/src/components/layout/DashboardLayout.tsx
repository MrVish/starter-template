'use client';

import React, { ReactNode } from 'react';
import { Box, Flex, useDisclosure } from '@chakra-ui/react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { data: session, status } = useSession();
  const router = useRouter();
  
  // Check if user is authenticated
  if (status === 'loading') {
    return (
      <Box p={8} textAlign="center">
        Loading...
      </Box>
    );
  }
  
  if (status === 'unauthenticated') {
    router.push('/');
    return null;
  }
  
  return (
    <Box minH="100vh" bg="background.500">
      <Sidebar isOpen={isOpen} onClose={onClose} />
      <Box ml={{ base: 0, md: 60 }}>
        <Navbar onOpenSidebar={onOpen} />
        <Box as="main" p={4} pb={8}>
          <Flex
            direction="column"
            maxW="7xl"
            mx="auto"
            pt="20"
          >
            {children}
          </Flex>
        </Box>
      </Box>
    </Box>
  );
} 