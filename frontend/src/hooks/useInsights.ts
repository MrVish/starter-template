import { useState, useEffect, useRef } from 'react';
import { useApi } from './useApi';
import { useSession } from 'next-auth/react';

// Define interfaces for the data structures
export interface KeyMetric {
  id: number;
  metric: string;
  value: string;
  target: string;
  period: string;
  change: string;
  trend: 'up' | 'down';
}

export interface CampaignResult {
  attendees?: string;
  leads?: string;
  consultations?: string;
  referrals?: string;
  educational_sessions?: string;
  portfolio_reviews?: string;
  account_inquiries?: string;
  new_accounts?: string;
  conversions: string;
  revenue: string;
}

export interface Campaign {
  id: number;
  name: string;
  status: string;
  start: string;
  end: string;
  budget: string;
  spend: string;
  results: CampaignResult;
  // Additional fields from database
  type?: string;
  roi?: string;
  roi_value?: number;
  start_date?: string;
  end_date?: string;
}

export interface ChannelPerformance {
  name: string;
  impressions: number;
  clicks: number;
  conversions: number;
  revenue: number;
  cost: number;
  roi: number;
}

export interface SegmentPerformance {
  name: string;
  size: number;
  reached: number;
  engaged: number;
  converted: number;
  revenue: number;
}

export interface InsightsData {
  keyMetrics: KeyMetric[];
  campaigns: Campaign[];
  channelPerformance: ChannelPerformance[];
  segmentPerformance: SegmentPerformance[];
}

// Cache responses to reduce API calls
const CACHE_EXPIRATION = 5 * 60 * 1000; // 5 minutes
const responseCache: Record<string, { data: any, timestamp: number }> = {};

// Mock data for fallback
const getMockInsightsData = (): InsightsData => {
  return {
    keyMetrics: [
      {
        id: 1,
        metric: 'New Client Acquisition',
        value: '1,250',
        target: '2,000',
        period: 'Monthly',
        change: '+12.5%',
        trend: 'up',
      },
      {
        id: 2,
        metric: 'Average Assets Under Management',
        value: '$385K',
        target: '$300K',
        period: 'Monthly',
        change: '+8.3%',
        trend: 'up',
      },
      {
        id: 3,
        metric: 'Client Retention Rate',
        value: '92.4%',
        target: '95%',
        period: 'Annual',
        change: '+2.1%',
        trend: 'up',
      },
      {
        id: 4,
        metric: 'Financial Advisory ROI',
        value: '387%',
        target: '450%',
        period: 'Quarterly',
        change: '+15.2%',
        trend: 'up',
      },
    ],
    campaigns: [
      {
        id: 1,
        name: 'Retirement Planning Webinars',
        status: 'Active',
        start: '2023-06-01',
        end: '2023-08-31',
        budget: '$85,000',
        spend: '$45,000',
        results: {
          attendees: '2,850',
          leads: '620',
          conversions: '420',
          revenue: '$128,500',
        },
      },
      {
        id: 2,
        name: 'Wealth Management Advisor Program',
        status: 'Active',
        start: '2023-05-15',
        end: '2023-09-30',
        budget: '$120,000',
        spend: '$62,500',
        results: {
          consultations: '380',
          referrals: '85',
          conversions: '280',
          revenue: '$325,000',
        },
      },
      {
        id: 3,
        name: 'Investment Portfolio Diversification',
        status: 'Active',
        start: '2023-07-01',
        end: '2023-10-31',
        budget: '$65,000',
        spend: '$35,000',
        results: {
          educational_sessions: '45',
          portfolio_reviews: '320',
          conversions: '180',
          revenue: '$185,000',
        },
      },
      {
        id: 4,
        name: 'High-Yield Savings Campaign',
        status: 'Planned',
        start: '2023-09-01',
        end: '2023-12-31',
        budget: '$70,000',
        spend: '$0',
        results: {
          account_inquiries: '0',
          new_accounts: '0',
          conversions: '0',
          revenue: '$0',
        },
      },
    ],
    channelPerformance: [
      {
        name: 'Email Marketing',
        impressions: 95750,
        clicks: 12350,
        conversions: 3250,
        revenue: 125000,
        cost: 35000,
        roi: 257,
      },
      {
        name: 'Mobile App',
        impressions: 65430,
        clicks: 28560,
        conversions: 4950,
        revenue: 180000,
        cost: 42000,
        roi: 329,
      },
      {
        name: 'Social Media',
        impressions: 125000,
        clicks: 18750,
        conversions: 2750,
        revenue: 110000,
        cost: 50000,
        roi: 120,
      },
      {
        name: 'Direct Mail',
        impressions: 45000,
        clicks: 6750,
        conversions: 1350,
        revenue: 95000,
        cost: 65000,
        roi: 46,
      },
      {
        name: 'Branch Visits',
        impressions: 15000,
        clicks: 1500,
        conversions: 750,
        revenue: 225000,
        cost: 100000,
        roi: 125,
      },
    ],
    segmentPerformance: [
      {
        name: 'Premium Banking Clients',
        size: 25000,
        reached: 85,
        engaged: 35,
        converted: 18,
        revenue: 1250000,
      },
      {
        name: 'Digital Banking Power Users',
        size: 123000,
        reached: 75,
        engaged: 42,
        converted: 12,
        revenue: 875000,
      },
      {
        name: 'Wealth Management Portfolio',
        size: 15000,
        reached: 90,
        engaged: 68,
        converted: 42,
        revenue: 3600000,
      },
      {
        name: 'New Client Onboarding',
        size: 32000,
        reached: 95,
        engaged: 65,
        converted: 22,
        revenue: 620000,
      },
      {
        name: 'Credit Card Heavy Users',
        size: 68000,
        reached: 82,
        engaged: 45,
        converted: 28,
        revenue: 1400000,
      },
    ],
  };
};

