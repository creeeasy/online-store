import type { IProductStats } from "../types/product";

// utils/api.ts
export const API_BASE_URL = 'http://localhost:5001/api';

// Enhanced error types
export interface ApiError {
  message: string;
  errors?: Array<{
    msg: string;
    param: string;
    location: string;
    value?: any;
  }>;
  status?: number;
  code?: string;
}

// Helper function to get auth headers
export const getAuthHeaders = (includeContentType = true) => {
  const token = localStorage.getItem('token');
  const headers: Record<string, string> = {};
  
  if (includeContentType) {
    headers['Content-Type'] = 'application/json';
  }
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  return headers;
};

// Enhanced API response wrapper
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  errors?: Array<{
    msg: string;
    param: string;
    location: string;
    value?: any;
  }>;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

// Enhanced error handling utility
export const createApiError = (response: Response, errorData: any): ApiError => {
  const apiError: ApiError = {
    message: errorData.message || `HTTP ${response.status}: ${response.statusText}`,
    status: response.status,
  };

  // Handle validation errors from express-validator
  if (errorData.errors && Array.isArray(errorData.errors)) {
    apiError.errors = errorData.errors;
  }

  // Handle specific error codes
  switch (response.status) {
    case 400:
      apiError.message = errorData.message || 'Bad Request - Please check your input';
      break;
    case 401:
      apiError.message = 'Unauthorized - Please log in again';
      apiError.code = 'UNAUTHORIZED';
      break;
    case 403:
      apiError.message = 'Forbidden - You do not have permission to perform this action';
      apiError.code = 'FORBIDDEN';
      break;
    case 404:
      apiError.message = errorData.message || 'Resource not found';
      apiError.code = 'NOT_FOUND';
      break;
    case 409:
      apiError.message = errorData.message || 'Conflict - Resource already exists';
      apiError.code = 'CONFLICT';
      break;
    case 422:
      apiError.message = errorData.message || 'Validation failed';
      apiError.code = 'VALIDATION_ERROR';
      break;
    case 429:
      apiError.message = 'Too many requests - Please try again later';
      apiError.code = 'RATE_LIMITED';
      break;
    case 500:
      apiError.message = 'Internal server error - Please try again later';
      apiError.code = 'SERVER_ERROR';
      break;
    default:
      apiError.message = errorData.message || 'An unexpected error occurred';
  }

  return apiError;
};

// Generic API call function with enhanced error handling
export const apiCall = async <T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  try {
    const response = await fetch(url, {
      headers: getAuthHeaders(),
      ...options,
    });

    let responseData: any = {};
    
    // Try to parse JSON response
    try {
      responseData = await response.json();
    } catch (parseError) {
      // If JSON parsing fails, create a basic error response
      responseData = {
        success: false,
        message: 'Invalid server response',
      };
    }

    // Handle HTTP errors
    if (!response.ok) {
      // Handle unauthorized - clear stored auth data
      if (response.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('adminUser');
        // Optionally redirect to login
        if (typeof window !== 'undefined' && window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
      }
      
      const apiError = createApiError(response, responseData);
      throw apiError;
    }

    return responseData;
  } catch (error) {
    // Handle network errors
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw {
        message: 'Network error - Please check your internet connection',
        status: 0,
        code: 'NETWORK_ERROR',
      } as ApiError;
    }
    
    // Re-throw API errors
    if (error && typeof error === 'object' && 'status' in error) {
      throw error;
    }
    
    // Handle unknown errors
    throw {
      message: error instanceof Error ? error.message : 'An unexpected error occurred',
      status: 500,
      code: 'UNKNOWN_ERROR',
    } as ApiError;
  }
};

// Request timeout wrapper
export const apiCallWithTimeout = async <T = any>(
  endpoint: string,
  options: RequestInit = {},
  timeoutMs: number = 10000
): Promise<ApiResponse<T>> => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  
  try {
    const result = await apiCall<T>(endpoint, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    return result;
  } catch (error) {
    clearTimeout(timeoutId);
    
    if (error instanceof Error && error.name === 'AbortError') {
      throw {
        message: 'Request timeout - Please try again',
        status: 408,
        code: 'TIMEOUT',
      } as ApiError;
    }
    
    throw error;
  }
};

