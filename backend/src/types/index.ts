import { Request } from 'express';
import { Types } from 'mongoose';

export interface IUser {
  _id: Types.ObjectId;
  username: string;
  email: string;
  password: string;
  role: 'admin' | 'user';
  createdAt: Date;
  updatedAt: Date;
}

export interface IProduct {
  _id: Types.ObjectId;
  name: string;
  price: number;
  discountPrice?: number;
  description: string;
  images: string[];
  dynamicFields: Array<{ key: string; placeholder: string }>;
  predefinedFields: Array<{
    category: string;
    options: string[];
    selectedOptions: string[];
    isActive: boolean;
  }>;
  references: Record<string, string>;
  offers: Array<{
    id: string;
    title: string;
    description: string;
    discount: number;
    validUntil: string;
    isActive: boolean;
  }>;
  hiddenFields: Array<{
    key: string;
    value: string;
    description: string;
  }>;
  createdBy: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserPayload {
  id: string;
  role: string;
}

export interface AuthRequest extends Request {
  user?: UserPayload;
}

export interface JwtPayload {
  id: string;
  role: string;
}