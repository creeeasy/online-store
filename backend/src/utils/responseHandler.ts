// utils/responseHandler.ts
import { Response } from 'express';
import { validationResult, ValidationError } from 'express-validator';

// Standard response interfaces
interface BaseResponse {
  success: boolean;
  message: string;
  timestamp: string;
}

interface SuccessResponse<T = any> extends BaseResponse {
  success: true;
  data: T;
  pagination?: PaginationData;
}

interface ErrorResponse extends BaseResponse {
  success: false;
  errors?: ValidationErrorDetail[];
  errorCode?: string;
}

interface ValidationErrorDetail {
  field: string;
  message: string;
  value?: any;
  location: string;
}

interface PaginationData {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

// Response handler class
export class ResponseHandler {
  /**
   * Send success response
   */
  static success<T>(
    res: Response, 
    data: T, 
    message: string = 'Operation successful',
    statusCode: number = 200,
    pagination?: PaginationData
  ): Response {
    const response: SuccessResponse<T> = {
      success: true,
      message,
      data,
      timestamp: new Date().toISOString(),
      ...(pagination && { pagination })
    };

    return res.status(statusCode).json(response);
  }

  /**
   * Send error response
   */
  static error(
    res: Response,
    message: string,
    statusCode: number = 500,
    errors?: ValidationErrorDetail[],
    errorCode?: string
  ): Response {
    const response: ErrorResponse = {
      success: false,
      message,
      timestamp: new Date().toISOString(),
      ...(errors && { errors }),
      ...(errorCode && { errorCode })
    };

    return res.status(statusCode).json(response);
  }

  /**
   * Handle validation errors from express-validator
   */
  static validationError(res: Response, req: any): Response | null {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const formattedErrors: ValidationErrorDetail[] = errors.array().map((error: any) => ({
        field: error.path || error.param,
        message: error.msg,
        value: error.value,
        location: error.location || 'body'
      }));

      return ResponseHandler.error(
        res,
        'Validation failed. Please check the provided data.',
        400,
        formattedErrors,
        'VALIDATION_ERROR'
      );
    }
    return null;
  }

  /**
   * Handle database/mongoose errors
   */
  static handleDatabaseError(res: Response, error: any): Response {
    // Duplicate key error (MongoDB)
    if (error.code === 11000) {
      const duplicateField = Object.keys(error.keyValue)[0];
      const duplicateValue = error.keyValue[duplicateField];
      
      const formattedError: ValidationErrorDetail = {
        field: duplicateField,
        message: `A record with ${duplicateField} "${duplicateValue}" already exists`,
        value: duplicateValue,
        location: 'body'
      };

      return ResponseHandler.error(
        res,
        'Duplicate entry detected',
        400,
        [formattedError],
        'DUPLICATE_ERROR'
      );
    }

    // Mongoose validation error
    if (error.name === 'ValidationError') {
      const validationErrors: ValidationErrorDetail[] = Object.values(error.errors).map((err: any) => ({
        field: err.path,
        message: err.message,
        value: err.value,
        location: 'body'
      }));
      
      return ResponseHandler.error(
        res,
        'Database validation failed',
        400,
        validationErrors,
        'DATABASE_VALIDATION_ERROR'
      );
    }

    // Cast error (invalid ObjectId)
    if (error.name === 'CastError') {
      const formattedError: ValidationErrorDetail = {
        field: error.path,
        message: `Invalid ${error.path} format`,
        value: error.value,
        location: 'params'
      };

      return ResponseHandler.error(
        res,
        'Invalid ID format',
        400,
        [formattedError],
        'INVALID_ID_ERROR'
      );
    }

    // Default server error
    return ResponseHandler.error(
      res,
      'Internal server error',
      500,
      undefined,
      'INTERNAL_SERVER_ERROR'
    );
  }

  /**
   * Handle not found errors
   */
  static notFound(res: Response, resource: string = 'Resource'): Response {
    return ResponseHandler.error(
      res,
      `${resource} not found`,
      404,
      undefined,
      'NOT_FOUND_ERROR'
    );
  }

  /**
   * Handle unauthorized errors
   */
  static unauthorized(res: Response, message: string = 'Unauthorized access'): Response {
    return ResponseHandler.error(
      res,
      message,
      401,
      undefined,
      'UNAUTHORIZED_ERROR'
    );
  }

  /**
   * Handle forbidden errors
   */
  static forbidden(res: Response, message: string = 'Access forbidden'): Response {
    return ResponseHandler.error(
      res,
      message,
      403,
      undefined,
      'FORBIDDEN_ERROR'
    );
  }

  /**
   * Create paginated success response
   */
  static paginated<T>(
    res: Response,
    data: T[],
    total: number,
    page: number,
    limit: number,
    message: string = 'Data retrieved successfully'
  ): Response {
    const totalPages = Math.ceil(total / limit);
    
    const pagination: PaginationData = {
      currentPage: page,
      totalPages,
      totalItems: total,
      itemsPerPage: limit,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1
    };

    return ResponseHandler.success(res, data, message, 200, pagination);
  }
}

// Middleware for wrapping async functions and handling errors
export const asyncHandler = (fn: Function) => (req: any, res: any, next: any) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// Global error handler middleware
export const globalErrorHandler = (err: any, req: any, res: Response, next: any) => {
  console.error('Error:', err);

  // If response already sent, delegate to default Express error handler
  if (res.headersSent) {
    return next(err);
  }

  // Handle different types of errors
  return ResponseHandler.handleDatabaseError(res, err);
};

// Request wrapper for validation
export const validateRequest = (req: any, res: Response, next: any) => {
  const validationError = ResponseHandler.validationError(res, req);
  if (validationError) {
    return validationError;
  }
  next();
};