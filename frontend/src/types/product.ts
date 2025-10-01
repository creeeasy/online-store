import type { PaginationData, ValidationErrorDetail } from "./api";

// ✅ Fixed IOffer interface to match backend model
export interface IOffer {
  discountedPriceColor: Color | undefined;
  originalPriceColor: Color | undefined;
  descriptionColor: Color | undefined;
  titleColor: string | undefined;
  discountedPriceFontBold: any;
  discountedPriceFontFamily: any;
  discountedPriceFontSize: any;
  originalPriceFontSize: string;
  originalPriceFontBold: any;
  originalPriceFontFamily: any;
  descriptionFontBold: any;
  titleFontBold: any;
  descriptionFontFamily: any;
  descriptionFontSize: any;
  titleFontFamily: any;
  titleFontSize: any;
  _id?: string;
  title: string;
  description?: string;
  originalPrice?: number;    // Before price
  discountedPrice?: number;  // After price
  isActive: boolean;
}

export interface IProductColor {
  _id?: string;
  name: string;
  hexCode: string;
  isAvailable?: boolean;
}

export interface IDynamicField {
  fontBold: FontWeight | undefined;
  languageField: SetStateAction<"ar" | "fr">;
  fontSize: FontSize<string | number> | undefined;
  fontText: FontFamily | undefined;
  key: string;
  placeholder: string;
  isRequired?: boolean;
  isDefault?: boolean;
  _id?: string;
}

export interface IPredefinedField {
  category: string;
  options: string[];
  selectedOptions: string[];
  isActive: boolean;
  _id?: string;
}

export interface IHiddenField {
  key: string;
  value: string;
  description: string;
  _id?: string;
}

// ✅ Enhanced Product interface aligned with backend
export interface IProduct {
  offerTitleFontWeight: any;
  offerTitleFontFamily: any;
  offerTitleFontSize: any;
  offerTitleColor: Color | undefined;
  offersTitle: any;
  _id: string;
  name: string;
  price: number;
  discountPrice?: number;
  description: string;
  images: string[];
  colors?: IProductColor[];
  dynamicFields: IDynamicField[];
  predefinedFields: IPredefinedField[];
  offers: IOffer[];
  hiddenFields: IHiddenField[];

  // ✅ Quantity controls
  allowQuantity: boolean;
  allowMultipleQuantities: boolean;
  maxQuantityPerInquiry: number;

  // ✅ Pixel tracking
  pixel: {
    facebookPixel: boolean;
    apiConversion: boolean;
    pixelId: string;
    accessToken: string;
    eventTypes: {
      PageView: boolean;
      Purchase: boolean;
      Lead: boolean;
    };
  };

  // Virtual properties from backend
  isOnSale?: boolean;

  createdBy: string;
  reference?: string;
  createdAt: Date;
  updatedAt: Date;
}


// ✅ Order inquiry configuration interface
export interface IOrderInquiryConfig {
  allowQuantity: boolean;
  allowMultipleQuantities: boolean;
  maxQuantityPerInquiry: number;
  hasActiveOffers: boolean;
  activeOffers: IOffer[];
}

// ✅ Fixed offer with calculated pricing
export interface IOfferWithPrice extends IOffer {
  calculatedSavings?: number;
  finalPrice?: number;
  isCurrentlyValid?: boolean;
}

export interface IQuantityValidationResult {
  isValid: boolean;
  message: string;
  requestedQuantity: number;
  maxAllowedQuantity: number;
  allowsMultipleQuantities: boolean;
}

// ✅ Order inquiry interfaces
export interface IOrderInquiry {
  _id: string;
  productId: string;
  productName: string;
  customerData: Record<string, any>;
  
  // Either offerId OR quantity (mutually exclusive)
  offerId?: string;
  quantity?: number;
  