// Middleware function to standardize API responses before processing
const standardizeApiResponse = (response: any, endpoint: string): any => {
  // If response is already null or undefined, return as is
  if (!response) {
    console.log(`Response from ${endpoint} is null or undefined`);
    return { success: false, data: null, error: 'Empty response' };
  }

  try {
    // For debugging, show a truncated version of the response
    console.log(`Processing response from ${endpoint}:`, typeof response === 'object' ? 
      JSON.stringify(response).substring(0, 100) + '...' : response);
    
    // Case 1: Response is already in standard format with success flag
    if (response && typeof response === 'object' && 'success' in response) {
      // If it's a dashboard endpoint with campaigns nested in data.campaigns
      if (endpoint.includes('/dashboard/campaigns') && response.data && response.data.campaigns) {
        console.log(`Dashboard campaigns endpoint returned ${response.data.campaigns.length} campaigns`);
        return {
          success: response.success,
          data: response.data.campaigns
        };
      }
      
      // For normal success responses, return as is
      return response;
    }
    
    // Case 2: If response is a direct array
    if (Array.isArray(response)) {
      console.log(`Response is a direct array with ${response.length} items`);
      return { 
        success: true, 
        data: response 
      };
    }
    
    // Case 3: If response has data property but no success flag
    if (response && typeof response === 'object' && 'data' in response) {
      console.log(`Response has data property`);
      return { 
        success: true, 
        data: response.data 
      };
    }
    
    // Case 4: API might return result in data field
    if (response && typeof response === 'object' && 'result' in response) {
      console.log(`Response has result property`);
      return { 
        success: true, 
        data: response.result 
      };
    }
    
    // Case 5: Anything else, wrap the entire response as data
    console.log(`Using response as direct data`);
    return { 
      success: true, 
      data: response 
    };
  } catch (error) {
    console.error(`Error standardizing API response:`, error);
    return { 
      success: false, 
      data: null, 
      error: 'Error processing API response'
    };
  }
};

