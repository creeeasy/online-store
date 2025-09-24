// Phone validation utility
export const validateAlgerianPhone = (phone: string): boolean => {
  const cleanPhone = phone.replace(/[\s\-\(\)]/g, '');
  return /^0[567]\d{8}$/.test(cleanPhone);
};

// Phone formatting utility
export const formatAlgerianPhone = (phone: string): string => {
  const cleanPhone = phone.replace(/[\s\-\(\)]/g, '');
  if (cleanPhone.length === 10 && validateAlgerianPhone(cleanPhone)) {
    return `${cleanPhone.slice(0, 4)} ${cleanPhone.slice(4, 6)} ${cleanPhone.slice(6, 8)} ${cleanPhone.slice(8)}`;
  }
  return cleanPhone;
};

// Core OrderInquiry interface
export interface OrderInquiry {
  _id: string;
  productId: string;
  productName: string;
  customerData: Record<string, any>;
  quantity?: number;
  selectedVariants?: Record<string, string>;
  totalPrice?: number;
  notes?: string;
  typeOfOrder: 'offer' | 'quantity';
  offerId?: string;
  createdAt: string;
  updatedAt: string;
}

// Filters for querying inquiries
export interface OrderInquiryFilters {
  page?: number;
  limit?: number;
  status?: string;
  productId?: string;
  phone?: string;
  name?: string;
  startDate?: string;
  endDate?: string;
  [key: string]: any; // Allow dynamic customerData filtering
}

// Statistics returned by the system
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

// Payload for creating a new inquiry
export interface CreateOrderInquiryRequest {
  productId: string;
  customerData: Record<string, any>;
  quantity?: number;
  typeOfOrder: 'offer' | 'quantity';
  offerId?: string;
  selectedVariants?: Record<string, string>;
  notes?: string;
}

// Payload for updating an existing inquiry
export interface UpdateOrderInquiryRequest {
  customerData?: Partial<Record<string, any>>;
  status?: 'pending' | 'contacted' | 'converted' | 'cancelled';
  notes?: string;
}

// Validation schemas for customer data
export const customerDataValidation = {
  name: {
    required: true,
    minLength: 2,
    maxLength: 100,
    pattern: /^[a-zA-Z\u0600-\u06FF\s]{2,100}$/,
    message: 'Name must be 2-100 characters and contain only letters'
  },
  phone: {
    required: true,
    pattern: /^0[567]\d{8}$/,
    validator: validateAlgerianPhone,
    message: 'Phone must be 10 digits starting with 05, 06, or 07 (e.g., 0555123456)'
  },
  reference: {
    required: false,
    maxLength: 200,
    message: 'Reference cannot exceed 200 characters'
  }
};

// Type guard for CustomerData validation
export const isValidCustomerData = (data: any): data is Record<string, any> => {
  if (!data || typeof data !== 'object') return false;

  const { name, phone, reference } = data;

  if (!name || typeof name !== 'string' || name.trim().length < 2 || name.trim().length > 100) return false;
  if (!phone || typeof phone !== 'string' || !validateAlgerianPhone(phone)) return false;
  if (reference && (typeof reference !== 'string' || reference.length > 200)) return false;

  return true;
};

// Centralized validation error messages
export const ValidationErrors = {
  PHONE_INVALID: 'Phone number must be 10 digits starting with 05, 06, or 07',
  PHONE_REQUIRED: 'Phone number is required',
  PHONE_FORMAT: 'Invalid phone format. Use: 0555123456',
  NAME_REQUIRED: 'Customer name is required',
  NAME_TOO_SHORT: 'Name must be at least 2 characters',
  NAME_TOO_LONG: 'Name cannot exceed 100 characters',
  NAME_INVALID_CHARS: 'Name can only contain letters and spaces',
  REFERENCE_TOO_LONG: 'Reference cannot exceed 200 characters'
} as const;
