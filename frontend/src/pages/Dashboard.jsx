import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Statistic, Spin, Typography } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined, DollarOutlined, UserOutlined, RocketOutlined } from '@ant-design/icons';
import { BarChart, PieChart, LineChart, AreaChart } from '../components/charts';

const { Title } = Typography;

// Sample data - In a real app, this would come from an API
const sampleData = {
  campaignPerformance: [
    { date: '2023-01-01', clicks: 120, impressions: 1400, conversions: 14 },
    { date: '2023-01-02', clicks: 132, impressions: 1650, conversions: 16 },
    { date: '2023-01-03', clicks: 101, impressions: 1200, conversions: 12 },
    { date: '2023-01-04', clicks: 134, impressions: 1800, conversions: 17 },
    { date: '2023-01-05', clicks: 190, impressions: 2100, conversions: 21 },
    { date: '2023-01-06', clicks: 210, impressions: 2400, conversions: 24 },
    { date: '2023-01-07', clicks: 220, impressions: 2500, conversions: 25 },
  ],
  channelBreakdown: [
    { name: 'Email', value: 4200 },
    { name: 'Social Media', value: 3800 },
    { name: 'Search', value: 2900 },
    { name: 'Display', value: 1800 },
    { name: 'Direct', value: 1200 },
  ],
  segmentPerformance: [
    { segment: 'High Value', conversionRate: 8.2, clickRate: 5.7, revenuePerUser: 85.4 },
    { segment: 'Frequent', conversionRate: 6.1, clickRate: 4.2, revenuePerUser: 52.6 },
    { segment: 'New', conversionRate: 3.7, clickRate: 3.5, revenuePerUser: 31.2 },
    { segment: 'At Risk', conversionRate: 2.8, clickRate: 2.1, revenuePerUser: 22.5 },
  ],
  monthlyTrends: [
    { month: 'Jan', revenue: 42000, cost: 18000, profit: 24000 },
    { month: 'Feb', revenue: 38000, cost: 17000, profit: 21000 },
    { month: 'Mar', revenue: 45000, cost: 19000, profit: 26000 },
    { month: 'Apr', revenue: 51000, cost: 21000, profit: 30000 },
    { month: 'May', revenue: 55000, cost: 22000, profit: 33000 },
    { month: 'Jun', revenue: 59000, cost: 24000, profit: 35000 },
  ],
  dailyTraffic: [
    { date: '2023-06-01', visitors: 1200, newUsers: 540 },
    { date: '2023-06-02', visitors: 1300, newUsers: 620 },
    { date: '2023-06-03', visitors: 1150, newUsers: 510 },
    { date: '2023-06-04', visitors: 980, newUsers: 410 },
    { date: '2023-06-05', visitors: 1400, newUsers: 680 },
    { date: '2023-06-06', visitors: 1650, newUsers: 720 },
    { date: '2023-06-07', visitors: 1720, newUsers: 760 },
    { date: '2023-06-08', visitors: 1600, newUsers: 650 },
    { date: '2023-06-09', visitors: 1580, newUsers: 630 },
    { date: '2023-06-10', visitors: 1750, newUsers: 810 },
  ],
};

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  useEffect(() => {
    // Simulate API call
    const fetchData = async () => {
      try {
        // In a real app, this would be an API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        setData(sampleData);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Format date strings for better display
  const formatDateLabels = (data) => {
    return data.map(item => ({
      ...item,
      date: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    }));
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div style={{ padding: '24px' }}>
      <Title level={2}>Marketing Dashboard</Title>
      
      {/* KPI Stats */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Total Revenue"
              value={290000}
              precision={0}
              valueStyle={{ color: '#3f8600' }}
              prefix={<DollarOutlined />}
              suffix=""
              formatter={(value) => `$${value.toLocaleString()}`}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Conversion Rate"
              value={5.7}
              precision={1}
              valueStyle={{ color: '#3f8600' }}
              prefix={<ArrowUpOutlined />}
              suffix="%"
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Active Campaigns"
              value={12}
              valueStyle={{ color: '#1890ff' }}
              prefix={<RocketOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Cost Per Acquisition"
              value={32.4}
              precision={1}
              valueStyle={{ color: '#cf1322' }}
              prefix={<DollarOutlined />}
              suffix=""
            />
          </Card>
        </Col>
      </Row>
      
      {/* Charts Row 1 */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} lg={12}>
          <LineChart
            title="Campaign Performance Metrics"
            data={formatDateLabels(data.campaignPerformance)}
            xAxisKey="date"
            xAxisLabel="Date"
            yAxisLabel="Count"
            lines={[
              { key: 'clicks', name: 'Clicks', color: '#1890ff' },
              { key: 'conversions', name: 'Conversions', color: '#52c41a' }
            ]}
            height={320}
          />
        </Col>
        <Col xs={24} lg={12}>
          <PieChart
            title="Channel Distribution"
            data={data.channelBreakdown}
            nameKey="name"
            valueKey="value"
            donut={true}
            centerLabel="Channels"
            height={320}
          />
        </Col>
      </Row>
      
      {/* Charts Row 2 */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} lg={12}>
          <BarChart
            title="Segment Performance Comparison"
            data={data.segmentPerformance}
            xAxisKey="segment"
            xAxisLabel="Customer Segment"
            yAxisLabel="Value"
            bars={[
              { key: 'conversionRate', name: 'Conversion Rate (%)', color: '#1890ff' },
              { key: 'clickRate', name: 'Click Rate (%)', color: '#faad14' },
            ]}
            showGrid={true}
            height={350}
          />
        </Col>
        <Col xs={24} lg={12}>
          <AreaChart
            title="Revenue & Cost Trends"
            data={data.monthlyTrends}
            xAxisKey="month"
            xAxisLabel="Month"
            yAxisLabel="Amount ($)"
            areas={[
              { key: 'revenue', name: 'Revenue', color: '#52c41a', fillOpacity: 0.6 },
              { key: 'cost', name: 'Cost', color: '#f5222d', fillOpacity: 0.4 }
            ]}
            stacked={false}
            height={350}
          />
        </Col>
      </Row>
      
      {/* Charts Row 3 */}
      <Row gutter={[16, 16]}>
        <Col xs={24}>
          <AreaChart
            title="Website Traffic"
            data={formatDateLabels(data.dailyTraffic)}
            xAxisKey="date"
            xAxisLabel="Date"
            yAxisLabel="Visitors"
            areas={[
              { key: 'visitors', name: 'Total Visitors', color: '#722ed1', fillOpacity: 0.6 },
              { key: 'newUsers', name: 'New Users', color: '#13c2c2', fillOpacity: 0.6 }
            ]}
            stacked={false}
            referenceLine={{ y: 1500, label: 'Target', color: '#ff7300' }}
            height={300}
          />
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard; 