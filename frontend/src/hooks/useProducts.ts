import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { productAPI } from '../utils/productAPI';
import { toast } from 'react-toastify';
import type { ApiError } from '../utils/apiClient';
import type { IProduct, IProductStats, ProductFilters, ProductsResponse } from '../types/product';
import type { SuccessResponse } from '../types/api';

// Enhanced error handling utility
const handleApiError = (error: ApiError): ApiError => {
  console.error('API Error:', error);
  
  // Return the error as-is since our ApiError already has proper structure
  return error;
};

// Helper to extract validation error messages for a specific field
export const getFieldValidationError = (error: ApiError | null, field: string): string | undefined => {
  return error?.validationErrors?.find(err => err.field === field)?.message;
};

export const useProducts = (filters?: ProductFilters) => {
  return useQuery<ProductsResponse, ApiError>({
    queryKey: ['products', filters],
    queryFn: () => productAPI.getProducts(filters),
    retry: (failureCount, error: ApiError) => {
      if (error.status >= 400 && error.status < 500) {
        return false;
      }
      return failureCount < 2;
    },
    staleTime: 5 * 60 * 1000,
  });
};

export const useProduct = (id: string) => {
  return useQuery<IProduct, ApiError>({
    queryKey: ['product', id],
    queryFn: () => productAPI.getProduct(id),
    enabled: !!id,
    retry: (failureCount, error: ApiError) => {
      if (error.status >= 400 && error.status < 500) {
        return false;
      }
      return failureCount < 2;
    },
  });
};

export const useCreateProduct = () => {
  const queryClient = useQueryClient();
  
  return useMutation<IProduct, ApiError, Partial<IProduct>>({
    mutationFn: (productData) => productAPI.createProduct(productData),
    onSuccess: (data) => {
      // Invalidate products list and any related queries
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['product-stats'] });
      
      toast.success('Product created successfully!');
    },
    onError: (error: ApiError) => {
      const handledError = handleApiError(error);
      
      // Show toast for non-validation errors
      if (!handledError.validationErrors || handledError.validationErrors.length === 0) {
        toast.error(handledError.message);
      }
      
      // For validation errors, individual field errors will be handled in forms
    },
  });
};

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();
  
  return useMutation<IProduct, ApiError, { id: string; data: Partial<IProduct> }>({
    mutationFn: ({ id, data }) => productAPI.updateProduct(id, data),
    onSuccess: (data, variables) => {
      // Invalidate specific product and products list
      queryClient.invalidateQueries({ queryKey: ['product', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['product-stats'] });
      
      toast.success('Product updated successfully!');
    },
    onError: (error: ApiError) => {
      const handledError = handleApiError(error);
      
      if (!handledError.validationErrors || handledError.validationErrors.length === 0) {
        toast.error(handledError.message);
      }
    },
  });
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();
  
  return useMutation<{ deletedInquiry: IProduct }, ApiError, string>({
    mutationFn: (id) => productAPI.deleteProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['product-stats'] });
      
      toast.success('Product deleted successfully!');
    },
    onError: (error: ApiError) => {
      const handledError = handleApiError(error);
      toast.error(handledError.message);
    },
  });
};

export const useProductStats = () => {
  return useQuery<SuccessResponse<IProductStats>, ApiError>({
    queryKey: ['product-stats'],
    queryFn: productAPI.getProductStats,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useBulkUpdateProducts = () => {
  const queryClient = useQueryClient();
  
  return useMutation<{ modifiedCount: number; matchedCount: number }, ApiError, { 
    productIds: string[]; 
    updateData: any 
  }>({
    mutationFn: ({ productIds, updateData }) => 
      productAPI.bulkUpdateProducts(productIds, updateData),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['product-stats'] });
      
      toast.success(`${data.modifiedCount} products updated successfully!`);
    },
    onError: (error: ApiError) => {
      const handledError = handleApiError(error);
      toast.error(handledError.message);
    },
  });
};

export const useSearchProducts = () => {
  return useMutation<ProductsResponse, ApiError, ProductFilters>({
    mutationFn: (filters) => productAPI.searchProducts(filters),
  });
};

// NEW: Clone product mutation
export const useCloneProduct = () => {
  const queryClient = useQueryClient();
  
  return useMutation<IProduct, ApiError, { id: string; reference?: string }>({
    mutationFn: ({ id, reference }) => productAPI.cloneProduct(id, reference),
    onSuccess: (data) => {
      // Invalidate products list
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['product-stats'] });
      
      toast.success('Product cloned successfully!');
    },
    onError: (error: ApiError) => {
      const handledError = handleApiError(error);
      
      if (!handledError.validationErrors || handledError.validationErrors.length === 0) {
        toast.error(handledError.message);
      }
    },
  });
};

// NEW: Get wilayas list (static data)
export const useWilayas = () => {
  // This is a static query since wilayas don't change
  return useQuery<string[]>({
    queryKey: ['wilayas'],
    queryFn: async () => {
      // Return the predefined list of Algerian wilayas
      return [
        'Adrar', 'Chlef', 'Laghouat', 'Oum El Bouaghi', 'Batna', 'Béjaïa', 'Biskra', 'Béchar', 'Blida', 'Bouira',
        'Tamanrasset', 'Tébessa', 'Tlemcen', 'Tiaret', 'Tizi Ouzou', 'Algiers', 'Djelfa', 'Jijel', 'Sétif', 'Saïda',
        'Skikda', 'Sidi Bel Abbès', 'Annaba', 'Guelma', 'Constantine', 'Médéa', 'Mostaganem', 'M\'Sila', 'Mascara', 'Ouargla',
        'Oran', 'El Bayadh', 'Illizi', 'Bordj Bou Arréridj', 'Boumerdès', 'El Tarf', 'Tindouf', 'Tissemsilt', 'El Oued', 'Khenchela',
        'Souk Ahras', 'Tipaza', 'Mila', 'Aïn Defla', 'Naâma', 'Aïn Témouchent', 'Ghardaïa', 'Relizane', 'Timimoun', 'Bordj Badji Mokhtar',
        'Ouled Djellal', 'Béni Abbès', 'In Salah', 'In Guezzam', 'Touggourt', 'Djanet', 'El M\'Ghair', 'El Meniaa'
      ];
    },
    staleTime: Infinity, // Never stale since it's static data
  });
};