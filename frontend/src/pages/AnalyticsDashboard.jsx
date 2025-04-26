import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Spin, Alert, Tabs } from 'antd';
import { Line, Bar, Pie } from '@ant-design/charts';
import axios from 'axios';
import { API_BASE_URL } from '../config';
import PageHeader from '../components/PageHeader';
import StatCard from '../components/StatCard';
import useAuth from '../hooks/useAuth';

const { TabPane } = Tabs;

const AnalyticsDashboard = () => {
  const { token } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [campaignPerformance, setCampaignPerformance] = useState(null);
  const [campaignLoading, setCampaignLoading] = useState(false);
  const [segmentData, setSegmentData] = useState(null);
  const [channelData, setChannelData] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_BASE_URL}/api/v1/analytics/dashboard-summary`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (response.data.success) {
          setDashboardData(response.data.data);
          
          // Set the first campaign as selected by default if available
          if (response.data.data.active_campaigns.length > 0) {
            setSelectedCampaign(response.data.data.active_campaigns[0].id);
            fetchCampaignPerformance(response.data.data.active_campaigns[0].id);
          }
          
          // Fetch segment and channel data
          fetchSegmentPerformance();
          fetchChannelEffectiveness();
        } else {
          setError('Failed to fetch dashboard data');
        }
      } catch (err) {
        setError(err.message || 'An error occurred while fetching data');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [token]);

  const fetchCampaignPerformance = async (campaignId) => {
    try {
      setCampaignLoading(true);
      const response = await axios.get(
        `${API_BASE_URL}/api/v1/analytics/campaigns/${campaignId}/performance`,
        {
          headers: { Authorization: `Bearer ${token}` },
          params: { days: 30 } // Last 30 days
        }
      );
      
      if (response.data.success) {
        setCampaignPerformance(response.data.data);
      } else {
        console.error('Failed to fetch campaign performance');
      }
    } catch (err) {
      console.error('Error fetching campaign performance:', err);
    } finally {
      setCampaignLoading(false);
    }
  };

  const fetchSegmentPerformance = async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/v1/analytics/segments/performance`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      if (response.data.success) {
        setSegmentData(response.data.data);
      }
    } catch (err) {
      console.error('Error fetching segment performance:', err);
    }
  };

  const fetchChannelEffectiveness = async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/v1/analytics/channels/effectiveness`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      if (response.data.success) {
        setChannelData(response.data.data);
      }
    } catch (err) {
      console.error('Error fetching channel effectiveness:', err);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <Spin size="large" />
        <p>Loading marketing analytics dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <Alert
        message="Error"
        description={error}
        type="error"
        showIcon
      />
    );
  }

  // Prepare chart data
  const lineConfig = {
    data: campaignPerformance?.daily_metrics || [],
    height: 300,
    xField: 'date',
    yField: 'impressions',
    point: {
      size: 5,
      shape: 'diamond',
    },
    tooltip: {
      formatter: (datum) => {
        return { name: 'Impressions', value: datum.impressions.toLocaleString() };
      },
    },
  };

  const conversionLineConfig = {
    data: campaignPerformance?.daily_metrics || [],
    height: 300,
    xField: 'date',
    yField: 'conversions',
    seriesField: 'date',
    color: '#2196F3',
    point: {
      size: 5,
      shape: 'circle',
    },
    tooltip: {
      formatter: (datum) => {
        return { name: 'Conversions', value: datum.conversions.toLocaleString() };
      },
    },
  };

  const segmentPieConfig = {
    data: segmentData?.segments || [],
    height: 300,
    angleField: 'conversion_rate',
    colorField: 'name',
    radius: 0.8,
    label: {
      type: 'outer',
      content: '{name}: {percentage}',
    },
    interactions: [{ type: 'element-active' }],
    tooltip: {
      formatter: (datum) => {
        return { name: datum.name, value: `${datum.conversion_rate.toFixed(2)}%` };
      },
    },
  };

  const channelBarConfig = {
    data: channelData?.channels || [],
    height: 300,
    xField: 'roi',
    yField: 'name',
    seriesField: 'name',
    legend: { position: 'top' },
    tooltip: {
      formatter: (datum) => {
        return { name: datum.name, value: `ROI: ${datum.roi.toFixed(2)}x` };
      },
    },
  };

  // Calculate metrics for display
  const totalImpressions = dashboardData?.monthly_performance?.reduce((sum, item) => sum + item.impressions, 0) || 0;
  const totalClicks = dashboardData?.monthly_performance?.reduce((sum, item) => sum + item.clicks, 0) || 0;
  const totalConversions = dashboardData?.monthly_performance?.reduce((sum, item) => sum + item.conversions, 0) || 0;
  const totalRevenue = dashboardData?.monthly_performance?.reduce((sum, item) => sum + item.revenue, 0) || 0;

  return (
    <div className="analytics-dashboard">
      <PageHeader
        title="Marketing Analytics Dashboard"
        subtitle="Comprehensive overview of your marketing performance"
      />

      {/* Summary metrics */}
      <Row gutter={[16, 16]} className="metrics-summary">
        <Col xs={24} sm={12} md={6}>
          <StatCard 
            title="Total Impressions" 
            value={totalImpressions.toLocaleString()} 
            icon="eye" 
            color="#1890ff" 
          />
        </Col>
        <Col xs={24} sm={12} md={6}>
          <StatCard 
            title="Total Clicks" 
            value={totalClicks.toLocaleString()} 
            icon="click" 
            color="#52c41a" 
          />
        </Col>
        <Col xs={24} sm={12} md={6}>
          <StatCard 
            title="Conversions" 
            value={totalConversions.toLocaleString()} 
            icon="check-circle" 
            color="#722ed1" 
          />
        </Col>
        <Col xs={24} sm={12} md={6}>
          <StatCard 
            title="Revenue" 
            value={`$${totalRevenue.toLocaleString()}`} 
            icon="dollar" 
            color="#faad14" 
          />
        </Col>
      </Row>

      <Tabs defaultActiveKey="1" style={{ marginTop: 24 }}>
        <TabPane tab="Campaign Performance" key="1">
          <Row gutter={[16, 16]}>
            {/* Campaign selector */}
            <Col span={24}>
              <Card title="Select Campaign">
                <Tabs 
                  type="card" 
                  onChange={(key) => {
                    setSelectedCampaign(Number(key));
                    fetchCampaignPerformance(Number(key));
                  }}
                  activeKey={selectedCampaign?.toString()}
                >
                  {dashboardData?.active_campaigns.map(campaign => (
                    <TabPane tab={campaign.name} key={campaign.id}>
                      {campaignLoading ? (
                        <Spin />
                      ) : campaignPerformance ? (
                        <Row gutter={[16, 16]}>
                          <Col xs={24} md={12}>
                            <Card title="Daily Impressions">
                              <Line {...lineConfig} />
                            </Card>
                          </Col>
                          <Col xs={24} md={12}>
                            <Card title="Daily Conversions">
                              <Line {...conversionLineConfig} />
                            </Card>
                          </Col>
                        </Row>
                      ) : (
                        <Alert message="No performance data available for this campaign" type="info" />
                      )}
                    </TabPane>
                  ))}
                </Tabs>
              </Card>
            </Col>
          </Row>
        </TabPane>

        <TabPane tab="Segment Analysis" key="2">
          <Row gutter={[16, 16]}>
            <Col xs={24} md={12}>
              <Card title="Segment Conversion Rate">
                {segmentData ? (
                  <Pie {...segmentPieConfig} />
                ) : (
                  <Spin />
                )}
              </Card>
            </Col>
            <Col xs={24} md={12}>
              <Card title="Segment Overview">
                {segmentData ? (
                  <div className="segment-stats">
                    {segmentData.segments.map(segment => (
                      <div key={segment.id} className="segment-stat-row">
                        <h4>{segment.name}</h4>
                        <p>Customers: {segment.customer_count.toLocaleString()}</p>
                        <p>Conversion Rate: {segment.conversion_rate.toFixed(2)}%</p>
                        <p>Avg. Order Value: ${segment.avg_order_value.toFixed(2)}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <Spin />
                )}
              </Card>
            </Col>
          </Row>
        </TabPane>

        <TabPane tab="Channel Effectiveness" key="3">
          <Row gutter={[16, 16]}>
            <Col xs={24} md={12}>
              <Card title="Channel ROI Comparison">
                {channelData ? (
                  <Bar {...channelBarConfig} />
                ) : (
                  <Spin />
                )}
              </Card>
            </Col>
            <Col xs={24} md={12}>
              <Card title="Channel Distribution">
                {dashboardData ? (
                  <Pie 
                    data={dashboardData.channel_distribution} 
                    height={300}
                    angleField="value"
                    colorField="channel"
                    radius={0.8}
                    label={{
                      type: 'outer',
                      content: '{name}: {percentage}',
                    }}
                    interactions={[{ type: 'element-active' }]}
                  />
                ) : (
                  <Spin />
                )}
              </Card>
            </Col>
          </Row>
        </TabPane>
      </Tabs>
    </div>
  );
};

export default AnalyticsDashboard; 