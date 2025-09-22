// controllers/orderInquiryController.ts
import { Request, Response } from 'express';
import Product from '../models/Product';
import OrderInquiry from '../models/OrderInquiry';
import { ResponseHandler, asyncHandler, validateRequest } from '../utils/responseHandler';

// Phone validation utility
const validateAlgerianPhone = (phone: string): boolean => {
  const cleanPhone = phone.replace(/[\s\-\(\)]/g, '');
  const phoneRegex = /^0[567]\d{8}$/;
  return phoneRegex.test(cleanPhone);
};

export class OrderInquiryController {
  // Create new order inquiry
  static createInquiry = asyncHandler(async (req: Request, res: Response) => {
    // Check for validation errors
   // const validationError = ResponseHandler.validationError(res, req);
    //if (validationError) return;
    const { 
      productId, 
      customerData = {}, 
      quantity = 1, 
      selectedVariants = {},
      notes 
    } = req.body;
    // Verify product exists
    const product = await Product.findById(productId);
    if (!product) {
      return ResponseHandler.notFound(res, 'Product');
    }
    // Validate required dynamic fields from product
    const validationErrors: any[] = [];
    // Check if product has dynamic fields and validate them
    if (product.dynamicFields && product.dynamicFields.length > 0) {
      for (const field of product.dynamicFields) {
        console.log("field")
        console.log(field)

        if (field.isRequired) {
          const fieldValue = customerData[field.key];
          console.log("fieldValue")
          console.log(fieldValue)

          if (!fieldValue || fieldValue.trim() === '') {
            validationErrors.push({
              field: `customerData.${field.key}`,
              message: `${field.placeholder || field.key} is required`,
              value: fieldValue,
              location: 'body'
            });
          }
          
          // Special validation for phone fields
          if (field.key.toLowerCase().includes('phone') && fieldValue) {
            if (!validateAlgerianPhone(fieldValue)) {
              validationErrors.push({
                field: `customerData.${field.key}`,
                message: 'Invalid phone format. Must be 10 digits: 0[567]XXXXXXXX',
                value: fieldValue,
                location: 'body'
              });
            }
          }
          
          // Special validation for name fields
          if (field.key.toLowerCase().includes('name') && fieldValue) {
            const nameRegex = /^[a-zA-Z\u0600-\u06FF\s]{2,100}$/;
            if (!nameRegex.test(fieldValue.trim())) {
              validationErrors.push({
                field: `customerData.${field.key}`,
                message: 'Name must contain only letters and spaces, and be between 2-100 characters',
                value: fieldValue,
                location: 'body'
              });
            }
          }
        }
      }
    }
    console.log("error validations")
    console.log(validationErrors)
    // Return validation errors if any
    if (validationErrors.length > 0) {
      return ResponseHandler.error(
        res,
        'Validation failed for customer data',
        400,
        validationErrors,
        'VALIDATION_ERROR'
      );
    }
    // Calculate total price
    const price = product.discountPrice || product.price;
    const totalPrice = price * quantity;

    // Create new inquiry
    const inquiry = new OrderInquiry({
      productId,
      productName: product.name,
      customerData,
      quantity,
      selectedVariants,
      totalPrice,
      notes
    });
    console.log(inquiry)
    await inquiry.save();

    // Populate product details in response
    await inquiry.populate('product');

    ResponseHandler.success(
      res,
      { inquiry },
      'Order inquiry created successfully',
      201
    );
  });

