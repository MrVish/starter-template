import React from 'react';
import {
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Label,
} from 'recharts';
import { Card, Typography } from 'antd';

const { Title } = Typography;

/**
 * Pie Chart component for displaying part-to-whole relationships
 * 
 * @param {string} title - Chart title
 * @param {Array} data - Array of data objects with name and value properties
 * @param {string} nameKey - Key for segment names
 * @param {string} valueKey - Key for segment values
 * @param {Array} colors - Array of colors for segments
 * @param {boolean} donut - Whether to display as a donut chart
 * @param {string} centerLabel - Text to display in center (donut charts only)
 * @param {boolean} showPercentage - Whether to show percentage in legend
 * @param {boolean} showLegend - Whether to show the legend
 * @param {number} height - Height of the chart
 * @param {object} style - Additional styling for the card
 * @returns {JSX.Element} Pie chart component
 */
export const PieChart = ({
  title,
  data = [],
  nameKey = 'name',
  valueKey = 'value',
  colors = [],
  donut = false,
  centerLabel = '',
  showPercentage = true,
  showLegend = true,
  height = 300,
  style = {},
}) => {
  // Default colors if not provided
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

  // Use provided colors or default colors
  const pieColors = colors.length > 0 ? colors : DEFAULT_COLORS;
  
  // Calculate the total value for percentage calculations
  const total = data.reduce((sum, item) => sum + (item[valueKey] || 0), 0);

  // Custom legend renderer to show percentages
  const renderLegendContent = (props) => {
    const { payload } = props;
    
    return (
      <ul style={{ padding: 0, listStyle: 'none' }}>
        {payload.map((entry, index) => {
          const percentage = ((entry.value / total) * 100).toFixed(1);
          const formattedValue = typeof entry.value === 'number' 
            ? entry.value.toLocaleString() 
            : entry.value;
          
          return (
            <li 
              key={`legend-item-${index}`}
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                marginBottom: 4 
              }}
            >
              <div 
                style={{
                  width: 10,
                  height: 10,
                  backgroundColor: entry.color,
                  marginRight: 8,
                  borderRadius: '50%'
                }}
              />
              <span>
                {entry.name}
                {showPercentage && (
                  <span style={{ marginLeft: 4, color: '#666' }}>
                    ({percentage}% - {formattedValue})
                  </span>
                )}
              </span>
            </li>
          );
        })}
      </ul>
    );
  };

  // Custom tooltip formatter
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      const percentage = ((data.value / total) * 100).toFixed(1);
      const formattedValue = typeof data.value === 'number' 
        ? data.value.toLocaleString() 
        : data.value;
      
      return (
        <div style={{ 
          backgroundColor: '#fff', 
          padding: '10px', 
          border: '1px solid #ccc',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          fontSize: '12px'
        }}>
          <p style={{ margin: 0, fontWeight: 'bold', color: data.color }}>
            {data.name}
          </p>
          <p style={{ margin: '5px 0 0' }}>
            Value: {formattedValue}
          </p>
          <p style={{ margin: '3px 0 0' }}>
            Percentage: {percentage}%
          </p>
        </div>
      );
    }
    return null;
  };

  // Calculate inner and outer radius based on donut setting
  const outerRadius = Math.min(height / 2, 120);
  const innerRadius = donut ? outerRadius * 0.6 : 0;

  return (
    <Card style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.09)', ...style }}>
      {title && <Title level={4} style={{ marginBottom: 16 }}>{title}</Title>}
      
      <ResponsiveContainer width="100%" height={height}>
        <RechartsPieChart>
          <Pie
            data={data}
            dataKey={valueKey}
            nameKey={nameKey}
            cx="50%"
            cy="50%"
            innerRadius={innerRadius}
            outerRadius={outerRadius}
            paddingAngle={1}
            label={false}
          >
            {data.map((entry, index) => (
              <Cell 
                key={`cell-${index}`}
                fill={pieColors[index % pieColors.length]}
              />
            ))}
            
            {donut && centerLabel && (
              <Label
                content={(props) => (
                  <text
                    x={props.viewBox.cx}
                    y={props.viewBox.cy}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    style={{ fontSize: '14px', fontWeight: 'bold' }}
                  >
                    {centerLabel}
                  </text>
                )}
                position="center"
              />
            )}
          </Pie>
          
          <Tooltip content={<CustomTooltip />} />
          
          {showLegend && (
            <Legend 
              content={renderLegendContent} 
              layout="vertical" 
              verticalAlign="middle" 
              align="right"
              wrapperStyle={{ paddingLeft: 20 }}
            />
          )}
        </RechartsPieChart>
      </ResponsiveContainer>
    </Card>
  );
};

// Default export for backward compatibility
export default PieChart; 