'use client';

import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import {
  Box,
  Heading,
  Button,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  Select,
  VStack,
  useDisclosure,
  HStack,
} from '@chakra-ui/react';
import { DataTable, Column } from '../../../components/ui/DataTable';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

interface User {
  id: number;
  username: string;
  email: string;
  roles: string[];
}

export default function AdminUsersPage() {
  const { data: session } = useSession();
  const token = (session as any)?.accessToken;
  const toast = useToast();
  const [data, setData] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [newUser, setNewUser] = useState({
    username: '',
    email: '',
    password: '',
    first_name: '',
    last_name: '',
    roles: ['user']
  });

  const fetchUsers = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/v1/admin/users`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Failed to load users');
      const list: User[] = await res.json();
      setData(list);
    } catch (err: any) {
      toast({ title: 'Error', description: err.message, status: 'error', duration: 3000, isClosable: true });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, [token]);

  const handleDelete = async (id: number) => {
    if (!token || !confirm('Delete this user?')) return;
    try {
      const res = await fetch(`${API_URL}/api/v1/admin/users/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Failed to delete');
      toast({ title: 'Deleted', status: 'success', duration: 2000 });
      fetchUsers();
    } catch (err: any) {
      toast({ title: 'Error', description: err.message, status: 'error', duration: 3000, isClosable: true });
    }
  };

  const handleCreateUser = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/v1/admin/users`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify(newUser)
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to create user');
      }
      
      await fetchUsers();
      toast({ title: 'User created', status: 'success', duration: 2000 });
      onClose();
      // Reset form
      setNewUser({
        username: '',
        email: '',
        password: '',
        first_name: '',
        last_name: '',
        roles: ['user']
      });
    } catch (err: any) {
      toast({ title: 'Error', description: err.message, status: 'error', duration: 3000, isClosable: true });
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

  const columns: Column<User>[] = [
    { header: 'ID', accessor: 'id', isNumeric: true },
    { header: 'Username', accessor: 'username' },
    { header: 'Email', accessor: 'email' },
    { header: 'Roles', accessor: (u) => u.roles.join(', ') },
    { header: 'Actions', accessor: (u) => (
        <Button size="sm" colorScheme="red" onClick={() => handleDelete(u.id)}>Delete</Button>
      ), sortable: false }
  ];

  return (
    <Box p={6}>
      <Heading mb={4}>User Management</Heading>
      <HStack mb={4} spacing={4}>
        <Button colorScheme="brand" onClick={fetchUsers}>Refresh</Button>
        <Button colorScheme="green" onClick={onOpen}>New User</Button>
      </HStack>
      <DataTable columns={columns} data={data} isLoading={loading} pagination searchable />

      {/* Create User Modal */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create New User</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <FormControl isRequired>
                <FormLabel>Username</FormLabel>
                <Input 
                  name="username" 
                  value={newUser.username} 
                  onChange={handleChange}
                />
              </FormControl>
              
              <FormControl isRequired>
                <FormLabel>Email</FormLabel>
                <Input 
                  name="email" 
                  type="email" 
                  value={newUser.email} 
                  onChange={handleChange}
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
              
              <HStack width="100%">
                <FormControl>
                  <FormLabel>First Name</FormLabel>
                  <Input 
                    name="first_name" 
                    value={newUser.first_name} 
                    onChange={handleChange}
                  />
                </FormControl>
                
                <FormControl>
                  <FormLabel>Last Name</FormLabel>
                  <Input 
                    name="last_name" 
                    value={newUser.last_name} 
                    onChange={handleChange}
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
            </VStack>
          </ModalBody>
          
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button 
              colorScheme="green" 
              onClick={handleCreateUser}
              isLoading={loading}
            >
              Create
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
} 