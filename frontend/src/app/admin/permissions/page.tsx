'use client';

import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import {
  Box,
  Heading,
  Button,
  HStack,
  useToast,
} from '@chakra-ui/react';
import { DataTable, Column } from '../../../components/ui/DataTable';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface Permission {
  id: number;
  name: string;
  description: string;
  resource: string;
  action: string;
}

export default function AdminPermissionsPage() {
  const { data: session } = useSession();
  const token = (session as any)?.accessToken;
  const toast = useToast();
  const [data, setData] = useState<Permission[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchPermissions = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/v1/admin/permissions`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Failed to load permissions');
      const list: Permission[] = await res.json();
      setData(list);
    } catch (err: any) {
      toast({ title: 'Error', description: err.message, status: 'error', isClosable: true });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPermissions(); }, [token]);

  const handleAdd = async () => {
    const name = prompt('Permission name');
    if (!name) return;
    const description = prompt('Description') || '';
    const resource = prompt('Resource (e.g., user, model)') || '';
    const action = prompt('Action (e.g., create, read)') || '';
    try {
      const res = await fetch(`${API_URL}/api/v1/admin/permissions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ name, description, resource, action })
      });
      if (!res.ok) throw new Error('Failed to create permission');
      toast({ title: 'Permission created', status: 'success', isClosable: true });
      fetchPermissions();
    } catch (err: any) {
      toast({ title: 'Error', description: err.message, status: 'error', isClosable: true });
    }
  };

  const handleEdit = async (perm: Permission) => {
    const name = prompt('Permission name', perm.name);
    if (!name) return;
    const description = prompt('Description', perm.description) || '';
    const resource = prompt('Resource', perm.resource) || '';
    const action = prompt('Action', perm.action) || '';
    try {
      const res = await fetch(`${API_URL}/api/v1/admin/permissions/${perm.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ name, description, resource, action })
      });
      if (!res.ok) throw new Error('Failed to update permission');
      toast({ title: 'Permission updated', status: 'success', isClosable: true });
      fetchPermissions();
    } catch (err: any) {
      toast({ title: 'Error', description: err.message, status: 'error', isClosable: true });
    }
  };

  const handleDelete = async (id: number) => {
    if (!token || !confirm('Delete this permission?')) return;
    try {
      const res = await fetch(`${API_URL}/api/v1/admin/permissions/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Failed to delete permission');
      toast({ title: 'Permission deleted', status: 'success', isClosable: true });
      fetchPermissions();
    } catch (err: any) {
      toast({ title: 'Error', description: err.message, status: 'error', isClosable: true });
    }
  };

  const columns: Column<Permission>[] = [
    { header: 'ID', accessor: 'id', isNumeric: true },
    { header: 'Name', accessor: 'name' },
    { header: 'Description', accessor: 'description' },
    { header: 'Resource', accessor: 'resource' },
    { header: 'Action', accessor: 'action' },
    { header: 'Actions', accessor: (p) => (
        <HStack spacing={2}>
          <Button size='sm' onClick={() => handleEdit(p)}>Edit</Button>
          <Button size='sm' colorScheme='red' onClick={() => handleDelete(p.id)}>Delete</Button>
        </HStack>
      ), sortable: false }
  ];

  return (
    <Box p={6}>
      <Heading mb={4}>Permission Management</Heading>
      <Button mb={4} colorScheme='brand' onClick={handleAdd}>Add Permission</Button>
      <DataTable columns={columns} data={data} isLoading={loading} pagination searchable />
    </Box>
  );
} 