  // Get all inquiries with filtering and pagination
  static getAllInquiries = asyncHandler(async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    // Build filter object
    const filter: any = {};
    
    if (req.query.status) {
      filter.status = req.query.status;
    }
    
    if (req.query.productId) {
      filter.productId = req.query.productId;
    }

    // Dynamic customer data filtering
    if (req.query.phone) {
      filter['customerData.phone'] = { 
        $regex: req.query.phone, 
        $options: 'i' 
      };
    }

    if (req.query.name) {
      filter['customerData.name'] = { 
        $regex: req.query.name, 
        $options: 'i' 
      };
    }

    // Support dynamic field filtering
    Object.keys(req.query).forEach(key => {
      if (key.startsWith('customerData.')) {
        const fieldName = key.substring('customerData.'.length);
        filter[`customerData.${fieldName}`] = { 
          $regex: req.query[key], 
          $options: 'i' 
        };
      }
    });

    // Date range filter
    if (req.query.startDate || req.query.endDate) {
      filter.createdAt = {};
      if (req.query.startDate) {
        filter.createdAt.$gte = new Date(req.query.startDate as string);
      }
      if (req.query.endDate) {
        filter.createdAt.$lte = new Date(req.query.endDate as string);
      }
    }

    // Execute query
    const inquiries = await OrderInquiry.find(filter)
      .populate('product', 'name price discountPrice images dynamicFields')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await OrderInquiry.countDocuments(filter);

    ResponseHandler.paginated(
      res,
      inquiries,
      total,
      page,
      limit,
      'Inquiries retrieved successfully'
    );
  });

  // Get inquiry by ID
  static getInquiryById = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    const inquiry = await OrderInquiry.findById(id)
      .populate('product', 'name price discountPrice images dynamicFields predefinedFields');

    if (!inquiry) {
      return ResponseHandler.notFound(res, 'Order inquiry');
    }

    ResponseHandler.success(
      res,
      { inquiry },
      'Inquiry retrieved successfully'
    );
  });

  // Update inquiry
  static updateInquiry = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const updates = req.body;

    // Validate customer data if provided
    if (updates.customerData) {
      const validationErrors: any[] = [];
      
      // Get the existing inquiry to know the product
      const existingInquiry = await OrderInquiry.findById(id);
      if (!existingInquiry) {
        return ResponseHandler.notFound(res, 'Order inquiry');
      }
      
      // Get product to validate dynamic fields
      const product = await Product.findById(existingInquiry.productId);
      if (product && product.dynamicFields) {
        for (const field of product.dynamicFields) {
          const fieldValue = updates.customerData[field.key];
          
          // Only validate if the field is being updated and is required
          if (fieldValue !== undefined && field.isRequired) {
            if (!fieldValue || fieldValue.trim() === '') {
              validationErrors.push({
                field: `customerData.${field.key}`,
                message: `${field.placeholder || field.key} is required`,
                value: fieldValue,
                location: 'body'
              });
            }
            
            // Phone validation
            if (field.key.toLowerCase().includes('phone') && fieldValue) {
              if (!validateAlgerianPhone(fieldValue)) {
                validationErrors.push({
                  field: `customerData.${field.key}`,
                  message: 'Invalid phone format. Must be 10 digits: 0[567]XXXXXXXX',
                  value: fieldValue,
                  location: 'body'
                });
              }
            }
            
            // Name validation
            if (field.key.toLowerCase().includes('name') && fieldValue) {
              const nameRegex = /^[a-zA-Z\u0600-\u06FF\s]{2,100}$/;
              if (!nameRegex.test(fieldValue.trim())) {
                validationErrors.push({
                  field: `customerData.${field.key}`,
                  message: 'Name must contain only letters and spaces, and be between 2-100 characters',
                  value: fieldValue,
                  location: 'body'
                });
              }
            }
          }
        }
      }
      
      if (validationErrors.length > 0) {
        return ResponseHandler.error(
          res,
          'Validation failed for customer data',
          400,
          validationErrors,
          'VALIDATION_ERROR'
        );
      }
    }

    // Remove fields that shouldn't be updated directly
    delete updates._id;
    delete updates.createdAt;
    delete updates.updatedAt;

    const inquiry = await OrderInquiry.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true, runValidators: true }
    ).populate('product', 'name price discountPrice images dynamicFields');

    if (!inquiry) {
      return ResponseHandler.notFound(res, 'Order inquiry');
    }

    ResponseHandler.success(
      res,
      { inquiry },
      'Order inquiry updated successfully'
    );
  });

  // Update inquiry status
  static updateInquiryStatus = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { status, notes } = req.body;

    const validStatuses = ['pending', 'contacted', 'converted', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return ResponseHandler.error(
        res,
        'Invalid status. Must be one of: ' + validStatuses.join(', '),
        400,
        undefined,
        'VALIDATION_ERROR'
      );
    }

    const updateData: any = { status };
    if (notes !== undefined) {
      updateData.notes = notes;
    }

    const inquiry = await OrderInquiry.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    ).populate('product', 'name price discountPrice images');

    if (!inquiry) {
      return ResponseHandler.notFound(res, 'Order inquiry');
    }

    ResponseHandler.success(
      res,
      { inquiry },
      'Inquiry status updated successfully'
    );
  });

  // Delete inquiry
  static deleteInquiry = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    const inquiry = await OrderInquiry.findByIdAndDelete(id);

    if (!inquiry) {
      return ResponseHandler.notFound(res, 'Order inquiry');
    }

    ResponseHandler.success(
      res,
      { deletedInquiry: inquiry },
      'Order inquiry deleted successfully'
    );
  });

  // Get inquiries statistics
  static getInquiriesStats = asyncHandler(async (req: Request, res: Response) => {
    const stats = await OrderInquiry.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalValue: { $sum: '$totalPrice' }
        }
      }
    ]);

    const totalInquiries = await OrderInquiry.countDocuments();
    const recentInquiries = await OrderInquiry.countDocuments({
      createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
    });

    // Top products by inquiry count
    const topProducts = await OrderInquiry.aggregate([
      {
        $group: {
          _id: '$productId',
          productName: { $first: '$productName' },
          inquiryCount: { $sum: 1 },
          totalValue: { $sum: '$totalPrice' }
        }
      },
      { $sort: { inquiryCount: -1 } },
      { $limit: 10 }
    ]);

    ResponseHandler.success(
      res,
      {
        statusStats: stats,
        totalInquiries,
        recentInquiries,
        topProducts
      },
      'Inquiry statistics retrieved successfully'
    );
  });

  // Bulk update inquiry status
  static bulkUpdateStatus = asyncHandler(async (req: Request, res: Response) => {
    const { ids, status } = req.body;

    const validStatuses = ['pending', 'contacted', 'converted', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return ResponseHandler.error(
        res,
        'Invalid status. Must be one of: ' + validStatuses.join(', '),
        400,
        undefined,
        'VALIDATION_ERROR'
      );
    }

    const result = await OrderInquiry.updateMany(
      { _id: { $in: ids } },
      { $set: { status } }
    );

    ResponseHandler.success(
      res,
      { updatedCount: result.modifiedCount },
      `${result.modifiedCount} inquiries updated successfully`
    );
  });

  // Bulk delete inquiries
  static bulkDelete = asyncHandler(async (req: Request, res: Response) => {
    const { ids } = req.body;

    const result = await OrderInquiry.deleteMany({ _id: { $in: ids } });

    ResponseHandler.success(
      res,
      { deletedCount: result.deletedCount },
      `${result.deletedCount} inquiries deleted successfully`
    );
  });
}