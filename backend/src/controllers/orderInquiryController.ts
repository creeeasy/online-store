// controllers/orderInquiryController.ts
import { Request, Response } from 'express';
import { ResponseHandler, asyncHandler, validateRequest } from '../utils/responseHandler';
import { OrderInquiry } from '../models/OrderInquiry';
import Product from '../models/Product';
import Offer, { IOffer } from '../models/Offer';
import { validateAlgerianPhone } from '../types/orderInquiry';

// Phone validation utility


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
    return ResponseHandler.notFound(res, 'المنتج غير موجود');
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
            message: `${field.placeholder || field.key} مطلوب`,
            value: fieldValue,
            location: 'body'
          });
        }

        // Phone validation
        if (field.key.toLowerCase().includes('phone') && fieldValue) {
          if (!validateAlgerianPhone(fieldValue)) {
            validationErrors.push({
              field: `customerData.${field.key}`,
              message: 'رقم الهاتف غير صالح. يجب أن يكون 10 أرقام: 0[567]XXXXXXXX',
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
              message: 'الاسم يجب أن يحتوي على أحرف ومسافات فقط، ويكون بين 2-100 حرف',
              value: fieldValue,
              location: 'body'
            });
          }
        }

        // Email validation
        if (field.key.toLowerCase().includes('email') && fieldValue) {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(fieldValue)) {
            validationErrors.push({
              field: `customerData.${field.key}`,
              message: 'البريد الإلكتروني غير صالح',
              value: fieldValue,
              location: 'body'
            });
          }
        }

        // Age validation
        if (field.key.toLowerCase().includes('age') && fieldValue) {
          const age = parseInt(fieldValue);
          if (isNaN(age) || age < 1 || age > 120) {
            validationErrors.push({
              field: `customerData.${field.key}`,
              message: 'العمر غير صالح',
              value: fieldValue,
              location: 'body'
            });
          }
        }

        // Wilaya validation
        if (field.key.toLowerCase().includes('wilaya') && fieldValue) {
          // Add your wilaya validation logic here if needed
          if (fieldValue.trim().length < 2) {
            validationErrors.push({
              field: `customerData.${field.key}`,
              message: 'الولاية غير صالحة',
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
      'فشل في التحقق من بيانات العميل',
      400,
      validationErrors,
      'VALIDATION_ERROR'
    );
  }

  let totalPrice = 0;

  if (typeOfOrder === 'offer') {
    if (!offerId) {
      return ResponseHandler.error(res, 'معرف العرض مطلوب للطلبات بالعرض', 400);
    }

    const offer: IOffer | null = await Offer.findById(offerId);
    if (!offer || !offer.isActive || (offer.validUntil && new Date(offer.validUntil) < new Date())) {
      return ResponseHandler.error(res, 'العرض المحدد غير صالح أو منتهي الصلاحية', 400);
    }

    totalPrice = offer.discountedPrice ?? offer.originalPrice ?? product.price;

  } else if (typeOfOrder === 'quantity') {
    if (quantity < 1) {
      return ResponseHandler.error(res, 'الكمية يجب أن تكون أكبر من صفر', 400);
    }

    // Check max quantity if product has limits
    if (product.allowMultipleQuantities && product.maxQuantityPerInquiry && quantity > product.maxQuantityPerInquiry) {
      return ResponseHandler.error(res, `الحد الأقصى للكمية هو ${product.maxQuantityPerInquiry}`, 400);
    }

    totalPrice = (product.discountPrice ?? product.price) * quantity;
  } else {
    return ResponseHandler.error(res, 'نوع الطلب غير صالح', 400);
  }

  try {
    const inquiry = new OrderInquiry({
      productId,
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
      'تم إنشاء طلب الاستفسار بنجاح',
      201
    );
  } catch (error) {
    return ResponseHandler.error(res, 'حدث خطأ أثناء إنشاء الطلب', 500);
  }
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

  // Execute query with population
  const inquiries = await OrderInquiry.find(filter)
    .populate('product', 'name price discountPrice images dynamicFields')
    .populate('offer', 'title originalPrice discountedPrice isActive validUntil')
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

static getInquiryById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const inquiry = await OrderInquiry.findById(id)
    .populate('product', 'name price discountPrice images dynamicFields predefinedFields')
    .populate('offer', 'title originalPrice discountedPrice isActive validUntil');

  if (!inquiry) {
    return ResponseHandler.notFound(res, 'Order inquiry');
  }

  ResponseHandler.success(
    res,
    { inquiry },
    'Inquiry retrieved successfully'
  );
});

 

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
    createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } // last 7 days
  });

  // Top products by inquiry count
  const topProducts = await OrderInquiry.aggregate([
    {
      $group: {
        _id: '$productId',
        inquiryCount: { $sum: 1 },
        totalValue: { $sum: '$totalPrice' }
      }
    },
    { $sort: { inquiryCount: -1 } },
    { $limit: 10 },
    {
      $lookup: {
        from: 'products', // collection name in Mongo
        localField: '_id',
        foreignField: '_id',
        as: 'product'
      }
    },
    { $unwind: '$product' },
    {
      $project: {
        inquiryCount: 1,
        totalValue: 1,
        'product._id': 1,
        'product.name': 1,
        'product.price': 1,
        'product.discountPrice': 1,
        'product.images': 1
      }
    }
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