import React from 'react';
import {
  AreaChart as RechartsAreaChart,
  Area,
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
 * Area Chart component for displaying cumulative values and trends over time
 * 
 * @param {string} title - Chart title
 * @param {Array} data - Array of data objects
 * @param {Array} areas - Array of area configs {key, name, color, fillOpacity}
 * @param {string} xAxisKey - Key for X-axis data
 * @param {string} xAxisLabel - Label for X-axis
 * @param {string} yAxisLabel - Label for Y-axis
 * @param {boolean} showGrid - Whether to show grid lines
 * @param {boolean} showLegend - Whether to display the legend
 * @param {boolean} stacked - Whether to stack areas
 * @param {boolean} curved - Whether to use curved lines
 * @param {object} referenceLine - Optional reference line {y, label, color}
 * @param {number} height - Height of the chart
 * @param {object} style - Additional styling for the card
 * @returns {JSX.Element} Area chart component
 */
export const AreaChart = ({
  title,
  data = [],
  areas = [],
  xAxisKey = 'date',
  xAxisLabel,
  yAxisLabel,
  showGrid = true,
  showLegend = true,
  stacked = false,
  curved = true,
  referenceLine = null,
  height = 300,
  style = {},
}) => {
  // Default colors if not provided in area config
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

  // Ensure we have area configurations
  const areaConfigs = areas.length > 0 
    ? areas 
    : Object.keys(data[0] || {})
        .filter(key => key !== xAxisKey)
        .map((key, index) => ({
          key,
          name: key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1'),
          color: DEFAULT_COLORS[index % DEFAULT_COLORS.length],
          fillOpacity: 0.6
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
        <RechartsAreaChart
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
          
          {areaConfigs.map((area, index) => (
            <Area
              key={`area-${index}`}
              type={curveType}
              dataKey={area.key}
              name={area.name}
              stroke={area.color}
              fill={area.color}
              fillOpacity={area.fillOpacity || 0.6}
              stackId={stacked ? "1" : null}
              activeDot={{ r: 6, strokeWidth: 1, fill: '#fff' }}
            />
          ))}
        </RechartsAreaChart>
      </ResponsiveContainer>
    </Card>
  );
};

// Default export for backward compatibility
export default AreaChart; 