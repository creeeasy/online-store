import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { ApiError } from '../types/product';
import type { 
  OrderInquiryFilters, 
  CreateOrderInquiryRequest, 
  UpdateOrderInquiryRequest 
} from '../types/orderInquiry';
import { toast } from 'react-toastify';
import orderInquiryAPI from '../utils/orderInquiryAPI';

export interface ValidationError {
  field: string;
  message: string;
}

export interface EnhancedApiError extends ApiError {
  validationErrors?: ValidationError[];
}

const handleApiError = (error: any): EnhancedApiError => {
  console.error('API Error:', error);
  
  let errorMessage = 'An unexpected error occurred';
  let validationErrors: ValidationError[] = [];
  
  if (error.response?.data) {
    const data = error.response.data;
    errorMessage = data.message || errorMessage;
    
    // Handle different error formats
    if (data.errors && Array.isArray(data.errors)) {
      validationErrors = data.errors.map((err: any) => ({
        field: err.field || err.param || '',
        message: err.msg || err.message || ''
      }));
    } else if (data.error) {
      // Handle single error object
      validationErrors = [{
        field: data.error.field || '',
        message: data.error.message || data.error.msg || ''
      }];
    }
  } else if (error.message) {
    errorMessage = error.message;
  }
  
  return {
    message: errorMessage,
    validationErrors,
    status: error.response?.status || 500
  };
};

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
      if (!apiError.errors || apiError.errors.length === 0) {
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
      toast.success(`${data.data?.updatedCount || 0} inquiries updated successfully!`);
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
      toast.success(`${data.data?.deletedCount || 0} inquiries deleted successfully!`);
    },
    onError: (error: any) => {
      const apiError = handleApiError(error);
      toast.error(apiError.message);
    },
  });
};

// Add this to hooks/useOrderInquiry.tsx
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