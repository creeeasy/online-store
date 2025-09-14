export interface IDynamicField {
  key: string;
  placeholder: string;
  _id?: string;
}

export interface IPredefinedField {
  category: string;
  options: string[];
  selectedOptions: string[];
  isActive: boolean;
  _id?: string;
}

export interface IReferenceLinks {
  facebook?: string;
  instagram?: string;
  tiktok?: string;
}

export interface IOffer {
  id: string;
  title: string;
  description: string;
  discount: number;
  validUntil: string;
  isActive: boolean;
  _id?: string;
}

export interface IHiddenField {
  key: string;
  value: string;
  description: string;
  _id?: string;
}

export interface IProduct {
  _id: string;
  name: string;
  price: number;
  discountPrice?: number;
  description: string;
  images: string[];
  dynamicFields: IDynamicField[];
  predefinedFields: IPredefinedField[];
  references: IReferenceLinks;
  offers: IOffer[];
  hiddenFields: IHiddenField[];
  createdBy?: {
    _id: string;
    username: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
  __v?: number;
}

export interface ProductsResponse {
  success: boolean;
  data: {
    products: IProduct[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
  };
}

export interface ProductResponse {
  success: boolean;
  message: string;
  data: {
    product: IProduct;
  };
}
export interface ApiError {
  message: string;
  status?: number;
  details?: any;
}
export interface IProductStats {
  totalProducts: number;
  onSaleCount: number;
  withActiveOffers: number;
  categoryStats: Array<{
    _id: string;
    totalProducts: number;
  }>;
  recentProducts: Array<{
    _id: string;
    name: string;
    price: number;
    discountPrice?: number;
    images: string[];
    createdAt: string;
  }>;
}
