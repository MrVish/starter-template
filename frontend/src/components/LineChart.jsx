import React from 'react';
import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import { Card, Typography } from 'antd';

const { Title } = Typography;

/**
 * Line Chart component for displaying time series and trend data
 * 
 * @param {string} title - Chart title
 * @param {Array} data - Array of data objects
 * @param {Array} lines - Array of line configs {key, name, color, strokeWidth}
 * @param {string} xAxisKey - Key for X-axis data
 * @param {string} xAxisLabel - Label for X-axis
 * @param {string} yAxisLabel - Label for Y-axis
 * @param {boolean} showGrid - Whether to show grid lines
 * @param {boolean} showLegend - Whether to display the legend
 * @param {boolean} showDots - Whether to show dots on data points
 * @param {boolean} curved - Whether to use curved lines
 * @param {object} referenceLine - Optional reference line {y, label, color}
 * @param {number} height - Height of the chart
 * @param {object} style - Additional styling for the card
 * @returns {JSX.Element} Line chart component
 */
export const LineChart = ({
  title,
  data = [],
  lines = [],
  xAxisKey = 'date',
  xAxisLabel,
  yAxisLabel,
  showGrid = true,
  showLegend = true,
  showDots = true,
  curved = false,
  referenceLine = null,
  height = 300,
  style = {},
}) => {
  // Default colors if not provided in lines config
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

  // Ensure we have line configurations
  const lineConfigs = lines.length > 0 
    ? lines 
    : Object.keys(data[0] || {})
        .filter(key => key !== xAxisKey)
        .map((key, index) => ({
          key,
          name: key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1'),
          color: DEFAULT_COLORS[index % DEFAULT_COLORS.length],
          strokeWidth: 2
        }));

  // Custom tooltip formatter
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div style={{
          backgroundColor: '#fff',
          padding: '10px',
          border: '1px solid #ccc',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        }}>
          <p style={{ 
            margin: 0, 
            fontWeight: 'bold',
            borderBottom: '1px solid #eee',
            paddingBottom: '5px',
            marginBottom: '5px'
          }}>
            {label}
          </p>
          {payload.map((entry, index) => {
            const value = typeof entry.value === 'number'
              ? entry.value.toLocaleString(undefined, {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 2
                })
              : entry.value;
              
            return (
              <p 
                key={`item-${index}`} 
                style={{
                  margin: '3px 0',
                  color: entry.color,
                  display: 'flex',
                  justifyContent: 'space-between'
                }}
              >
                <span style={{ marginRight: '12px' }}>{entry.name}:</span>
                <span style={{ fontWeight: 'bold' }}>{value}</span>
              </p>
            );
          })}
        </div>
      );
    }
    return null;
  };

  // Format for the curved line type
  const curveType = curved ? 'monotone' : 'linear';

  return (
    <Card style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.09)', ...style }}>
      {title && <Title level={4} style={{ marginBottom: 16 }}>{title}</Title>}
      
      <ResponsiveContainer width="100%" height={height}>
        <RechartsLineChart
          data={data}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          {showGrid && <CartesianGrid strokeDasharray="3 3" vertical={false} />}
          
          <XAxis 
            dataKey={xAxisKey}
            label={xAxisLabel ? {
              value: xAxisLabel,
              position: 'insideBottom',
              offset: -5
            } : null}
            tick={{ fontSize: 12 }}
          />
          
          <YAxis
            label={yAxisLabel ? {
              value: yAxisLabel,
              angle: -90,
              position: 'insideLeft',
              style: { textAnchor: 'middle' }
            } : null}
            tick={{ fontSize: 12 }}
          />
          
          <Tooltip content={<CustomTooltip />} />
          
          {showLegend && (
            <Legend 
              verticalAlign="top"
              align="right"
              wrapperStyle={{ paddingBottom: 10 }}
            />
          )}
          
          {referenceLine && (
            <ReferenceLine 
              y={referenceLine.y} 
              label={referenceLine.label} 
              stroke={referenceLine.color || '#ff7300'} 
              strokeDasharray="3 3" 
            />
          )}
          
          {lineConfigs.map((line, index) => (
            <Line
              key={`line-${index}`}
              type={curveType}
              dataKey={line.key}
              name={line.name}
              stroke={line.color}
              strokeWidth={line.strokeWidth || 2}
              dot={showDots ? {
                r: 4,
                strokeWidth: 1,
                fill: '#fff'
              } : false}
              activeDot={{ r: 6, fill: line.color }}
            />
          ))}
        </RechartsLineChart>
      </ResponsiveContainer>
    </Card>
  );
};

// Default export for backward compatibility
export default LineChart; 