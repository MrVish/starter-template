// This is a server component layout for /campaigns segment

import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';

export default function CampaignsSegmentLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardLayout>
      {children}
    </DashboardLayout>
  );
} 