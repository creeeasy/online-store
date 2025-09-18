import { Request, Response } from 'express';
import { body } from 'express-validator';
import Product, { IProduct, WILAYAS } from '../models/Product';
import { AuthRequest } from '../types';
import { ResponseHandler, asyncHandler, validateRequest } from '../utils/responseHandler';

// Predefined categories configuration
const PREDEFINED_CATEGORIES = {
  size: { options: ["small", "medium", "large", "x-large", "xx-large"] },
  color: { options: ["red", "blue", "green", "black", "white", "yellow", "purple", "pink"] },
  material: { options: ["cotton", "polyester", "silk", "wool", "leather", "denim"] },
  style: { options: ["casual", "formal", "sport", "vintage", "modern"] }
};

// Enhanced validation rules with better error messages
export const productValidationRules = {
  create: [
    body('name')
      .trim()
      .notEmpty()
      .withMessage('Product name is required and cannot be empty')
      .isLength({ min: 2, max: 100 })
      .withMessage('Product name must be between 2 and 100 characters'),
    
    body('price')
      .optional()
      .isNumeric()
      .withMessage('Price must be a valid number')
      .isFloat({ min: 0.01 })
      .withMessage('Price must be greater than 0')
      .toFloat(),

    body('discountPrice')
      .optional()
      .isNumeric()
      .withMessage('Discount price must be a valid number')
      .isFloat({ min: 0 })
      .withMessage('Discount price cannot be negative')
      .toFloat()
      .custom((value, { req }) => {
        if (req.body.price && value >= req.body.price) {
          throw new Error('Discount price must be less than the original price');
        }
        return true;
      }),
    
    body('description')
      .trim()
      .notEmpty()
      .withMessage('Product description is required')
      .isLength({ min: 10, max: 1000 })
      .withMessage('Description must be between 10 and 1000 characters'),
    
    body('images')
      .isArray({ min: 1 })
      .withMessage('At least one product image is required'),
    
    body('images.*')
      .isURL()
      .withMessage('Each image must be a valid URL'),
    
    body('dynamicFields')
      .optional()
      .isArray()
      .withMessage('Dynamic fields must be an array'),
    
    body('dynamicFields.*.key')
      .if(body('dynamicFields').exists())
      .trim()
      .notEmpty()
      .withMessage('Dynamic field key cannot be empty')
      .isLength({ max: 50 })
      .withMessage('Dynamic field key cannot exceed 50 characters'),
    
    body('dynamicFields.*.placeholder')
      .if(body('dynamicFields').exists())
      .trim()
      .notEmpty()
      .withMessage('Dynamic field placeholder cannot be empty')
      .isLength({ max: 100 })
      .withMessage('Dynamic field placeholder cannot exceed 100 characters'),
    
    body('offers')
      .optional()
      .isArray()
      .withMessage('Offers must be an array'),
    
      body('offers.*.discount')
      .if(body('offers').exists())
      .isInt({ min: 1, max: 99 })
      .withMessage('Discount must be between 1 and 99 percent'),
    
    body('offers.*.validUntil')
      .if(body('offers').exists())
      .optional()
      .isISO8601()
      .withMessage('Valid until date must be a valid date')
      .custom((value) => {
        if (value && new Date(value) <= new Date()) {
          throw new Error('Valid until date must be in the future');
        }
        return true;
      }),
    
    body('hiddenFields')
      .optional()
      .isArray()
      .withMessage('Hidden fields must be an array'),
    
    body('hiddenFields.*.key')
      .if(body('hiddenFields').exists())
      .trim()
      .notEmpty()
      .withMessage('Hidden field key cannot be empty'),
    
    body('hiddenFields.*.value')
      .if(body('hiddenFields').exists())
      .trim()
      .notEmpty()
      .withMessage('Hidden field value cannot be empty'),
    
    body('reference')
      .optional()
      .trim()
      .isLength({ max: 200 })
      .withMessage('Reference cannot exceed 200 characters')
  ],
  
  update: [
    body('name')
      .optional()
      .trim()
      .notEmpty()
      .withMessage('Product name cannot be empty if provided')
      .isLength({ min: 2, max: 100 })
      .withMessage('Product name must be between 2 and 100 characters'),
    
    body('price')
      .optional()
      .isNumeric()
      .withMessage('Price must be a valid number')
      .isFloat({ min: 0.01 })
      .withMessage('Price must be greater than 0'),
    
    body('discountPrice')
      .optional()
      .isNumeric()
      .withMessage('Discount price must be a valid number')
      .isFloat({ min: 0 })
      .withMessage('Discount price cannot be negative')
      .toFloat(),
    
    body('description')
      .optional()
      .trim()
      .isLength({ min: 10, max: 1000 })
      .withMessage('Description must be between 10 and 1000 characters if provided'),
    
    body('images')
      .optional()
      .isArray({ min: 1 })
      .withMessage('At least one image is required if images are provided'),
    
    body('images.*')
      .optional()
      .isURL()
      .withMessage('Each image must be a valid URL'),
    
    body('offers.*.discount')
      .optional()
      .isInt({ min: 1, max: 99 })
      .withMessage('Discount must be between 1 and 99 percent'),
    
    body('offers.*.discountPercentage')
      .optional()
      .isInt({ min: 0, max: 100 })
      .withMessage('Discount percentage must be between 0 and 100'),
    
    body('offers.*.wilaya')
      .optional()
      .isIn(WILAYAS)
      .withMessage('Wilaya must be one of the valid Algerian regions'),
    
    body('offers.*.phone')
      .optional()
      .matches(/^0/)
      .withMessage('Phone number must start with 0')
  ]
};

