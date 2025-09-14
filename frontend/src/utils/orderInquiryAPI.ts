

const API_BASE_URL =  'http://localhost:5001';

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: Array<{ field: string; message: string }>;
}

export interface PaginatedResponse<T> {
  items: T[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

class OrderInquiryAPI {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const url = `${API_BASE_URL}/api/order-inquiries${endpoint}`;
      
      const defaultHeaders = {
        'Content-Type': 'application/json',
      };

      const response = await fetch(url, {
        ...options,
        headers: {
          ...defaultHeaders,
          ...options.headers,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error(`API request failed: ${endpoint}`, error);
      throw error;
    }
  }

  // Create new order inquiry
  async createInquiry(inquiryData: CreateOrderInquiryRequest): Promise<ApiResponse<{ inquiry: OrderInquiry }>> {
    return this.request('/create', {
      method: 'POST',
      body: JSON.stringify(inquiryData),
    });
  }

  // Get all inquiries with filtering and pagination
  async getInquiries(filters: OrderInquiryFilters = {}): Promise<ApiResponse<{ inquiries: OrderInquiry[]; pagination: any }>> {
    const searchParams = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        searchParams.append(key, String(value));
      }
    });

    const queryString = searchParams.toString();
    const endpoint = queryString ? `/?${queryString}` : '/';

    return this.request(endpoint, { method: 'GET' });
  }

  // Get inquiry by ID
  async getInquiryById(id: string): Promise<ApiResponse<{ inquiry: OrderInquiry }>> {
    return this.request(`/${id}`, { method: 'GET' });
  }

  // Update inquiry
  async updateInquiry(id: string, updates: UpdateOrderInquiryRequest): Promise<ApiResponse<{ inquiry: OrderInquiry }>> {
    return this.request(`/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  // Update inquiry status
  async updateInquiryStatus(
    id: string, 
    status: 'pending' | 'contacted' | 'converted' | 'cancelled',
    notes?: string
  ): Promise<ApiResponse<{ inquiry: OrderInquiry }>> {
    return this.request(`/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status, notes }),
    });
  }

  // Delete inquiry
  async deleteInquiry(id: string): Promise<ApiResponse<{ deletedInquiry: OrderInquiry }>> {
    return this.request(`/${id}`, { method: 'DELETE' });
  }

  // Get inquiries statistics
  async getInquiriesStats(): Promise<ApiResponse<OrderInquiryStats>> {
    return this.request('/stats', { method: 'GET' });
  }

  // Bulk operations
  async bulkUpdateStatus(
    ids: string[], 
    status: 'pending' | 'contacted' | 'converted' | 'cancelled'
  ): Promise<ApiResponse<{ updatedCount: number }>> {
    return this.request('/bulk/status', {
      method: 'PATCH',
      body: JSON.stringify({ ids, status }),
    });
  }

  async bulkDelete(ids: string[]): Promise<ApiResponse<{ deletedCount: number }>> {
    return this.request('/bulk/delete', {
      method: 'DELETE',
      body: JSON.stringify({ ids }),
    });
  }
}

// Export singleton instance
export const orderInquiryAPI = new OrderInquiryAPI();

// React hooks for order inquiries
import { useState, useEffect, useCallback } from 'react';
import type { CreateOrderInquiryRequest, OrderInquiry, OrderInquiryFilters, OrderInquiryStats, UpdateOrderInquiryRequest } from '../types/orderInquiry';

export function useOrderInquiries(filters: OrderInquiryFilters = {}) {
  const [inquiries, setInquiries] = useState<OrderInquiry[]>([]);
  const [pagination, setPagination] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchInquiries = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await orderInquiryAPI.getInquiries(filters);
      
      if (response.success && response.data) {
        setInquiries(response.data.inquiries);
        setPagination(response.data.pagination);
      } else {
        setError('Failed to fetch inquiries');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch inquiries');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchInquiries();
  }, [fetchInquiries]);

  const refetch = () => fetchInquiries();

  return {
    inquiries,
    pagination,
    loading,
    error,
    refetch
  };
}

export function useOrderInquiry(id: string) {
  const [inquiry, setInquiry] = useState<OrderInquiry | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInquiry = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await orderInquiryAPI.getInquiryById(id);
        
        if (response.success && response.data) {
          setInquiry(response.data.inquiry);
        } else {
          setError('Inquiry not found');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch inquiry');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchInquiry();
    }
  }, [id]);

  return { inquiry, loading, error };
}