// Helper function to normalize data
const normalizeData = (type: string, data: any, fallbackData: any) => {
  try {
    // If data is null or empty array, return fallback data
    if (!data || (Array.isArray(data) && data.length === 0)) {
      console.log(`No ${type} data to normalize, using fallback`);
      return fallbackData;
    }

    // Parse data based on type
    let dataArray = Array.isArray(data) ? data : [data];
    
    // For key metrics, normalize the fields
    if (type === 'keyMetrics') {
      return dataArray.map((metric: any) => {
        // Create a processed metric with required defaults
        const processedMetric: KeyMetric = {
          id: metric.id || 0,
          metric: metric.metric || '',
          value: metric.value || '0',
          target: metric.target || '0',
          period: metric.period || 'Monthly',
          change: metric.change || '0%',
          trend: metric.trend || (metric.change && metric.change.startsWith('+')) ? 'up' : 'down'
        };
        
        // If metric contains percent values, ensure they have % sign
        if (!processedMetric.value.includes('%') && 
            ['retention', 'rate', 'roi'].some(term => processedMetric.metric.toLowerCase().includes(term))) {
          if (typeof processedMetric.value === 'string' && !isNaN(parseFloat(processedMetric.value))) {
            processedMetric.value = `${processedMetric.value}%`;
          }
        }

        // For currency values, ensure they have $ sign if they're numbers
        if (!processedMetric.value.includes('$') && 
            ['asset', 'aum', 'balance', 'management'].some(term => processedMetric.metric.toLowerCase().includes(term))) {
          if (typeof processedMetric.value === 'string' && !isNaN(parseFloat(processedMetric.value))) {
            // Format large numbers like 12596 as $12.6K
            const numValue = parseFloat(processedMetric.value);
            if (numValue >= 1000) {
              processedMetric.value = `$${(numValue/1000).toFixed(1)}K`;
            } else {
              processedMetric.value = `$${numValue}`;
            }
          }
        }

        return processedMetric;
      });
    }
    
    // For campaigns, normalize fields
    if (type === 'campaigns') {
      return dataArray.map((campaign: any) => {
        // Log the raw campaign data for debugging
        console.log(`Normalizing campaign:`, JSON.stringify(campaign).substring(0, 200) + '...');
        
        // Initialize the minimum required Campaign structure
        const processedCampaign: Campaign = {
          id: campaign.id || 0,
          name: campaign.name || 'Unnamed Campaign',
          status: (campaign.status || 'unknown').toLowerCase(),
          start: campaign.start || campaign.start_date || '',
          end: campaign.end || campaign.end_date || '',
          budget: campaign.budget || '$0',
          spend: campaign.spend || '$0',
          results: {
            conversions: '0',
            revenue: '$0'
          },
          // Store additional fields
          type: campaign.type,
          roi: campaign.roi,
          roi_value: campaign.roi_value
        };
        
        // Process campaign results
        if (campaign.results) {
          // Use the provided results object
          processedCampaign.results = {
            conversions: campaign.results.conversions || '0',
            revenue: campaign.results.revenue || '$0',
            // Include other results fields
            ...campaign.results
          };
        } else if (campaign.conversions || campaign.revenue) {
          // For backends that return flattened structure
          processedCampaign.results = {
            conversions: campaign.conversions?.toString() || '0',
            revenue: campaign.revenue?.toString() || '$0'
          };
        }
        
        // Format currency values
        // Budget
        if (processedCampaign.budget && !processedCampaign.budget.startsWith('$')) {
          processedCampaign.budget = `$${processedCampaign.budget}`;
        }
        
        // Spend
        if (processedCampaign.spend && !processedCampaign.spend.startsWith('$')) {
          processedCampaign.spend = `$${processedCampaign.spend}`;
        }
        
        // Revenue
        if (processedCampaign.results.revenue && !processedCampaign.results.revenue.startsWith('$')) {
          processedCampaign.results.revenue = `$${processedCampaign.results.revenue}`;
        }
        
        // Format dates for consistent display
        if (processedCampaign.start) {
          // Remove time portion from ISO dates
          if (processedCampaign.start.includes('T')) {
            processedCampaign.start = processedCampaign.start.split('T')[0];
          }
        }
        
        if (processedCampaign.end) {
          // Remove time portion from ISO dates
          if (processedCampaign.end.includes('T')) {
            processedCampaign.end = processedCampaign.end.split('T')[0];
          }
        }
        
        console.log(`Normalized campaign: ${processedCampaign.name} (ID: ${processedCampaign.id})`);
        return processedCampaign;
      });
    }
    
    // Return the data if it's valid
    return dataArray;
  } catch (e) {
    console.error(`Error normalizing ${type} data:`, e);
    return fallbackData;
  }
};

