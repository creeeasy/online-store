// types/orderInquiry.ts
export interface CustomerData {
  name: string;
  phone: string;
  reference: string;
  [key: string]: string;
}

export interface OrderInquiry {
  _id: string;
  productId: string;
  productName: string;
  customerData: CustomerData;
  quantity?: number;
  selectedVariants?: Record<string, string>;
  totalPrice?: number;
  status: 'pending' | 'contacted' | 'converted' | 'cancelled';
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrderInquiryFilters {
  page?: number;
  limit?: number;
  status?: string;
  productId?: string;
  phone?: string;
  name?: string;
  startDate?: string;
  endDate?: string;
}

export interface OrderInquiryStats {
  statusStats: Array<{
    _id: string;
    count: number;
    totalValue: number;
  }>;
  totalInquiries: number;
  recentInquiries: number;
  topProducts: Array<{
    _id: string;
    productName: string;
    inquiryCount: number;
    totalValue: number;
  }>;
}

export interface CreateOrderInquiryRequest {
  productId: string;
  customerData: CustomerData;
  quantity?: number;
  selectedVariants?: Record<string, string>;
  notes?: string;
}

export interface UpdateOrderInquiryRequest {
  customerData?: Partial<CustomerData>;
  status?: 'pending' | 'contacted' | 'converted' | 'cancelled';
  notes?: string;
}