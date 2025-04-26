// This is a server component layout for /analytics segment

import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';

export default function AnalyticsSegmentLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardLayout>
      {children}
    </DashboardLayout>
  );
} 