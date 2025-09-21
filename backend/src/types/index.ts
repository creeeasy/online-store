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