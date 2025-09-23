// controllers/orderInquiryController.ts
import { Request, Response } from 'express';
import Product from '../models/Product';
import OrderInquiry from '../models/OrderInquiry';
import { ResponseHandler, asyncHandler } from '../utils/responseHandler';

// --- Utilities ---
const validateAlgerianPhone = (phone: string): boolean => {
  const cleanPhone = phone.replace(/[\s\-\(\)]/g, '');
  return /^0[567]\d{8}$/.test(cleanPhone);
};

const nameRegex = /^[a-zA-Z\u0600-\u06FF\s]{2,100}$/;
const validStatuses = ['pending', 'contacted', 'converted', 'cancelled'] as const;

// --- Controller ---
export class OrderInquiryController {
  // ✅ Create new order inquiry
  static createInquiry = asyncHandler(async (req: Request, res: Response) => {
    const { productId, customerData = {}, quantity = 1, selectedVariants = {}, notes } = req.body;

    const product = await Product.findById(productId);
    if (!product) return ResponseHandler.notFound(res, 'Product');

    // --- Validate dynamic fields ---
    const validationErrors: any[] = [];
    if (Array.isArray(product.dynamicFields) && product.dynamicFields.length > 0) {
      for (const field of product.dynamicFields) {
        const fieldValue = customerData[field.key];

        if (field.isRequired) {
          if (!fieldValue || fieldValue.trim() === '') {
            validationErrors.push({
              field: `customerData.${field.key}`,
              message: `${field.placeholder || field.key} is required`,
              value: fieldValue,
              location: 'body',
            });
          }
        }

        if (field.key.toLowerCase().includes('phone') && fieldValue && !validateAlgerianPhone(fieldValue)) {
          validationErrors.push({
            field: `customerData.${field.key}`,
            message: 'Invalid phone format. Must be 10 digits: 0[567]XXXXXXXX',
            value: fieldValue,
            location: 'body',
          });
        }

        if (field.key.toLowerCase().includes('name') && fieldValue && !nameRegex.test(fieldValue.trim())) {
          validationErrors.push({
            field: `customerData.${field.key}`,
            message: 'Name must contain only letters and spaces (2–100 chars)',
            value: fieldValue,
            location: 'body',
          });
        }
      }
    }

    if (validationErrors.length > 0) {
      return ResponseHandler.error(res, 'Validation failed for customer data', 400, validationErrors, 'VALIDATION_ERROR');
    }

    // --- Create inquiry ---
    const price = product.discountPrice || product.price;
    const inquiry = new OrderInquiry({
      productId,
      productName: product.name,
      customerData,
      quantity,
      selectedVariants,
      totalPrice: price * quantity,
      notes,
    });

    await inquiry.save();
    await inquiry.populate('product');

    ResponseHandler.success(res, { inquiry }, 'Order inquiry created successfully', 201);
  });

  // ✅ Get all inquiries (with filters + pagination)
  static getAllInquiries = asyncHandler(async (req: Request, res: Response) => {
    const page = Math.max(1, parseInt(req.query.page as string, 10) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string, 10) || 10));
    const skip = (page - 1) * limit;

    const filter: Record<string, any> = {};
    if (req.query.status) filter.status = req.query.status;
    if (req.query.productId) filter.productId = req.query.productId;

    if (req.query.phone) filter['customerData.phone'] = { $regex: req.query.phone, $options: 'i' };
    if (req.query.name) filter['customerData.name'] = { $regex: req.query.name, $options: 'i' };

    Object.keys(req.query).forEach((key) => {
      if (key.startsWith('customerData.')) {
        const fieldName = key.substring('customerData.'.length);
        filter[`customerData.${fieldName}`] = { $regex: req.query[key], $options: 'i' };
      }
    });

    if (req.query.startDate || req.query.endDate) {
      filter.createdAt = {};
      if (req.query.startDate) filter.createdAt.$gte = new Date(req.query.startDate as string);
      if (req.query.endDate) filter.createdAt.$lte = new Date(req.query.endDate as string);
    }

    const [inquiries, total] = await Promise.all([
      OrderInquiry.find(filter)
        .populate('product', 'name price discountPrice images dynamicFields')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      OrderInquiry.countDocuments(filter),
    ]);

