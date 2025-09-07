import { toast as reactToast, type ToastOptions, Slide } from 'react-toastify';
import { FiCheckCircle, FiAlertCircle, FiInfo, FiXCircle } from 'react-icons/fi';
import React from 'react';

// Custom toast configuration with red theme
export const toastConfig: ToastOptions = {
  position: 'top-right',
  autoClose: 5000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
  theme: 'light',
  transition: Slide,
};

// Custom toast icons and styling
const ToastIcon: React.FC<{ type: 'success' | 'error' | 'info' | 'warning' }> = ({ type }) => {
  const iconProps = { size: 20 };
  
  switch (type) {
    case 'success':
      return <FiCheckCircle {...iconProps} className="text-green-500" />;
    case 'error':
      return <FiXCircle {...iconProps} className="text-red-500" />;
    case 'warning':
      return <FiAlertCircle {...iconProps} className="text-amber-500" />;
    case 'info':
      return <FiInfo {...iconProps} className="text-blue-500" />;
    default:
      return <FiInfo {...iconProps} className="text-gray-500" />;
  }
};

// Custom toast wrapper with enhanced functionality
export const toast = {
  success: (message: string, options?: ToastOptions) => {
    return reactToast.success(
      <div className="flex items-center gap-3">
        <ToastIcon type="success" />
        <span className="text-gray-800 font-medium">{message}</span>
      </div>,
      {
        ...toastConfig,
        className: 'border-l-4 border-green-500 bg-white shadow-lg',
        progressClassName: 'bg-green-500',
        ...options,
      }
    );
  },

  error: (message: string, options?: ToastOptions) => {
    return reactToast.error(
      <div className="flex items-center gap-3">
        <ToastIcon type="error" />
        <span className="text-gray-800 font-medium">{message}</span>
      </div>,
      {
        ...toastConfig,
        className: 'border-l-4 border-red-500 bg-white shadow-lg',
        progressClassName: 'bg-red-500',
        autoClose: 7000, // Longer duration for errors
        ...options,
      }
    );
  },

  warning: (message: string, options?: ToastOptions) => {
    return reactToast.warning(
      <div className="flex items-center gap-3">
        <ToastIcon type="warning" />
        <span className="text-gray-800 font-medium">{message}</span>
      </div>,
      {
        ...toastConfig,
        className: 'border-l-4 border-amber-500 bg-white shadow-lg',
        progressClassName: 'bg-amber-500',
        ...options,
      }
    );
  },

  info: (message: string, options?: ToastOptions) => {
    return reactToast.info(
      <div className="flex items-center gap-3">
        <ToastIcon type="info" />
        <span className="text-gray-800 font-medium">{message}</span>
      </div>,
      {
        ...toastConfig,
        className: 'border-l-4 border-blue-500 bg-white shadow-lg',
        progressClassName: 'bg-blue-500',
        ...options,
      }
    );
  },

  // Enhanced error toast with detailed error information
  apiError: (error: any, options?: ToastOptions) => {
    let message = 'An error occurred';
    let details: string[] = [];

    if (error?.message) {
      message = error.message;
    }

    if (error?.errors && Array.isArray(error.errors)) {
      details = error.errors.map((err: any) => err.msg || err.message || 'Validation error');
    }

    if (details.length > 0) {
      return reactToast.error(
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <ToastIcon type="error" />
            <span className="text-gray-800 font-medium">{message}</span>
          </div>
          <div className="pl-8">
            <ul className="text-sm text-gray-600 space-y-1">
              {details.slice(0, 3).map((detail, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-red-500 mr-2">•</span>
                  <span>{detail}</span>
                </li>
              ))}
              {details.length > 3 && (
                <li className="text-gray-500 italic">
                  and {details.length - 3} more error{details.length - 3 !== 1 ? 's' : ''}
                </li>
              )}
            </ul>
          </div>
        </div>,
        {
          ...toastConfig,
          className: 'border-l-4 border-red-500 bg-white shadow-lg min-w-96',
          progressClassName: 'bg-red-500',
          autoClose: 10000, // Longer duration for detailed errors
          ...options,
        }
      );
    } else {
      return toast.error(message, options);
    }
  },

  // Loading toast that can be updated
  loading: (message: string = 'Processing...') => {
    return reactToast.loading(
      <div className="flex items-center gap-3">
        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-red-500" />
        <span className="text-gray-800 font-medium">{message}</span>
      </div>,
      {
        ...toastConfig,
        className: 'border-l-4 border-red-500 bg-white shadow-lg',
        autoClose: false,
        closeButton: false,
      }
    );
  },

  // Update an existing toast
  update: (toastId: any, type: 'success' | 'error' | 'info' | 'warning', message: string) => {
    const updateOptions = {
      render: (
        <div className="flex items-center gap-3">
          <ToastIcon type={type} />
          <span className="text-gray-800 font-medium">{message}</span>
        </div>
      ),
      type,
      isLoading: false,
      autoClose: toastConfig.autoClose,
      closeButton: true,
    };

    return reactToast.update(toastId, updateOptions);
  },

  // Promise-based toast for async operations
  promise: <T,>(
    promise: Promise<T>,
    messages: {
      pending: string;
      success: string | ((data: T) => string);
      error: string | ((error: any) => string);
    },
    options?: ToastOptions
  ) => {
    return reactToast.promise(
      promise,
      {
        pending: {
          render: (
            <div className="flex items-center gap-3">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-red-500" />
              <span className="text-gray-800 font-medium">{messages.pending}</span>
            </div>
          ),
          className: 'border-l-4 border-red-500 bg-white shadow-lg',
        },
        success: {
          render: ({ data }) => {
            const message = typeof messages.success === 'function' 
              ? messages.success(data as T) 
              : messages.success;
            return (
              <div className="flex items-center gap-3">
                <ToastIcon type="success" />
                <span className="text-gray-800 font-medium">{message}</span>
              </div>
            );
          },
          className: 'border-l-4 border-green-500 bg-white shadow-lg',
          progressClassName: 'bg-green-500',
        },
        error: {
          render: ({ data: error }) => {
            const message = typeof messages.error === 'function' 
              ? messages.error(error) 
              : messages.error;
            return (
              <div className="flex items-center gap-3">
                <ToastIcon type="error" />
                <span className="text-gray-800 font-medium">{message}</span>
              </div>
            );
          },
          className: 'border-l-4 border-red-500 bg-white shadow-lg',
          progressClassName: 'bg-red-500',
          autoClose: 7000,
        },
      },
      {
        ...toastConfig,
        ...options,
      }
    );
  },

  // Dismiss all toasts
  dismiss: () => {
    reactToast.dismiss();
  },

  // Dismiss a specific toast
  dismissById: (toastId: any) => {
    reactToast.dismiss(toastId);
  },
};

// CSS classes for ToastContainer (to be added to your global CSS)
export const toastContainerStyles = `
  /* Toast Container Styles */
  .Toastify__toast-container {
    width: auto;
    min-width: 320px;
    max-width: 500px;
  }

  .Toastify__toast {
    border-radius: 12px;
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
    border: 1px solid #e5e7eb;
    font-family: inherit;
    margin-bottom: 12px;
  }

  .Toastify__toast--success {
    background: white;
  }

  .Toastify__toast--error {
    background: white;
  }

  .Toastify__toast--warning {
    background: white;
  }

  .Toastify__toast--info {
    background: white;
  }

  .Toastify__progress-bar--success {
    background: #10b981;
  }

  .Toastify__progress-bar--error {
    background: #ef4444;
  }

  .Toastify__progress-bar--warning {
    background: #f59e0b;
  }

  .Toastify__progress-bar--info {
    background: #3b82f6;
  }

  .Toastify__close-button {
    color: #6b7280;
    opacity: 0.7;
  }

  .Toastify__close-button:hover {
    opacity: 1;
  }
`;

// React component to initialize toast container
export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <>
      {children}
      <style dangerouslySetInnerHTML={{ __html: toastContainerStyles }} />
    </>
  );
};