// Helper function to initialize predefined fields
const initializePredefinedFields = () => {
  return Object.keys(PREDEFINED_CATEGORIES).map(category => ({
    category,
    options: PREDEFINED_CATEGORIES[category as keyof typeof PREDEFINED_CATEGORIES].options,
    selectedOptions: [],
    isActive: false
  }));
};

// @desc    Get all products with advanced filtering
// @route   GET /api/products
// @access  Public
export const getProducts = asyncHandler(async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const skip = (page - 1) * limit;
  
  // Build filter query
  let filter: any = {};
  
  // Category filter
  if (req.query.category) {
    filter['predefinedFields.category'] = req.query.category;
    filter['predefinedFields.isActive'] = true;
  }
  
  // Price range filter
  if (req.query.minPrice || req.query.maxPrice) {
    filter.price = {};
    if (req.query.minPrice) filter.price.$gte = parseFloat(req.query.minPrice as string);
    if (req.query.maxPrice) filter.price.$lte = parseFloat(req.query.maxPrice as string);
  }
  
  // Sale items filter
  if (req.query.onSale === 'true') {
    filter.discountPrice = { $exists: true, $lt: filter.price?.$gte || 0 };
  }
  
  // Active offers filter
  if (req.query.hasOffers === 'true') {
    filter['offers.isActive'] = true;
    filter['offers.validUntil'] = { $gt: new Date() };
  }

  const products = await Product.find(filter)
    .populate('createdBy', 'username email')
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 });

  const total = await Product.countDocuments(filter);

  ResponseHandler.paginated(
    res,
    products,
    total,
    page,
    limit,
    'Products retrieved successfully'
  );
});

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
export const getProduct = asyncHandler(async (req: Request, res: Response) => {
  const product = await Product.findById(req.params.id).populate(
    'createdBy',
    'username email'
  );

  if (!product) {
    return ResponseHandler.notFound(res, 'Product');
  }

  ResponseHandler.success(
    res,
    { product },
    'Product retrieved successfully'
  );
});

// @desc    Create product
// @route   POST /api/products
// @access  Private/Admin
export const createProduct = [
  ...productValidationRules.create,
  validateRequest,
  asyncHandler(async (req: AuthRequest, res: Response) => {
    // Initialize predefined fields if not provided
    const predefinedFields = req.body.predefinedFields || initializePredefinedFields();

    // Auto-detect reference from query parameters if not provided
    let reference = req.body.reference;
    if (!reference && req.query.ref) {
      reference = req.query.ref as string;
    } else if (!reference && req.query.utm_source) {
      reference = req.query.utm_source as string;
    }

    const productData = {
      ...req.body,
      predefinedFields,
      createdBy: req.user?.id,
      reference
    };

    const product = await Product.create(productData);
    await product.populate('createdBy', 'username email');

    ResponseHandler.success(
      res,
      { product },
      'Product created successfully',
      201
    );
  })
];

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private/Admin
export const updateProduct = [
  ...productValidationRules.update,
  validateRequest,
  asyncHandler(async (req: AuthRequest, res: Response) => {
    let product = await Product.findById(req.params.id);

    if (!product) {
      return ResponseHandler.notFound(res, 'Product');
    }

    // Check if user owns the product or is admin
    if (product.createdBy.toString() !== req.user?.id && req.user?.role !== 'admin') {
      return ResponseHandler.forbidden(res, 'Not authorized to update this product');
    }

    product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    ).populate('createdBy', 'username email');

    ResponseHandler.success(
      res,
      { product },
      'Product updated successfully'
    );
  })
];

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private/Admin
export const deleteProduct = asyncHandler(async (req: AuthRequest, res: Response) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return ResponseHandler.notFound(res, 'Product');
  }

  // Check if user owns the product or is admin
    if (product.createdBy.toString() !== req.user?.id && req.user?.role !== 'admin') {
      return ResponseHandler.forbidden(res, 'Not authorized to delete this product');
    }

    await Product.findByIdAndDelete(req.params.id);

    ResponseHandler.success(
      res,
      {},
      'Product deleted successfully'
    );
  });

