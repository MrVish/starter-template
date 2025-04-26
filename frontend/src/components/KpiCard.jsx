import React from 'react';
import { Card, Typography, Tooltip, Space } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined, InfoCircleOutlined } from '@ant-design/icons';
import ProgressBar from './ProgressBar';

const { Title, Text } = Typography;

/**
 * KPI Card component for displaying metric with comparison
 * 
 * @param {string} title - Title of the KPI
 * @param {string|number} value - Current value of the KPI
 * @param {string} unit - Unit of measurement (optional)
 * @param {number} change - Percentage change from previous period
 * @param {boolean} positiveIsGood - Whether positive change is good (green) or bad (red)
 * @param {string} description - Additional description for the KPI
 * @param {number} progress - Progress percentage (0-100)
 * @param {number} target - Target percentage (0-100)
 * @param {React.ReactNode} icon - Icon to display
 * @param {string} color - Color theme for the card
 * @param {object} style - Additional inline styles
 * @returns {JSX.Element} Card component
 */
const KpiCard = ({
  title,
  value,
  unit = '',
  change,
  positiveIsGood = true,
  description,
  progress,
  target,
  icon,
  color = '#1890ff',
  style = {},
}) => {
  // Determine if change is positive, negative or neutral
  const isPositive = change > 0;
  const isNeutral = change === 0;
  
  // Determine if the change is good or bad (for color)
  const isGood = (isPositive && positiveIsGood) || (!isPositive && !positiveIsGood);
  
  // Set colors based on change direction and whether positive is good
  const changeColor = isNeutral ? '#8c8c8c' : (isGood ? '#52c41a' : '#f5222d');
  
  return (
    <Card 
      style={{ 
        borderTop: `2px solid ${color}`,
        boxShadow: '0 2px 8px rgba(0,0,0,0.09)',
        ...style 
      }}
      bodyStyle={{ padding: 20 }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <Space align="center" size={4}>
            <Text type="secondary">{title}</Text>
            {description && (
              <Tooltip title={description}>
                <InfoCircleOutlined style={{ color: '#8c8c8c', fontSize: '14px' }} />
              </Tooltip>
            )}
          </Space>
          <div style={{ display: 'flex', alignItems: 'baseline', marginTop: 4, marginBottom: 4 }}>
            <Title level={3} style={{ margin: 0, marginRight: 8 }}>
              {value}{unit && <Text style={{ fontSize: '0.6em', marginLeft: 4 }}>{unit}</Text>}
            </Title>
            
            {change !== undefined && (
              <Text style={{ color: changeColor, fontWeight: 'bold', fontSize: '14px' }}>
                {isPositive ? <ArrowUpOutlined /> : (isNeutral ? '' : <ArrowDownOutlined />)}
                {Math.abs(change).toFixed(1)}%
              </Text>
            )}
          </div>
        </div>
        
        {icon && (
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            backgroundColor: `${color}20`,
            color: color,
            width: 40,
            height: 40,
            borderRadius: '50%',
            fontSize: 20
          }}>
            {icon}
          </div>
        )}
      </div>
      
      {progress !== undefined && (
        <div style={{ marginTop: 12 }}>
          <ProgressBar 
            percent={progress} 
            target={target} 
            color={color}
            size="small"
            showInfo={false}
          />
        </div>
      )}
    </Card>
  );
};

export default KpiCard; 