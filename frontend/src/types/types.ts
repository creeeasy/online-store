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