    ResponseHandler.paginated(res, inquiries, total, page, limit, 'Inquiries retrieved successfully');
  });

  // ✅ Get inquiry by ID
  static getInquiryById = asyncHandler(async (req: Request, res: Response) => {
    const inquiry = await OrderInquiry.findById(req.params.id).populate(
      'product',
      'name price discountPrice images dynamicFields predefinedFields'
    );

    if (!inquiry) return ResponseHandler.notFound(res, 'Order inquiry');
    ResponseHandler.success(res, { inquiry }, 'Inquiry retrieved successfully');
  });

  // ✅ Update inquiry
  static updateInquiry = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const updates = { ...req.body };
    delete updates._id;
    delete updates.createdAt;
    delete updates.updatedAt;

    if (updates.customerData) {
      const existingInquiry = await OrderInquiry.findById(id);
      if (!existingInquiry) return ResponseHandler.notFound(res, 'Order inquiry');

      const product = await Product.findById(existingInquiry.productId);
      const validationErrors: any[] = [];

      if (product && product.dynamicFields) {
        for (const field of product.dynamicFields) {
          const fieldValue = updates.customerData[field.key];

          if (fieldValue !== undefined && field.isRequired) {
            if (!fieldValue.trim()) {
              validationErrors.push({ field: `customerData.${field.key}`, message: `${field.placeholder || field.key} is required`, value: fieldValue, location: 'body' });
            }
            if (field.key.toLowerCase().includes('phone') && !validateAlgerianPhone(fieldValue)) {
              validationErrors.push({ field: `customerData.${field.key}`, message: 'Invalid phone format. Must be 10 digits: 0[567]XXXXXXXX', value: fieldValue, location: 'body' });
            }
            if (field.key.toLowerCase().includes('name') && !nameRegex.test(fieldValue.trim())) {
              validationErrors.push({ field: `customerData.${field.key}`, message: 'Name must contain only letters and spaces (2–100 chars)', value: fieldValue, location: 'body' });
            }
          }
        }
      }

      if (validationErrors.length > 0) {
        return ResponseHandler.error(res, 'Validation failed for customer data', 400, validationErrors, 'VALIDATION_ERROR');
      }
    }

    const inquiry = await OrderInquiry.findByIdAndUpdate(id, { $set: updates }, { new: true, runValidators: true })
      .populate('product', 'name price discountPrice images dynamicFields');

    if (!inquiry) return ResponseHandler.notFound(res, 'Order inquiry');
    ResponseHandler.success(res, { inquiry }, 'Order inquiry updated successfully');
  });

  // ✅ Update status
  static updateInquiryStatus = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { status, notes } = req.body;

    if (!validStatuses.includes(status)) {
      return ResponseHandler.error(res, `Invalid status. Must be one of: ${validStatuses.join(', ')}`, 400, undefined, 'VALIDATION_ERROR');
    }

    const inquiry = await OrderInquiry.findByIdAndUpdate(
      id,
      { $set: { status, ...(notes && { notes }) } },
      { new: true, runValidators: true }
    ).populate('product', 'name price discountPrice images');

    if (!inquiry) return ResponseHandler.notFound(res, 'Order inquiry');
    ResponseHandler.success(res, { inquiry }, 'Inquiry status updated successfully');
  });

  // ✅ Delete inquiry
  static deleteInquiry = asyncHandler(async (req: Request, res: Response) => {
    const inquiry = await OrderInquiry.findByIdAndDelete(req.params.id);
    if (!inquiry) return ResponseHandler.notFound(res, 'Order inquiry');
    ResponseHandler.success(res, { deletedInquiry: inquiry }, 'Order inquiry deleted successfully');
  });

  // ✅ Statistics
  static getInquiriesStats = asyncHandler(async (req: Request, res: Response) => {
    const [stats, totalInquiries, recentInquiries, topProducts] = await Promise.all([
      OrderInquiry.aggregate([{ $group: { _id: '$status', count: { $sum: 1 }, totalValue: { $sum: '$totalPrice' } } }]),
      OrderInquiry.countDocuments(),
      OrderInquiry.countDocuments({ createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } }),
      OrderInquiry.aggregate([
        { $group: { _id: '$productId', productName: { $first: '$productName' }, inquiryCount: { $sum: 1 }, totalValue: { $sum: '$totalPrice' } } },
        { $sort: { inquiryCount: -1 } },
        { $limit: 10 },
      ]),
    ]);

    ResponseHandler.success(res, { statusStats: stats, totalInquiries, recentInquiries, topProducts }, 'Inquiry statistics retrieved successfully');
  });

  // ✅ Bulk update
  static bulkUpdateStatus = asyncHandler(async (req: Request, res: Response) => {
    const { ids, status } = req.body;
    if (!validStatuses.includes(status)) {
      return ResponseHandler.error(res, `Invalid status. Must be one of: ${validStatuses.join(', ')}`, 400, undefined, 'VALIDATION_ERROR');
    }

    const result = await OrderInquiry.updateMany({ _id: { $in: ids } }, { $set: { status } });
    ResponseHandler.success(res, { updatedCount: result.modifiedCount }, `${result.modifiedCount} inquiries updated successfully`);
  });

  // ✅ Bulk delete
  static bulkDelete = asyncHandler(async (req: Request, res: Response) => {
    const { ids } = req.body;
    const result = await OrderInquiry.deleteMany({ _id: { $in: ids } });
    ResponseHandler.success(res, { deletedCount: result.deletedCount }, `${result.deletedCount} inquiries deleted successfully`);
  });
}
