import type { OrderInquiry, OrderInquiryFilters } from "../types/orderInquiry";
import type { IProduct, IOffer, IOrderInquiry, ICreateOrderInquiry, IProductColor, ColorValidationResult, CreateProductRequest } from "../types/product";

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


};

// ✅ Fixed utility functions to match backend logic
export const OrderInquiryUtils = {
  canOrderQuantity: (product: IProduct, quantity: number): boolean => {
    if (quantity < 1) return false;
    if (quantity === 1) return true;
    return Boolean(
      product.allowMultipleQuantities && 
      quantity <= (product.maxQuantityPerInquiry || 1)
    );
  },

  getEffectivePrice: (product: IProduct): number => {
    return product.discountPrice || product.price;
  },

  calculateOfferFinalPrice: (product: IProduct, offer: IOffer): number => {
    // Use discounted price from offer if available, otherwise use original price
    if (offer.discountedPrice) {
      return offer.discountedPrice;
    }
    
    // Fallback to product's effective price if offer doesn't have specific prices
    return OrderInquiryUtils.getEffectivePrice(product);
  },

  calculateOfferSavings: (product: IProduct, offer: IOffer): number => {
    const originalPrice = offer.originalPrice || product.price;
    const finalPrice = offer.discountedPrice || OrderInquiryUtils.getEffectivePrice(product);
    return Math.max(0, originalPrice - finalPrice);
  },

  getActiveOffers: (product: IProduct): IOffer[] => {
    if (!product.offers) return [];
    const now = new Date();
    return product.offers.filter(offer => 
      offer.isActive
    );
  },

  isOfferBased: (inquiry: IOrderInquiry | ICreateOrderInquiry): boolean => {
    return Boolean(inquiry.offerId);
  },

  isQuantityBased: (inquiry: IOrderInquiry | ICreateOrderInquiry): boolean => {
    return Boolean(inquiry.quantity && inquiry.quantity > 0);
  },

  validateQuantityConfiguration: (
    allowMultiple: boolean, 
    maxQuantity: number
  ): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];
    
    if (!allowMultiple && maxQuantity > 1) {
      errors.push('Maximum quantity must be 1 when multiple quantities are not allowed');
    }
    
    if (maxQuantity < 1 || maxQuantity > 100) {
      errors.push('Maximum quantity must be between 1 and 100');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }
};

// ✅ Helper functions for form validation
export const ProductValidation = {
  validateColors: (colors: IProductColor[]): ColorValidationResult => {
    const errors: string[] = [];
    
    if (colors.length > 3) {
      errors.push('Maximum 3 colors allowed');
    }
    
    const names = colors.map(c => c.name.toLowerCase());
    const hexCodes = colors.map(c => c.hexCode.toLowerCase());
    
    if (names.length !== new Set(names).size) {
      errors.push('Color names must be unique');
    }
    
    if (hexCodes.length !== new Set(hexCodes).size) {
      errors.push('Hex codes must be unique');
    }
    
    colors.forEach((color, index) => {
      if (!color.name.trim()) {
        errors.push(`Color ${index + 1} name is required`);
      }
      
      if (color.name.length > 30) {
        errors.push(`Color ${index + 1} name cannot exceed 30 characters`);
      }
      
      
    });
    
    return {
      isValid: errors.length === 0,
      errors
    };
  },

  validateOffers: (offers: IOffer[]): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];
    
    offers.forEach((offer, index) => {
      if (!offer.title.trim()) {
        errors.push(`Offer ${index + 1} title is required`);
      }
      
      if (offer.title.length < 2 || offer.title.length > 100) {
        errors.push(`Offer ${index + 1} title must be between 2 and 100 characters`);
      }
      
      if (offer.description && offer.description.length > 500) {
        errors.push(`Offer ${index + 1} description cannot exceed 500 characters`);
      }
      
      if (offer.originalPrice !== undefined && offer.originalPrice < 0) {
        errors.push(`Offer ${index + 1} original price cannot be negative`);
      }
      
      if (offer.discountedPrice !== undefined && offer.discountedPrice < 0) {
        errors.push(`Offer ${index + 1} discounted price cannot be negative`);
      }
      
      if (
        offer.originalPrice && 
        offer.discountedPrice && 
        offer.discountedPrice >= offer.originalPrice
      ) {
        errors.push(`Offer ${index + 1} discounted price must be less than original price`);
      }
    });
    
    return {
      isValid: errors.length === 0,
      errors
    };
  },

  validateProduct: (product: CreateProductRequest): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];
    
    // Name validation
    if (!product.name.trim()) {
      errors.push('Product name is required');
    } else if (product.name.length < 2 || product.name.length > 100) {
      errors.push('Product name must be between 2 and 100 characters');
    }
    
    // Price validation
    if (product.price <= 0) {
      errors.push('Price must be greater than 0');
    }
    
    // Discount price validation
    if (product.discountPrice !== undefined) {
      if (product.discountPrice < 0) {
        errors.push('Discount price cannot be negative');
      }
      if (product.discountPrice >= product.price) {
        errors.push('Discount price must be less than the original price');
      }
    }
    

    
    // Colors validation
    if (product.colors && product.colors.length > 0) {
      const colorValidation = ProductValidation.validateColors(product.colors);
      errors.push(...colorValidation.errors);
    }
    
    // Offers validation
    if (product.offers && product.offers.length > 0) {
      const offerValidation = ProductValidation.validateOffers(product.offers);
      errors.push(...offerValidation.errors);
    }
    
    // Quantity configuration validation
    if (product.allowMultipleQuantities !== undefined && product.maxQuantityPerInquiry !== undefined) {
      const quantityValidation = OrderInquiryUtils.validateQuantityConfiguration(
        product.allowMultipleQuantities,
        product.maxQuantityPerInquiry
      );
      errors.push(...quantityValidation.errors);
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }
};

// ✅ Constants for limits (matching backend validation)
export const PRODUCT_LIMITS = {
  NAME_MIN_LENGTH: 2,
  NAME_MAX_LENGTH: 100,
  DESCRIPTION_MIN_LENGTH: 10,
  DESCRIPTION_MAX_LENGTH: 1000,
  REFERENCE_MAX_LENGTH: 200,
  MAX_COLORS: 3,
  COLOR_NAME_MAX_LENGTH: 30,
  DYNAMIC_FIELD_KEY_MAX_LENGTH: 50,
  DYNAMIC_FIELD_PLACEHOLDER_MAX_LENGTH: 100,
  HIDDEN_FIELD_KEY_MAX_LENGTH: 50,
  HIDDEN_FIELD_VALUE_MAX_LENGTH: 200,
  HIDDEN_FIELD_DESCRIPTION_MAX_LENGTH: 100,
  OFFER_TITLE_MIN_LENGTH: 2,
  OFFER_TITLE_MAX_LENGTH: 100,
  OFFER_DESCRIPTION_MAX_LENGTH: 500,
  MAX_QUANTITY_PER_INQUIRY_MIN: 1,
  MAX_QUANTITY_PER_INQUIRY_MAX: 100
} as const;
export default InquiryUtils;