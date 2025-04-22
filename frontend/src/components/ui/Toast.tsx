import { useToast as useChakraToast, UseToastOptions } from '@chakra-ui/react';
import { useCallback } from 'react';

// Custom Toast Hook with predefined styles
export const useToast = () => {
  const toast = useChakraToast();
  
  // Default configuration
  const defaultConfig: UseToastOptions = {
    position: 'top-right',
    duration: 5000,
    isClosable: true,
    variant: 'solid',
  };
  
  // Success toast
  const success = useCallback((title: string, description?: string, options?: UseToastOptions) => {
    toast({
      title,
      description,
      status: 'success',
      ...defaultConfig,
      ...options,
    });
  }, [toast]);
  
  // Error toast
  const error = useCallback((title: string, description?: string, options?: UseToastOptions) => {
    toast({
      title,
      description,
      status: 'error',
      ...defaultConfig,
      ...options,
    });
  }, [toast]);
  
  // Info toast
  const info = useCallback((title: string, description?: string, options?: UseToastOptions) => {
    toast({
      title,
      description,
      status: 'info',
      ...defaultConfig,
      ...options,
    });
  }, [toast]);
  
  // Warning toast
  const warning = useCallback((title: string, description?: string, options?: UseToastOptions) => {
    toast({
      title,
      description,
      status: 'warning',
      ...defaultConfig,
      ...options,
    });
  }, [toast]);
  
  // Loading toast (custom)
  const loading = useCallback((title: string, description?: string, options?: UseToastOptions) => {
    return toast({
      title,
      description,
      status: 'loading',
      duration: null, // Loading toasts don't auto-dismiss
      ...defaultConfig,
      ...options,
    });
  }, [toast]);
  
  // Custom toast with glass morphism effect
  const glass = useCallback((title: string, description?: string, options?: UseToastOptions) => {
    toast({
      title,
      description,
      ...defaultConfig,
      ...options,
      variant: 'subtle',
      containerStyle: {
        background: 'rgba(255, 255, 255, 0.8)',
        backdropFilter: 'blur(10px)',
        borderRadius: '1rem',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
      },
    });
  }, [toast]);
  
  return {
    success,
    error,
    info,
    warning,
    loading,
    glass,
    // Original toast function for advanced cases
    toast,
  };
};

// Usage example:
/*
import { useToast } from '@/components/ui/Toast';

const Component = () => {
  const toast = useToast();
  
  const handleClick = () => {
    toast.success('Operation successful', 'Your changes have been saved.');
    // or
    toast.error('Error occurred', 'Please try again later.');
    // or
    toast.glass('Welcome back!', 'Your session has been restored.');
  };
  
  return <Button onClick={handleClick}>Submit</Button>;
};
*/ 