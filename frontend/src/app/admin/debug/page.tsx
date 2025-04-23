'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import {
  Box, 
  Heading, 
  Text, 
  Button, 
  VStack, 
  HStack,
  Code,
  useToast,
  Textarea,
  FormControl,
  FormLabel,
  Input,
  Select,
} from '@chakra-ui/react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export default function DebugPage() {
  const { data: session } = useSession();
  const token = (session as any)?.accessToken;
  const toast = useToast();
  const [debugResult, setDebugResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [newUser, setNewUser] = useState({
    username: '',
    email: '',
    password: '',
    first_name: '',
    last_name: '',
    roles: ['user']
  });

  const fetchTokenDebug = async () => {
    if (!token) {
      toast({ 
        title: 'No token available', 
        description: 'You must be logged in to debug tokens', 
        status: 'warning', 
        duration: 3000 
      });
      return;
    }

    setLoading(true);
    try {
      // First try the admin endpoint
      let res = await fetch(`${API_URL}/api/v1/admin/debug-token`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // If admin endpoint fails, try the health endpoint
      if (!res.ok) {
        console.log('Admin debug endpoint failed, trying health endpoint...');
        res = await fetch(`${API_URL}/api/v1/health/debug-token`, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
      
      if (!res.ok) {
        throw new Error(`Failed to debug token: ${res.status} ${res.statusText}`);
      }
      
      const data = await res.json();
      setDebugResult(data);
    } catch (err: any) {
      toast({ 
        title: 'Error', 
        description: err.message, 
        status: 'error', 
        duration: 3000 
      });
    } finally {
      setLoading(false);
    }
  };

  const createUser = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/v1/admin/users`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: token ? `Bearer ${token}` : '' 
        },
        body: JSON.stringify(newUser)
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to create user');
      }
      
      const data = await res.json();
      toast({ 
        title: 'User Created', 
        description: `User ${data.username} created successfully`, 
        status: 'success', 
        duration: 3000 
      });
      
      // Clear form
      setNewUser({
        username: '',
        email: '',
        password: '',
        first_name: '',
        last_name: '',
        roles: ['user']
      });
    } catch (err: any) {
      toast({ 
        title: 'Error', 
        description: err.message, 
        status: 'error', 
        duration: 3000 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === 'roles') {
      setNewUser({ ...newUser, roles: [value] });
    } else {
      setNewUser({ ...newUser, [name]: value });
    }
  };

  return (
    <Box p={6}>
      <Heading mb={4}>Debug Tools</Heading>
      
      <VStack spacing={6} align="stretch">
        <Box p={5} shadow="md" borderWidth="1px" borderRadius="lg">
          <Heading size="md" mb={4}>JWT Token Debug</Heading>
          <Text mb={4}>Current session token: {token ? `${token.substring(0, 20)}...` : 'No token'}</Text>
          <Button 
            colorScheme="blue" 
            onClick={fetchTokenDebug} 
            isLoading={loading}
            isDisabled={!token}
            mr={3}
          >
            Debug Token
          </Button>
          
          <Button 
            as="a"
            href={`${API_URL}/api/v1/admin/debug-token`}
            target="_blank"
            colorScheme="purple" 
            onClick={() => {}}
            mr={3}
          >
            Open Admin Debug Endpoint
          </Button>
          
          <Button 
            as="a"
            href={`${API_URL}/api/v1/health/debug-token`}
            target="_blank"
            colorScheme="teal" 
            onClick={() => {}}
          >
            Open Health Debug Endpoint
          </Button>
          
          {debugResult && (
            <Box mt={4} p={3} bg="gray.50" borderRadius="md">
              <Heading size="sm" mb={2}>Debug Results:</Heading>
              <Code display="block" whiteSpace="pre" overflow="auto" p={2}>
                {JSON.stringify(debugResult, null, 2)}
              </Code>
            </Box>
          )}
        </Box>
        
        <Box p={5} shadow="md" borderWidth="1px" borderRadius="lg">
          <Heading size="md" mb={4}>Create New User</Heading>
          
          <VStack spacing={4} align="stretch">
            <FormControl isRequired>
              <FormLabel>Username</FormLabel>
              <Input 
                name="username" 
                value={newUser.username} 
                onChange={handleChange} 
                placeholder="johndoe"
              />
            </FormControl>
            
            <FormControl isRequired>
              <FormLabel>Email</FormLabel>
              <Input 
                name="email" 
                type="email" 
                value={newUser.email} 
                onChange={handleChange} 
                placeholder="john@example.com"
              />
            </FormControl>
            
            <FormControl isRequired>
              <FormLabel>Password</FormLabel>
              <Input 
                name="password" 
                type="password" 
                value={newUser.password} 
                onChange={handleChange} 
              />
            </FormControl>
            
            <HStack>
              <FormControl>
                <FormLabel>First Name</FormLabel>
                <Input 
                  name="first_name" 
                  value={newUser.first_name} 
                  onChange={handleChange} 
                  placeholder="John"
                />
              </FormControl>
              
              <FormControl>
                <FormLabel>Last Name</FormLabel>
                <Input 
                  name="last_name" 
                  value={newUser.last_name} 
                  onChange={handleChange} 
                  placeholder="Doe"
                />
              </FormControl>
            </HStack>
            
            <FormControl>
              <FormLabel>Role</FormLabel>
              <Select 
                name="roles" 
                value={newUser.roles[0]} 
                onChange={handleChange}
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
                <option value="editor">Editor</option>
              </Select>
            </FormControl>
            
            <Button 
              colorScheme="green" 
              onClick={createUser} 
              isLoading={loading}
              mt={2}
            >
              Create User
            </Button>
          </VStack>
        </Box>
      </VStack>
    </Box>
  );
} 