// Helper function to extract data from standardized API responses
const extractData = (response: any, dataType: string): any => {
  if (!response) {
    console.log(`No response for ${dataType}`);
    return null;
  }
  
  try {
    console.log(`Extracting ${dataType} from response:`, 
      typeof response === 'object' ? JSON.stringify(response).substring(0, 200) + '...' : response);
    
    // If response indicates failure, return null
    if (response.success === false) {
      console.log(`Response for ${dataType} indicates failure:`, response.error || 'Unknown error');
      return null;
    }
    
    const data = response.data;
    
    // If no data, return null
    if (!data) {
      console.log(`No data found for ${dataType}`);
      return null;
    }
    
    // For analytics/campaigns endpoint - handle both array and object formats
    if (dataType === 'campaigns') {
      if (Array.isArray(data)) {
        console.log(`Found campaigns array with ${data.length} items`);
        return data;
      } else if (typeof data === 'object' && 'campaigns' in data) {
        console.log(`Found campaigns in data.campaigns with ${data.campaigns.length} items`);
        return data.campaigns;
      } else if (typeof data === 'object') {
        // Look for campaigns array in any property
        for (const key in data) {
          if (Array.isArray(data[key])) {
            console.log(`Found possible campaigns array in data.${key} with ${data[key].length} items`);
            if (data[key].length > 0 && data[key][0].name && data[key][0].status) {
              console.log(`Verified as campaigns array - contains name and status fields`);
              return data[key];
            }
          }
        }
      }
      
      // If data is an object that looks like a single campaign, wrap in array
      if (typeof data === 'object' && data.name && data.status) {
        console.log(`Found single campaign object, wrapping in array`);
        return [data];
      }
    }
    
    // For other data types, return the data property
    console.log(`Returning data for ${dataType}:`, 
      typeof data === 'object' ? JSON.stringify(data).substring(0, 100) + '...' : data);
    return data;
  } catch (error) {
    console.error(`Error extracting ${dataType}:`, error);
    return null;
  }
};

// Add this helper function near the normalizeData and extractData functions
const extractSegmentPerformanceData = (response: any): any[] => {
  if (!response) return [];
  
  // Direct array
  if (Array.isArray(response)) {
    return response;
  }
  
  // Common response patterns
  if (response.data) {
    if (Array.isArray(response.data)) {
      return response.data;
    }
    
    if (response.data.segments && Array.isArray(response.data.segments)) {
      return response.data.segments;
    }
  }
  
  // Try known property names that might contain segments
  const possibleProperties = ['segments', 'data', 'result', 'results'];
  
  for (const prop of possibleProperties) {
    if (response[prop] && Array.isArray(response[prop])) {
      return response[prop];
    }
  }
  
  // Try nested paths
  for (const outerProp of possibleProperties) {
    if (response[outerProp] && typeof response[outerProp] === 'object') {
      for (const innerProp of possibleProperties) {
        if (response[outerProp][innerProp] && Array.isArray(response[outerProp][innerProp])) {
          return response[outerProp][innerProp];
        }
      }
    }
  }
  
  return [];
};

