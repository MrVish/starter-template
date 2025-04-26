import React from 'react';
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LabelList
} from 'recharts';
import { Card, Typography } from 'antd';

const { Title } = Typography;

/**
 * Bar Chart component for comparing categorical data
 * 
 * @param {string} title - Chart title
 * @param {Array} data - Array of data objects
 * @param {Array} bars - Array of bar configs with key, name, and color
 * @param {string} xAxisKey - Key for category names on x-axis
 * @param {string} xAxisLabel - Label for x-axis
 * @param {string} yAxisLabel - Label for y-axis
 * @param {boolean} horizontal - Whether to display bars horizontally
 * @param {boolean} stacked - Whether to stack bars
 * @param {boolean} showValues - Whether to show values on bars
 * @param {boolean} showGrid - Whether to show grid lines
 * @param {number} height - Height of the chart
 * @param {object} style - Additional styling for the card
 * @returns {JSX.Element} Bar chart component
 */
export const BarChart = ({
  title,
  data = [],
  bars = [],
  xAxisKey = 'name',
  xAxisLabel,
  yAxisLabel,
  horizontal = false,
  stacked = false,
  showValues = false,
  showGrid = true,
  height = 300,
  style = {}
}) => {
  // Default colors for bars
  const DEFAULT_COLORS = [
    '#1890ff', // blue
    '#52c41a', // green
    '#f5222d', // red
    '#722ed1', // purple
    '#faad14', // yellow
    '#13c2c2', // cyan
    '#eb2f96', // pink
    '#fa8c16', // orange
  ];

  // Auto-generate bars if not provided based on data keys
  const determineBars = () => {
    if (bars && bars.length > 0) return bars;

    // If no bars provided, create them from data keys (excluding xAxisKey)
    if (data.length > 0) {
      const firstItem = data[0];
      return Object.keys(firstItem)
        .filter(key => key !== xAxisKey)
        .map((key, index) => ({
          key,
          name: key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1'),
          color: DEFAULT_COLORS[index % DEFAULT_COLORS.length]
        }));
    }
    return [];
  };

  const chartBars = determineBars();

  // Custom tooltip formatter
  const customTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div style={{ 
          backgroundColor: '#fff', 
          padding: '10px', 
          border: '1px solid #ccc',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          fontSize: '12px'
        }}>
          <p style={{ margin: 0, fontWeight: 'bold' }}>{`${label}`}</p>
          {payload.map((entry, index) => (
            <p key={`item-${index}`} style={{ 
              margin: '3px 0',
              color: entry.color 
            }}>
              {`${entry.name}: ${typeof entry.value === 'number' 
                ? entry.value.toLocaleString() 
                : entry.value}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  // Format values for display on bars
  const formatValue = (value) => {
    if (typeof value === 'number') {
      if (value >= 1000000) {
        return `${(value / 1000000).toFixed(1)}M`;
      } else if (value >= 1000) {
        return `${(value / 1000).toFixed(1)}K`;
      }
      return value.toLocaleString();
    }
    return value;
  };

  // Layout setup based on orientation
  const layout = horizontal ? {
    layout: "vertical",
    xAxis: <YAxis type="number" label={yAxisLabel ? { value: yAxisLabel, position: 'insideLeft', angle: -90 } : null} />,
    yAxis: <XAxis type="category" dataKey={xAxisKey} label={xAxisLabel ? { value: xAxisLabel, position: 'insideBottom', offset: -5 } : null} />,
  } : {
    layout: "horizontal",
    xAxis: <XAxis dataKey={xAxisKey} label={xAxisLabel ? { value: xAxisLabel, position: 'insideBottom', offset: -10 } : null} />,
    yAxis: <YAxis label={yAxisLabel ? { value: yAxisLabel, angle: -90, position: 'insideLeft', style: { textAnchor: 'middle' } } : null} />,
  };

  return (
    <Card style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.09)', ...style }}>
      {title && <Title level={4} style={{ marginBottom: 16 }}>{title}</Title>}
      
      <ResponsiveContainer width="100%" height={height}>
        <RechartsBarChart
          data={data}
          layout={layout.layout}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 25
          }}
        >
          {showGrid && <CartesianGrid strokeDasharray="3 3" />}
          
          {layout.xAxis}
          {layout.yAxis}
          
          <Tooltip content={customTooltip} />
          <Legend />
          
          {chartBars.map((bar, index) => (
            <Bar
              key={bar.key}
              dataKey={bar.key}
              name={bar.name || bar.key}
              fill={bar.color || DEFAULT_COLORS[index % DEFAULT_COLORS.length]}
              stackId={stacked ? "stack" : null}
            >
              {showValues && (
                <LabelList 
                  dataKey={bar.key} 
                  position={stacked ? "inside" : "top"} 
                  fill={stacked ? "#fff" : "#666"} 
                  formatter={formatValue}
                  style={{ fontSize: '11px' }}
                />
              )}
            </Bar>
          ))}
        </RechartsBarChart>
      </ResponsiveContainer>
    </Card>
  );
};

// Default export for backward compatibility
export default BarChart; 