// Specific API functions with enhanced error handling
export const authAPI = {
  login: async (credentials: { email: string; password: string }) => {
    return apiCall('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  },

  register: async (userData: { 
    username: string; 
    email: string; 
    password: string; 
    role?: string 
  }) => {
    return apiCall('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  getMe: async () => {
    return apiCall('/auth/me');
  },

  validateToken: async () => {
    return apiCall('/auth/validate');
  },

  logout: async () => {
    return apiCall('/auth/logout', {
      method: 'POST',
    });
  },
};

export const productAPI = {
  getProducts: (params?: any) => {
    const queryParams = params ? new URLSearchParams(
      Object.entries(params).reduce((acc, [key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          acc[key] = String(value);
        }
        return acc;
      }, {} as Record<string, string>)
    ).toString() : '';
    
    return apiCall(`/products${queryParams ? `?${queryParams}` : ''}`);
  },

  getProduct: (id: string) => {
    if (!id) {
      throw {
        message: 'Product ID is required',
        status: 400,
        code: 'MISSING_ID',
      } as ApiError;
    }
    return apiCall(`/products/${id}`);
  },

  createProduct: (productData: any) => {
    if (!productData) {
      throw {
        message: 'Product data is required',
        status: 400,
        code: 'MISSING_DATA',
      } as ApiError;
    }
    
    return apiCallWithTimeout('/products', {
      method: 'POST',
      body: JSON.stringify(productData),
    }, 15000); // 15 second timeout for create operations
  },

  updateProduct: (id: string, productData: any) => {
    if (!id) {
      throw {
        message: 'Product ID is required',
        status: 400,
        code: 'MISSING_ID',
      } as ApiError;
    }
    
    if (!productData) {
      throw {
        message: 'Product data is required',
        status: 400,
        code: 'MISSING_DATA',
      } as ApiError;
    }
    
    return apiCallWithTimeout(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(productData),
    }, 15000); // 15 second timeout for update operations
  },

  deleteProduct: (id: string) => {
    if (!id) {
      throw {
        message: 'Product ID is required',
        status: 400,
        code: 'MISSING_ID',
      } as ApiError;
    }
    
    return apiCall(`/products/${id}`, {
      method: 'DELETE',
    });
  },

  searchProducts: (params: any) => {
    const queryParams = params ? new URLSearchParams(
      Object.entries(params).reduce((acc, [key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          acc[key] = String(value);
        }
        return acc;
      }, {} as Record<string, string>)
    ).toString() : '';
    
    return apiCall(`/products/search${queryParams ? `?${queryParams}` : ''}`);
  },

 getProductStats: () => {
  return apiCall<IProductStats>('/products/stats/overview');
},

  bulkUpdateProducts: (productIds: string[], updateData: any) => {
    if (!productIds || productIds.length === 0) {
      throw {
        message: 'Product IDs are required',
        status: 400,
        code: 'MISSING_IDS',
      } as ApiError;
    }
    
    if (!updateData) {
      throw {
        message: 'Update data is required',
        status: 400,
        code: 'MISSING_DATA',
      } as ApiError;
    }
    
    return apiCallWithTimeout('/products/bulk', {
      method: 'PATCH',
      body: JSON.stringify({ productIds, updateData }),
    }, 20000); // 20 second timeout for bulk operations
  },
};

// Utility functions for error handling in components
export const getErrorMessage = (error: any): string => {
  if (error?.message) {
    return error.message;
  }
  
  if (error?.errors && Array.isArray(error.errors) && error.errors.length > 0) {
    return error.errors[0].msg || 'Validation error occurred';
  }
  
  return 'An unexpected error occurred';
};

export const getFieldErrors = (error: any): Record<string, string> => {
  const fieldErrors: Record<string, string> = {};
  
  if (error?.errors && Array.isArray(error.errors)) {
    error.errors.forEach((err: any) => {
      if (err.param) {
        fieldErrors[err.param] = err.msg;
      }
    });
  }
  
  return fieldErrors;
};

export const isNetworkError = (error: any): boolean => {
  return error?.code === 'NETWORK_ERROR' || error?.status === 0;
};

export const isAuthError = (error: any): boolean => {
  return error?.status === 401 || error?.code === 'UNAUTHORIZED';
};

export const isValidationError = (error: any): boolean => {
  return error?.status === 400 || error?.status === 422 || error?.code === 'VALIDATION_ERROR';
};