// @desc    Search products
// @route   GET /api/products/search
// @access  Public
export const searchProducts = asyncHandler(async (req: Request, res: Response) => {
  const { q, category, minPrice, maxPrice, onSale, hasOffers } = req.query;
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const skip = (page - 1) * limit;

  let query: any = {};

  // Text search
  if (q) {
    query.$text = { $search: q as string };
  }

  // Category filter
  if (category) {
    query['predefinedFields.category'] = category;
    query['predefinedFields.isActive'] = true;
  }

  // Price range filter
  if (minPrice || maxPrice) {
    query.price = {};
    if (minPrice) query.price.$gte = parseFloat(minPrice as string);
    if (maxPrice) query.price.$lte = parseFloat(maxPrice as string);
  }

  // Sale items filter
  if (onSale === 'true') {
    query.discountPrice = { $exists: true, $lt: query.price?.$gte || 0 };
  }

  // Active offers filter
  if (hasOffers === 'true') {
    query['offers.isActive'] = true;
    query['offers.validUntil'] = { $gt: new Date() };
  }

  const products = await Product.find(query)
    .populate('createdBy', 'username email')
    .skip(skip)
    .limit(limit)
    .sort({ score: { $meta: 'textScore' }, createdAt: -1 });

  const total = await Product.countDocuments(query);

  ResponseHandler.paginated(
    res,
    products,
    total,
    page,
    limit,
    'Products search results'
  );
});

// @desc    Bulk update products
// @route   PATCH /api/products/bulk
// @access  Private/Admin
export const bulkUpdateProducts = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { productIds, updateData } = req.body;

  if (!productIds || !Array.isArray(productIds) || productIds.length === 0) {
    return ResponseHandler.error(
      res,
      'Product IDs are required and must be a non-empty array',
      400,
      [{
        field: 'productIds',
        message: 'Product IDs are required and must be a non-empty array',
        value: productIds,
        location: 'body'
      }],
      'VALIDATION_ERROR'
    );
  }

  if (!updateData || Object.keys(updateData).length === 0) {
    return ResponseHandler.error(
      res,
      'Update data is required',
      400,
      [{
        field: 'updateData',
        message: 'Update data is required and cannot be empty',
        value: updateData,
        location: 'body'
      }],
      'VALIDATION_ERROR'
    );
  }

  const result = await Product.updateMany(
    { _id: { $in: productIds }, createdBy: req.user?.id },
    updateData,
    { runValidators: true }
  );

  ResponseHandler.success(
    res,
    { 
      modifiedCount: result.modifiedCount,
      matchedCount: result.matchedCount
    },
    `${result.modifiedCount} products updated successfully`
  );
});

// @desc    Get product statistics
// @route   GET /api/products/stats
// @access  Public
export const getProductStats = asyncHandler(async (req: Request, res: Response) => {
  // Count total products
  const totalProducts = await Product.countDocuments();

  // Products on sale (discountPrice < price)
  const onSaleCount = await Product.countDocuments({
    discountPrice: { $exists: true, $ne: null },
    $expr: { $lt: ["$discountPrice", "$price"] }
  });

  // Products with at least one active offer
  const withActiveOffers = await Product.countDocuments({
    offers: { 
      $elemMatch: { 
        isActive: true, 
        validUntil: { $gt: new Date() } 
      } 
    }
  });

  // Stats by predefined category
  const categoryStats = await Product.aggregate([
    { $unwind: "$predefinedFields" },
    { $match: { "predefinedFields.isActive": true } },
    { 
      $group: {
        _id: "$predefinedFields.category",
        totalProducts: { $sum: 1 }
      } 
    },
    { $sort: { totalProducts: -1 } }
  ]);

  // Recently created products (e.g., last 5)
  const recentProducts = await Product.find()
    .sort({ createdAt: -1 })
    .limit(5)
    .select("name price discountPrice images createdAt");

  ResponseHandler.success(
    res,
    {
      totalProducts,
      onSaleCount,
      withActiveOffers,
      categoryStats,
      recentProducts
    },
    'Product statistics retrieved successfully'
  );
});

// @desc    Clone an existing product
// @route   POST /api/products/:id/clone
// @access  Private/Admin
export const cloneProduct = [
  body('reference')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Reference cannot exceed 200 characters'),
  validateRequest,
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const productId = req.params.id;
    
    // Find the original product
    const originalProduct = await Product.findById(productId);
    
    if (!originalProduct) {
      return ResponseHandler.notFound(res, 'Product');
    }
    
    // Create a copy of the product data
    const productData = {
      ...originalProduct.toObject(),
      _id: undefined, // Remove the original ID
      name: `${originalProduct.name} (Copy)`, // Append "Copy" to the name
      createdBy: req.user?.id,
      createdAt: new Date(),
      updatedAt: new Date(),
      reference: req.body.reference || originalProduct.reference // Allow reference override
    };
    
    // Create the cloned product
    const clonedProduct = await Product.create(productData);
    await clonedProduct.populate('createdBy', 'username email');
    
    ResponseHandler.success(
      res,
      { product: clonedProduct },
      'Product cloned successfully',
      201
    );
  })
];