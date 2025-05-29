/**
 * @jest-environment jsdom
 */

import { renderHook, act } from '@testing-library/react-hooks';
import { useInsights } from '../hooks/useInsights';
import { useApi } from '../hooks/useApi';
import { useSession } from 'next-auth/react';

// Mock the hooks
jest.mock('../hooks/useApi');
jest.mock('next-auth/react');

describe('useInsights Hook', () => {
  // Mock data
  const mockKeyMetrics = [
    { id: 1, metric: 'Test Metric', value: '100', target: '200', period: 'Monthly', change: '+10%', trend: 'up' }
  ];
  
  const mockCampaigns = [
    { id: 1, name: 'Test Campaign', status: 'Active', results: { conversions: '10', revenue: '$100' } }
  ];
  
  const mockChannels = [
    { name: 'Email', impressions: 1000, clicks: 100, conversions: 10, revenue: 1000, cost: 100, roi: 9 }
  ];
  
  const mockSegments = [
    { name: 'Test Segment', size: 1000, reached: 500, engaged: 250, converted: 50, revenue: 5000, change: '+5%', percentValue: 50 }
  ];

  // Mock successful API response
  const mockSuccessResponse = {
    data: {
      success: true,
      data: mockKeyMetrics
    }
  };

  // Mock error API response
  const mockErrorResponse = {
    error: 'API Error',
    data: null
  };

  // Mock unauthorized response
  const mockUnauthorizedResponse = {
    status: 401,
    data: {
      success: false,
      error: 'authorization_required',
      message: 'Authorization required'
    }
  };

  beforeEach(() => {
    // Clear mocks
    jest.clearAllMocks();
    
    // Default session is authenticated
    useSession.mockReturnValue({
      data: { user: { name: 'Test User' } },
      status: 'authenticated'
    });
    
    // Default API responses
    useApi.mockReturnValue({
      get: jest.fn()
        .mockResolvedValueOnce(mockSuccessResponse) // metrics
        .mockResolvedValueOnce(mockSuccessResponse) // campaigns
        .mockResolvedValueOnce(mockSuccessResponse) // channels
        .mockResolvedValueOnce(mockSuccessResponse) // segments
    });
    
    // Mock console methods
    jest.spyOn(console, 'log').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    console.log.mockRestore();
    console.error.mockRestore();
  });

  // Test 1: Should fetch data successfully when all API endpoints return valid data
  test('fetches data successfully from all endpoints', async () => {
    const api = useApi();
    api.get
      .mockResolvedValueOnce({ data: { success: true, data: mockKeyMetrics } })
      .mockResolvedValueOnce({ data: { success: true, data: mockCampaigns } })
      .mockResolvedValueOnce({ data: { success: true, data: mockChannels } })
      .mockResolvedValueOnce({ data: { success: true, data: mockSegments } });

    const { result, waitForNextUpdate } = renderHook(() => useInsights('30d'));
    
    // Initial state
    expect(result.current.loading).toBe(true);
    expect(result.current.error).toBe(null);
    expect(result.current.data).toBe(null);
    
    await waitForNextUpdate();
    
    // After data loads
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(null);
    expect(result.current.data).toEqual({
      keyMetrics: mockKeyMetrics,
      campaigns: mockCampaigns,
      channelPerformance: mockChannels,
      segmentPerformance: mockSegments
    });
    
    // Verify the correct API endpoints were called
    expect(api.get).toHaveBeenCalledWith('/api/v1/analytics/metrics?timeRange=30d');
    expect(api.get).toHaveBeenCalledWith('/api/v1/campaigns?timeRange=30d');
    expect(api.get).toHaveBeenCalledWith('/api/v1/analytics/channels/effectiveness?timeRange=30d');
    expect(api.get).toHaveBeenCalledWith('/api/v1/analytics/segments/performance?timeRange=30d');
  });

  // Test 2: Should use mock data when not authenticated
  test('uses mock data when not authenticated', async () => {
    // Mock unauthenticated session
    useSession.mockReturnValue({
      data: null,
      status: 'unauthenticated'
    });

    const { result, waitForNextUpdate } = renderHook(() => useInsights('30d'));
    
    await waitForNextUpdate();
    
    expect(result.current.loading).toBe(false);
    expect(result.current.data).not.toBe(null);
    
    // API should not be called if not authenticated
    const api = useApi();
    expect(api.get).not.toHaveBeenCalled();
  });

  // Test 3: Should use mock data for specific endpoints that return errors
  test('uses mock data for specific endpoints that return errors', async () => {
    const api = useApi();
    api.get
      .mockResolvedValueOnce({ data: { success: true, data: mockKeyMetrics } })
      .mockResolvedValueOnce(mockErrorResponse) // campaigns error
      .mockResolvedValueOnce({ data: { success: true, data: mockChannels } })
      .mockResolvedValueOnce({ data: { success: true, data: mockSegments } });

    const { result, waitForNextUpdate } = renderHook(() => useInsights('30d'));
    
    await waitForNextUpdate();
    
    expect(result.current.loading).toBe(false);
    expect(result.current.error).not.toBe(null);
    
    // All endpoints should fall back to mock data if any endpoint has an error
    expect(result.current.data).not.toBeNull();
  });

  // Test 4: Should use mock data when 401 unauthorized response
  test('uses mock data when API returns 401 unauthorized', async () => {
    const api = useApi();
    api.get
      .mockResolvedValueOnce(mockUnauthorizedResponse) // Unauthorized response
      .mockResolvedValueOnce({ data: { success: true, data: mockCampaigns } })
      .mockResolvedValueOnce({ data: { success: true, data: mockChannels } })
      .mockResolvedValueOnce({ data: { success: true, data: mockSegments } });

    const { result, waitForNextUpdate } = renderHook(() => useInsights('30d'));
    
    await waitForNextUpdate();
    
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe('Authentication required. Using mock data instead.');
    expect(result.current.data).not.toBeNull();
  });

  // Test 5: Should use cached data when available
  test('uses cached data when available', async () => {
    const api = useApi();
    
    // First render - will fetch from API
    const { result, waitForNextUpdate } = renderHook(() => useInsights('30d'));
    
    await waitForNextUpdate();
    
    expect(api.get).toHaveBeenCalledTimes(4); // Four endpoints called
    
    // Reset mock to track if API is called again
    api.get.mockClear();
    
    // Second render with same timeRange - should use cache
    const { result: result2, waitForNextUpdate: waitForNextUpdate2 } = renderHook(() => useInsights('30d'));
    
    await waitForNextUpdate2();
    
    // API should not be called again
    expect(api.get).not.toHaveBeenCalled();
  });
}); 