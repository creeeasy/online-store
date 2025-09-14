import type { SuccessResponse } from '../types/api';
import type { IProduct, IProductStats, ProductFilters, ProductsResponse } from '../types/product';
import { apiClient, ApiError } from './apiClient';

export const productAPI = {
  // Get all products with filtering
// utils/productAPI.ts
  getProducts: async (filters?: ProductFilters): Promise<SuccessResponse<ProductsResponse>> => {
    try {
      const response = await apiClient.get<ProductsResponse>('/products', {
        params: filters
      });
      console.log(response)
      return response; // Extract the data array
    } catch (error) {
      throw error as ApiError;
    }
  },

  // Get single product
  getProduct: async (id: string): Promise<IProduct> => {
    try {
      const response = await apiClient.get<{ product: IProduct }>(`/products/${id}`);
      return response.data.product;
    } catch (error) {
      throw error as ApiError;
    }
  },

  // Create product
  createProduct: async (productData: Partial<IProduct>): Promise<IProduct> => {
    try {
      const response = await apiClient.post<{ product: IProduct }>('/products', productData);
      return response.data.product;
    } catch (error) {
      throw error as ApiError;
    }
  },

  // Update product
  updateProduct: async (id: string, data: Partial<IProduct>): Promise<IProduct> => {
    try {
      const response = await apiClient.put<{ product: IProduct }>(`/products/${id}`, data);
      return response.data.product;
    } catch (error) {
      throw error as ApiError;
    }
  },

  // Delete product
  deleteProduct: async (id: string): Promise<{ deletedInquiry: IProduct }> => {
    try {
      const response = await apiClient.delete<{ deletedInquiry: IProduct }>(`/products/${id}`);
      return response.data;
    } catch (error) {
      throw error as ApiError;
    }
  },

  // Search products
  searchProducts: async (filters: ProductFilters): Promise<ProductsResponse> => {
    try {
      const response = await apiClient.get<ProductsResponse>('/products/search', {
        params: filters
      });
      return response.data;
    } catch (error) {
      throw error as ApiError;
    }
  },

  // Bulk update products
  bulkUpdateProducts: async (productIds: string[], updateData: any): Promise<{
    modifiedCount: number;
    matchedCount: number;
  }> => {
    try {
      const response = await apiClient.patch<{
        modifiedCount: number;
        matchedCount: number;
      }>('/products/bulk', { productIds, updateData });
      return response.data;
    } catch (error) {
      throw error as ApiError;
    }
  },

  // Get product statistics
  getProductStats: async (): Promise<SuccessResponse<IProductStats>> => {
    try {
      const response = await apiClient.get<SuccessResponse<IProductStats>>('/products/stats');
      return response.data;
    } catch (error) {
      throw error as ApiError;
    }
  }
};