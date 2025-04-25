// This is a server component layout for /dashboard segment

import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';

export default function DashboardSegmentLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardLayout>
      {children}
    </DashboardLayout>
  );
} 