import type { ApiConfig, ErrorResponse, RequestOptions, SuccessResponse } from "../types/api";




class ApiClient {
  private baseURL: string;
  private defaultHeaders: Record<string, string>;
  private timeout: number;
  private authToken: string | null = null;

  constructor(config: ApiConfig = {}) {
    this.baseURL = config.baseURL || 'http://localhost:5001/api';
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      ...config.headers,
    };
    this.timeout = config.timeout || 10000;
    
    // Initialize token from storage
    this.initializeToken();
  }

  // Initialize token from localStorage
  private initializeToken() {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('authToken');
      if (token) {
        this.authToken = token;
      }
    }
  }

  // Set authentication token
  public setAuthToken(token: string | null) {
    this.authToken = token;
    
    // Persist token to storage
    if (typeof window !== 'undefined') {
      if (token) {
        localStorage.setItem('authToken', token);
      } else {
        localStorage.removeItem('authToken');
      }
    }
  }

  // Get authentication token
  public getAuthToken(): string | null {
    return this.authToken;
  }

  // Clear authentication token
  public clearAuthToken() {
    this.setAuthToken(null);
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
    requestOptions: RequestOptions = {}
  ): Promise<SuccessResponse<T>> {
    const {
      headers: customHeaders = {},
      params,
      timeout = this.timeout,
      signal,
    } = requestOptions;

    const controller = new AbortController();
    const abortSignal = signal || controller.signal;

    // Set timeout
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      // Build URL with query params
      let url = `${this.baseURL}${endpoint}`;
      if (params && Object.keys(params).length > 0) {
        const searchParams = new URLSearchParams();
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            searchParams.append(key, String(value));
          }
        });
        url += `?${searchParams.toString()}`;
      }

      // Add authorization header if token exists
      const headers: Record<string, string> = {
        ...this.defaultHeaders,
        ...customHeaders,
        ...options.headers,
      };

      if (this.authToken) {
        headers['Authorization'] = `Bearer ${this.authToken}`;
      }

      const response = await fetch(url, {
        ...options,
        headers,
        signal: abortSignal,
        credentials: 'include',
      });

      clearTimeout(timeoutId);

      // Handle unauthorized responses
      if (response.status === 401) {
        this.clearAuthToken();
        // You might want to redirect to login here
        window.location.href = '/login';
        throw new ApiError('Authentication required', 401);
      }

      const data = await response.json();

      if (!response.ok) {
        const errorData = data as ErrorResponse;
        throw this.createApiError(errorData, response.status);
      }

      return data as SuccessResponse<T>;
    } catch (error) {
      clearTimeout(timeoutId);
      throw this.normalizeError(error);
    }
  }

  private createApiError(errorData: ErrorResponse, status: number): ApiError {
    return new ApiError(
      errorData.message || 'An error occurred',
      status,
      errorData.errors,
      errorData.errorCode
    );
  }

  private normalizeError(error: any): Error {
    if (error instanceof ApiError) {
      return error;
    }

    if (error.name === 'AbortError') {
      return new ApiError('Request timeout', 408);
    }

    if (error instanceof TypeError) {
      return new ApiError('Network error. Please check your connection.', 0);
    }

    return new ApiError(error.message || 'An unexpected error occurred', 0);
  }

  // HTTP Methods
  async get<T>(endpoint: string, options?: RequestOptions): Promise<SuccessResponse<T>> {
    return this.request<T>(endpoint, { method: 'GET' }, options);
  }

  async post<T>(endpoint: string, data?: any, options?: RequestOptions): Promise<SuccessResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    }, options);
  }

  async put<T>(endpoint: string, data?: any, options?: RequestOptions): Promise<SuccessResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    }, options);
  }

  async patch<T>(endpoint: string, data?: any, options?: RequestOptions): Promise<SuccessResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    }, options);
  }

  async delete<T>(endpoint: string, options?: RequestOptions): Promise<SuccessResponse<T>> {
    return this.request<T>(endpoint, { method: 'DELETE' }, options);
  }

  // File upload
  async upload<T>(endpoint: string, formData: FormData, options?: RequestOptions): Promise<SuccessResponse<T>> {
    const headers = {
      ...options?.headers,
      // Remove Content-Type for FormData to let browser set it
    };
    delete headers?.['Content-Type'];

    return this.request<T>(endpoint, {
      method: 'POST',
      body: formData,
    }, { ...options, headers });
  }
}

// Custom Error Class
export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public validationErrors?: ValidationErrorDetail[],
    public errorCode?: string
  ) {
    super(message);
    this.name = 'ApiError';
  }

  get isValidationError(): boolean {
    return !!this.validationErrors && this.validationErrors.length > 0;
  }

  get isNetworkError(): boolean {
    return this.status === 0;
  }

  get isTimeout(): boolean {
    return this.status === 408;
  }

  get isUnauthorized(): boolean {
    return this.status === 401;
  }

  get isForbidden(): boolean {
    return this.status === 403;
  }

  get isNotFound(): boolean {
    return this.status === 404;
  }

  getFieldError(field: string): string | undefined {
    return this.validationErrors?.find(error => error.field === field)?.message;
  }
}

// Create singleton instance
export const apiClient = new ApiClient();

// Export token management functions
export const setAuthToken = (token: string | null) => {
  apiClient.setAuthToken(token);
};

export const clearAuthToken = () => {
  apiClient.clearAuthToken();
};

export const getAuthToken = (): string | null => {
  return apiClient.getAuthToken();
};