'use client';

import React, { ReactNode, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Spinner, Center, Text } from '@chakra-ui/react';

interface AdminGuardProps {
  children: ReactNode;
}

export default function AdminGuard({ children }: AdminGuardProps) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') return;
    if (!session) {
      router.replace('/');
    }
  }, [session, status, router]);

  if (status === 'loading') {
    return (
      <Center height="100vh">
        <Spinner />
      </Center>
    );
  }

  if (!session) {
    return (
      <Center height="100vh">
        <Text>You do not have access to this page.</Text>
      </Center>
    );
  }

  return <>{children}</>;
} 