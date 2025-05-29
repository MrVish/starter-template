import { useState, useEffect, useRef } from 'react';
import useApi from './useApi';
import { useSession } from 'next-auth/react';

// Define interfaces for the data structures
export interface Segment {
  id: number;
  name: string;
  description: string;
  size?: number;
  customer_count?: number;
  engagement?: string;
  growth?: string;
  avgValue?: string;
  lastUpdated?: string;
  rules?: any[];
  criteria?: string;
  created_at?: string;
  updated_at?: string;
  created_by?: number;
  color_scheme?: string;
  progress_value?: number;
}

// Cache for storing API responses
const responseCache: Record<string, {
  data: Segment[];
  timestamp: number;
}> = {};

// Cache expiration time in milliseconds (5 minutes)
const CACHE_EXPIRATION = 5 * 60 * 1000;

// Sample customer segments data for fallback
export const MOCK_SEGMENTS: Segment[] = [
  {
    id: 1,
    name: 'Premium Banking Clients',
    description: 'Clients with balances over $250K and active investment accounts',
    size: 23451,
    engagement: 'High',
    growth: '+12.5%',
    avgValue: '$4,850',
    lastUpdated: '2023-02-15',
  },
  {
    id: 2,
    name: 'Digital Banking Power Users',
    description: 'Clients who conduct 90%+ of transactions via mobile/web platforms',
    size: 78932,
    engagement: 'Medium',
    growth: '+8.3%',
    avgValue: '$780',
    lastUpdated: '2023-03-01',
  },
  {
    id: 3,
    name: 'Wealth Management Portfolio',
    description: 'High-net-worth clients with managed investment portfolios > $1M',
    size: 4578,
    engagement: 'Very High',
    growth: '+5.7%',
    avgValue: '$15,750',
    lastUpdated: '2023-02-28',
  },
  {
    id: 4,
    name: 'New Client Onboarding',
    description: 'Clients who opened accounts or started investment relationships in the last 6 months',
    size: 15243,
    engagement: 'Low',
    growth: '+28.9%',
    avgValue: '$625',
    lastUpdated: '2023-03-05',
  },
];

// Sample data for AI-generated segment analytics
export const sampleAIChartData = {
  spendingByCategory: [
    { category: 'Travel', amount: 2450 },
    { category: 'Dining', amount: 1890 },
    { category: 'Retail', amount: 3200 },
    { category: 'Investment', amount: 5100 },
    { category: 'Services', amount: 980 },
  ],
  ageDistribution: [
    { age: '18-24', count: 420 },
    { age: '25-34', count: 1250 },
    { age: '35-44', count: 2100 },
    { age: '45-54', count: 1870 },
    { age: '55-64', count: 980 },
    { age: '65+', count: 580 },
  ],
  activityTrend: [
    { month: 'Jan', transactions: 1200 },
    { month: 'Feb', transactions: 1400 },
    { month: 'Mar', transactions: 1100 },
    { month: 'Apr', transactions: 1600 },
    { month: 'May', transactions: 1800 },
    { month: 'Jun', transactions: 2100 },
  ],
};

