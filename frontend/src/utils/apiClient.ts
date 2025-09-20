import type { ApiConfig, ErrorResponse, RequestOptions, SuccessResponse } from "../types/api";
export const SERVER_URL = "http://localhost:5001";

export const DEFAULT_BASE_URL = "http://localhost:5001/api";

class ApiClient {
  private baseURL: string;
  private defaultHeaders: Record<string, string>;
  private timeout: number;
  private authToken: string | null = null;

  constructor(config: ApiConfig = {}) {
    this.baseURL = config.baseURL || DEFAULT_BASE_URL;

    // ✅ Ensure Content-Type defaults to JSON if not provided
    this.defaultHeaders = {
      "Content-Type": "application/json",
      ...(config.headers || {}),
    };

    this.timeout = config.timeout || 10000;

    // Initialize token from storage
    this.initializeToken();
  }

  // Initialize token from localStorage
  private initializeToken() {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("authToken");
      if (token) this.authToken = token;
    }
  }

  // Token management
  public setAuthToken(token: string | null) {
    this.authToken = token;
    if (typeof window !== "undefined") {
      token ? localStorage.setItem("authToken", token) : localStorage.removeItem("authToken");
    }
  }

  public getAuthToken(): string | null {
    return this.authToken;
  }

  public clearAuthToken() {
    this.setAuthToken(null);
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
    requestOptions: RequestOptions = {}
  ): Promise<SuccessResponse<T>> {
    const { headers: customHeaders = {}, params, timeout = this.timeout, signal } = requestOptions;

    const controller = new AbortController();
    const abortSignal = signal || controller.signal;
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

      // Merge headers
      const headers: Record<string, string> = {
        ...this.defaultHeaders,
        ...customHeaders,
        ...(options.headers as Record<string, string>),
      };

      // If FormData → remove Content-Type (browser sets it with boundary)
      if (options.body instanceof FormData) {
        delete headers["Content-Type"];
      }

      // Add Authorization if available
      if (this.authToken) {
        headers["Authorization"] = `Bearer ${this.authToken}`;
      }

      const response = await fetch(url, {
        ...options,
        headers,
        signal: abortSignal,
        credentials: "include",
      });

      clearTimeout(timeoutId);

      if (response.status === 401) {
        this.clearAuthToken();
        window.location.href = "/login";
        throw new ApiError("Authentication required", 401);
      }

      const data = await response.json();

      if (!response.ok) {
        throw this.createApiError(data as ErrorResponse, response.status);
      }

      return data as SuccessResponse<T>;
    } catch (error) {
      clearTimeout(timeoutId);
      throw this.normalizeError(error);
    }
  }

  private createApiError(errorData: ErrorResponse, status: number): ApiError {
    return new ApiError(
      errorData.message || "An error occurred",
      status,
      errorData.errors,
      errorData.errorCode
    );
  }

  private normalizeError(error: any): Error {
    if (error instanceof ApiError) return error;
    if (error.name === "AbortError") return new ApiError("Request timeout", 408);
    if (error instanceof TypeError) return new ApiError("Network error. Please check your connection.", 0);
    return new ApiError(error.message || "An unexpected error occurred", 0);
  }

  // HTTP methods
  get<T>(endpoint: string, options?: RequestOptions) {
    return this.request<T>(endpoint, { method: "GET" }, options);
  }

  post<T>(endpoint: string, data?: any, options?: RequestOptions) {
    return this.request<T>(
      endpoint,
      { method: "POST", body: data ? JSON.stringify(data) : undefined },
      options
    );
  }

  postFormData<T>(endpoint: string, formData: FormData, options?: RequestOptions) {
    return this.request<T>(
      endpoint,
      { method: "POST", body: formData },
      options
    );
  }

  put<T>(endpoint: string, data?: any, options?: RequestOptions) {
    return this.request<T>(
      endpoint,
      { method: "PUT", body: data ? JSON.stringify(data) : undefined },
      options
    );
  }

  patch<T>(endpoint: string, data?: any, options?: RequestOptions) {
    return this.request<T>(
      endpoint,
      { method: "PATCH", body: data ? JSON.stringify(data) : undefined },
      options
    );
  }

  delete<T>(endpoint: string, options?: RequestOptions) {
    return this.request<T>(endpoint, { method: "DELETE" }, options);
  }

  upload<T>(endpoint: string, formData: FormData, options?: RequestOptions) {
    return this.request<T>(
      endpoint,
      { method: "POST", body: formData },
      options
    );
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
    this.name = "ApiError";
  }

  get isValidationError() {
    return !!this.validationErrors?.length;
  }
  get isNetworkError() {
    return this.status === 0;
  }
  get isTimeout() {
    return this.status === 408;
  }
  get isUnauthorized() {
    return this.status === 401;
  }
  get isForbidden() {
    return this.status === 403;
  }
  get isNotFound() {
    return this.status === 404;
  }

  getFieldError(field: string) {
    return this.validationErrors?.find((e) => e.field === field)?.message;
  }
}

// ✅ Singleton instance
export const apiClient = new ApiClient();

// Re-export token helpers
export const setAuthToken = (token: string | null) => apiClient.setAuthToken(token);
export const clearAuthToken = () => apiClient.clearAuthToken();
export const getAuthToken = () => apiClient.getAuthToken();
