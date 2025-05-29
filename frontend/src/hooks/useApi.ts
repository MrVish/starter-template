import { useState, useCallback, useRef, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import axios, { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';

// API base URL
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

// Create a custom axios instance with CORS settings
const apiClient = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Define types for our hook
interface ApiResponse<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  status: number | null;
}

// Define custom error response type
interface ErrorResponse {
  message?: string;
  error?: string;
  success?: boolean;
}

type RequestMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

export function useApi<T = any>() {
  const { data: session } = useSession();
  const [state, setState] = useState<ApiResponse<T>>({
    data: null,
    loading: false,
    error: null,
    status: null,
  });
  
  // Use a ref to track if the component is mounted
  const isMounted = useRef(true);
  
  // Set isMounted to false when the component unmounts
  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  // Create headers with authentication
  const getHeaders = useCallback((method: RequestMethod = 'GET') => {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };

    // Only add Authorization header for mutating methods or if we have a session
    const isMutating = method !== 'GET';
    if (session?.accessToken) {
      try {
        // Add token only if it's a valid JWT (simple format validation)
        const tokenParts = session.accessToken.split('.');
        if (tokenParts.length === 3) {
          headers['Authorization'] = `Bearer ${session.accessToken}`;
        } else {
          console.warn('Invalid token format, not adding Authorization header');
        }
      } catch (error) {
        console.warn('Error processing token, not adding Authorization header:', error);
      }
    }

    return headers;
  }, [session]);

  // Generic request function
  const request = useCallback(
    async <R = T>(
      method: RequestMethod,
      endpoint: string,
      data?: any,
      config?: Omit<AxiosRequestConfig, 'method' | 'url' | 'data' | 'headers'>
    ): Promise<ApiResponse<R>> => {
      // Only update state if the component is still mounted
      if (isMounted.current) {
        setState((prev) => ({ ...prev, loading: true, error: null }));
      }

      try {
        const url = endpoint.startsWith('http')
          ? endpoint
          : endpoint.startsWith('/') ? endpoint : `/${endpoint}`;

        console.log(`🔄 API ${method} Request:`, API_URL + url);
        
        const response: AxiosResponse<R> = await apiClient({
          method,
          url,
          data,
          headers: getHeaders(method),
          withCredentials: true,
          // Ensure CORS credentials
          xsrfCookieName: 'XSRF-TOKEN',
          xsrfHeaderName: 'X-XSRF-TOKEN',
          ...config,
        });

        console.log(`✅ API ${method} Response:`, url, response.status, response.data ? 'has data' : 'no data');
        
        const result: ApiResponse<R> = {
          data: response.data,
          loading: false,
          error: null,
          status: response.status,
        };

        // Only update state if the component is still mounted
        if (isMounted.current) {
          setState(result as unknown as ApiResponse<T>);
        }

        return result;
      } catch (err) {
        console.error(`❌ API ${method} Error for ${endpoint}:`, err);
        
        const error = err as AxiosError<ErrorResponse>;
        let errorData: any = null;
        let errorMessage = 'An unknown error occurred';
        
        // Check if we have a response
        if (error.response) {
          try {
            // Handle string, object or invalid JSON responses
            if (typeof error.response.data === 'string') {
              try {
                errorData = JSON.parse(error.response.data);
              } catch {
                errorData = { message: error.response.data };
              }
            } else {
              errorData = error.response.data;
            }
            
            // Extract error message
            errorMessage = 
              errorData?.message || 
              errorData?.error || 
              error.message ||
              'Server error';
              
            // If the error has data but it's marked as successful, still return that data
            if (errorData?.success === true && errorData?.data) {
              console.log(`⚠️ API returned success=true with error status ${error.response?.status}`, errorData);
              
              const result: ApiResponse<R> = {
                data: errorData.data as R,
                loading: false,
                error: null, // No error since we could get data
                status: error.response?.status || null,
              };
              
              // Only update state if the component is still mounted
              if (isMounted.current) {
                setState(result as unknown as ApiResponse<T>);
              }
              
              return result;
            }
          } catch (e) {
            console.error('Error parsing API error response:', e);
          }
        } else if (error.request) {
          // Request was made but no response
          errorMessage = 'No response from server';
        } else {
          // Something else happened
          errorMessage = error.message || 'Request configuration error';
        }

        const result: ApiResponse<R> = {
          data: (errorData?.data as R) || null, // Include any data if available
          loading: false,
          error: errorMessage,
          status: error.response?.status || null,
        };

        // Only update state if the component is still mounted
        if (isMounted.current) {
          setState(result as unknown as ApiResponse<T>);
        }

        return result;
      }
    },
    [getHeaders]
  );

  // Define convenience methods for different HTTP methods
  const get = useCallback(
    <R = T>(
      endpoint: string,
      config?: Omit<AxiosRequestConfig, 'method' | 'url' | 'headers'>
    ) => request<R>('GET', endpoint, undefined, config),
    [request]
  );

  const post = useCallback(
    <R = T>(
      endpoint: string,
      data?: any,
      config?: Omit<AxiosRequestConfig, 'method' | 'url' | 'data' | 'headers'>
    ) => request<R>('POST', endpoint, data, config),
    [request]
  );

  const put = useCallback(
    <R = T>(
      endpoint: string,
      data?: any,
      config?: Omit<AxiosRequestConfig, 'method' | 'url' | 'data' | 'headers'>
    ) => request<R>('PUT', endpoint, data, config),
    [request]
  );

  const patch = useCallback(
    <R = T>(
      endpoint: string,
      data?: any,
      config?: Omit<AxiosRequestConfig, 'method' | 'url' | 'data' | 'headers'>
    ) => request<R>('PATCH', endpoint, data, config),
    [request]
  );

  const del = useCallback(
    <R = T>(
      endpoint: string,
      config?: Omit<AxiosRequestConfig, 'method' | 'url' | 'headers'>
    ) => request<R>('DELETE', endpoint, undefined, config),
    [request]
  );

  return {
    ...state,
    request,
    get,
    post,
    put,
    patch,
    del,
  };
}

export default useApi; 