import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import type { 
  OrderInquiry,
  OrderInquiryFilters, 
  CreateOrderInquiryRequest, 
  UpdateOrderInquiryRequest,
  OrderInquiryStats
} from '../types/orderInquiry';

// API Response interfaces matching your backend
interface BaseResponse {
  success: boolean;
  message: string;
  timestamp: string;
}

interface SuccessResponse<T = any> extends BaseResponse {
  success: true;
  data: T;
  pagination?: PaginationData;
}

interface ErrorResponse extends BaseResponse {
  success: false;
  errors?: ValidationErrorDetail[];
  errorCode?: string;
}

interface ValidationErrorDetail {
  field: string;
  message: string;
  value?: any;
  location: string;
}

interface PaginationData {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface ValidationError {
  field: string;
  message: string;
}

export interface EnhancedApiError {
  message: string;
  validationErrors?: ValidationError[];
  status: number;
  errorCode?: string;
}

// API utility functions
const API_BASE_URL ='http://localhost:5001/api';

const orderInquiryAPI = {
  async getInquiries(filters?: OrderInquiryFilters): Promise<{ inquiries: OrderInquiry[]; pagination: PaginationData }> {
    const params = new URLSearchParams();
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
          params.append(key, value.toString());
        }
      });
    }

    const response = await fetch(`${API_BASE_URL}/order-inquiries?${params}`);
    const result: SuccessResponse<OrderInquiry[]> = await response.json();
    
    if (!response.ok || !result.success) {
      throw new Error(result.message || 'Failed to fetch inquiries');
    }

    return {
      inquiries: result.data,
      pagination: result.pagination!
    };
  },

  async getInquiryById(id: string): Promise<OrderInquiry> {
    const response = await fetch(`${API_BASE_URL}/order-inquiries/${id}`);
    const result: SuccessResponse<{ inquiry: OrderInquiry }> = await response.json();
    
    if (!response.ok || !result.success) {
      throw new Error(result.message || 'Failed to fetch inquiry');
    }

    return result.data.inquiry;
  },

  async createInquiry(inquiryData: CreateOrderInquiryRequest): Promise<OrderInquiry> {
    const response = await fetch(`${API_BASE_URL}/order-inquiries/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(inquiryData),
    });

    const result: SuccessResponse<{ inquiry: OrderInquiry }> | ErrorResponse = await response.json();
    
    if (!response.ok || !result.success) {
      const errorResult = result as ErrorResponse;
      const error: any = new Error(errorResult.message || 'Failed to create inquiry');
      error.response = {
        status: response.status,
        data: errorResult
      };
      throw error;
    }

    return (result as SuccessResponse<{ inquiry: OrderInquiry }>).data.inquiry;
  },

  async updateInquiry(id: string, data: UpdateOrderInquiryRequest): Promise<OrderInquiry> {
    const response = await fetch(`${API_BASE_URL}/order-inquiries/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const result: SuccessResponse<{ inquiry: OrderInquiry }> | ErrorResponse = await response.json();
    
    if (!response.ok || !result.success) {
      const errorResult = result as ErrorResponse;
      const error: any = new Error(errorResult.message || 'Failed to update inquiry');
      error.response = {
        status: response.status,
        data: errorResult
      };
      throw error;
    }

    return (result as SuccessResponse<{ inquiry: OrderInquiry }>).data.inquiry;
  },

  async updateInquiryStatus(id: string, status: string, notes?: string): Promise<OrderInquiry> {
    const response = await fetch(`${API_BASE_URL}/order-inquiries/${id}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status, notes }),
    });

    const result: SuccessResponse<{ inquiry: OrderInquiry }> | ErrorResponse = await response.json();
    
    if (!response.ok || !result.success) {
      const errorResult = result as ErrorResponse;
      const error: any = new Error(errorResult.message || 'Failed to update inquiry status');
      error.response = {
        status: response.status,
        data: errorResult
      };
      throw error;
    }

    return (result as SuccessResponse<{ inquiry: OrderInquiry }>).data.inquiry;
  },

  async deleteInquiry(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/order-inquiries/${id}`, {
      method: 'DELETE',
    });

    const result: SuccessResponse | ErrorResponse = await response.json();
    
    if (!response.ok || !result.success) {
      const errorResult = result as ErrorResponse;
      throw new Error(errorResult.message || 'Failed to delete inquiry');
    }
  },

  async getInquiriesStats(): Promise<OrderInquiryStats> {
    const response = await fetch(`${API_BASE_URL}/order-inquiries/stats`);
    const result: SuccessResponse<OrderInquiryStats> = await response.json();
    
    if (!response.ok || !result.success) {
      throw new Error(result.message || 'Failed to fetch inquiry stats');
    }

    return result.data;
  },

  async bulkUpdateStatus(ids: string[], status: string): Promise<{ updatedCount: number }> {
    const response = await fetch(`${API_BASE_URL}/order-inquiries/bulk/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ids, status }),
    });

    const result: SuccessResponse<{ updatedCount: number }> | ErrorResponse = await response.json();
    
    if (!response.ok || !result.success) {
      const errorResult = result as ErrorResponse;
      throw new Error(errorResult.message || 'Failed to bulk update status');
    }

    return result.data;
  },

  async bulkDelete(ids: string[]): Promise<{ deletedCount: number }> {
    const response = await fetch(`${API_BASE_URL}/order-inquiries/bulk/delete`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ids }),
    });

    const result: SuccessResponse<{ deletedCount: number }> | ErrorResponse = await response.json();
    
    if (!response.ok || !result.success) {
      const errorResult = result as ErrorResponse;
      throw new Error(errorResult.message || 'Failed to bulk delete inquiries');
    }

    return result.data;
  }
};

// Enhanced error handler matching your backend format
const handleApiError = (error: any): EnhancedApiError => {
  console.error('API Error:', error);
  
  let errorMessage = 'An unexpected error occurred';
  let validationErrors: ValidationError[] = [];
  let errorCode: string | undefined;
  
  if (error.response?.data) {
    const data = error.response.data;
    errorMessage = data.message || errorMessage;
    errorCode = data.errorCode;
    
    // Handle validation errors from your backend format
    if (data.errors && Array.isArray(data.errors)) {
      validationErrors = data.errors.map((err: ValidationErrorDetail) => ({
        field: err.field,
        message: err.message
      }));
    }
  } else if (error.message) {
    errorMessage = error.message;
  }
  
  return {
    message: errorMessage,
    validationErrors,
    status: error.response?.status || 500,
    errorCode
  };
};

// React Query Hooks
export const useOrderInquiries = (filters?: OrderInquiryFilters) => {
  return useQuery({
    queryKey: ['order-inquiries', filters],
    queryFn: () => orderInquiryAPI.getInquiries(filters),
    retry: (failureCount, error: any) => {
      // Don't retry on 4xx errors (client errors)
      if (error?.response?.status >= 400 && error?.response?.status < 500) {
        return false;
      }
      return failureCount < 2;
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
    select: (data) => ({
      inquiries: data.inquiries,
      pagination: data.pagination
    })
  });
};

export const useOrderInquiry = (id: string) => {
  return useQuery({
    queryKey: ['order-inquiry', id],
    queryFn: () => orderInquiryAPI.getInquiryById(id),
    enabled: !!id,
    retry: (failureCount, error: any) => {
      if (error?.response?.status === 404) {
        return false; // Don't retry on 404
      }
      if (error?.response?.status >= 400 && error?.response?.status < 500) {
        return false;
      }
      return failureCount < 2;
    },
  });
};

export const useCreateOrderInquiry = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (inquiryData: CreateOrderInquiryRequest) => 
      orderInquiryAPI.createInquiry(inquiryData),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['order-inquiries'] });
      queryClient.invalidateQueries({ queryKey: ['order-inquiry-stats'] });
      toast.success('Inquiry submitted successfully! We will contact you soon.');
    },
    onError: (error: any) => {
      const apiError = handleApiError(error);
      
      // Show validation errors in console for debugging
      if (apiError.validationErrors && apiError.validationErrors.length > 0) {
        console.log('Validation errors:', apiError.validationErrors);
      }
      
      // Show toast for all errors, but validation errors will be handled in the form
      toast.error(apiError.message || 'Failed to submit inquiry. Please check the form for errors.');
    },
  });
};

export const useUpdateOrderInquiry = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateOrderInquiryRequest }) => 
      orderInquiryAPI.updateInquiry(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['order-inquiries'] });
      queryClient.invalidateQueries({ queryKey: ['order-inquiry', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['order-inquiry-stats'] });
      toast.success('Inquiry updated successfully!');
    },
    onError: (error: any) => {
      const apiError = handleApiError(error);
      
      // Only show toast for non-validation errors
      if (!apiError.validationErrors || apiError.validationErrors.length === 0) {
        toast.error(apiError.message);
      }
    },
  });
};

export const useUpdateOrderInquiryStatus = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, status, notes }: { id: string; status: string; notes?: string }) => 
      orderInquiryAPI.updateInquiryStatus(id, status, notes),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['order-inquiries'] });
      queryClient.invalidateQueries({ queryKey: ['order-inquiry', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['order-inquiry-stats'] });
      toast.success('Status updated successfully!');
    },
    onError: (error: any) => {
      const apiError = handleApiError(error);
      toast.error(apiError.message);
    },
  });
};

export const useDeleteOrderInquiry = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => orderInquiryAPI.deleteInquiry(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['order-inquiries'] });
      queryClient.invalidateQueries({ queryKey: ['order-inquiry-stats'] });
      toast.success('Inquiry deleted successfully!');
    },
    onError: (error: any) => {
      const apiError = handleApiError(error);
      toast.error(apiError.message);
    },
  });
};

export const useOrderInquiryStats = () => {
  return useQuery({
    queryKey: ['order-inquiry-stats'],
    queryFn: orderInquiryAPI.getInquiriesStats,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useBulkUpdateOrderInquiryStatus = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ ids, status }: { ids: string[]; status: string }) =>
      orderInquiryAPI.bulkUpdateStatus(ids, status),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['order-inquiries'] });
      queryClient.invalidateQueries({ queryKey: ['order-inquiry-stats'] });
      toast.success(`${data.updatedCount || 0} inquiries updated successfully!`);
    },
    onError: (error: any) => {
      const apiError = handleApiError(error);
      toast.error(apiError.message);
    },
  });
};

export const useBulkDeleteOrderInquiries = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (ids: string[]) => orderInquiryAPI.bulkDelete(ids),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['order-inquiries'] });
      queryClient.invalidateQueries({ queryKey: ['order-inquiry-stats'] });
      toast.success(`${data.deletedCount || 0} inquiries deleted successfully!`);
    },
    onError: (error: any) => {
      const apiError = handleApiError(error);
      toast.error(apiError.message);
    },
  });
};

// Product-specific inquiry hook
export const useProductInquiry = (productId?: string) => {
  const createInquiryMutation = useCreateOrderInquiry();
  
  const submitInquiry = async (
    customerData: Record<string, string>, 
    quantity: number, 
    selectedVariants?: Record<string, string>
  ) => {
    if (!productId) {
      throw new Error('Product ID is required');
    }
    
    const inquiryData: CreateOrderInquiryRequest = {
      productId,
      customerData: {
        name: customerData.name || '',
        phone: customerData.phone || '',
        reference: customerData.reference || '',
        ...customerData
      },
      quantity,
      selectedVariants: selectedVariants && Object.keys(selectedVariants).length > 0 
        ? selectedVariants 
        : undefined,
      notes: `Quantity: ${quantity}\nVariants: ${JSON.stringify(selectedVariants || {})}`
    };
    
    return createInquiryMutation.mutateAsync(inquiryData);
  };
  
  return {
    submitInquiry,
    isLoading: createInquiryMutation.isPending,
    isError: createInquiryMutation.isError,
    error: createInquiryMutation.error ? handleApiError(createInquiryMutation.error) : null,
    isSuccess: createInquiryMutation.isSuccess,
    validationErrors: createInquiryMutation.error 
      ? handleApiError(createInquiryMutation.error).validationErrors 
      : []
  };
};