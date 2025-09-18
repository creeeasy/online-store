import type { PaginationData, ValidationErrorDetail } from "./api";

export interface IOffer {
  _id?: string;
  title: string;
  description?: string;
  discount: number;
  validUntil?: Date;
  isActive: boolean;
}

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
    _id?: string;
  }>;
  predefinedFields?: Array<{
    category: string;
    options: string[];
    selectedOptions: string[];
    isActive: boolean;
    _id?: string;
  }>;
  offers?: IOffer[];
  hiddenFields?: Array<{
    key: string;
    value: string;
    description?: string;
    _id?: string;
  }>;
  reference?: string; // Reference field for client source tracking
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IDynamicField {
  key: string;
  placeholder: string;
  _id?: string;
}

export interface IHiddenField {
  key: string;
  value: string;
  description: string;
  _id?: string;
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

// NEW: Clone product request interface
export interface CloneProductRequest {
  id: string;
  reference?: string;
}