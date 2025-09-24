// controllers/orderInquiryController.ts
import { Request, Response } from 'express';
import { ResponseHandler, asyncHandler, validateRequest } from '../utils/responseHandler';
import { OrderInquiry } from '../models/OrderInquiry';
import Product from '../models/Product';
import Offer, { IOffer } from '../models/Offer';

// Phone validation utility
const validateAlgerianPhone = (phone: string): boolean => {
  const cleanPhone = phone.replace(/[\s\-\(\)]/g, '');
  const phoneRegex = /^0[567]\d{8}$/;
  return phoneRegex.test(cleanPhone);
};

export class OrderInquiryController {


    static createInquiry = asyncHandler(async (req: Request, res: Response) => {
    const { 
      productId, 
      customerData = {}, 
      quantity = 1, 
      typeOfOrder,       // 'offer' | 'quantity'
      offerId,           // optional
      selectedVariants = {},
      notes 
    } = req.body;

    // Verify product exists
    const product = await Product.findById(productId);
    if (!product) {
      return ResponseHandler.notFound(res, 'Product');
    }

    // Validate required dynamic fields
    const validationErrors: any[] = [];
    if (product.dynamicFields?.length) {
      for (const field of product.dynamicFields) {
        if (field.isRequired) {
          const fieldValue = customerData[field.key];
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
    let totalPrice = 0;

    if (typeOfOrder === 'offer') {
      if (!offerId) {
        return ResponseHandler.error(res, 'Offer ID is required for offer inquiries', 400);
      }

      const offer: IOffer | null = await Offer.findById(offerId);
      console.log(offerId)
      if (!offer || !offer.isActive || (offer.validUntil && new Date(offer.validUntil) < new Date())) {
        return ResponseHandler.error(res, 'Selected offer is not valid or has expired', 400);
      }

      totalPrice = offer.discountedPrice ?? offer.originalPrice ?? product.price;

    } else if (typeOfOrder === 'quantity') {
      totalPrice = (product.discountPrice ?? product.price) * quantity;
    } else {
      return ResponseHandler.error(res, 'Invalid typeOfOrder', 400);
    }

    // Create new inquiry
    const inquiry = new OrderInquiry({
      productId,
      productName: product.name,
      customerData,
      quantity: typeOfOrder === 'quantity' ? quantity : 1,
      offerId: typeOfOrder === 'offer' ? offerId : undefined,
      selectedVariants,
      totalPrice,
      notes,
      typeOfOrder
    });

    await inquiry.save();
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

  // Delete all inquiries (requires confirmation code)
static deleteAllInquiries = asyncHandler(async (req: Request, res: Response) => {
  const { confirmationCode } = req.body;

  // Security check – to avoid accidental deletion
  const REQUIRED_CODE = process.env.DELETE_ALL_CONFIRMATION || 'CONFIRM_DELETE_ALL';

  if (!confirmationCode || confirmationCode !== REQUIRED_CODE) {
    return ResponseHandler.error(
      res,
      'Invalid or missing confirmation code',
      403,
      undefined,
      'INVALID_CONFIRMATION'
    );
  }

  const result = await OrderInquiry.deleteMany({});

  ResponseHandler.success(
    res,
    { deletedCount: result.deletedCount },
    `${result.deletedCount} inquiries deleted successfully`
  );
});

}