import type { IProductColor } from "./product";

// types/types.ts
export interface Product {
  _id: string;
  name: string;
  price: number;
  discountPrice?: number;
  description: string;
  images: string[];
  dynamicFields: DynamicField[];
  predefinedFields: PredefinedFieldGroup[];
  offers: Offer[];
  hiddenFields: HiddenField[];
  createdAt?: string;
  updatedAt?: string;
}

export interface DynamicField {
  key: string;
  placeholder: string;
  value?: string;
}

export interface PredefinedFieldGroup {
  category: string;
  options: string[];
  selectedOptions: string[];
  isActive: boolean;
}


export interface Offer {
  id: string;
  title: string;
  description: string;
  discount?: number;
  validUntil?: string;
  isActive: boolean;
}

export interface HiddenField {
  key: string;
  value: string;
  description: string;
}

export interface FormSubmission {
  _id: string;
  productId: string;
  productName: string;
  customerData: {
    name: string;
    phone: string;
    reference: string;
    [key: string]: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface AdminUser {
  username: string;
  password: string;
}

// Color palettes remain the same
export interface ColorPalette {
  name: string;
  colors: Array<{
    name: string;
    hexCode: string;
  }>;
}

// Component props interfaces
export interface ColorPickerProps {
  colors: IProductColor[];
  selectedColor?: string;
  onColorSelect: (color: IProductColor) => void;
  showAvailabilityBadge?: boolean;
  size?: 'small' | 'medium' | 'large';
  className?: string;
  maxColors?: 3; // Backend limit
}
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