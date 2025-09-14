import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { productAPI, type ApiResponse } from '../utils/api';
import type { ApiError, IProduct, IProductStats } from '../types/product';
import { toast } from 'react-toastify';

// Enhanced error handling utility
const handleApiError = (error: any): ApiError => {
  console.error('API Error:', error);
  
  let errorMessage = 'An unexpected error occurred';
  let validationErrors: Array<{ msg: string; param: string; location: string }> = [];
  
  if (error.response?.data) {
    const data = error.response.data;
    errorMessage = data.message || errorMessage;
    validationErrors = data.errors || [];
  } else if (error.message) {
    errorMessage = error.message;
  }
  
  return {
    message: errorMessage,
    errors: validationErrors,
    status: error.response?.status || 500
  };
};

export const useProducts = (params?: any) => {
  return useQuery({
    queryKey: ['products', params],
    queryFn: () => productAPI.getProducts(params),
    retry: (failureCount, error: any) => {
      // Don't retry on 4xx errors (client errors)
      if (error?.response?.status >= 400 && error?.response?.status < 500) {
        return false;
      }
      return failureCount < 2;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useProduct = (id: string) => {
  return useQuery({
    queryKey: ['product', id],
    queryFn: () => productAPI.getProduct(id),
    enabled: !!id,
    retry: (failureCount, error: any) => {
      if (error?.response?.status >= 400 && error?.response?.status < 500) {
        return false;
      }
      return failureCount < 2;
    },
  });
};

export const useCreateProduct = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (productData: Partial<IProduct>) => productAPI.createProduct(productData),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success('Product created successfully!');
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

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<IProduct> }) => 
      productAPI.updateProduct(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['product', variables.id] });
      toast.success('Product updated successfully!');
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

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => productAPI.deleteProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success('Product deleted successfully!');
    },
    onError: (error: any) => {
      const apiError = handleApiError(error);
      toast.error(apiError.message);
    },
  });
};

export const useProductStats = () => {
  return useQuery<ApiResponse<IProductStats>, ApiError>({
    queryKey: ['product-stats'],
    queryFn: productAPI.getProductStats,
    staleTime: 10 * 60 * 1000, // 10 minutes
    onError: (error) => {
      toast.error(error.message || 'Failed to fetch product statistics');
    },
  });
};

export const useBulkUpdateProducts = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ productIds, updateData }: { productIds: string[]; updateData: any }) =>
      productAPI.bulkUpdateProducts(productIds, updateData),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success(`${data.data?.modifiedCount || 0} products updated successfully!`);
    },
    onError: (error: any) => {
      const apiError = handleApiError(error);
      toast.error(apiError.message);
    },
  });
};