export function useOrderInquiryStats() {
  const [stats, setStats] = useState<OrderInquiryStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await orderInquiryAPI.getInquiriesStats();
        
        if (response.success && response.data) {
          setStats(response.data);
        } else {
          setError('Failed to fetch statistics');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch statistics');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return { stats, loading, error };
}

// Utility functions for inquiry management
export const InquiryUtils = {
  getStatusColor: (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'contacted':
        return 'bg-blue-100 text-blue-800';
      case 'converted':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  },

  getStatusIcon: (status: string) => {
    switch (status) {
      case 'pending':
        return '⏳';
      case 'contacted':
        return '📞';
      case 'converted':
        return '✅';
      case 'cancelled':
        return '❌';
      default:
        return '❓';
    }
  },

  formatPrice: (price?: number) => {
    if (!price) return 'N/A';
    return `$${price.toFixed(2)}`;
  },

  formatDate: (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  },

  getTimeAgo: (date: string) => {
    const now = new Date();
    const inquiryDate = new Date(date);
    const diffInSeconds = Math.floor((now.getTime() - inquiryDate.getTime()) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`;
    return InquiryUtils.formatDate(date);
  },

  validatePhoneNumber: (phone: string) => {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    return phoneRegex.test(phone);
  },

  sanitizeCustomerData: (data: any) => {
    return {
      name: data.name?.trim() || '',
      phone: data.phone?.trim() || '',
      reference: data.reference?.trim() || '',
      ...Object.keys(data)
        .filter(key => !['name', 'phone', 'reference'].includes(key))
        .reduce((acc, key) => ({
          ...acc,
          [key]: typeof data[key] === 'string' ? data[key].trim() : data[key]
        }), {})
    };
  },

  exportInquiriesToCSV: (inquiries: OrderInquiry[]) => {
    const headers = [
      'ID',
      'Product Name',
      'Customer Name',
      'Phone',
      'Reference',
      'Quantity',
      'Total Price',
      'Status',
      'Created At',
      'Notes'
    ];

    const rows = inquiries.map(inquiry => [
      inquiry._id,
      inquiry.productName,
      inquiry.customerData.name,
      inquiry.customerData.phone,
      inquiry.customerData.reference,
      inquiry.quantity || 1,
      inquiry.totalPrice || 0,
      inquiry.status,
      inquiry.createdAt,
      inquiry.notes || ''
    ]);

    const csvContent = [headers, ...rows]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `order-inquiries-${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }
};

// Advanced filters and search utilities
export const InquiryFilters = {
  // Status filters
  getStatusOptions: () => [
    { value: '', label: 'All Statuses' },
    { value: 'pending', label: 'Pending' },
    { value: 'contacted', label: 'Contacted' },
    { value: 'converted', label: 'Converted' },
    { value: 'cancelled', label: 'Cancelled' }
  ],

  // Date range presets
  getDateRangePresets: () => {
    const today = new Date();
    const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
    const lastWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    const lastMonth = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
    const lastThreeMonths = new Date(today.getTime() - 90 * 24 * 60 * 60 * 1000);

    return [
      { 
        label: 'Today', 
        startDate: today.toISOString().split('T')[0],
        endDate: today.toISOString().split('T')[0]
      },
      { 
        label: 'Yesterday', 
        startDate: yesterday.toISOString().split('T')[0],
        endDate: yesterday.toISOString().split('T')[0]
      },
      { 
        label: 'Last 7 days', 
        startDate: lastWeek.toISOString().split('T')[0],
        endDate: today.toISOString().split('T')[0]
      },
      { 
        label: 'Last 30 days', 
        startDate: lastMonth.toISOString().split('T')[0],
        endDate: today.toISOString().split('T')[0]
      },
      { 
        label: 'Last 3 months', 
        startDate: lastThreeMonths.toISOString().split('T')[0],
        endDate: today.toISOString().split('T')[0]
      }
    ];
  },

  // Build filter object from form data
  buildFilters: (formData: Record<string, any>): OrderInquiryFilters => {
    const filters: OrderInquiryFilters = {};

    if (formData.page) filters.page = parseInt(formData.page);
    if (formData.limit) filters.limit = parseInt(formData.limit);
    if (formData.status) filters.status = formData.status;
    if (formData.productId) filters.productId = formData.productId;
    if (formData.phone) filters.phone = formData.phone;
    if (formData.name) filters.name = formData.name;
    if (formData.startDate) filters.startDate = formData.startDate;
    if (formData.endDate) filters.endDate = formData.endDate;

    return filters;
  }
};

export default orderInquiryAPI;