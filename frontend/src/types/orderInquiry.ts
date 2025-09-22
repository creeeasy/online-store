// types/orderInquiry.ts

// Phone validation utility
export const validateAlgerianPhone = (phone: string): boolean => {
  // Remove any whitespace or special characters
  const cleanPhone = phone.replace(/[\s\-\(\)]/g, '');
  
  // Check if it's exactly 10 digits, starts with 0, and second digit is 5, 6, or 7
  const phoneRegex = /^0[567]\d{8}$/;
  return phoneRegex.test(cleanPhone);
};

// Phone formatting utility
export const formatAlgerianPhone = (phone: string): string => {
  const cleanPhone = phone.replace(/[\s\-\(\)]/g, '');
  if (cleanPhone.length === 10 && validateAlgerianPhone(cleanPhone)) {
    // Format as 0XXX XX XX XX
    return `${cleanPhone.slice(0, 4)} ${cleanPhone.slice(4, 6)} ${cleanPhone.slice(6, 8)} ${cleanPhone.slice(8)}`;
  }
  return cleanPhone;
};


export interface OrderInquiry {
  _id: string;
  productId: string;
  productName: string;
  customerData: Record<string,any>;
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
  customerData: Record<string,any>;
  quantity?: number;
  selectedVariants?: Record<string, string>;
  notes?: string;
}

export interface UpdateOrderInquiryRequest {
  customerData?: Partial< Record<string,any>>;
  status?: 'pending' | 'contacted' | 'converted' | 'cancelled';
  notes?: string;
}

// Validation schemas
export const customerDataValidation = {
  name: {
    required: true,
    minLength: 2,
    maxLength: 100,
    pattern: /^[a-zA-Z\u0600-\u06FF\s]{2,100}$/, // Arabic and Latin characters
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
export const isValidCustomerData = (data: any): data is Record<string,any> => {
  if (!data || typeof data !== 'object') return false;
  
  const { name, phone, reference } = data;
  
  // Validate name
  if (!name || typeof name !== 'string' || name.trim().length < 2 || name.trim().length > 100) {
    return false;
  }
  
  // Validate phone
  if (!phone || typeof phone !== 'string' || !validateAlgerianPhone(phone)) {
    return false;
  }
  
  // Validate reference (optional)
  if (reference && (typeof reference !== 'string' || reference.length > 200)) {
    return false;
  }
  
  return true;
};

// Error messages for validation
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