import React from 'react';
import { Card, Typography } from 'antd';
import { 
  EyeOutlined, 
  CheckCircleOutlined, 
  DollarOutlined, 
  ClickOutlined,
  LineChartOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;

const getIcon = (iconName, color) => {
  const style = { fontSize: '32px', color };
  
  switch (iconName) {
    case 'eye':
      return <EyeOutlined style={style} />;
    case 'check-circle':
      return <CheckCircleOutlined style={style} />;
    case 'dollar':
      return <DollarOutlined style={style} />;
    case 'click':
      return <ClickOutlined style={style} />;
    default:
      return <LineChartOutlined style={style} />;
  }
};

const StatCard = ({ title, value, icon, color, subtitle }) => {
  return (
    <Card className="stat-card" bordered={false} style={{ borderRadius: '8px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <Text type="secondary" style={{ marginBottom: '8px', display: 'block' }}>
            {title}
          </Text>
          <Title level={3} style={{ margin: 0 }}>
            {value}
          </Title>
          {subtitle && (
            <Text type="secondary" style={{ fontSize: '12px' }}>
              {subtitle}
            </Text>
          )}
        </div>
        <div className="stat-icon">
          {getIcon(icon, color)}
        </div>
      </div>
    </Card>
  );
};

export default StatCard; 