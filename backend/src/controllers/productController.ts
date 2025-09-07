// controllers/productController.ts
import { Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';
import Product, { IProduct } from '../models/Product';
import { AuthRequest } from '../types';

// Predefined categories configuration
const PREDEFINED_CATEGORIES = {
  size: { options: ["small", "medium", "large", "x-large", "xx-large"] },
  color: { options: ["red", "blue", "green", "black", "white", "yellow", "purple", "pink"] },
  material: { options: ["cotton", "polyester", "silk", "wool", "leather", "denim"] },
  style: { options: ["casual", "formal", "sport", "vintage", "modern"] }
};

// Enhanced validation rules with better error messages
const productValidationRules = {
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
    
    body('offers.*.title')
      .if(body('offers').exists())
      .trim()
      .notEmpty()
      .withMessage('Offer title is required')
      .isLength({ max: 100 })
      .withMessage('Offer title cannot exceed 100 characters'),
    
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
      .withMessage('Hidden field value cannot be empty')
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
      .custom((value, { req }) => {
        if (value && req.body.price && parseFloat(value) >= parseFloat(req.body.price)) {
          throw new Error('Discount price must be less than the original price');
        }
        return true;
      }),
    
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
      .withMessage('Discount must be between 1 and 99 percent')
  ]
};