export const useSegments = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [segments, setSegments] = useState<Segment[]>(MOCK_SEGMENTS);
  const isMounted = useRef(true);
  
  const api = useApi();
  const { data: session } = useSession();

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    const fetchSegmentsData = async () => {
      if (!isMounted.current) return;
      
      setLoading(true);
      setError(null);
      
      // Check cache first
      const cacheKey = 'segments_data';
      const cachedResponse = responseCache[cacheKey];
      
      if (cachedResponse && (Date.now() - cachedResponse.timestamp < CACHE_EXPIRATION)) {
        console.log('Using cached segments data');
        setSegments(cachedResponse.data);
        setLoading(false);
        return;
      }
      
      // Fetch from API - directly try the endpoint we know works
      try {
        console.log('Fetching segments from dashboard endpoint');
        // Direct API call to the backend instead of using Next.js API routes
        const fullUrl = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/v1/dashboard/segments`;
        console.log(`Making direct API call to: ${fullUrl}`);
        
        const response = await api.get(fullUrl);
        console.log('Raw API response:', response);
        
        // Extract segments data from the response
        // We know the exact structure: { data: [...], success: true }
        let segmentsData: any[] = [];
        
        // Check if we have the right response structure
        if (response && response.data && response.data.success === true && Array.isArray(response.data.data)) {
          console.log(`Found segments in response.data.data with ${response.data.data.length} items`);
          segmentsData = response.data.data;
        }
        // Fallback check for other possible structures
        else if (response && response.data && Array.isArray(response.data)) {
          console.log(`Found segments directly in response.data with ${response.data.length} items`);
          segmentsData = response.data;
        }
        // Last resort check for nested data
        else if (response && response.data && response.data.data && Array.isArray(response.data.data)) {
          console.log(`Found segments in nested response.data.data with ${response.data.data.length} items`);
          segmentsData = response.data.data;
        }
        
        // Debug logging for segment data
        if (segmentsData.length > 0) {
          console.log(`Found ${segmentsData.length} segments to process:`, 
            segmentsData.map(s => s.name || 'unnamed').join(', '));
          
          // Sample of first segment for debugging
          console.log('First segment sample:', JSON.stringify(segmentsData[0], null, 2));
          
          // Normalize and enhance data
          const normalizedData = normalizeSegmentsData(segmentsData);
          console.log('Normalized segments:', normalizedData.map(s => s.name).join(', '));
          
          // Update state and cache
          if (isMounted.current) {
            setSegments(normalizedData);
            setLoading(false);
            
            // Cache the data
            responseCache[cacheKey] = {
              data: normalizedData,
              timestamp: Date.now()
            };
          }
        } else {
          // Log detailed error information if no segments found
          console.warn('No valid segments data found in API response:', response);
          console.warn('Using fallback mock data instead');
          
          if (isMounted.current) {
            setSegments(MOCK_SEGMENTS);
            setLoading(false);
          }
        }
      } catch (error) {
        console.error('Error fetching segments:', error);
        
        // Use mock data on error
        if (isMounted.current) {
          setSegments(MOCK_SEGMENTS);
          setLoading(false);
          setError('Could not load segments data');
        }
      }
    };
    
    fetchSegmentsData();
  }, [api, session]);
  
  // Normalize and enhance segments data
  const normalizeSegmentsData = (rawData: any[]): Segment[] => {
    return rawData.map((item: any, index: number) => {
      // Find matching mock item for filling in missing data
      const mockItem = MOCK_SEGMENTS[index % MOCK_SEGMENTS.length];
      
      // Log the raw item for debugging
      console.log(`Normalizing segment ${index}:`, JSON.stringify(item, null, 2));
      
      // Extract or generate basic required fields
      const id = item.id || item.segment_id || index + 1;
      const name = item.name || item.segment_name || `Segment ${id}`;
      const description = item.description || mockItem.description || 'No description available';
      
      // Use customer_count directly as it's in the JSON
      const size = item.customer_count || item.size || item.count || mockItem.size || 1000;
      
      // Map progress_value to engagement level
      let engagement = item.engagement || mockItem.engagement || 'Medium';
      if (item.progress_value !== undefined) {
        if (item.progress_value >= 90) engagement = 'Very High';
        else if (item.progress_value >= 75) engagement = 'High';
        else if (item.progress_value >= 50) engagement = 'Medium';
        else if (item.progress_value >= 25) engagement = 'Low';
        else engagement = 'Very Low';
      }
      
      // Create a growth percentage based on progress_value if available
      let growth = item.growth || mockItem.growth || '+0.0%';
      if (item.progress_value !== undefined) {
        const progressBasedGrowth = (item.progress_value / 10).toFixed(1);
        growth = `+${progressBasedGrowth}%`;
      }
      
      // Create a segment with all needed fields
      return {
        id,
        name,
        description,
        size,
        engagement,
        growth,
        avgValue: item.avgValue || item.avg_value || mockItem.avgValue || '$0',
        lastUpdated: item.lastUpdated || item.updated_at || new Date().toISOString().split('T')[0],
        created_at: item.created_at || new Date().toISOString(),
        updated_at: item.updated_at || new Date().toISOString(),
        created_by: item.created_by || 1,
        rules: item.rules || [],
        criteria: item.criteria || '',
        // Add new fields from the JSON
        color_scheme: item.color_scheme || 'blue',
        progress_value: item.progress_value || 50
      };
    });
  };

  return { segments, loading, error };
};

export default useSegments; 