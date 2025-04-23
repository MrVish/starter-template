'use client';

import React, { ReactNode } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return <DashboardLayout>{children}</DashboardLayout>;
} 