'use client';

import React, { useEffect, useState } from 'react';
import {
  Box,
  Heading,
  Button,
  HStack,
  useToast,
} from '@chakra-ui/react';
import { DataTable, Column } from '../../../components/ui/DataTable';
import { useSession } from 'next-auth/react';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface Role {
  id: number;
  name: string;
  description: string;
}

export default function AdminRolesPage() {
  const toast = useToast();
  const { data: session } = useSession();
  const token = (session as any)?.accessToken;
  const [data, setData] = useState<Role[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchRoles = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/v1/admin/roles`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Failed to load roles');
      const list: Role[] = await res.json();
      setData(list);
    } catch (err: any) {
      toast({ title: 'Error', description: err.message, status: 'error', isClosable: true });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { if (token) fetchRoles(); }, [token]);

  const handleAdd = async () => {
    const name = prompt('Role name');
    if (!name) return;
    const description = prompt('Description') || '';
    try {
      const res = await fetch(`${API_URL}/api/v1/admin/roles`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ name, description })
      });
      if (!res.ok) throw new Error('Failed to create role');
      toast({ title: 'Role created', status: 'success', isClosable: true });
      fetchRoles();
    } catch (err: any) {
      toast({ title: 'Error', description: err.message, status: 'error', isClosable: true });
    }
  };

  const handleEdit = async (role: Role) => {
    const name = prompt('Role name', role.name);
    if (!name) return;
    const description = prompt('Description', role.description) || '';
    try {
      const res = await fetch(`${API_URL}/api/v1/admin/roles/${role.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ name, description })
      });
      if (!res.ok) throw new Error('Failed to update role');
      toast({ title: 'Role updated', status: 'success', isClosable: true });
      fetchRoles();
    } catch (err: any) {
      toast({ title: 'Error', description: err.message, status: 'error', isClosable: true });
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this role?')) return;
    try {
      const res = await fetch(`${API_URL}/api/v1/admin/roles/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Failed to delete role');
      toast({ title: 'Role deleted', status: 'success', isClosable: true });
      fetchRoles();
    } catch (err: any) {
      toast({ title: 'Error', description: err.message, status: 'error', isClosable: true });
    }
  };

  const columns: Column<Role>[] = [
    { header: 'ID', accessor: 'id', isNumeric: true },
    { header: 'Name', accessor: 'name' },
    { header: 'Description', accessor: 'description' },
    { header: 'Actions', accessor: (r) => (
        <HStack spacing={2}>
          <Button size='sm' onClick={() => handleEdit(r)}>Edit</Button>
          <Button size='sm' colorScheme='red' onClick={() => handleDelete(r.id)}>Delete</Button>
        </HStack>
      ), sortable: false }
  ];

  return (
    <Box p={6}>
      <Heading mb={4}>Role Management</Heading>
      <Button mb={4} colorScheme='brand' onClick={handleAdd}>Add Role</Button>
      <DataTable columns={columns} data={data} isLoading={loading} pagination searchable />
    </Box>
  );
} 