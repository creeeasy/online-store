// types/api.ts
export interface BaseResponse {
  success: boolean;
  message: string;
  timestamp: string;
}

export interface SuccessResponse<T = any> extends BaseResponse {
  success: true;
  data: T;
  pagination?: PaginationData;
}

export interface ErrorResponse extends BaseResponse {
  success: false;
  errors?: ValidationErrorDetail[];
  errorCode?: string;
}

export interface ValidationErrorDetail {
  field: string;
  message: string;
  value?: any;
  location: string;
}

export interface PaginationData {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface ApiResponse<T = any> {
  data: T | null;
  error: string | null;
  validationErrors: ValidationErrorDetail[] | null;
  errorCode: string | null;
  isLoading: boolean;
  status: number | null;
}

export interface ApiConfig {
  baseURL?: string;
  timeout?: number;
  headers?: Record<string, string>;
}

export interface RequestOptions {
  headers?: Record<string, string>;
  params?: Record<string, any>;
  timeout?: number;
  signal?: AbortSignal;
}