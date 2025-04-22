import { createStandaloneToast, UseToastOptions } from '@chakra-ui/react';
import { theme } from '../theme';

const { toast: chakraToast } = createStandaloneToast({ theme });

type ToastPosition = 'top' | 'top-right' | 'top-left' | 'bottom' | 'bottom-right' | 'bottom-left';

interface ToastConfig {
  duration?: number;
  position?: ToastPosition;
  isClosable?: boolean;
}

const defaultConfig: ToastConfig = {
  duration: 5000,
  position: 'bottom-right',
  isClosable: true,
};

export const toast = {
  success: (title: string, description?: string, config?: ToastConfig) => {
    return chakraToast({
      title,
      description,
      status: 'success',
      variant: 'solid',
      ...defaultConfig,
      ...config,
    });
  },

  error: (title: string, description?: string, config?: ToastConfig) => {
    return chakraToast({
      title,
      description,
      status: 'error',
      variant: 'solid',
      ...defaultConfig,
      ...config,
    });
  },

  warning: (title: string, description?: string, config?: ToastConfig) => {
    return chakraToast({
      title,
      description,
      status: 'warning',
      variant: 'solid',
      ...defaultConfig,
      ...config,
    });
  },

  info: (title: string, description?: string, config?: ToastConfig) => {
    return chakraToast({
      title,
      description,
      status: 'info',
      variant: 'solid',
      ...defaultConfig,
      ...config,
    });
  },

  loading: (title: string, description?: string, config?: ToastConfig) => {
    return chakraToast({
      title,
      description,
      status: 'loading',
      variant: 'solid',
      duration: null, // Loading toasts don't auto-dismiss
      ...defaultConfig,
      ...config,
    });
  },

  update: (id: string | number, options: UseToastOptions) => {
    return chakraToast.update(id, options);
  },

  close: (id: string | number) => {
    return chakraToast.close(id);
  },

  closeAll: () => {
    return chakraToast.closeAll();
  },

  // Custom toast with loading that can be updated to success/error
  promise: <T,>(
    promise: Promise<T>,
    {
      loading = 'Loading...',
      success = 'Success!',
      error = 'An error occurred',
      config = {},
    }: {
      loading?: string;
      success?: string | ((data: T) => string);
      error?: string | ((err: any) => string);
      config?: ToastConfig;
    } = {}
  ) => {
    const id = toast.loading(loading, undefined, config);

    promise
      .then((data) => {
        const successMessage = typeof success === 'function' ? success(data) : success;
        toast.update(id, {
          title: successMessage,
          status: 'success',
          duration: defaultConfig.duration,
        });
        return data;
      })
      .catch((err) => {
        const errorMessage = typeof error === 'function' ? error(err) : error;
        toast.update(id, {
          title: errorMessage,
          status: 'error',
          duration: defaultConfig.duration,
        });
        throw err;
      });

    return promise;
  },
};

export default toast; 