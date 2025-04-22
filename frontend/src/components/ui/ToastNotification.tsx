import React from 'react';
import {
  useToast,
  ToastId,
  UseToastOptions,
  Box,
  Flex,
  Icon,
  CloseButton,
} from '@chakra-ui/react';
import { FiCheckCircle, FiAlertCircle, FiInfo, FiAlertTriangle } from 'react-icons/fi';

// Extended toast options
interface ToastOptions extends UseToastOptions {
  title?: string;
  description?: string;
  status?: 'info' | 'warning' | 'success' | 'error';
}

// Custom toast hook with predefined styles and methods
export const useNotification = () => {
  const toast = useToast();
  const toastIdRef = React.useRef<ToastId>();

  // Status icon mapping
  const statusIcons = {
    info: FiInfo,
    warning: FiAlertTriangle,
    success: FiCheckCircle,
    error: FiAlertCircle,
  };

  // Base toast configuration
  const baseConfig: ToastOptions = {
    position: 'top-right',
    duration: 5000,
    isClosable: true,
    variant: 'solid',
  };

  // Custom toast render function
  const renderToast = ({ title, description, status = 'info', ...rest }: ToastOptions) => {
    const IconComponent = statusIcons[status];
    
    return toast({
      ...baseConfig,
      ...rest,
      status,
      title,
      description,
      render: ({ onClose }) => (
        <Box
          p={4}
          bg="whiteAlpha.900"
          _dark={{ bg: 'gray.800' }}
          backdropFilter="blur(10px)"
          borderRadius="md"
          boxShadow="md"
          borderLeft="4px solid"
          borderLeftColor={`${status}.500`}
          maxWidth="sm"
        >
          <Flex align="center">
            <Icon as={IconComponent} color={`${status}.500`} boxSize={5} mr={3} />
            <Box flex="1">
              {title && (
                <Box fontWeight="bold" mb={description ? 1 : 0}>
                  {title}
                </Box>
              )}
              {description && <Box opacity={0.9}>{description}</Box>}
            </Box>
            <CloseButton onClick={onClose} />
          </Flex>
        </Box>
      ),
    });
  };

  // Helper methods for different notification types
  const showNotification = {
    success: (options: ToastOptions) => renderToast({ ...options, status: 'success' }),
    error: (options: ToastOptions) => renderToast({ ...options, status: 'error' }),
    warning: (options: ToastOptions) => renderToast({ ...options, status: 'warning' }),
    info: (options: ToastOptions) => renderToast({ ...options, status: 'info' }),
    custom: renderToast,
    closeAll: toast.closeAll,
    close: (id?: ToastId) => toast.close(id || toastIdRef.current),
  };

  return showNotification;
};

export default useNotification; 