// Enhanced error response helper
const sendValidationError = (res: Response, errors: any[]) => {
  const formattedErrors = errors.map(error => ({
    field: error.path || error.param,
    message: error.msg,
    value: error.value,
    location: error.location || 'body'
  }));

  return res.status(400).json({
    success: false,
    message: 'Validation failed. Please check the provided data.',
    errors: formattedErrors,
    timestamp: new Date().toISOString()
  });
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
export const getProducts = async (req: Request, res: Response, next: NextFunction) => {
  try {
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

    res.json({
      success: true,
      data: {
        products,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
export const getProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const product = await Product.findById(req.params.id).populate(
      'createdBy',
      'username email'
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
        timestamp: new Date().toISOString()
      });
    }

    res.json({
      success: true,
      data: { product },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create product
// @route   POST /api/products
// @access  Private/Admin
export const createProduct = [
  ...productValidationRules.create,

  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return sendValidationError(res, errors.array());
      }

      // Initialize predefined fields if not provided
      const predefinedFields = req.body.predefinedFields || initializePredefinedFields();

      const productData = {
        ...req.body,
        predefinedFields,
        createdBy: req.user?.id,
      };

      const product = await Product.create(productData);
      await product.populate('createdBy', 'username email');

      res.status(201).json({
        success: true,
        message: 'Product created successfully',
        data: { product },
        timestamp: new Date().toISOString()
      });
    } catch (error: any) {
      if (error.code === 11000) {
        const duplicateField = Object.keys(error.keyValue)[0];
        const duplicateValue = error.keyValue[duplicateField];
        
        return res.status(400).json({
          success: false,
          message: 'Duplicate entry detected',
          errors: [{
            field: duplicateField,
            message: `A product with ${duplicateField} "${duplicateValue}" already exists`,
            value: duplicateValue,
            location: 'body'
          }],
          timestamp: new Date().toISOString()
        });
      }
      
      // Handle mongoose validation errors
      if (error.name === 'ValidationError') {
        const validationErrors = Object.values(error.errors).map((err: any) => ({
          field: err.path,
          message: err.message,
          value: err.value,
          location: 'body'
        }));
        
        return res.status(400).json({
          success: false,
          message: 'Product validation failed',
          errors: validationErrors,
          timestamp: new Date().toISOString()
        });
      }
      
      next(error);
    }
  },
];

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private/Admin
export const updateProduct = [
  ...productValidationRules.update,

  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      console.log(req.body)
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return sendValidationError(res, errors.array());
      }

      let product = await Product.findById(req.params.id);

      if (!product) {
        return res.status(404).json({
          success: false,
          message: 'Product not found',
          timestamp: new Date().toISOString()
        });
      }

      // Check if user owns the product or is admin
      if (product.createdBy.toString() !== req.user?.id && req.user?.role !== 'admin') {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to update this product',
          timestamp: new Date().toISOString()
        });
      }

      product = await Product.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
          new: true,
          runValidators: true,
        }
      ).populate('createdBy', 'username email');

      res.json({
        success: true,
        message: 'Product updated successfully',
        data: { product },
        timestamp: new Date().toISOString()
      });
    } catch (error: any) {
      if (error.code === 11000) {
        const duplicateField = Object.keys(error.keyValue)[0];
        const duplicateValue = error.keyValue[duplicateField];
        
        return res.status(400).json({
          success: false,
          message: 'Duplicate entry detected',
          errors: [{
            field: duplicateField,
            message: `A product with ${duplicateField} "${duplicateValue}" already exists`,
            value: duplicateValue,
            location: 'body'
          }],
          timestamp: new Date().toISOString()
        });
      }
      
      // Handle mongoose validation errors
      if (error.name === 'ValidationError') {
        const validationErrors = Object.values(error.errors).map((err: any) => ({
          field: err.path,
          message: err.message,
          value: err.value,
          location: 'body'
        }));
        
        return res.status(400).json({
          success: false,
          message: 'Product validation failed',
          errors: validationErrors,
          timestamp: new Date().toISOString()
        });
      }
      
      next(error);
    }
  },
];

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private/Admin
export const deleteProduct = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
        timestamp: new Date().toISOString()
      });
    }

    // Check if user owns the product or is admin
    if (product.createdBy.toString() !== req.user?.id && req.user?.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this product',
        timestamp: new Date().toISOString()
      });
    }

    await Product.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Product deleted successfully',
      data: {},
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Search products
// @route   GET /api/products/search
// @access  Public
export const searchProducts = async (req: Request, res: Response, next: NextFunction) => {
  try {
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

    res.json({
      success: true,
      data: {
        products,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get product statistics
// @route   GET /api/products/stats/overview
// @access  Private/Admin
export const getProductStats = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const totalProducts = await Product.countDocuments();
    const productsWithOffers = await Product.countDocuments({
      'offers.isActive': true,
      'offers.validUntil': { $gt: new Date() }
    });
    const productsOnSale = await Product.countDocuments({
      discountPrice: { $exists: true, $lt: '$price' }
    });
    
    const recentProducts = await Product.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('createdBy', 'username');

    res.json({
      success: true,
      data: {
        totalProducts,
        productsWithOffers,
        productsOnSale,
        recentProducts
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Bulk update products
// @route   PATCH /api/products/bulk
// @access  Private/Admin
export const bulkUpdateProducts = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { productIds, updateData } = req.body;

    if (!productIds || !Array.isArray(productIds) || productIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Product IDs are required and must be a non-empty array',
        errors: [{
          field: 'productIds',
          message: 'Product IDs are required and must be a non-empty array',
          value: productIds,
          location: 'body'
        }],
        timestamp: new Date().toISOString()
      });
    }

    if (!updateData || Object.keys(updateData).length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Update data is required',
        errors: [{
          field: 'updateData',
          message: 'Update data is required and cannot be empty',
          value: updateData,
          location: 'body'
        }],
        timestamp: new Date().toISOString()
      });
    }

    const result = await Product.updateMany(
      { _id: { $in: productIds }, createdBy: req.user?.id },
      updateData,
      { runValidators: true }
    );

    res.json({
      success: true,
      message: `${result.modifiedCount} products updated successfully`,
      data: { 
        modifiedCount: result.modifiedCount,
        matchedCount: result.matchedCount
      },
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map((err: any) => ({
        field: err.path,
        message: err.message,
        value: err.value,
        location: 'body'
      }));
      
      return res.status(400).json({
        success: false,
        message: 'Bulk update validation failed',
        errors: validationErrors,
        timestamp: new Date().toISOString()
      });
    }
    
    next(error);
  }
};