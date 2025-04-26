/**
 * Chart Registry - A central place to register all chart components
 * This helps avoid naming conflicts when using dynamic imports and named exports
 */

import React from 'react';
import BarChart from './BarChart';
import PieChart from './PieChart';
import LineChart from './LineChart';
import AreaChart from './AreaChart';

// Export all chart components with consistent naming
export {
  BarChart,
  PieChart,
  LineChart,
  AreaChart
};

// Default export a mapping of chart types to components for dynamic usage
export default {
  BarChart,
  PieChart,
  LineChart,
  AreaChart
}; 