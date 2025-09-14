import type { PaginationData, ValidationErrorDetail } from "./api";

export interface IProduct {
  _id: string;
  name: string;
  price: number;
  discountPrice?: number;
  description: string;
  images: string[];
  dynamicFields?: Array<{
    key: string;
    placeholder: string;
    isRequired: boolean;
  }>;
  predefinedFields?: Array<{
    category: string;
    options: string[];
    selectedOptions: string[];
    isActive: boolean;
  }>;
  offers?: Array<{
    title: string;
    discount: number;
    validUntil?: Date;
    isActive: boolean;
  }>;
  hiddenFields?: Array<{
    key: string;
    value: string;
  }>;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IProductStats {
  totalProducts: number;
  onSaleCount: number;
  withActiveOffers: number;
  categoryStats: Array<{
    _id: string;
    totalProducts: number;
  }>;
  recentProducts: IProduct[];
}

export interface ApiError {
  message: string;
  status: number;
  validationErrors?: ValidationErrorDetail[];
  errorCode?: string;
}

export interface ProductsResponse {
  success: boolean;
  message: string;
  data: IProduct[];
  timestamp: string;
  pagination?: PaginationData;
}

export interface ProductFilters {
  page?: number;
  limit?: number;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  onSale?: boolean;
  hasOffers?: boolean;
  q?: string;
}