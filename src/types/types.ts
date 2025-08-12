export interface Product {
  _id: string;
  name: string;
  price: number;
  discountPrice?: number;
  description: string;
  images: string[];
  dynamicFields: DynamicField[];
  createdAt?: string;
  updatedAt?: string;
}

export interface DynamicField {
  key: string;
  placeholder: string;
}

export interface FormSubmission {
  _id: string;
  productId: string;
  productName: string;
  customerData: {
    name: string;
    phone: string;
    [key: string]: string; // Dynamic fields
  };
  createdAt: string;
  updatedAt: string;
}

export interface AdminUser {
  username: string;
  password: string;
}