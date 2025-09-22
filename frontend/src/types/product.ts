import type { PaginationData, ValidationErrorDetail } from "./api";

export interface IOffer {
  _id?: string;
  title: string;
  description?: string;
  discount?: number;
  validUntil?: Date;
  isActive: boolean;
}

export interface IProductColor {
  _id?: string;
  name: string;
  hexCode: string;
  isAvailable?: boolean;
}

export interface IDynamicField {
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
  description?: string;
  _id?: string;
}

export interface IProduct {
  _id: string;
  name: string;
  price: number;
  discountPrice?: number;
  description: string;
  images: string[];
  colors?: IProductColor[];
  dynamicFields?: IDynamicField[];
  predefinedFields?: IPredefinedField[];
  offers?: IOffer[];
  hiddenFields?: IHiddenField[];
  reference?: string;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IColorStats {
  name: string;
  hexCode: string;
  totalProducts: number;
  availableProducts: number;
}

export interface IProductStats {
  totalProducts: number;
  onSaleCount: number;
  withActiveOffers: number;
  withColorsCount: number;
  popularColors: IColorStats[];
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
  color?: string;
  availableColorsOnly?: boolean;
  minPrice?: number;
  maxPrice?: number;
  onSale?: boolean;
  hasOffers?: boolean;
  q?: string;
}

export interface ColorFilters {
  page?: number;
  limit?: number;
  availableOnly?: boolean;
}

export interface CloneProductRequest {
  id: string;
  reference?: string;
}

// Form interfaces for creating/updating products
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
}

export interface BulkUpdateRequest {
  productIds: string[];
  updateData: UpdateProductRequest;
}

// Color picker component props
export interface ColorPickerProps {
  colors: IProductColor[];
  selectedColor?: string;
  onColorSelect: (color: IProductColor) => void;
  showAvailabilityBadge?: boolean;
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

// Color form component props
export interface ColorFormProps {
  colors: IProductColor[];
  onChange: (colors: IProductColor[]) => void;
  maxColors?: number;
  showAvailability?: boolean;
  className?: string;
}

// Product card component props with colors
export interface ProductCardProps {
  product: IProduct;
  onColorSelect?: (color: IProductColor) => void;
  selectedColor?: string;
  showColors?: boolean;
  showPricing?: boolean;
  showOffers?: boolean;
  className?: string;
}

// Product details component props
export interface ProductDetailsProps {
  product: IProduct;
  selectedColor?: IProductColor;
  onColorChange?: (color: IProductColor) => void;
  showColorPicker?: boolean;
  showDynamicFields?: boolean;
  className?: string;
}

// Color validation utilities
export interface ColorValidationResult {
  isValid: boolean;
  errors: string[];
}

// Predefined color palettes
export interface ColorPalette {
  name: string;
  colors: Array<{
    name: string;
    hexCode: string;
  }>;
}

// Default color palettes
export const DEFAULT_COLOR_PALETTES: ColorPalette[] = [
  {
    name: 'Basic Colors',
    colors: [
      { name: 'Black', hexCode: '#000000' },
      { name: 'White', hexCode: '#FFFFFF' },
      { name: 'Red', hexCode: '#FF0000' },
      { name: 'Blue', hexCode: '#0000FF' },
      { name: 'Green', hexCode: '#008000' },
      { name: 'Yellow', hexCode: '#FFFF00' },
    ]
  },
  {
    name: 'Fashion Colors',
    colors: [
      { name: 'Navy Blue', hexCode: '#001f3f' },
      { name: 'Burgundy', hexCode: '#800020' },
      { name: 'Forest Green', hexCode: '#228B22' },
      { name: 'Charcoal', hexCode: '#36454F' },
      { name: 'Cream', hexCode: '#FFFDD0' },
      { name: 'Rose Gold', hexCode: '#E8B4B8' },
    ]
  },
  {
    name: 'Modern Colors',
    colors: [
      { name: 'Slate Gray', hexCode: '#708090' },
      { name: 'Coral', hexCode: '#FF7F50' },
      { name: 'Teal', hexCode: '#008080' },
      { name: 'Lavender', hexCode: '#E6E6FA' },
      { name: 'Mustard', hexCode: '#FFDB58' },
      { name: 'Sage Green', hexCode: '#9CAF88' },
    ]
  }
];

// Helper type for color selection state
export type ColorSelectionState = {
  selectedColorId?: string;
  availableColors: IProductColor[];
  unavailableColors: IProductColor[];
};

// Search and filter response for colors
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

// Product analytics with color insights
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
}

