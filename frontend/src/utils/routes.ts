import { FiHome, FiBarChart2, FiSend, FiSettings, FiUsers, FiTarget, FiPieChart, FiTrello, FiShare2, FiDatabase, FiShield } from 'react-icons/fi';

// Define route types
interface RouteItem {
  icon: any;
  label: string;
  href: string;
  children?: RouteItem[];
}

// Main navigation routes
export const mainRoutes: RouteItem[] = [
  { icon: FiHome, label: 'Dashboard', href: '/dashboard' },
  {
    icon: FiBarChart2,
    label: 'Strategy Management',
    href: '/strategy',
    children: [
      { icon: FiBarChart2, label: 'Strategy Insights', href: '/strategy/insights' },
      { icon: FiUsers, label: 'Customer Segments', href: '/strategy/segments' },
      { icon: FiTarget, label: 'Contact Strategy', href: '/strategy/contact' },
      { icon: FiTarget, label: 'Strategy Planning', href: '/strategy/planning' },
    ],
  },
  {
    icon: FiSend,
    label: 'Campaigns',
    href: '/campaigns',
    children: [
      { icon: FiBarChart2, label: 'Campaign Insights', href: '/campaigns/insights' },
      { icon: FiTarget, label: 'Build Campaigns', href: '/campaigns/build' },
      { icon: FiTarget, label: 'View/Edit Campaigns', href: '/campaigns/view' },
      { icon: FiTarget, label: 'AI Driven Plans', href: '/campaigns/ai-plans' },
    ],
  },
  {
    icon: FiPieChart,
    label: 'Analytics',
    href: '/analytics',
    children: [
      { icon: FiBarChart2, label: 'Marketing Dashboard', href: '/analytics' },
      { icon: FiTrello, label: 'Campaign Performance', href: '/analytics/campaigns' },
      { icon: FiUsers, label: 'Segment Analysis', href: '/analytics/segments' },
      { icon: FiShare2, label: 'Channel Effectiveness', href: '/analytics/channels' },
    ],
  },
  {
    icon: FiDatabase,
    label: 'Data Explorer',
    href: '/data',
    children: [
      { icon: FiDatabase, label: 'Connect Data', href: '/data/connect' },
      { icon: FiBarChart2, label: 'Data Lineage', href: '/data/lineage' },
      { icon: FiTarget, label: 'Capabilities', href: '/data/capabilities' },
    ],
  },
  {
    icon: FiShield,
    label: 'Administration',
    href: '/admin',
    children: [
      { icon: FiUsers, label: 'Users', href: '/admin/users' },
      { icon: FiBarChart2, label: 'Roles', href: '/admin/roles' },
      { icon: FiShield, label: 'Permissions', href: '/admin/permissions' },
    ],
  },
  { icon: FiSettings, label: 'Settings', href: '/settings' },
];

// Helper function to find a route by its href
export const findRouteByHref = (href: string): RouteItem | null => {
  for (const route of mainRoutes) {
    if (route.href === href) return route;
    
    if (route.children) {
      for (const child of route.children) {
        if (child.href === href) return child;
      }
    }
  }
  
  return null;
};

// Helper function to get breadcrumbs for a route
export const getBreadcrumbsForRoute = (href: string): { text: string; href?: string }[] => {
  const breadcrumbs = [];
  
  // Split path and build breadcrumbs
  const parts = href.split('/').filter(p => p);
  let path = '';
  
  for (let i = 0; i < parts.length; i++) {
    path += '/' + parts[i];
    const route = findRouteByHref(path);
    
    if (route) {
      breadcrumbs.push({
        text: route.label,
        href: i < parts.length - 1 ? path : undefined
      });
    }
  }
  
  return breadcrumbs;
};

// Helper to determine if a route should be accessible
export const isRouteAccessible = (href: string, userRole: string): boolean => {
  // Admin only routes
  const adminOnlyRoutes = ['/admin', '/data'];
  
  // Check if the route starts with any admin-only path
  if (adminOnlyRoutes.some(route => href.startsWith(route))) {
    return userRole === 'admin';
  }
  
  return true;
}; 