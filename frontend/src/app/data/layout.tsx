'use client';

import React, { ReactNode } from 'react';
import AdminGuard from '../../components/Auth/AdminGuard';

interface DataLayoutProps {
  children: ReactNode;
}

export default function DataLayout({ children }: DataLayoutProps) {
  return <AdminGuard>{children}</AdminGuard>;
} 