export const useInsights = (timeRange: string = 'all') => {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<InsightsData | null>(null);
  const isMounted = useRef(true);
  
  const api = useApi();
  const { data: session } = useSession();

  useEffect(() => {
    // Set isMounted to false when component unmounts
    return () => {
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    console.log('======= DEBUG: useInsights effect triggered =======');
    console.log('- timeRange:', timeRange);
    
    const fetchInsightsData = async () => {
      if (!isMounted.current) return;
      
      setLoading(true);
      setError(null);
      
      try {
        // Create placeholders for all data types
        let campaigns: Campaign[] = [];
        let keyMetrics: KeyMetric[] = [];
        let channelPerformance: ChannelPerformance[] = [];
        let segmentPerformance: SegmentPerformance[] = [];
        
        // Track API success for each endpoint
        let campaignsSuccess = false;
        let metricsSuccess = false;
        let channelsSuccess = false;
        let segmentsSuccess = false;
        
        // 1. Fetch campaigns data
        console.log('- Starting API request for campaigns');
        const campaignsUrl = `/api/v1/analytics/campaigns?timeRange=${timeRange}`;
        
        try {
          const campaignsResponse = await api.get(campaignsUrl);
          console.log('- Campaigns API response received');
          
          if (campaignsResponse) {
            // Extract campaign data using our existing logic
            let campaignData: any[] = [];
            
            // First, try using the response directly if it's an array
            if (Array.isArray(campaignsResponse)) {
              console.log('- Response is a direct array with', campaignsResponse.length, 'items');
              campaignData = campaignsResponse;
            } 
            // Next, try common response wrapper formats
            else if (campaignsResponse && typeof campaignsResponse === 'object') {
              // Check properties that might contain the campaigns array
              const possibleArrayProps = ['data', 'campaigns', 'result', 'results', 'items'];
              
              for (const prop of possibleArrayProps) {
                if (prop in campaignsResponse && Array.isArray((campaignsResponse as any)[prop])) {
                  console.log(`- Found campaigns in response.${prop} with ${(campaignsResponse as any)[prop].length} items`);
                  campaignData = (campaignsResponse as any)[prop];
                  break;
                }
              }
              
              // If still no campaigns, check for nested data structures
              if (campaignData.length === 0 && 'data' in campaignsResponse && typeof campaignsResponse.data === 'object') {
                for (const prop of possibleArrayProps) {
                  if (prop in campaignsResponse.data && Array.isArray((campaignsResponse.data as any)[prop])) {
                    console.log(`- Found campaigns in response.data.${prop} with ${(campaignsResponse.data as any)[prop].length} items`);
                    campaignData = (campaignsResponse.data as any)[prop];
                    break;
                  }
                }
              }
            }
            
            // If we still don't have campaign data, look for arrays with campaign-like objects
            if (campaignData.length === 0 && campaignsResponse && typeof campaignsResponse === 'object') {
              for (const key in campaignsResponse) {
                if (Array.isArray((campaignsResponse as any)[key])) {
                  const arr = (campaignsResponse as any)[key];
                  if (arr.length > 0 && (arr[0].name !== undefined || arr[0].id !== undefined)) {
                    console.log(`- Found potential campaigns in response.${key}`);
                    campaignData = arr;
                    break;
                  }
                }
              }
            }
            
            // If we have campaign data, process it
            if (campaignData.length > 0) {
              console.log(`- SUCCESS: Found ${campaignData.length} campaigns`);
              
              // Create normalized campaigns
              campaigns = campaignData.map((campaign: any) => {
                return {
                  id: campaign.id || 0,
                  name: campaign.name || 'Unnamed Campaign',
                  status: (campaign.status || 'unknown').toLowerCase(),
                  start: campaign.start || '',
                  end: campaign.end || '',
                  budget: campaign.budget || '$0',
                  spend: campaign.spend || '$0',
                  results: {
                    conversions: campaign.results?.conversions || '0',
                    revenue: campaign.results?.revenue || '$0',
                    attendees: campaign.results?.attendees || '',
                    leads: campaign.results?.leads || ''
                  }
                };
              });
              
              console.log(`- Processed ${campaigns.length} real campaigns from API`);
              campaignsSuccess = true;
            } else {
              console.log('- No campaign data found in response');
            }
          }
        } catch (campaignsError) {
          console.error('- Campaigns API request failed:', campaignsError);
        }
        
        // 2. Fetch key metrics
        console.log('- Starting API request for key metrics');
        const metricsUrl = `/api/v1/analytics/metrics?timeRange=${timeRange}`;
        
        try {
          const metricsResponse = await api.get(metricsUrl);
          console.log('- Key metrics API response received');
          
          if (metricsResponse) {
            let metricsData: any[] = [];
            
            // Handle various response formats
            if (Array.isArray(metricsResponse)) {
              metricsData = metricsResponse;
            } else if (metricsResponse && typeof metricsResponse === 'object') {
              if ('data' in metricsResponse && Array.isArray(metricsResponse.data)) {
                metricsData = metricsResponse.data;
              } else if ('metrics' in metricsResponse && Array.isArray((metricsResponse as any).metrics)) {
                metricsData = (metricsResponse as any).metrics;
              } else if ('data' in metricsResponse && 
                          typeof metricsResponse.data === 'object' && 
                          'metrics' in metricsResponse.data && 
                          Array.isArray((metricsResponse.data as any).metrics)) {
                metricsData = (metricsResponse.data as any).metrics;
              }
            }
            
            // Process metrics if found
            if (metricsData.length > 0) {
              console.log(`- Found ${metricsData.length} key metrics`);
              
              keyMetrics = metricsData.map((metric: any, index: number) => {
                return {
                  id: metric.id || index + 1,
                  metric: metric.name || metric.metric || 'Metric',
                  value: metric.value || '0',
                  target: metric.target || '0',
                  period: metric.period || 'Monthly',
                  change: metric.change || '0%',
                  trend: (metric.trend || (metric.change && metric.change.includes('+')) ? 'up' : 'down') as 'up' | 'down'
                };
              });
              
              console.log(`- Processed ${keyMetrics.length} real key metrics from API`);
              metricsSuccess = true;
            } else {
              console.log('- No key metrics found in API response');
            }
          }
        } catch (metricsError) {
          console.error('- Key metrics API request failed:', metricsError);
        }
        
        // 3. Fetch channel performance data
        console.log('- Starting API request for channel performance');
        const channelsUrl = `/api/v1/analytics/channels/effectiveness?timeRange=${timeRange}`;
        
        try {
          const channelsResponse = await api.get(channelsUrl);
          console.log('- Channel performance API response received');
          
          if (channelsResponse) {
            let channelsData: any[] = [];
            
            // Handle various response formats
            if (Array.isArray(channelsResponse)) {
              channelsData = channelsResponse;
            } else if (channelsResponse && typeof channelsResponse === 'object') {
              if ('data' in channelsResponse && Array.isArray(channelsResponse.data)) {
                channelsData = channelsResponse.data;
              } else if ('channels' in channelsResponse && Array.isArray((channelsResponse as any).channels)) {
                channelsData = (channelsResponse as any).channels;
              } else if ('data' in channelsResponse && 
                          typeof channelsResponse.data === 'object' && 
                          'channels' in channelsResponse.data && 
                          Array.isArray((channelsResponse.data as any).channels)) {
                channelsData = (channelsResponse.data as any).channels;
              }
            }
            
            // Process channel performance if found
            if (channelsData.length > 0) {
              console.log(`- Found ${channelsData.length} channel performance records`);
              
              channelPerformance = channelsData.map((channel: any) => {
                return {
                  name: channel.name || 'Unknown Channel',
                  impressions: Number(channel.impressions) || 0,
                  clicks: Number(channel.clicks) || 0,
                  conversions: Number(channel.conversions) || 0,
                  revenue: Number(channel.revenue) || 0,
                  cost: Number(channel.cost) || 0,
                  roi: Number(channel.roi) || 0
                };
              });
              
              console.log(`- Processed ${channelPerformance.length} real channel performance records from API`);
              channelsSuccess = true;
            } else {
              console.log('- No channel performance data found in API response');
            }
          }
        } catch (channelsError) {
          console.error('- Channel performance API request failed:', channelsError);
        }
        
        // 4. Fetch segment performance data
        console.log('- Starting API request for segment performance');
        const segmentsUrl = `/api/v1/analytics/segments/performance?timeRange=${timeRange}`;

        try {
          const segmentsResponse = await api.get(segmentsUrl);
          console.log('- Segment performance API response received');
          
          if (segmentsResponse) {
            // Get segments data using a simplified extraction approach
            const segmentsData = extractSegmentPerformanceData(segmentsResponse);
            
            if (segmentsData && segmentsData.length > 0) {
              console.log(`- Found ${segmentsData.length} segment performance records`);
              
              segmentPerformance = segmentsData.map((segment: any) => ({
                name: segment.name || 'Unknown Segment',
                size: Number(segment.size) || 0,
                reached: Number(segment.reached) || 0,
                engaged: Number(segment.engaged) || 0,
                converted: Number(segment.converted) || 0,
                revenue: Number(segment.revenue) || 0
              }));
              
              console.log(`- Processed ${segmentPerformance.length} segment performance records`);
              segmentsSuccess = true;
            } else {
              console.log('- No segment performance data found in API response');
            }
          }
        } catch (segmentsError) {
          console.error('- Segment performance API request failed:', segmentsError);
        }

        // If primary endpoint failed, only then try dashboard/segments as a fallback
        if (!segmentsSuccess) {
          console.log('- Trying fallback segment endpoint: dashboard/segments');
          try {
            const dashboardSegmentsUrl = `/api/v1/dashboard/segments?timeRange=${timeRange}`;
            const dashboardResponse = await api.get(dashboardSegmentsUrl);
            
            if (dashboardResponse) {
              const dashboardSegmentsData = extractSegmentPerformanceData(dashboardResponse);
              
              if (dashboardSegmentsData && dashboardSegmentsData.length > 0) {
                console.log(`- Found ${dashboardSegmentsData.length} segment records from fallback endpoint`);
                
                segmentPerformance = dashboardSegmentsData.map((segment: any) => ({
                  name: segment.name || segment.segment_name || 'Unknown Segment',
                  size: Number(segment.size || segment.total_users || segment.audience_size || 0),
                  reached: Number(segment.reached || segment.reach_percentage || 0),
                  engaged: Number(segment.engaged || segment.engagement_rate || 0),
                  converted: Number(segment.converted || segment.conversion_rate || 0),
                  revenue: Number(segment.revenue || segment.total_revenue || 0)
                }));
                
                console.log(`- Processed ${segmentPerformance.length} segment records from fallback endpoint`);
                segmentsSuccess = true;
              }
            }
          } catch (dashboardError) {
            console.error('- Fallback segment API request failed:', dashboardError);
          }
        }
        
        // 5. Check if we have enough data to proceed
        if (campaignsSuccess) {
          // Create insights data object with all data from API
          const insightsData: InsightsData = {
            keyMetrics,
            campaigns,
            channelPerformance,
            segmentPerformance
          };
          
          console.log('- API Data summary:');
          console.log(`  - Campaigns (${campaignsSuccess ? 'API' : 'EMPTY'}): ${campaigns.length}`);
          console.log(`  - Key Metrics (${metricsSuccess ? 'API' : 'EMPTY'}): ${keyMetrics.length}`);
          console.log(`  - Channel Performance (${channelsSuccess ? 'API' : 'EMPTY'}): ${channelPerformance.length}`);
          console.log(`  - Segment Performance (${segmentsSuccess ? 'API' : 'EMPTY'}): ${segmentPerformance.length}`);
          
          // Set loading to false first to avoid race conditions
          setLoading(false);
          
          // Set the data - we don't use any mock data now
          setData(insightsData);
          console.log('- Setting data with real values from API only, no mock data');
        } else {
          console.log('- No campaign data found, unable to proceed');
          setLoading(false);
          setError('No campaign data available. Please try again later.');
          setData(null);
        }
      } catch (err) {
        console.error('- Error in fetchInsightsData:', err);
        setLoading(false);
        setError('Failed to fetch insights data. Please try again later.');
        setData(null);
      }
    };
    
    fetchInsightsData();
  }, [timeRange, api, session]);
  
  return { data, loading, error };
};

// Ensure default export also exists alongside named export
export default useInsights; 