  selectedVariants?: Record<string, string>;
  totalPrice: number;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICreateOrderInquiry {
  productId: string;
  customerData: Record<string, any>;
  
  // Either offerId OR quantity
  offerId?: string;
  quantity?: number;
  
  selectedVariants?: Record<string, string>;
  notes?: string;
}

export interface IColorStats {
  name: string;
  hexCode: string;
  totalProducts: number;
  availableProducts: number;
}

// ✅ Enhanced product stats with order inquiry metrics
export interface IProductStats {
  totalProducts: number;
  onSaleCount: number;
  withActiveOffers: number;
  allowingMultipleQuantities: number;
  singleItemOnly: number;
  withColorsCount: number;
  popularColors: IColorStats[];
  categoryStats: Array<{
    _id: string;
    totalProducts: number;
  }>;
  offerStats: {
    totalActiveOffers: number;
    avgOriginalPrice: number;
    maxDiscount: number;
    minDiscount: number;
  };
  quantityConfigStats: Array<{
    _id: {
      allowMultiple: boolean;
      maxQuantity: number;
    };
    count: number;
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

// ✅ Enhanced product filters with order inquiry options
export interface ProductFilters {
  page?: number;
  limit?: number;
  category?: string;
  color?: string;
  availableColorsOnly?: boolean;
  minPrice?: number;
  maxPrice?: number;
  onSale?: boolean;
  hasOffers?: boolean;
  allowsMultipleQuantities?: boolean;
  singleItemOnly?: boolean;
  q?: string;
}

export interface BulkOrderFilters extends ProductFilters {
  minQuantity?: number;
}

export interface OfferFilters extends ProductFilters {
  minOriginalPrice?: number;
  maxOriginalPrice?: number;
  hasDiscountedPrice?: boolean;
}

export interface ColorFilters {
  page?: number;
  limit?: number;
  availableOnly?: boolean;
}

export interface CloneProductRequest {
  id: string;
  reference?: string;
  allowQuantity: boolean;
  allowMultipleQuantities?: boolean;
  maxQuantityPerInquiry?: number;
}

// ✅ Fixed form interfaces to match backend validation
export interface CreateProductRequest {
  name: string;
  price: number;
  discountPrice?: number;
  description: string;
  images?: string[];
  colors?: Omit<IProductColor, '_id'>[];
  dynamicFields?: Omit<IDynamicField, '_id'>[];
  predefinedFields?: Omit<IPredefinedField, '_id'>[];
  offers?: Omit<IOffer, '_id'>[];
  hiddenFields?: Omit<IHiddenField, '_id'>[];
  reference?: string;
  
  // ✅ Fixed: Added allowQuantity field and made all quantity fields required with proper defaults
  allowQuantity: boolean;
  allowMultipleQuantities: boolean;
  maxQuantityPerInquiry: number;
}

export interface UpdateProductRequest {
  name?: string;
  price?: number;
  discountPrice?: number;
  description?: string;
  images?: string[];
  colors?: Omit<IProductColor, '_id'>[];
  dynamicFields?: Omit<IDynamicField, '_id'>[];
  predefinedFields?: Omit<IPredefinedField, '_id'>[];
  offers?: Omit<IOffer, '_id'>[];
  hiddenFields?: Omit<IHiddenField, '_id'>[];
  reference?: string;
  
  // ✅ Fixed: Added allowQuantity field for updates
  allowQuantity?: boolean;
  allowMultipleQuantities?: boolean;
  maxQuantityPerInquiry?: number;
}

export interface BulkUpdateRequest {
  productIds: string[];
  updateData: UpdateProductRequest;
}

// ✅ API response interfaces for order inquiry endpoints
export interface ProductWithConfigResponse {
  success: boolean;
  message: string;
  data: {
    product: IProduct;
    orderInquiryConfig: IOrderInquiryConfig;
  };
  timestamp: string;
}

export interface ProductOffersResponse {
  success: boolean;
  message: string;
  data: {
    productName: string;
    basePrice: number;
    discountPrice?: number;
    offers: IOfferWithPrice[];
    totalActiveOffers: number;
  };
  timestamp: string;
}

export interface OfferDetailsResponse {
  success: boolean;
  message: string;
  data: {
    productName: string;
    productId: string;
    offer: IOfferWithPrice;
  };
  timestamp: string;
}

export interface QuantityValidationResponse {
  success: boolean;
  message: string;
  data: IQuantityValidationResult;
  timestamp: string;
}

export interface ColorFormProps {
  colors: IProductColor[];
  onChange: (colors: IProductColor[]) => void;
  maxColors?: number;
  showAvailability?: boolean;
  className?: string;
}

export interface ProductCardProps {
  product: IProduct;
  onColorSelect?: (color: IProductColor) => void;
  selectedColor?: string;
  showColors?: boolean;
  showPricing?: boolean;
  showOffers?: boolean;
  showQuantityConfig?: boolean;
  showOrderInquiryButton?: boolean;
  className?: string;
}

export interface ProductDetailsProps {
  product: IProduct;
  selectedColor?: IProductColor;
  onColorChange?: (color: IProductColor) => void;
  showColorPicker?: boolean;
  showDynamicFields?: boolean;
  showOrderInquiryForm?: boolean;
  orderInquiryConfig?: IOrderInquiryConfig;
  className?: string;
}

export interface OrderInquiryFormProps {
  product: IProduct;
  orderInquiryConfig: IOrderInquiryConfig;
  onSubmit: (inquiry: ICreateOrderInquiry) => void;
  selectedColor?: IProductColor;
  customerData?: Record<string, any>;
  className?: string;
}

export interface QuantityPickerProps {
  product: IProduct;
  quantity: number;
  onQuantityChange: (quantity: number) => void;
  maxQuantity?: number;
  disabled?: boolean;
  showValidation?: boolean;
  className?: string;
}

export interface OfferSelectorProps {
  offers: IOfferWithPrice[];
  selectedOfferId?: string;
  onOfferSelect: (offerId: string) => void;
  showPrices?: boolean;
  className?: string;
}

// Validation interfaces
export interface ColorValidationResult {
  isValid: boolean;
  errors: string[];
}

export type ColorSelectionState = {
  selectedColorId?: string;
  availableColors: IProductColor[];
  unavailableColors: IProductColor[];
};

export type OrderInquiryType = 'offer' | 'quantity';

export type OrderInquiryFormState = {
  type: OrderInquiryType;
  selectedOfferId?: string;
  quantity: number;
  customerData: Record<string, any>;
  selectedVariants: Record<string, string>;
  notes?: string;
};

export interface ColorSearchResponse {
  success: boolean;
  message: string;
  data: {
    products: IProduct[];
    colorInfo: {
      name: string;
      hexCode: string;
      totalProducts: number;
      availableProducts: number;
    };
  };
  pagination?: PaginationData;
  timestamp: string;
}

export interface ProductAnalytics extends IProductStats {
  colorInsights: {
    mostPopularColor: IColorStats | null;
    leastPopularColor: IColorStats | null;
    colorDistribution: Array<{
      colorName: string;
      percentage: number;
    }>;
    availabilityRate: number;
  };
  orderInquiryInsights: {
    bulkOrderProductsPercentage: number;
    averageMaxQuantity: number;
    offerUtilizationRate: number;
    mostPopularOffers: Array<{
      title: string;
      originalPrice?: number;
      discountedPrice?: number;
      usageCount: number;
    }>;
  };
}

// ✅ New interfaces for quantity configuration validation
export interface QuantityConfiguration {
  allowQuantity: boolean;
  allowMultipleQuantities: boolean;
  maxQuantityPerInquiry: number;
}

export interface QuantityValidationResponse {
  isValid: boolean;
  error?: string;
  finalQuantity?: number;
}
/*
// ✅ Helper functions for quantity validation
export const validateQuantityConfiguration = (
  allowQuantity: boolean, 
  allowMultipleQuantities: boolean, 
  maxQuantityPerInquiry?: number
): QuantityValidationResponse => {
  if (!allowQuantity && allowMultipleQuantities) {
    return { isValid: false, error: 'Cannot allow multiple quantities when quantity is disabled' };
  }
  
  if (allowMultipleQuantities && (!maxQuantityPerInquiry || maxQuantityPerInquiry < 2)) {
    return { isValid: false, error: 'maxQuantityPerInquiry must be at least 2 when multiple quantities are allowed' };
  }
  
  if (!allowMultipleQuantities && maxQuantityPerInquiry && maxQuantityPerInquiry > 1) {
    return { isValid: false, error: 'maxQuantityPerInquiry should not exceed 1 in single quantity mode' };
  }
  
  return { isValid: true };
};

export const validateInquiryQuantity = (
  productConfig: QuantityConfiguration, 
  requestedQuantity: number
): QuantityValidationResponse => {
  if (!productConfig.allowQuantity) {
    return { isValid: true, finalQuantity: null };
  }
  
  if (!productConfig.allowMultipleQuantities) {
    return { isValid: true, finalQuantity: 1 };
  }
  
  if (requestedQuantity < 2) {
    return { isValid: false, error: 'Quantity must be at least 2 in multiple quantities mode' };
  }
  
  if (requestedQuantity > productConfig.maxQuantityPerInquiry) {
    return { 
      isValid: false, 
      error: `Quantity cannot exceed ${productConfig.maxQuantityPerInquiry}` 
    };
  }
  
  return { isValid: true, finalQuantity: requestedQuantity };
};
*/